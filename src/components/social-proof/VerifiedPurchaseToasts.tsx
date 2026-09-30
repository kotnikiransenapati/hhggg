import React, { useState, useEffect } from 'react';
import { VerifiedPurchaseEvent } from '../../types';
import { socialProofService } from '../../services/socialProofService';

interface VerifiedPurchaseToastsProps {
  onItemClick?: (itemName: string) => void;
}

export const VerifiedPurchaseToasts: React.FC<VerifiedPurchaseToastsProps> = ({ onItemClick }) => {
  const [purchases, setPurchases] = useState<VerifiedPurchaseEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState<boolean>(false);

  useEffect(() => {
    socialProofService.fetchRecentPaidPurchases().then((list) => {
      setPurchases(list);
    });
  }, []);

  useEffect(() => {
    if (purchases.length === 0 || isDismissedByUser) return;

    // Show initial toast after 5 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Rotate every 16 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchases.length);
        setIsVisible(true);
      }, 1000);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [purchases, isDismissedByUser]);

  if (isDismissedByUser || purchases.length === 0 || !isVisible) {
    return null;
  }

  const current = purchases[currentIndex];
  if (!current) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-40 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 animate-fadeIn transition-all hover:scale-102 cursor-pointer"
      onClick={() => onItemClick?.(current.itemName)}
    >
      {/* Product Image / Icon */}
      <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
        {current.itemImage ? (
          <img
            src={current.itemImage}
            alt={current.itemName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-700 bg-emerald-50">
            <span className="material-symbols-outlined text-[24px]">eco</span>
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
          ✓
        </span>
      </div>

      {/* Info Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-bold text-slate-900">{current.customerFirstName}</span>
          <span>in {current.maskedCity}</span>
        </div>
        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
          Purchased {current.quantityStr} of {current.itemName}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
            Verified Escrow Order
          </span>
          <span className="text-[10px] text-slate-400">
            {current.timeAgoMinutes}m ago
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
          setIsDismissedByUser(true);
        }}
        className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs shrink-0 cursor-pointer"
        title="Dismiss notifications"
      >
        ✕
      </button>
    </div>
  );
};
