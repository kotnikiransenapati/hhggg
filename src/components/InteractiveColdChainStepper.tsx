import React, { useState } from 'react';
import { ActiveScreen } from '../types';

interface InteractiveColdChainStepperProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenTrace: (batchId: string) => void;
}

export const InteractiveColdChainStepper: React.FC<InteractiveColdChainStepperProps> = ({
  setActiveScreen,
  onOpenTrace,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      time: '05:00 AM',
      phase: 'HARVEST ON DEMAND',
      title: 'Dawn Picking at Field Blocks',
      description:
        'Orders close at 9:00 PM nightly. Smallholder growers harvest only what was ordered by consumers at first light, preventing field rotting and APMC mandi wastage.',
      metricLabel: 'Zero Warehouse Waste',
      metricVal: '0% Surplus Rotting',
      icon: 'agriculture',
      color: 'emerald',
      verification: 'PGS-India Organic Certified',
    },
    {
      id: 2,
      time: '06:30 AM',
      phase: 'PRE-COOLING & SEAL',
      title: 'Solar Chilling & Aerated Crates',
      description:
        'Within 45 minutes of cutting, field heat is extracted using solar-assisted hydro-cooling down to 3.2°C. Produce is sealed in aerated food-grade crates with BLE thermal sensors.',
      metricLabel: 'Field Heat Drop',
      metricVal: '32°C → 3.2°C in 45m',
      icon: 'ac_unit',
      color: 'teal',
      verification: 'IoT BLE Tag Cryptographic Seal',
    },
    {
      id: 3,
      time: '08:00 AM',
      phase: 'REFRIGERATED TRANSIT',
      title: 'Western Ghats Cold Corridor',
      description:
        'Refrigerated vans transit the Sahyadri Ghats into Mumbai under continuous IoT telematics. If temperature exceeds 4.5°C, secondary solar auxiliary compressors engage automatically.',
      metricLabel: 'Mean Cargo Temp',
      metricVal: '3.4°C ±0.3°C Constant',
      icon: 'local_shipping',
      color: 'blue',
      verification: 'Real-time GPS & Thermal Stream',
    },
    {
      id: 4,
      time: '11:30 AM',
      phase: 'DOORSTEP ESCROW',
      title: 'Inspect Quality Before Release',
      description:
        'Delivery agent presents the sealed crate. You inspect freshness and crispness; when satisfied, 1-tap releases 94.1% directly to farmer accounts. Instant 100% refund if not satisfied.',
      metricLabel: 'Direct Settlement',
      metricVal: '94.1% to Grower Bank',
      icon: 'shield',
      color: 'emerald',
      verification: 'Instant Doorstep Escrow Release',
    },
  ];

  const current = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          The Anti-Intermediary Farm Standard
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          From sunrise dew to your kitchen in 14 hours.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Traditional commercial supply chains take 6 to 9 days through wholesale auction mandis. 
          Click each phase to inspect our direct cold-chain journey.
        </p>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              activeStep === step.id
                ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold ${activeStep === step.id ? 'text-emerald-800' : 'text-slate-400'}`}>
                {step.time}
              </span>
              <span className={`material-symbols-outlined text-[20px] ${activeStep === step.id ? 'text-emerald-700' : 'text-slate-400'}`}>
                {step.icon}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Step 0{step.id}
              </span>
              <h3 className={`text-sm font-bold mt-0.5 ${activeStep === step.id ? 'text-slate-900' : 'text-slate-700'}`}>
                {step.phase}
              </h3>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  activeStep === step.id ? 'bg-emerald-600 w-full' : 'bg-transparent w-0'
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Detail Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">{current.icon}</span>
            <span>Step 0{current.id} • {current.time}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {current.title}
          </h3>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            {current.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{current.verification}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => onOpenTrace('#NSK-8821')}
              className="text-slate-600 hover:text-slate-900 underline font-medium cursor-pointer"
            >
              Verify with Batch Traceability
            </button>
          </div>
        </div>

        {/* Metric Spotlight on Right */}
        <div className="lg:col-span-4 rounded-xl bg-slate-900 text-white p-6 space-y-4 border border-slate-800">
          <div>
            <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-wider">
              {current.metricLabel}
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
              {current.metricVal}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Continuously logged on the decentralized farm ledger and verified by IoT tamper seals.
          </p>

          <button
            onClick={() => setActiveScreen('traceability')}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <span>Inspect Live Sensor Logs</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
