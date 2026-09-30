import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services/firestoreService';
import { FarmerDispatchLot } from '../../types';

export const FarmerPanel: React.FC = () => {
  const [highGlareMode, setHighGlareMode] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [readyBalance, setReadyBalance] = useState<number>(184200);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Harvest Batch Modal
  const [isLogBatchOpen, setIsLogBatchOpen] = useState<boolean>(false);
  const [newBatchCrop, setNewBatchCrop] = useState<string>('Vine-Ripened Desi Tomatoes');
  const [newBatchCrates, setNewBatchCrates] = useState<number>(25);
  const [newBatchWeight, setNewBatchWeight] = useState<number>(500);
  const [newBatchColdClass, setNewBatchColdClass] = useState<'Fruits (8-10°C)' | 'Leafy (2-4°C)' | 'Dairy (1-3°C)'>('Fruits (8-10°C)');

  // Active Lots
  const [lots, setLots] = useState<FarmerDispatchLot[]>([
    {
      id: 'TOM-104',
      farmerId: 'ramesh',
      farmerName: 'Ramesh Patel',
      cluster: 'Sahyadri Syndicate (Nashik)',
      crop: 'Vine-Ripened Country Tomatoes',
      crates: 18,
      weightKg: 450,
      harvestTime: '05:30 AM today',
      coldClass: 'Fruits (8-10°C)',
      vanAssigned: 'Van #04 (GJ-15-E)',
      escrowExpected: 38400,
      escrowSettled: false,
      status: 'Reefer Dispatched',
    },
    {
      id: 'SPN-882',
      farmerId: 'ramesh',
      farmerName: 'Ramesh Patel',
      cluster: 'Sahyadri Syndicate (Nashik)',
      crop: 'Hydroponic Palak Spinach',
      crates: 12,
      weightKg: 120,
      harvestTime: '06:15 AM today',
      coldClass: 'Leafy (2-4°C)',
      vanAssigned: 'Van #04 (GJ-15-E)',
      escrowExpected: 7200,
      escrowSettled: false,
      status: 'Consolidated',
    },
    {
      id: 'PUM-310',
      farmerId: 'ramesh',
      farmerName: 'Ramesh Patel',
      cluster: 'Sahyadri Syndicate (Nashik)',
      crop: 'Organic Red Heritage Pumpkin',
      crates: 20,
      weightKg: 800,
      harvestTime: 'Harvest in 4 Days',
      coldClass: 'Fruits (8-10°C)',
      escrowExpected: 22400,
      escrowSettled: false,
      status: 'Ready at Farm Gate',
    },
  ]);

  const [qrModalLot, setQrModalLot] = useState<string | null>(null);

  // Sync real farmer dispatches from Firestore
  useEffect(() => {
    firestoreService.getFarmerDispatches().then((data) => {
      if (data && data.length > 0) {
        setLots(data);
      }
    });

    const unsub = firestoreService.listenFarmerDispatches((dispatches) => {
      if (dispatches && dispatches.length > 0) {
        setLots(dispatches);
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWithdrawal = () => {
    if (readyBalance <= 0) return;
    setIsWithdrawing(true);
    setTimeout(() => {
      triggerToast(`IMPS Ref #8928420: ₹${readyBalance.toLocaleString('en-IN')} deposited in State Bank of India account •••• 4091.`);
      setReadyBalance(0);
      setIsWithdrawing(false);
    }, 1200);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: FarmerDispatchLot = {
      id: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: 'ramesh',
      farmerName: 'Ramesh Patel',
      cluster: 'Dindori Cluster, Nashik, MH',
      crop: newBatchCrop,
      crates: Number(newBatchCrates),
      weightKg: Number(newBatchWeight),
      harvestTime: 'Just now (08:30 AM)',
      coldClass: newBatchColdClass,
      vanAssigned: 'Van #04 (GJ-15-E)',
      escrowExpected: Number(newBatchWeight) * 45,
      escrowSettled: false,
      status: 'Ready at Farm Gate',
    };

    setLots((prev) => [newLot, ...prev]);
    setIsLogBatchOpen(false);
    triggerToast(`Harvest batch #${newLot.id} logged and synced to Firestore!`);

    try {
      await firestoreService.createFarmerDispatch(newLot);
    } catch (err) {
      console.error('Failed to save batch in Firestore:', err);
    }
  };

  return (
    <div
      className={`flex flex-col w-full gap-6 pb-12 font-sans transition-colors duration-300 ${
        highGlareMode ? 'bg-[#fcfdfa] text-slate-950 contrast-125' : 'text-[#141b2b]'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141b2b] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Producer Operational Banner */}
      <div className="w-full bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-inner ring-2 ring-emerald-600/20">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
              alt="Ramesh Patel"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-[#141b2b]">Ramesh Patel</span>
              <span className="material-symbols-outlined text-[#006c49] text-[20px]">verified</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-mono">
                ID: SY-NSK-408
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
              <span>Sahyadri Organic Growers Syndicate • Dindori Cluster, Nashik, MH</span>
            </p>
          </div>
        </div>

        {/* Live Cooperative Rating & High Glare Mode Toggle */}
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <div className="flex items-center text-amber-500">
              <span className="material-symbols-outlined text-[20px]">star</span>
              <span className="text-base font-extrabold text-[#141b2b] ml-1">4.9</span>
              <span className="text-xs text-slate-400 font-medium">/5</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#141b2b]">340 Direct Buyers</span>
              <span className="text-[11px] text-emerald-700 font-semibold">99.4% Freshness SLA</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHighGlareMode(!highGlareMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              highGlareMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">light_mode</span>
            <span>{highGlareMode ? 'High Glare Mode: Active' : 'Outdoor Sun-Glare Mode'}</span>
          </button>
        </div>
      </div>

      {/* Bento Grid 1: Financial Liquidity & Instant Escrow Engine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Harvested Today */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Harvested Today (05:30 - 07:00 AM)
              </span>
              <div className="text-3xl font-extrabold text-emerald-800 mt-1">₹42,850</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">agriculture</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold">
              3 Farm Pods
            </span>
            <span>Tomatoes, Hydro-Spinach, Basil</span>
          </div>
        </div>

        {/* Card 2: Pending Escrow Payout */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-blue-700">
                <span className="text-xs font-bold uppercase tracking-wider">Smart Contract Escrow</span>
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
              </div>
              <div className="text-3xl font-extrabold text-[#141b2b] mt-1">₹94,600</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Releasing Today upon Reefer Check-in</span>
              <span className="text-blue-700 font-bold">4:30 PM Window</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Instant Withdrawal Wallet */}
        <div className="bg-[#006c49] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Ready Payout Balance
              </span>
              <div className="text-3xl font-extrabold mt-1">₹{readyBalance.toLocaleString('en-IN')}</div>
            </div>
            <span className="material-symbols-outlined text-[26px] text-emerald-200">
              account_balance_wallet
            </span>
          </div>
          <div className="mt-4 pt-1 relative z-10">
            <button
              type="button"
              onClick={handleWithdrawal}
              disabled={isWithdrawing || readyBalance <= 0}
              className="w-full py-2.5 px-4 bg-white text-[#006c49] rounded-xl text-xs font-extrabold shadow-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{isWithdrawing ? 'Processing IMPS Transfer...' : '1-Click IMPS Instant Transfer'}</span>
            </button>
            <p className="text-[11px] text-emerald-200/80 text-center mt-1.5">
              Linked: State Bank of India •••• 4091 (Zero T+0 Fee)
            </p>
          </div>
        </div>
      </div>

      {/* Primary Producer Action Bar */}
      <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap sm:flex-nowrap gap-3">
          {/* Primary CTA: Log Harvest Batch */}
          <button
            type="button"
            onClick={() => setIsLogBatchOpen(true)}
            className="flex-1 min-w-[260px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-md transition-all active:scale-[0.99] cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px] font-bold">add_circle</span>
              <div className="text-left">
                <div className="text-base font-extrabold leading-tight">Log Harvest Batch</div>
                <div className="text-xs text-emerald-100">Auto-assigns crate weight &amp; origin block</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>

          <button
            type="button"
            onClick={() => triggerToast('Voice dictation active. Recording harvest manifest...')}
            className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-emerald-800 flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Audio Dictate Batch"
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
          </button>

          {/* Secondary Field Action Buttons */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            <button
              type="button"
              onClick={() => triggerToast('Reefer Sprinter #04 dispatched to Dindori Farm Gate 02.')}
              className="bg-white hover:bg-slate-100 text-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-blue-600 text-[22px] mb-1">rv_hookup</span>
              <span className="text-xs font-bold">Request Reefer</span>
              <span className="text-[10px] text-slate-400">Cluster Van #04</span>
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Thermal Bluetooth printer connected. Printing 18 QR crate stickers.')}
              className="bg-white hover:bg-slate-100 text-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-emerald-700 text-[22px] mb-1">qr_code_scanner</span>
              <span className="text-xs font-bold">Print QR Labels</span>
              <span className="text-[10px] text-slate-400">Thermal Bluetooth</span>
            </button>
            <button
              type="button"
              onClick={() => triggerToast('PGS Organic bio-fertilizer subsidised catalog opened.')}
              className="bg-white hover:bg-slate-100 text-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-amber-600 text-[22px] mb-1">compost</span>
              <span className="text-xs font-bold">Bio-Inputs &amp; Seeds</span>
              <span className="text-[10px] text-slate-400">PGS Subsidy 40%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Workspace: Lots + Dispatch vs IoT Soil Mesh */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Active Harvest Lots & Cold Chain Pickup Schedule */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-800 text-[24px]">inventory_2</span>
              <span className="text-base font-bold text-[#141b2b]">Active Lots &amp; Dispatch Fleet</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Nashik Corridor • Gate 02 Hub</span>
          </div>

          {/* Lot 1: Vine-Ripened Country Tomatoes (#TOM-104) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80"
                  alt="Vine-Ripened Country Tomatoes"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      #TOM-104
                    </span>
                    <h3 className="text-base font-extrabold text-[#141b2b]">Vine-Ripened Country Tomatoes</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Field 4 (North Terraces) • Harvested 05:30 AM today</p>
                </div>
              </div>

              <span className="self-start px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>Packed in Banana-Bark Crates</span>
              </span>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Batch Weight</span>
                <span className="text-base font-extrabold text-[#141b2b]">450 kg</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Cold Van Pickup</span>
                <span className="text-sm font-bold text-blue-700">11:30 AM</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Reefer Assignment</span>
                <span className="text-sm font-semibold text-slate-800">Van #04 (GJ-15-E)</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Pre-Booked Demand</span>
                <span className="text-base font-extrabold text-emerald-700">92%</span>
              </div>
            </div>

            {/* 4-Step Batch Workflow Progress */}
            <div className="bg-slate-50 p-3.5 rounded-xl flex flex-col gap-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Batch Workflow Progress
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Step 3 of 4: Packing Done • Ready for Van #04</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                <div className="bg-[#006c49] h-full w-[25%]"></div>
                <div className="bg-[#006c49] h-full w-[25%] border-l border-white"></div>
                <div className="bg-emerald-500 h-full w-[25%] border-l border-white"></div>
                <div className="bg-slate-200 h-full w-[25%] border-l border-white"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>1. Harvested</span>
                <span>2. Sorted &amp; Weighed</span>
                <span className="text-emerald-800 font-bold">3. QR Crated</span>
                <span>4. Cold Van Dispatch</span>
              </div>
            </div>

            {/* Destination Route & Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">pin_drop</span>
                <span>Allocated to: <strong className="text-slate-900">Bandra West</strong> &amp; <strong className="text-slate-900">Juhu</strong> Fresh Hubs (31 Orders)</span>
              </div>
              <button
                type="button"
                onClick={() => setQrModalLot('TOM-104')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Generate 18 QR Labels</span>
              </button>
            </div>
          </div>

          {/* Lot 2: Hydroponic Palak Spinach (#SPN-882) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80"
                  alt="Hydroponic Palak Spinach"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      #SPN-882
                    </span>
                    <h3 className="text-base font-extrabold text-[#141b2b]">Hydroponic Palak Spinach</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Polyhouse Pod 2 • Harvested 06:15 AM today</p>
                </div>
              </div>

              <span className="self-start px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold flex items-center gap-1.5 border border-blue-200">
                <span className="material-symbols-outlined text-[16px]">ac_unit</span>
                <span>Pre-cooling Pod: 4.0°C</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Batch Count</span>
                <span className="text-base font-extrabold text-[#141b2b]">120 Bunches</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Cold Van Pickup</span>
                <span className="text-sm font-bold text-blue-700">11:30 AM (Combined)</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Target Shelf-Life</span>
                <span className="text-sm font-semibold text-slate-800">72 Hours (+4°C)</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Direct Escrow Escort</span>
                <span className="text-base font-extrabold text-emerald-700">₹7,200</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl flex flex-col gap-1.5 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-[16px]">snowflake</span>
                  Cold Stabilization Progress
                </span>
                <span className="text-blue-700 font-mono font-bold">Target 4.0°C reached (Pulp: 4.2°C)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">thermostat</span>
                <span>Sensor probe #T99 reports pulp temp locked at 4.2°C</span>
              </span>
              <span className="text-emerald-700 font-bold">Manifest Ready</span>
            </div>
          </div>

          {/* Lot 3: Organic Red Pumpkin (#PUM-310) Pre-Order Pool */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=200&auto=format&fit=crop&q=80"
                  alt="Organic Red Pumpkin"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      #PUM-310
                    </span>
                    <h3 className="text-base font-extrabold text-[#141b2b]">Organic Red Heritage Pumpkin</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Sown Nov 12 • Ripening on vine • Harvest in 4 Days</p>
                </div>
              </div>

              <span className="self-start px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                Pre-Harvest Booking Open
              </span>
            </div>

            <div className="flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-semibold">65% Pre-Purchased (520 kg of 800 kg committed)</span>
                <span className="text-emerald-700 font-bold">₹28/kg locked rate</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live IoT Soil Telemetry & Direct Consumer Feed */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* IoT Soil Probe & Weather Station Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-800 text-[22px]">sensors</span>
                <h3 className="text-base font-bold text-[#141b2b]">Field Pod #04 Telemetry</h3>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                LoRaWAN: Live (2m ago)
              </span>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Soil Moisture */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Soil Moisture</span>
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">water_drop</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-[#141b2b]">64%</span>
                  <span className="text-xs text-emerald-700 font-bold">Optimal</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              {/* Organic Carbon */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Organic Carbon</span>
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">eco</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-[#141b2b]">1.42%</span>
                  <span className="text-xs text-emerald-700 font-bold">Regenerative</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>

            {/* 24h Micro-Climate Trend SVG Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">24h Micro-Climate Trend</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono text-slate-600">Probe #P-48</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-blue-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>Moisture %
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>Temp °C
                  </span>
                </div>
              </div>

              <div className="w-full h-28 relative mt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 380 90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="farmMoistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0058be" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#0058be" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="farmTempGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e29100" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#e29100" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="20" x2="380" y2="20" stroke="#dce2f7" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="0" y1="55" x2="380" y2="55" stroke="#dce2f7" strokeDasharray="3 3" strokeWidth="1" />
                  <path d="M 0,65 Q 60,60 120,48 T 240,38 T 320,42 T 380,30 L 380,90 L 0,90 Z" fill="url(#farmMoistGrad)" />
                  <path d="M 0,65 Q 60,60 120,48 T 240,38 T 320,42 T 380,30" fill="none" stroke="#0058be" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 0,40 Q 70,30 140,22 T 260,28 T 330,45 T 380,50 L 380,90 L 0,90 Z" fill="url(#farmTempGrad)" />
                  <path d="M 0,40 Q 70,30 140,22 T 260,28 T 330,45 T 380,50" fill="none" stroke="#e29100" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />
                  <circle cx="380" cy="30" r="3.5" fill="#0058be" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="380" cy="50" r="3.5" fill="#e29100" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-1 border-t border-slate-200">
                <span>00:00</span>
                <span>06:00 (Dawn)</span>
                <span>12:00</span>
                <span>Now (14:30)</span>
                <span className="text-emerald-700 font-bold">Health: 99.8%</span>
              </div>
            </div>

            {/* NPK Soil Nutrition Levels */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase">Soil N-P-K Balance (kg/ha)</span>
                <span className="text-slate-500 font-mono">Calibrated via NIR Probe</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800 font-medium">Nitrogen (N)</span>
                    <span className="font-mono font-bold text-slate-900">298 kg/ha <span className="text-emerald-700 font-normal">(Optimal 280-320)</span></span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800 font-medium">Phosphorus (P)</span>
                    <span className="font-mono font-bold text-slate-900">48 kg/ha <span className="text-emerald-700 font-normal">(Adequate 40-55)</span></span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800 font-medium">Potassium (K)</span>
                    <span className="font-mono font-bold text-slate-900">340 kg/ha <span className="text-emerald-700 font-normal">(Rich 300-380)</span></span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solar Micro-Drip Status */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">solar_power</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Solar Micro-Drip Irrigation</p>
                  <p className="text-[11px] text-slate-600">Next cycle: <strong>02:00 PM</strong> (Conserving 62% groundwater)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('Solar irrigation pump cycle override executed.')}
                className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs cursor-pointer hover:bg-emerald-50"
              >
                Override
              </button>
            </div>
          </div>

          {/* Direct Consumer Feed & Voice Memos */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">record_voice_over</span>
                <h3 className="text-base font-bold text-[#141b2b]">Direct Buyer Voice Inquiries</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                1 Action Required
              </span>
            </div>

            {/* Audio Query Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-xs">
                    PS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">Priya Sharma</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">verified</span>Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">Pre-ordered 3kg Desi Tomatoes • Bandra West Hub</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">08:14 AM</span>
              </div>

              {/* Audio Waveform Player */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAudioPlaying(!isAudioPlaying);
                      triggerToast(isAudioPlaying ? 'Voice playback paused' : 'Playing voice note from Priya Sharma (18s)');
                    }}
                    className="w-9 h-9 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0 hover:bg-emerald-700 transition-transform active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isAudioPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  {/* Waveform Graphic */}
                  <div className="flex-1 flex items-center gap-1 h-7 px-2 bg-slate-50 rounded-lg">
                    {[30, 50, 70, 90, 60, 85, 45, 95, 60, 40, 75, 55, 30].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-1 rounded-full transition-all ${
                          isAudioPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-slate-300'
                        }`}
                      ></span>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-500">0:18</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span>Playback: 1.0x</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                    Audio Transcribed (AI)
                  </span>
                </div>
              </div>

              {/* Transcribed Memo */}
              <div className="bg-emerald-50/60 p-3 rounded-xl border-l-4 border-emerald-600 text-xs text-slate-800 italic">
                “Can we request slightly firmer tomatoes for our weekend salad prep? Much appreciated Rameshji!”
              </div>

              {/* Quick Tap Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Quick Tap:</span>
                <button
                  type="button"
                  onClick={() => triggerToast('Quick Response: Firm crate flagged for Bandra batch.')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  “Will pack firm batch 👍”
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Quick Response: Morning harvest dispatch confirmed.')}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  “Harvested at dawn fresh 🌱”
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => triggerToast('Microphone activated. Recording 15s quick audio reply to Priya Sharma...')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  <span>Send Voice Reply</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('Batch #TOM-104 Crate #07 flagged: "Firm Harvest for Weekend Salads" attached to Priya Sharma\'s order.')}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">check_circle</span>
                  <span>Tag Crate &quot;Firm Select&quot;</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Consumer Dispute Rate: <strong>0.00% (Past 90 Days)</strong></span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">shield</span> PGS Direct Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Harvest Batch Modal */}
      {isLogBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">add_circle</span>
                <span>Log New Morning Harvest Batch</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLogBatchOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Produce / Crop Name *</label>
                <input
                  type="text"
                  required
                  value={newBatchCrop}
                  onChange={(e) => setNewBatchCrop(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crates Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newBatchCrates}
                    onChange={(e) => setNewBatchCrates(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Weight (Kg)</label>
                  <input
                    type="number"
                    min="1"
                    value={newBatchWeight}
                    onChange={(e) => setNewBatchWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cold-Chain Reefer Class</label>
                <select
                  value={newBatchColdClass}
                  onChange={(e) => setNewBatchColdClass(e.target.value as any)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Fruits (8-10°C)">Fruits (8-10°C - Tomatoes, Apples, Guava)</option>
                  <option value="Leafy (2-4°C)">Leafy Greens (2-4°C - Spinach, Herbs)</option>
                  <option value="Dairy (1-3°C)">Dairy / Milk (1-3°C - Raw Milk Cans)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 border border-emerald-200 flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
                <span>Automatic origin lock: Plots #4 &amp; #2 Dindori cluster will be embedded in QR labels.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogBatchOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Publish Batch &amp; Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Print Preview Modal */}
      {qrModalLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">Thermal Crate QR Label</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block">
              <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center border border-slate-200 shadow-xs">
                {/* Visual SVG QR Code representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="10" y="10" width="25" height="25" fill="#000" />
                  <rect x="15" y="15" width="15" height="15" fill="#fff" />
                  <rect x="18" y="18" width="9" height="9" fill="#000" />
                  <rect x="65" y="10" width="25" height="25" fill="#000" />
                  <rect x="70" y="15" width="15" height="15" fill="#fff" />
                  <rect x="73" y="18" width="9" height="9" fill="#000" />
                  <rect x="10" y="65" width="25" height="25" fill="#000" />
                  <rect x="15" y="70" width="15" height="15" fill="#fff" />
                  <rect x="18" y="73" width="9" height="9" fill="#000" />
                  <rect x="42" y="12" width="6" height="6" fill="#000" />
                  <rect x="52" y="18" width="6" height="6" fill="#000" />
                  <rect x="42" y="42" width="16" height="16" fill="#006c49" />
                  <rect x="70" y="45" width="8" height="8" fill="#000" />
                  <rect x="80" y="60" width="8" height="8" fill="#000" />
                  <rect x="65" y="75" width="12" height="12" fill="#000" />
                  <rect x="45" y="70" width="8" height="8" fill="#000" />
                </svg>
              </div>
              <p className="font-mono font-bold text-xs text-slate-800 mt-2">LOT #{qrModalLot}-CRATE-01</p>
              <p className="text-[10px] text-slate-500">Ramesh Patel • 05:30 AM • 4.1°C Target</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQrModalLot(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerToast('18 Labels sent to Bluetooth printer!');
                  setQrModalLot(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
              >
                Print All 18
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
