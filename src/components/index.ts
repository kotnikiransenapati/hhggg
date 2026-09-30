// Centralized component exports for clean modular architecture

// Layout
export { Header } from './Header';
export { Footer } from './Footer';
export { RoleSwitcherBar } from './RoleSwitcherBar';

// Screens
export { LandingScreen } from './LandingScreen';
export { MarketplaceScreen } from './MarketplaceScreen';
export { TraceabilityScreen } from './TraceabilityScreen';
export { CommunityScreen } from './CommunityScreen';
export { CheckoutScreen } from './CheckoutScreen';
export { MyOrdersScreen } from './MyOrdersScreen';
export { CustomerProfileScreen } from './CustomerProfileScreen';
export { ContactsScreen } from './ContactsScreen';
export { GeminiIntelligenceScreen } from './GeminiIntelligenceScreen';
export { FloatingVoiceAiWidget } from './FloatingVoiceAiWidget';
export { GoogleContactsConfirmModal } from './GoogleContactsConfirmModal';

// Modals & Drawers
export { AuthModal } from './AuthModal';
export { CartDrawer } from './CartDrawer';
export { WishlistDrawer } from './WishlistDrawer';
export { AddressModal } from './AddressModal';
export { EscrowSuccessModal } from './EscrowSuccessModal';
export { TraceModal } from './TraceModal';
export { VideoModal } from './VideoModal';
export { CouponDiscountCenterModal } from './commerce/CouponDiscountCenterModal';

// Features & Visualizations
export { OrganicConsumptionChart } from './OrganicConsumptionChart';
export { OrderRatingField } from './OrderRatingField';
export { DeliveryTrackingVisualizer } from './DeliveryTrackingVisualizer';
export { HomeBento21st } from './HomeBento21st';
export { LiveHarvestMarquee } from './LiveHarvestMarquee';
export { InteractiveColdChainStepper } from './InteractiveColdChainStepper';
export { FloatingRolePortalWidget } from './FloatingRolePortalWidget';

// 1. Social Proof & Reviews
export { VerifiedPurchaseToasts } from './social-proof/VerifiedPurchaseToasts';
export { SpinToWinModal } from './social-proof/SpinToWinModal';
export { CommunityReviewsModal } from './social-proof/CommunityReviewsModal';

// 2. Search, Voice & Discovery
export { GlobalSearchModal } from './discovery/GlobalSearchModal';
export { ProductComparisonModal } from './discovery/ProductComparisonModal';
export { PriceHistoryModal } from './discovery/PriceHistoryModal';
export { WaitlistAlertModal } from './discovery/WaitlistAlertModal';

// 3. Commerce & Cart
export { CartShareModal } from './commerce/CartShareModal';
export { ShippingLabelModal } from './commerce/ShippingLabelModal';
export { TaxInvoiceModal } from './commerce/TaxInvoiceModal';
export { UniqueLinkRedirect } from './commerce/UniqueLinkRedirect';

// 4. Admin Governance & Security
export { CommandPaletteModal } from './admin/CommandPaletteModal';
export { RoleSimulatorBar } from './admin/RoleSimulatorBar';
export { AuditTrailModal } from './admin/AuditTrailModal';
export { EmergencyKillSwitchModal } from './admin/EmergencyKillSwitchModal';
export { NightlyMaintenanceModal } from './admin/NightlyMaintenanceModal';
