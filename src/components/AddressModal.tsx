import React, { useState } from 'react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (address: string) => void;
}

const SAVED_ADDRESSES = [
  'Bandra West, Mumbai 400050',
  'Juhu Scheme, Mumbai 400049',
  'Khar West, Mumbai 400052',
  'Worli Sea Face, Mumbai 400018',
  'Powai Hiranandani, Mumbai 400076',
  'Colaba Causeway, Mumbai 400005'
];

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col p-space-lg gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
            <h3 className="font-headline-sm font-bold text-on-surface">Select Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-on-surface-variant text-xs">
          Direct cold-chain sprinter vans depart from Nashik &amp; Pune daily with scheduled delivery slots across Mumbai MMR.
        </p>

        <div className="space-y-2">
          {SAVED_ADDRESSES.map((addr) => (
            <button
              key={addr}
              onClick={() => {
                onSelectAddress(addr);
                onClose();
              }}
              className={`w-full p-space-sm rounded-xl text-left flex items-center justify-between border transition-all cursor-pointer ${
                currentAddress.includes(addr.split(',')[0])
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-surface-container bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">home_pin</span>
                <span className="text-sm">{addr}</span>
              </div>
              {currentAddress.includes(addr.split(',')[0]) && (
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-surface-container space-y-2">
          <label className="font-label-sm text-outline block">Or type custom Mumbai PIN/locality:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Andheri East, Mumbai 400069"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-surface-container-low text-on-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              disabled={!customInput.trim()}
              onClick={() => {
                if (customInput.trim()) {
                  onSelectAddress(customInput.trim());
                  onClose();
                }
              }}
              className="px-4 py-2 bg-primary text-on-primary font-label-md rounded-lg disabled:opacity-50 hover:bg-on-primary-fixed-variant transition-colors cursor-pointer"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
