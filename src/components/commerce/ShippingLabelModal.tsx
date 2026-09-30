import React from 'react';
import { OrderRecord } from '../../types';
import { logisticsService } from '../../services/logisticsService';

interface ShippingLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  customerName?: string;
  customerAddress?: string;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  isOpen,
  onClose,
  order,
  customerName = 'Priya Sharma',
  customerAddress = 'Flat 402, Sea Green Apartments, Perry Cross Road, Bandra West, Mumbai 400050',
}) => {
  if (!isOpen || !order) return null;

  const label = logisticsService.generateAwbLabel(order, customerName, customerAddress);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Automated 100mm Thermal Shipping Label</h3>
            <span className="text-[11px] text-slate-500">Official Carrier Manifest (Exclusive Delhivery &amp; India Post)</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 100mm Thermal Label Canvas Card */}
        <div className="bg-white border-2 border-dashed border-slate-400 p-5 rounded-xl space-y-4 text-slate-900 font-sans shadow-inner select-all">
          {/* Top Carrier Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
            <div>
              <span className="text-xl font-black tracking-tight uppercase">{label.carrier}</span>
              <span className="text-[10px] font-mono block">COLD-CHAIN REEFER CONSIGNMENT</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 rounded">
                STANDARD PRIORITY
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5">Manifest: {label.manifestDate}</span>
            </div>
          </div>

          {/* Barcode Visual */}
          <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-lg">
            {/* SVG Barcode Representation */}
            <div className="w-64 h-12 mx-auto flex items-stretch justify-between px-2">
              {Array.from({ length: 48 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-black"
                  style={{
                    width: idx % 3 === 0 ? '4px' : idx % 5 === 0 ? '1px' : '2px',
                    marginRight: '2px',
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold tracking-widest mt-1 block">
              AWB: {label.awb}
            </span>
          </div>

          {/* Route & Routing Hub */}
          <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3 border-slate-300">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Routing Dock</span>
              <span className="font-bold">{label.routingHub}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Reefer QA Condition</span>
              <span className="font-bold text-emerald-800">{label.reeferTempRequirement}</span>
            </div>
          </div>

          {/* Consignee Destination */}
          <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Deliver To (Consignee):
            </span>
            <span className="font-bold text-sm text-slate-900 block">{label.shipTo.name}</span>
            <p className="text-[11px] text-slate-700 leading-snug">{label.shipTo.address}</p>
            <span className="text-[11px] text-slate-600 block font-mono">Contact: {label.shipTo.phone}</span>
          </div>

          {/* Escrow Lock Stamp */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
            <div>
              <span className="text-[9px] text-slate-400 uppercase block">Order / Consignment</span>
              <span className="font-bold font-mono">{label.orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase block">Gross Weight</span>
              <span className="font-bold">{label.packageWeight}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print 100mm Thermal Label</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
