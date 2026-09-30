import React from 'react';
import { ProduceItem } from '../../types';
import { searchDiscoveryService, PriceHistoryPoint } from '../../services/searchDiscoveryService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  produce: ProduceItem | null;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  isOpen,
  onClose,
  produce,
}) => {
  if (!isOpen || !produce) return null;

  const data: PriceHistoryPoint[] = searchDiscoveryService.getPriceHistory(produce);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={produce.imageUrl}
              alt={produce.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{produce.name}</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Price Audit
                </span>
              </div>
              <p className="text-xs text-slate-500">
                30-Day Transparent Farm Gate Price vs Supermarket Intermediary Markup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer border border-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Current Direct Price</span>
              <span className="text-xl font-bold text-emerald-950">₹{produce.price}</span>
              <span className="text-[10px] text-emerald-700 block">per {produce.unit}</span>
            </div>
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200/80">
              <span className="text-[10px] uppercase font-bold text-red-800 block">Supermarket Retail</span>
              <span className="text-xl font-bold text-red-950">₹{Math.round(produce.price * 1.8)}</span>
              <span className="text-[10px] text-red-700 block">+80% Middleman Cut</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Farmer Retained Cut</span>
              <span className="text-xl font-bold text-slate-900">94.1%</span>
              <span className="text-[10px] text-slate-500 block">Instant Escrow Lock</span>
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="w-full h-64 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} unit="₹" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="farmGatePrice"
                  name="FarmDirect Fair Farm Gate (₹)"
                  stroke="#006c49"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="retailSupermarketPrice"
                  name="Supermarket Middleman Retail (₹)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            By disintermediating mandi auctioneers, FarmDirect fixes pricing directly against harvest cost of production plus guaranteed living income.
          </p>
        </div>
      </div>
    </div>
  );
};
