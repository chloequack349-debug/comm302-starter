import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-br from-[#131722] to-[#2962ff] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>30-Day Free Pro Access</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Supercharge your market edge</h2>
          <p className="text-xs text-white/80 mt-1 max-w-sm">
            Join millions of traders tracking global assets with institutional-grade charts, real-time data, and alerts.
          </p>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#e6f7f3] text-[#089981] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold text-[#131722]">Welcome to TradingView Pro!</h3>
              <p className="text-xs text-[#787b86]">
                Your trial account has been activated for <span className="font-semibold text-[#131722]">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                {[
                  'Zero-delay real-time US and global market feeds',
                  '100+ pre-built technical indicators & volume profile',
                  'Multi-chart layouts with custom watchlists & sync',
                  'Instant price and indicator alerts via push & email',
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#434651]">
                    <div className="w-4 h-4 rounded-full bg-[#e6f7f3] text-[#089981] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-[#131722] mb-1">
                  Work or personal email
                </label>
                <input
                  type="email"
                  required
                  placeholder="trader@tradingview.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#e0e3eb] rounded-xl focus:border-[#2962ff] focus:ring-2 focus:ring-[#2962ff]/20 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-[#2962ff] via-[#4954f9] to-[#9929ea] hover:brightness-105 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Start free 30-day trial
              </button>

              <p className="text-[11px] text-center text-[#787b86]">
                No credit card required. Cancel anytime with one click.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
