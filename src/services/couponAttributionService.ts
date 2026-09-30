import { SpinReward } from '../types';

export interface AttributionSession {
  slug: string;
  referrerName: string;
  campaignSource: string;
  medium: string;
  timestamp: string;
  appliedPromoCode?: string;
}

const ATTRIBUTION_SESSION_KEY = 'farmdirect_utm_attribution';

export const SPIN_WHEEL_REWARDS: SpinReward[] = [
  {
    label: '₹150 Escrow Bounty',
    couponCode: 'SPIN-BOUNTY150',
    discountDescription: 'Flat ₹150 off on fresh harvest baskets above ₹600',
    color: '#006c49',
  },
  {
    label: 'Free Cold-Chain Delivery',
    couponCode: 'SPIN-FREESHIP',
    discountDescription: '100% Free Solar Reefer Delivery on your order',
    color: '#0284c7',
  },
  {
    label: '20% Grower Special',
    couponCode: 'SPIN-GROWER20',
    discountDescription: '20% off all smallholder harvested crates',
    color: '#ca8a04',
  },
  {
    label: '₹75 Pure Organic Credit',
    couponCode: 'SPIN-PURE75',
    discountDescription: 'Flat ₹75 credit applied directly at checkout',
    color: '#16a34a',
  },
  {
    label: 'Free Gir Cow Milk Bottle',
    couponCode: 'SPIN-A2MILK',
    discountDescription: '1 Complimentary 1L Pure A2 Glass Bottle',
    color: '#9333ea',
  },
  {
    label: '₹100 Farmer Direct',
    couponCode: 'SPIN-DIRECT100',
    discountDescription: 'Flat ₹100 deduction on harvest baskets above ₹500',
    color: '#ea580c',
  },
];

class CouponAttributionService {
  /**
   * Generates a cryptographically random spin-wheel reward
   */
  spinReward(): { reward: SpinReward; index: number; uniqueCoupon: string } {
    const cryptoArray = new Uint32Array(1);
    window.crypto.getRandomValues(cryptoArray);
    const index = cryptoArray[0] % SPIN_WHEEL_REWARDS.length;
    const baseReward = SPIN_WHEEL_REWARDS[index];

    // Generate 7-day single use unique code
    const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueCoupon = `${baseReward.couponCode}-${uniqueSuffix}`;

    return {
      reward: baseReward,
      index,
      uniqueCoupon,
    };
  }

  /**
   * Generates unique customer referral link
   */
  generateReferralLink(customerName: string): string {
    const slug = customerName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    return `${window.location.origin}/u/ref-${slug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  /**
   * Saves incoming UTM / Short link attribution
   */
  recordAttribution(slug: string, queryParams: URLSearchParams): AttributionSession {
    const session: AttributionSession = {
      slug,
      referrerName: queryParams.get('ref') || 'Community Ambassador',
      campaignSource: queryParams.get('utm_source') || 'direct_grower_link',
      medium: queryParams.get('utm_medium') || 'short_link',
      timestamp: new Date().toISOString(),
      appliedPromoCode: queryParams.get('promo') || undefined,
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(ATTRIBUTION_SESSION_KEY, JSON.stringify(session));
      } catch (err) {
        console.warn('Attribution save error:', err);
      }
    }

    return session;
  }

  getAttribution(): AttributionSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(ATTRIBUTION_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export const couponAttributionService = new CouponAttributionService();
