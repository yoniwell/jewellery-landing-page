import React, { useState } from 'react';
import { Gem, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

interface AdminLoginPageProps {
  onLoginSuccess: (user: any) => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [email, setEmail] = useState('admin@abelgemstone.com');
  const [password, setPassword] = useState('AbelGemstone2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.login(email, password);
      if (response.success) {
        onLoginSuccess(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@abelgemstone.com');
    setPassword('AbelGemstone2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-mono font-semibold text-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
            <Gem className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wider text-slate-900">
            ABEL GEMSTONE
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-700 font-bold">
            EXECUTIVE DEALER & CMS PORTAL
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl">
          
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900">
                Dealer Authentication
              </h2>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Authorized Personnel & Gemologists
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-amber-700">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1.5">
                Executive Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abelgemstone.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 text-xs text-slate-900 outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 text-xs text-slate-900 outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-heading text-xs uppercase tracking-widest font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating Terminal...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Executive Dashboard</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Preset Credentials:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-amber-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Fill Executive Demo</span>
            </button>
          </div>

        </div>

        {/* Security Footer Note */}
        <div className="mt-6 text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>256-Bit Encrypted Wholesale CMS Session</span>
        </div>

      </div>

    </div>
  );
};
