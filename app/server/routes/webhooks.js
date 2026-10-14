import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

/**
 * POST /api/webhooks/app-uninstalled
 * Shopify mandatory webhook when a merchant uninstalls the app.
 */
router.post('/app-uninstalled', async (req, res) => {
  try {
    const shopDomain = req.headers['x-shopify-shop-domain'] || req.body.shop_domain;
    if (shopDomain) {
      await prisma.shop.updateMany({
        where: { shopDomain },
        data: { isInstalled: false, accessToken: null }
      });
      console.log(`[Webhook] App uninstalled for ${shopDomain}. Cleaned session credentials.`);
    }
    res.status(200).send('Webhook handled');
  } catch (error) {
    console.error('Error handling app-uninstalled webhook:', error);
    res.status(500).send('Error');
  }
});

/**
 * POST /api/webhooks/products-delete
 * Shopify webhook when a product is removed from the catalog.
 */
router.post('/products-delete', async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      const shopifyId = `gid://shopify/Product/${id}`;
      // Delete or archive product reviews
      await prisma.review.deleteMany({
        where: { productId: shopifyId }
      });
      await prisma.product.deleteMany({
        where: { shopifyId }
      });
      console.log(`[Webhook] Cleaned reviews for deleted product ${shopifyId}`);
    }
    res.status(200).send('Webhook handled');
  } catch (error) {
    console.error('Error handling products-delete webhook:', error);
    res.status(500).send('Error');
  }
});

/**
 * POST /api/webhooks/orders-create
 * Shopify webhook when a new order is placed, enabling Verified Buyer status for reviews.
 */
router.post('/orders-create', async (req, res) => {
  try {
    const shopDomain = req.headers['x-shopify-shop-domain'] || 'quick-start-store.myshopify.com';
    const { order_number, email, line_items } = req.body;

    if (email && Array.isArray(line_items)) {
      for (const item of line_items) {
        if (item.product_id) {
          const productId = `gid://shopify/Product/${item.product_id}`;
          await prisma.orderRecord.create({
            data: {
              shop: shopDomain,
              orderNumber: `#${order_number || Date.now()}`,
              customerEmail: email.toLowerCase().trim(),
              productId
            }
          });

          // Auto-verify any existing reviews by this customer for this product
          await prisma.review.updateMany({
            where: {
              shop: shopDomain,
              productId,
              customerEmail: email.toLowerCase().trim()
            },
            data: { verified: true }
          });
        }
      }
      console.log(`[Webhook] Indexed order for verified buyer qualification: ${email}`);
    }
    res.status(200).send('Webhook handled');
  } catch (error) {
    console.error('Error handling orders-create webhook:', error);
    res.status(500).send('Error');
  }
});

export default router;
