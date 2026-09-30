import React, { useState, useEffect } from 'react';
import { ProduceItem, CartItem, ActiveScreen } from '../types';

interface MarketplaceScreenProps {
  produceList: ProduceItem[];
  cart: CartItem[];
  wishlist?: ProduceItem[];
  onToggleWishlist?: (item: ProduceItem) => void;
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onUpdateCartQty: (itemId: string, newQty: number) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenTrace: (batchId: string) => void;
  onOpenCart: () => void;
  searchQuery: string;
  onOpenPriceHistory?: (item: ProduceItem) => void;
  onOpenWaitlist?: (item: ProduceItem) => void;
  onOpenComparison?: (items: ProduceItem[]) => void;
  onOpenVendorStorefront?: (farmerName: string) => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  produceList,
  cart,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQty,
  setActiveScreen,
  onOpenTrace,
  onOpenCart,
  searchQuery,
  onOpenPriceHistory,
  onOpenWaitlist,
  onOpenComparison,
  onOpenVendorStorefront,
}) => {
  // Category tab state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [comparedItems, setComparedItems] = useState<ProduceItem[]>([]);

  // Filter states
  const [harvestWindowFilter, setHarvestWindowFilter] = useState<{ [key: string]: boolean }>({
    'picked-today': true,
    'under-24h': true,
    'pre-harvest': false,
  });

  const [accreditationFilter, setAccreditationFilter] = useState<{ [key: string]: boolean }>({
    npop: true,
    jaivik: true,
    pgs: false,
    hydro: false,
  });

  const [dispatchRadius, setDispatchRadius] = useState<number>(50);
  const [maxBudget, setMaxBudget] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('freshness');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Per-card local quantity state
  const [cardQuantities, setCardQuantities] = useState<{ [key: string]: number }>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Reset all product card cards, steppers, and badges whenever cart is cleared / after every order
  useEffect(() => {
    if (cart.length === 0) {
      setCardQuantities({});
      setJustAddedId(null);
    }
  }, [cart]);

  // Live Countdown Timer (1h 42m 19s)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  const getCardQty = (id: string) => cardQuantities[id] || 1;

  const handleStepQty = (id: string, delta: number) => {
    setCardQuantities((prev) => {
      const current = prev[id] || 1;
      const updated = Math.max(1, current + delta);
      return { ...prev, [id]: updated };
    });
  };

  const handleAdd = (item: ProduceItem) => {
    const qty = getCardQty(item.id);
    onAddToCart(item, qty);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  const handleResetFilters = () => {
    setDispatchRadius(50);
    setMaxBudget(1000);
    setSelectedCategory('all');
    setSortBy('freshness');
    setHarvestWindowFilter({
      'picked-today': true,
      'under-24h': true,
      'pre-harvest': false,
    });
    setAccreditationFilter({
      npop: true,
      jaivik: true,
      pgs: false,
      hydro: false,
    });
  };

  // Filter produce
  const filteredProduce = produceList.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.farmer.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'leafy' && item.category !== 'leafy') return false;
      if (selectedCategory === 'fruits' && item.category !== 'fruits') return false;
      if (selectedCategory === 'dairy' && item.category !== 'dairy') return false;
      if (selectedCategory === 'special' && item.category !== 'special') return false;
      if (selectedCategory === 'sameday' && item.harvestHoursAgo > 6) return false;
    }

    if (item.price > maxBudget) return false;
    if (item.distanceKm > dispatchRadius + 50) return false;

    return true;
  });

  // Sort produce
  const sortedProduce = [...filteredProduce].sort((a, b) => {
    if (sortBy === 'freshness') return a.harvestHoursAgo - b.harvestHoursAgo;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="flex flex-col w-full pb-24">
      {/* 1. Calm, Clean Announcement Bar */}
      <section className="w-full bg-slate-900 text-white py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-medium text-slate-200">
              Nashik &amp; Pune organic clusters arriving by{' '}
              <strong className="text-emerald-300 font-semibold">11:00 AM Today</strong> — 100% Traceable, Zero Middlemen
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400 uppercase tracking-wider text-[11px]">Order Cutoff:</span>
              <span className="font-mono font-semibold text-emerald-300 tabular-nums">
                {formatCountdown(secondsRemaining)}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-600">·</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400">Cold Chain:</span>
              <span className="font-semibold text-sky-300">+3.8°C Steady</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Simplified Category Tab Navigation */}
      <section className="w-full bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Produce', icon: 'dataset' },
              { id: 'leafy', label: 'Crispy Greens', icon: 'psychiatry' },
              { id: 'fruits', label: 'Heirloom Fruits', icon: 'nutrition' },
              { id: 'dairy', label: 'Cold-Pressed A2 Dairy', icon: 'water_drop' },
              { id: 'special', label: 'Artisanal & Oils', icon: 'eco' },
              { id: 'sameday', label: 'Same Day Harvest Only', icon: 'local_shipping' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Filter toggle for mobile/small screens */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="freshness">Freshness: Newest First</option>
              <option value="distance">Distance: Nearest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6 w-full">
        {/* Spotlight Cluster Banner: Cleaned and elegant */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">agriculture</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Spotlight Cluster
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> Nashik Valley, MH
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Ramesh Patel Organic Agro Cluster
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Federation of 48 certified smallholders · 100% direct D2C logistics corridor · Soil health verified
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  ★ 4.9 <span className="text-slate-400 font-normal">(1,420 reviews)</span>
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">0.00 ppm chemical residue</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-slate-400">Batch #NSK-OCT-410</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveScreen('traceability')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Cluster Map</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* 2-Column Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Streamlined Filter Panel (3 Cols) */}
          <aside
            className={`lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 ${
              showFiltersMobile ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-emerald-700 hover:underline font-medium cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Harvest Time Window */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Harvest Window
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={harvestWindowFilter['picked-today']}
                    onChange={(e) =>
                      setHarvestWindowFilter({ ...harvestWindowFilter, 'picked-today': e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  <span>Picked Today (&lt;6 hours)</span>
                  <span className="ml-auto text-slate-400 font-mono text-[11px]">14</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={harvestWindowFilter['under-24h']}
                    onChange={(e) =>
                      setHarvestWindowFilter({ ...harvestWindowFilter, 'under-24h': e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  <span>Harvested &lt;24 hours</span>
                  <span className="ml-auto text-slate-400 font-mono text-[11px]">28</span>
                </label>
              </div>
            </div>

            {/* Organic Accreditation */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Accreditation
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={accreditationFilter.npop}
                    onChange={(e) =>
                      setAccreditationFilter({ ...accreditationFilter, npop: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  <span>NPOP Certified (Govt. India)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={accreditationFilter.jaivik}
                    onChange={(e) =>
                      setAccreditationFilter({ ...accreditationFilter, jaivik: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  <span>Jaivik Bharat Mark</span>
                </label>
              </div>
            </div>

            {/* Dispatch Radius Slider */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Dispatch Radius</span>
                <span className="font-bold text-emerald-700">{dispatchRadius} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={dispatchRadius}
                onChange={(e) => setDispatchRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>10 km (Hyperlocal)</span>
                <span>150 km (Regional)</span>
              </div>
            </div>

            {/* Budget Per Unit */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Budget Per Unit</span>
                <span className="font-bold text-emerald-700">≤ ₹{maxBudget}</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>₹20</span>
                <span>₹1,000</span>
              </div>
            </div>

            {/* Direct Escrow Model Card */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">account_balance</span>
                <span>Direct Escrow Model</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                99% of your product value settles directly in the grower's cooperative account upon QA scan.
              </p>
            </div>
          </aside>

          {/* Right Product Grid (9 Cols) */}
          <section className="lg:col-span-9 space-y-5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Today's Harvest Lots</h3>
                <p className="text-xs text-slate-500">
                  {sortedProduce.length} single-origin farm lots ready for morning dispatch
                </p>
              </div>

              {/* In-basket count helper */}
              {cartItemsCount > 0 && (
                <button
                  onClick={onOpenCart}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_basket</span>
                  <span>{cartItemsCount} in basket (₹{cartSubtotal})</span>
                </button>
              )}
            </div>

            {/* Produce Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedProduce.map((item) => {
                const existingInCart = cart.find((c) => c.item.id === item.id);
                const isJustAdded = justAddedId === item.id;
                const cardQty = getCardQty(item.id);
                const isWishlisted = wishlist.some((w) => w.id === item.id);

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Origin Badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="bg-slate-900/85 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {item.badge}
                        </span>
                      </div>

                      {/* Wishlist Heart Button (Top Right) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist?.(item);
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

                      {/* Trace Trigger */}
                      <button
                        onClick={() => onOpenTrace(item.batchId)}
                        className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs border border-slate-200/80 flex items-center gap-1 transition-all cursor-pointer hover:scale-105"
                        title="View Soil Test & Lab Certificate"
                      >
                        <span className="material-symbols-outlined text-[16px] text-emerald-700">qr_code_scanner</span>
                        <span>Trace</span>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">history</span>
                            {item.harvestTime}
                          </span>
                          <span className="font-medium text-slate-600">{item.origin}</span>
                        </div>

                        <h4 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {item.name}
                        </h4>

                        <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                          <button
                            type="button"
                            onClick={() => onOpenVendorStorefront?.(item.farmer)}
                            className="flex items-center gap-1 hover:text-emerald-700 font-medium cursor-pointer"
                            title="View Certified Collective Storefront"
                          >
                            <span className="material-symbols-outlined text-[15px] text-emerald-700">storefront</span>
                            <span>{item.farmer}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenPriceHistory?.(item)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 cursor-pointer"
                              title="30-Day Transparent Farm-Gate vs Retail Price History"
                            >
                              <span className="material-symbols-outlined text-[16px]">show_chart</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenWaitlist?.(item)}
                              className="text-slate-400 hover:text-amber-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
                              title="Join Harvest Restock Waitlist Alert"
                            >
                              <span className="material-symbols-outlined text-[16px]">notifications_none</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const exists = comparedItems.some((c) => c.id === item.id);
                                if (exists) {
                                  setComparedItems(comparedItems.filter((c) => c.id !== item.id));
                                } else {
                                  if (comparedItems.length >= 4) {
                                    alert('You can compare up to 4 items at once.');
                                    return;
                                  }
                                  setComparedItems([...comparedItems, item]);
                                }
                              }}
                              className={`p-1 rounded cursor-pointer transition-colors ${
                                comparedItems.some((c) => c.id === item.id)
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title="Add to Comparison Matrix"
                            >
                              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-lg font-bold text-slate-900">₹{item.price}</span>
                            <span className="text-xs text-slate-500 font-normal"> / {item.unit}</span>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                            99% to Grower
                          </span>
                        </div>

                        {/* Interactive Add Controls: Clean, Tactile, High-Hit Area */}
                        <div className="flex items-center gap-2">
                          {/* Stepper (always easy to adjust) */}
                          <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200/80 p-0.5">
                            <button
                              onClick={() => handleStepQty(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-bold text-sm cursor-pointer"
                              title="Decrease amount"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                              {cardQty}
                            </span>
                            <button
                              onClick={() => handleStepQty(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-bold text-sm cursor-pointer"
                              title="Increase amount"
                            >
                              +
                            </button>
                          </div>

                          {/* Add Button */}
                          <button
                            onClick={() => handleAdd(item)}
                            className={`flex-1 h-9 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isJustAdded ? 'check' : 'add_shopping_cart'}
                            </span>
                            <span>
                              {isJustAdded
                                ? 'Added!'
                                : existingInCart
                                ? `Add More (${existingInCart.quantity} in cart)`
                                : 'Add to Basket'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Comparison Floating Bar */}
      {comparedItems.length > 0 && (
        <div className="fixed bottom-20 inset-x-0 flex justify-center z-40 px-4 pointer-events-none">
          <div className="pointer-events-auto bg-emerald-950/95 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-4 animate-fadeIn backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">compare_arrows</span>
              <span>Comparing {comparedItems.length} harvest items</span>
            </div>
            <button
              onClick={() => onOpenComparison?.(comparedItems)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Open Comparison Matrix →
            </button>
            <button
              onClick={() => setComparedItems([])}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Elegant, Floating Basket Pill (Replaces the clunky 400px bottom drawer) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 px-4 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/95 hover:bg-slate-900 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-4 transition-all transform hover:scale-102">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">shopping_basket</span>
              <div>
                <span className="font-bold text-sm">{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}</span>
                <span className="text-slate-400 text-xs ml-1.5">· ₹{cartSubtotal}</span>
              </div>
            </div>

            <div className="h-4 w-px bg-slate-700"></div>

            <button
              onClick={onOpenCart}
              className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 cursor-pointer"
            >
              <span>View Basket</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
