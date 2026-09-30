import React from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenSpinWheel?: () => void;
  onOpenAuditTrail?: () => void;
  onOpenCustomer360?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveScreen,
  onOpenSpinWheel,
  onOpenAuditTrail,
  onOpenCustomer360,
}) => {
  return (
    <footer className="w-full bg-slate-50 mt-16 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* 3 Pillars / Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
          <div className="bg-white p-6 rounded-2xl flex items-start gap-4 shadow-xs border border-slate-200">
            <span className="material-symbols-outlined text-emerald-700 text-[32px] shrink-0">verified</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Certified Organic</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                PGS-India &amp; NPOP laboratory certified single-origin farmers directly traceable to farm GPS coordinates.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl flex items-start gap-4 shadow-xs border border-slate-200">
            <span className="material-symbols-outlined text-sky-700 text-[32px] shrink-0">ac_unit</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cold-Chain Dispatch</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Farm harvest to your door in solar-refrigerated vans under 18 hours preserving crispness &amp; live enzymes.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl flex items-start gap-4 shadow-xs border border-slate-200">
            <span className="material-symbols-outlined text-amber-700 text-[32px] shrink-0">shield</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">FSSAI &amp; Escrow Trust</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Funds held securely in RBI-regulated escrow and disbursed to farmer collectives only upon quality inspection.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-slate-200 text-xs">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Marketplace &amp; B2B</span>
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Seasonal Morning Harvests
            </button>
            <button
              onClick={() => setActiveScreen('wholesale')}
              className="text-emerald-700 font-bold hover:text-emerald-900 transition-colors text-left cursor-pointer flex items-center gap-1"
            >
              <span>🏢 Wholesale B2B Portal (HORECA)</span>
            </button>
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Heirloom Staples &amp; Grains
            </button>
            <button
              onClick={onOpenSpinWheel}
              className="text-amber-700 font-semibold hover:underline text-left cursor-pointer flex items-center gap-1"
            >
              <span>🎰 Spin-to-Win Harvest Wheel</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Traceability &amp; Tech</span>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Regional Producer Clusters
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Soil Health &amp; SGS Lab Reports
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              QR Code Lot Verification
            </button>
            <button
              onClick={onOpenCustomer360}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Customer 360 &amp; Loyalty Points
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Grower Community</span>
            <button
              onClick={() => setActiveScreen('community')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Farmer Diaries &amp; Audio Logs
            </button>
            <button
              onClick={() => setActiveScreen('community')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              Farm Visits &amp; Volunteering
            </button>
            <button
              onClick={() => setActiveScreen('farmer-panel')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              🚜 Smallholder Dispatch Desk
            </button>
            <button
              onClick={() => setActiveScreen('support-panel')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              🎧 Executive Support &amp; Arbitration
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Governance &amp; Portals</span>
            <button
              onClick={() => setActiveScreen('admin-panel')}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer font-semibold"
            >
              📊 Fleet Radar &amp; Escrow Console
            </button>
            <button
              onClick={onOpenAuditTrail}
              className="text-slate-600 hover:text-emerald-800 transition-colors text-left cursor-pointer"
            >
              🔐 Security Audit Trail &amp; Diffs
            </button>
            <span className="text-slate-400 font-mono text-[10px] pt-1">FSSAI Central Lic: 10020022011244</span>
            <span className="text-slate-400 text-[10px]">RBI Smart Escrow Compliant</span>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <button
            onClick={() => setActiveScreen('landing')}
            className="flex items-center gap-2 text-emerald-800 font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[22px]">eco</span>
            <span>FarmDirect Organics</span>
          </button>
          <p className="text-slate-500 text-center md:text-left text-xs">
            © 2026 FarmDirect Agritech India Pvt. Ltd. Direct farm dispatch honoring ethical grower prosperity.
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span>Pure Origin</span>
            <span>•</span>
            <span>Zero Middlemen</span>
            <span>•</span>
            <span>94.1% Direct Escrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
