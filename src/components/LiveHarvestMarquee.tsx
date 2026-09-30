import React from 'react';

export const LiveHarvestMarquee: React.FC = () => {
  const marqueeItems = [
    {
      badge: 'LIVE DISPATCH',
      title: 'Batch #TOM-104 • Vine Tomatoes',
      detail: 'Nashik Agro Belt • 3.4°C Chilled',
      icon: 'ac_unit',
    },
    {
      badge: '0.00 PPM PURE',
      title: 'Himachal Highland Orchards',
      detail: 'Royal Delicious Apples • SGS Lab Certified',
      icon: 'verified',
    },
    {
      badge: 'FARM GATE 05:30 AM',
      title: 'Sahyadri Organic Syndicate',
      detail: 'Picked 4h ago • 94.1% Direct Grower Payout',
      icon: 'agriculture',
    },
    {
      badge: 'COLD CORRIDOR',
      title: 'Reefer Van MH-15-EG-4402',
      detail: 'NH-160 Kasara Ghat • Arriving Bandra Hub 11:30 AM',
      icon: 'local_shipping',
    },
    {
      badge: 'A2 VEDIC DAIRY',
      title: 'Gir Vedic Gaushala, Anand',
      detail: 'A2 Raw Cow Milk • Sterile Nitrogen Sealed',
      icon: 'eco',
    },
    {
      badge: 'ESCROW GUARANTEE',
      title: 'Doorstep Crispness Inspection',
      detail: 'Release funds upon approval • 100% Instant Refund',
      icon: 'shield',
    },
  ];

  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 py-3 overflow-hidden text-white select-none">
      <div className="flex animate-marquee gap-8 items-center text-xs">
        {/* Double the list for seamless continuous infinite loop */}
        {[...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 shrink-0 px-2">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{item.badge}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">{item.title}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-medium">{item.detail}</span>
            </div>

            <span className="text-slate-700 ml-4">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
