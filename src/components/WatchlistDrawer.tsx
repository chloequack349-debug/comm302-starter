import React from 'react';
import { X, Trash2, ArrowUpRight, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { MarketAsset, IndexCardData } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistItems: (MarketAsset | IndexCardData)[];
  onRemove: (id: string) => void;
  onSelect: (item: MarketAsset | IndexCardData) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistItems,
  onRemove,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#e0e3eb] flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e0e3eb] bg-[#f8f9fd]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#f7931a] fill-[#f7931a]" />
            <h3 className="text-base font-bold text-[#131722]">My Watchlist</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e0e3eb] text-[#434651]">
              {watchlistItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-[#e0e3eb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {watchlistItems.length === 0 ? (
            <div className="text-center py-16 text-[#787b86] px-4">
              <Star className="w-12 h-12 mx-auto text-[#d1d4dc] stroke-1 mb-2" />
              <p className="text-sm font-semibold text-[#131722]">Your watchlist is empty</p>
              <p className="text-xs mt-1 text-[#787b86]">
                Click the star icon next to any symbol in the market table or detail modal to save it here.
              </p>
            </div>
          ) : (
            watchlistItems.map((item) => {
              const isUp = item.change >= 0;
              const isIndex = 'badgeNumber' in item;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-[#e0e3eb] hover:bg-[#f8f9fd] hover:border-[#d1d4dc] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0"
                      style={{
                        backgroundColor: isIndex
                          ? (item as IndexCardData).badgeColor
                          : (item as MarketAsset).color || '#131722',
                      }}
                    >
                      {isIndex ? (item as IndexCardData).badgeNumber : (item as MarketAsset).avatarText || item.symbol.charAt(0)}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors flex items-center gap-1.5">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-[150px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#787b86] hover:text-[#f23645] hover:bg-[#fdecee] rounded-lg transition-all"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom helper */}
        <div className="p-4 border-t border-[#e0e3eb] bg-[#f8f9fd] flex items-center justify-between text-xs text-[#787b86]">
          <span>Synced with local session</span>
          <button
            onClick={() => watchlistItems.forEach((item) => onRemove(item.id))}
            disabled={watchlistItems.length === 0}
            className="text-xs text-[#f23645] hover:underline disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};
