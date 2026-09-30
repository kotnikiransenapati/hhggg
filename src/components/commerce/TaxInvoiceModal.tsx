import React from 'react';
import { OrderRecord } from '../../types';
import { logisticsService } from '../../services/logisticsService';

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  customerName?: string;
  customerAddress?: string;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  customerName = 'Priya Sharma',
  customerAddress = 'Flat 402, Sea Green Apartments, Perry Cross Road, Bandra West, Mumbai 400050',
}) => {
  if (!isOpen || !order) return null;

  const invoice = logisticsService.generateGstInvoice(order, customerName, customerAddress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">Tax Invoice / Bill of Supply</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                GST Compliant
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">Invoice No: {invoice.invoiceNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Invoice Body */}
        <div className="space-y-5 overflow-y-auto flex-1 text-xs text-slate-800 pr-1">
          {/* Seller & Buyer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sold By (Grower Mesh):</span>
              <span className="font-bold text-slate-900 block">{invoice.sellerName}</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">{invoice.sellerAddress}</p>
              <span className="font-mono text-emerald-800 font-bold block pt-1">GSTIN: {invoice.sellerGstin}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To (Customer):</span>
              <span className="font-bold text-slate-900 block">{invoice.buyerName}</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">{invoice.buyerAddress}</p>
              <span className="text-slate-400 text-[11px] block pt-1">Date: {invoice.invoiceDate}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-100">
                <th className="p-2.5 rounded-l-lg">Description</th>
                <th className="p-2.5">HSN Code</th>
                <th className="p-2.5 text-right">Taxable (₹)</th>
                <th className="p-2.5 text-right">CGST (2.5%)</th>
                <th className="p-2.5 text-right">SGST (2.5%)</th>
                <th className="p-2.5 text-right rounded-r-lg">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.hsnSummary.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-medium">{item.description}</td>
                  <td className="p-2.5 font-mono">{item.hsnCode}</td>
                  <td className="p-2.5 text-right tabular-nums">₹{item.taxableValue.toFixed(2)}</td>
                  <td className="p-2.5 text-right tabular-nums">₹{item.cgstAmount.toFixed(2)}</td>
                  <td className="p-2.5 text-right tabular-nums">₹{item.sgstAmount.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-bold tabular-nums">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Totals */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-right">
            <div className="flex justify-between text-slate-500">
              <span>Total Taxable Value:</span>
              <span className="font-mono">₹{invoice.totalTaxable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Total CGST + SGST (5%):</span>
              <span className="font-mono">₹{(invoice.totalCgst + invoice.totalSgst).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total Payable (INR):</span>
              <span className="text-emerald-800 font-mono text-base">₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Tax Invoice PDF</span>
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
