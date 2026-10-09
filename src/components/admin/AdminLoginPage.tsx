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
    <div className="min-h-screen bg-[#05080D] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#D6A83F]/30">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#0B2745]/60 via-[#071522]/40 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#D6A83F]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#071522] border border-[#0B2745] hover:border-[#D6A83F]/40 text-xs font-mono text-[#A7ADB5] hover:text-[#F7F5EF] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B2745] to-[#071522] border border-[#D6A83F]/50 flex items-center justify-center mx-auto shadow-2xl">
            <Gem className="w-7 h-7 text-[#F0D27A]" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wider text-[#F7F5EF]">
            ABEL GEMSTONE
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D6A83F]">
            EXECUTIVE DEALER & CMS PORTAL
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-2xl bg-[#071522]/95 border border-[#D6A83F]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          <div className="mb-6 flex items-center justify-between border-b border-[#0B2745] pb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-[#F7F5EF]">
                Dealer Authentication
              </h2>
              <p className="text-[11px] text-[#A7ADB5] font-mono mt-0.5">
                Authorized Personnel & Gemologists
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#05080D] border border-[#D6A83F]/30 flex items-center justify-center text-[#F0D27A]">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs font-mono text-[#ef4444] flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1.5">
                Executive Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A7ADB5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abelgemstone.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A7ADB5] mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#A7ADB5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#05080D] border border-[#0B2745] focus:border-[#D6A83F] text-xs text-[#F7F5EF] outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7ADB5] hover:text-[#F7F5EF] cursor-pointer"
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
                className="w-full py-3 rounded-lg font-heading text-xs uppercase tracking-widest font-bold text-[#05080D] bg-gradient-to-r from-[#D6A83F] via-[#F0D27A] to-[#D6A83F] hover:shadow-[0_0_25px_rgba(214,168,63,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="mt-6 pt-4 border-t border-[#0B2745] flex items-center justify-between text-[11px] font-mono text-[#A7ADB5]">
            <span>Preset Credentials:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#D6A83F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Fill Executive Demo</span>
            </button>
          </div>

        </div>

        {/* Security Footer Note */}
        <div className="mt-6 text-center text-[11px] font-mono text-[#A7ADB5]/60 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D6A83F]" />
          <span>256-Bit Encrypted Wholesale CMS Session</span>
        </div>

      </div>

    </div>
  );
};
