import { Router } from 'express';
import { prisma } from '../db.js';
import { validateAndFilterReview } from '../antiSpam.js';

const router = Router();

/**
 * GET /api/reviews
 * Storefront endpoint to fetch approved reviews and rating statistics for a product.
 */
router.get('/', async (req, res) => {
  try {
    const { productId, shop = 'quick-start-store.myshopify.com' } = req.query;

    if (!productId) {
      return res.status(400).json({ error: 'productId query parameter is required' });
    }

    // Fetch approved reviews for this product
    const reviews = await prisma.review.findMany({
      where: {
        shop,
        productId,
        status: 'APPROVED'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate rating breakdown and average
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
        sum += r.rating;
      }
    });

    const total = reviews.length;
    const average = total > 0 ? Number((sum / total).toFixed(1)) : 5.0;

    res.json({
      reviews,
      stats: {
        total,
        average,
        breakdown
      }
    });
  } catch (error) {
    console.error('Error fetching storefront reviews:', error);
    res.status(500).json({ error: 'Internal server error fetching reviews' });
  }
});

/**
 * POST /api/reviews
 * Customer review submission from storefront theme block.
 */
router.post('/', async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const { productId, productTitle, shop, customerName, customerEmail, rating, title, body } = req.body;

    // Security, profanity, email & duplicate validation
    const validation = await validateAndFilterReview({
      productId,
      shop: shop || 'quick-start-store.myshopify.com',
      customerName,
      customerEmail,
      rating,
      title,
      body,
      ip: clientIp
    });

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { cleanData } = validation;

    // Check merchant settings to decide PENDING vs auto-approve
    let initialStatus = 'PENDING';
    const settings = await prisma.settings.findUnique({
      where: { shop: cleanData.shop }
    });

    if (settings) {
      if (!settings.enableReviews) {
        return res.status(403).json({ error: 'Review submissions are currently disabled by the store owner.' });
      }

      if (!settings.requireApproval) {
        initialStatus = 'APPROVED';
      } else if (cleanData.rating >= (settings.autoApproveMinStars || 5)) {
        // Auto-approve if rating meets or exceeds autoApprove threshold
        initialStatus = 'APPROVED';
      }
    }

    // Lookup product image if available
    let productImage = null;
    const productRecord = await prisma.product.findFirst({
      where: { shop: cleanData.shop, shopifyId: cleanData.productId }
    });
    if (productRecord) {
      productImage = productRecord.imageUrl;
    }

    // Save review to database
    const newReview = await prisma.review.create({
      data: {
        shop: cleanData.shop,
        productId: cleanData.productId,
        productTitle: productTitle || productRecord?.title || 'Product',
        productImage,
        customerName: cleanData.customerName,
        customerEmail: cleanData.customerEmail,
        rating: cleanData.rating,
        title: cleanData.title,
        body: cleanData.body,
        status: initialStatus,
        verified: cleanData.verified
      }
    });

    res.status(201).json({
      success: true,
      message: initialStatus === 'APPROVED'
        ? 'Thank you! Your verified review has been published directly.'
        : 'Thank you! Your review has been received and is pending merchant moderation.',
      review: newReview
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal error submitting review' });
  }
});

/**
 * POST /api/reviews/helpful
 * Vote review as helpful
 */
router.post('/helpful', async (req, res) => {
  try {
    const { reviewId } = req.body;
    if (!reviewId) {
      return res.status(400).json({ error: 'reviewId is required' });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: { increment: 1 } }
    });

    res.json({ success: true, helpfulCount: updated.helpfulCount });
  } catch (error) {
    console.error('Error updating helpful count:', error);
    res.status(500).json({ error: 'Failed to record helpful vote' });
  }
});

export default router;
