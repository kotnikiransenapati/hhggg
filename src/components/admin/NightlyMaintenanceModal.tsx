import React, { useState } from 'react';
import { adminGovernanceService } from '../../services/adminGovernanceService';

interface NightlyMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NightlyMaintenanceModal: React.FC<NightlyMaintenanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<{
    forecastItemsProcessed: number;
    expiredCachesEvictedKb: number;
    alertsDispatched: number;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = adminGovernanceService.runNightlyMaintenance();
      setResult(res);
      setIsRunning(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 text-center">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">auto_mode</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Automated Nightly Maintenance Job
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Orchestrates harvest supply forecasting, Redis cache eviction, and smallholder dispatch reminders.
          </p>
        </div>

        {result ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left text-xs space-y-2 animate-fadeIn">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span>✓ Maintenance Pipeline Succeeded</span>
              <span className="text-slate-400 font-normal">({result.timestamp})</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 bg-white rounded-lg border border-emerald-100">
                <span className="font-bold text-slate-900 block">{result.forecastItemsProcessed}</span>
                <span className="text-[10px] text-slate-500">Crops Forecasted</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-100">
                <span className="font-bold text-slate-900 block">{result.expiredCachesEvictedKb} KB</span>
                <span className="text-[10px] text-slate-500">Caches Evicted</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-100">
                <span className="font-bold text-slate-900 block">{result.alertsDispatched}</span>
                <span className="text-[10px] text-slate-500">Alerts Sent</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Cron Schedule: <strong>02:00 AM IST Nightly</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Predictive Harvest Demand Modeling: <strong>Active</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Solar Reefer Fleet Log Rotation: <strong>Active</strong></span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            disabled={isRunning}
            onClick={handleRun}
            className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <span>Trigger Manual Run Now</span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
