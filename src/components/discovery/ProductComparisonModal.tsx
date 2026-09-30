import React from 'react';
import { ProduceItem } from '../../types';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ProduceItem[];
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onOpenTrace: (batchId: string) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  items,
  onAddToCart,
  onOpenTrace,
}) => {
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">Harvest Lot Comparison Matrix</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Quantitative Rigor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Compare soil lab data, cold-chain status, and grower payout breakdown across fresh consignments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer border border-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 font-bold text-slate-400 uppercase text-[10px] w-48">Parameter</th>
                {items.map((item) => (
                  <th key={item.id} className="p-3 min-w-[200px] text-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover mx-auto mb-2 border border-slate-200"
                    />
                    <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                    <span className="text-[11px] text-slate-500 block">{item.origin}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Farm Gate Price</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center font-bold text-slate-900 text-sm">
                    ₹{item.price} <span className="text-[11px] text-slate-500 font-normal">/{item.unit}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Direct to Grower Share</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.growerSharePercent}% Direct
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Chemical Residue Test</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center font-bold text-emerald-800">
                    {item.chemicalResiduePpm ?? 0.0} ppm (Zero Trace)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Harvest Window</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center text-slate-600">
                    {item.harvestHoursAgo} hrs ago ({item.harvestTime})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Transit Temperature</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center font-bold text-sky-700">
                    {item.temperatureCelsius ?? 3.4}°C Sub-4°C Solar Locked
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Lead Farmer Collective</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center text-slate-800 font-medium">
                    {item.farmer}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Soil NPK Health</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center text-slate-600">
                    {item.soilNpk || 'Optimal 4:2:1 Organic Humus'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-700 bg-slate-50">Actions</td>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-center space-y-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(item, 1)}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                    >
                      Add to Basket
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenTrace(item.batchId)}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Verify Lab Trace
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
