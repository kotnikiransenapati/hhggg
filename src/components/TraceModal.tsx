import React from 'react';
import { BATCH_DATA } from '../data/mockData';

interface TraceModalProps {
  batchId: string | null;
  onClose: () => void;
}

export const TraceModal: React.FC<TraceModalProps> = ({ batchId, onClose }) => {
  if (!batchId) return null;

  const trace = BATCH_DATA[batchId] || BATCH_DATA['#NSK-8821'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-space-lg bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
              {trace.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  Immutable Blockchain Lot
                </span>
                <span className="font-label-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold">
                  {trace.coldChainTemp}
                </span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mt-1">{trace.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg overflow-y-auto space-y-space-lg">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            <div className="bg-surface-container-low p-space-sm rounded-xl">
              <span className="font-label-sm text-outline block">Batch ID</span>
              <span className="font-headline-sm text-primary font-bold">{trace.batchId}</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-xl">
              <span className="font-label-sm text-outline block">Consignment Vol</span>
              <span className="font-headline-sm text-on-surface font-bold">{trace.consignmentVol}</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-xl">
              <span className="font-label-sm text-outline block">Chemical Residue</span>
              <span className="font-headline-sm text-primary font-bold">0.00 ppm</span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-xl">
              <span className="font-label-sm text-outline block">Escrow Trust</span>
              <span className="font-headline-sm text-secondary font-bold">Locked</span>
            </div>
          </div>

          {/* Lab Test Verified Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[28px]">verified</span>
              <div>
                <h4 className="font-label-lg font-bold text-on-surface">NPOP &amp; SGS India Lab Certificate #SGS-2026-9912</h4>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Zero organophosphates, heavy metals &lt;0.001 mg/kg, Brix index 6.4 (High Natural Fructose).
                </p>
              </div>
            </div>
            <button
              onClick={() => alert(`Downloading verified certificate for lot ${trace.batchId}...`)}
              className="px-space-md py-1.5 bg-primary text-on-primary font-label-sm rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              PDF Report
            </button>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-3">
            <h4 className="font-label-lg font-bold text-on-surface uppercase tracking-wider text-xs">
              Immutable Crop Journey From Soil to Doorstep
            </h4>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/60">
              {trace.stages.map((stage, idx) => (
                <div key={idx} className="relative flex items-start gap-space-md group">
                  <div
                    className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm ${
                      stage.isColdChain
                        ? 'bg-secondary text-on-secondary animate-pulse'
                        : 'bg-primary text-on-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{stage.icon}</span>
                  </div>
                  <div className="flex-1 bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-label-sm text-outline font-semibold uppercase text-[10px]">
                        Stage {stage.stageNumber} • {stage.category}
                      </span>
                      <h5 className="font-label-lg font-bold text-on-surface">{stage.title}</h5>
                      <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">{stage.description}</p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="font-label-sm bg-surface-container-lowest px-2 py-1 rounded text-on-surface font-semibold shadow-xs">
                        {stage.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <span className="font-label-sm text-outline text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
            Cryptographically sealed by FarmDirect Escrow Mesh
          </span>
          <button
            onClick={onClose}
            className="px-space-lg py-2 bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-on-primary-container transition-colors cursor-pointer"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
