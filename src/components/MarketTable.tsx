import React, { useState } from 'react';
import { ChevronRight, Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { MarketAsset, MoversFilter, TechnicalRating } from '../types/market';

interface MarketTableProps {
  assets: MarketAsset[];
  activeFilter: MoversFilter;
  onChangeFilter: (filter: MoversFilter) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onToggleWatchlist: (assetId: string, e: React.MouseEvent) => void;
  watchlistIds: Set<string>;
  onExploreScreeners: () => void;
  recentTickSymbol?: string;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'change' | 'volume' | 'marketCap';

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  activeFilter,
  onChangeFilter,
  onSelectAsset,
  onToggleWatchlist,
  watchlistIds,
  onExploreScreeners,
  recentTickSymbol,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter based on MoversFilter
  let filtered = [...assets];
  if (activeFilter === 'gainers') {
    filtered = filtered.filter((a) => a.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
  } else if (activeFilter === 'losers') {
    filtered = filtered.filter((a) => a.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
  } else {
    // Most active: sort by raw volume
    filtered = filtered.sort((a, b) => b.rawVolume - a.rawVolume);
  }

  // Handle column sorting
  if (sortField) {
    filtered.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortField === 'symbol') {
        valA = a.symbol;
        valB = b.symbol;
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortField === 'changePercent') {
        valA = a.changePercent;
        valB = b.changePercent;
      } else if (sortField === 'change') {
        valA = a.change;
        valB = b.change;
      } else if (sortField === 'volume') {
        valA = a.rawVolume;
        valB = b.rawVolume;
      } else if (sortField === 'marketCap') {
        const parseCap = (c?: string) => {
          if (!c || c === '—') return 0;
          if (c.includes('T')) return parseFloat(c.replace(/[^0-9.]/g, '')) * 1e12;
          if (c.includes('B')) return parseFloat(c.replace(/[^0-9.]/g, '')) * 1e9;
          if (c.includes('M')) return parseFloat(c.replace(/[^0-9.]/g, '')) * 1e6;
          return 0;
        };
        valA = parseCap(a.marketCap);
        valB = parseCap(b.marketCap);
      }

      return sortDirection === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'desc') setSortDirection('asc');
      else {
        setSortField(null);
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#787b86]/50 opacity-0 group-hover/th:opacity-100 transition-opacity ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#2962ff] ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#2962ff] ml-1" />
    );
  };

  const renderRatingBadge = (rating: TechnicalRating) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#e6f7f3] text-[#089981] border border-[#089981]/20">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#e6f7f3] text-[#089981] border border-[#089981]/20">
            Buy
          </span>
        );
      case 'Neutral':
        return (
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#f0f3fa] text-[#434651] border border-[#e0e3eb]">
            Neutral
          </span>
        );
      case 'Sell':
        return (
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#fdecee] text-[#f23645] border border-[#f23645]/20">
            Sell
          </span>
        );
      case 'Strong Sell':
        return (
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#fdecee] text-[#f23645] border border-[#f23645]/30">
            Strong Sell
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4" data-purpose="market-trending-table-container">
      {/* Sub-header for Data Table */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#131722] tracking-tight">Active Market Leaders</h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            High-volume securities, currencies, and cryptocurrencies tracking global momentum
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 bg-[#f0f3fa] p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => onChangeFilter('active')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-white text-[#131722] shadow-2xs'
                : 'text-[#787b86] hover:text-[#131722]'
            }`}
          >
            Most active
          </button>
          <button
            onClick={() => onChangeFilter('gainers')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeFilter === 'gainers'
                ? 'bg-white text-[#131722] shadow-2xs'
                : 'text-[#787b86] hover:text-[#131722]'
            }`}
          >
            Top gainers
          </button>
          <button
            onClick={() => onChangeFilter('losers')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeFilter === 'losers'
                ? 'bg-white text-[#131722] shadow-2xs'
                : 'text-[#787b86] hover:text-[#131722]'
            }`}
          >
            Top losers
          </button>
        </div>
      </div>

      {/* Financial Data Table Container */}
      <div className="overflow-x-auto border border-[#e0e3eb] rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left border-collapse" id="markets-table">
          <thead>
            <tr className="border-b border-[#e0e3eb] text-[11px] font-semibold text-[#787b86] uppercase tracking-wider bg-[#f8f9fd]">
              <th
                className="py-3 pl-4 pr-6 cursor-pointer group/th select-none"
                onClick={() => handleSort('symbol')}
                scope="col"
              >
                <div className="inline-flex items-center">
                  <span>Symbol / Name</span>
                  {getSortIcon('symbol')}
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer group/th select-none"
                onClick={() => handleSort('price')}
                scope="col"
              >
                <div className="inline-flex items-center justify-end w-full">
                  <span>Price</span>
                  {getSortIcon('price')}
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer group/th select-none"
                onClick={() => handleSort('changePercent')}
                scope="col"
              >
                <div className="inline-flex items-center justify-end w-full">
                  <span>Chg %</span>
                  {getSortIcon('changePercent')}
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer group/th select-none"
                onClick={() => handleSort('change')}
                scope="col"
              >
                <div className="inline-flex items-center justify-end w-full">
                  <span>Chg</span>
                  {getSortIcon('change')}
                </div>
              </th>
              <th className="py-3 px-4 text-center" scope="col">
                Technical Rating
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer group/th select-none"
                onClick={() => handleSort('volume')}
                scope="col"
              >
                <div className="inline-flex items-center justify-end w-full">
                  <span>Volume</span>
                  {getSortIcon('volume')}
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer group/th select-none"
                onClick={() => handleSort('marketCap')}
                scope="col"
              >
                <div className="inline-flex items-center justify-end w-full">
                  <span>Market Cap</span>
                  {getSortIcon('marketCap')}
                </div>
              </th>
              <th className="py-3 pl-4 pr-6 text-center" scope="col">
                Chart
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e3eb] text-sm">
            {filtered.map((item) => {
              const isUp = item.change >= 0;
              const isWatchlisted = watchlistIds.has(item.id);
              const isTicked = recentTickSymbol === item.symbol;

              // Generate SVG sparkline points
              const sparklineCoords = item.sparkline;
              const min = Math.min(...sparklineCoords);
              const max = Math.max(...sparklineCoords);
              const range = max - min || 1;
              const svgPoints = sparklineCoords
                .map((val, idx) => {
                  const x = 2 + (idx / (sparklineCoords.length - 1)) * 96;
                  const y = 20 - ((val - min) / range) * 16;
                  return `${x.toFixed(1)} ${y.toFixed(1)}`;
                })
                .join(' L ');

              // Format price with appropriate decimals (forex vs stocks vs crypto)
              const formatPrice = (val: number, sym: string) => {
                if (sym.includes('USD') && val < 5) {
                  return val.toFixed(5);
                }
                return val.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
              };

              const formatChg = (val: number, sym: string) => {
                const sign = val > 0 ? '+' : '';
                if (sym.includes('USD') && Math.abs(val) < 1 && val !== 0) {
                  return `${sign}${val.toFixed(5)}`;
                }
                return `${sign}${val.toFixed(2)}`;
              };

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectAsset(item)}
                  className={`hover:bg-[#f8f9fd] transition-colors cursor-pointer group select-none ${
                    isTicked ? (isUp ? 'animate-flash-up' : 'animate-flash-down') : ''
                  }`}
                >
                  {/* Symbol & Name */}
                  <td className="py-3.5 pl-4 pr-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => onToggleWatchlist(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all text-[#787b86] hover:text-[#f7931a] p-1 -ml-1 cursor-pointer"
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isWatchlisted ? 'fill-[#f7931a] text-[#f7931a] !opacity-100' : ''
                          }`}
                        />
                      </button>

                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.avatarText || item.symbol.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="block text-xs text-[#787b86] truncate max-w-[140px] sm:max-w-[200px]">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-semibold tabular-nums text-[#131722]">
                    {item.category === 'Forex' ? '' : '$'}
                    {formatPrice(item.price, item.symbol)}
                  </td>

                  {/* Change % */}
                  <td
                    className={`py-3.5 px-4 text-right font-semibold tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                  </td>

                  {/* Change */}
                  <td
                    className={`py-3.5 px-4 text-right font-semibold tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {formatChg(item.change, item.symbol)}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-3.5 px-4 text-center">
                    {renderRatingBadge(item.technicalRating)}
                  </td>

                  {/* Volume */}
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#434651]">
                    {item.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#434651]">
                    {item.marketCap || '—'}
                  </td>

                  {/* Sparkline Chart */}
                  <td className="py-3.5 pl-4 pr-6 text-center">
                    <svg
                      className={`w-20 h-5 ${isUp ? 'text-[#089981]' : 'text-[#f23645]'} stroke-current mx-auto`}
                      fill="none"
                      viewBox="0 0 100 24"
                    >
                      <path
                        d={`M ${svgPoints}`}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Bottom Helper / More Button */}
      <div className="pt-3 flex justify-center">
        <button
          onClick={onExploreScreeners}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#2962ff] hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          <span>Explore all markets &amp; screeners</span>
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </section>
  );
};
