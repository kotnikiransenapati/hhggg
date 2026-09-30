import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, signInWithGoogle, signInWithRole, signInWithEmail, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'methods' | 'email'>('methods');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleRoleSignIn = async (role: 'customer' | 'farmer' | 'admin' | 'wholesaler') => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithRole(role);
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Role sign-in error:', err);
      setError('Failed to initialize role session');
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(emailInput, nameInput);
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError('Failed to sign in with email');
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center relative space-y-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors font-bold"
        >
          ✕
        </button>

        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-[24px]">eco</span>
        </div>

        {user ? (
          /* Logged In State */
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Active Patron Account
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {user.displayName || 'Authenticated User'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <p className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Verified Direct-to-Consumer Account</span>
              </p>
              <p className="text-[11px] text-slate-500">
                All order escrow settlements and KYC records sync directly to Cloud Firestore.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Logged Out / Sign In State */
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                User Authentication
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Sign In to FarmDirect
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                Authenticate with your real account to track single-origin farm orders, earn harvest reward points, and manage delivery addresses.
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {authMode === 'methods' ? (
              <div className="space-y-3">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isLoading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                    Or Instant Role Sign-In
                  </span>
                </div>

                {/* 1-Click Role Accounts */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => handleRoleSignIn('customer')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                      <span className="material-symbols-outlined text-[15px] text-emerald-700">person</span>
                      <span>Patron User</span>
                    </div>
                    <p className="text-[10px] text-emerald-800 mt-0.5">Priya Sharma (Buyer)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSignIn('farmer')}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                      <span className="material-symbols-outlined text-[15px] text-amber-700">agriculture</span>
                      <span>Farmer Lead</span>
                    </div>
                    <p className="text-[10px] text-amber-800 mt-0.5">Ramesh Patel (Grower)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSignIn('admin')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-purple-950 text-xs">
                      <span className="material-symbols-outlined text-[15px] text-purple-700">admin_panel_settings</span>
                      <span>Admin Officer</span>
                    </div>
                    <p className="text-[10px] text-purple-800 mt-0.5">Aditi Roy (Governance)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSignIn('wholesaler')}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-blue-950 text-xs">
                      <span className="material-symbols-outlined text-[15px] text-blue-700">corporate_fare</span>
                      <span>Wholesale B2B</span>
                    </div>
                    <p className="text-[10px] text-blue-800 mt-0.5">Taj Luxury Procurement</p>
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode('email')}
                    className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    Sign in with Custom Email
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    Browse as Guest
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailSignIn} className="space-y-3 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Vikramaditya Sen"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('methods')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
