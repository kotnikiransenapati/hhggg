import React, { useState } from 'react';
import { FarmCluster, ActiveScreen } from '../types';
import { REGIONAL_CLUSTERS, BATCH_DATA } from '../data/mockData';

interface TraceabilityScreenProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenVideo: () => void;
  onSelectFarmerForChat: (farmerId: string) => void;
}

export const TraceabilityScreen: React.FC<TraceabilityScreenProps> = ({
  setActiveScreen,
  onOpenVideo,
  onSelectFarmerForChat,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<FarmCluster>(REGIONAL_CLUSTERS[0]);
  const [batchCodeInput, setBatchCodeInput] = useState('#NSK-8821');
  const [activeBatchCode, setActiveBatchCode] = useState('#NSK-8821');

  const currentBatch = BATCH_DATA[activeBatchCode] || BATCH_DATA['#NSK-8821'];

  const handleInspectBatch = (code: string) => {
    setBatchCodeInput(code);
    setActiveBatchCode(code);
  };

  const handleRunBatchSearch = () => {
    const formatted = batchCodeInput.trim().toUpperCase();
    if (BATCH_DATA[formatted]) {
      setActiveBatchCode(formatted);
    } else {
      setActiveBatchCode('#NSK-8821');
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* 1. Hero Section: Clean & Calm */}
      <section className="w-full bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              Geo-Verified Food Integrity
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Verify Your Food's Exact Origin
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every crop lot is mapped from certified farm coordinates directly to your kitchen with uncompromised lab transparency.
            </p>
          </div>

          {/* Quick jump anchor links */}
          <div className="flex items-center gap-2">
            <a
              href="#cluster-map"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
            >
              Cluster Map
            </a>
            <a
              href="#batch-verifier"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              Batch Verifier
            </a>
          </div>
        </div>
      </section>

      {/* 2. Interactive Cluster Map & Regional Hotspots */}
      <section id="cluster-map" className="max-w-7xl mx-auto px-6 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Regional Farm Clusters</h2>
            <p className="text-xs text-slate-500">6 verified co-op clusters across Maharashtra and North India</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ● All Sensors Online
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map View Port */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative h-80 sm:h-96 w-full">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBixaKf28cAz-TbtqSe51c1Uh6B1QHvObnEF8X_o6os7kg4gFGiMUamXGj52VW3cwtmS29gmY0gVJ99AafyDGVeJcfUNKwkyZ6uKrFGSyujYrZm6ak_oAOhJXQnVSMhFiqj9b-5tRo0M7um58xRuSb6iXbGgysHJ4EzZOUYfcd65JFB15P1L10wJQy00f3a4iZ5OXdCHfnIDSPQIOJhF_TeYqQhl64qoC2FO4LN6eHDwgELyZ4CO4RPfg')`,
                }}
              ></div>

              {/* Hotspot Marker */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-emerald-700 text-white items-center justify-center font-bold text-xs shadow-md">
                    #4
                  </span>
                </span>
                <span className="mt-1 bg-white/95 px-2 py-0.5 rounded shadow text-xs font-bold text-slate-900 border border-slate-200">
                  {selectedCluster.name}
                </span>
              </div>

              {/* Bottom Info Strip on Map */}
              <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200/80 shadow-md flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">Selected Cluster</span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{selectedCluster.name}</h4>
                  <span className="text-xs text-slate-500">{selectedCluster.coordinates} · PIN {selectedCluster.pin}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 block">{selectedCluster.status}</span>
                  <span className="text-xs text-slate-400">{selectedCluster.farmersCount} Farmers Cooperative</span>
                </div>
              </div>
            </div>

            {/* 4 Clean Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 p-4 text-center">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Total Farmland</span>
                <span className="text-base font-bold text-slate-900">{selectedCluster.acreage} Acres</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Soil NPK Health</span>
                <span className="text-base font-bold text-emerald-700">{selectedCluster.soilNpk} / 100</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Chemical Residue</span>
                <span className="text-base font-bold text-emerald-700">{selectedCluster.chemicalResiduePpm.toFixed(2)} ppm</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Field-to-Home Transit</span>
                <span className="text-base font-bold text-slate-900">{selectedCluster.transitHours}h Avg</span>
              </div>
            </div>
          </div>

          {/* Regional Cluster Selector (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Select Regional Cluster</h3>
            <div className="space-y-2">
              {REGIONAL_CLUSTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCluster(c)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedCluster.id === c.id
                      ? 'bg-emerald-50/80 border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{c.region} · {c.crops.join(', ')}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Cluster Hub: Sahyadri Syndicate */}
      <section className="max-w-7xl mx-auto px-6 py-6 w-full">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPj6nKLIfjo-hqdH7pGkGyrV2Y9mUC17sFdkcqCp9LKS7n9uNFOaCXCn8Kyam0BNt_oetrYpDc6MSTJxI7GUOcXHzebFVPS5m_PeEzgayd4O1hQsG72KTv4TNvMDJWXSlnKqNlQ9lWKY2elSywpuomzXGqrAVgjO-EB_Qrw9QxPjC1OtGxQgYDj8Xqr8Bp8TJeU_jys0MSyMZGvWO5oFAlZL1lxLIpxQ-NoQoj61gZMjPnwJ4ak6h8aQ"
                alt="Lead Farmer Ramesh Patel"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">Sahyadri Organic Growers Syndicate</h3>
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lead Farmer: Ramesh Patel · 42 cooperative family smallholders · Nashik Valley
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenVideo}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Watch Harvest Cam</span>
              </button>
              <button
                onClick={() => {
                  onSelectFarmerForChat('ramesh');
                  setActiveScreen('community');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">forum</span>
                <span>Chat with Ramesh</span>
              </button>
            </div>
          </div>

          {/* Clean Soil Microbiome telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium block">Nitrogen (N) Content</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">298 kg/ha</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Optimal balance</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium block">Phosphorus (P) Reserves</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">48 kg/ha</span>
              <span className="text-[11px] text-emerald-700 font-semibold">High organic reserve</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium block">Potassium (K) Availability</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">340 kg/ha</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Rich mineral humus</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium block">Organic Carbon (Humus)</span>
              <span className="text-lg font-bold text-emerald-800 mt-1 block">1.42%</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Exceptional fertility</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Batch Escrow & Traceability Tool (FarmDirect Batch Verifier) */}
      <section id="batch-verifier" className="max-w-7xl mx-auto px-6 py-10 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">FarmDirect Batch Verifier</h2>
            <p className="text-xs text-slate-500">
              Enter any packaging QR code to inspect the immutable journey from soil to doorstep
            </p>
          </div>

          {/* Clickable Quick Sample Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Samples:</span>
            {['#NSK-8821', '#IND-4419', '#RTN-9022'].map((code) => (
              <button
                key={code}
                onClick={() => handleInspectBatch(code)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeBatchCode === code
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={batchCodeInput}
            onChange={(e) => setBatchCodeInput(e.target.value)}
            placeholder="Enter batch code (e.g. #NSK-8821)"
            className="flex-1 bg-white border border-slate-300 px-4 py-3 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
          />
          <button
            onClick={handleRunBatchSearch}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            Verify Lot
          </button>
        </div>

        {/* Selected Batch Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentBatch.iconEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">{currentBatch.title}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Cold Chain Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentBatch.origin}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="text-slate-400 block font-medium">Escrow Status</span>
                <span className="font-bold text-emerald-700">🔒 Payout Locked</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-medium">Estimated Arrival</span>
                <span className="font-bold text-slate-900">{currentBatch.eta}</span>
              </div>
            </div>
          </div>

          {/* 5 Timeline Stages */}
          <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {currentBatch.stages.map((stage, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] shadow-xs ${
                    stage.isColdChain ? 'bg-sky-600 animate-pulse' : 'bg-emerald-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">{stage.icon}</span>
                </div>

                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Stage {stage.stageNumber} · {stage.category}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">{stage.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5 max-w-xl">{stage.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0 self-start sm:self-auto">
                    {stage.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Neighboring Farmer Collectives */}
      <section className="max-w-7xl mx-auto px-6 py-6 w-full space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Neighboring Farmer Collectives</h2>
          <p className="text-xs text-slate-500">Connect directly with ethical grower families across the valley</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              id: 'savita',
              name: 'Savita Shinde',
              location: 'Shinde Natural Orchards · Dindori',
              rating: '4.9',
              reviews: '184',
              quote: 'Cultivating Bhagwa pomegranates and cold-pressed jaggery with ancestral bio-cultures. 12 years pesticide-free.',
              harvests: ['Pomegranate', 'Desi Lemons', 'Turmeric'],
              avatar:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDGwtYg_v0zjk2Q-dMNnRlIWLuHgBQYAc-NEVFHxQ6eMwLOAIdcB23icl5UMpVcuo0TyQznwqUTIR6-2Umepy25sdncUMCZ4Mg-1S0_7kpwP2X-FCiMxhGFRHy4t0lwFLur7G9wIdJZwXfBP7QMhLOOShy5tW8CI2oLYhKMK9llV_aTOw9bnYZ8rJwEBEATPS0rPyS48DKoZRlI-2Oq7RFpSgL8LhNt33J4bgPBAwIVLkyHoUki45OL6Q',
            },
            {
              id: 'arjun',
              name: 'Arjun Deshmukh',
              location: 'Godavari Hydro-Organic · Niphad',
              rating: '4.8',
              reviews: '212',
              quote: 'Microgreens and baby spinach harvested at sunrise and cooled in solar chambers within 30 minutes.',
              harvests: ['Baby Spinach', 'Sweet Basil', 'Cabbage'],
              avatar:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuByGS1c7EaI2coVrAY7HCparhjcyfrRmABRsYraEkzGftgS6Wi3Kuc63LZRUfd-pz2IYZGflqQ1tNf3Lhe5zykX-HQieHGDQYUupVnmk5CVCF6FKw9fJUzXAsxkj61tFSsHVyOibo2eAJy76sX3g0yoY9vWNw_PcN5Dd15YG2vd8k4cWQdBT8Ge7XwIk5iJ-dndoMxwC7WEWhwUhw-LEHbQU0C7bgmNlzS-J4yVIDF61MAQBpX1xoRm8w',
            },
            {
              id: 'mahadev',
              name: 'Mahadev Rao',
              location: 'Deola Heritage Seeds Collective',
              rating: '5.0',
              reviews: '340',
              quote: 'Preserving 24 native varieties of onions and cold-pressed mustard oil using solar-powered stone kolhus.',
              harvests: ['Red Onions', 'Mustard Oil', 'Garlic'],
              avatar:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqD-TscARYhdR8hpmyZbsDFZ0RdYC2FNFrEM0khyOYcKrv8W5eeVc9jOssvAqll7F55uksAAhfaa3z3LcU2od_Eq5UfzHglx1CbF4bH6kFxcEwSXTKVEwcbWqdM8zLC8QDRF4Rs2CY2ao7_DZt9dHYxs5Z6aL4Q3ZTlTmkQXbWAOnFwcFDBA-3AtN71npSNtLB_fcZVGHBwisam4RwPTuyA0n7199Khy-JP8BBVPzSstCTkc57C3ypQ',
            },
          ].map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={farmer.avatar}
                    alt={farmer.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{farmer.name}</h4>
                    <p className="text-[11px] text-slate-500">{farmer.location}</p>
                    <span className="text-xs text-amber-500 font-semibold">★ {farmer.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">“{farmer.quote}”</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {farmer.harvests.map((h, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectFarmerForChat(farmer.id);
                  setActiveScreen('community');
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Direct Message</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
