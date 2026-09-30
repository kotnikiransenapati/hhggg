import React, { useState } from 'react';
import { ActiveScreen, CartItem } from '../types';
import {
  initiateRazorpayStandardCheckout,
  createRazorpayOrder,
  generateTestSignature,
  verifyRazorpayPayment,
} from '../services/razorpayService';
import { RazorpayTasteModal } from './RazorpayTasteModal';

interface CheckoutScreenProps {
  cart: CartItem[];
  currentAddress: string;
  openAddressModal: () => void;
  onPlaceOrder: (
    total: number,
    paymentMeta?: { paymentId?: string; orderId?: string; method?: string }
  ) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  currentAddress,
  openAddressModal,
  onPlaceOrder,
  setActiveScreen,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<'express' | 'evening'>('express');
  const [packagingChoice, setPackagingChoice] = useState<'bamboo' | 'glass'>('bamboo');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'wallet' | 'card' | 'netbanking'>('razorpay');

  // Payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Razorpay Gateway Taste & Test states
  const [isTasteModalOpen, setIsTasteModalOpen] = useState<boolean>(false);
  const [tasteOrderId, setTasteOrderId] = useState<string>('');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Dynamic calculations from cart if available, otherwise baseline demo values
  const calculatedSubtotal =
    cart.length > 0
      ? cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0)
      : 845.0;

  const farmGateTotal = calculatedSubtotal;
  const logisticsFee = 45.0;
  const platformFee = Number((farmGateTotal * 0.01).toFixed(2));
  const middlemanSaved = Number((farmGateTotal * 0.22).toFixed(2));
  const totalPayable = farmGateTotal + logisticsFee + platformFee;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNotice(label);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  /**
   * Opens the Interactive Razorpay Taste Sandbox Modal
   */
  const handleOpenTasteModal = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentNotice(null);

    try {
      const order = await createRazorpayOrder(Math.round(totalPayable * 100), 'INR');
      setTasteOrderId(order.order_id);
      setIsTasteModalOpen(true);
      setIsProcessingPayment(false);
    } catch (err: any) {
      console.warn('Fallback to generated test order for tasting:', err.message);
      const fallbackId = `order_test_${Date.now().toString(36)}`;
      setTasteOrderId(fallbackId);
      setIsTasteModalOpen(true);
      setIsProcessingPayment(false);
    }
  };

  /**
   * Instant 1-Click Fast Escrow Pay (Full end-to-end cryptographic test)
   */
  const handleFastTestPay = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentNotice(null);

    try {
      const order = await createRazorpayOrder(Math.round(totalPayable * 100), 'INR');
      const testPaymentId = `pay_fast_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const signature = await generateTestSignature(order.order_id, testPaymentId);

      const verification = await verifyRazorpayPayment({
        razorpay_order_id: order.order_id,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: signature,
      });

      if (verification.success) {
        setPaymentNotice(`Fast Test Payment of ₹${totalPayable.toFixed(2)} verified via HMAC-SHA256! (ID: ${testPaymentId})`);
        setIsProcessingPayment(false);
        onPlaceOrder(totalPayable, {
          paymentId: testPaymentId,
          orderId: order.order_id,
          method: 'Razorpay Fast Test Checkout',
        });
      } else {
        throw new Error(verification.message || 'Signature verification declined');
      }
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentError(err.message || 'Fast test payment failed');
    }
  };

  /**
   * Razorpay Standard Web Checkout Handler
   * Follows 3-step specification:
   * 1. Backend /api/create-order creates order with Razorpay API
   * 2. Opens official Razorpay Standard Modal
   * 3. Backend /api/verify-payment validates HMAC-SHA256 signature
   */
  const handleRazorpayPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentNotice(null);

    try {
      await initiateRazorpayStandardCheckout({
        amountInRupees: totalPayable,
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@farmdirect.internal',
        customerPhone: '+919820144892',
        notes: {
          address: currentAddress,
          slot: selectedSlot === 'express' ? 'Today Express (11:30 AM)' : 'Today Sunset (05:00 PM)',
          packaging: packagingChoice,
        },
        onSuccess: (paymentResult) => {
          console.log('Razorpay payment verified successfully:', paymentResult);
          setPaymentNotice(`Payment of ₹${totalPayable.toFixed(2)} verified via Razorpay! ID: ${paymentResult.paymentId}`);
          setIsProcessingPayment(false);

          // Place order with verified escrow lock
          onPlaceOrder(totalPayable, {
            paymentId: paymentResult.paymentId,
            orderId: paymentResult.orderId,
            method: 'Razorpay Standard Checkout',
          });
        },
        onFailure: (errorMessage) => {
          console.error('Razorpay payment error:', errorMessage);
          setPaymentError(errorMessage || 'Payment was declined or failed.');
          setIsProcessingPayment(false);
        },
        onDismiss: () => {
          setIsProcessingPayment(false);
          setPaymentNotice('Payment modal closed. Your items remain preserved in escrow cart.');
          setTimeout(() => setPaymentNotice(null), 5000);
        },
      });
    } catch (error: any) {
      console.error('Failed to initiate Razorpay checkout:', error);
      setPaymentError(error.message || 'Unable to connect to Razorpay payment gateway.');
      setIsProcessingPayment(false);
    }
  };

  const handleCheckoutSubmit = () => {
    if (paymentMethod === 'wallet') {
      // Wallet direct simulation
      onPlaceOrder(totalPayable, { method: 'FarmDirect Escrow Wallet' });
    } else {
      // All other methods route through Razorpay Standard Checkout
      handleRazorpayPayment();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full pb-24">
      {/* 3 Steps Indicator */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8 max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
            ✓
          </span>
          <span className="text-xs font-semibold text-slate-900">Cart Verified</span>
        </div>
        <div className="flex-1 h-0.5 bg-emerald-700 mx-4"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <span className="text-xs font-semibold text-slate-900">Escrow Lock &amp; Delivery</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-200 mx-4"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">
            3
          </span>
          <span className="text-xs font-medium text-slate-400">Inspection Payout</span>
        </div>
      </div>

      {/* Payment Error / Notice Banners */}
      {paymentError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-red-600 text-[20px]">error</span>
            <span className="font-semibold">{paymentError}</span>
          </div>
          <button
            onClick={() => setPaymentError(null)}
            className="text-red-500 hover:text-red-800 cursor-pointer font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {paymentNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">info</span>
            <span className="font-semibold">{paymentNotice}</span>
          </div>
          <button
            onClick={() => setPaymentNotice(null)}
            className="text-emerald-500 hover:text-emerald-800 cursor-pointer font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Items (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Address & Time Slot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">home_pin</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Priya Sharma</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Flat 402, Sea Green Apartments, Perry Cross Road, {currentAddress}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block">+91 98201 44892</span>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddressModal}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Change Address
              </button>
            </div>

            {/* Slot Option */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">electric_bolt</span>
                <div>
                  <span className="font-semibold text-slate-900 block">
                    {selectedSlot === 'express'
                      ? 'Today 11:30 AM – 1:00 PM (Express Harvest Slot)'
                      : 'Today 05:00 PM – 07:30 PM (Evening Sunset Slot)'}
                  </span>
                  <span className="text-slate-500">Nashik refrigerated van en route to Bandra hub</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(selectedSlot === 'express' ? 'evening' : 'express')}
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Change Slot
              </button>
            </div>
          </div>

          {/* Harvest Allocation by Farm Origin */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Harvest Allocation by Farm Origin</h3>
              <span className="text-xs text-slate-400">
                {cart.length > 0 ? `${cart.length} Basket Items` : '3 Smallholder Collectives'}
              </span>
            </div>

            {cart.length > 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Your Fresh Farm Harvest Basket</span>
                  <span className="text-emerald-700 font-semibold">Reefer Transit · Sub-4°C</span>
                </div>

                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  {cart.map((cartItem) => (
                    <div key={cartItem.item.id} className="flex items-center justify-between pt-2 first:pt-0">
                      <div>
                        <span className="font-medium text-slate-900 block">
                          {cartItem.quantity}x {cartItem.item.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {cartItem.item.farmer} ({cartItem.item.origin})
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Farm 1: Ramesh Patel */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Ramesh Patel Farm (Nashik Valley)</span>
                    <span className="text-emerald-700 font-semibold">Reefer Van #4 · 11:30 AM</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">3x Vine-Ripened Country Tomatoes (3 kg crate)</span>
                      <span className="font-bold text-slate-900">₹135.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">2x Hydroponic Baby Spinach (500g)</span>
                      <span className="font-bold text-slate-900">₹80.00</span>
                    </div>
                  </div>
                </div>

                {/* Farm 2: Green Valley Orchards */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Green Valley Orchards (Shimla, HP)</span>
                    <span className="text-sky-700 font-semibold">Climate-Controlled Hub</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">2x Organic Shimla Royal Delicious Apples (Grade A+)</span>
                    <span className="font-bold text-slate-900">₹440.00</span>
                  </div>
                </div>

                {/* Farm 3: Nandini Pastoral Dairy */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Nandini Organic Pastoral Dairy (Pune)</span>
                    <span className="text-emerald-700 font-semibold">4.8% Fat A2 Certified</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">2x Raw Pure A2 Gir Cow Milk (2 Liters glass bottles)</span>
                    <span className="font-bold text-slate-900">₹190.00</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Eco-Packaging Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Packaging Preference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPackagingChoice('bamboo')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  packagingChoice === 'bamboo'
                    ? 'border-emerald-700 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="packaging"
                    checked={packagingChoice === 'bamboo'}
                    onChange={() => setPackagingChoice('bamboo')}
                    className="mt-0.5 accent-emerald-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 text-xs block">
                      Biodegradable Bamboo Fiber Crates
                    </span>
                    <span className="text-[11px] text-slate-500">100% home-compostable banana bark</span>
                    <span className="text-xs text-emerald-700 font-bold block mt-1">₹0.00 (Included)</span>
                  </div>
                </div>
              </label>

              <label
                onClick={() => setPackagingChoice('glass')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  packagingChoice === 'glass'
                    ? 'border-emerald-700 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="packaging"
                    checked={packagingChoice === 'glass'}
                    onChange={() => setPackagingChoice('glass')}
                    className="mt-0.5 accent-emerald-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 text-xs block">
                      Sterilized Returnable Glass Bottles
                    </span>
                    <span className="text-[11px] text-slate-500">Hand back empty bottles for ₹30 credit</span>
                    <span className="text-xs text-sky-700 font-bold block mt-1">Exchange Active</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Method Selector with Razorpay Standard Checkout Featured */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Escrow Payment Gateway</h3>
                <p className="text-[11px] text-slate-500">Powered by Razorpay Standard Web Checkout</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                Test Mode Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'razorpay',
                  title: 'Razorpay Standard Checkout',
                  desc: 'UPI, Credit/Debit Cards, NetBanking, Wallets',
                  icon: 'credit_card',
                  badge: 'Standard Modal',
                },
                {
                  id: 'upi',
                  title: 'Direct UPI (Via Razorpay)',
                  desc: 'Google Pay, PhonePe, Paytm, BHIM',
                  icon: 'qr_code_2',
                },
                {
                  id: 'card',
                  title: 'Cards (Via Razorpay)',
                  desc: 'Visa, Mastercard, RuPay, Amex',
                  icon: 'payments',
                },
                {
                  id: 'wallet',
                  title: 'FarmDirect Wallet',
                  desc: 'Available Escrow Balance: ₹1,420.00',
                  icon: 'account_balance_wallet',
                },
              ].map((p) => (
                <label
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === p.id
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payment_method"
                      value={p.id}
                      checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id as any)}
                      className="accent-emerald-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 text-xs block">{p.title}</span>
                        {p.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{p.desc}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">{p.icon}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Razorpay Gateway Taste & Test Station (For testing without personal keys) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl text-white shadow-lg space-y-4 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Razorpay Gateway Test Lab</h3>
                  <p className="text-[11px] text-slate-400">Taste every payment method without personal keys</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                rzp_test Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Don't have your own Razorpay credentials? No problem! The test environment is pre-configured with active test keys (<code className="text-emerald-400 font-mono text-[11px]">rzp_test_TiGoihNG0yHCUc</code>). You can taste the entire checkout flow, test test UPI, test Cards, test Bank OTP, or launch the interactive simulator modal:
            </p>

            {/* Quick Test Credentials Pills with 1-click Copy */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Preloaded Test Credentials (Click to Copy):
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleCopy('success@razorpay', 'UPI ID')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="text-emerald-400 font-bold">UPI:</span>
                  <span className="font-mono">success@razorpay</span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">content_copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('4111 1111 1111 1111', 'Card')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="text-blue-400 font-bold">Card:</span>
                  <span className="font-mono">4111 1111 1111 1111</span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">content_copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('123456', 'OTP')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="text-amber-400 font-bold">OTP:</span>
                  <span className="font-mono">123456</span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">content_copy</span>
                </button>
              </div>
              {copiedNotice && (
                <div className="text-[11px] text-emerald-400 font-medium animate-fadeIn">
                  ✓ Copied {copiedNotice} to clipboard!
                </div>
              )}
            </div>

            {/* Test Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleOpenTasteModal}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">science</span>
                <span>Taste Gateway Sandbox Modal</span>
              </button>
              <button
                type="button"
                onClick={handleFastTestPay}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400">bolt</span>
                <span>1-Click Fast Escrow Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Rupee Transparency & Action Button (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base">Rupee Transparency</h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                94.1% Direct to Grower
              </span>
            </div>

            {/* Split Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex mb-2">
              <div className="bg-emerald-600 h-full w-[94.1%]" title="Farmer 94%"></div>
              <div className="bg-sky-500 h-full w-[5%]" title="Cold Chain 5%"></div>
              <div className="bg-amber-500 h-full w-[0.9%]" title="Tech 1%"></div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="text-emerald-700 font-semibold">Farmer: 94%</span>
              <span className="text-sky-600 font-semibold">Cold-Chain: 5%</span>
              <span className="text-amber-600 font-semibold">Platform: 1%</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Total Farm Gate Price (100% to Growers)</span>
              <span className="font-bold text-slate-900">₹{farmGateTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Refrigerated Sprinter Van Logistics</span>
              <span className="font-medium text-slate-900">₹{logisticsFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Producer Direct Fee (1%)</span>
              <span className="font-medium text-slate-900">₹{platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold">
              <span>Middleman Markup Eliminated</span>
              <span>-₹{middlemanSaved.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-slate-900">
              <div>
                <span className="text-xs text-slate-400 block uppercase font-bold">Total Payable</span>
                <span className="text-2xl font-bold">₹{totalPayable.toFixed(2)}</span>
              </div>
              <span className="text-xs text-slate-400">Inclusive of GST</span>
            </div>
          </div>

          {/* Escrow Guarantee Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-[20px] shrink-0">verified_user</span>
            <p className="leading-relaxed">
              Your funds remain protected in escrow. Payment is released to farmers only after you inspect produce crispness at your door.
            </p>
          </div>

          {/* Razorpay Standard Checkout Buttons */}
          <div className="space-y-2.5">
            <button
              disabled={isProcessingPayment}
              onClick={handleCheckoutSubmit}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isProcessingPayment ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Opening Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{totalPayable.toFixed(2)} with Razorpay Standard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>

            {/* Direct Taste / Sandbox Trigger */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleOpenTasteModal}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-700">science</span>
                <span>Taste Simulator</span>
              </button>
              <button
                type="button"
                onClick={handleFastTestPay}
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-amber-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
                <span>Fast Test Pay</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
              <span>Secured by 256-bit Razorpay Gateway Encryption</span>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            One-tap dispatch confirmation. You may reject any batch upon delivery with 0 fee.
          </p>
        </div>
      </div>

      {/* Interactive Razorpay Taste / Sandbox Modal */}
      <RazorpayTasteModal
        isOpen={isTasteModalOpen}
        orderId={tasteOrderId}
        amount={totalPayable}
        currency="INR"
        customerName="Priya Sharma"
        customerEmail="priya.sharma@farmdirect.internal"
        customerPhone="+91 98201 44892"
        onClose={() => setIsTasteModalOpen(false)}
        onSuccess={(result) => {
          setPaymentNotice(`Razorpay payment of ₹${totalPayable.toFixed(2)} verified successfully! (ID: ${result.paymentId})`);
          onPlaceOrder(totalPayable, {
            paymentId: result.paymentId,
            orderId: result.orderId,
            method: 'Razorpay Standard Checkout (Verified)',
          });
        }}
        onFailure={(errorMessage) => {
          setPaymentError(errorMessage);
        }}
      />
    </div>
  );
};
