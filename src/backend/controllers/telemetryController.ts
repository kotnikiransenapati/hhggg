import { Request, Response } from 'express';
import { coldChainService } from '../services/coldChainService';

export const telemetryController = {
  getFleet(req: Request, res: Response) {
    try {
      const fleet = coldChainService.getFleetStatus();
      res.json({ success: true, count: fleet.length, fleet });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getUnit(req: Request, res: Response) {
    try {
      const { vanNumber } = req.params;
      const unit = coldChainService.getUnitTelemetry(vanNumber);
      if (!unit) {
        return res.status(404).json({ success: false, error: 'Reefer unit not found' });
      }
      res.json({ success: true, unit });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  updateTemp(req: Request, res: Response) {
    try {
      const { vanNumber } = req.params;
      const { temperature } = req.body;
      const updated = coldChainService.updateTemperature(vanNumber, Number(temperature));
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Reefer unit not found' });
      }
      res.json({ success: true, unit: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
