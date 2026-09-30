import React, { useEffect, useState } from 'react';
import { ActiveScreen } from '../../types';
import { couponAttributionService, AttributionSession } from '../../services/couponAttributionService';

interface UniqueLinkRedirectProps {
  onRedirect: (screen: ActiveScreen) => void;
  onApplyPromoCode?: (code: string) => void;
}

export const UniqueLinkRedirect: React.FC<UniqueLinkRedirectProps> = ({
  onRedirect,
  onApplyPromoCode,
}) => {
  const [session, setSession] = useState<AttributionSession | null>(null);
  const [redirecting, setRedirecting] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // Detect /u/:slug or ?ref= or ?utm_source=
    let slug = 'direct_collective';
    if (pathname.startsWith('/u/')) {
      slug = pathname.replace('/u/', '');
    } else if (searchParams.get('ref')) {
      slug = `ref-${searchParams.get('ref')}`;
    }

    if (pathname.startsWith('/u/') || searchParams.has('ref') || searchParams.has('utm_source')) {
      const recorded = couponAttributionService.recordAttribution(slug, searchParams);
      setSession(recorded);

      // Auto-apply referral code if present or generated
      const promoToApply = recorded.appliedPromoCode || (slug.startsWith('ref-') ? 'WELCOME100' : 'FARM10');
      if (onApplyPromoCode) {
        onApplyPromoCode(promoToApply);
      }

      // Smooth redirect to marketplace after brief attribution display
      const timer = setTimeout(() => {
        setRedirecting(false);
        // Clean URL without losing session
        window.history.replaceState({}, document.title, window.location.pathname.startsWith('/u/') ? '/' : window.location.pathname);
        onRedirect('marketplace');
      }, 1600);

      return () => clearTimeout(timer);
    } else {
      setRedirecting(false);
    }
  }, [onRedirect, onApplyPromoCode]);

  if (!redirecting || !session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md text-white p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px] animate-pulse">loyalty</span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Attribution &amp; Referral Verified
          </span>
          <h2 className="text-xl font-bold mt-2 text-white">
            Welcome to FarmDirect!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Referred by <strong className="text-emerald-300">{session.referrerName}</strong> via campaign <em>{session.campaignSource}</em>.
          </p>
        </div>

        <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1">
          <div className="flex justify-between">
            <span>Special Sign-up Bounty:</span>
            <span className="font-bold text-emerald-400">₹100 Off First Order</span>
          </div>
          <div className="flex justify-between">
            <span>Grower Support Escrow:</span>
            <span className="font-bold text-white">99% Direct to Farmers</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 animate-pulse">
          Opening marketplace consignments...
        </p>
      </div>
    </div>
  );
};
