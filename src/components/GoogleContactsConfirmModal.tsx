import React from 'react';

interface GoogleContactsConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType: 'create' | 'delete';
  itemName: string;
  isProcessing?: boolean;
}

export const GoogleContactsConfirmModal: React.FC<GoogleContactsConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType,
  itemName,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              actionType === 'delete'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {actionType === 'delete' ? 'delete_forever' : 'person_add'}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Google Workspace People API</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
          <p className="font-semibold text-slate-900">Target Contact:</p>
          <p className="font-medium text-emerald-800 bg-white p-2 rounded-lg border border-slate-200">
            {itemName}
          </p>
          <p className="text-slate-600 mt-2">{description}</p>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">info</span>
          <span>
            {actionType === 'delete'
              ? 'This will permanently remove the contact from your Google Contacts address book with your explicit consent.'
              : 'This will add this contact entry into your personal Google Contacts account with permission.'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
              actionType === 'delete'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            } disabled:opacity-50`}
          >
            {isProcessing && (
              <span className="material-symbols-outlined text-[16px] animate-spin">
                progress_activity
              </span>
            )}
            <span>
              {isProcessing
                ? 'Processing...'
                : actionType === 'delete'
                ? 'Confirm Delete'
                : 'Confirm & Add to Google Contacts'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
