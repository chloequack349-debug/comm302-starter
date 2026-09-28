import React, { useState } from 'react';
import { X, Filter, SlidersHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react';
import { MarketAsset, MarketCategory, TechnicalRating } from '../types/market';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = assets.filter((asset) => {
    if (selectedCategory !== 'All' && asset.category !== selectedCategory) return false;
    if (selectedRating !== 'All' && asset.technicalRating !== selectedRating) return false;
    if (minPrice && asset.price < parseFloat(minPrice)) return false;
    if (maxPrice && asset.price > parseFloat(maxPrice)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!asset.symbol.toLowerCase().includes(q) && !asset.name.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e0e3eb] bg-[#f8f9fd]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#2962ff]" />
            <div>
              <h3 className="text-lg font-bold text-[#131722]">Global Markets Screener</h3>
              <p className="text-xs text-[#787b86]">Filter multi-asset securities with custom technical and fundamental parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-[#e0e3eb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-[#e0e3eb] bg-white grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[#787b86] font-semibold mb-1">Asset Class</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-[#e0e3eb] rounded-lg bg-[#f8f9fd] text-[#131722] font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Stocks">Stocks</option>
              <option value="Crypto">Crypto</option>
              <option value="Forex">Forex</option>
              <option value="Futures">Futures</option>
              <option value="Bonds">Bonds</option>
            </select>
          </div>

          <div>
            <label className="block text-[#787b86] font-semibold mb-1">Technical Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full p-2 border border-[#e0e3eb] rounded-lg bg-[#f8f9fd] text-[#131722] font-medium"
            >
              <option value="All">All Ratings</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Neutral">Neutral</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div>
            <label className="block text-[#787b86] font-semibold mb-1">Search Keyword</label>
            <input
              type="text"
              placeholder="e.g. NVDA, Apple, Tech"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-[#e0e3eb] rounded-lg bg-[#f8f9fd] text-[#131722]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRating('All');
                setMinPrice('');
                setMaxPrice('');
                setSearchQuery('');
              }}
              className="w-full py-2 px-3 bg-[#f0f3fa] hover:bg-[#e0e3eb] text-[#131722] font-semibold rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-5 py-2.5 bg-[#f8f9fd] border-b border-[#e0e3eb] text-xs font-semibold text-[#787b86] flex items-center justify-between">
          <span>Found {filtered.length} matching securities</span>
          <span>Click any row to open full chart &amp; financials</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e0e3eb] text-[#787b86] uppercase font-semibold bg-[#f8f9fd]">
                <th className="py-2.5 px-4">Symbol</th>
                <th className="py-2.5 px-4 text-right">Price</th>
                <th className="py-2.5 px-4 text-right">Chg %</th>
                <th className="py-2.5 px-4 text-center">Rating</th>
                <th className="py-2.5 px-4 text-right">Volume</th>
                <th className="py-2.5 px-4 text-right">Sector</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb]">
              {filtered.map((item) => {
                const isUp = item.change >= 0;
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      onSelectAsset(item);
                      onClose();
                    }}
                    className="hover:bg-[#f8f9fd] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#131722] text-sm">{item.symbol}</div>
                      <div className="text-[11px] text-[#787b86] truncate max-w-[160px]">{item.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold tabular-nums text-[#131722]">
                      ${item.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-[11px] px-2 py-0.5 rounded bg-[#f0f3fa] text-[#434651]">
                        {item.technicalRating}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#434651]">
                      {item.volume}
                    </td>
                    <td className="py-3 px-4 text-right text-[#787b86] truncate max-w-[140px]">
                      {item.sector || item.category}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[#2962ff] font-semibold flex items-center justify-center gap-0.5">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
