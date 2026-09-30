export type ActiveScreen =
  | 'landing'
  | 'marketplace'
  | 'traceability'
  | 'community'
  | 'checkout'
  | 'orders'
  | 'profile'
  | 'wholesale'
  | 'farmer-panel'
  | 'admin-panel'
  | 'support-panel'
  | 'customer-hub'
  | 'contacts'
  | 'gemini-intelligence';

export type RolePanel =
  | 'customer'
  | 'farmer'
  | 'wholesaler'
  | 'vendor'
  | 'admin'
  | 'support';

export interface ProduceItem {
  id: string;
  name: string;
  category: 'leafy' | 'fruits' | 'dairy' | 'grains' | 'special';
  badge: string;
  batchId: string;
  imageUrl: string;
  harvestTime: string;
  harvestHoursAgo: number;
  origin: string;
  farmer: string;
  price: number;
  unit: string;
  growerSharePercent: number;
  accreditation: string[];
  distanceKm: number;
  inStock: boolean;
  description?: string;
  shelfLifeDays?: number;
  temperatureCelsius?: number;
  chemicalResiduePpm?: number;
  soilNpk?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  item: ProduceItem;
  quantity: number;
  savedForLater?: boolean;
}

export interface FarmCluster {
  id: string;
  name: string;
  region: string;
  pin: string;
  status: 'Dispatching Now' | 'Harvest Tomorrow' | 'Curing Lots' | 'Dormant cycle';
  farmersCount: number;
  crops: string[];
  acreage: number;
  soilNpk: number;
  coordinates: string;
  transitHours: number;
  leadFarmer: string;
  leadFarmerAvatar: string;
  bio: string;
  chemicalResiduePpm: number;
  humusPercent: number;
}

export interface BatchTimelineStage {
  stageNumber: string;
  category: string;
  title: string;
  description: string;
  timestamp: string;
  statusBadge?: string;
  icon: string;
  isColdChain?: boolean;
}

export interface BatchTrace {
  batchId: string;
  title: string;
  origin: string;
  consignmentVol: string;
  coldChainTemp: string;
  eta: string;
  iconEmoji: string;
  stages: BatchTimelineStage[];
}

export interface FarmerProfile {
  id: string;
  name: string;
  role: string;
  farmName: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  avatar: string;
  verified: boolean;
  seasonsCount: number;
  escrowFulfillmentPercent: number;
  acreage: number;
  soilWater: string;
  quote: string;
  seasonalHarvests: string[];
  certifications: string[];
  directItems: {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    image: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'consumer' | 'system' | 'ai-copilot';
  farmerId?: string;
  text: string;
  timestamp: string;
  photoUrl?: string;
  photoCaption?: string;
  audioDuration?: string;
  systemTelemetry?: {
    title: string;
    hub: string;
    temp: string;
    eta: string;
  };
}

export interface OrderRecord {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    farmerName: string;
  }[];
  subtotal: number;
  logisticsFee: number;
  platformFee: number;
  discount: number;
  total: number;
  escrowStatus: 'Locked' | 'Inspected & Released' | 'Refunded';
  reeferTemp: string;
  slot: string;
  driverName: string;
  vanNumber: string;
  eta: string;
  rating?: number;
  reviewComment?: string;
  ratedAt?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentMethod?: string;
  shippingPartner?: 'Delhivery Cold' | 'India Post Speed' | 'FarmDirect Express';
  trackingAwb?: string;
  invoiceNumber?: string;
  creditNoteNumber?: string;
}

// 1. Social Proof & Reviews Models
export interface VerifiedPurchaseEvent {
  id: string;
  customerFirstName: string;
  maskedCity: string;
  itemName: string;
  quantityStr: string;
  timeAgoMinutes: number;
  verifiedBadge: boolean;
  itemImage?: string;
}

export interface CommunityReview {
  id: string;
  customerName: string;
  customerState: string;
  purchasedItemName: string;
  harvestLotNumber: string;
  rating: number;
  dateStr: string;
  comment: string;
  photoVerified: boolean;
  helpfulnessUpvotes: number;
  userUpvoted?: boolean;
}

// 2. Unique Codes & Attribution Models
export interface CouponPolicy {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minSpend: number;
  expiresInDays: number;
  isSingleUse: boolean;
  assignedTo?: string;
  description: string;
}

export interface SpinReward {
  label: string;
  couponCode: string;
  discountDescription: string;
  color: string;
}

// 3. Wholesale B2B Models
export interface WholesalerKycData {
  businessName: string;
  businessType: 'Retail Chain' | 'Hotel/Restaurant (HORECA)' | 'Institutional Canteen' | 'Export House';
  gstin: string;
  pan: string;
  fssaiNumber: string;
  annualTurnover: string;
  deliveryHubCity: string;
  creditLimitRequested: number;
  status: 'pending' | 'verified' | 'active';
  allocatedCreditLimit: number;
  availableCreditBalance: number;
  dsoDays: number;
  assignedKamName: string;
  assignedKamContact: string;
}

export interface WholesaleBulkProduct {
  id: string;
  produceId: string;
  name: string;
  origin: string;
  unit: string; // e.g. "50 kg bag"
  basePricePerUnit: number;
  moqUnits: number;
  tierDiscounts: {
    minUnits: number;
    pricePerUnit: number;
    discountPercent: number;
  }[];
  inventoryAvailableUnits: number;
  harvestCutoffHour: string;
}

// 4. Multi-Vendor Operations Models
export interface VendorStorefront {
  id: string;
  slug: string;
  collectiveName: string;
  leadAgronomist: string;
  region: string;
  pin: string;
  establishedYear: number;
  activeFarmsCount: number;
  onTimeDispatchRate: number; // e.g. 98.4%
  cancellationRate: number; // e.g. 0.4%
  coldChainComplianceRate: number; // e.g. 99.8%
  walletBalanceRupees: number;
  certifications: string[];
  bannerUrl: string;
  avatarUrl: string;
  bioStory: string;
}

// 5. Customer 360 Models
export interface Customer360Profile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  lifetimeValueRupees: number;
  ordersCount: number;
  churnRiskScore: number; // 0 (safe) to 100 (critical)
  predictedNextOrderDate: string;
  loyaltyPoints: number;
  loyaltyTier: 'Seedling' | 'Blossom' | 'Harvester' | 'Guardian';
  lastReeferTempDelivered: string;
  abandonedCartItemsCount: number;
}

// 6. Admin Governance & Audit Models
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: string;
  actorEmail: string;
  action: string;
  targetEntity: string;
  entityId: string;
  diffSummary: string;
  piiMasked: boolean;
}

export interface FarmerDispatchLot {
  id: string;
  farmerId: string;
  farmerName: string;
  cluster: string;
  crop: string;
  crates: number;
  weightKg: number;
  harvestTime: string;
  coldClass: 'Leafy (2-4°C)' | 'Fruits (8-10°C)' | 'Dairy (1-3°C)';
  vanAssigned?: string;
  escrowExpected: number;
  escrowSettled: boolean;
  status: 'Ready at Farm Gate' | 'Reefer Dispatched' | 'Consolidated' | 'Delivered & Settled';
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  issueType: 'temperature_breach' | 'crispness_dispute' | 'delivery_delay' | 'general';
  status: 'open' | 'investigating' | 'resolved' | 'refunded';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  assignedExecutive: string;
  createdAt: string;
  reeferTempSnapshot?: string;
  resolution?: string;
}
