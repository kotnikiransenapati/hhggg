import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  WEEKLY_CONSUMPTION_TREND,
  MONTHLY_CONSUMPTION_TREND,
  CATEGORY_SPENDING_BREAKDOWN,
  ConsumptionDataPoint
} from '../data/mockData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data: ConsumptionDataPoint = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <span className="font-bold text-slate-800">{label}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
            {data.ordersCount} {data.ordersCount === 1 ? 'Dispatch' : 'Dispatches'}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Spend:</span>
            <span className="font-bold text-slate-900">₹{data.spending.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-700">
            <span>Direct to Grower:</span>
            <span className="font-semibold">₹{data.farmerDirect.toLocaleString()} (94%)</span>
          </div>
          <div className="flex justify-between items-center text-amber-700">
            <span>Produce Volume:</span>
            <span className="font-semibold">~{data.kgProduce} kg clean harvest</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const OrganicConsumptionChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'categories'>('weekly');
  const [chartMode, setChartMode] = useState<'both' | 'spending' | 'frequency'>('both');

  const chartData = timeframe === 'weekly' ? WEEKLY_CONSUMPTION_TREND : MONTHLY_CONSUMPTION_TREND;

  const totalSpending = chartData.reduce((acc, curr) => acc + curr.spending, 0);
  const totalOrders = chartData.reduce((acc, curr) => acc + curr.ordersCount, 0);
  const totalKg = chartData.reduce((acc, curr) => acc + curr.kgProduce, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpending / totalOrders) : 0;

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/40 p-space-md sm:p-space-lg mb-space-lg">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-space-md border-b border-surface-container">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              📊
            </div>
            <div>
              <h2 className="font-headline-sm font-bold text-on-surface text-base sm:text-lg">
                Organic Consumption &amp; Spending Analytics
              </h2>
              <p className="font-body-sm text-outline text-xs">
                Visualizing your weekly reefer dispatch frequency, spending curve, and farmer-direct share.
              </p>
            </div>
          </div>
        </div>

        {/* View Selection Controls */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          <div className="bg-surface-container-low p-1 rounded-lg flex items-center border border-surface-container text-xs">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Weekly (8 Wks)
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Monthly (2026)
            </button>
            <button
              onClick={() => setTimeframe('categories')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeframe === 'categories'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Categories
            </button>
          </div>

          {timeframe !== 'categories' && (
            <div className="hidden sm:flex bg-surface-container-low p-1 rounded-lg items-center border border-surface-container text-xs">
              <button
                onClick={() => setChartMode('both')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  chartMode === 'both' ? 'bg-surface-container-highest text-on-surface font-semibold' : 'text-outline'
                }`}
                title="Both Spending and Frequency"
              >
                Combined
              </button>
              <button
                onClick={() => setChartMode('spending')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  chartMode === 'spending' ? 'bg-surface-container-highest text-primary font-semibold' : 'text-outline'
                }`}
              >
                ₹ Spend
              </button>
              <button
                onClick={() => setChartMode('frequency')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  chartMode === 'frequency' ? 'bg-surface-container-highest text-amber-700 font-semibold' : 'text-outline'
                }`}
              >
                Orders
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="text-outline text-[11px] block font-medium">Period Spending</span>
          <span className="text-lg font-bold text-on-surface">₹{totalSpending.toLocaleString()}</span>
          <span className="text-[10px] text-primary block font-semibold mt-0.5">
            94% to smallholder farmers
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="text-outline text-[11px] block font-medium">Total Shipments</span>
          <span className="text-lg font-bold text-amber-700">{totalOrders} Orders</span>
          <span className="text-[10px] text-outline block mt-0.5">
            Avg. ₹{avgOrderValue}/consignment
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="text-outline text-[11px] block font-medium">Produce Harvested</span>
          <span className="text-lg font-bold text-emerald-800">~{totalKg.toFixed(1)} kg</span>
          <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">
            Zero chemical residues (0.00 ppm)
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="text-outline text-[11px] block font-medium">Direct Markup Saved</span>
          <span className="text-lg font-bold text-primary">₹{(totalSpending * 0.22).toFixed(0)}</span>
          <span className="text-[10px] text-outline block mt-0.5">
            Middlemen commission avoided
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full mt-2">
        {timeframe === 'categories' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-4">
            <div className="lg:col-span-6 h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_SPENDING_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_SPENDING_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Investment']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
                Organic Pantry Allocation Breakdown
              </h4>
              <div className="space-y-2.5">
                {CATEGORY_SPENDING_BREAKDOWN.map((cat, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-bold text-on-surface">{cat.name}</span>
                      </div>
                      <span className="font-semibold text-on-surface">
                        ₹{cat.value.toLocaleString()} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                <XAxis
                  dataKey="period"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />

                {(chartMode === 'both' || chartMode === 'spending') && (
                  <YAxis
                    yAxisId="left"
                    stroke="#006c49"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                )}

                {(chartMode === 'both' || chartMode === 'frequency') && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#d97706"
                    fontSize={11}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val} ord`}
                  />
                )}

                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />

                {(chartMode === 'both' || chartMode === 'frequency') && (
                  <Bar
                    yAxisId="right"
                    dataKey="ordersCount"
                    name="Order Frequency"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                )}

                {(chartMode === 'both' || chartMode === 'spending') && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="spending"
                    name="Organic Spend (₹)"
                    stroke="#006c49"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#spendingGradient)"
                  />
                )}

                {chartMode === 'both' && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="farmerDirect"
                    name="Direct Farmer Payout (₹)"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Consumption Rhythm Insight Footnote */}
      <div className="mt-4 pt-3 border-t border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">psychology_alt</span>
          <span>
            <strong>Consumption Habit Insight:</strong> You order fresh leafy harvests every 4–5 days, maintaining peak nutrient vitality and supporting continuous weekly farm cycles.
          </span>
        </div>
        <div className="shrink-0 font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline">
          <span>Escrow Audited Payouts</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </div>
      </div>
    </div>
  );
};
