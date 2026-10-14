import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import apiReviewsRouter from './routes/api.reviews.js';
import adminReviewsRouter from './routes/admin.reviews.js';
import adminSettingsRouter from './routes/admin.settings.js';
import webhooksRouter from './routes/webhooks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Serve static extension assets
  app.use('/extensions', express.static(path.join(rootDir, 'extensions')));

  // API Endpoints
  app.use('/api/reviews', apiReviewsRouter);
  app.use('/api/admin/reviews', adminReviewsRouter);
  app.use('/api/admin/settings', adminSettingsRouter);
  app.use('/api/webhooks', webhooksRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'ReviewFlow', timestamp: new Date() });
  });

  // Attach Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: rootDir
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    app.use(express.static(path.join(rootDir, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(rootDir, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 ReviewFlow Shopify App is running!`);
    console.log(`👉 Merchant Admin & Storefront Sandbox: http://localhost:${PORT}`);
    console.log(`📦 Theme Extension Assets: http://localhost:${PORT}/extensions/review-widget/assets/review-widget.js`);
    console.log(`==================================================\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start ReviewFlow server:', err);
  process.exit(1);
});
