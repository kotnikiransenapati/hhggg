import React, { useState } from 'react';
import { adminGovernanceService } from '../../services/adminGovernanceService';
import { AuditLogEntry } from '../../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const logs: AuditLogEntry[] = adminGovernanceService.getAuditLogs(query);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">Searchable Audit Trail &amp; Field Diffs</h3>
              <span className="text-[10px] bg-slate-900 text-white font-mono px-2 py-0.5 rounded-full">
                PII Redacted
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger tracking role mutations, escrow releases, KYC approvals, and emergency switches.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer border border-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search audit actions by keyword, entity, actor role, or diff..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50"
          />
        </div>

        {/* Logs List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{log.entityId}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
              </div>

              <p className="text-slate-800 font-medium">{log.diffSummary}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                <span>Actor: {log.actorRole} ({log.actorEmail})</span>
                <span>Target: {log.targetEntity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
