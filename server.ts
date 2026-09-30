import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { getAllOrders, createOrder, updateOrderEscrow, updateOrderRating } from './src/db/orders.ts';
import { getProduceItems, getFarmClusters, seedDefaultData } from './src/db/produce.ts';
import { backendRouter, paymentController } from './src/backend/index.ts';
import { geminiController } from './src/backend/controllers/geminiController.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Seed default items and clusters if PostgreSQL is configured
  if (process.env.SQL_HOST) {
    seedDefaultData().catch((err) => console.error('Initial DB seeding check error:', err));
  }

  // --- API Endpoints ---

  // Auth synchronization route
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@farmdirect.internal`;
      const { name, photoUrl } = req.body;

      const user = await getOrCreateUser(uid, email, name, photoUrl);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Error syncing auth user:', error);
      res.status(500).json({ error: 'Failed to sync user profile' });
    }
  });

  // Current authenticated user profile
  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await getUserByUid(req.user!.uid);
      res.json({ user });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  });

  // Produce catalog
  app.get('/api/produce', async (_req, res) => {
    try {
      const items = await getProduceItems();
      res.json(items);
    } catch (error: any) {
      console.error('Error fetching produce:', error);
      res.status(500).json({ error: 'Failed to fetch produce lots' });
    }
  });

  // Regional Farm Clusters
  app.get('/api/clusters', async (_req, res) => {
    try {
      const clusters = await getFarmClusters();
      res.json(clusters);
    } catch (error: any) {
      console.error('Error fetching clusters:', error);
      res.status(500).json({ error: 'Failed to fetch clusters' });
    }
  });

  // Orders list
  app.get('/api/orders', async (_req, res) => {
    try {
      const orders = await getAllOrders();
      res.json(orders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Create Order
  app.post('/api/orders', async (req, res) => {
    try {
      const newOrder = req.body;
      const saved = await createOrder(newOrder);
      res.status(201).json(saved);
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Release Escrow
  app.post('/api/orders/:id/release-escrow', async (req, res) => {
    try {
      const { id } = req.params;
      await updateOrderEscrow(id, 'Inspected & Released');
      res.json({ success: true, orderId: id, escrowStatus: 'Inspected & Released' });
    } catch (error: any) {
      console.error('Error releasing escrow:', error);
      res.status(500).json({ error: 'Failed to release escrow' });
    }
  });

  // Rate Order
  app.post('/api/orders/:id/rate', async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      await updateOrderRating(id, Number(rating), comment);
      res.json({ success: true, orderId: id, rating });
    } catch (error: any) {
      console.error('Error rating order:', error);
      res.status(500).json({ error: 'Failed to record rating' });
    }
  });

  // Razorpay Standard Checkout Endpoints
  app.post('/api/create-order', paymentController.createOrder);
  app.post('/api/verify-payment', paymentController.verifyPayment);
  app.post('/api/generate-test-signature', paymentController.generateTestSignature);

  // Mount modular backend router for cold-chain telemetry and role panels
  app.use('/api', backendRouter);

  // Gemini AI Endpoints
  app.post('/api/gemini/chat', geminiController.handleChat);
  app.post('/api/gemini/fast', geminiController.handleFast);
  app.post('/api/gemini/search', geminiController.handleSearchGrounding);
  app.post('/api/gemini/maps', geminiController.handleMapsGrounding);
  app.post('/api/gemini/deep-thinking', geminiController.handleDeepThinking);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = http.createServer(app);

  // Setup Live API WebSocket bridge for gemini-3.8-live
  geminiController.setupLiveWebSocket(server);

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
