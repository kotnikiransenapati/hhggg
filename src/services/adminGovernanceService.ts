import { AuditLogEntry } from '../types';

export interface KillSwitchFlags {
  maintenanceMode: boolean;
  blockNewOrders: boolean;
  disableCodPayments: boolean;
  bypassColdChainStrictQA: boolean;
  pauseWholesaleRegistrations: boolean;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '10 mins ago',
    actorRole: 'Super Admin',
    actorEmail: 'k***n@farmdirect.internal',
    action: 'UPDATE_ESCROW_POLICY',
    targetEntity: 'EscrowSettings',
    entityId: 'escrow-nashik-04',
    diffSummary: 'Changed cold-chain QA inspection threshold from 4.2°C to 4.0°C maximum',
    piiMasked: true,
  },
  {
    id: 'aud-002',
    timestamp: '25 mins ago',
    actorRole: 'Ops Manager',
    actorEmail: 'o***s@farmdirect.internal',
    action: 'APPROVE_WHOLESALER_KYC',
    targetEntity: 'WholesalerKyc',
    entityId: 'WS-8841',
    diffSummary: 'Approved Taj Palace HORECA Line of Credit: ₹2,50,000 allocated',
    piiMasked: true,
  },
  {
    id: 'aud-003',
    timestamp: '1 hour ago',
    actorRole: 'Cold-Chain Lead',
    actorEmail: 'r***e@farmdirect.internal',
    action: 'DISPATCH_REEFER_VAN',
    targetEntity: 'FleetTelemetry',
    entityId: 'VAN-MH-15-EG-4402',
    diffSummary: 'Assigned route Bandra West Hub; Solar chiller pre-cooled to 3.1°C',
    piiMasked: true,
  },
  {
    id: 'aud-004',
    timestamp: '2 hours ago',
    actorRole: 'System Automation',
    actorEmail: 's***m@farmdirect.internal',
    action: 'RECONCILE_RAZORPAY_SETTLEMENT',
    targetEntity: 'RazorpayPayment',
    entityId: 'pay_TiH6FiilUKVmSL',
    diffSummary: 'Verified HMAC-SHA256 signature; escrow status locked for Farmer Ramesh Patel',
    piiMasked: true,
  },
];

class AdminGovernanceService {
  private auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
  private killSwitches: KillSwitchFlags = {
    maintenanceMode: false,
    blockNewOrders: false,
    disableCodPayments: false,
    bypassColdChainStrictQA: false,
    pauseWholesaleRegistrations: false,
  };

  getAuditLogs(query?: string): AuditLogEntry[] {
    if (!query || query.trim() === '') return this.auditLogs;
    const q = query.toLowerCase();
    return this.auditLogs.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.actorRole.toLowerCase().includes(q) ||
        log.targetEntity.toLowerCase().includes(q) ||
        log.diffSummary.toLowerCase().includes(q)
    );
  }

  logAction(
    action: string,
    targetEntity: string,
    entityId: string,
    diffSummary: string,
    actorRole: string = 'Super Admin'
  ) {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      actorRole,
      actorEmail: 'k***n@farmdirect.internal',
      action,
      targetEntity,
      entityId,
      diffSummary,
      piiMasked: true,
    };
    this.auditLogs = [newEntry, ...this.auditLogs];
  }

  getKillSwitches(): KillSwitchFlags {
    return { ...this.killSwitches };
  }

  toggleKillSwitch(key: keyof KillSwitchFlags, state: boolean): KillSwitchFlags {
    this.killSwitches[key] = state;
    this.logAction(
      'TOGGLE_EMERGENCY_SWITCH',
      'SystemGovernance',
      key,
      `Toggled flag ${key} to ${state ? 'ENABLED' : 'DISABLED'}`
    );
    return { ...this.killSwitches };
  }

  /**
   * Automated Nightly Maintenance Simulation
   */
  runNightlyMaintenance(): {
    forecastItemsProcessed: number;
    expiredCachesEvictedKb: number;
    alertsDispatched: number;
    timestamp: string;
  } {
    const result = {
      forecastItemsProcessed: 48,
      expiredCachesEvictedKb: 1420,
      alertsDispatched: 12,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    this.logAction(
      'NIGHTLY_MAINTENANCE_RUN',
      'CronAutomation',
      'CRON-0200-IST',
      `Processed 48 crop harvest forecasts; evicted 1,420 KB cache; dispatched 12 grower reminders`
    );

    return result;
  }
}

export const adminGovernanceService = new AdminGovernanceService();
