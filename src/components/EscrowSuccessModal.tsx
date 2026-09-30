import React from 'react';
import { ActiveScreen } from '../types';

interface EscrowSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const EscrowSuccessModal: React.FC<EscrowSuccessModalProps> = ({
  isOpen,
  onClose,
  orderTotal,
  setActiveScreen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col p-space-lg gap-space-md text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
          <span className="material-symbols-outlined text-[36px]">verified_user</span>
        </div>

        <div>
          <span className="bg-primary/10 text-primary font-label-sm px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Smart Escrow Custody Activated
          </span>
          <h3 className="font-headline-lg font-bold text-on-surface mt-2">
            ₹{orderTotal.toFixed(2)} Held in Escrow
          </h3>
          <p className="font-body-sm text-on-surface-variant mt-1 max-w-md mx-auto">
            Order <strong>#FD-8921</strong> confirmed. Your funds remain safeguarded in an RBI-regulated escrow account until you inspect and accept the fresh harvest at your doorstep.
          </p>
        </div>

        {/* Cold-Chain Dispatch Verification Pill */}
        <div className="bg-surface-container-low p-space-md rounded-xl text-left space-y-2 border border-surface-container">
          <div className="flex items-center justify-between text-xs">
            <span className="text-outline font-semibold">Consignment Logistics:</span>
            <span className="text-secondary font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              Van MH-15-EG-4402 Dispatching
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-outline font-semibold">Active Cold-Chain:</span>
            <span className="text-primary font-bold">3.8°C Steady Locked</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-outline font-semibold">Estimated Arrival:</span>
            <span className="text-on-surface font-bold">Today 11:30 AM – 1:00 PM</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-outline font-semibold">Grower Share (94.1%):</span>
            <span className="text-primary font-bold">₹845.00 Settling to Cooperatives</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              setActiveScreen('orders');
            }}
            className="flex-1 py-3 px-4 bg-primary text-on-primary font-label-lg rounded-xl hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Track Order &amp; Escrow</span>
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveScreen('marketplace');
            }}
            className="py-3 px-4 bg-surface-container-low text-on-surface font-label-lg rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          >
            Back to Produce
          </button>
        </div>
      </div>
    </div>
  );
};
