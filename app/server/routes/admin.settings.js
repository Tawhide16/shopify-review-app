import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

/**
 * GET /api/admin/settings
 * Fetch merchant configuration settings
 */
router.get('/', async (req, res) => {
  try {
    const { shop = 'quick-start-store.myshopify.com' } = req.query;

    let settings = await prisma.settings.findUnique({
      where: { shop }
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          shop,
          enableReviews: true,
          requireApproval: true,
          autoApproveMinStars: 5,
          showVerifiedBuyer: true,
          showReviewImages: true,
          allowCustomerName: true,
          allowCustomerEmail: true,
          starColor: '#F59E0B',
          starSize: 'medium',
          reviewLayout: 'list',
          reviewsPerPage: 5,
          notifyOnNewReview: true,
          merchantEmail: 'admin@quick-start-store.myshopify.com'
        }
      });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * PUT /api/admin/settings
 * Update merchant configuration settings
 */
router.put('/', async (req, res) => {
  try {
    const { shop = 'quick-start-store.myshopify.com', ...updates } = req.body;

    const allowedFields = [
      'enableReviews',
      'requireApproval',
      'autoApproveMinStars',
      'showVerifiedBuyer',
      'showReviewImages',
      'allowCustomerName',
      'allowCustomerEmail',
      'starColor',
      'starSize',
      'reviewLayout',
      'reviewsPerPage',
      'notifyOnNewReview',
      'merchantEmail'
    ];

    const data = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        data[key] = updates[key];
      }
    }

    const updatedSettings = await prisma.settings.upsert({
      where: { shop },
      update: data,
      create: {
        shop,
        ...data
      }
    });

    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

/**
 * GET /api/admin/products
 * Fetch products list for preview and filtering
 */
router.get('/products', async (req, res) => {
  try {
    const { shop = 'quick-start-store.myshopify.com' } = req.query;
    const products = await prisma.product.findMany({
      where: { shop },
      orderBy: { createdAt: 'asc' }
    });
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;
