import React, { useState } from 'react';
import { ProduceItem } from '../../types';
import { searchDiscoveryService } from '../../services/searchDiscoveryService';

interface WaitlistAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  produce: ProduceItem | null;
}

export const WaitlistAlertModal: React.FC<WaitlistAlertModalProps> = ({
  isOpen,
  onClose,
  produce,
}) => {
  const [contact, setContact] = useState<string>('');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !produce) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    searchDiscoveryService.joinWaitlist(produce, contact, channel);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">notifications_active</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Back-in-Stock Alert
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Get instant harvest notifications when <strong>{produce.name}</strong> is next cut at dawn by {produce.farmer}.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-semibold animate-fadeIn">
            ✓ You're on the priority waitlist! We will notify you via {channel.toUpperCase()} the instant harvesting commences.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Preferred Notification Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
                  { id: 'email', label: 'Email', icon: 'mail' },
                  { id: 'sms', label: 'SMS', icon: 'sms' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      channel === c.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {channel === 'email' ? 'Email Address' : 'Mobile / WhatsApp Number'}
              </label>
              <input
                type={channel === 'email' ? 'email' : 'tel'}
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={channel === 'email' ? 'name@example.com' : '+91 98201 44892'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Notify Me for Next Sunrise Harvest
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
