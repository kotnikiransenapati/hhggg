import React, { useState } from 'react';
import { FARMER_PROFILES, INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { ChatMessage, ProduceItem } from '../types';

interface CommunityScreenProps {
  selectedFarmerId: string;
  setSelectedFarmerId: (id: string) => void;
  onAddToCartDirect: (item: ProduceItem, qty: number) => void;
  onOpenTrace: (batchId: string) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  selectedFarmerId,
  setSelectedFarmerId,
  onAddToCartDirect,
}) => {
  const [activeTab, setActiveTab] = useState<'growers' | 'circles'>('growers');
  const [filterText, setFilterText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(12);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const farmer = FARMER_PROFILES[selectedFarmerId] || FARMER_PROFILES.ramesh;

  // Toggle Voice Note simulation
  const handleToggleVoice = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      const interval = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 34) {
            clearInterval(interval);
            setIsAudioPlaying(false);
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'consumer',
      text: chatInput.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    const sentText = chatInput.trim();
    setChatInput('');

    // Simulated farmer response
    setTimeout(() => {
      let replyText = 'Noted Priya ji! Adding this note straight to crate packing supervisor.';
      if (sentText.toLowerCase().includes('picked')) {
        replyText = 'Harvest began at 05:30 AM today, completely finished and boxed by 07:15 AM!';
      } else if (sentText.toLowerCase().includes('report') || sentText.toLowerCase().includes('lab')) {
        replyText = 'Lot #N-24 lab certificate attached! Clean 0.00 ppm with 1.42% humus score.';
      } else if (sentText.toLowerCase().includes('ripeness')) {
        replyText = 'Understood! I will personally handpick medium-firm clusters so they ripen across the week.';
      }

      const farmerReply: ChatMessage = {
        id: `farmer-${Date.now()}`,
        sender: 'farmer',
        farmerId: farmer.id,
        text: replyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, farmerReply]);
    }, 1200);
  };

  const handleAddDirectItem = (item: {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    image: string;
  }) => {
    const produceItem: ProduceItem = {
      id: item.id,
      name: item.name,
      category: 'special',
      badge: 'Farm Direct',
      batchId: '#NSK-8821',
      imageUrl: item.image,
      harvestTime: 'Dawn pick',
      harvestHoursAgo: 2,
      origin: farmer.location,
      farmer: farmer.name,
      price: item.price,
      unit: item.unit,
      growerSharePercent: 99,
      accreditation: ['PGS-India Certified Organic'],
      distanceKm: farmer.distanceKm,
      inStock: true,
      description: item.description,
    };

    onAddToCartDirect(produceItem, 1);
    setAddedItemName(item.name);
    setTimeout(() => setAddedItemName(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 w-full">
      {/* Top Banner */}
      <div className="mb-6 bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">Direct Escrow Mesh Active</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">Chat directly with certified smallholder growers</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span>🔒 Escrow Protected Payouts</span>
          <span>·</span>
          <span>Zero Middleman Markups</span>
        </div>
      </div>

      {/* Added Notification Toast */}
      {addedItemName && (
        <div className="mb-4 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>✓ Added "{addedItemName}" directly into active dispatch shipment!</span>
          <button onClick={() => setAddedItemName(null)} className="text-xs">✕</button>
        </div>
      )}

      {/* 3-Column Simplified Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Farmers List (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Messages &amp; Guilds</h3>

            <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('growers')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  activeTab === 'growers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Growers (4)
              </button>
              <button
                onClick={() => setActiveTab('circles')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  activeTab === 'circles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Circles (3)
              </button>
            </div>
          </div>

          <div className="p-2 space-y-1.5 max-h-[600px] overflow-y-auto">
            {activeTab === 'growers' ? (
              [
                { id: 'ramesh', name: 'Ramesh Patel', crop: 'Nashik Tomatoes & Veg', time: 'Just now', unread: true },
                { id: 'arjun', name: 'Anand Shinde', crop: 'Junnar Exotic Greens', time: '15m ago', unread: false },
                { id: 'savita', name: 'Nandini Dairy (Gir A2)', crop: 'Sangli Free-Grazing', time: '2h ago', unread: false },
                { id: 'mahadev', name: 'Gurpreet Singh', crop: 'Ancient Grains & Mustard', time: 'Yesterday', unread: false },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFarmerId(f.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                    selectedFarmerId === f.id
                      ? 'bg-emerald-50 text-slate-900 font-medium border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    <img
                      src={FARMER_PROFILES[f.id]?.avatar || FARMER_PROFILES.ramesh.avatar}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{f.name}</h4>
                      <span className="text-[10px] text-slate-400">{f.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{f.crop}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 space-y-2 text-xs text-slate-600">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Bandra Organic Buyers</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">142 members pooling freight</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Mango Harvest 2025</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pre-harvest tree reservations</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Clean Chat Window (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={farmer.avatar}
                alt={farmer.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">{farmer.name}</h3>
                  <span className="material-symbols-outlined text-emerald-700 text-[16px]">verified</span>
                </div>
                <span className="text-xs text-slate-500">{farmer.location} · Verified Organic</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                Replies &lt; 5 mins
              </span>
            </div>
          </div>

          {/* Active Order Banner */}
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Order #FD-8921 (Tomatoes + Apples)</span>
            <span className="font-bold text-emerald-700">● Dispatch in progress</span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="mx-auto max-w-sm bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-xs text-center space-y-1">
                    <span className="font-bold text-slate-900 block">🚚 Reefer Van Departed Farm Hub</span>
                    <span className="text-slate-500 block">Temperature: 3.8°C Steady · ETA Today 11:30 AM</span>
                  </div>
                );
              }

              if (msg.sender === 'farmer') {
                return (
                  <div key={msg.id} className="flex items-start gap-2.5 max-w-[85%]">
                    <img
                      src={farmer.avatar}
                      alt="Farmer"
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                    />
                    <div className="space-y-1.5">
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200/80 shadow-xs text-xs text-slate-800 space-y-2">
                        <p className="leading-relaxed">{msg.text}</p>

                        {/* Photo attachment if present */}
                        {msg.photoUrl && (
                          <div className="rounded-xl overflow-hidden border border-slate-200">
                            <img src={msg.photoUrl} alt="Harvest verification" className="w-full h-36 object-cover" />
                            <span className="block p-1.5 text-[10px] text-slate-500 bg-slate-50">
                              📷 {msg.photoCaption || 'Field harvest snap'}
                            </span>
                          </div>
                        )}

                        {/* Audio Note */}
                        {msg.audioDuration && (
                          <div className="p-2.5 bg-slate-100 rounded-xl flex items-center gap-3">
                            <button
                              onClick={handleToggleVoice}
                              className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {isAudioPlaying ? 'pause' : 'play_arrow'}
                              </span>
                            </button>
                            <div className="flex-1">
                              <span className="text-[11px] font-bold text-slate-900 block">Voice Note ({msg.audioDuration}s)</span>
                              <span className="text-[10px] text-slate-500">
                                0:{audioSeconds < 10 ? '0' + audioSeconds : audioSeconds} / {msg.audioDuration}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 pl-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[80%] space-y-1">
                    <div className="bg-emerald-700 text-white p-3 rounded-2xl rounded-tr-xs text-xs shadow-xs">
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right pr-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setChatInput('When was this picked precisely?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full shrink-0 cursor-pointer"
            >
              When was this picked?
            </button>
            <button
              onClick={() => setChatInput('Please send medium-firm harvest clusters.')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full shrink-0 cursor-pointer"
            >
              Custom ripeness request
            </button>
            <button
              onClick={() => setChatInput('Can I see the lab pesticide certificate?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full shrink-0 cursor-pointer"
            >
              Show lab report
            </button>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message ${farmer.name}...`}
              className="flex-1 bg-slate-100 text-slate-900 px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 border border-slate-200"
            />
            <button
              type="submit"
              className="h-9 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
        </div>

        {/* Right Column: Farmer Mini Profile & Direct Add (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="text-center">
              <img
                src={farmer.avatar}
                alt={farmer.name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-emerald-600 mb-2"
              />
              <h4 className="font-bold text-slate-900 text-base">{farmer.name}</h4>
              <p className="text-xs text-slate-500">{farmer.farmName} · {farmer.acreage} Acres</p>
              <div className="mt-2 text-xs font-semibold text-amber-600">
                ★ {farmer.rating} / 5.0 ({farmer.reviewCount} reviews)
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="font-bold text-slate-900">{farmer.seasonsCount} Seasons</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Trust:</span>
                <span className="font-bold text-emerald-700">{farmer.escrowFulfillmentPercent}% Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Soil:</span>
                <span className="font-medium text-slate-900">Black Cotton · pH 7.2</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Items from this Farmer */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Direct From {farmer.name.split(' ')[0]}
            </h4>

            <div className="space-y-2">
              {farmer.directItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{item.name}</p>
                    <span className="text-[11px] text-emerald-800 font-semibold">₹{item.price}/{item.unit}</span>
                  </div>
                  <button
                    onClick={() => handleAddDirectItem(item)}
                    className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Add directly to active harvest crate"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
