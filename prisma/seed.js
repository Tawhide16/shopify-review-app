import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_SHOP = 'quick-start-store.myshopify.com';

const products = [
  {
    shopifyId: 'gid://shopify/Product/1',
    title: 'AeroGlide Ergonomic Wireless Mouse',
    handle: 'aeroglide-ergonomic-wireless-mouse',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    price: 79.99,
    description: 'Precision engineered ergonomic wireless mouse designed for all-day productivity and seamless multi-device switching.'
  },
  {
    shopifyId: 'gid://shopify/Product/2',
    title: 'StudioPro Active Noise Cancelling Headphones',
    handle: 'studiopro-anc-headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    price: 249.00,
    description: 'Studio-grade acoustics with hybrid active noise cancellation and 40-hour battery life.'
  },
  {
    shopifyId: 'gid://shopify/Product/3',
    title: 'Heritage Vegetable-Tanned Leather Backpack',
    handle: 'heritage-leather-backpack',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    price: 189.50,
    description: 'Handcrafted full-grain leather backpack with dedicated 16-inch laptop compartment and brass hardware.'
  },
  {
    shopifyId: 'gid://shopify/Product/4',
    title: 'Alpine Double-Wall Thermal Tumbler 24oz',
    handle: 'alpine-thermal-tumbler-24oz',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    price: 34.00,
    description: 'Vacuum insulated stainless steel tumbler keeping drinks cold for 24 hours or hot for 12 hours.'
  }
];

const initialReviews = [
  {
    productId: 'gid://shopify/Product/1',
    productTitle: 'AeroGlide Ergonomic Wireless Mouse',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@example.com',
    rating: 5,
    title: 'Wrist pain completely gone in 3 days!',
    body: 'As a software engineer typing 10 hours a day, my wrist was constantly aching. This mouse changed everything. The angle is natural, the scroll wheel is buttery smooth, and battery life is unbelievable.',
    status: 'APPROVED',
    verified: true,
    helpfulCount: 14,
    merchantReply: 'Thank you so much Marcus! Ergonomic wellness was our primary focus when designing the AeroGlide.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6)
  },
  {
    productId: 'gid://shopify/Product/1',
    productTitle: 'AeroGlide Ergonomic Wireless Mouse',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@techcorp.io',
    rating: 5,
    title: 'Flawless Bluetooth pairing across Mac & PC',
    body: 'Instant connection with no dongles needed. The optical sensor tracks smoothly on wood and glass desks alike.',
    status: 'APPROVED',
    verified: true,
    helpfulCount: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
  },
  {
    productId: 'gid://shopify/Product/1',
    productTitle: 'AeroGlide Ergonomic Wireless Mouse',
    customerName: 'Devon Miller',
    customerEmail: 'devon.miller@designhub.co',
    rating: 4,
    title: 'Great ergonomics, takes a day to get used to',
    body: 'If you have never used an angled vertical mouse before, muscle memory takes roughly 24 hours to adapt. After that, you can never go back to flat mice.',
    status: 'APPROVED',
    verified: true,
    helpfulCount: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    productId: 'gid://shopify/Product/1',
    productTitle: 'AeroGlide Ergonomic Wireless Mouse',
    customerName: 'Chloe Bennett',
    customerEmail: 'chloe.b@creativemind.org',
    rating: 5,
    title: 'Premium build quality & whisper-quiet clicks',
    body: 'Working in open office spaces means click sound matters. The silent switches on this are incredible. 10/10 purchase!',
    status: 'PENDING',
    verified: true,
    helpfulCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45 mins ago
  },
  {
    productId: 'gid://shopify/Product/2',
    productTitle: 'StudioPro Active Noise Cancelling Headphones',
    customerName: 'Liam O\'Connor',
    customerEmail: 'liam.audio@musicmakers.com',
    rating: 5,
    title: 'Silenced the airplane jet engine completely',
    body: 'Traveled transatlantic with these last week. The noise cancellation is equal to, if not better than, high-end competitors. Battery still had 60% after 14 hours of playback.',
    status: 'APPROVED',
    verified: true,
    helpfulCount: 22,
    merchantReply: 'Delighted to hear this Liam! Have safe travels and enjoy the music.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
  },
  {
    productId: 'gid://shopify/Product/2',
    productTitle: 'StudioPro Active Noise Cancelling Headphones',
    customerName: 'Sophia Lin',
    customerEmail: 'sophia.lin@gmail.com',
    rating: 4,
    title: 'Spectacular soundstage and punchy bass',
    body: 'The companion equalizer makes jazz, classical, and hip-hop shine. Ear cushions are soft memory foam with zero fatigue.',
    status: 'PENDING',
    verified: true,
    helpfulCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    productId: 'gid://shopify/Product/3',
    productTitle: 'Heritage Vegetable-Tanned Leather Backpack',
    customerName: 'Julian Sterling',
    customerEmail: 'julian.sterling@arch.edu',
    rating: 5,
    title: 'Heirloom quality leather that smells authentic',
    body: 'You can immediately tell this is genuine vegetable-tanned leather. The patina developing after two months is gorgeous. Fits my 16" MacBook Pro snugly.',
    status: 'APPROVED',
    verified: true,
    helpfulCount: 31,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18)
  },
  {
    productId: 'gid://shopify/Product/3',
    productTitle: 'Heritage Vegetable-Tanned Leather Backpack',
    customerName: 'Spam Bot 99',
    customerEmail: 'cheapcrypto@spambotmail.xyz',
    rating: 1,
    title: 'Visit our scam site for free tokens',
    body: 'Crypto airdrop click here: http://fake-scam-link.ru fast bonus free cash!',
    status: 'REJECTED',
    verified: false,
    helpfulCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  }
];

const sampleOrders = [
  { orderNumber: '#1001', customerEmail: 'marcus.v@example.com', productId: 'gid://shopify/Product/1' },
  { orderNumber: '#1002', customerEmail: 'elena.rostova@techcorp.io', productId: 'gid://shopify/Product/1' },
  { orderNumber: '#1003', customerEmail: 'devon.miller@designhub.co', productId: 'gid://shopify/Product/1' },
  { orderNumber: '#1004', customerEmail: 'chloe.b@creativemind.org', productId: 'gid://shopify/Product/1' },
  { orderNumber: '#1005', customerEmail: 'liam.audio@musicmakers.com', productId: 'gid://shopify/Product/2' },
  { orderNumber: '#1006', customerEmail: 'sophia.lin@gmail.com', productId: 'gid://shopify/Product/2' },
  { orderNumber: '#1007', customerEmail: 'julian.sterling@arch.edu', productId: 'gid://shopify/Product/3' }
];

async function seed() {
  console.log('Seeding ReviewFlow database...');

  // 1. Create or upsert Shop
  await prisma.shop.upsert({
    where: { shopDomain: DEMO_SHOP },
    update: {},
    create: {
      shopDomain: DEMO_SHOP,
      plan: 'Pro',
      isInstalled: true
    }
  });

  // 2. Create or upsert Settings
  await prisma.settings.upsert({
    where: { shop: DEMO_SHOP },
    update: {},
    create: {
      shop: DEMO_SHOP,
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

  // 3. Clear and insert Products
  await prisma.product.deleteMany({ where: { shop: DEMO_SHOP } });
  for (const prod of products) {
    await prisma.product.create({
      data: {
        shop: DEMO_SHOP,
        shopifyId: prod.shopifyId,
        title: prod.title,
        handle: prod.handle,
        imageUrl: prod.imageUrl,
        price: prod.price,
        description: prod.description
      }
    });
  }

  // 4. Insert sample Orders for Verified Buyer verification
  await prisma.orderRecord.deleteMany({ where: { shop: DEMO_SHOP } });
  for (const ord of sampleOrders) {
    await prisma.orderRecord.create({
      data: {
        shop: DEMO_SHOP,
        orderNumber: ord.orderNumber,
        customerEmail: ord.customerEmail.toLowerCase(),
        productId: ord.productId
      }
    });
  }

  // 5. Insert initial reviews
  await prisma.review.deleteMany({ where: { shop: DEMO_SHOP } });
  for (const rev of initialReviews) {
    await prisma.review.create({
      data: {
        shop: DEMO_SHOP,
        ...rev
      }
    });
  }

  console.log('✅ Seed completed successfully! Seeded products, settings, orders, and reviews.');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
