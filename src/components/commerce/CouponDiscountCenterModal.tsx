import React, { useState, useEffect } from 'react';
import { firestoreService } from '../../services/firestoreService';
import { KNOWN_COUPONS } from '../../services/discountRulesEngine';
import { couponAttributionService } from '../../services/couponAttributionService';

interface CouponDiscountCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartSubtotal: number;
  onApplyCoupon: (code: string) => void;
  activeAppliedCode?: string | null;
}

interface CouponCardItem {
  code: string;
  label: string;
  type: 'percentage' | 'flat';
  value: number;
  minSpend: number;
  description: string;
  badge: string;
  expiresInDays: number;
}

const DEFAULT_COUPONS: CouponCardItem[] = [
  {
    code: 'FARM10',
    label: '10% Direct Grower Incentive',
    type: 'percentage',
    value: 10,
    minSpend: 500,
    description: 'Save 10% on fresh organic produce harvested within 14 hours. Disburses 100% grower value.',
    badge: 'Trending',
    expiresInDays: 30,
  },
  {
    code: 'FRESH20',
    label: '20% Harvest Collective Celebration',
    type: 'percentage',
    value: 20,
    minSpend: 1200,
    description: 'Enjoy 20% off large family baskets across all 4 regional smallholder clusters.',
    badge: 'Popular',
    expiresInDays: 14,
  },
  {
    code: 'WELCOME100',
    label: '₹100 First Order Welcome Gift',
    type: 'flat',
    value: 100,
    minSpend: 600,
    description: 'Flat ₹100 instant discount on your first dawn-harvest delivery.',
    badge: 'New Patron',
    expiresInDays: 7,
  },
  {
    code: 'HARVEST50',
    label: '₹50 Seasonal Bounty Credit',
    type: 'flat',
    value: 50,
    minSpend: 400,
    description: 'Flat ₹50 credit on single-origin farm lots and pure A2 Gir cow milk bottles.',
    badge: 'Organic',
    expiresInDays: 15,
  },
];

export const CouponDiscountCenterModal: React.FC<CouponDiscountCenterModalProps> = ({
  isOpen,
  onClose,
  cartSubtotal,
  onApplyCoupon,
  activeAppliedCode,
}) => {
  const [filter, setFilter] = useState<'all' | 'percentage' | 'flat'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [customCoupons, setCustomCoupons] = useState<CouponCardItem[]>(DEFAULT_COUPONS);
  const [referralLink, setReferralLink] = useState<string>('');
  const [copiedReferral, setCopiedReferral] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      firestoreService.getUniqueCoupons().then((list) => {
        if (list && list.length > 0) {
          const mapped: CouponCardItem[] = list.map((c) => ({
            code: c.code,
            label: c.description || `${c.code} Promo`,
            type: c.type || 'percentage',
            value: c.value || 10,
            minSpend: c.minSpend || 500,
            description: c.description || 'Exclusive community harvest coupon',
            badge: 'Exclusive',
            expiresInDays: c.expiryDays || 30,
          }));
          // Merge unique codes
          const merged = [...DEFAULT_COUPONS];
          mapped.forEach((m) => {
            if (!merged.some((x) => x.code === m.code)) merged.push(m);
          });
          setCustomCoupons(merged);
        }
      });

      if (typeof window !== 'undefined') {
        const link = couponAttributionService.generateReferralLink('patron');
        setReferralLink(link);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCoupons = customCoupons.filter((c) => {
    if (filter === 'all') return true;
    return c.type === filter;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code: string) => {
    onApplyCoupon(code);
    onClose();
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[24px] text-amber-300">confirmation_number</span>
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Coupon &amp; Discount Center</h3>
              <p className="text-xs text-emerald-100">
                Direct grower incentives &amp; harvest bounty savings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Navigation & Cart Context */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
            {[
              { id: 'all', label: 'All Deals' },
              { id: 'percentage', label: 'Percentage (%)' },
              { id: 'flat', label: 'Flat Cash (₹)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>Current basket:</span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">
              ₹{cartSubtotal}
            </span>
          </div>
        </div>

        {/* Coupons List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCoupons.map((coupon) => {
              const qualifies = cartSubtotal >= coupon.minSpend;
              const amountNeeded = Math.max(0, coupon.minSpend - cartSubtotal);
              const isApplied = activeAppliedCode === coupon.code;

              return (
                <div
                  key={coupon.code}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isApplied
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-white tracking-wider">
                        {coupon.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {coupon.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{coupon.label}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {coupon.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Min. order: <strong className="text-slate-800 font-bold">₹{coupon.minSpend}</strong>
                      </span>
                      <span className="text-slate-400">
                        Valid for {coupon.expiresInDays} days
                      </span>
                    </div>

                    {/* Spend qualification indicator */}
                    {!qualifies && (
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-amber-700">info</span>
                        <span>Add ₹{amountNeeded} more to unlock this promo</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                      <span>{copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!qualifies || isApplied}
                      onClick={() => handleApply(coupon.code)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : qualifies
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isApplied ? 'check' : 'shopping_bag'}
                      </span>
                      <span>{isApplied ? 'Applied' : 'Apply to Basket'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Referral Incentive Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                Referral Program
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Give ₹100, Earn 50 Points</h4>
              <p className="text-xs text-slate-600 max-w-md">
                Share your personalized invite link. Friends get ₹100 off their first harvest basket, and you receive 50 reward points instantly upon delivery!
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyReferral}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>{copiedReferral ? 'Link Copied!' : 'Copy Referral Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
