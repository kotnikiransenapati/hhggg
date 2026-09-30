import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';

interface DeliveryTrackingVisualizerProps {
  order: OrderRecord;
  isDelivered?: boolean;
}

interface Waypoint {
  id: string;
  name: string;
  location: string;
  km: number;
  expectedTime: string;
  temp: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  sensorHash: string;
  x: number; // percentage on SVG map
  y: number;
}

export const DeliveryTrackingVisualizer: React.FC<DeliveryTrackingVisualizerProps> = ({
  order,
  isDelivered = false,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'sensor'>('map');
  const [transitProgress, setTransitProgress] = useState<number>(isDelivered ? 100 : 72);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string>('wp-current');
  const [liveTemp, setLiveTemp] = useState<number>(3.4);
  const [tempAlert, setTempAlert] = useState<boolean>(false);
  const [tamperSealStatus, setTamperSealStatus] = useState<string>('Intact (BLE Tag #RF-9912)');

  // Dynamic waypoints
  const waypoints: Waypoint[] = [
    {
      id: 'wp-origin',
      name: 'Farm Gate Pre-Cooling Hub',
      location: 'Sahyadri Organic Syndicate, Nashik',
      km: 0,
      expectedTime: '05:30 AM',
      temp: '3.1°C',
      status: 'completed',
      description: 'Crates harvested at dawn, pre-cooled within 45 mins. 0.00 ppm chemical test passed.',
      sensorHash: 'BLE-NSK-092',
      x: 18,
      y: 22,
    },
    {
      id: 'wp-hub1',
      name: 'Igatpuri Ghat Consolidation Dock',
      location: 'Western Ghats Cold-Dock #4',
      km: 48,
      expectedTime: '07:15 AM',
      temp: '3.2°C',
      status: 'completed',
      description: 'Consignment merged into high-volume solar refrigerated reefer. Hermetic seal applied.',
      sensorHash: 'BLE-IGT-318',
      x: 38,
      y: 40,
    },
    {
      id: 'wp-current',
      name: 'Samruddhi Expressway Corridor',
      location: 'Thane-Nashik Cold Express Link',
      km: 112,
      expectedTime: '10:45 AM',
      temp: `${liveTemp.toFixed(1)}°C`,
      status: isDelivered ? 'completed' : 'current',
      description: 'Active solar chilling unit maintaining continuous positive sub-4°C airflow.',
      sensorHash: 'BLE-EXP-774',
      x: 60,
      y: 58,
    },
    {
      id: 'wp-micro',
      name: 'Bandra Last-Mile Cold Depot',
      location: 'Bandra Kurla Micro-Hub #12',
      km: 154,
      expectedTime: '12:00 PM',
      temp: '3.5°C',
      status: isDelivered ? 'completed' : (transitProgress >= 88 ? 'current' : 'upcoming'),
      description: 'Transfer to electric delivery trike with insulated eutectic phase plates.',
      sensorHash: 'BLE-BDR-109',
      x: 78,
      y: 74,
    },
    {
      id: 'wp-dest',
      name: 'Customer Doorstep Handover',
      location: 'Bandra West, Mumbai (Your Address)',
      km: 165,
      expectedTime: order.eta.replace('Today ', ''),
      temp: '3.6°C',
      status: isDelivered ? 'completed' : (transitProgress >= 100 ? 'current' : 'upcoming'),
      description: 'Cold-chain broken only upon your inspection and crispness sign-off.',
      sensorHash: 'BLE-END-550',
      x: 90,
      y: 84,
    },
  ];

  // Live simulation tick
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTransitProgress((prev) => {
        if (prev >= 100) {
          setIsSimulating(false);
          return 100;
        }
        return prev + 2;
      });
      // gentle sensor fluctuation
      setLiveTemp((t) => +(t + (Math.random() * 0.2 - 0.1)).toFixed(1));
    }, 400);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Trigger temporary anomaly and recovery
  const handleTriggerAnomaly = () => {
    setTempAlert(true);
    setLiveTemp(5.3);
    setTimeout(() => {
      setLiveTemp(4.4);
    }, 1800);
    setTimeout(() => {
      setLiveTemp(3.3);
      setTempAlert(false);
    }, 3600);
  };

  // Interpolated Van Position on the map
  // Path points: (18, 22) -> (38, 40) -> (60, 58) -> (78, 74) -> (90, 84)
  const getVanCoordinates = (prog: number) => {
    const p = Math.max(0, Math.min(100, prog)) / 100;
    // Cubic polynomial interpolation approximating the highway bend
    const startX = 18;
    const endX = 90;
    const startY = 22;
    const endY = 84;
    const currentX = startX + (endX - startX) * p;
    // Add realistic curved offset for the Western Ghats mountain pass
    const arcOffset = Math.sin(p * Math.PI) * -8;
    const currentY = startY + (endY - startY) * p + arcOffset;
    return { x: currentX, y: currentY };
  };

  const vanPos = getVanCoordinates(transitProgress);
  const activeWpData = waypoints.find((w) => w.id === selectedWaypoint) || waypoints[2];

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-700 shadow-xl my-4">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">ac_unit</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                Real-Time Reefer Telemetry
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                IoT Live Stream
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-100">
              Van #{order.vanNumber} • Driver: {order.driverName}
            </p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Route Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">timeline</span>
            <span>Cold Milestones</span>
          </button>
          <button
            onClick={() => setActiveTab('sensor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'sensor'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Live Sensors</span>
          </button>
        </div>
      </div>

      {/* Reefer Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-slate-950/70 border-b border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Reefer Cargo Temp</span>
            <span className="material-symbols-outlined text-[15px] text-cyan-400">thermostat</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black ${tempAlert ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {liveTemp.toFixed(1)}°C
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Safe Band: 2.0° – 4.5°C</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Relative Humidity</span>
            <span className="material-symbols-outlined text-[15px] text-blue-400">water_drop</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-blue-400">88% RH</span>
            <span className="text-[11px] text-slate-400">Zero Dehydration</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Solar Chiller Battery</span>
            <span className="material-symbols-outlined text-[15px] text-amber-400">bolt</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-amber-300">96%</span>
            <span className="text-[11px] text-emerald-400 font-medium">+4.8 hrs Reserve</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Digital Tamper Seal</span>
            <span className="material-symbols-outlined text-[15px] text-emerald-400">verified_user</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-emerald-300 truncate">SEALED &amp; INTACT</span>
            <span className="text-[10px] text-slate-400">Hash #0x9F</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Visualization View */}
      {activeTab === 'map' && (
        <div className="p-4 space-y-4">
          {/* Simulation & Action Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isSimulating ? 'pause' : 'play_arrow'}
                </span>
                <span>{isSimulating ? 'Pause Transit' : 'Simulate Transit'}</span>
              </button>

              <button
                onClick={handleTriggerAnomaly}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Test how solar compressor reacts to temperature breach"
              >
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Test Cold-Chain Alarm</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <span>Transit Completed:</span>
              <span className="font-bold text-emerald-400">{transitProgress}%</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${transitProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interactive Vector Route Map SVG */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-[#0a101f] via-[#0f172a] to-[#0a101f] border border-slate-800 overflow-hidden shadow-inner">
            {/* Background Grid Lines & Regional Terrain Labels */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Geographic Terrain Background Decorative Contours */}
            <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Western Ghats Cold-Chain Corridor • Sub-4°C Solar Transit
            </div>
            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-500 uppercase">
              GPS Lock: 19.0596° N, 72.8295° E (Bandra Doorstep)
            </div>

            {/* SVG Interactive Canvas */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Glow Filter for Active Reefer Path */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Base Highway Route Path */}
              <path
                d="M 18 22 Q 35 34 38 40 T 60 58 T 78 74 L 90 84"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Active Completed Route Glow Path */}
              <path
                d="M 18 22 Q 35 34 38 40 T 60 58 T 78 74 L 90 84"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeDasharray="100"
                strokeDashoffset={100 - transitProgress}
                filter="url(#glow)"
                strokeLinecap="round"
              />

              {/* Waypoint Connection Lines */}
              {waypoints.map((wp) => (
                <g key={wp.id} className="cursor-pointer" onClick={() => setSelectedWaypoint(wp.id)}>
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={selectedWaypoint === wp.id ? 3.2 : 2.2}
                    fill={wp.status === 'completed' ? '#10b981' : wp.status === 'current' ? '#38bdf8' : '#475569'}
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                  {selectedWaypoint === wp.id && (
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r="4.5"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      className="animate-spin"
                    />
                  )}
                </g>
              ))}

              {/* Live Animated Delivery Van on the Map */}
              <g transform={`translate(${vanPos.x}, ${vanPos.y})`}>
                {/* Pulsing Radar Ring */}
                <circle cx="0" cy="0" r="4" fill="#10b981" opacity="0.3" className="animate-ping" />
                {/* Truck marker circle */}
                <circle cx="0" cy="0" r="3.2" fill="#047857" stroke="#ffffff" strokeWidth="0.8" />
                {/* Van symbol label */}
                <text
                  x="0"
                  y="1.2"
                  fontSize="2.4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontWeight="bold"
                >
                  🚚
                </text>
              </g>
            </svg>

            {/* Overlay Info Card for Van */}
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${vanPos.x}%`,
                top: `${vanPos.y}%`,
              }}
            >
              <div className="bg-slate-900/95 text-white border border-emerald-500/80 px-2.5 py-1 rounded-lg shadow-xl text-[10px] whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-emerald-300">{liveTemp.toFixed(1)}°C</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-200">52 km/h</span>
                <span className="text-slate-400">|</span>
                <span className="text-cyan-300">ETA {order.eta.replace('Today ', '')}</span>
              </div>
            </div>

            {/* Clickable Waypoint Labels on Map */}
            {waypoints.map((wp) => (
              <button
                key={`btn-${wp.id}`}
                onClick={() => setSelectedWaypoint(wp.id)}
                className={`absolute transform -translate-x-1/2 text-left cursor-pointer transition-all duration-200 ${
                  selectedWaypoint === wp.id ? 'scale-105 z-20' : 'opacity-80 hover:opacity-100 z-10'
                }`}
                style={{
                  left: `${wp.x}%`,
                  top: `${wp.y > 60 ? wp.y - 12 : wp.y + 3}%`,
                }}
              >
                <div
                  className={`px-2 py-1 rounded-md text-[10px] font-bold border backdrop-blur-sm shadow-md flex items-center gap-1 ${
                    selectedWaypoint === wp.id
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900/85 text-slate-300 border-slate-700'
                  }`}
                >
                  <span>{wp.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-400">{wp.temp}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Waypoint Detailed Inspector */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm">{activeWpData.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                  {activeWpData.location}
                </span>
                <span className="text-emerald-400 font-semibold">{activeWpData.temp}</span>
              </div>
              <p className="text-slate-400">{activeWpData.description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Checkpoint Sensor</span>
                <span className="font-mono text-cyan-400 font-semibold">{activeWpData.sensorHash}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Time Log</span>
                <span className="text-slate-200 font-bold">{activeWpData.expectedTime}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reefer Telemetry Timeline View */}
      {activeTab === 'timeline' && (
        <div className="p-5 space-y-4">
          <div className="border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
            {waypoints.map((wp, idx) => (
              <div key={wp.id} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                    wp.status === 'completed'
                      ? 'bg-emerald-600 border-white text-white'
                      : wp.status === 'current'
                      ? 'bg-cyan-500 border-white text-slate-950 animate-bounce'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">{wp.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {wp.temp} (Optimal)
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{wp.expectedTime}</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2">{wp.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                    <span>GPS Waypoint: {wp.location}</span>
                    <span className="font-mono text-cyan-400">{wp.sensorHash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Sensors & IoT Audit Logs View */}
      {activeTab === 'sensor' && (
        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">sensors</span>
                Continuous Reefer Temp Log (Last 6 Hours)
              </h4>
              <div className="space-y-2 font-mono">
                {[
                  { time: '11:30 AM', temp: '3.3°C', ambient: '33°C', state: 'Chiller On (ECO)' },
                  { time: '11:00 AM', temp: '3.4°C', ambient: '32°C', state: 'Chiller On (ECO)' },
                  { time: '10:30 AM', temp: '3.2°C', ambient: '31°C', state: 'Chiller On (ECO)' },
                  { time: '10:00 AM', temp: '3.1°C', ambient: '29°C', state: 'Chiller On (ECO)' },
                  { time: '09:30 AM', temp: '2.9°C', ambient: '28°C', state: 'Cold Dock Transfer' },
                ].map((log, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-900 text-[11px]">
                    <span className="text-slate-400">{log.time}</span>
                    <span className="text-emerald-400 font-bold">{log.temp}</span>
                    <span className="text-slate-500">Ext: {log.ambient}</span>
                    <span className="text-slate-300">{log.state}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400 text-[18px]">verified</span>
                Digital Tamper Seal &amp; Escrow Lock
              </h4>
              <div className="space-y-2 text-slate-300">
                <p>
                  <strong>Active Seal:</strong> {tamperSealStatus}
                </p>
                <p>
                  <strong>Cryptographic Lock:</strong> SHA-256 Verified at Pre-Cooling Dock.
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  If the reefer door is breached or interior temperature rises above 6.0°C for more than 10 minutes, the customer escrow platform immediately executes an automated 100% refund guarantee.
                </p>
                <div className="pt-2">
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px] inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    Escrow Custody Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
