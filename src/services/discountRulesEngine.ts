export interface DiscountEvaluation {
  appliedCode: string | null;
  discountAmount: number;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  shippingFee: number;
  codFee: number;
  isCodAllowed: boolean;
  finalTotal: number;
  breakdownNotice: string;
}

export const FREE_SHIPPING_THRESHOLD = 1000;
export const MAX_COD_CAP = 50000;
export const STANDARD_LOGISTICS_FEE = 45;

export const KNOWN_COUPONS: Record<
  string,
  { type: 'percentage' | 'flat'; value: number; minSpend: number; label: string }
> = {
  FARM10: { type: 'percentage', value: 10, minSpend: 500, label: '10% Direct Grower Incentive' },
  FRESH20: { type: 'percentage', value: 20, minSpend: 1200, label: '20% Harvest Collective Celebration' },
  HARVEST50: { type: 'flat', value: 50, minSpend: 400, label: '₹50 Harvest Bounty Credit' },
  WELCOME100: { type: 'flat', value: 100, minSpend: 600, label: '₹100 First Order Welcome Gift' },
};

export function evaluateCheckoutRules(
  subtotal: number,
  couponCodeInput?: string,
  paymentMethod?: string
): DiscountEvaluation {
  const code = couponCodeInput?.trim().toUpperCase() || null;
  let discountAmount = 0;
  let breakdownNotice = '';

  if (code) {
    // Check known standard coupons
    if (KNOWN_COUPONS[code]) {
      const rule = KNOWN_COUPONS[code];
      if (subtotal >= rule.minSpend) {
        if (rule.type === 'percentage') {
          discountAmount = Math.round((subtotal * rule.value) / 100);
        } else {
          discountAmount = rule.value;
        }
        breakdownNotice = `${rule.label} applied: Saved ₹${discountAmount.toFixed(2)}`;
      } else {
        breakdownNotice = `Code ${code} requires minimum order of ₹${rule.minSpend}`;
      }
    } else if (code.startsWith('SPIN-') || code.startsWith('REF-')) {
      // Dynamic Spin-to-Win or Referral code
      discountAmount = Math.min(150, Math.round(subtotal * 0.15));
      breakdownNotice = `Special reward code ${code} applied: -₹${discountAmount}`;
    } else {
      breakdownNotice = `Coupon code ${code} is invalid or expired`;
    }
  }

  // Free shipping check
  const freeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = freeShippingEligible ? 0 : STANDARD_LOGISTICS_FEE;

  // COD Handling rule
  const isCodAllowed = subtotal <= MAX_COD_CAP;
  let codFee = 0;
  if (paymentMethod === 'cod') {
    // 2% handling fee with minimum ₹30
    codFee = Math.max(30, Math.round(subtotal * 0.02));
  }

  const platformFee = Number((subtotal * 0.01).toFixed(2));
  const finalTotal = Math.max(
    0,
    subtotal - discountAmount + shippingFee + codFee + platformFee
  );

  return {
    appliedCode: discountAmount > 0 ? code : null,
    discountAmount,
    freeShippingEligible,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping,
    shippingFee,
    codFee,
    isCodAllowed,
    finalTotal: Number(finalTotal.toFixed(2)),
    breakdownNotice,
  };
}
