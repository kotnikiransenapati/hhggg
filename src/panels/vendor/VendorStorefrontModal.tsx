import React, { useState } from 'react';
import { VendorStorefront, ProduceItem } from '../../types';

interface VendorStorefrontModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorStorefront | null;
  produceItems: ProduceItem[];
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onOpenTrace: (batchId: string) => void;
}

export const VendorStorefrontModal: React.FC<VendorStorefrontModalProps> = ({
  isOpen,
  onClose,
  vendor,
  produceItems,
  onAddToCart,
  onOpenTrace,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sla-scorecard' | 'wallet'>('catalog');

  if (!isOpen || !vendor) return null;

  const vendorProduce = produceItems.filter(
    (p) => p.farmer.toLowerCase().includes('ramesh') || p.origin.toLowerCase().includes('nashik')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Banner with JSON-LD Structured SEO script */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0">
          <img
            src={vendor.bannerUrl}
            alt={vendor.collectiveName}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={vendor.avatarUrl}
                alt={vendor.leadAgronomist}
                className="w-16 h-16 rounded-2xl border-2 border-white object-cover shadow-lg"
              />
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{vendor.collectiveName}</h2>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Certified Origin Storefront
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Lead Agronomist: {vendor.leadAgronomist} · {vendor.region} (PIN: {vendor.pin})
                </p>
              </div>
            </div>

            <div className="hidden sm:flex gap-1.5 text-xs text-white">
              {vendor.certifications.map((c) => (
                <span key={c} className="bg-white/15 px-2 py-0.5 rounded-md font-mono text-[10px]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex gap-2 text-xs font-semibold">
          {[
            { id: 'catalog', label: 'Storefront Harvest Lots', icon: 'storefront' },
            { id: 'sla-scorecard', label: 'Vendor SLA & Quality Scorecard', icon: 'speed' },
            { id: 'wallet', label: 'Automated Escrow Wallet & Settlements', icon: 'account_balance_wallet' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-3.5 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                activeTab === t.id
                  ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                "{vendor.bioStory}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vendorProduce.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3.5 items-center justify-between"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{p.name}</h4>
                      <span className="text-[11px] text-slate-500 block">
                        ₹{p.price} / {p.unit} · {p.growerSharePercent}% direct
                      </span>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => onAddToCart(p, 1)}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                        >
                          + Basket
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTrace(p.batchId)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium text-[11px] rounded-lg border border-slate-200 cursor-pointer"
                        >
                          Trace
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sla-scorecard' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">On-Time Dispatch Rate</span>
                  <span className="text-2xl font-bold text-emerald-950">{vendor.onTimeDispatchRate}%</span>
                  <span className="text-[10px] text-emerald-700 block">Within 4-hr morning cut SLA</span>
                </div>
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                  <span className="text-[10px] uppercase font-bold text-sky-800 block">Cold-Chain Compliance</span>
                  <span className="text-2xl font-bold text-sky-950">{vendor.coldChainComplianceRate}%</span>
                  <span className="text-[10px] text-sky-700 block">Sub-4°C Continuous Reefer</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600 block">Cancellation Rate</span>
                  <span className="text-2xl font-bold text-slate-900">{vendor.cancellationRate}%</span>
                  <span className="text-[10px] text-slate-500 block">0.0% arbitrary rejections</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-200 uppercase font-semibold">Vendor Escrow Wallet</span>
                  <span className="text-3xl font-bold block mt-0.5">
                    ₹{vendor.walletBalanceRupees.toLocaleString('en-IN')}
                  </span>
                  <p className="text-xs text-emerald-100 mt-1">
                    Auto-credited to Sahyadri Cooperative bank account upon customer crispness acceptance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Manual instant withdrawal requested to verified bank account.')}
                  className="px-4 py-2.5 bg-white text-emerald-900 font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-slate-100"
                >
                  Instant NEFT Payout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
