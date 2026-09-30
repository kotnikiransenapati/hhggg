import { Router } from 'express';
import { telemetryController } from '../controllers/telemetryController';

const router = Router();

router.get('/fleet', telemetryController.getFleet);
router.get('/fleet/:vanNumber', telemetryController.getUnit);
router.post('/fleet/:vanNumber/temp', telemetryController.updateTemp);

export default router;
