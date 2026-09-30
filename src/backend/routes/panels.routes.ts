import { Router } from 'express';
import { panelsController } from '../controllers/panelsController';

const router = Router();

router.get('/farmer-metrics', panelsController.getFarmerMetrics);
router.get('/admin-metrics', panelsController.getAdminMetrics);
router.get('/support-metrics', panelsController.getSupportTickets);

export default router;
