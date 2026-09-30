import React from 'react';
import { RolePanel, ActiveScreen } from '../../types';

interface RoleSimulatorBarProps {
  currentRole: RolePanel;
  onRoleChange: (role: RolePanel) => void;
  onNavigateScreen: (screen: ActiveScreen) => void;
  onOpenCommandPalette: () => void;
}

export const RoleSimulatorBar: React.FC<RoleSimulatorBarProps> = ({
  currentRole,
  onRoleChange,
  onNavigateScreen,
  onOpenCommandPalette,
}) => {
  const roles: Array<{ id: RolePanel; label: string; icon: string; targetScreen: ActiveScreen }> = [
    { id: 'customer', label: 'Consumer Store', icon: 'shopping_bag', targetScreen: 'marketplace' },
    { id: 'farmer', label: 'Grower Portal', icon: 'agriculture', targetScreen: 'farmer-panel' },
    { id: 'wholesaler', label: 'B2B Wholesale', icon: 'business_center', targetScreen: 'wholesale' },
    { id: 'vendor', label: 'Multi-Vendor', icon: 'storefront', targetScreen: 'marketplace' },
    { id: 'support', label: 'Support Desk', icon: 'support_agent', targetScreen: 'support-panel' },
    { id: 'admin', label: 'Super Admin', icon: 'admin_panel_settings', targetScreen: 'admin-panel' },
  ];

  return (
    <div className="bg-slate-950 text-white px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-40 sticky top-0 shadow-md">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
          RBAC Role Simulator:
        </span>
        <div className="flex flex-wrap gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                onRoleChange(r.id);
                onNavigateScreen(r.targetScreen);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentRole === r.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer text-[11px]"
          title="Open Command Palette"
        >
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          <span>Cmd+K</span>
        </button>
      </div>
    </div>
  );
};
