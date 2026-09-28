import React from 'react';
import { Globe, User, Radio, Star, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenGetStarted: () => void;
  onOpenProfile: () => void;
  watchlistCount: number;
  liveUpdatesEnabled: boolean;
  onToggleLiveUpdates: () => void;
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  onOpenGetStarted,
  onOpenProfile,
  watchlistCount,
  liveUpdatesEnabled,
  onToggleLiveUpdates,
  currentLanguage,
  onChangeLanguage,
}) => {
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e0e3eb]" data-purpose="main-navigation">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Search Container */}
        <div className="flex items-center gap-4 flex-1">
          {/* TradingView Symbol Logo */}
          <a
            aria-label="TradingView Home"
            className="flex-shrink-0 flex items-center pr-2 group cursor-pointer"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <svg
              className="h-6 w-9 transition-transform group-hover:scale-105"
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path
                d="M14 22H7V11h7v11zm11-16h-7v16h7V6zm11-6h-7v22h7V0zM0 16h3.5v6H0v-6z"
                fill="#131722"
              />
            </svg>
          </a>

          {/* Quick Search Pill Bar */}
          <div className="relative w-full max-w-[280px]">
            <button
              onClick={onOpenSearch}
              className="flex items-center h-10 w-full rounded-full bg-[#f0f3fa] hover:bg-[#e0e3eb]/80 transition-colors px-3.5 py-1.5 cursor-pointer group text-left"
              title="Search markets (Ctrl+K)"
            >
              <svg
                className="w-4 h-4 text-[#787b86] group-hover:text-[#131722] transition-colors mr-2.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-4.35-4.35M16.65 10.825a5.825 5.825 0 11-11.65 0 5.825 5.825 0 0111.65 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                />
              </svg>
              <span className="text-sm text-[#787b86] group-hover:text-[#434651] font-normal truncate">
                Search
              </span>
              <span className="text-[11px] font-medium text-[#787b86] bg-white border border-[#e0e3eb] px-1.5 py-0.5 rounded ml-auto shadow-xs whitespace-nowrap">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Main Category Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 ml-2 font-medium text-sm">
            <a
              className="px-3 py-2 text-[#131722] hover:text-[#2962ff] rounded-md transition-colors cursor-pointer"
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                onOpenSearch();
              }}
            >
              Products
            </a>
            <a
              className="px-3 py-2 text-[#131722] hover:text-[#2962ff] rounded-md transition-colors cursor-pointer"
              href="#community"
              onClick={(e) => {
                e.preventDefault();
                alert('Welcome to the Community discussions and market ideas feed!');
              }}
            >
              Community
            </a>
            {/* Active Markets Tab */}
            <a
              className="px-3 py-2 text-[#2962ff] font-semibold relative after:content-[''] after:absolute after:bottom-[-13px] after:left-3 after:right-3 after:h-[2px] after:bg-[#2962ff]"
              href="#"
            >
              Markets
            </a>
            <a
              className="px-3 py-2 text-[#131722] hover:text-[#2962ff] rounded-md transition-colors cursor-pointer"
              href="#brokers"
              onClick={(e) => {
                e.preventDefault();
                alert('Integrated brokers: Interactive Brokers, TradeStation, Alpaca, OANDA, and Binance.');
              }}
            >
              Brokers
            </a>
            <a
              className="px-3 py-2 text-[#131722] hover:text-[#2962ff] rounded-md transition-colors cursor-pointer"
              href="#more"
              onClick={(e) => {
                e.preventDefault();
                onOpenWatchlist();
              }}
            >
              More
            </a>
          </nav>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2.5">
          {/* Live Tick Stream Toggle */}
          <button
            onClick={onToggleLiveUpdates}
            title={liveUpdatesEnabled ? 'Pause real-time market ticks' : 'Resume real-time market ticks'}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              liveUpdatesEnabled
                ? 'bg-[#e6f7f3] text-[#089981] border-[#089981]/30 hover:bg-[#d0f3eb]'
                : 'bg-[#f0f3fa] text-[#787b86] border-[#e0e3eb] hover:bg-[#e0e3eb]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveUpdatesEnabled ? 'animate-pulse text-[#089981]' : 'text-[#787b86]'}`} />
            <span>{liveUpdatesEnabled ? 'Live: ON' : 'Live: OFF'}</span>
          </button>

          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            className="relative p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors"
            title="Open Watchlist"
          >
            <Star className="w-4 h-4 text-[#787b86] hover:text-[#131722]" />
            {watchlistCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-semibold text-[#131722] hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-4 h-4 text-[#131722]" />
              <span className="text-xs font-bold tracking-tight">{currentLanguage}</span>
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-36 bg-white border border-[#e0e3eb] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {[
                  { code: 'EN', name: 'English (US)' },
                  { code: 'ES', name: 'Español' },
                  { code: 'DE', name: 'Deutsch' },
                  { code: 'FR', name: 'Français' },
                  { code: 'JA', name: '日本語' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onChangeLanguage(item.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#f0f3fa] ${
                      currentLanguage === item.code ? 'font-bold text-[#2962ff]' : 'text-[#131722]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-[#787b86] font-mono">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar/Icon */}
          <button
            onClick={onOpenProfile}
            className="p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors cursor-pointer"
            title="Sign In or User Account"
          >
            <User className="w-5 h-5 text-[#131722]" />
          </button>

          {/* Primary CTA: Gradient Get Started */}
          <button
            onClick={onOpenGetStarted}
            className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2962ff] via-[#4954f9] to-[#9929ea] hover:brightness-105 active:scale-[0.98] rounded-full transition-all shadow-xs cursor-pointer gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get started</span>
          </button>
        </div>
      </div>
    </header>
  );
};
