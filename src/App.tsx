/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryTabs } from './components/CategoryTabs';
import { IndicesCards } from './components/IndicesCards';
import { MarketTable } from './components/MarketTable';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { ScreenerModal } from './components/ScreenerModal';
import { GetStartedModal } from './components/GetStartedModal';
import { MarketStatusBar } from './components/MarketStatusBar';
import { INITIAL_INDICES, INITIAL_ASSETS } from './data/marketData';
import {
  MarketAsset,
  IndexCardData,
  MarketCategory,
  MoversFilter,
} from './types/market';

export default function App() {
  const [indices, setIndices] = useState<IndexCardData[]>(INITIAL_INDICES);
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_ASSETS);
  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('Overview');
  const [moversFilter, setMoversFilter] = useState<MoversFilter>('active');
  const [currentRegion, setCurrentRegion] = useState<string>('global');

  // Watchlist persistence
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
    return new Set(['nvda', 'btcusd']);
  });

  // Modals state
  const [selectedItem, setSelectedItem] = useState<MarketAsset | IndexCardData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  // Real-time market tick simulation
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(true);
  const [recentTickSymbol, setRecentTickSymbol] = useState<string | undefined>(undefined);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(Array.from(watchlistIds)));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlistIds]);

  // Global hotkey Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time price fluctuation simulation
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      const updateIndex = Math.random() > 0.6;

      if (updateIndex) {
        setIndices((prev) => {
          const randomIndex = Math.floor(Math.random() * prev.length);
          const target = prev[randomIndex];
          const deltaPct = (Math.random() - 0.48) * 0.0015;
          const newPrice = target.price * (1 + deltaPct);
          const priceDiff = newPrice - target.price;

          setRecentTickSymbol(target.symbol);
          setTimeout(() => setRecentTickSymbol(undefined), 800);

          return prev.map((idx, i) => {
            if (i !== randomIndex) return idx;
            const updatedChange = idx.change + priceDiff;
            const updatedPct = (updatedChange / (idx.price - idx.change)) * 100;
            const updatedSparkline = [...idx.sparkline.slice(1), newPrice];

            return {
              ...idx,
              price: newPrice,
              change: updatedChange,
              changePercent: updatedPct,
              sparkline: updatedSparkline,
              isPositive: updatedChange >= 0,
            };
          });
        });
      } else {
        setAssets((prev) => {
          const randomIndex = Math.floor(Math.random() * prev.length);
          const target = prev[randomIndex];
          const deltaPct = (Math.random() - 0.48) * 0.003;
          const newPrice = target.price * (1 + deltaPct);
          const priceDiff = newPrice - target.price;

          setRecentTickSymbol(target.symbol);
          setTimeout(() => setRecentTickSymbol(undefined), 800);

          return prev.map((asset, i) => {
            if (i !== randomIndex) return asset;
            const updatedChange = asset.change + priceDiff;
            const updatedPct = (updatedChange / (asset.price - asset.change)) * 100;
            const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

            return {
              ...asset,
              price: newPrice,
              change: updatedChange,
              changePercent: updatedPct,
              sparkline: updatedSparkline,
            };
          });
        });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [liveUpdatesEnabled]);

  const handleToggleWatchlist = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Filter assets displayed in the table based on selected category tab
  const displayedAssets = useMemo(() => {
    if (currentCategory === 'Overview') {
      return assets;
    }
    return assets.filter((a) => a.category === currentCategory);
  }, [assets, currentCategory]);

  // Items for the watchlist drawer
  const watchlistedItems = useMemo(() => {
    const list: (MarketAsset | IndexCardData)[] = [];
    indices.forEach((idx) => {
      if (watchlistIds.has(idx.id)) list.push(idx);
    });
    assets.forEach((ast) => {
      if (watchlistIds.has(ast.id)) list.push(ast);
    });
    return list;
  }, [indices, assets, watchlistIds]);

  return (
    <div className="min-h-screen bg-white text-[#131722] flex flex-col selection:bg-[#2962ff] selection:text-white">
      {/* Top Global Market Status Bar */}
      <MarketStatusBar />

      {/* Main Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        onOpenProfile={() => setIsGetStartedOpen(true)}
        watchlistCount={watchlistIds.size}
        liveUpdatesEnabled={liveUpdatesEnabled}
        onToggleLiveUpdates={() => setLiveUpdatesEnabled(!liveUpdatesEnabled)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
      />

      {/* Main Content */}
      <main className="max-w-[1440px] w-full mx-auto px-4 lg:px-6 pt-10 pb-16 flex-1">
        {/* Hero Headline */}
        <Hero
          currentRegion={currentRegion}
          onSelectRegion={(reg) => {
            setCurrentRegion(reg);
            if (reg === 'crypto') setCurrentCategory('Crypto');
            else if (reg === 'commodities') setCurrentCategory('Futures');
            else setCurrentCategory('Overview');
          }}
        />

        {/* Market Category Tabs (Overview, Indices, Stocks, Crypto, Forex, Futures, Bonds) */}
        <CategoryTabs
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
        />

        {/* Indices Cards Row */}
        <IndicesCards
          indices={indices}
          onSelectIndex={(index) => setSelectedItem(index)}
          onViewAllIndices={() => setCurrentCategory('Indices')}
          recentTickSymbol={recentTickSymbol}
        />

        {/* Active Market Leaders Section */}
        <MarketTable
          assets={displayedAssets}
          activeFilter={moversFilter}
          onChangeFilter={setMoversFilter}
          onSelectAsset={(asset) => setSelectedItem(asset)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistIds={watchlistIds}
          onExploreScreeners={() => setIsScreenerOpen(true)}
          recentTickSymbol={recentTickSymbol}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e0e3eb] bg-[#f8f9fd] py-10 px-4 lg:px-6 text-xs text-[#787b86]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-8 text-[#131722]" fill="currentColor" viewBox="0 0 36 28">
              <path d="M14 22H7V11h7v11zm11-16h-7v16h7V6zm11-6h-7v22h7V0zM0 16h3.5v6H0v-6z" />
            </svg>
            <span className="font-semibold text-[#131722]">TradingView Markets</span>
            <span className="hidden sm:inline">• Look first / Then leap.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <button
              onClick={() => setIsScreenerOpen(true)}
              className="hover:text-[#2962ff] transition-colors cursor-pointer"
            >
              Stock Screener
            </button>
            <button
              onClick={() => setCurrentCategory('Crypto')}
              className="hover:text-[#2962ff] transition-colors cursor-pointer"
            >
              Crypto Heatmap
            </button>
            <button
              onClick={() => setCurrentCategory('Forex')}
              className="hover:text-[#2962ff] transition-colors cursor-pointer"
            >
              Forex Screener
            </button>
            <button
              onClick={() => setIsWatchlistOpen(true)}
              className="hover:text-[#2962ff] transition-colors cursor-pointer"
            >
              Personal Watchlist
            </button>
            <button
              onClick={() => setIsGetStartedOpen(true)}
              className="hover:text-[#2962ff] transition-colors cursor-pointer text-[#2962ff] font-bold"
            >
              Try Pro Features
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#787b86]/80">
            Quotes delayed or real-time where permitted. © {new Date().getFullYear()} TradingView.
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <SymbolDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isWatchlisted={selectedItem ? watchlistIds.has(selectedItem.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        indices={indices}
        onSelect={(item) => setSelectedItem(item)}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistItems={watchlistedItems}
        onRemove={handleToggleWatchlist}
        onSelect={(item) => setSelectedItem(item)}
      />

      <ScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => setSelectedItem(asset)}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />
    </div>
  );
}
