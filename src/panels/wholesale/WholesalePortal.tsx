import React, { useState, useEffect } from 'react';
import { WholesalerKycData, WholesaleBulkProduct } from '../../types';
import { firestoreService } from '../../services/firestoreService';

interface WholesalePortalProps {
  onBackToCustomer: () => void;
  onOpenOrderSuccess?: (total: number) => void;
}

const SEED_WHOLESALE_PRODUCTS: WholesaleBulkProduct[] = [
  {
    id: 'wb-01',
    produceId: 'prod-01',
    name: 'San Marzano Vine Tomatoes (Grade A Export)',
    origin: 'Nashik Valley Syndicate #4',
    unit: '50 kg Crates',
    basePricePerUnit: 2100, // ₹42/kg
    moqUnits: 4,
    tierDiscounts: [
      { minUnits: 4, pricePerUnit: 2100, discountPercent: 0 },
      { minUnits: 10, pricePerUnit: 1950, discountPercent: 7.1 },
      { minUnits: 25, pricePerUnit: 1750, discountPercent: 16.6 },
    ],
    inventoryAvailableUnits: 85,
    harvestCutoffHour: '08:00 PM Tonight',
  },
  {
    id: 'wb-02',
    produceId: 'prod-02',
    name: 'Organic Shimla Royal Delicious Apples (Cold Dock Lot)',
    origin: 'Himachal Highland Cooperative',
    unit: '20 kg Crates',
    basePricePerUnit: 3400, // ₹170/kg
    moqUnits: 5,
    tierDiscounts: [
      { minUnits: 5, pricePerUnit: 3400, discountPercent: 0 },
      { minUnits: 15, pricePerUnit: 3100, discountPercent: 8.8 },
      { minUnits: 40, pricePerUnit: 2850, discountPercent: 16.1 },
    ],
    inventoryAvailableUnits: 120,
    harvestCutoffHour: '06:00 PM Tonight',
  },
  {
    id: 'wb-03',
    produceId: 'prod-04',
    name: 'Pure Raw A2 Gir Cow Milk (Reefer Tanker Batch)',
    origin: 'Nandini Pastoral Dairy, Pune',
    unit: '100 Liters Chilled Container',
    basePricePerUnit: 7800, // ₹78/liter
    moqUnits: 2,
    tierDiscounts: [
      { minUnits: 2, pricePerUnit: 7800, discountPercent: 0 },
      { minUnits: 5, pricePerUnit: 7200, discountPercent: 7.7 },
      { minUnits: 10, pricePerUnit: 6700, discountPercent: 14.1 },
    ],
    inventoryAvailableUnits: 18,
    harvestCutoffHour: '04:00 AM Dawn Dispatch',
  },
];

export const WholesalePortal: React.FC<WholesalePortalProps> = ({
  onBackToCustomer,
  onOpenOrderSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'csv-import' | 'credit-ledger' | 'kyc-status' | 'security'>('catalog');
  const [pwaInstalled, setPwaInstalled] = useState<boolean>(false);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);

  // KYC Application State
  const [kycData, setKycData] = useState<WholesalerKycData>({
    businessName: 'Taj Luxury Hotels & Banquets Pvt Ltd',
    businessType: 'Hotel/Restaurant (HORECA)',
    gstin: '27AAACT2727Q1ZB',
    pan: 'AAACT2727Q',
    fssaiNumber: '10018022007890',
    annualTurnover: '₹5 Cr – ₹25 Cr',
    deliveryHubCity: 'Mumbai & Pune Central Hubs',
    creditLimitRequested: 250000,
    status: 'active', // 'pending' | 'verified' | 'active'
    allocatedCreditLimit: 250000,
    availableCreditBalance: 184200,
    dsoDays: 14,
    assignedKamName: 'Vikramaditya Shinde',
    assignedKamContact: '+91 98201 99401 (Direct WhatsApp)',
  });

  // Bulk Cart Quantities
  const [bulkCart, setBulkCart] = useState<Record<string, number>>({
    'wb-01': 10, // 10 crates of tomatoes
    'wb-02': 5,  // 5 crates of apples
  });

  // CSV Import Raw Text
  const [csvText, setCsvText] = useState<string>(
    'SKU,Quantity_Units,Delivery_Hub\nwb-01,15,Bandra-Cold-Dock\nwb-02,10,Kasara-Consolidation\nwb-03,3,Pune-South-Hub'
  );
  const [csvSuccessNotice, setCsvSuccessNotice] = useState<string | null>(null);

  // 2FA Security
  const [totpEnabled, setTotpEnabled] = useState<boolean>(true);

  // Load KYC data from Firestore database
  useEffect(() => {
    firestoreService.getWholesaleKyc().then((data) => {
      if (data) {
        setKycData((prev) => ({
          ...prev,
          ...data,
        }));
      }
    }).catch((err) => console.warn('Wholesale KYC load notice:', err));
  }, []);

  const calculateBulkSubtotal = () => {
    let sum = 0;
    SEED_WHOLESALE_PRODUCTS.forEach((prod) => {
      const qty = bulkCart[prod.id] || 0;
      if (qty > 0) {
        // Calculate best tier price
        let unitPrice = prod.basePricePerUnit;
        for (const tier of prod.tierDiscounts) {
          if (qty >= tier.minUnits) {
            unitPrice = tier.pricePerUnit;
          }
        }
        sum += unitPrice * qty;
      }
    });
    return sum;
  };

  const handlePlaceWholesaleOrder = async () => {
    const total = calculateBulkSubtotal();
    if (total === 0) return;

    if (total > kycData.availableCreditBalance) {
      alert(`Order total (₹${total.toLocaleString('en-IN')}) exceeds available B2B Line of Credit balance (₹${kycData.availableCreditBalance.toLocaleString('en-IN')}). Please settle aging invoice or request limit extension.`);
      return;
    }

    const newBalance = kycData.availableCreditBalance - total;
    setKycData((prev) => ({
      ...prev,
      availableCreditBalance: newBalance,
    }));

    // Persist wholesale purchase order & updated KYC credit in Firestore
    try {
      const orderLines = Object.entries(bulkCart)
        .filter(([_, qty]) => qty > 0)
        .map(([prodId, qty]) => {
          const item = SEED_WHOLESALE_PRODUCTS.find((p) => p.id === prodId);
          return {
            productId: prodId,
            productName: item?.name || prodId,
            unit: item?.unit || 'crates',
            quantity: qty,
          };
        });

      await firestoreService.saveWholesaleOrder({
        businessName: kycData.businessName,
        gstin: kycData.gstin,
        items: orderLines,
        subtotal: total,
        paymentTerms: '14-Day Net Credit',
        hub: 'Bandra Cold-Dock',
        status: 'PO Confirmed & Reefer Reserved',
      });

      await firestoreService.saveWholesaleKyc({
        ...kycData,
        availableCreditBalance: newBalance,
      });

      console.log('Wholesale purchase order successfully saved in real Firestore database');
    } catch (err) {
      console.error('Failed to sync wholesale order to Firestore:', err);
    }

    onOpenOrderSuccess?.(total);
  };

  const handleProcessCsvImport = () => {
    const lines = csvText.trim().split('\n').slice(1);
    const updated = { ...bulkCart };
    lines.forEach((line) => {
      const [sku, qty] = line.split(',');
      if (sku && qty) {
        updated[sku.trim()] = Number(qty.trim());
      }
    });
    setBulkCart(updated);
    setCsvSuccessNotice(`Successfully imported ${lines.length} bulk purchase order lines!`);
    setTimeout(() => {
      setCsvSuccessNotice(null);
      setActiveTab('catalog');
    }, 1800);
  };

  const subtotal = calculateBulkSubtotal();

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 pb-24">
      {/* PWA Direct Installation Bar */}
      {showPwaBanner && !pwaInstalled && (
        <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>Install FarmDirect B2B PWA:</strong> Offline dispatch manifests, instant PO uploads, and biometric authentication.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPwaInstalled(true);
                setShowPwaBanner(false);
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Install App
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="text-slate-400 hover:text-white px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Wholesale Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg">
              B2B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Wholesale &amp; Institutional Procurement</h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  KYC Verified HORECA
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {kycData.businessName} · GSTIN: {kycData.gstin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Credit Balance Quick Pill */}
            <div className="hidden sm:block text-right pr-3 border-r border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Line of Credit</span>
              <span className="text-sm font-bold text-emerald-700">
                ₹{kycData.availableCreditBalance.toLocaleString('en-IN')} / ₹{kycData.allocatedCreditLimit.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={onBackToCustomer}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              ← Back to Consumer Store
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'catalog', label: 'Bulk Harvest Catalog', icon: 'grid_view' },
            { id: 'csv-import', label: 'CSV Quick PO Importer', icon: 'upload_file' },
            { id: 'credit-ledger', label: 'Line of Credit Ledger', icon: 'account_balance' },
            { id: 'kyc-status', label: 'KYC & License Records', icon: 'verified_user' },
            { id: 'security', label: '2FA & KAM Support', icon: 'security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-700 text-emerald-800 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: BULK CATALOG */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Products Matrix (8 Cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Direct Smallholder Bulk Crates</h3>
                  <p className="text-xs text-slate-500">Tiered volume discounts calculated automatically per pallet.</p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {SEED_WHOLESALE_PRODUCTS.length} bulk lots available
                </span>
              </div>

              <div className="space-y-4">
                {SEED_WHOLESALE_PRODUCTS.map((prod) => {
                  const qty = bulkCart[prod.id] || 0;
                  return (
                    <div
                      key={prod.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{prod.name}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                              MOQ: {prod.moqUnits} {prod.unit}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            Origin: {prod.origin} · Cutoff: {prod.harvestCutoffHour}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-slate-900">
                            ₹{prod.basePricePerUnit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 block font-normal">per {prod.unit}</span>
                        </div>
                      </div>

                      {/* Tier Pricing Cards */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {prod.tierDiscounts.map((tier, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl border text-center transition-colors ${
                              qty >= tier.minUnits
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="block font-semibold">{tier.minUnits}+ Units</span>
                            <span className="block text-slate-900 font-bold">
                              ₹{tier.pricePerUnit.toLocaleString('en-IN')}
                            </span>
                            {tier.discountPercent > 0 && (
                              <span className="text-[10px] text-emerald-700 block">
                                Save {tier.discountPercent}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Quantity Stepper Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          Available: <strong>{prod.inventoryAvailableUnits}</strong> {prod.unit}
                        </span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-100 rounded-xl border border-slate-300 p-0.5">
                            <button
                              onClick={() => {
                                setBulkCart((prev) => ({
                                  ...prev,
                                  [prod.id]: Math.max(0, (prev[prod.id] || 0) - 1),
                                }));
                              }}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={qty}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBulkCart((prev) => ({
                                  ...prev,
                                  [prod.id]: val >= 0 ? val : 0,
                                }));
                              }}
                              className="w-14 text-center font-bold text-xs text-slate-900 bg-transparent focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                setBulkCart((prev) => ({
                                  ...prev,
                                  [prod.id]: (prev[prod.id] || 0) + 1,
                                }));
                              }}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wholesale PO Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-200">
                Bulk Purchase Order Manifest
              </h3>

              <div className="space-y-3 text-xs">
                {SEED_WHOLESALE_PRODUCTS.map((prod) => {
                  const qty = bulkCart[prod.id] || 0;
                  if (qty === 0) return null;
                  let unitPrice = prod.basePricePerUnit;
                  for (const tier of prod.tierDiscounts) {
                    if (qty >= tier.minUnits) unitPrice = tier.pricePerUnit;
                  }
                  return (
                    <div key={prod.id} className="flex justify-between items-center py-1">
                      <div>
                        <span className="font-bold text-slate-900 block">{qty}x {prod.unit}</span>
                        <span className="text-[11px] text-slate-500">{prod.name}</span>
                      </div>
                      <span className="font-mono font-bold">₹{(unitPrice * qty).toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Farm Gate Value:</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Commercial Freight &amp; Reefer Trucking:</span>
                  <span className="font-mono text-emerald-700 font-bold">Waived (B2B HORECA tier)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t text-sm font-bold text-slate-900">
                  <span>Total PO Value:</span>
                  <span className="text-xl text-emerald-800 font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Line of credit validation */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Line of Credit:</span>
                  <span className="font-bold text-slate-900">Net 14 Days</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Available Balance:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    ₹{kycData.availableCreditBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={subtotal === 0}
                onClick={handlePlaceWholesaleOrder}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
              >
                Submit Purchase Order on Net 14 Credit
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CSV IMPORTER */}
        {activeTab === 'csv-import' && (
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">CSV Bulk Purchase Order Importer</h3>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                  Automated Procurement
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload or paste multi-line purchase orders from your ERP (SAP, Oracle, Tally) to automatically configure wholesale pallet quantities.
              </p>
            </div>

            {csvSuccessNotice && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-semibold animate-fadeIn">
                ✓ {csvSuccessNotice}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Paste CSV Order Content (SKU, Quantity_Units, Delivery_Hub)
              </label>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 text-slate-900"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleProcessCsvImport}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Parse &amp; Sync to Wholesale Cart
              </button>
              <button
                type="button"
                onClick={() =>
                  setCsvText(
                    'SKU,Quantity_Units,Delivery_Hub\nwb-01,25,Bandra-Cold-Dock\nwb-02,20,Kasara-Consolidation'
                  )
                }
                className="py-3 px-4 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Load Sample PO
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LINE OF CREDIT LEDGER */}
        {activeTab === 'credit-ledger' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned B2B Credit Limit</span>
                <span className="text-2xl font-bold text-slate-900">
                  ₹{kycData.allocatedCreditLimit.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 block mt-1">Reviewed quarterly against DSO</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Credit Balance</span>
                <span className="text-2xl font-bold text-emerald-700">
                  ₹{kycData.availableCreditBalance.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-600 font-medium block mt-1">Ready for instant harvest PO</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Average DSO (Days Sales Out)</span>
                <span className="text-2xl font-bold text-blue-700">{kycData.dsoDays} Days</span>
                <span className="text-xs text-slate-500 block mt-1">Terms: Net 14 Days</span>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">Institutional Statement of Account</h4>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Download GST Statement
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50">
                      <th className="p-3">Date</th>
                      <th className="p-3">Reference / Invoice</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Debit (₹)</th>
                      <th className="p-3 text-right">Credit (₹)</th>
                      <th className="p-3 text-right">Running Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono">28 Sep 2026</td>
                      <td className="p-3 font-mono font-bold text-emerald-800">FD-INV-2026-8812</td>
                      <td className="p-3">San Marzano Tomatoes 25 crates + Shimla Apples 15 crates</td>
                      <td className="p-3 text-right font-mono">₹65,800.00</td>
                      <td className="p-3 text-right font-mono">-</td>
                      <td className="p-3 text-right font-mono font-bold">₹1,84,200.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">15 Sep 2026</td>
                      <td className="p-3 font-mono text-slate-600">RTGS-NEFT-99124</td>
                      <td className="p-3">Invoice Settlement via HDFC Bank Virtual Account</td>
                      <td className="p-3 text-right font-mono">-</td>
                      <td className="p-3 text-right font-mono text-emerald-700 font-bold">₹1,20,000.00</td>
                      <td className="p-3 text-right font-mono font-bold">₹2,50,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KYC & LICENSES */}
        {activeTab === 'kyc-status' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">B2B Institutional KYC Compliance</h3>
                <p className="text-xs text-slate-500">Verified corporate tax credentials and FSSAI manufacturing licenses.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
                Status: ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Legal Entity</span>
                <span className="font-bold text-slate-900 block mt-0.5">{kycData.businessName}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">GSTIN Certificate</span>
                <span className="font-mono font-bold text-emerald-800 block mt-0.5">{kycData.gstin}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Corporate PAN</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{kycData.pan}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Central FSSAI License</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{kycData.fssaiNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & KAM SUPPORT */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Assigned KAM Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-bold text-base flex items-center justify-center">
                  VS
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Dedicated Key Account Manager
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-1">{kycData.assignedKamName}</h4>
                  <p className="text-xs text-slate-500">Priority Cold-Chain Allocation &amp; Custom Sourcing</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-mono">{kycData.assignedKamContact}</span>
                <button
                  type="button"
                  onClick={() => alert(`Connecting priority WhatsApp dispatch session with ${kycData.assignedKamName}...`)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Direct KAM WhatsApp
                </button>
              </div>
            </div>

            {/* 2FA TOTP */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (TOTP)</h4>
                  <p className="text-xs text-slate-500">Require Google Authenticator / Duo code for PO release.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTotpEnabled(!totpEnabled)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                    totpEnabled
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {totpEnabled ? 'ENABLED ✓' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
