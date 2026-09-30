import React, { useState } from 'react';
import { ActiveScreen } from '../types';

interface FloatingRolePortalWidgetProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const FloatingRolePortalWidget: React.FC<FloatingRolePortalWidgetProps> = ({
  activeScreen,
  setActiveScreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const portals = [
    {
      id: 'landing',
      label: 'Storefront',
      desc: 'Consumer Marketplace',
      icon: 'storefront',
      color: 'emerald',
    },
    {
      id: 'profile',
      label: 'Customer Profile',
      desc: 'Preferences & Escrow',
      icon: 'account_circle',
      color: 'emerald',
    },
    {
      id: 'farmer-panel',
      label: 'Farmer Workflow',
      desc: 'Harvest & Reefer Dispatch',
      icon: 'agriculture',
      color: 'amber',
    },
    {
      id: 'admin-panel',
      label: 'Admin Command',
      desc: 'Cold-Chain Fleet Radar',
      icon: 'admin_panel_settings',
      color: 'purple',
    },
    {
      id: 'support-panel',
      label: 'Support Desk',
      desc: 'Dispute Arbitration',
      icon: 'support_agent',
      color: 'blue',
    },
    {
      id: 'wholesale',
      label: 'Wholesale B2B',
      desc: 'Institutional Procurement',
      icon: 'corporate_fare',
      color: 'teal',
    },
  ];

  return (
    <div className="fixed bottom-5 left-5 z-40 print:hidden">
      {isOpen ? (
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700 w-72 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">tune</span>
              <span>Stakeholder Roles &amp; Panels</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              title="Collapse"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="space-y-1">
            {portals.map((p) => {
              const isActive =
                activeScreen === p.id ||
                (p.id === 'landing' &&
                  (activeScreen === 'landing' ||
                    activeScreen === 'marketplace' ||
                    activeScreen === 'traceability' ||
                    activeScreen === 'community' ||
                    activeScreen === 'checkout' ||
                    activeScreen === 'orders'));

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveScreen(p.id as ActiveScreen);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeScreen === p.id
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px]">
                      {p.icon}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{p.label}</div>
                      <div className="text-[10px] text-slate-400">{p.desc}</div>
                    </div>
                  </div>
                  {activeScreen === p.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Also in Profile menu ↗</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Minimize
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold shadow-lg border border-slate-700/80 backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Switch Stakeholder View"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="material-symbols-outlined text-[16px]">switch_account</span>
          <span className="hidden sm:inline">Role Panels</span>
          <span className="text-slate-400 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full font-mono">
            5
          </span>
        </button>
      )}
    </div>
  );
};
