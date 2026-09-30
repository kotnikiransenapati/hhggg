import React, { useState } from 'react';
import { Customer360Profile, OrderRecord } from '../../types';

interface Customer360DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onReorder: (order: OrderRecord) => void;
}

export const Customer360Drawer: React.FC<Customer360DrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'loyalty' | 'omnichannel' | 'gdpr'>('overview');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'copilot'; text: string; time: string }>>([
    {
      sender: 'copilot',
      text: 'Namaste Priya! I am your FarmDirect AI Support Copilot. I can see your last tomato consignment was dispatched at 3.4°C. How can I help today?',
      time: '10:45 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  if (!isOpen) return null;

  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0) + 4250;
  const loyaltyPoints = Math.round(totalSpent / 10);

  const profile: Customer360Profile = {
    userId: 'usr_priya_882',
    name: 'Priya Sharma',
    email: 'priya.sharma@farmdirect.internal',
    phone: '+91 98201 44892',
    city: 'Bandra West, Mumbai',
    lifetimeValueRupees: totalSpent,
    ordersCount: orders.length + 3,
    churnRiskScore: 12, // 12% = Very Loyal / Low Risk
    predictedNextOrderDate: 'Friday, 07:00 AM (Weekly Fruit Basket)',
    loyaltyPoints,
    loyaltyTier: loyaltyPoints > 500 ? 'Harvester' : 'Blossom',
    lastReeferTempDelivered: '3.4°C',
    abandonedCartItemsCount: 1,
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const copilotReply = {
        sender: 'copilot' as const,
        text: `Understood! I've cross-verified your harvest lot with Ramesh Patel's Nashik syndicate. Your produce was cut 6 hours ago and cold-chain integrity is at 100%.`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, copilotReply]);
    }, 1000);
  };

  const handleGdprExport = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      profile,
      orders,
      escrowAgreements: 'RBI Regulated Custody Agreement Active',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmdirect_gdpr_export_${profile.userId}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm">
                PS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">{profile.name}</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Tier: {profile.loyaltyTier}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {profile.city} · {profile.phone}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 bg-slate-50 border-b border-slate-200 flex gap-2 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Customer 360 View', icon: 'person' },
              { id: 'loyalty', label: 'Loyalty & Rewards', icon: 'star' },
              { id: 'omnichannel', label: 'AI Copilot & WhatsApp', icon: 'smart_toy' },
              { id: 'gdpr', label: 'GDPR Privacy & Data', icon: 'privacy_tip' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-700 text-emerald-800 font-bold bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* LTV & Predictive Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Lifetime Value</span>
                    <span className="text-xl font-bold text-emerald-950 font-mono">
                      ₹{profile.lifetimeValueRupees.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">{profile.ordersCount} Paid Orders</span>
                  </div>

                  <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
                    <span className="text-[10px] uppercase font-bold text-sky-800 block">Churn Risk Score</span>
                    <span className="text-xl font-bold text-sky-950">{profile.churnRiskScore}%</span>
                    <span className="text-[10px] text-sky-700 block mt-0.5">High Loyalty Segment</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Cold-Chain QA</span>
                    <span className="text-xl font-bold text-slate-900 font-mono">3.4°C</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Sub-4°C Compliant</span>
                  </div>
                </div>

                {/* Predictive Next Order Alert */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">event_repeat</span>
                    <span>Predicted Next Harvest Replenishment:</span>
                  </span>
                  <p className="text-slate-700">{profile.predictedNextOrderDate}</p>
                </div>

                {/* 1-Click Reorder Action Bar */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Recent Harvest Orders (1-Click Reorder)
                  </h4>
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block font-mono">{ord.id} ({ord.date})</span>
                        <span className="text-[11px] text-slate-500">
                          {ord.items.length} crops · ₹{ord.total.toFixed(2)} · {ord.escrowStatus}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onReorder(ord)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs"
                      >
                        ⚡ 1-Click Reorder
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'loyalty' && (
              <div className="space-y-5">
                <div className="p-6 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                      FarmDirect Community Rewards
                    </span>
                    <span className="text-4xl font-black block mt-1 font-mono">
                      {profile.loyaltyPoints} Points
                    </span>
                    <p className="text-xs text-emerald-200 mt-1">
                      1 point earned for every ₹10 settled to smallholder farmers.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs">
                    <span>Current Tier: <strong>{profile.loyaltyTier}</strong></span>
                    <span className="text-emerald-300">Next Tier: 1,000 pts (Guardian)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <h5 className="font-bold text-slate-900">Tier Privileges:</h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Sunrise express delivery slot priority (07:00 AM)</li>
                    <li>Complimentary heirloom seed packs with every order above ₹500</li>
                    <li>Direct access to WhatsApp harvest audio diaries with lead agronomists</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'omnichannel' && (
              <div className="space-y-4 flex flex-col h-96">
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] ${
                          msg.sender === 'user'
                            ? 'bg-emerald-700 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI Copilot about cold-chain or crop origin..."
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Send
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => alert('Launching direct WhatsApp conversation with dedicated support agent...')}
                    className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Need human agent? Switch to WhatsApp Cloud API</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'gdpr' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900">GDPR / DPDP Self-Service Data Export</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Download a complete machine-readable copy of your personal profiles, escrow receipts, delivery addresses, and QA logs.
                  </p>
                  <button
                    type="button"
                    onClick={handleGdprExport}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl cursor-pointer"
                  >
                    Export My Data (JSON)
                  </button>
                </div>

                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                  <h4 className="font-bold text-red-900">Right to be Forgotten (Account Deletion)</h4>
                  <p className="text-red-800 leading-relaxed">
                    Permanently redact PII from all audit ledgers and telemetry records. Active escrow transactions must be settled first.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Deletion request received. PII will be purged in 30 days per data retention guidelines.')}
                    className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Request Account Deletion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
