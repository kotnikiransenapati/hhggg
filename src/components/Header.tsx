import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useAuth } from '../contexts/AuthContext.tsx';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  openCartDrawer: () => void;
  wishlistCount?: number;
  openWishlistDrawer?: () => void;
  openAddressModal: () => void;
  currentAddress: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSearchModal?: () => void;
  onOpenSpinWheel?: () => void;
  onOpenDiscountCenter?: () => void;
  onOpenAuthModal?: () => void;
  onOpenReviews?: () => void;
  onOpenCustomer360?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  setActiveScreen,
  cartCount,
  openCartDrawer,
  wishlistCount = 0,
  openWishlistDrawer,
  openAddressModal,
  currentAddress,
  searchQuery,
  onOpenSearchModal,
  onOpenSpinWheel,
  onOpenDiscountCenter,
  onOpenAuthModal,
  onOpenReviews,
  onOpenCustomer360,
  onOpenCommandPalette,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, signInWithGoogle, signOut } = useAuth();

  const primaryNavItems = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'traceability', label: 'Traceability' },
    { id: 'wholesale', label: 'Wholesale B2B' },
    { id: 'community', label: 'Community' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 md:gap-4">
        {/* Left Section: Logo & Location */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveScreen('landing')}
            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">eco</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                FarmDirect
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                100% Traceable
              </span>
            </div>
          </button>

          {/* Compact Location Pill */}
          <button
            onClick={openAddressModal}
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer max-w-[150px]"
            title="Change Delivery Location"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-700">location_on</span>
            <span className="truncate">{currentAddress.split(',')[0]}</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
          </button>
        </div>

        {/* Center Navigation Links (Clean & Spacious) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-semibold text-slate-600">
          {primaryNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id as ActiveScreen)}
              className={`transition-colors cursor-pointer py-1 relative ${
                activeScreen === item.id
                  ? 'text-emerald-800 font-bold after:content-[""] after:absolute after:bottom-[-4px] after:inset-x-0 after:h-0.5 after:bg-emerald-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* More / AI Features Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExploreMenu(!showExploreMenu)}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer py-1"
            >
              <span>Explore</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showExploreMenu && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-fadeIn"
                onMouseLeave={() => setShowExploreMenu(false)}
              >
                <button
                  onClick={() => {
                    setActiveScreen('contacts');
                    setShowExploreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">contacts</span>
                  <div>
                    <div className="font-bold">Google Contacts</div>
                    <div className="text-[10px] text-slate-400">Farmers &amp; Buyers directory</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveScreen('gemini-intelligence');
                    setShowExploreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-purple-600">psychology</span>
                  <div>
                    <div className="font-bold">Gemini AI Suite ✨</div>
                    <div className="text-[10px] text-slate-400">Thinking, search &amp; maps grounding</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenReviews?.();
                    setShowExploreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-600">verified</span>
                  <div>
                    <div className="font-bold">Community Stories</div>
                    <div className="text-[10px] text-slate-400">Lab-tested harvest feedback</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger Input (Responsive) */}
          <div
            onClick={onOpenSearchModal}
            className="hidden md:flex items-center relative cursor-pointer group w-36 lg:w-48 xl:w-56"
          >
            <span className="material-symbols-outlined absolute left-2.5 text-slate-400 group-hover:text-emerald-700 pointer-events-none text-[17px]">
              search
            </span>
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={onOpenSearchModal}
              placeholder="Search or speak..."
              className="w-full bg-slate-100 group-hover:bg-slate-50 text-slate-900 text-xs pl-8 pr-12 py-1.5 rounded-full border border-slate-200/80 group-hover:border-emerald-300 focus:outline-none transition-all cursor-pointer shadow-2xs"
            />
            <div className="absolute right-1.5 flex items-center gap-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSearchModal?.();
                }}
                className="w-5 h-5 rounded-full text-slate-400 hover:text-emerald-800 flex items-center justify-center cursor-pointer"
                title="Voice Search"
              >
                <span className="material-symbols-outlined text-[14px]">mic</span>
              </button>
              <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] font-mono text-slate-400 bg-white rounded border border-slate-200 shadow-3xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Mobile Search Icon Trigger */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            className="md:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            title="Search Produce"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>

          {/* Lucky Spin Wheel Button */}
          <button
            type="button"
            onClick={onOpenSpinWheel}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center justify-center text-sm cursor-pointer transition-colors shadow-2xs"
            title="Spin to Win Harvest Rewards"
          >
            <span role="img" aria-label="Spin wheel">🎰</span>
          </button>

          {/* Discount Center / Coupons Button */}
          {onOpenDiscountCenter && (
            <button
              type="button"
              onClick={onOpenDiscountCenter}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 flex items-center gap-1 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              title="Offers & Discount Center"
            >
              <span className="material-symbols-outlined text-[17px] text-emerald-700">confirmation_number</span>
              <span className="hidden xl:inline">Coupons</span>
            </button>
          )}

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={openWishlistDrawer}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/60 hover:border-rose-200 transition-colors flex items-center justify-center cursor-pointer relative shadow-2xs"
            title="View Saved Harvest Items"
            aria-label="Wishlist"
          >
            <span className="material-symbols-outlined text-[19px]">
              {wishlistCount > 0 ? 'favorite' : 'favorite_border'}
            </span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            aria-label="Shopping Cart"
            onClick={openCartDrawer}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px]">shopping_basket</span>
            <span className="font-bold text-xs">{cartCount}</span>
          </button>

          {/* Sign In Quick Button for Unauthenticated Guests */}
          {!user && onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="hidden sm:flex h-8 sm:h-9 px-3 rounded-xl bg-slate-900 hover:bg-black text-white items-center gap-1.5 font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Notifications */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Harvest Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer relative border border-slate-200/60 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-2 animate-fadeIn"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Cold-Chain Harvest Alerts</span>
                  <span className="text-emerald-700 font-semibold">2 New</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="font-bold text-slate-900">Reefer Truck #4 Departed</p>
                  <p className="text-slate-500 mt-0.5">Nashik harvest locked at 3.8°C en route to Bandra dock.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="font-bold text-slate-900">Ramesh Patel Morning Pick</p>
                  <p className="text-slate-500 mt-0.5">San Marzano vine tomatoes boxed in aerated crates.</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile / Account Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-label="User Profile and Portals"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="cursor-pointer flex items-center p-0.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-xl object-cover border border-emerald-600/40 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user ? (user.displayName || user.email || 'U').substring(0, 2).toUpperCase() : (
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  )}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-fadeIn"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-2 border-b border-slate-100 mb-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 truncate">
                      {user ? (user.displayName || userProfile?.name || 'Patron Account') : 'Guest Visitor'}
                    </p>
                    {user ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                        Guest
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user ? user.email : 'Sign in to sync database records'}
                  </p>
                </div>

                {!user && onOpenAuthModal && (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 cursor-pointer font-bold my-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    <span>Sign In / Register</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveScreen('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">account_circle</span>
                  Customer Profile &amp; Preferences
                </button>

                <button
                  onClick={() => {
                    setActiveScreen('orders');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  My Orders &amp; Escrow Releases
                </button>

                <button
                  onClick={() => {
                    onOpenCustomer360?.();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-700">contacts_product</span>
                  Customer 360 LTV Radar
                </button>

                <div className="pt-1 border-t border-slate-100 mt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
                    Stakeholder Panels
                  </span>
                  <button
                    onClick={() => {
                      setActiveScreen('farmer-panel');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-600">agriculture</span>
                    Farmer Dispatch Panel
                  </button>
                  <button
                    onClick={() => {
                      setActiveScreen('admin-panel');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-purple-600">admin_panel_settings</span>
                    Admin Command Oversight
                  </button>
                  <button
                    onClick={() => {
                      setActiveScreen('support-panel');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-600">support_agent</span>
                    Dispute Arbitration Desk
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2">
                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-700 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        signInWithGoogle();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 cursor-pointer font-semibold justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">login</span>
                      Sign In with Google
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white p-4 space-y-3 animate-fadeIn shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'marketplace', label: 'Marketplace', icon: 'storefront' },
              { id: 'traceability', label: 'Traceability', icon: 'qr_code_scanner' },
              { id: 'wholesale', label: 'Wholesale B2B', icon: 'corporate_fare' },
              { id: 'community', label: 'Community', icon: 'forum' },
              { id: 'orders', label: 'My Orders', icon: 'receipt_long' },
              { id: 'contacts', label: 'Contacts', icon: 'contacts' },
              { id: 'gemini-intelligence', label: 'Gemini AI ✨', icon: 'psychology' },
              { id: 'profile', label: 'Profile', icon: 'account_circle' },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveScreen(nav.id as ActiveScreen);
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                  activeScreen === nav.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-700">{nav.icon}</span>
                <span>{nav.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                openAddressModal();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-slate-600 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-700">location_on</span>
              <span className="truncate max-w-[200px]">{currentAddress}</span>
            </button>
            <button
              onClick={() => {
                onOpenCommandPalette?.();
                setIsMobileMenuOpen(false);
              }}
              className="text-[11px] text-slate-500 font-mono px-2 py-1 rounded bg-slate-100 border border-slate-200"
            >
              Command ⌘K
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
