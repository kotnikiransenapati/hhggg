import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/payment-webhook', paymentController.handleWebhook);
router.post('/process-refund', paymentController.processRefundAndCreditNote);

export default router;
