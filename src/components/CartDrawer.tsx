import React, { useState } from 'react';
import { CartItem, ActiveScreen } from '../types';
import { evaluateCheckoutRules, FREE_SHIPPING_THRESHOLD } from '../services/discountRulesEngine';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onClearCart: () => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenShareCart?: () => void;
  onOpenDiscountCenter?: () => void;
  externalCouponCode?: string | null;
  onApplyCouponCode?: (code: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
  setActiveScreen,
  onOpenShareCart,
  onOpenDiscountCenter,
  externalCouponCode,
  onApplyCouponCode,
}) => {
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>(externalCouponCode || '');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);

  // Sync external coupon code if updated
  React.useEffect(() => {
    if (externalCouponCode) {
      setAppliedCoupon(externalCouponCode);
    }
  }, [externalCouponCode]);

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, c) => acc + c.quantity, 0);
  const rawSubtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);

  const discountEval = evaluateCheckoutRules(rawSubtotal, appliedCoupon || undefined);

  const growerShare = (discountEval.finalTotal * 0.941).toFixed(2);
  const platformFee = (rawSubtotal * 0.01).toFixed(2);

  const progressPercent = Math.min(100, Math.round((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - rawSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const evaluation = evaluateCheckoutRules(rawSubtotal, couponInput.trim());
    if (evaluation.appliedCode) {
      setAppliedCoupon(evaluation.appliedCode);
      setCouponError(null);
    } else {
      setCouponError(evaluation.breakdownNotice || 'Invalid or expired promo code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponInput('');
    setCouponError(null);
  };

  const handleSaveForLater = (cartItem: CartItem) => {
    setSavedForLater((prev) => [...prev, cartItem]);
    onUpdateQty(cartItem.item.id, 0);
  };

  const handleMoveBackToCart = (item: CartItem) => {
    setSavedForLater((prev) => prev.filter((i) => i.item.id !== item.item.id));
    onUpdateQty(item.item.id, item.quantity);
  };

  const handleProceed = () => {
    onClose();
    setActiveScreen('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Harvest Basket</h3>
                <p className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} · Direct from smallholders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cart.length > 0 && onOpenShareCart && (
                <button
                  type="button"
                  onClick={onOpenShareCart}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 border border-emerald-200 cursor-pointer shadow-2xs"
                  title="Share 8-Character Snapshot Link"
                >
                  <span className="material-symbols-outlined text-[15px]">share</span>
                  <span className="hidden sm:inline">Share</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Free Shipping Dynamic Progress Tracker */}
          {rawSubtotal > 0 && (
            <div className="p-3.5 bg-emerald-50/60 border-b border-emerald-100 text-xs">
              <div className="flex items-center justify-between font-semibold mb-1.5">
                <span className="text-emerald-950 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">local_shipping</span>
                  {amountRemaining === 0 ? (
                    <strong className="text-emerald-800">You unlocked Free Solar Reefer Delivery!</strong>
                  ) : (
                    <span>Add <strong>₹{amountRemaining}</strong> more for Free Delivery</span>
                  )}
                </span>
                <span className="text-emerald-700 font-mono font-bold text-[11px]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Your basket is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Explore today's morning harvest and connect directly with certified regional growers.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setActiveScreen('marketplace');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Browse Fresh Lots
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>Farm produce ({cart.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer"
                  >
                    Clear basket
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3 transition-colors hover:border-emerald-200"
                    >
                      <img
                        src={cartItem.item.imageUrl}
                        alt={cartItem.item.name}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {cartItem.item.name}
                          </h4>
                          <button
                            onClick={() => handleSaveForLater(cartItem)}
                            className="text-[10px] text-slate-400 hover:text-emerald-700 font-semibold cursor-pointer"
                            title="Park item for later"
                          >
                            Save later
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {cartItem.item.farmer} · {cartItem.item.origin}
                        </p>

                        <div className="flex items-center justify-between mt-1.5">
                          <span className="font-extrabold text-xs text-slate-900">
                            ₹{cartItem.item.price * cartItem.quantity}
                            <span className="text-[10px] text-slate-400 font-normal">
                              {' '}
                              (₹{cartItem.item.price}/{cartItem.item.unit})
                            </span>
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={() => onUpdateQty(cartItem.item.id, cartItem.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold cursor-pointer"
                              title="Decrease"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-900">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(cartItem.item.id, cartItem.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold cursor-pointer"
                              title="Increase"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-900">
                        <span className="material-symbols-outlined text-[16px] text-emerald-700">confirmation_number</span>
                        <span>Code <strong>{appliedCoupon}</strong> applied (-₹{discountEval.discountAmount})</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError(null);
                          }}
                          placeholder="Promo code (e.g. FARM10, FRESH20)"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-rose-600 font-semibold px-1">{couponError}</p>
                      )}
                      {onOpenDiscountCenter && (
                        <div className="pt-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={onOpenDiscountCenter}
                            className="text-[11px] text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px] text-emerald-700">confirmation_number</span>
                            <span>Browse Discount Center &amp; Offers</span>
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>

                {/* Direct-to-Grower Escrow Guarantee Box */}
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">handshake</span>
                      Direct Escrow Model
                    </span>
                    <span className="text-emerald-800 font-mono">94.1% Grower Split</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex mb-2">
                    <div className="bg-emerald-600 h-full w-[94.1%]" title="94.1% to Farmer"></div>
                    <div className="bg-amber-500 h-full w-[5.9%]" title="Cold-chain & tech"></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>
                      Grower direct: <strong className="text-emerald-800 font-bold">₹{growerShare}</strong>
                    </span>
                    <span>
                      Platform fee (1%): <strong className="text-slate-800 font-bold">₹{platformFee}</strong>
                    </span>
                  </div>
                </div>

                {/* Saved for later section */}
                {savedForLater.length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Saved for Later ({savedForLater.length})
                    </span>
                    <div className="space-y-2">
                      {savedForLater.map((s) => (
                        <div
                          key={s.item.id}
                          className="p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-semibold text-slate-800 truncate">{s.item.name}</span>
                          <button
                            onClick={() => handleMoveBackToCart(s)}
                            className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] cursor-pointer whitespace-nowrap"
                          >
                            Move to basket
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 pb-1">
                <div className="flex justify-between">
                  <span>Harvest Subtotal</span>
                  <span className="font-mono font-semibold">₹{rawSubtotal}</span>
                </div>
                {discountEval.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountEval.appliedCode})</span>
                    <span className="font-mono">-₹{discountEval.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Reefer Logistics</span>
                  <span className="font-mono font-semibold">
                    {discountEval.freeShippingEligible ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${discountEval.shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-900 text-sm">Total Payable</span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    ₹{discountEval.finalTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <span>Proceed to Escrow Checkout</span>
                <span className="material-symbols-outlined text-[17px]">lock</span>
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Payment held securely in smart escrow until quality acceptance at doorstep.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
