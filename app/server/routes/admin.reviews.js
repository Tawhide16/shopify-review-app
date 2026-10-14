import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

/**
 * GET /api/admin/reviews
 * Merchant list of reviews with filter, search, sort, and status counters.
 */
router.get('/', async (req, res) => {
  try {
    const {
      shop = 'quick-start-store.myshopify.com',
      status, // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
      rating,
      productId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const whereClause = { shop };

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (rating && rating !== 'all') {
      whereClause.rating = parseInt(rating, 10);
    }

    if (productId && productId !== 'all') {
      whereClause.productId = productId;
    }

    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { customerName: { contains: q } },
        { customerEmail: { contains: q } },
        { title: { contains: q } },
        { body: { contains: q } },
        { productTitle: { contains: q } }
      ];
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder }
    });

    // Compute status counts for the merchant badge tabs
    const allReviews = await prisma.review.findMany({
      where: { shop },
      select: { rating: true, status: true, verified: true, createdAt: true }
    });

    const counts = {
      all: allReviews.length,
      pending: allReviews.filter(r => r.status === 'PENDING').length,
      approved: allReviews.filter(r => r.status === 'APPROVED').length,
      rejected: allReviews.filter(r => r.status === 'REJECTED').length
    };

    // Rating stats
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    const approvedOnly = allReviews.filter(r => r.status === 'APPROVED');
    approvedOnly.forEach(r => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
      sum += r.rating;
    });

    const totalApproved = approvedOnly.length;
    const averageRating = totalApproved > 0 ? Number((sum / totalApproved).toFixed(1)) : 5.0;

    // Verified reviews count
    const verifiedCount = allReviews.filter(r => r.verified).length;

    // Reviews this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const reviewsThisMonth = allReviews.filter(r => new Date(r.createdAt) >= startOfMonth).length;

    res.json({
      reviews,
      stats: {
        totalReviews: counts.all,
        pendingReviews: counts.pending,
        approvedReviews: counts.approved,
        rejectedReviews: counts.rejected,
        averageRating,
        verifiedCount,
        verifiedPercentage: counts.all > 0 ? Math.round((verifiedCount / counts.all) * 100) : 0,
        reviewsThisMonth,
        breakdown
      }
    });

  } catch (error) {
    console.error('Error in admin reviews GET:', error);
    res.status(500).json({ error: 'Failed to fetch admin reviews' });
  }
});

/**
 * PATCH /api/admin/reviews/:id/status
 * Moderate review status: 'APPROVED', 'REJECTED', or 'PENDING'
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, review: updated });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

/**
 * POST /api/admin/reviews/:id/reply
 * Add or update merchant reply to a customer review
 */
router.post('/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        merchantReply: reply ? reply.trim() : null,
        merchantRepliedAt: reply ? new Date() : null
      }
    });

    res.json({ success: true, review: updated });
  } catch (error) {
    console.error('Error updating merchant reply:', error);
    res.status(500).json({ error: 'Failed to save merchant reply' });
  }
});

/**
 * PUT /api/admin/reviews/:id
 * Merchant edit review content
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, rating, customerName } = req.body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        title: title?.trim(),
        body: body?.trim(),
        rating: rating ? parseInt(rating, 10) : undefined,
        customerName: customerName?.trim()
      }
    });

    res.json({ success: true, review: updated });
  } catch (error) {
    console.error('Error editing review:', error);
    res.status(500).json({ error: 'Failed to update review details' });
  }
});

/**
 * PATCH /api/admin/reviews/:id/toggle-verified
 * Toggle verified buyer state manually by merchant
 */
router.patch('/:id/toggle-verified', async (req, res) => {
  try {
    const { id } = req.params;
    const current = await prisma.review.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { verified: !current.verified }
    });

    res.json({ success: true, review: updated });
  } catch (error) {
    console.error('Error toggling verified state:', error);
    res.status(500).json({ error: 'Failed to toggle verified state' });
  }
});

/**
 * DELETE /api/admin/reviews/:id
 * Delete review permanently
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

/**
 * POST /api/admin/reviews/bulk
 * Perform bulk action on selected reviews: bulk-approve, bulk-reject, bulk-delete
 */
router.post('/bulk', async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No review IDs provided' });
    }

    if (action === 'APPROVE') {
      await prisma.review.updateMany({
        where: { id: { in: ids } },
        data: { status: 'APPROVED' }
      });
    } else if (action === 'REJECT') {
      await prisma.review.updateMany({
        where: { id: { in: ids } },
        data: { status: 'REJECTED' }
      });
    } else if (action === 'DELETE') {
      await prisma.review.deleteMany({
        where: { id: { in: ids } }
      });
    } else {
      return res.status(400).json({ error: 'Invalid bulk action' });
    }

    res.json({ success: true, count: ids.length, action });
  } catch (error) {
    console.error('Error performing bulk review action:', error);
    res.status(500).json({ error: 'Failed to process bulk action' });
  }
});

export default router;
