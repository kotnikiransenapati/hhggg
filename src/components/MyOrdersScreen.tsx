import React, { useState } from 'react';
import { OrderRecord, ActiveScreen } from '../types';
import { OrganicConsumptionChart } from './OrganicConsumptionChart';
import { OrderRatingField } from './OrderRatingField';
import { DeliveryTrackingVisualizer } from './DeliveryTrackingVisualizer';

interface MyOrdersScreenProps {
  orders: OrderRecord[];
  onReleaseEscrow: (orderId: string) => void;
  onRateOrder?: (orderId: string, rating: number, comment?: string) => void;
  setActiveScreen: (screen: ActiveScreen) => void;
  onViewInvoice?: (order: OrderRecord) => void;
  onViewShippingLabel?: (order: OrderRecord) => void;
  onReorder?: (order: OrderRecord) => void;
}

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
  orders,
  onReleaseEscrow,
  onRateOrder,
  setActiveScreen,
  onViewInvoice,
  onViewShippingLabel,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);
  const [releaseFeedback, setReleaseFeedback] = useState<string | null>(null);
  const [expandedTrackingId, setExpandedTrackingId] = useState<string | null>(null);

  const handleInspectAndRelease = (orderId: string) => {
    onReleaseEscrow(orderId);
    setReleaseFeedback(
      `Quality accepted! Funds settled instantly to farmer cooperative accounts. Please rate produce freshness below!`
    );
    setTimeout(() => setReleaseFeedback(null), 5000);
  };

  const handleSaveRating = (orderId: string, rating: number, comment?: string) => {
    if (onRateOrder) {
      onRateOrder(orderId, rating, comment);
    }
  };

  const activeOrders = orders.filter((o) => o.escrowStatus === 'Locked');
  const pastOrders = orders.filter((o) => o.escrowStatus !== 'Locked');

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="max-w-7xl w-full mx-auto px-gutter py-space-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-sm border-b border-surface-container mb-space-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm font-semibold uppercase text-xs mb-1">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Protected Escrow Custody</span>
            </div>
            <h1 className="font-headline-lg font-bold text-on-surface text-2xl lg:text-3xl">
              My Orders &amp; Escrow Releases
            </h1>
            <p className="font-body-sm text-on-surface-variant text-xs sm:text-sm mt-0.5">
              Review live refrigerated transit telemetry and release funds to growers once you inspect crispness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-3 py-2 rounded-lg font-label-md text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                showAnalytics
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-surface-container'
              }`}
              title="Toggle Consumption Trend Chart"
            >
              <span className="material-symbols-outlined text-[16px]">monitoring</span>
              <span>{showAnalytics ? 'Hide Trends' : 'View Consumption Trends'}</span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg font-label-md text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'active'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Active Shipments ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg font-label-md text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'past'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Past Deliveries ({pastOrders.length})
            </button>
          </div>
        </div>

        {/* Consumption Pattern and Spending Trend Chart */}
        {showAnalytics && <OrganicConsumptionChart />}

        {/* Feedback Alert */}
        {releaseFeedback && (
          <div className="mb-space-lg bg-primary-container text-on-primary-container p-4 rounded-xl font-label-md flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px]">verified</span>
              <span>{releaseFeedback}</span>
            </div>
            <button onClick={() => setReleaseFeedback(null)} className="text-sm font-bold">✕</button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-space-lg">
          {(activeTab === 'active' ? activeOrders : pastOrders).map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden"
            >
              {/* Order Header Strip */}
              <div className="p-space-md bg-surface-container-low border-b border-surface-container flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    📦
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm font-bold text-on-surface text-base">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`font-label-sm px-2 py-0.5 rounded-full font-bold text-xs ${
                          order.escrowStatus === 'Locked'
                            ? 'bg-secondary/15 text-secondary flex items-center gap-1'
                            : 'bg-primary/15 text-primary flex items-center gap-1'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {order.escrowStatus === 'Locked' ? 'lock' : 'check_circle'}
                        </span>
                        {order.escrowStatus === 'Locked' ? 'Escrow Locked in Transit' : 'Escrow Released to Farmer'}
                      </span>
                    </div>
                    <span className="font-label-sm text-outline text-xs">
                      Placed on {order.date} • Slot: {order.slot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-md">
                  <button
                    onClick={() =>
                      setExpandedTrackingId(expandedTrackingId === order.id ? null : order.id)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 border ${
                      expandedTrackingId === order.id
                        ? 'bg-emerald-800 text-white border-emerald-700 shadow-sm'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {expandedTrackingId === order.id ? 'explore' : 'near_me'}
                    </span>
                    <span>
                      {expandedTrackingId === order.id
                        ? 'Hide Route Radar'
                        : 'Live Map & Reefer Radar'}
                    </span>
                    <span className="ml-1 px-1.5 py-0.2 bg-emerald-900/20 text-emerald-900 rounded font-mono text-[10px]">
                      {order.reeferTemp}
                    </span>
                  </button>

                  <div className="text-right">
                    <span className="font-label-sm text-outline block text-xs">Total Amount</span>
                    <span className="font-headline-sm font-bold text-on-surface text-base">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="p-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Items in order (7 cols) */}
                <div className="lg:col-span-7 space-y-space-sm">
                  <h4 className="font-label-lg font-bold text-on-surface text-xs uppercase tracking-wider text-outline">
                    Harvest Lots in this consignment
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container text-xs"
                      >
                        <div>
                          <p className="font-bold text-on-surface">{it.name}</p>
                          <span className="text-outline text-[11px]">{it.farmerName}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-on-surface">
                            {it.quantity}x @ ₹{it.price} = ₹{it.quantity * it.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-on-surface-variant flex items-center justify-between border-t border-surface-container">
                    <span>Micro-Logistics: ₹{order.logisticsFee.toFixed(2)}</span>
                    <span>1% Direct Producer Fee: ₹{order.platformFee.toFixed(2)}</span>
                    <span className="font-bold text-primary">Farm Gate: ₹{order.subtotal.toFixed(2)} (Direct to Growers)</span>
                  </div>
                </div>

                {/* Live Telemetry & Escrow Action (5 cols) */}
                <div className="lg:col-span-5 bg-surface-container-low p-space-md rounded-xl border border-surface-container flex flex-col justify-between gap-space-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label-md font-bold text-on-surface text-xs">
                        Cold-Chain Sensor Telemetry
                      </span>
                      <span className="bg-primary/10 text-primary font-label-sm px-2 py-0.5 rounded font-bold text-[10px]">
                        Sensor Online
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-outline">Reefer Unit:</span>
                        <span className="font-semibold text-on-surface">{order.vanNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-outline">Driver Lead:</span>
                        <span className="font-semibold text-on-surface">{order.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-outline">Live Temp:</span>
                        <span className="font-bold text-secondary">{order.reeferTemp} (Optimal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-outline">Estimated Delivery:</span>
                        <span className="font-bold text-primary">{order.eta}</span>
                      </div>
                    </div>

                    {/* Official Document & Reorder Quick Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-surface-container">
                      {onViewInvoice && (
                        <button
                          type="button"
                          onClick={() => onViewInvoice(order)}
                          className="px-2.5 py-1 rounded-md bg-surface-container-low hover:bg-surface-container text-on-surface text-[11px] font-semibold flex items-center gap-1 border border-surface-container cursor-pointer transition-colors"
                          title="Generate Official GST Tax Invoice"
                        >
                          <span className="material-symbols-outlined text-[14px] text-primary">receipt</span>
                          <span>GST Invoice</span>
                        </button>
                      )}
                      {onViewShippingLabel && (
                        <button
                          type="button"
                          onClick={() => onViewShippingLabel(order)}
                          className="px-2.5 py-1 rounded-md bg-surface-container-low hover:bg-surface-container text-on-surface text-[11px] font-semibold flex items-center gap-1 border border-surface-container cursor-pointer transition-colors"
                          title="Generate Automated 100mm Shipping Label"
                        >
                          <span className="material-symbols-outlined text-[14px] text-secondary">local_shipping</span>
                          <span>100mm Label</span>
                        </button>
                      )}
                      {onReorder && (
                        <button
                          type="button"
                          onClick={() => onReorder(order)}
                          className="px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold flex items-center gap-1 border border-primary/20 cursor-pointer transition-colors"
                          title="One-Click Reorder Exact Basket"
                        >
                          <span className="material-symbols-outlined text-[14px]">replay</span>
                          <span>One-Click Reorder</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Escrow Release Button or Rating */}
                  {order.escrowStatus === 'Locked' ? (
                    <div className="pt-2 border-t border-surface-container space-y-2">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Funds will remain locked until delivery courier arrives. You may immediately inspect produce crispness and authorize release:
                      </p>
                      <button
                        onClick={() => handleInspectAndRelease(order.id)}
                        className="w-full py-2.5 bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-on-primary-container transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Inspect Produce &amp; Release Escrow</span>
                      </button>
                      <button
                        onClick={() => alert('Dispute protocol: Support assigned. Money remains safely locked in escrow custody.')}
                        className="w-full py-1 text-center text-[11px] text-outline hover:text-error hover:underline"
                      >
                        Report Crispness Issue (100% Escrow Refund)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-primary/10 rounded-lg text-primary text-xs text-center font-semibold flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                        <span>Quality Accepted • Funds Disbursed to Growers</span>
                      </div>
                      {order.rating ? (
                        <div className="flex items-center justify-between text-xs px-1 text-amber-700">
                          <span className="font-semibold">Harvest Rating: {order.rating}★</span>
                          <span className="text-[11px] text-outline">{order.ratedAt || 'Recorded'}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded text-center font-medium">
                          ⭐ Please share produce quality feedback below
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Interactive Map & Telemetry Visualizer */}
                {expandedTrackingId === order.id && (
                  <div className="lg:col-span-12 border-t border-surface-container pt-3">
                    <DeliveryTrackingVisualizer
                      order={order}
                      isDelivered={order.escrowStatus !== 'Locked'}
                    />
                  </div>
                )}

                {/* Star-Rating Input Field for Delivered Orders */}
                {order.escrowStatus !== 'Locked' && (
                  <div className="lg:col-span-12 border-t border-surface-container pt-2">
                    <OrderRatingField
                      orderId={order.id}
                      initialRating={order.rating}
                      initialComment={order.reviewComment}
                      ratedAt={order.ratedAt}
                      onSaveRating={handleSaveRating}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {(activeTab === 'active' ? activeOrders : pastOrders).length === 0 && (
            <div className="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">inventory_2</span>
              <p className="font-body-md text-on-surface-variant">No orders in this tab right now.</p>
              <button
                onClick={() => setActiveScreen('marketplace')}
                className="mt-4 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg text-xs hover:bg-on-primary-fixed-variant"
              >
                Browse Today's Harvest Lots
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
