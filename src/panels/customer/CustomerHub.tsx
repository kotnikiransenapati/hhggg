import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services/firestoreService';
import { OrderRecord } from '../../types';

interface CustomerHubProps {
  onNavigateToSupport?: () => void;
  onOpenTrace?: (batchId: string) => void;
}

export const CustomerHub: React.FC<CustomerHubProps> = ({
  onNavigateToSupport,
  onOpenTrace,
}) => {
  const [isEscrowReleased, setIsEscrowReleased] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeOrders, setActiveOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    firestoreService.getOrders().then((orders) => {
      if (orders && orders.length > 0) {
        setActiveOrders(orders);
        const target = orders.find((o) => o.id === 'FD-8921');
        if (target && target.escrowStatus === 'Inspected & Released') {
          setIsEscrowReleased(true);
        }
      }
    });

    const unsub = firestoreService.listenOrders((orders) => {
      if (orders && orders.length > 0) {
        setActiveOrders(orders);
        const target = orders.find((o) => o.id === 'FD-8921');
        if (target && target.escrowStatus === 'Inspected & Released') {
          setIsEscrowReleased(true);
        }
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

  const handleDisburseEscrow = async () => {
    setIsEscrowReleased(true);
    triggerToast('Escrow released! ₹845.00 disbursed directly to Ramesh Patel & Rajesh Sharma. Synced to Firestore.');

    try {
      await firestoreService.releaseOrderEscrow('FD-8921');
    } catch (err) {
      console.error('Failed to sync escrow release to Firestore:', err);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 pb-12 font-sans text-[#141b2b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141b2b] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Level Metric & Welcome Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#006c49]">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="text-xs uppercase tracking-wider font-bold">
              Decentralized Direct-to-Consumer Escrow
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#141b2b] tracking-tight">
            Active Harvest Dispatch Hub
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Live cold-chain tracking, farm-gate provenance ledger, and verified organic batch manifests for your household.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch lg:self-auto">
          <div className="flex-1 lg:flex-none flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">account_balance_wallet</span>
            <div>
              <span className="text-[11px] text-slate-500 block">Protected Escrow</span>
              <span className="text-base font-extrabold text-[#141b2b]">₹898.45</span>
            </div>
          </div>
          <div className="flex-1 lg:flex-none flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-emerald-700 text-[24px]">autorenew</span>
            <div>
              <span className="text-[11px] text-slate-500 block">Crate Deposit</span>
              <span className="text-base font-extrabold text-emerald-700">₹90.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Live Active Order Spotlight & Telemetry */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols: Timeline, Items & Telemetry Map */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-900 font-mono text-xs font-bold tracking-wide">
                  ORDER #FD-8921
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Reefer Sprinter #04 En Route
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="material-symbols-outlined text-[18px] text-amber-600">schedule</span>
                <span>Target Drop: <strong className="text-slate-900 font-bold">11:45 AM Today</strong> (18 mins remaining)</span>
              </div>
            </div>

            {/* 4-Stage Interactive Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono font-bold">01. HARVEST</span>
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Farm Plucked</p>
                <span className="text-[11px] text-slate-500">05:30 AM • Dindori, Nashik</span>
                <div className="w-full bg-[#006c49] h-1 rounded-full mt-1.5"></div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono font-bold">02. PURIFY</span>
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Ozone Pre-Cool</p>
                <span className="text-[11px] text-slate-500">07:15 AM • 4°C Hydro-Dip</span>
                <div className="w-full bg-[#006c49] h-1 rounded-full mt-1.5"></div>
              </div>

              {/* Step 3 (Active) */}
              <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-blue-700 font-mono font-bold">03. COLD TRANSIT</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">Sprinter #04</p>
                <span className="text-[11px] text-blue-700 font-bold">Western Exp. Hwy • +3.8°C</span>
                <div className="w-full bg-blue-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full w-3/4 rounded-full"></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50 opacity-80 p-3.5 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold">04. ESCROW DROP</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">radio_button_unchecked</span>
                </div>
                <p className="text-xs font-bold text-slate-900">Crisp Inspection</p>
                <span className="text-[11px] text-slate-500">ETA: 11:45 AM • 5m Window</span>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5"></div>
              </div>
            </div>

            {/* Reefer Sprinter #04 Driver & Telemetry Banner */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
              <div className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">Santosh Khot</p>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Verified Reefer Pilot
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Mercedes Sprinter 416 CDI • MH-04-EK-9021 • BLE Mesh #714
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerToast('Connecting live in-cab intercom with driver Santosh...')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-600">chat</span>
                    <span>Live Dispatch Chat</span>
                  </button>
                  <a
                    href="tel:+919820199021"
                    className="px-3.5 py-1.5 bg-[#006c49] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Call Santosh</span>
                  </a>
                </div>
              </div>

              {/* Sensor Log & Waypoints Grid */}
              <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* SVG Temperature Sparkline Chart (7 cols) */}
                <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">show_chart</span>
                      <span>Cold-Chain Sensor Log</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live BLE: +3.8°C
                    </span>
                  </div>

                  <div className="w-full py-1">
                    <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 90">
                      <defs>
                        <linearGradient id="tempGradCust" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2170e4" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#2170e4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="18" x2="400" y2="18" stroke="#ba1a1a" strokeDasharray="3,3" strokeWidth="1" opacity="0.6" />
                      <text x="400" y="15" textAnchor="end" fill="#ba1a1a" fontSize="9" fontFamily="monospace">
                        Max Limit +5.0°C
                      </text>
                      <line x1="0" y1="75" x2="400" y2="75" stroke="#bbcabf" strokeDasharray="2,2" strokeWidth="1" />
                      <path d="M 0,55 Q 60,62 120,48 T 240,52 T 320,40 T 400,46 L 400,90 L 0,90 Z" fill="url(#tempGradCust)" />
                      <path d="M 0,55 Q 60,62 120,48 T 240,52 T 320,40 T 400,46" fill="none" stroke="#0058be" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="120" cy="48" r="3.5" fill="#0058be" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="240" cy="52" r="3.5" fill="#0058be" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="320" cy="40" r="3.5" fill="#0058be" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="400" cy="46" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="10" y="86" fill="#6c7a71" fontSize="9">07:30 (Nashik 3.4°)</text>
                      <text x="130" y="86" fill="#6c7a71" fontSize="9">09:15 (Kasara 4.1°)</text>
                      <text x="260" y="86" fill="#6c7a71" fontSize="9">10:40 (Thane 3.7°)</text>
                      <text x="360" y="86" fill="#006c49" fontWeight="bold" fontSize="9">Now: 3.8°C</text>
                    </svg>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-emerald-700">ac_unit</span>
                      Humidity: 88% RH (Crispness Locked)
                    </span>
                    <span className="font-mono text-slate-400">Tamper Seal #9921: Intact</span>
                  </div>
                </div>

                {/* Waypoints (5 cols) */}
                <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Route Waypoints</span>
                    <span className="text-[11px] text-amber-700 font-mono font-bold">18 mins to doorstep</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Dindori Gate Hub</p>
                        <p className="text-[10px] text-slate-400">Dispatched 07:15 AM</p>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">+3.2°C</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Bhiwandi Cold Node</p>
                        <p className="text-[10px] text-slate-400">Check-in 10:12 AM</p>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">+3.9°C</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-[18px] animate-pulse">radio_button_checked</span>
                      <div className="flex-1">
                        <p className="font-bold text-blue-700">Western Exp. Flyover</p>
                        <p className="text-[10px] text-slate-500">4.2 km away • Speed 42 km/h</p>
                      </div>
                      <span className="font-mono text-[11px] text-blue-700 font-bold">+3.8°C</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs text-slate-600 border border-slate-200/80">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-emerald-700">pin_drop</span>
                      Delivery Address
                    </span>
                    <span className="font-bold text-slate-900">Apt 702, Bandra W</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Packed Produce Manifest (4 Verified Lots) */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Packed Produce Manifest (4 Verified Lots)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => onOpenTrace?.('NSK-881')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&auto=format&fit=crop&q=80"
                    alt="Vine Tomatoes"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Vine-Ripened Hybrid Red Tomatoes</p>
                    <p className="text-[11px] text-slate-500">1.2 kg • Lot #NSK-881</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    Zero Residue
                  </span>
                </div>

                <div
                  onClick={() => onOpenTrace?.('KTG-019')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&auto=format&fit=crop&q=80"
                    alt="Shimla Apples"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">High Altitude Shimla Royal Apples</p>
                    <p className="text-[11px] text-slate-500">1.5 kg • Lot #KTG-019</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    Brix 14.8°
                  </span>
                </div>

                <div
                  onClick={() => onOpenTrace?.('PNE-402')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150&auto=format&fit=crop&q=80"
                    alt="Hydroponic Spinach"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Roots-On Hydroponic Baby Spinach</p>
                    <p className="text-[11px] text-slate-500">250g Clamshell • Lot #PNE-402</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    Living Root
                  </span>
                </div>

                <div
                  onClick={() => onOpenTrace?.('NSK-002')}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=80"
                    alt="A2 Gir Milk"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Raw Gir Cow A2 Milk (Sanitized Bottle)</p>
                    <p className="text-[11px] text-slate-500">2 Litres • Lot #NSK-002</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold">
                    Chilled 3.2°C
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Minute Crispness Check Window Banner Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">shield_locked</span>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-extrabold">
                  5 MIN
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 uppercase">
                    Decentralized Escrow Contract #ESC-8921
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Mesh-Protected
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-[#141b2b]">5-Minute Crispness Check Window</h2>
                <p className="text-xs text-slate-600 max-w-xl">
                  Your ₹898.45 deposit is locked in escrow. When courier Santosh arrives, open the insulated bio-crate: inspect produce firmness, sniff fresh aroma, and check temperature seal. Disburse only if delighted.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleDisburseEscrow}
                disabled={isEscrowReleased}
                className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  isEscrowReleased
                    ? 'bg-slate-200 text-slate-500 cursor-default'
                    : 'bg-[#006c49] hover:bg-[#005236] text-white active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEscrowReleased ? 'done_all' : 'verified'}
                </span>
                <span>{isEscrowReleased ? 'Released to Ramesh & Rajesh' : 'Accept & Disburse ₹845.00'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToSupport?.()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-600">flag</span>
                <span>Report Softness / Blemish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Eco-Crate Wallet & Provenance Breakdown */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Eco-Crate & Returnable Assets Wallet */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c49] text-[22px]">recycling</span>
                <h3 className="text-base font-bold text-[#141b2b]">Returnable Crate Asset Wallet</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Live Loop
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Zero single-use packaging. Glass bottles and breathable banana-bark crates are collected, autoclaved, and recirculated.
            </p>

            {/* Assets list */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">wine_bar</span>
                  Sanitized Glass Bottles (1L)
                </span>
                <span className="font-mono font-bold text-slate-900">3 Units</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">shopping_bag</span>
                  Woven Banana-Bark Crates
                </span>
                <span className="font-mono font-bold text-slate-900">2 Units</span>
              </div>
            </div>

            {/* Deposit Card */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Auto-Refund Balance</span>
                <span className="text-2xl font-extrabold text-[#006c49]">₹90.00</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-900 block">Hand over to Santosh</span>
                <span className="text-[11px] text-emerald-700">Instant UPI / Wallet Credit</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400">info</span>
              <span>Courier carries contactless QR scanner for instant deposit release.</span>
            </div>
          </div>

          {/* Financial Provenance Donut Chart Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#141b2b]">Financial Provenance</h3>
              <span className="text-xs font-mono font-bold text-emerald-700">94.1% Direct</span>
            </div>
            <p className="text-xs text-slate-500">Real-time settlement breakdown for Order #FD-8921.</p>

            {/* Visual SVG Donut */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeDasharray="100" strokeDashoffset="6" strokeLinecap="round" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#006c49" strokeWidth="4.5" strokeDasharray="94.1 100" strokeDashoffset="0" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-extrabold text-[#006c49]">94%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Direct</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                      <span className="font-semibold text-slate-800">Farmer Gate Payout</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-800">₹845.00</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="font-semibold text-slate-800">Cold-Chain Transit</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700">₹53.45</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Platform Commission</span>
                <span className="font-bold text-emerald-700">₹0.00 (100% Subsidized)</span>
              </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Total Escrow Balance</span>
              <span className="font-mono font-extrabold text-sm text-slate-900">₹898.45</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Verified Producer Ledger & Organic Certifications */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">
              Provenance &amp; Zero Chemical Audits
            </span>
            <h2 className="text-2xl font-extrabold text-[#141b2b]">Your Producers for This Harvest</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">verified</span>
            <span>Spectrometry Lab Checked: 0.00 ppm organophosphates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ramesh Patel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
                  alt="Ramesh Patel"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Ramesh Patel</h4>
                  <p className="text-xs text-slate-500">Dindori, Nashik (Maharashtra)</p>
                  <p className="text-[11px] text-[#006c49] font-mono font-semibold">Gir Amrit Eco-Holding #44</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Harvest Supplied:</span>
                  <span className="font-semibold text-slate-900">Vine Tomatoes (1.2kg), A2 Milk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Soil Regenerative:</span>
                  <span className="font-semibold text-emerald-700">Jeevamrutha &amp; Mulch</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Direct Farm Payout:</span>
                  <span className="font-mono font-extrabold text-sm text-[#006c49]">₹410.00</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => triggerToast('Message dialog opened for Ramesh Patel.')}
                className="text-[#006c49] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Note to Ramesh</span>
              </button>
              <span className="text-slate-400">Harvested 05:30 AM</span>
            </div>
          </div>

          {/* Rajesh Sharma */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Rajesh Sharma"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Rajesh Sharma</h4>
                  <p className="text-xs text-slate-500">Kotgarh Valley (Himachal)</p>
                  <p className="text-[11px] text-[#006c49] font-mono font-semibold">Altitude: 2,150m MSL</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Harvest Supplied:</span>
                  <span className="font-semibold text-slate-900">Shimla Royal Apples (1.5kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Orchard Method:</span>
                  <span className="font-semibold text-emerald-700">Glacial Meltwater Runoff</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Direct Farm Payout:</span>
                  <span className="font-mono font-extrabold text-sm text-[#006c49]">₹335.00</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => triggerToast('Message dialog opened for Rajesh Sharma.')}
                className="text-[#006c49] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Note to Rajesh</span>
              </button>
              <span className="text-slate-400">Harvested Yesterday</span>
            </div>
          </div>

          {/* Chemical Residue Audit Certificate */}
          <div className="bg-slate-100 rounded-2xl p-6 border border-slate-300 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">biotech</span>
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-white text-[#006c49] font-mono text-[10px] font-bold">
                      PGS-99238
                    </span>
                    <p className="text-[11px] text-slate-500">Gas Chromatography</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#006c49] text-[24px]">verified</span>
              </div>

              <h4 className="text-base font-bold text-slate-900">Chemical Residue Audit</h4>

              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-slate-500">Organophosphates:</span>
                    <span className="font-bold font-mono text-[#006c49]">0.00 ppm</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#006c49] h-full w-0"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-slate-500">Heavy Metals (Pb/Cd):</span>
                    <span className="font-bold font-mono text-[#006c49]">0.00 ppm</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#006c49] h-full w-0"></div>
                  </div>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Pathogenic Coliforms:</span>
                  <span className="font-bold font-mono text-[#006c49]">Negative (Zero)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerToast('Lab Report PDF downloaded: PGS-99238 certified clean.')}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#006c49] rounded-xl text-xs font-bold border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download NPOP &amp; Lab Certificate PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Subscribed Farm Circles (CSA) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Community Supported Agriculture (CSA)
            </span>
            <h3 className="text-xl font-extrabold text-[#141b2b]">Your Subscribed Farm Circles</h3>
          </div>
          <button
            type="button"
            onClick={() => triggerToast('Full 2024 Crop Almanac loaded.')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>Full 2024 Crop Almanac</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alphonso Mangoes */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&auto=format&fit=crop&q=80"
              alt="Ratnagiri Alphonso"
              className="w-full sm:w-40 h-36 object-cover rounded-xl shrink-0"
            />
            <div className="flex flex-col justify-between h-full w-full gap-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Pre-Flowering Phase
                  </span>
                  <span className="text-[11px] text-slate-500">Ratnagiri, MH</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">Single-Estate Ratnagiri Alphonso</h4>
                <p className="text-xs text-slate-600">
                  Naturally ripened without carbide. Tree allocation secured for 2 wooden boxes (24 units).
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Pre-Bookings Open In</span>
                  <span className="text-xs font-bold text-amber-700 font-mono">14 Days (April Dispatch)</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('Reserved 2 boxes of Ratnagiri Alphonso!')}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  Reserve Box
                </button>
              </div>
            </div>
          </div>

          {/* Sangli Turmeric */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&auto=format&fit=crop&q=80"
              alt="Cured Turmeric"
              className="w-full sm:w-40 h-36 object-cover rounded-xl shrink-0"
            />
            <div className="flex flex-col justify-between h-full w-full gap-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    Shade Curing &amp; Polishing
                  </span>
                  <span className="text-[11px] text-slate-500">Sangli, MH</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">Salem-Hybrid Cured Turmeric</h4>
                <p className="text-xs text-slate-600">
                  High curcumin content (5.2%). Ground fresh from cold-crushed roots, dispatched unadulterated.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Dispatch Timeline</span>
                  <span className="text-xs font-bold text-[#006c49] font-mono">Next Tuesday</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('Share managed: 1kg fresh cold-crushed root confirmed.')}
                  className="px-4 py-1.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold cursor-pointer"
                >
                  Manage Share (1kg)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
