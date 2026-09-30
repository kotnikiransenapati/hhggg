/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveScreen, CartItem, ProduceItem, OrderRecord } from './types';
import { INITIAL_PRODUCE, INITIAL_ORDERS } from './data/mockData';
import {
  Header,
  Footer,
  LandingScreen,
  MarketplaceScreen,
  TraceabilityScreen,
  CommunityScreen,
  CheckoutScreen,
  MyOrdersScreen,
  CustomerProfileScreen,
  CartDrawer,
  TraceModal,
  VideoModal,
  AddressModal,
  EscrowSuccessModal,
  FloatingRolePortalWidget,
  ContactsScreen,
  GeminiIntelligenceScreen,
  FloatingVoiceAiWidget,
  GlobalSearchModal,
  SpinToWinModal,
  CommunityReviewsModal,
  ProductComparisonModal,
  PriceHistoryModal,
  WaitlistAlertModal,
  CartShareModal,
  ShippingLabelModal,
  TaxInvoiceModal,
  CommandPaletteModal,
  AuditTrailModal,
  EmergencyKillSwitchModal,
  NightlyMaintenanceModal,
  VerifiedPurchaseToasts,
  UniqueLinkRedirect,
  WishlistDrawer,
  AuthModal,
  CouponDiscountCenterModal,
} from './components';
import {
  FarmerPanel,
  AdminPanel,
  SupportPanel,
  WholesalePortal,
  VendorStorefrontModal,
  VendorOnboardingModal,
  Customer360Drawer,
} from './panels';
import { firestoreService } from './services/firestoreService';
import { popupQueue } from './services/popupQueue';
import { offlineCartQueue } from './services/offlineCartQueue';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('landing');
  const [currentAddress, setCurrentAddress] = useState<string>('Bandra West, Mumbai 400050');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [produceList, setProduceList] = useState<ProduceItem[]>(INITIAL_PRODUCE);

  // Initial cart with 3 items matching user's reference
  const [cart, setCart] = useState<CartItem[]>([
    {
      item: INITIAL_PRODUCE[0], // Organic Shimla Royal Apples (₹220)
      quantity: 1,
    },
    {
      item: INITIAL_PRODUCE[3], // Pure Raw A2 Gir Cow Milk (₹95)
      quantity: 1,
    },
    {
      item: INITIAL_PRODUCE[1], // Nashik Red Vine Tomatoes (₹45)
      quantity: 1,
    },
  ]);

  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('ramesh');

  // Wishlist state (persisted to Firestore + localStorage)
  const [wishlist, setWishlist] = useState<ProduceItem[]>([]);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState<boolean>(false);

  // Modals & Drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [activeTraceBatchId, setActiveTraceBatchId] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isEscrowSuccessOpen, setIsEscrowSuccessOpen] = useState<boolean>(false);
  const [lastPlacedTotal, setLastPlacedTotal] = useState<number>(898.45);

  // Additional Discovery, Commerce & Governance Modals
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState<boolean>(false);
  const [isDiscountCenterOpen, setIsDiscountCenterOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState<boolean>(false);
  const [isCustomer360Open, setIsCustomer360Open] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isCartShareOpen, setIsCartShareOpen] = useState<boolean>(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState<boolean>(false);
  const [isEmergencyKillSwitchOpen, setIsEmergencyKillSwitchOpen] = useState<boolean>(false);
  const [isNightlyMaintenanceOpen, setIsNightlyMaintenanceOpen] = useState<boolean>(false);
  const [isVendorOnboardingOpen, setIsVendorOnboardingOpen] = useState<boolean>(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderRecord | null>(null);
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<OrderRecord | null>(null);
  const [selectedItemsForComparison, setSelectedItemsForComparison] = useState<ProduceItem[]>([]);
  const [selectedProduceForPriceHistory, setSelectedProduceForPriceHistory] = useState<ProduceItem | null>(null);
  const [selectedProduceForWaitlist, setSelectedProduceForWaitlist] = useState<ProduceItem | null>(null);
  const [selectedVendorForStorefront, setSelectedVendorForStorefront] = useState<any | null>(null);

  // Fetch real data from Firestore database with real-time listener
  useEffect(() => {
    // Bootstrap Firestore collections with initial production-ready data if needed
    firestoreService.initializeDatabase();

    // Load real produce items
    firestoreService.getProduceItems().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setProduceList(data);
        // Load saved wishlist from Firestore or localStorage
        firestoreService.getWishlist().then((itemIds) => {
          if (itemIds && itemIds.length > 0) {
            const matched = data.filter((p) => itemIds.includes(p.id));
            if (matched.length > 0) setWishlist(matched);
          } else {
            try {
              const local = localStorage.getItem('farmdirect_wishlist');
              if (local) {
                const ids: string[] = JSON.parse(local);
                const matched = data.filter((p) => ids.includes(p.id));
                if (matched.length > 0) setWishlist(matched);
              }
            } catch (e) {}
          }
        });
      }
    }).catch((err) => console.warn('Using fallback produce:', err));

    // Listen to real-time orders in Firestore
    const unsubscribeOrders = firestoreService.listenOrders((realOrders) => {
      if (realOrders && Array.isArray(realOrders) && realOrders.length > 0) {
        setOrders(realOrders);
      }
    });

    // Listen to real-time produce lots in Firestore
    const unsubscribeProduce = firestoreService.listenProduceItems((realProduce) => {
      if (realProduce && Array.isArray(realProduce) && realProduce.length > 0) {
        setProduceList(realProduce);
      }
    });

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeProduce) unsubscribeProduce();
    };
  }, []);

  // Offline Cart & Cart Share snapshot restore
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shareCode = params.get('cartShare');
      if (shareCode) {
        const shared = offlineCartQueue.getSharedCart(shareCode);
        if (shared && shared.items.length > 0) {
          setCart(shared.items);
          setIsCartDrawerOpen(true);
        }
      }
    }
  }, []);

  // Persist guest cart locally
  useEffect(() => {
    offlineCartQueue.saveGuestCart(cart);
  }, [cart]);

  // Sequential Popup Orchestration (popupQueue)
  useEffect(() => {
    const unsubPopup = popupQueue.subscribe((active) => {
      if (active?.type === 'spin-wheel') {
        setIsSpinWheelOpen(true);
      }
    });

    // Enqueue spin-wheel promotional reward cleanly
    popupQueue.enqueue({
      id: 'spin-to-win-daily',
      type: 'spin-wheel',
      priority: 2,
      delayMs: 5000,
    });

    return () => {
      if (unsubPopup) unsubPopup();
    };
  }, []);

  // Universal Command Palette keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddToCart = (produce: ProduceItem, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === produce.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === produce.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { item: produce, quantity }];
    });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    setCart((prev) => {
      if (newQty <= 0) {
        return prev.filter((c) => c.item.id !== itemId);
      }
      return prev.map((c) => (c.item.id === itemId ? { ...c, quantity: newQty } : c));
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (
    total: number,
    paymentMeta?: { paymentId?: string; orderId?: string; method?: string }
  ) => {
    setLastPlacedTotal(total);

    // Capture items from current cart (or fallback default items if cart was empty)
    const orderItems =
      cart.length > 0
        ? cart.map((c) => ({
            name: c.item.name,
            quantity: c.quantity,
            price: c.item.price,
            farmerName: c.item.farmer,
          }))
        : [
            { name: 'Vine-Ripened Country Tomatoes (3 kg crate)', quantity: 3, price: 45, farmerName: 'Ramesh Patel' },
            { name: 'Hydroponic Baby Spinach (500g)', quantity: 2, price: 40, farmerName: 'Ramesh Patel' },
            { name: 'Organic Shimla Royal Delicious Apples (1 kg)', quantity: 2, price: 220, farmerName: 'Green Valley Orchards' },
            { name: 'Raw Pure A2 Gir Cow Milk (1L Glass Bottle)', quantity: 2, price: 95, farmerName: 'Nandini Pastoral Dairy' },
          ];

    const newOrder: OrderRecord = {
      id: `FD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Today',
      items: orderItems,
      subtotal: Math.round(total * 0.94),
      logisticsFee: 45,
      platformFee: 8.45,
      discount: 0,
      total: total,
      escrowStatus: 'Locked',
      reeferTemp: '3.8°C',
      slot: 'Today 11:30 AM – 1:00 PM',
      driverName: 'Santosh Yadav',
      vanNumber: 'MH-15-EG-4402',
      eta: 'Today 12:45 PM',
      paymentId: paymentMeta?.paymentId,
      razorpayOrderId: paymentMeta?.orderId,
      paymentMethod: paymentMeta?.method || 'Escrow Locked',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setIsEscrowSuccessOpen(true);

    // CRITICAL: Reset product cart card and basket after every order
    setCart([]);
    setIsCartDrawerOpen(false);

    try {
      await firestoreService.saveOrder(newOrder);
      console.log('Order successfully persisted in real Firestore database:', newOrder.id);
    } catch (err) {
      console.error('Failed to sync order to Firestore database:', err);
    }
  };

  const handleReleaseEscrow = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, escrowStatus: 'Inspected & Released' } : o))
    );

    try {
      await firestoreService.releaseOrderEscrow(orderId);
      console.log('Escrow release successfully persisted in Firestore for order:', orderId);
    } catch (err) {
      console.error('Failed to sync escrow release to database:', err);
    }
  };

  const handleRateOrder = async (orderId: string, rating: number, reviewComment?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              rating,
              reviewComment: reviewComment !== undefined ? reviewComment : o.reviewComment,
              ratedAt: 'Just now',
            }
          : o
      )
    );

    try {
      await firestoreService.rateOrder(orderId, rating, reviewComment);
      console.log('Order rating persisted in Firestore for order:', orderId);
    } catch (err) {
      console.error('Failed to sync rating to database:', err);
    }
  };

  const handleToggleWishlist = (item: ProduceItem) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      const next = exists ? prev.filter((p) => p.id !== item.id) : [...prev, item];
      const ids = next.map((p) => p.id);
      try {
        localStorage.setItem('farmdirect_wishlist', JSON.stringify(ids));
        firestoreService.saveWishlist('guest_user', ids);
      } catch (e) {}
      return next;
    });
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlist((prev) => {
      const next = prev.filter((p) => p.id !== itemId);
      const ids = next.map((p) => p.id);
      try {
        localStorage.setItem('farmdirect_wishlist', JSON.stringify(ids));
        firestoreService.saveWishlist('guest_user', ids);
      } catch (e) {}
      return next;
    });
  };

  const handleMoveWishlistToCart = (item: ProduceItem) => {
    handleAddToCart(item, 1);
    handleRemoveFromWishlist(item.id);
  };

  const handleMoveAllWishlistToCart = () => {
    wishlist.forEach((item) => handleAddToCart(item, 1));
    setWishlist([]);
    try {
      localStorage.removeItem('farmdirect_wishlist');
      firestoreService.saveWishlist('guest_user', []);
    } catch (e) {}
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.removeItem('farmdirect_wishlist');
      firestoreService.saveWishlist('guest_user', []);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Short Link Attribution Handler (/u/:slug or ?ref=) */}
      <UniqueLinkRedirect onRedirect={setActiveScreen} />

      {/* Top Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        cartCount={cartCount}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
        wishlistCount={wishlist.length}
        openWishlistDrawer={() => setIsWishlistDrawerOpen(true)}
        openAddressModal={() => setIsAddressModalOpen(true)}
        currentAddress={currentAddress}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenSpinWheel={() => setIsSpinWheelOpen(true)}
        onOpenDiscountCenter={() => setIsDiscountCenterOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenReviews={() => setIsReviewsModalOpen(true)}
        onOpenCustomer360={() => setIsCustomer360Open(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pt-20 flex-1">
        {activeScreen === 'landing' && (
          <LandingScreen
            produceList={produceList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            setActiveScreen={setActiveScreen}
            onAddToCart={handleAddToCart}
            onOpenTrace={(batchId) => setActiveTraceBatchId(batchId)}
            openAddressModal={() => setIsAddressModalOpen(true)}
            currentAddress={currentAddress}
          />
        )}

        {activeScreen === 'marketplace' && (
          <MarketplaceScreen
            produceList={produceList}
            cart={cart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            setActiveScreen={setActiveScreen}
            onOpenTrace={(batchId) => setActiveTraceBatchId(batchId)}
            onOpenCart={() => setIsCartDrawerOpen(true)}
            searchQuery={searchQuery}
            onOpenPriceHistory={(item) => setSelectedProduceForPriceHistory(item)}
            onOpenWaitlist={(item) => setSelectedProduceForWaitlist(item)}
            onOpenComparison={(items) => setSelectedItemsForComparison(items)}
            onOpenVendorStorefront={(farmerName) =>
              setSelectedVendorForStorefront({
                collectiveName: `${farmerName} Producer Collective`,
                leadAgronomist: farmerName,
                bannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
                avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
                slug: farmerName.toLowerCase().replace(/\s+/g, '-'),
                location: 'Nashik Valley, MH',
                rating: 4.9,
                totalOrdersFulfilled: 3410,
                onTimeDispatchRate: 98.4,
                cancellationRate: 0.2,
                returnFrequency: 0.4,
                walletBalanceRupees: 184200,
                bio: 'Certified regenerative agro-ecological collective cultivating indigenous heritage crops with zero chemical inputs.',
              })
            }
          />
        )}

        {activeScreen === 'traceability' && (
          <TraceabilityScreen
            setActiveScreen={setActiveScreen}
            onOpenVideo={() => setIsVideoModalOpen(true)}
            onSelectFarmerForChat={(farmerId) => setSelectedFarmerId(farmerId)}
          />
        )}

        {activeScreen === 'community' && (
          <CommunityScreen
            selectedFarmerId={selectedFarmerId}
            setSelectedFarmerId={setSelectedFarmerId}
            onAddToCartDirect={(item, qty) => handleAddToCart(item, qty)}
            onOpenTrace={(batchId) => setActiveTraceBatchId(batchId)}
          />
        )}

        {activeScreen === 'checkout' && (
          <CheckoutScreen
            cart={cart}
            currentAddress={currentAddress}
            openAddressModal={() => setIsAddressModalOpen(true)}
            onPlaceOrder={handlePlaceOrder}
            setActiveScreen={setActiveScreen}
          />
        )}

        {activeScreen === 'contacts' && (
          <ContactsScreen />
        )}

        {activeScreen === 'gemini-intelligence' && (
          <GeminiIntelligenceScreen />
        )}

        {activeScreen === 'orders' && (
          <MyOrdersScreen
            orders={orders}
            onReleaseEscrow={handleReleaseEscrow}
            onRateOrder={handleRateOrder}
            setActiveScreen={setActiveScreen}
            onViewInvoice={(ord) => setSelectedOrderForInvoice(ord)}
            onViewShippingLabel={(ord) => setSelectedOrderForShipping(ord)}
            onReorder={(ord) => {
              ord.items.forEach((it) => {
                const found = produceList.find((p) => p.name === it.name);
                if (found) handleAddToCart(found, it.quantity);
              });
              setIsCartDrawerOpen(true);
            }}
          />
        )}

        {activeScreen === 'profile' && (
          <CustomerProfileScreen
            orders={orders}
            currentAddress={currentAddress}
            setActiveScreen={setActiveScreen}
            openAddressModal={() => setIsAddressModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeScreen === 'wholesale' && (
          <WholesalePortal
            onBackToCustomer={() => setActiveScreen('landing')}
            onOpenOrderSuccess={(total) => {
              setLastPlacedTotal(total);
              setIsEscrowSuccessOpen(true);
            }}
          />
        )}

        {activeScreen === 'farmer-panel' && (
          <div className="max-w-7xl mx-auto px-6 py-6 w-full">
            <FarmerPanel />
          </div>
        )}

        {activeScreen === 'admin-panel' && (
          <div className="max-w-7xl mx-auto px-6 py-6 w-full">
            <AdminPanel
              onNavigateToSupport={() => setActiveScreen('support-panel')}
              onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
              onOpenKillSwitch={() => setIsEmergencyKillSwitchOpen(true)}
              onOpenNightlyMaintenance={() => setIsNightlyMaintenanceOpen(true)}
              onOpenCustomer360={() => setIsCustomer360Open(true)}
              onOpenVendorOnboarding={() => setIsVendorOnboardingOpen(true)}
            />
          </div>
        )}

        {activeScreen === 'support-panel' && (
          <div className="max-w-7xl mx-auto px-6 py-6 w-full">
            <SupportPanel />
          </div>
        )}
      </div>

      {/* Simplified Universal Footer */}
      <Footer setActiveScreen={setActiveScreen} />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onClearCart={handleClearCart}
        setActiveScreen={setActiveScreen}
        onOpenShareCart={() => setIsCartShareOpen(true)}
        onOpenDiscountCenter={() => setIsDiscountCenterOpen(true)}
        externalCouponCode={appliedCouponCode}
        onApplyCouponCode={(code) => setAppliedCouponCode(code)}
      />

      {/* Slide-Over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onMoveAllToCart={handleMoveAllWishlistToCart}
        onClearWishlist={handleClearWishlist}
      />

      {/* Traceability and Video Modals */}
      <TraceModal
        batchId={activeTraceBatchId}
        onClose={() => setActiveTraceBatchId(null)}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(addr) => setCurrentAddress(addr)}
      />

      <EscrowSuccessModal
        isOpen={isEscrowSuccessOpen}
        onClose={() => setIsEscrowSuccessOpen(false)}
        orderTotal={lastPlacedTotal}
        setActiveScreen={setActiveScreen}
      />

      {/* 1. Conversion & Social Proof Engine */}
      <VerifiedPurchaseToasts
        onItemClick={(name) => {
          setSearchQuery(name);
          setActiveScreen('marketplace');
        }}
      />

      <SpinToWinModal
        isOpen={isSpinWheelOpen}
        onClose={() => {
          setIsSpinWheelOpen(false);
          popupQueue.dismissCurrent();
        }}
        onRewardClaimed={(code) => {
          console.log('Reward coupon claimed:', code);
          setAppliedCouponCode(code);
        }}
        onApplyDirectly={(code) => {
          setAppliedCouponCode(code);
          setIsCartDrawerOpen(true);
        }}
      />

      {/* Offers & Discount Center Modal */}
      <CouponDiscountCenterModal
        isOpen={isDiscountCenterOpen}
        onClose={() => setIsDiscountCenterOpen(false)}
        cartSubtotal={cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0)}
        onApplyCoupon={(code) => {
          setAppliedCouponCode(code);
          setIsCartDrawerOpen(true);
        }}
        activeAppliedCode={appliedCouponCode}
      />

      {/* User Authentication & Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CommunityReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
      />

      {/* 2. Search, Discovery & Interactive Tools */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        produceList={produceList}
        onSelectProduce={(item) => {
          setActiveScreen('marketplace');
          handleAddToCart(item, 1);
        }}
        onSelectCategory={() => {
          setActiveScreen('marketplace');
        }}
      />

      <ProductComparisonModal
        isOpen={selectedItemsForComparison.length > 0}
        onClose={() => setSelectedItemsForComparison([])}
        items={selectedItemsForComparison}
        onAddToCart={handleAddToCart}
        onOpenTrace={(batchId) => setActiveTraceBatchId(batchId)}
      />

      <PriceHistoryModal
        isOpen={Boolean(selectedProduceForPriceHistory)}
        onClose={() => setSelectedProduceForPriceHistory(null)}
        produce={selectedProduceForPriceHistory}
      />

      <WaitlistAlertModal
        isOpen={Boolean(selectedProduceForWaitlist)}
        onClose={() => setSelectedProduceForWaitlist(null)}
        produce={selectedProduceForWaitlist}
      />

      {/* 3. Commerce, Cart & Invoicing */}
      <CartShareModal
        isOpen={isCartShareOpen}
        onClose={() => setIsCartShareOpen(false)}
        cart={cart}
      />

      <TaxInvoiceModal
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
      />

      <ShippingLabelModal
        isOpen={Boolean(selectedOrderForShipping)}
        onClose={() => setSelectedOrderForShipping(null)}
        order={selectedOrderForShipping}
      />

      {/* 4. Multi-Vendor Operations & Customer 360 */}
      <VendorStorefrontModal
        isOpen={Boolean(selectedVendorForStorefront)}
        onClose={() => setSelectedVendorForStorefront(null)}
        vendor={selectedVendorForStorefront}
        produceItems={produceList}
        onAddToCart={handleAddToCart}
        onOpenTrace={(batchId) => setActiveTraceBatchId(batchId)}
      />

      <VendorOnboardingModal
        isOpen={isVendorOnboardingOpen}
        onClose={() => setIsVendorOnboardingOpen(false)}
      />

      <Customer360Drawer
        isOpen={isCustomer360Open}
        onClose={() => setIsCustomer360Open(false)}
        orders={orders}
        onReorder={(ord) => {
          ord.items.forEach((it) => {
            const found = produceList.find((p) => p.name === it.name);
            if (found) handleAddToCart(found, it.quantity);
          });
          setIsCartDrawerOpen(true);
        }}
      />

      {/* 5. Governance, Auditing & Command Palette */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(screen) => setActiveScreen(screen)}
        onTriggerAction={(actionId) => {
          if (actionId === 'open-audit-trail') setIsAuditTrailOpen(true);
          else if (actionId === 'open-kill-switch') setIsEmergencyKillSwitchOpen(true);
          else if (actionId === 'open-nightly') setIsNightlyMaintenanceOpen(true);
          else if (actionId === 'open-customer-360') setIsCustomer360Open(true);
          else if (actionId === 'open-vendor-onboarding') setIsVendorOnboardingOpen(true);
          else if (actionId === 'open-spin-wheel') setIsSpinWheelOpen(true);
          else if (actionId === 'open-reviews') setIsReviewsModalOpen(true);
        }}
      />

      <AuditTrailModal
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
      />

      <EmergencyKillSwitchModal
        isOpen={isEmergencyKillSwitchOpen}
        onClose={() => setIsEmergencyKillSwitchOpen(false)}
      />

      <NightlyMaintenanceModal
        isOpen={isNightlyMaintenanceOpen}
        onClose={() => setIsNightlyMaintenanceOpen(false)}
      />

      {/* Floating Stakeholder Portal Switcher (Non-intrusive role navigation) */}
      <FloatingRolePortalWidget
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      {/* Floating Kisan Live Voice AI Assistant (gemini-3.8-live) */}
      <FloatingVoiceAiWidget
        onOpenFullIntelligence={() => setActiveScreen('gemini-intelligence')}
      />
    </div>
  );
}
