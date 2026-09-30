import React from 'react';
import { ActiveScreen, RolePanel } from '../types';

interface RoleSwitcherBarProps {
  currentRole: RolePanel;
  onSelectRole: (role: RolePanel) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onSelectRole,
  setActiveScreen,
}) => {
  const roles: { id: RolePanel; label: string; icon: string; badge: string; targetScreen: ActiveScreen }[] = [
    {
      id: 'customer',
      label: 'Customer Panel',
      icon: 'shopping_bag',
      badge: 'Escrow Protected',
      targetScreen: 'marketplace',
    },
    {
      id: 'farmer',
      label: 'Farmer Collective Panel',
      icon: 'agriculture',
      badge: '94.1% Direct Share',
      targetScreen: 'farmer-panel',
    },
    {
      id: 'admin',
      label: 'Platform Admin Panel',
      icon: 'admin_panel_settings',
      badge: 'Fleet & Vault Radar',
      targetScreen: 'admin-panel',
    },
    {
      id: 'support',
      label: 'Support Executive Panel',
      icon: 'support_agent',
      badge: '2 Open Disputes',
      targetScreen: 'support-panel',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider hidden sm:inline">
          Full-Stack Role Switcher:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {roles.map((r) => {
          const isSelected = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => {
                onSelectRole(r.id);
                setActiveScreen(r.targetScreen);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-1.5 text-xs ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{r.icon}</span>
              <span>{r.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold hidden md:inline-block ${
                  isSelected ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {r.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
