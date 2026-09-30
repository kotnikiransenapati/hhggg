import React, { useState } from 'react';
import { CartItem } from '../../types';
import { offlineCartQueue, SharedCartSnapshot } from '../../services/offlineCartQueue';

interface CartShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
}

export const CartShareModal: React.FC<CartShareModalProps> = ({
  isOpen,
  onClose,
  cart,
}) => {
  const [snapshot, setSnapshot] = useState<SharedCartSnapshot | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen && cart.length > 0) {
      const snap = offlineCartQueue.generateShareSnapshot(cart);
      setSnapshot(snap);
    }
  }, [isOpen, cart]);

  if (!isOpen || !snapshot) return null;

  const shareUrl = `${window.location.origin}/?cartShare=${snapshot.code}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[28px]">share</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">Share Fresh Harvest Basket</h3>
          <p className="text-xs text-slate-500 mt-1">
            Send this 8-character snapshot link to family or colleagues to preload your exact farm selection.
          </p>
        </div>

        {/* Snapshot Summary */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex justify-between font-semibold text-slate-800">
            <span>Snapshot Code:</span>
            <span className="font-mono text-emerald-700 font-bold">{snapshot.code}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Basket Size:</span>
            <span>{snapshot.items.length} unique farm items</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">₹{snapshot.subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Share Link Field */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-300">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 text-xs bg-transparent text-slate-700 font-mono focus:outline-none px-1 truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shrink-0"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
