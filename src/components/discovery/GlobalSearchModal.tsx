import React, { useState, useEffect } from 'react';
import { ProduceItem } from '../../types';
import { searchDiscoveryService } from '../../services/searchDiscoveryService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  produceList: ProduceItem[];
  onSelectProduce: (item: ProduceItem) => void;
  onSelectCategory?: (category: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  produceList,
  onSelectProduce,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setIsListening(false);
      setVoiceError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = searchDiscoveryService.search(produceList, query);

  const handleVoiceSearch = () => {
    setVoiceError(null);
    if (!searchDiscoveryService.isVoiceSearchSupported()) {
      setVoiceError('Voice recognition is not supported in this browser.');
      return;
    }

    setIsListening(true);
    searchDiscoveryService.startVoiceRecognition(
      (transcript) => {
        setQuery(transcript);
        setIsListening(false);
      },
      (err) => {
        console.warn('Voice error:', err);
        setVoiceError('Could not recognize audio. Please try typing.');
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400 text-[24px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search farm produce, smallholder growers, Nashik/Shimla origins..."
            className="flex-1 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Search by Voice (Web Speech API)"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Voice Listening Notice */}
        {isListening && (
          <div className="px-5 py-2.5 bg-red-50 border-b border-red-100 text-xs text-red-800 flex items-center gap-2 animate-fadeIn">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span>Listening... Speak naturally (e.g. "Shimla apples" or "Gir cow milk")</span>
          </div>
        )}

        {voiceError && (
          <div className="px-5 py-2 bg-amber-50 text-xs text-amber-800 border-b border-amber-200">
            {voiceError}
          </div>
        )}

        {/* Quick Filter Badges */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Quick Jump:</span>
          {['all', 'fruits', 'leafy', 'dairy', 'grains'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                onSelectCategory?.(cat);
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-medium cursor-pointer transition-colors"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No produce found matching "{query}". Try searching "apples", "tomatoes", or "milk".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduce(item);
                  onClose();
                }}
                className="p-3 rounded-2xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {item.farmer} · {item.origin} · {item.badge}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">
                    ₹{item.price} <span className="text-xs text-slate-400 font-normal">/{item.unit}</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    94.1% Direct Escrow
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
