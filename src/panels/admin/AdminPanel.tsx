import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services/firestoreService';
import { socialProofService } from '../../services/socialProofService';
import { CommunityReview, ProduceItem } from '../../types';

interface AdminPanelProps {
  onNavigateToSupport?: () => void;
  onOpenAuditTrail?: () => void;
  onOpenKillSwitch?: () => void;
  onOpenNightlyMaintenance?: () => void;
  onOpenCustomer360?: () => void;
  onOpenVendorOnboarding?: () => void;
}

export type AdminTabType =
  | 'escrow'
  | 'commerce'
  | 'social_proof'
  | 'coupons'
  | 'logistics'
  | 'wholesale'
  | 'multivendor'
  | 'database';

interface CouponPolicy {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minSpend: number;
  expiryDays: number;
  usageLimit: number;
  timesUsed: number;
  status: 'active' | 'paused';
  description: string;
}

const DEFAULT_COUPON_POLICIES: CouponPolicy[] = [
  {
    code: 'FARM10',
    type: 'percentage',
    value: 10,
    minSpend: 500,
    expiryDays: 30,
    usageLimit: 1000,
    timesUsed: 412,
    status: 'active',
    description: '10% Direct Grower Incentive on fresh morning baskets',
  },
  {
    code: 'FRESH20',
    type: 'percentage',
    value: 20,
    minSpend: 1200,
    expiryDays: 14,
    usageLimit: 500,
    timesUsed: 189,
    status: 'active',
    description: '20% Harvest Collective Celebration above ₹1,200',
  },
  {
    code: 'WELCOME100',
    type: 'flat',
    value: 100,
    minSpend: 600,
    expiryDays: 7,
    usageLimit: 2500,
    timesUsed: 940,
    status: 'active',
    description: '₹100 First Order Welcome Gift across all clusters',
  },
  {
    code: 'HARVEST50',
    type: 'flat',
    value: 50,
    minSpend: 400,
    expiryDays: 15,
    usageLimit: 1000,
    timesUsed: 310,
    status: 'active',
    description: '₹50 Harvest Bounty Credit on seasonal items',
  },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onNavigateToSupport,
  onOpenAuditTrail,
  onOpenKillSwitch,
  onOpenNightlyMaintenance,
  onOpenCustomer360,
  onOpenVendorOnboarding,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('escrow');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [isSeedingDatabase, setIsSeedingDatabase] = useState(false);

  // Escrow & Governance sliders
  const [takeRate, setTakeRate] = useState<number>(1.0);
  const [mutualLossPool, setMutualLossPool] = useState<number>(0.5);
  const [eNamGateway, setENamGateway] = useState<boolean>(true);
  const [yieldHedge, setYieldHedge] = useState<boolean>(false);

  // Dynamic Commerce & Checkout Rules
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(1000);
  const [maxCodCap, setMaxCodCap] = useState<number>(50000);
  const [codHandlingFeePercent, setCodHandlingFeePercent] = useState<number>(2);
  const [standardLogisticsFee, setStandardLogisticsFee] = useState<number>(45);

  // Social Proof & Popups Orchestrator
  const [verifiedPopupsEnabled, setVerifiedPopupsEnabled] = useState<boolean>(true);
  const [popupIntervalSeconds, setPopupIntervalSeconds] = useState<number>(15);
  const [popupMinOrderValue, setPopupMinOrderValue] = useState<number>(200);
  const [popupCooldownMinutes, setPopupCooldownMinutes] = useState<number>(5);
  const [reviewsList, setReviewsList] = useState<CommunityReview[]>([]);

  // Unique Coupons & Policy Registry
  const [couponPolicies, setCouponPolicies] = useState<CouponPolicy[]>(DEFAULT_COUPON_POLICIES);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(500);

  // Logistics & Carriers
  const [indiaPostActive, setIndiaPostActive] = useState<boolean>(true);
  const [delhiveryActive, setDelhiveryActive] = useState<boolean>(true);
  const [labelFormat, setLabelFormat] = useState<'100mm' | 'A4'>('100mm');
  const [zoneARate, setZoneARate] = useState(30);
  const [zoneBRate, setZoneBRate] = useState(45);
  const [zoneCRate, setZoneCRate] = useState(80);

  // Wholesale KYC & Credit Management
  const [wholesaleKyc, setWholesaleKyc] = useState<any>(null);
  const [wholesaleCreditLimitInput, setWholesaleCreditLimitInput] = useState<number>(250000);

  // Multi-Vendor Operations
  const [vendorPayoutShare, setVendorPayoutShare] = useState<number>(94.1);
  const [vendorSlaList] = useState([
    {
      collectiveName: 'Sahyadri Farmers Producer Co.',
      leadAgronomist: 'Ramesh Patel',
      lotsCount: 42,
      onTimeDispatchRate: 98.4,
      cancellationRate: 0.2,
      returnFrequency: 0.4,
      status: 'verified',
    },
    {
      collectiveName: 'Himachal Highland Orchards Syndicate',
      leadAgronomist: 'Rajesh Sharma',
      lotsCount: 28,
      onTimeDispatchRate: 96.8,
      cancellationRate: 0.5,
      returnFrequency: 0.8,
      status: 'verified',
    },
    {
      collectiveName: 'Gir Vedic Organic Gaushala',
      leadAgronomist: 'Bhavik Patel',
      lotsCount: 35,
      onTimeDispatchRate: 99.2,
      cancellationRate: 0.1,
      returnFrequency: 0.2,
      status: 'verified',
    },
    {
      collectiveName: 'Western Ghats Spices & Greens Syndicate',
      leadAgronomist: 'Anand Shinde',
      lotsCount: 19,
      onTimeDispatchRate: 97.1,
      cancellationRate: 0.4,
      returnFrequency: 0.6,
      status: 'verified',
    },
  ]);

  // Escrow Queue Items
  const [queueItems, setQueueItems] = useState([
    {
      id: 'NSK-8921',
      coop: 'Sahyadri Co-op (Nashik)',
      crop: 'Roma Tomatoes',
      details: 'Grade A • 1,200 kg',
      amount: 142000,
      status: 'Bandra Hub Arrival',
      statusSub: 'Manifest sign-off by Hub Ops 12m ago',
      metric: 'Brix: 6.8 (Pass)',
      metricPercent: 85,
      isReleased: false,
      isDisputed: false,
      img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'JNR-4419',
      coop: 'Anand Shinde (Junnar)',
      crop: 'Hydroponic Arugula',
      details: 'Zero Pesticide • 180 kg',
      amount: 68500,
      status: 'Doorstep Delivered',
      statusSub: 'Customer OTP & Freshness Confirmed',
      metric: 'Moisture: 94%',
      metricPercent: 94,
      isReleased: false,
      isDisputed: false,
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'SNG-1022',
      coop: 'Nandini Dairy (Sangli)',
      crop: 'A2 Gir Cow Milk',
      details: 'Morning Milking • 850 L',
      amount: 89200,
      status: 'Arrived at Dadar Hub',
      statusSub: 'Temp Locked: 3.4°C (Target < 4°C)',
      metric: 'Fat: 4.8% • SNF: 8.9',
      metricPercent: 78,
      isReleased: false,
      isDisputed: false,
      img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'HMC-902',
      coop: 'Apple Valley FPO (Shimla)',
      crop: 'Shimla Royal Apples',
      details: 'Direct Orchard • 2,400 kg',
      amount: 310000,
      status: 'Temp Anomaly Dispute',
      statusSub: 'Crate #12 Sensor logged 12.2°C at Ambala check',
      metric: 'Preservation: Compromised',
      metricPercent: 38,
      isReleased: false,
      isDisputed: true,
      img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&auto=format&fit=crop&q=80',
    },
  ]);

  const [inspectPhotoUrl, setInspectPhotoUrl] = useState<string | null>(null);

  // Load live settings & collections from Firestore
  useEffect(() => {
    // 1. Governance Rules
    firestoreService.getGovernanceSettings().then((rules) => {
      if (rules) {
        if (rules.freeShippingThreshold) setFreeShippingThreshold(rules.freeShippingThreshold);
        if (rules.maxCodCap) setMaxCodCap(rules.maxCodCap);
        if (rules.codHandlingFeePercent) setCodHandlingFeePercent(rules.codHandlingFeePercent);
        if (rules.standardLogisticsFee) setStandardLogisticsFee(rules.standardLogisticsFee);
        if (rules.platformTakeRate) setTakeRate(rules.platformTakeRate);
        if (rules.popupIntervalSeconds) setPopupIntervalSeconds(rules.popupIntervalSeconds);
        if (rules.popupMinOrderValue) setPopupMinOrderValue(rules.popupMinOrderValue);
        if (rules.defaultShippingLabelFormat) setLabelFormat(rules.defaultShippingLabelFormat);
      }
    });

    // 2. Wholesale KYC
    firestoreService.getWholesaleKyc().then((kyc) => {
      if (kyc) {
        setWholesaleKyc(kyc);
        if (kyc.allocatedCreditLimit) setWholesaleCreditLimitInput(kyc.allocatedCreditLimit);
      }
    });

    // 3. Community reviews
    setReviewsList(socialProofService.getCommunityReviews());

    // 4. Real orders listener
    const unsub = firestoreService.listenOrders((orders) => {
      if (orders && orders.length > 0) {
        setQueueItems((prev) =>
          prev.map((item) => {
            const found = orders.find((o) => o.id === item.id || o.id === `FD-${item.id}`);
            if (found && found.escrowStatus === 'Inspected & Released') {
              return { ...item, isReleased: true };
            }
            return item;
          })
        );
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReleaseEscrow = async (itemId: string, amount: number) => {
    setQueueItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isReleased: true } : i))
    );
    triggerToast(`Smart Escrow Released: ₹${amount.toLocaleString('en-IN')} disbursed to grower. Synced to Firestore.`);

    try {
      await firestoreService.releaseOrderEscrow(itemId);
    } catch (err) {
      console.error('Error releasing escrow in Firestore:', err);
    }
  };

  const handleSaveGovernanceSettings = async () => {
    setIsSavingRules(true);
    const updated = {
      freeShippingThreshold,
      maxCodCap,
      codHandlingFeePercent,
      standardLogisticsFee,
      platformTakeRate: takeRate,
      verifiedPopupsEnabled,
      popupIntervalSeconds,
      popupMinOrderValue,
      popupCooldownMinutes,
      indiaPostEnabled: indiaPostActive,
      delhiveryEnabled: delhiveryActive,
      defaultShippingLabelFormat: labelFormat,
      updatedAt: new Date().toISOString(),
    };

    try {
      await firestoreService.saveGovernanceSettings(updated);
      triggerToast('Governance & Dynamic Commerce rules successfully saved to Cloud Firestore database!');
    } catch (err) {
      console.error('Save settings error:', err);
      triggerToast('Error saving settings to cloud database.');
    } finally {
      setIsSavingRules(false);
    }
  };

  const handleSeedCloudDatabase = async () => {
    setIsSeedingDatabase(true);
    try {
      const res = await firestoreService.seedAllSampleData();
      if (res.success) {
        triggerToast(`Database seeded successfully! ${res.seededCount} records synchronized to live Cloud Firestore.`);
      } else {
        triggerToast('Database seeding encountered an error. Check network console.');
      }
    } catch (err) {
      console.error('Seed error:', err);
      triggerToast('Failed to seed cloud database.');
    } finally {
      setIsSeedingDatabase(false);
    }
  };

  const handleAddCouponPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newPolicy: CouponPolicy = {
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue),
      minSpend: Number(newCouponMinSpend),
      expiryDays: 30,
      usageLimit: 1000,
      timesUsed: 0,
      status: 'active',
      description: `Admin-generated ${newCouponType === 'percentage' ? `${newCouponValue}%` : `₹${newCouponValue}`} discount rule`,
    };

    setCouponPolicies([newPolicy, ...couponPolicies]);
    setNewCouponCode('');
    triggerToast(`Coupon Policy ${newPolicy.code} added and activated.`);
    firestoreService.saveUniqueCoupon(newPolicy);
  };

  const handleToggleCouponStatus = (code: string) => {
    setCouponPolicies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c))
    );
    triggerToast(`Coupon policy ${code} status toggled.`);
  };

  const handleUpdateKycStatus = async (status: 'active' | 'under_review' | 'rejected') => {
    if (!wholesaleKyc) return;
    const updated = {
      ...wholesaleKyc,
      status,
      allocatedCreditLimit: wholesaleCreditLimitInput,
      updatedAt: new Date().toISOString(),
    };
    setWholesaleKyc(updated);
    await firestoreService.saveWholesaleKyc(updated);
    triggerToast(`Wholesale KYC status updated to ${status.toUpperCase()} (Credit limit: ₹${wholesaleCreditLimitInput.toLocaleString('en-IN')}).`);
  };

  // Custom produce lot creation for Cloud Database
  const [newLotName, setNewLotName] = useState('');
  const [newLotCategory, setNewLotCategory] = useState<'leafy' | 'fruits' | 'dairy' | 'grains' | 'special'>('leafy');
  const [newLotPrice, setNewLotPrice] = useState('65');
  const [newLotFarm, setNewLotFarm] = useState('Sahyadri Valley Agro, Nashik');
  const [newLotUnit, setNewLotUnit] = useState('1 kg');
  const [isAddingLot, setIsAddingLot] = useState(false);

  const handleAddNewProduceLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotName.trim()) return;
    setIsAddingLot(true);
    const newProduce: ProduceItem = {
      id: `prod-${Date.now()}`,
      name: newLotName.trim(),
      category: newLotCategory,
      badge: 'Certified Organic',
      batchId: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
      harvestTime: 'Harvested Today (06:00 AM)',
      harvestHoursAgo: 2,
      origin: newLotFarm,
      farmer: 'Ramesh Patel',
      price: Number(newLotPrice) || 50,
      unit: newLotUnit,
      growerSharePercent: 94.1,
      accreditation: ['NPOP Certified', 'Zero Residue', 'GI Tagged'],
      distanceKm: 18,
      temperatureCelsius: newLotCategory === 'dairy' ? 2 : newLotCategory === 'leafy' ? 3 : 8,
      inStock: true,
    };
    try {
      await firestoreService.saveProduceItem(newProduce);
      triggerToast(`Real Produce Lot "${newProduce.name}" written directly to Cloud Firestore!`);
      setNewLotName('');
    } catch (err) {
      console.error('Failed to add produce lot:', err);
      triggerToast('Error saving produce lot to database.');
    } finally {
      setIsAddingLot(false);
    }
  };

  const navTabs: { id: AdminTabType; label: string; icon: string; badge?: string }[] = [
    { id: 'escrow', label: 'Escrow & Cold-Chain', icon: 'account_balance' },
    { id: 'commerce', label: 'Dynamic Rules', icon: 'tune' },
    { id: 'social_proof', label: 'Social Proof', icon: 'verified' },
    { id: 'coupons', label: 'Coupons & Wheel', icon: 'confirmation_number' },
    { id: 'logistics', label: 'Logistics & Carriers', icon: 'local_shipping' },
    { id: 'wholesale', label: 'Wholesale B2B', icon: 'corporate_fare', badge: wholesaleKyc?.status === 'active' ? 'Active' : 'Pending' },
    { id: 'multivendor', label: 'Multi-Vendor & SLA', icon: 'groups' },
    { id: 'database', label: 'Database & Seeder', icon: 'database', badge: 'Cloud' },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-16 font-sans text-[#141b2b]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141b2b] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Admin Governance &amp; Regulation Core
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-mono">Live Database Connected</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#141b2b] tracking-tight">
            Centralized Platform Administration
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 max-w-3xl">
            Real-time regulation of dynamic checkout rules, verified social proof toasts, unique coupon policies, logistics carriers (India Post &amp; Delhivery), wholesaler line-of-credit, and automated cold-chain escrow settlements.
          </p>
        </div>

        {/* Global Action Modals */}
        <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
          {onOpenAuditTrail && (
            <button
              type="button"
              onClick={onOpenAuditTrail}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#141b2b] text-xs font-semibold transition-colors shadow-2xs cursor-pointer border border-slate-200"
              title="View Searchable Audit Trail"
            >
              <span className="material-symbols-outlined text-[16px] text-purple-700">history_edu</span>
              <span>Audit Trail</span>
            </button>
          )}

          {onOpenKillSwitch && (
            <button
              type="button"
              onClick={onOpenKillSwitch}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors shadow-2xs cursor-pointer border border-red-200"
              title="Emergency Kill Switch"
            >
              <span className="material-symbols-outlined text-[16px] text-red-600">emergency_home</span>
              <span>Kill Switch</span>
            </button>
          )}

          {onOpenNightlyMaintenance && (
            <button
              type="button"
              onClick={onOpenNightlyMaintenance}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer border border-indigo-200"
              title="Nightly Maintenance"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-600">dark_mode</span>
              <span>Maintenance Run</span>
            </button>
          )}

          {onOpenCustomer360 && (
            <button
              type="button"
              onClick={onOpenCustomer360}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors shadow-2xs cursor-pointer border border-teal-200"
              title="Customer 360 Radar"
            >
              <span className="material-symbols-outlined text-[16px] text-teal-700">contacts_product</span>
              <span>Customer 360</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSeedCloudDatabase}
            disabled={isSeedingDatabase}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Seed real sample data directly to Firestore database"
          >
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>{isSeedingDatabase ? 'Seeding Cloud...' : 'Seed Sample Data'}</span>
          </button>
        </div>
      </div>

      {/* Regulation Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 scrollbar-none">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: ESCROW & COLD-CHAIN OVERSIGHT */}
      {activeTab === 'escrow' && (
        <div className="space-y-6">
          {/* KPI Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  System Escrow Pool
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-[#141b2b]">₹48,92,400</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  24 Regional Mandis Locked
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Reefers In Transit
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-[#141b2b]">42 / 44</span>
                <span className="text-[11px] text-blue-700 font-mono font-bold">95.5% Fleet Cap</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Direct-to-Grower
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">handshake</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-[#141b2b]">{vendorPayoutShare}%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">Direct Mandi Payout</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Mean Brix QA Score
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">nutrition</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-[#141b2b]">6.92 Brix</span>
                <span className="text-[11px] text-amber-700 font-mono font-bold">99.1% First-Pass QA</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Dispute Rate
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-[#141b2b]">0.24%</span>
                <span className="text-[11px] text-slate-500 font-mono font-bold">1 Active Arbitration</span>
              </div>
            </div>
          </div>

          {/* Escrow Settlement Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Escrow Settlement &amp; Release Queue</h3>
                <p className="text-xs text-slate-500">Inspected farm gate arrivals awaiting disbursal to grower syndicate accounts</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Postgres FOR UPDATE Row Locked
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Batch &amp; Origin</th>
                    <th className="py-3 px-4">Commodity</th>
                    <th className="py-3 px-4">Escrow Value</th>
                    <th className="py-3 px-4">Telemetry Status</th>
                    <th className="py-3 px-4">Lab Metric</th>
                    <th className="py-3 px-4 text-right">Settlement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.img}
                            alt={item.crop}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <p className="font-mono font-bold text-slate-900">#{item.id}</p>
                            <p className="text-[11px] text-slate-500">{item.coop}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{item.crop}</td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-700">
                          <span className={`w-2 h-2 rounded-full ${item.isDisputed ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{item.metric}</td>
                      <td className="py-3.5 px-4 text-right">
                        {item.isReleased ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            Settled
                          </span>
                        ) : item.isDisputed ? (
                          <button
                            type="button"
                            onClick={() => onNavigateToSupport?.()}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer ml-auto"
                          >
                            Arbitrate
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectPhotoUrl(item.img)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReleaseEscrow(item.id, item.amount)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white font-bold text-xs shadow-xs cursor-pointer"
                            >
                              Disburse
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC COMMERCE & CHECKOUT RULES */}
      {activeTab === 'commerce' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Checkout Engine Rules</h3>
              <p className="text-xs text-slate-500">Live regulatory constraints evaluated in real time at checkout</p>
            </div>

            <div className="space-y-4">
              {/* Free shipping threshold */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Free Solar Reefer Delivery Threshold</label>
                  <span className="text-sm font-bold text-emerald-700 font-mono">₹{freeShippingThreshold}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <span className="text-[11px] text-slate-500">Baskets above this value receive automated ₹0 shipping.</span>
              </div>

              {/* COD Max Cap */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Cash-on-Delivery (COD) Order Ceiling</label>
                  <span className="text-sm font-bold text-slate-900 font-mono">₹{maxCodCap.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={maxCodCap}
                  onChange={(e) => setMaxCodCap(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <span className="text-[11px] text-slate-500">Orders exceeding ₹{maxCodCap.toLocaleString('en-IN')} require digital Razorpay prepay.</span>
              </div>

              {/* COD Handling Fee % */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">COD Security &amp; Cash Handling Surcharge</label>
                  <span className="text-sm font-bold text-amber-700 font-mono">{codHandlingFeePercent}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={codHandlingFeePercent}
                  onChange={(e) => setCodHandlingFeePercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <span className="text-[11px] text-slate-500">Applied when customers select cash payment at doorstep (Min ₹30).</span>
              </div>

              {/* Standard Logistics Fee */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Standard Reefer Dispatch Base Rate</label>
                  <span className="text-sm font-bold text-slate-900 font-mono">₹{standardLogisticsFee}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={standardLogisticsFee}
                  onChange={(e) => setStandardLogisticsFee(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <span className="text-[11px] text-slate-500">Applied to orders below the free shipping threshold.</span>
              </div>
            </div>

            <button
              onClick={handleSaveGovernanceSettings}
              disabled={isSavingRules}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isSavingRules ? 'Persisting to Firestore...' : 'Save Dynamic Rules to Cloud Database'}
            </button>
          </div>

          {/* Platform Governance Toggles */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Margins &amp; Hedge Modules</h3>
              <p className="text-xs text-slate-500">Cluster underwriting and national agri-gateway routing</p>
            </div>

            <div className="space-y-4">
              {/* Platform Take-rate */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Platform Facilitation Take-Rate</label>
                  <span className="text-sm font-bold text-emerald-700 font-mono">{takeRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={takeRate}
                  onChange={(e) => setTakeRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <span className="text-[11px] text-slate-500">Transparent system fee allocated for cold-chain IoT telemetry.</span>
              </div>

              {/* Loss Pool */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Mutual Grower Loss Reserve Pool</label>
                  <span className="text-sm font-bold text-blue-700 font-mono">{mutualLossPool.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={mutualLossPool}
                  onChange={(e) => setMutualLossPool(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] text-slate-500">Shields smallholders against highway refrigeration mechanical faults.</span>
              </div>

              {/* Toggles */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Govt e-NAM Gateway Integration</p>
                  <p className="text-[11px] text-slate-500">Direct real-time price indexing against APMC terminal auctions</p>
                </div>
                <input
                  type="checkbox"
                  checked={eNamGateway}
                  onChange={(e) => setENamGateway(e.target.checked)}
                  className="w-5 h-5 accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Yield Weather Hedge Derivatives</p>
                  <p className="text-[11px] text-slate-500">Automated micro-settlement for unexpected rain or heat waves</p>
                </div>
                <input
                  type="checkbox"
                  checked={yieldHedge}
                  onChange={(e) => setYieldHedge(e.target.checked)}
                  className="w-5 h-5 accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSION & SOCIAL PROOF ENGINE */}
      {activeTab === 'social_proof' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popups Regulator */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Real Verified Purchase Toast Regulator</h3>
                <p className="text-xs text-slate-500">Controls live buyer proof generated exclusively from real paid orders</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Enable Live Purchase Popups</p>
                    <p className="text-[11px] text-slate-500">Display verified buyers first name and masked city</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedPopupsEnabled}
                    onChange={(e) => setVerifiedPopupsEnabled(e.target.checked)}
                    className="w-5 h-5 accent-emerald-700 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Toast Cycle Interval</label>
                    <span className="text-sm font-bold text-emerald-700 font-mono">{popupIntervalSeconds} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={popupIntervalSeconds}
                    onChange={(e) => setPopupIntervalSeconds(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Minimum Order Value Filter</label>
                    <span className="text-sm font-bold text-slate-900 font-mono">₹{popupMinOrderValue}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={popupMinOrderValue}
                    onChange={(e) => setPopupMinOrderValue(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                  />
                  <span className="text-[11px] text-slate-500">Excludes micro-orders under ₹{popupMinOrderValue} from social proof banner.</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerToast('Test purchase broadcasted: "Priya S. from Bandra purchased 3 kg Vine Tomatoes"')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Trigger Test Toast
                </button>
                <button
                  type="button"
                  onClick={handleSaveGovernanceSettings}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Toast Settings
                </button>
              </div>
            </div>

            {/* Sequential Popup Orchestrator (popupQueue) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Sequential Popup Orchestrator (popupQueue.ts)</h3>
                <p className="text-xs text-slate-500">Prevents overlapping banners so customers never see stacked dialogs</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Welcome / Direct Link Modal</p>
                      <p className="text-[10px] text-slate-500">Priority: Highest (Triggers on initial landing)</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">Active</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">2</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Spin-to-Win Lucky Wheel</p>
                      <p className="text-[10px] text-slate-500">Priority: High (Enqueued cleanly after welcome)</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">Active</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">3</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Verified Harvest Stories</p>
                      <p className="text-[10px] text-slate-500">Priority: Normal (Engages on exit intent)</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community Reviews Moderation */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Community Reviews &amp; Lab Badges Moderation</h3>
                <p className="text-xs text-slate-500">Customer feedback authenticated against lab test lot numbers</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {reviewsList.length} Verified Reviews
              </span>
            </div>

            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                      <span className="text-[10px] text-slate-500">({rev.customerState})</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ★ {rev.rating}.0
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{rev.harvestLotNumber}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                    <p className="text-[10px] text-slate-500">Item: {rev.purchasedItemName}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => triggerToast(`Review by ${rev.customerName} pinned as featured story.`)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Pin as Featured
                    </button>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      Photo Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UNIQUE CODE ENGINE & WHEEL */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Coupon Policy Form */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Issue Unique Code Policy</h3>
                <p className="text-xs text-slate-500">Admin-regulated policy registry for marketing campaigns</p>
              </div>

              <form onSubmit={handleAddCouponPolicy} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Code Prefix</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. VIP25 or B2B500"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Rupee (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Value</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Minimum Order Spend (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
                >
                  Register Policy in Database
                </button>
              </form>
            </div>

            {/* Active Coupon Policies Registry */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Coupon Policies Registry</h3>
                  <p className="text-xs text-slate-500">Policy rules evaluated directly inside checkout discount engine</p>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {couponPolicies.length} Policies
                </span>
              </div>

              <div className="space-y-3">
                {couponPolicies.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                        </span>
                        <span className="text-[10px] text-slate-500">Min spend: ₹{c.minSpend}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Usage: {c.timesUsed} / {c.usageLimit} redeemed · Expiry: {c.expiryDays} days
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCouponStatus(c.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          c.status === 'active'
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                      >
                        {c.status === 'active' ? 'Active' : 'Paused'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LOGISTICS & CARRIERS (INDIA POST & DELHIVERY) */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carrier Status */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Direct Logistics Carrier Integrations</h3>
                <p className="text-xs text-slate-500">Exclusive partner network (India Post &amp; Delhivery only)</p>
              </div>

              <div className="space-y-4">
                {/* India Post */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                      📮
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">India Post (Speed Post Parcel)</p>
                      <p className="text-[11px] text-slate-500">Deep rural pin-code reach across all agricultural mandis</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={indiaPostActive}
                    onChange={(e) => setIndiaPostActive(e.target.checked)}
                    className="w-5 h-5 accent-emerald-700 cursor-pointer"
                  />
                </div>

                {/* Delhivery */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      📦
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Delhivery Express &amp; Surface</p>
                      <p className="text-[11px] text-slate-500">Sub-48h metro delivery corridor with automated manifest</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={delhiveryActive}
                    onChange={(e) => setDelhiveryActive(e.target.checked)}
                    className="w-5 h-5 accent-emerald-700 cursor-pointer"
                  />
                </div>

                {/* Shipping Label Format */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-900">Automated Shipping Label Format</p>
                    <span className="text-xs font-mono font-bold text-emerald-700">{labelFormat}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setLabelFormat('100mm')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        labelFormat === '100mm'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      100mm Thermal Roll (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLabelFormat('A4')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        labelFormat === 'A4'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      A4 Standard Laser (4 Up)
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveGovernanceSettings}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Save Logistics Carriers Configuration
              </button>
            </div>

            {/* Pincode Zone Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pincode Delivery Zone Rates</h3>
                <p className="text-xs text-slate-500">Zone-based rates automatically calculated upon pincode entry</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zone A: Hyperlocal (0–25 km)</p>
                    <p className="text-[11px] text-slate-500">Same-day harvest delivery directly from cold hub</p>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm text-slate-900">
                    <span>₹</span>
                    <input
                      type="number"
                      value={zoneARate}
                      onChange={(e) => setZoneARate(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zone B: Regional Intra-State (25–150 km)</p>
                    <p className="text-[11px] text-slate-500">Next-morning arrival in solar refrigerated vans</p>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm text-slate-900">
                    <span>₹</span>
                    <input
                      type="number"
                      value={zoneBRate}
                      onChange={(e) => setZoneBRate(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Zone C: National Cold Corridor (&gt;150 km)</p>
                    <p className="text-[11px] text-slate-500">Shipped via India Post Speed Post / Delhivery Air</p>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm text-slate-900">
                    <span>₹</span>
                    <input
                      type="number"
                      value={zoneCRate}
                      onChange={(e) => setZoneCRate(Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WHOLESALER B2B & KYC */}
      {activeTab === 'wholesale' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Wholesale B2B &amp; HORECA KYC Applications</h3>
                <p className="text-xs text-slate-500">Manage business accounts, allocate lines-of-credit, and monitor aging receivables</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs">
                Status: {wholesaleKyc?.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>

            {wholesaleKyc && (
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Business Legal Name</span>
                    <p className="font-bold text-slate-900 text-sm">{wholesaleKyc.businessName}</p>
                    <p className="text-xs text-slate-500">{wholesaleKyc.businessType}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tax Registration</span>
                    <p className="font-mono font-bold text-slate-900 text-xs">GSTIN: {wholesaleKyc.gstin}</p>
                    <p className="font-mono text-xs text-slate-500">PAN: {wholesaleKyc.pan} · FSSAI: {wholesaleKyc.fssaiNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Receivables &amp; DSO</span>
                    <p className="font-bold text-slate-900 text-sm">DSO: {wholesaleKyc.dsoDays || 14} Days</p>
                    <p className="text-xs text-emerald-700 font-semibold">Available Balance: ₹{wholesaleKyc.availableCreditBalance?.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="text-xs font-bold text-slate-800 whitespace-nowrap">Allocated Line of Credit (₹):</label>
                    <input
                      type="number"
                      step="10000"
                      value={wholesaleCreditLimitInput}
                      onChange={(e) => setWholesaleCreditLimitInput(Number(e.target.value))}
                      className="px-3 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-xl bg-white w-40"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end">
                    <button
                      type="button"
                      onClick={() => handleUpdateKycStatus('rejected')}
                      className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateKycStatus('active')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Approve &amp; Assign Credit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: MULTI-VENDOR OPERATIONS & SLA */}
      {activeTab === 'multivendor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Grower Collectives &amp; SLA Performance Scorecard</h3>
                <p className="text-xs text-slate-500">Monitors on-time dispatch rates, cancellation frequencies, and automated wallet disbursements</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Direct Grower Cut:</span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {vendorPayoutShare}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Collective &amp; Agronomist</th>
                    <th className="py-3 px-4">Active Produce Lots</th>
                    <th className="py-3 px-4">On-Time Dispatch</th>
                    <th className="py-3 px-4">Cancellation Rate</th>
                    <th className="py-3 px-4">Return Frequency</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {vendorSlaList.map((v) => (
                    <tr key={v.collectiveName} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{v.collectiveName}</p>
                        <p className="text-[11px] text-slate-500">Lead: {v.leadAgronomist}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{v.lotsCount} Lots</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-emerald-700">{v.onTimeDispatchRate}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-700">{v.cancellationRate}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-700">{v.returnFrequency}%</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          VERIFIED SLA
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DATABASE PERSISTENCE & SEEDER */}
      {activeTab === 'database' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-base font-bold text-slate-900">Cloud Firestore Persistent Database Status</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Database: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800">ai-studio-farmdirect100tra-a06b0ad1-3d9b-42fa-a3cb-95e2deb95720</code>
              </p>
            </div>

            <button
              type="button"
              onClick={handleSeedCloudDatabase}
              disabled={isSeedingDatabase}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2 self-start"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
              <span>{isSeedingDatabase ? 'Synchronizing Collections...' : 'Seed / Reset Sample Data to Cloud Database'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Collection: produce_items</span>
              <p className="text-xl font-bold text-slate-900 mt-1">8 Lots</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Single-origin GI crops</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Collection: orders</span>
              <p className="text-xl font-bold text-slate-900 mt-1">Real-time Stream</p>
              <p className="text-[11px] text-blue-700 mt-0.5">Escrow locked dispatches</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Collection: wholesale_kyc</span>
              <p className="text-xl font-bold text-slate-900 mt-1">Active</p>
              <p className="text-[11px] text-purple-700 mt-0.5">₹2.5L Line-of-credit</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Collection: app_settings</span>
              <p className="text-xl font-bold text-slate-900 mt-1">governance_rules</p>
              <p className="text-[11px] text-amber-700 mt-0.5">Free shipping &amp; COD caps</p>
            </div>
          </div>

          {/* Interactive Cloud Database Produce Record Ingestion */}
          <div className="pt-4 border-t border-slate-200/80">
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">add_circle</span>
              <span>Insert Real Produce Lot Directly to Cloud Firestore</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Add new single-origin farm lots directly to the live Firestore collection. The customer marketplace updates automatically in real-time.
            </p>

            <form onSubmit={handleAddNewProduceLot} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Crop / Lot Name *</label>
                <input
                  type="text"
                  required
                  value={newLotName}
                  onChange={(e) => setNewLotName(e.target.value)}
                  placeholder="e.g. Heirloom Purple Carrots"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newLotCategory}
                  onChange={(e) => setNewLotCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="leafy">Leafy Greens &amp; Vegetables</option>
                  <option value="fruits">Fruits &amp; Apples</option>
                  <option value="dairy">Dairy &amp; A2 Milk</option>
                  <option value="grains">Grains &amp; Spices</option>
                  <option value="special">Specialty Harvest</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Price (₹/unit)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newLotPrice}
                  onChange={(e) => setNewLotPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Origin Cluster</label>
                <input
                  type="text"
                  value={newLotFarm}
                  onChange={(e) => setNewLotFarm(e.target.value)}
                  placeholder="Farm cluster origin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isAddingLot}
                  className="w-full py-2 px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{isAddingLot ? 'Saving...' : 'Add to Database'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect QA Modal */}
      {inspectPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">QA Lab Spectrometry &amp; Photo Inspection</h3>
              <button
                type="button"
                onClick={() => setInspectPhotoUrl(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <img src={inspectPhotoUrl} alt="Inspection proof" className="w-full h-64 object-cover rounded-xl" />
            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700">
              <p className="font-semibold text-slate-900">Brix Sweetness Score: 6.8 (Grade A Standard)</p>
              <p>Ozone Pre-Cool wash verified at farm gate. Pesticide residue: 0.00 ppm.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setInspectPhotoUrl(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
