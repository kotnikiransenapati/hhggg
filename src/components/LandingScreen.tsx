import React, { useState } from 'react';
import { ActiveScreen, ProduceItem } from '../types';
import { INITIAL_PRODUCE, REGIONAL_CLUSTERS } from '../data/mockData';
import { LiveHarvestMarquee } from './LiveHarvestMarquee';
import { HomeBento21st } from './HomeBento21st';
import { InteractiveColdChainStepper } from './InteractiveColdChainStepper';

interface LandingScreenProps {
  produceList?: ProduceItem[];
  wishlist?: ProduceItem[];
  onToggleWishlist?: (item: ProduceItem) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onOpenTrace: (batchId: string) => void;
  openAddressModal: () => void;
  currentAddress: string;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  produceList,
  wishlist = [],
  onToggleWishlist,
  setActiveScreen,
  onAddToCart,
  onOpenTrace,
  openAddressModal,
  currentAddress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fruits' | 'leafy' | 'staples' | 'dairy'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availableProduce = (produceList && produceList.length > 0) ? produceList : INITIAL_PRODUCE;

  const filteredProduce = availableProduce.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  }).slice(0, 4);

  const handleQuickAdd = (item: ProduceItem) => {
    onAddToCart(item, 1);
    setToastMessage(`Added 1 ${item.unit} of ${item.name} to basket!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full flex flex-col bg-[#f8fafc] text-slate-900 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs font-semibold animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Hero Section with 21st.dev Ambient Glow & Layout */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 border-b border-slate-200 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Western Ghats Agro Collective</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Sub-4°C Solar Transit</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Direct Farmer Escrow</span>
              </div>

              {/* Headline with text-balance */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Pure farm harvest at your doorstep. Verified 0.00 ppm residue.
              </h1>

              {/* Value Proposition Subhead */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-pretty">
                Direct farm-to-table organic produce harvested within 14 hours of delivery. 
                Protected by refrigerated cold-chain transit and doorstep escrow inspection—where 
                94.1% of every rupee goes straight to smallholder farmer accounts.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveScreen('marketplace')}
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Explore Today's Harvest Lots</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => setActiveScreen('traceability')}
                  className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">biotech</span>
                  <span>Verify Soil Lab Data</span>
                </button>
              </div>

              {/* Location delivery assurance bar */}
              <div className="pt-4 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">local_shipping</span>
                <span>Delivering next-day sunrise harvests to:</span>
                <button
                  onClick={openAddressModal}
                  className="font-bold text-slate-800 underline decoration-slate-300 hover:decoration-emerald-700 cursor-pointer"
                >
                  {currentAddress}
                </button>
              </div>
            </div>

            {/* Right Visual Focal Anchor (High-Fidelity 21st.dev Card) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 bg-white group hover:border-emerald-400/50 transition-all duration-300">
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_rZ1oQp2b8h_Ym70q_U4Vf4y23t0pB4KjY9b_x9kX-7gV5b_Q3a1z8k_0mP9qT5v_7y2_X1b9_4M2q_8a1_K4q_0p_7y2b_8a1_K4q_0p_7y2"
                    alt="Organic produce freshly harvested at dawn"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Top Floating Telemetry Pills */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>REEFER VAN #4 EN ROUTE</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs border border-emerald-400/30">
                      3.4°C LOCKED
                    </span>
                  </div>

                  {/* Bottom Image Overlay Banner */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block">
                      Dawn Harvest • Sahyadri Syndicate
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-white drop-shadow-sm">
                      San Marzano Vine Tomatoes (Lot #TOM-104)
                    </h3>
                  </div>
                </div>

                {/* Live Harvest Inspection Card Footer */}
                <div className="p-5 bg-white space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Harvested</span>
                      <span className="font-bold text-slate-800">05:30 AM Today</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Grower Cut</span>
                      <span className="font-bold text-emerald-700">94.1% Direct</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Residue Test</span>
                      <span className="font-bold text-slate-800">0.00 ppm SGS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">Lead Farmer: Ramesh Patel</span>
                    <button
                      onClick={() => onOpenTrace('#TOM-104')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Lab Certificate</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 21st.dev Infinite Marquee Ribbon */}
      <LiveHarvestMarquee />

      {/* 3. Quantitative Rigor Bar */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">14 Hours</span>
              <p className="text-xs text-slate-600 leading-snug">
                Average time from field cutting to your kitchen table
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-emerald-700 tabular-nums">0.00 ppm</span>
              <p className="text-xs text-slate-600 leading-snug">
                Pesticide &amp; synthetic chemical residue on every lot
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">94.1%</span>
              <p className="text-xs text-slate-600 leading-snug">
                Farm gate payout directly credited to grower accounts
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">1,280+</span>
              <p className="text-xs text-slate-600 leading-snug">
                Certified smallholders across 4 regional clusters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 21st.dev Interactive Cold-Chain Bento Grid */}
      <section className="py-16 lg:py-20 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <HomeBento21st
            setActiveScreen={setActiveScreen}
            onOpenTrace={onOpenTrace}
          />
        </div>
      </section>

      {/* 5. The 4-Step Interactive Cold-Chain Stepper */}
      <section className="py-16 lg:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <InteractiveColdChainStepper
            setActiveScreen={setActiveScreen}
            onOpenTrace={onOpenTrace}
          />
        </div>
      </section>

      {/* 6. Featured Today's Fresh Lots (Interactive 21st.dev Product Showcase) */}
      <section className="py-16 lg:py-20 bg-slate-50/40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Harvest Lots Available Today
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Dispatched from morning field blocks.
              </h2>
            </div>

            {/* Category Segmented Control (Interactive Filter Buttons) */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All Fresh Lots' },
                { id: 'fruits', label: 'GI-Tag Fruits' },
                { id: 'leafy', label: 'Crisp Greens' },
                { id: 'dairy', label: 'Vedic A2 Dairy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                    selectedCategory === tab.id
                      ? 'bg-white text-emerald-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProduce.map((prod) => {
              const isWishlisted = wishlist.some((w) => w.id === prod.id);
              return (
              <div
                key={prod.id}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Harvest Pill */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-bold text-slate-800 border border-slate-200 shadow-xs">
                      {prod.harvestTime}
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.(prod);
                      }}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm z-10 ${
                        isWishlisted
                          ? 'bg-rose-50 text-rose-600 scale-105 border border-rose-200'
                          : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white backdrop-blur-xs border border-slate-200/60'
                      }`}
                      title={isWishlisted ? 'Remove from Saved Wishlist' : 'Save to Wishlist'}
                      aria-label="Wishlist toggle"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isWishlisted ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-[10px] font-mono text-emerald-300 border border-white/10">
                      3.4°C Chilled
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-medium text-slate-700">{prod.farmer}</span>
                      <span aria-hidden="true">·</span>
                      <span>{prod.origin}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {prod.name}
                    </h3>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-base font-bold text-slate-900 tabular-nums">₹{prod.price}</span>
                        <span className="text-xs text-slate-500"> / {prod.unit}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {prod.growerSharePercent}% to grower
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenTrace(prod.batchId)}
                    className="py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer text-center transition-colors"
                  >
                    Trace Lot
                  </button>
                  <button
                    onClick={() => handleQuickAdd(prod)}
                    className="py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-xs font-semibold text-white cursor-pointer text-center transition-colors shadow-xs active:scale-95"
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            );
          })}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-800 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>View All 8 Produce Categories in Marketplace</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Direct Comparison: FarmDirect vs Commercial Organic Retail */}
      <section className="py-16 lg:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Transparency Audit
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              FarmDirect compared to supermarket "organic" shelves.
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-4 sm:p-5 font-bold">Standard Metric</th>
                  <th className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/50">
                    FarmDirect Collective Mesh
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-slate-500">
                    Commercial Supermarket Shelf
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Time From Harvest</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    12 – 18 Hours (Morning pick)
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">5 – 9 Days (Mandi warehousing)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Lab Residue Testing</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    0.00 ppm SGS Certificate per batch
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">Annual random audit only</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Grower Payout Share</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    94.1% Direct Escrow
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">22% – 30% (70%+ to brokers)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Transit Temperature</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    Sub-4°C Solar Refrigerated fleet
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">Ambient trucks &amp; dry stores</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Consumer Escrow Protection</td>
                  <td className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/20">
                    Release funds after doorstep inspection
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">No recourse once billed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. Farmer Collective Spotlight */}
      <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Farmer Federation Voice
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                "We know every customer who eats from our soil."
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                "Before FarmDirect, we sold our heirloom tomatoes to mandi agents at ₹12/kg, 
                who sold them in Bandra for ₹70/kg while taking two weeks to settle payments. Today, 
                our 48 smallholders receive ₹42.50/kg directly into escrow within minutes of delivery."
              </p>
              <div className="pt-2">
                <span className="font-bold text-slate-900 block text-sm">Ramesh Patel</span>
                <span className="text-xs text-slate-500">
                  Lead Agronomist • Sahyadri Organic Growers Syndicate (48 Farmers)
                </span>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setActiveScreen('community')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Chat with Ramesh Patel
                </button>
                <button
                  onClick={() => setActiveScreen('traceability')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                >
                  View Sahyadri Soil Map
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REGIONAL_CLUSTERS.slice(0, 2).map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cluster.leadFarmerAvatar}
                      alt={cluster.leadFarmer}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cluster.name}</h4>
                      <span className="text-xs text-slate-500">{cluster.region}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cluster.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Soil NPK</span>
                      <span className="font-bold text-slate-800">{cluster.soilNpk} Optimal</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Chemical Residue</span>
                      <span className="font-bold text-emerald-700">0.00 ppm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Conversion Section */}
      <section className="py-16 lg:py-20 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium border border-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tomorrow's Morning Cut Manifest Now Open</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
            Taste produce harvested this morning.
          </h2>

          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Reserve your crates before tonight's 9:00 PM cutoff. Inspected at your door, 
            protected by smart escrow, delivered cold.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveScreen('marketplace')}
              className="px-8 py-3.5 bg-white text-emerald-950 font-bold rounded-xl text-sm hover:bg-emerald-50 transition-all shadow-md cursor-pointer active:scale-98"
            >
              Enter Farm Marketplace
            </button>
            <button
              onClick={() => setActiveScreen('traceability')}
              className="px-6 py-3.5 bg-emerald-800/90 text-white font-semibold rounded-xl text-sm hover:bg-emerald-800 border border-emerald-700 transition-colors cursor-pointer"
            >
              Verify Active Batch Timeline
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
