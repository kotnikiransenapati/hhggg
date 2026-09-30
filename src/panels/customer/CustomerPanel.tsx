import React from 'react';
import { OrderRecord, ActiveScreen } from '../../types';
import { DeliveryTrackingVisualizer } from '../../components/DeliveryTrackingVisualizer';
import { OrganicConsumptionChart } from '../../components/OrganicConsumptionChart';

interface CustomerPanelProps {
  orders: OrderRecord[];
  onReleaseEscrow: (orderId: string) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  orders,
  onReleaseEscrow,
  setActiveScreen,
}) => {
  const activeOrders = orders.filter((o) => o.escrowStatus === 'Locked');
  const pastOrders = orders.filter((o) => o.escrowStatus !== 'Locked');

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>In-Transit Escrow Custody</span>
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">lock</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{activeOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">100% Protected until you accept crispness</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Refrigerated Vans In Transit</span>
            <span className="material-symbols-outlined text-cyan-600 text-[18px]">local_shipping</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeOrders.length} Consignments</div>
          <p className="text-[11px] text-slate-500 mt-1">Holding sub-4.0°C hermetic cold-chain</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Delivered &amp; Disbursed</span>
            <span className="material-symbols-outlined text-blue-600 text-[18px]">verified</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pastOrders.length} Orders</div>
          <p className="text-[11px] text-slate-500 mt-1">Direct to grower cooperative accounts</p>
        </div>
      </div>

      {/* Featured Active Shipment with Live Map */}
      {activeOrders.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Active Cold-Chain Dispatch • Order #{activeOrders[0].id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Live Route Radar &amp; Reefer Telemetry
              </h3>
            </div>
            <button
              onClick={() => setActiveScreen('orders')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All In Orders Tab</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <DeliveryTrackingVisualizer order={activeOrders[0]} isDelivered={false} />

          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <span className="material-symbols-outlined text-emerald-700 text-[20px]">thumb_up</span>
              <span>Courier arriving today. You will inspect freshness before funds release.</span>
            </div>
            <button
              onClick={() => onReleaseEscrow(activeOrders[0].id)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Authorize Escrow Release
            </button>
          </div>
        </div>
      )}

      {/* Consumption Trend Analysis */}
      <OrganicConsumptionChart />
    </div>
  );
};
