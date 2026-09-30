import React, { useState } from 'react';
import { verifyRazorpayPayment } from '../services/razorpayService';

interface RazorpayTasteModalProps {
  isOpen: boolean;
  orderId: string;
  amount: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onClose: () => void;
  onSuccess: (result: { paymentId: string; orderId: string; signature: string }) => void;
  onFailure: (errorMessage: string) => void;
}

export const RazorpayTasteModal: React.FC<RazorpayTasteModalProps> = ({
  isOpen,
  orderId,
  amount,
  currency = 'INR',
  customerName = 'Priya Sharma',
  customerEmail = 'priya.sharma@farmdirect.internal',
  customerPhone = '+91 98201 44892',
  onClose,
  onSuccess,
  onFailure,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState<string>('success@razorpay');
  const [cardNumber, setCardNumber] = useState<string>('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('123');
  const [cardHolder, setCardHolder] = useState<string>(customerName);
  const [selectedBank, setSelectedBank] = useState<string>('HDFC');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showOtpScreen, setShowOtpScreen] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('123456');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  /**
   * Completes payment via real HMAC-SHA256 signature verification
   */
  const processSuccessfulPayment = async (customPaymentId?: string) => {
    setIsVerifying(true);
    const paymentId = customPaymentId || `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      // 1. Get valid cryptographic signature from backend using server's secret
      const sigRes = await fetch('/api/generate-test-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, payment_id: paymentId }),
      });
      const sigData = await sigRes.json();

      if (!sigRes.ok || !sigData.signature) {
        throw new Error('Failed to generate cryptographic payment signature');
      }

      // 2. Call backend /api/verify-payment to execute authentic HMAC-SHA256 verification
      const verifyRes = await verifyRazorpayPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: sigData.signature,
      });

      if (verifyRes.success) {
        setIsVerifying(false);
        onSuccess({
          orderId,
          paymentId,
          signature: sigData.signature,
        });
        onClose();
      } else {
        throw new Error(verifyRes.message || 'Signature verification declined');
      }
    } catch (err: any) {
      setIsVerifying(false);
      onFailure(err.message || 'Payment verification failed');
      onClose();
    }
  };

  /**
   * Simulates tampered signature to test backend security validation
   */
  const processTamperedPayment = async () => {
    setIsVerifying(true);
    const paymentId = `pay_tampered_${Date.now().toString(36)}`;
    const fraudulentSignature = '0000000000000000000000000badbadbadbadbadbadbadbadbadbadbadbad';

    try {
      await verifyRazorpayPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: fraudulentSignature,
      });
      setIsVerifying(false);
      onFailure('Error: Backend should have rejected fraudulent signature but did not!');
      onClose();
    } catch (err: any) {
      setIsVerifying(false);
      onFailure(`Security Test Passed: Backend rejected invalid signature as expected (${err.message})`);
      onClose();
    }
  };

  /**
   * Simulates bank failure/decline
   */
  const processFailedPayment = (reason?: string) => {
    onFailure(reason || 'Payment failed: Card was declined by issuing bank (Test Simulation)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Razorpay Branding & FarmDirect Escrow */}
        <div className="bg-[#0b1e36] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold text-base">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide">Razorpay Standard</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">FarmDirect 100% Traceable Escrow</p>
              </div>
            </div>

            <button
              onClick={() => {
                onFailure('Payment cancelled: User dismissed Razorpay modal (ondismiss)');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Order ID</span>
              <span className="text-xs font-mono font-medium text-slate-200">{orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount Payable</span>
              <span className="text-lg font-bold text-emerald-400">
                ₹{amount.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Test Mode Guidance Info Pill */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700 text-[18px]">science</span>
            <span>
              <strong>Taste &amp; Test Sandbox:</strong> No merchant key needed. Live HMAC verification.
            </span>
          </div>
          {copiedField && (
            <span className="text-[11px] font-bold text-emerald-700 animate-fadeIn">
              Copied {copiedField}!
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {showOtpScreen ? (
            /* Bank 3D-Secure / OTP Simulation Screen */
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-[28px]">lock</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Simulated Bank 3D Secure Verification</h4>
                <p className="text-xs text-slate-500">
                  Enter test OTP sent to registered number {customerPhone}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">Test One-Time Password (OTP)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="font-mono text-center tracking-widest text-lg font-bold w-40 px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-emerald-600 mx-auto block"
                />
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpValue('123456')}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    Reset to 123456
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpScreen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => {
                    if (otpValue === '123456' || otpValue.length === 6) {
                      processSuccessfulPayment();
                    } else {
                      processFailedPayment('Invalid OTP entered (Test Bank Error)');
                    }
                  }}
                  className="flex-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Authenticating...' : 'Authorize Payment'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Selector Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: 'qr_code_2' },
                  { id: 'card', label: 'Cards', icon: 'credit_card' },
                  { id: 'netbanking', label: 'NetBanking', icon: 'account_balance' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* TAB 1: UPI */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated QR Code */}
                    <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-200 shadow-xs shrink-0 flex flex-col items-center justify-center">
                      <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center text-white text-center p-1">
                        <span className="text-[10px] font-mono leading-tight">
                          SCAN TO TEST<br />₹{amount.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Instant QR Simulation
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">Scan or Enter Any Test UPI VPA</h4>
                      <p className="text-[11px] text-slate-500">
                        Default test address auto-approves via Razorpay test rail.
                      </p>
                    </div>
                  </div>

                  {/* UPI VPA Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex justify-between">
                      <span>UPI Virtual Payment Address</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('success@razorpay', 'UPI ID')}
                        className="text-emerald-700 hover:underline cursor-pointer text-[11px]"
                      >
                        Copy success@razorpay
                      </button>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank or success@razorpay"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId('success@razorpay')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  </div>

                  {/* Quick UPI App Badges */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { name: 'GPay', color: 'text-blue-600' },
                      { name: 'PhonePe', color: 'text-purple-600' },
                      { name: 'Paytm', color: 'text-sky-600' },
                      { name: 'BHIM', color: 'text-emerald-600' },
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => {
                          setUpiId(`${app.name.toLowerCase()}@upi`);
                          processSuccessfulPayment();
                        }}
                        className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-center cursor-pointer transition-colors"
                      >
                        <span className={`text-xs font-bold ${app.color} block`}>{app.name}</span>
                        <span className="text-[9px] text-slate-400">1-Tap Pay</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Cards */}
              {activeTab === 'card' && (
                <div className="space-y-3.5">
                  {/* Test Helper Pills */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4111 1111 1111 1111');
                        copyToClipboard('4111 1111 1111 1111', 'Card');
                      }}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer font-medium"
                    >
                      Fill Success Visa: 4111 1111...
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4000 0000 0000 0002');
                        copyToClipboard('4000 0000 0000 0002', 'Decline Card');
                      }}
                      className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer font-medium"
                    >
                      Fill Decline Card: 4000 0000...
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NetBanking */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Select any major bank to simulate instant netbanking debit:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC' },
                      { id: 'SBI', name: 'State Bank of India', code: 'SBIN' },
                      { id: 'ICICI', name: 'ICICI Bank', code: 'ICIC' },
                      { id: 'AXIS', name: 'Axis Bank', code: 'UTIB' },
                      { id: 'KOTAK', name: 'Kotak Bank', code: 'KKBK' },
                      { id: 'OTHER', name: 'Other Test Banks', code: 'TEST' },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold cursor-pointer transition-all ${
                          selectedBank === bank.id
                            ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>{bank.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{bank.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => {
                  if (activeTab === 'card') {
                    if (cardNumber.includes('4000')) {
                      processFailedPayment('Card declined: Insufficient funds (Test Mode)');
                    } else {
                      setShowOtpScreen(true);
                    }
                  } else {
                    if (upiId === 'failure@razorpay') {
                      processFailedPayment('UPI transaction rejected by user (failure@razorpay)');
                    } else {
                      processSuccessfulPayment();
                    }
                  }
                }}
                className="w-full py-3.5 bg-[#006c49] hover:bg-[#00583b] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying HMAC-SHA256 Signature...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount.toFixed(2)} via Test Razorpay</span>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Testing & Edge-Case Taste Playground */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Edge-Case Simulator
              </span>
              <span className="text-[10px] text-slate-400">Test every gateway state</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => processSuccessfulPayment()}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold cursor-pointer transition-colors text-center"
                title="Direct 1-tap success with real HMAC verification"
              >
                ✓ Force Success
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={processTamperedPayment}
                className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold cursor-pointer transition-colors text-center"
                title="Tests if server catches bad signatures"
              >
                🛡️ Bad Signature
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => processFailedPayment('Declined by issuer')}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold cursor-pointer transition-colors text-center"
                title="Triggers payment.failed event"
              >
                ✕ Force Decline
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-700 text-[16px]">lock</span>
            <span>Razorpay 256-Bit SSL Encrypted Escrow</span>
          </div>
          <span className="font-mono text-[10px]">v1/checkout.js</span>
        </div>
      </div>
    </div>
  );
};
