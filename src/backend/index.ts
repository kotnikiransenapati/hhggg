import { Router } from 'express';
import telemetryRoutes from './routes/telemetry.routes';
import panelsRoutes from './routes/panels.routes';
import paymentRoutes from './routes/payment.routes';
import { paymentController } from './controllers/paymentController';

const backendRouter = Router();

// Razorpay Direct Endpoints: /api/create-order and /api/verify-payment
backendRouter.post('/create-order', paymentController.createOrder);
backendRouter.post('/verify-payment', paymentController.verifyPayment);

// Modular Routes
backendRouter.use('/payment', paymentRoutes);
backendRouter.use('/telemetry', telemetryRoutes);
backendRouter.use('/panels', panelsRoutes);

export { backendRouter, paymentController };
export * from './services/coldChainService';
