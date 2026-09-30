import React, { useState, useEffect } from 'react';
import { ActiveScreen } from '../../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  onTriggerAction: (actionId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Wholesale B2B' | 'Governance' | 'Tools';
  shortcut?: string;
  icon: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerAction,
}) => {
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onTriggerAction('open-command-palette');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTriggerAction]);

  if (!isOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'cmd-marketplace',
      title: 'Go to Marketplace & Today\'s Harvest Lots',
      category: 'Navigation',
      icon: 'storefront',
      action: () => {
        onNavigate('marketplace');
        onClose();
      },
    },
    {
      id: 'cmd-wholesale',
      title: 'Open Wholesale B2B Institutional Procurement',
      category: 'Wholesale B2B',
      icon: 'business_center',
      action: () => {
        onNavigate('wholesale');
        onClose();
      },
    },
    {
      id: 'cmd-admin-panel',
      title: 'Open Admin Console & Escrow Risk Deck',
      category: 'Governance',
      icon: 'admin_panel_settings',
      action: () => {
        onNavigate('admin-panel');
        onClose();
      },
    },
    {
      id: 'cmd-farmer-portal',
      title: 'Open Farmer & Grower Management Portal',
      category: 'Navigation',
      icon: 'agriculture',
      action: () => {
        onNavigate('farmer-panel');
        onClose();
      },
    },
    {
      id: 'cmd-support-desk',
      title: 'Open Customer Support Resolution Deck',
      category: 'Navigation',
      icon: 'support_agent',
      action: () => {
        onNavigate('support-panel');
        onClose();
      },
    },
    {
      id: 'cmd-audit-trail',
      title: 'View Searchable Security Audit Trail & Diffs',
      category: 'Governance',
      icon: 'history_edu',
      action: () => {
        onTriggerAction('open-audit-trail');
        onClose();
      },
    },
    {
      id: 'cmd-kill-switch',
      title: 'Emergency Kill Switch & Maintenance Mode',
      category: 'Governance',
      icon: 'bolt',
      action: () => {
        onTriggerAction('open-kill-switch');
        onClose();
      },
    },
    {
      id: 'cmd-nightly-maintenance',
      title: 'Run Automated Nightly Maintenance & Forecasting',
      category: 'Governance',
      icon: 'auto_mode',
      action: () => {
        onTriggerAction('run-nightly-maintenance');
        onClose();
      },
    },
    {
      id: 'cmd-spin-wheel',
      title: 'Launch Spin-to-Win Lucky Wheel',
      category: 'Tools',
      icon: 'casino',
      action: () => {
        onTriggerAction('open-spin-wheel');
        onClose();
      },
    },
    {
      id: 'cmd-customer-360',
      title: 'Open Customer 360 & Loyalty Drawer',
      category: 'Tools',
      icon: 'person_search',
      action: () => {
        onTriggerAction('open-customer-360');
        onClose();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[75vh]">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">terminal</span>
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or jump to screen... (Cmd + K)"
            className="flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* List of Commands */}
        <div className="p-2 overflow-y-auto space-y-1 flex-1 text-xs">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No matching commands.</div>
          ) : (
            filtered.map((cmd) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                className="p-3 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-800 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{cmd.icon}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">{cmd.title}</span>
                    <span className="text-[10px] text-slate-400">{cmd.category}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-600 text-[16px]">
                  arrow_forward
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Tip: Press <strong>Cmd+K</strong> anywhere to open palette</span>
          <span>Universal Admin Control</span>
        </div>
      </div>
    </div>
  );
};
