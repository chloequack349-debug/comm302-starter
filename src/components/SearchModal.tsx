import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MarketAsset, IndexCardData, MarketCategory } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  indices: IndexCardData[];
  onSelect: (item: MarketAsset | IndexCardData) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  indices,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Combine items for searching
  const allItems: (MarketAsset | IndexCardData)[] = [
    ...indices,
    ...assets,
  ];

  const filteredItems = allItems.filter((item) => {
    const sym = item.symbol.toLowerCase();
    const name = item.name.toLowerCase();
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || sym.includes(q) || name.includes(q);

    if (!matchesQuery) return false;
    if (activeCategory === 'All') return true;

    if ('category' in item) {
      return (item as MarketAsset).category === activeCategory;
    } else {
      return activeCategory === 'Indices';
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e0e3eb] gap-3">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, stocks, indices, crypto, forex..."
            className="flex-1 bg-transparent border-none outline-none text-base text-[#131722] placeholder:text-[#787b86]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787b86] hover:text-[#131722] rounded-full hover:bg-[#f0f3fa] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-medium text-[#787b86] bg-[#f0f3fa] border border-[#e0e3eb] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#e0e3eb] bg-[#f8f9fd] overflow-x-auto no-scrollbar">
          {['All', 'Stocks', 'Indices', 'Crypto', 'Forex', 'Futures', 'Bonds'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#131722] text-white shadow-2xs'
                  : 'text-[#787b86] hover:text-[#131722] hover:bg-[#e0e3eb]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#f0f3fa] p-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#787b86]">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-[#787b86]/80">Try searching for AAPL, NVDA, SPX, or BTC</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isUp = item.change >= 0;
              const isIndex = 'badgeNumber' in item;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#f0f3fa]' : 'hover:bg-[#f8f9fd]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0"
                      style={{
                        backgroundColor: isIndex
                          ? (item as IndexCardData).badgeColor
                          : (item as MarketAsset).color || '#131722',
                      }}
                    >
                      {isIndex ? (item as IndexCardData).badgeNumber : (item as MarketAsset).avatarText || item.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#131722] text-sm">{item.symbol}</span>
                        <span className="text-[10px] font-semibold text-[#787b86] bg-white border border-[#e0e3eb] px-1.5 py-0.5 rounded">
                          {isIndex ? 'Index' : (item as MarketAsset).category}
                        </span>
                      </div>
                      <span className="text-xs text-[#787b86] truncate max-w-[220px] block">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums text-[#131722]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums flex items-center justify-end ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#f8f9fd] border-t border-[#e0e3eb] text-[11px] text-[#787b86] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="font-bold">↑</kbd> <kbd className="font-bold">↓</kbd></span>
            <span>Select: <kbd className="font-bold">↵</kbd></span>
          </div>
          <span>TradingView Markets</span>
        </div>
      </div>
    </div>
  );
};
