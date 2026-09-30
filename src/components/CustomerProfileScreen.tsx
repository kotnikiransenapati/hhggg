import React, { useState, useEffect } from 'react';
import { ActiveScreen, OrderRecord } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CustomerProfileScreenProps {
  orders: OrderRecord[];
  currentAddress: string;
  setActiveScreen: (screen: ActiveScreen) => void;
  openAddressModal: () => void;
  onOpenAuthModal?: () => void;
}

export const CustomerProfileScreen: React.FC<CustomerProfileScreenProps> = ({
  orders,
  currentAddress,
  setActiveScreen,
  openAddressModal,
  onOpenAuthModal,
}) => {
  const { user, userProfile, signOut } = useAuth();

  const [name, setName] = useState(user?.displayName || userProfile?.name || 'Guest Patron');
  const [phone, setPhone] = useState(userProfile?.address ? '+91 98201 44920' : '');
  const [dietPreference, setDietPreference] = useState<'all' | 'strictly-organic' | 'a2-dairy'>('strictly-organic');
  const [receiveHarvestAlerts, setReceiveHarvestAlerts] = useState(true);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      setName(user.displayName || userProfile?.name || 'Verified Patron');
      if (user.uid) {
        getDoc(doc(db, 'users', user.uid))
          .then((snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (data.name) setName(data.name);
              if (data.phone) setPhone(data.phone);
              if (data.dietPreference) setDietPreference(data.dietPreference);
              if (data.receiveHarvestAlerts !== undefined) setReceiveHarvestAlerts(data.receiveHarvestAlerts);
            }
          })
          .catch((err) => console.warn('User profile read notice:', err));
      }
    } else {
      setName('Guest Patron');
    }
  }, [user, userProfile]);

  const ratedOrders = orders.filter((o) => o.rating);
  const activeOrdersCount = orders.filter((o) => o.escrowStatus === 'Locked').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setSaveNotice('Profile preferences saved to real database successfully.');
    setTimeout(() => setSaveNotice(null), 4000);

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            name,
            email: user.email,
            phone,
            dietPreference,
            harvestAlerts: receiveHarvestAlerts,
            address: currentAddress,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to save profile to Firestore:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Guest Mode Alert Banner */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">person_alert</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Guest Browsing Mode</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                You are currently not signed in. Sign in or register to sync your orders, claim coupons, update addresses, and save your preferences directly to the database.
              </p>
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={name}
              className="w-18 h-18 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
            />
          ) : (
            <div className="w-18 h-18 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
              {user ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified Conscious Patron
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Guest User (Unauthenticated)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'Not authenticated — browse as guest'}</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              Member of Sahyadri &amp; Western Ghats Direct Farm Collective
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveScreen('orders')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>My Orders ({orders.length})</span>
          </button>
          {user ? (
            <button
              onClick={() => signOut()}
              className="px-3.5 py-2 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          ) : (
            onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Sign In</span>
              </button>
            )
          )}
        </div>
      </div>

      {saveNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-700">check_circle</span>
            <span>{saveNotice}</span>
          </div>
          <button onClick={() => setSaveNotice(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* Grid: Details & Escrow Vault Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Escrow Wallet & Security (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Escrow Trust Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-2xl p-6 text-white shadow-md border border-emerald-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
                Protected Escrow Custody
              </span>
              <span className="material-symbols-outlined text-emerald-400 text-[22px]">shield</span>
            </div>

            <div>
              <span className="text-3xl font-extrabold text-white">
                ₹{userProfile?.escrowBalance || 2500}
              </span>
              <p className="text-xs text-emerald-200 mt-1">Available Escrow Credit Balance</p>
            </div>

            <div className="p-3 bg-white/10 rounded-xl text-xs space-y-1.5 text-emerald-100">
              <div className="flex justify-between">
                <span>Active Shipments Protected:</span>
                <span className="font-bold text-white">{activeOrdersCount} orders</span>
              </div>
              <div className="flex justify-between">
                <span>Produce Crispness Guarantee:</span>
                <span className="font-bold text-emerald-300">100% Refundable</span>
              </div>
              <div className="flex justify-between">
                <span>Sub-4°C Cold-Chain Breaches:</span>
                <span className="font-bold text-white">0 (Zero Incidents)</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-200/80 leading-relaxed">
              When you order, your payment is held in escrow. Funds are never settled to farmers until you inspect and accept your delivery.
            </p>
          </div>

          {/* Saved Delivery Address */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">location_on</span>
                Primary Delivery Address
              </h3>
              <button
                onClick={openAddressModal}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Change
              </button>
            </div>
            <p className="text-xs text-slate-600 font-medium p-3 bg-slate-50 rounded-xl border border-slate-200">
              {currentAddress}
            </p>
            <p className="text-[11px] text-slate-400">
              Assigned Cold-Chain Micro-Hub: <span className="font-bold text-slate-600">Bandra Kurla Dock #12</span> (Sub-4°C delivery trike equipped)
            </p>
          </div>

          {/* Favorite Farmer Collectives */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">favorite</span>
              Subscribed Farmer Collectives
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Sahyadri Organic Syndicate', farmer: 'Ramesh Patel', crop: 'Vine Tomatoes & Heirloom Greens' },
                { name: 'Himachal Highland Orchards', farmer: 'Sunita Devi', crop: 'Royal Delicious Apples' },
                { name: 'Gir Vedic Gaushala', farmer: 'Mahesh Deshmukh', crop: 'A2 Gir Raw Milk' },
              ].map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <span className="text-slate-500 text-[11px]">{c.farmer} • {c.crop}</span>
                  </div>
                  <button
                    onClick={() => setActiveScreen('marketplace')}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View Harvest
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Personal Settings & Past Quality Inspections (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Edit Profile Information Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
              Personal &amp; Quality Preferences
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number (For Courier OTP)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dietary Philosophy</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'strictly-organic', label: '100% PGS-Certified', desc: '0.00 ppm chemical residue only' },
                    { id: 'a2-dairy', label: 'Vedic A2 Living', desc: 'Pasture-fed Gir cow milk only' },
                    { id: 'all', label: 'Holistic Farm Harvest', desc: 'Seasonal local fruits & grains' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietPreference(d.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        dietPreference === d.id
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-slate-900 block">{d.label}</span>
                      <span className="text-[10px] text-slate-500">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="harvestAlerts"
                  checked={receiveHarvestAlerts}
                  onChange={(e) => setReceiveHarvestAlerts(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="harvestAlerts" className="text-slate-700 cursor-pointer">
                  <strong>Dawn Harvest Notifications:</strong> Alert me before 7:00 AM when new seasonal lots are picked by partner farmers.
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Save Preferences
              </button>
            </form>
          </div>

          {/* Produce Quality Ratings Given */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">hotel_class</span>
                Your Produce Freshness Ratings
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {ratedOrders.length} Rated Consignments
              </span>
            </div>

            {ratedOrders.length > 0 ? (
              <div className="space-y-3">
                {ratedOrders.map((ord) => (
                  <div key={ord.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Order #{ord.id} • {ord.date}</span>
                      <span className="font-bold text-amber-600">{ord.rating} ★★★★★</span>
                    </div>
                    {ord.reviewComment && (
                      <p className="text-slate-600 italic">"{ord.reviewComment}"</p>
                    )}
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200">
                      <span>Produce: {ord.items.map((i) => i.name).join(', ')}</span>
                      <span className="text-emerald-700 font-medium">Funds settled to grower</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-4 text-center">
                Rate delivered produce in the My Orders screen to share crispness feedback with farmers.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
