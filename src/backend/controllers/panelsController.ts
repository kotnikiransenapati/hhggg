import { Request, Response } from 'express';
import { coldChainService } from '../services/coldChainService';

export const panelsController = {
  getFarmerMetrics(req: Request, res: Response) {
    res.json({
      success: true,
      data: {
        totalAcreageCultivated: 142,
        activeHarvestBatches: 8,
        escrowSettlementRate: '94.1%',
        payoutsPendingSettlement: 39600,
        payoutsClearedThisMonth: 284500,
        soilAverageHumus: '4.8%',
        waterTableDepthMeters: 14.2,
      },
    });
  },

  getAdminMetrics(req: Request, res: Response) {
    const fleet = coldChainService.getFleetStatus();
    res.json({
      success: true,
      data: {
        totalReefersActive: fleet.length,
        optimalReefers: fleet.filter((f) => f.status === 'optimal').length,
        warningReefers: fleet.filter((f) => f.status === 'warning').length,
        escrowVaultLocked: 148200,
        escrowVaultReleased: 1984200,
        totalCooperativesJoined: 24,
        avgChemicalResiduePpm: 0.0,
      },
    });
  },

  getSupportTickets(req: Request, res: Response) {
    res.json({
      success: true,
      openTicketsCount: 2,
      resolvedToday: 14,
      avgResolutionMinutes: 4.5,
      escrowRefundsTriggered: 0,
    });
  },
};
