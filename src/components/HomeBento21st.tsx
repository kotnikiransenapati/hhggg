import React, { useState, useEffect } from 'react';
import { ActiveScreen } from '../types';

interface HomeBento21stProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenTrace: (batchId: string) => void;
}

export const HomeBento21st: React.FC<HomeBento21stProps> = ({
  setActiveScreen,
  onOpenTrace,
}) => {
  // 1. Radar Waypoint state
  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(1);
  const [isPlayingRadar, setIsPlayingRadar] = useState<boolean>(true);

  // 2. Escrow Slider state
  const [basketValue, setBasketValue] = useState<number>(600);

  // 3. Lab Test Parameter state
  const [activeLabParam, setActiveLabParam] = useState<'organo' | 'glyphosate' | 'metals' | 'nitrate'>('organo');

  // 4. Audio Diary state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSeconds, setAudioSeconds] = useState<number>(0);

  // Auto-play radar waypoint every 4 seconds if playing
  useEffect(() => {
    if (!isPlayingRadar) return;
    const interval = setInterval(() => {
      setActiveWaypointIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlayingRadar]);

  // Audio timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 28) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const waypoints = [
    {
      step: '01',
      title: 'Farm Gate Pre-Cooling',
      location: 'Sahyadri Syndicate, Nashik',
      time: '05:30 AM',
      temp: '3.1°C',
      humidity: '94%',
      status: 'Harvest Sealed',
    },
    {
      step: '02',
      title: 'Kasara Ghat Cold Corridor',
      location: 'NH 160 Western Ghats Pass',
      time: '07:45 AM',
      temp: '3.4°C',
      humidity: '92%',
      status: 'Solar Reefer Active',
    },
    {
      step: '03',
      title: 'Thane Central Sorting Hub',
      location: 'Cold Dock 3, Mumbai Entry',
      time: '09:20 AM',
      temp: '3.6°C',
      humidity: '91%',
      status: 'Batch Inspected',
    },
    {
      step: '04',
      title: 'Doorstep Escrow Handover',
      location: 'Bandra West Delivery Pod',
      time: '11:15 AM',
      temp: '3.8°C',
      humidity: '90%',
      status: 'Customer Acceptance',
    },
  ];

  const currentWp = waypoints[activeWaypointIndex];

  // Escrow math calculations
  const farmerShareDirect = Math.round(basketValue * 0.941);
  const platformFeeDirect = Math.round(basketValue * 0.059);
  const farmerShareMandi = Math.round(basketValue * 0.28);
  const mandiBrokersCut = basketValue - farmerShareMandi;

  const labDetails = {
    organo: {
      name: 'Organophosphates & Chlorpyrifos',
      reading: '0.00 ppm (Not Detected)',
      safeLimit: '< 0.01 ppm FSSAI Limit',
      method: 'LC-MS/MS Multi-Residue Extraction',
      badge: '100% Zero-Residue Passed',
    },
    glyphosate: {
      name: 'Synthetic Glyphosate & Herbicides',
      reading: '0.00 ppm (Zero Trace)',
      safeLimit: '< 0.05 ppm FSSAI Limit',
      method: 'Immuno-assay & High-Resolution GC-MS',
      badge: 'Weedicide-Free Certified',
    },
    metals: {
      name: 'Heavy Metals (Lead, Cadmium, Arsenic)',
      reading: '0.00 ppm (Below ICP-OES LOD)',
      safeLimit: '< 0.10 ppm Codex Limit',
      method: 'Inductively Coupled Plasma Mass Spectrometry',
      badge: 'Pure Soil Validated',
    },
    nitrate: {
      name: 'Synthetic Nitrate Toxicity',
      reading: '18 ppm (Natural Organic Soil Basal)',
      safeLimit: '< 2500 ppm Permissible',
      method: 'Spectrophotometric Cadmium Reduction',
      badge: 'Zero Chemical Fertilizers',
    },
  };

  const currLab = labDetails[activeLabParam];

  return (
    <div className="space-y-6">
      {/* Bento Grid Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span>21st-Century Agritech Engine</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Real-Time Provenance</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Cryptographic Escrow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
            The cold-chain intelligence matrix.
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Every crate is guarded by solar-powered IoT chilling, verified by SGS chemical residue testing, 
            and escrow-settled to smallholder bank accounts in real time.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('traceability')}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer self-start md:self-auto py-1"
        >
          <span>Explore Farm Clusters &amp; Lab Audits</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BENTO CARD 1: Live Cold-Chain Radar & Animated Route (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Live Consignment Radar • Van #MH-15-EG-4402
                </span>
              </div>

              {/* Waypoint Stepper Control */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                {waypoints.map((wp, idx) => (
                  <button
                    key={wp.step}
                    onClick={() => {
                      setIsPlayingRadar(false);
                      setActiveWaypointIndex(idx);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] ${
                      activeWaypointIndex === idx
                        ? 'bg-white text-emerald-900 shadow-xs font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {wp.step}
                  </button>
                ))}
                <button
                  onClick={() => setIsPlayingRadar(!isPlayingRadar)}
                  title={isPlayingRadar ? 'Pause Autoplay' : 'Play Simulation'}
                  className="p-1 rounded-md hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isPlayingRadar ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive SVG Route Corridor Map */}
            <div className="my-5 relative rounded-xl bg-slate-950 p-4 overflow-hidden border border-slate-800 text-white">
              {/* Background Map Grid */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* SVG Route Visualization */}
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-emerald-400 mb-2 flex items-center justify-between">
                    <span>WESTERN GHATS COLD CORRIDOR • NH-160</span>
                    <span className="text-slate-400">{currentWp.time}</span>
                  </div>

                  <svg
                    viewBox="0 0 460 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-16"
                  >
                    {/* Road base line */}
                    <path
                      d="M 20 35 C 100 15, 180 55, 260 25 C 330 5, 390 45, 440 35"
                      stroke="#334155"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Active chilled path */}
                    <path
                      d="M 20 35 C 100 15, 180 55, 260 25 C 330 5, 390 45, 440 35"
                      stroke="#059669"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="440"
                      strokeDashoffset={440 - (activeWaypointIndex + 1) * 110}
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Waypoint Nodes */}
                    {[
                      { x: 20, y: 35 },
                      { x: 160, y: 45 },
                      { x: 300, y: 18 },
                      { x: 440, y: 35 },
                    ].map((pt, i) => (
                      <g key={i} className="cursor-pointer" onClick={() => setActiveWaypointIndex(i)}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={activeWaypointIndex === i ? 8 : 5}
                          fill={activeWaypointIndex >= i ? '#10b981' : '#475569'}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        {activeWaypointIndex === i && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="14"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            className="animate-ping"
                          />
                        )}
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Live Reefer Gauge Display */}
                <div className="shrink-0 bg-slate-900/90 rounded-xl p-3 border border-emerald-500/30 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-950 border border-emerald-500/40 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-emerald-400 font-mono">TEMP</span>
                    <span className="text-sm font-bold text-white font-mono">{currentWp.temp}</span>
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="text-emerald-400 font-bold">{currentWp.status}</div>
                    <div className="text-slate-400 text-[11px]">Humidity: {currentWp.humidity}</div>
                    <div className="text-slate-400 text-[11px]">Solar Aux: 100% Chilling</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Waypoint Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Waypoint Phase</span>
                <span className="font-bold text-slate-800">{currentWp.title}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Location</span>
                <span className="font-semibold text-slate-800 truncate block">{currentWp.location}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Tamper Seal</span>
                <span className="font-semibold text-emerald-700">Verified #TS-8841</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Escrow Custody</span>
                <span className="font-semibold text-slate-800">Locked in Transit</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Produce cargo: San Marzano Vine Tomatoes &amp; Butterhead Lettuce</span>
            <button
              onClick={() => onOpenTrace('#NSK-8821')}
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Reefer Audit Log</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: 94.1% Direct Grower Escrow Calculator (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Fair Trade Escrow Simulator
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                94.1% Direct
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Drag to see where your grocery spend actually lands. Mandi traders extract 72% in commissions and wastage; FarmDirect eliminates all intermediaries.
            </p>

            {/* Interactive Basket Value Slider */}
            <div className="my-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Order Basket Value:</span>
                <span className="text-base font-bold text-slate-900 font-mono">₹{basketValue}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={basketValue}
                onChange={(e) => setBasketValue(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹200</span>
                <span>₹1,200</span>
                <span>₹2,500</span>
              </div>
            </div>

            {/* Comparative Breakdown Visualizer */}
            <div className="space-y-3 pt-2">
              {/* FarmDirect Model */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950">FarmDirect Escrow</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">₹{farmerShareDirect} to Grower</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-2 rounded-full bg-emerald-200 overflow-hidden flex">
                  <div className="bg-emerald-700 h-full w-[94.1%]" title="Grower Collective (94.1%)"></div>
                  <div className="bg-emerald-400 h-full w-[5.9%]" title="Platform Logistics (5.9%)"></div>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-800">
                  <span>94.1% Farmer Payout</span>
                  <span>5.9% Transit Pods (₹{platformFeeDirect})</span>
                </div>
              </div>

              {/* Mandi Broker Model */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 opacity-80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Mandi Wholesale Chain</span>
                  <span className="font-bold text-slate-600 font-mono">₹{farmerShareMandi} to Grower</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="bg-slate-400 h-full w-[28%]" title="Farmer (28%)"></div>
                  <div className="bg-amber-500 h-full w-[72%]" title="Middlemen & Wastage (72%)"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>28% Farmer Share</span>
                  <span className="text-amber-700 font-medium">₹{mandiBrokersCut} Broker Margins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Grower Uplift:</span>
            <span className="font-bold text-emerald-800 text-sm">
              +{Math.round(((farmerShareDirect - farmerShareMandi) / farmerShareMandi) * 100)}% More Income
            </span>
          </div>
        </div>

        {/* BENTO CARD 3: 0.00 ppm SGS Lab Residue Scanner (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">biotech</span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Residue Purity Inspector • SGS Agro Lab
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 font-mono">
                Cert #MH-2026-9921
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Every harvest block is subjected to multi-residue gas chromatography screening before dispatch. Zero harmful pesticides or synthetic chemicals.
            </p>

            {/* Chemical Parameter Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-3 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveLabParam('organo')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium cursor-pointer transition-colors text-[11px] ${
                  activeLabParam === 'organo' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pesticides
              </button>
              <button
                onClick={() => setActiveLabParam('glyphosate')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium cursor-pointer transition-colors text-[11px] ${
                  activeLabParam === 'glyphosate' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Glyphosate
              </button>
              <button
                onClick={() => setActiveLabParam('metals')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium cursor-pointer transition-colors text-[11px] ${
                  activeLabParam === 'metals' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Heavy Metals
              </button>
              <button
                onClick={() => setActiveLabParam('nitrate')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium cursor-pointer transition-colors text-[11px] ${
                  activeLabParam === 'nitrate' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nitrates
              </button>
            </div>

            {/* Selected Parameter Details Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{currLab.name}</span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                  {currLab.badge}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Laboratory Reading</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">{currLab.reading}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Statutory Permissible</span>
                  <span className="font-semibold text-slate-700 font-mono text-xs">{currLab.safeLimit}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/60">
                <span className="font-medium text-slate-700">Assay Protocol:</span> {currLab.method}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Accredited by NABL &amp; FSSAI India</span>
            <button
              onClick={() => onOpenTrace('#NSK-8821')}
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Download SGS Lab PDF</span>
              <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
            </button>
          </div>
        </div>

        {/* BENTO CARD 4: Live Audio Diary from Farmer Ramesh Patel (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  RP
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Ramesh Patel (Lead Agronomist)</span>
                  <span className="text-[10px] text-slate-500">Sahyadri Organic Syndicate #4, Nashik</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Morning Field Audio
              </span>
            </div>

            {/* Audio Player Component */}
            <div className="my-4 p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Dawn Picking &amp; Solar Chilling Notes</span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      0:{audioSeconds < 10 ? `0${audioSeconds}` : audioSeconds} / 0:28
                    </span>
                  </div>

                  {/* Simulated Waveform with animated bars */}
                  <div className="h-6 flex items-center gap-1">
                    {[12, 18, 24, 16, 20, 26, 14, 22, 19, 25, 15, 20, 24, 18, 12, 22, 16, 20, 25, 14].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isPlayingAudio && i <= (audioSeconds / 28) * 20
                            ? 'bg-emerald-400'
                            : 'bg-slate-700'
                        }`}
                        style={{
                          height: isPlayingAudio ? `${Math.max(6, (h * ((i % 3) + 1)) % 24)}px` : `${h * 0.7}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Spoken Quote Transcript */}
              <p className="text-xs text-slate-300 italic leading-relaxed pt-1 border-t border-slate-800">
                "{isPlayingAudio
                  ? "We cut our vine tomatoes between 5:15 AM and 6:30 AM with dew intact. Sealed at 3.2°C in reefer van #4. Thank you for eating directly from our soil!"
                  : "Click play to listen to Ramesh describe this morning's harvest conditions and pre-cooling temperature verification."}
                "
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>48 Smallholder Families Supported</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>142 Organic Acres</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Audio recorded 05:45 AM today</span>
            <button
              onClick={() => setActiveScreen('community')}
              className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>Message Ramesh in Community</span>
              <span className="material-symbols-outlined text-[14px]">chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
