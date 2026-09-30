import React, { useState } from 'react';
import { adminGovernanceService, KillSwitchFlags } from '../../services/adminGovernanceService';

interface EmergencyKillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyKillSwitchModal: React.FC<EmergencyKillSwitchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [flags, setFlags] = useState<KillSwitchFlags>(adminGovernanceService.getKillSwitches());

  if (!isOpen) return null;

  const toggle = (key: keyof KillSwitchFlags) => {
    const updated = adminGovernanceService.toggleKillSwitch(key, !flags[key]);
    setFlags({ ...updated });
  };

  const switchConfig: Array<{
    key: keyof KillSwitchFlags;
    title: string;
    desc: string;
    critical: boolean;
  }> = [
    {
      key: 'maintenanceMode',
      title: 'Global Platform Maintenance Mode',
      desc: 'Halts all consumer, farmer, and wholesale sessions with active maintenance banner.',
      critical: true,
    },
    {
      key: 'blockNewOrders',
      title: 'Block New Escrow Order Placement',
      desc: 'Prevents new orders while allowing pending transit batches to complete inspection.',
      critical: true,
    },
    {
      key: 'disableCodPayments',
      title: 'Disable Cash-on-Delivery (COD)',
      desc: 'Forces 100% digital payment rails (UPI / Razorpay / Cards) to eliminate courier handling risk.',
      critical: false,
    },
    {
      key: 'bypassColdChainStrictQA',
      title: 'Emergency Cold-Chain Temp Tolerance Bypass',
      desc: 'Extends temperature tolerance from 4.0°C to 5.5°C during extreme regional heatwaves.',
      critical: true,
    },
    {
      key: 'pauseWholesaleRegistrations',
      title: 'Pause New Wholesaler KYC Applications',
      desc: 'Temporarily closes B2B institutional onboarding queue for credit capacity rebalancing.',
      critical: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <h3 className="text-xl font-bold text-slate-900">Emergency Kill Switches &amp; Overrides</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Super Admin authority switches. Changes take effect instantaneously across all cluster nodes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {switchConfig.map((item) => {
            const isEnabled = flags[item.key];
            return (
              <div
                key={item.key}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isEnabled
                    ? 'bg-red-50 border-red-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    {item.critical && (
                      <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition-all ${
                    isEnabled
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {isEnabled ? 'ACTIVE (TRIPPED)' : 'INACTIVE'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Done &amp; Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
