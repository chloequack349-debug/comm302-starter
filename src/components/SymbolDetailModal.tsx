import React, { useState, useMemo } from 'react';
import { X, Star, Bell, TrendingUp, TrendingDown, ArrowUpRight, Check, Share2, Compass } from 'lucide-react';
import { MarketAsset, IndexCardData } from '../types/market';
import { NEWS_ITEMS } from '../data/marketData';

interface SymbolDetailModalProps {
  item: MarketAsset | IndexCardData | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: string) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showTradeSuccess, setShowTradeSuccess] = useState<string | null>(null);
  const [sharesInput, setSharesInput] = useState<string>('10');

  const isIndex = 'badgeNumber' in item;
  const isUp = item.change >= 0;

  // Generate synthetic chart data based on timeframe
  const chartPoints = useMemo(() => {
    const base = item.price;
    const count = timeframe === '1D' ? 30 : timeframe === '5D' ? 40 : 50;
    const points: { label: string; price: number }[] = [];
    let current = isUp ? base * 0.97 : base * 1.03;

    for (let i = 0; i < count; i++) {
      const step = (Math.random() - 0.48) * (base * 0.006);
      current += step;
      if (i === count - 1) current = base; // end at current price

      let label = '';
      if (timeframe === '1D') {
        const h = 9 + Math.floor((i / count) * 7);
        const m = Math.floor(((i / count) * 420) % 60);
        label = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} EST`;
      } else if (timeframe === '5D') {
        label = `Day ${Math.floor(i / 8) + 1} 1${i % 8}:00`;
      } else {
        label = `Oct ${i + 1}`;
      }

      points.push({ label, price: Math.max(0.01, current) });
    }
    return points;
  }, [item.price, timeframe, isUp]);

  const activePoint = hoverIndex !== null ? chartPoints[hoverIndex] : chartPoints[chartPoints.length - 1];
  const displayPrice = activePoint ? activePoint.price : item.price;

  // SVG Chart bounds
  const minPrice = Math.min(...chartPoints.map((p) => p.price));
  const maxPrice = Math.max(...chartPoints.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth = 720;
  const chartHeight = 240;
  const paddingX = 20;
  const paddingY = 20;

  const pathCoords = chartPoints.map((p, idx) => {
    const x = paddingX + (idx / (chartPoints.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - ((p.price - minPrice) / priceRange) * (chartHeight - 2 * paddingY);
    return { x, y, ...p };
  });

  const linePath = pathCoords.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const areaPath = `${linePath} L ${pathCoords[pathCoords.length - 1].x} ${chartHeight} L ${pathCoords[0].x} ${chartHeight} Z`;

  const handleSimulateTrade = (side: 'BUY' | 'SELL') => {
    const qty = parseInt(sharesInput) || 1;
    const totalCost = (qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setShowTradeSuccess(`Successfully executed ${side} order for ${qty} ${item.symbol} at $${item.price.toFixed(2)} ($${totalCost})`);
    setTimeout(() => setShowTradeSuccess(null), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#e0e3eb] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e3eb] bg-[#f8f9fd]">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-base shadow-xs"
              style={{
                backgroundColor: isIndex
                  ? (item as IndexCardData).badgeColor
                  : (item as MarketAsset).color || '#131722',
              }}
            >
              {isIndex ? (item as IndexCardData).badgeNumber : (item as MarketAsset).avatarText || item.symbol.charAt(0)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#131722]">{item.symbol}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f0f3fa] text-[#434651]">
                  {isIndex ? `${(item as IndexCardData).exchangeCode} • ${(item as IndexCardData).country}` : (item as MarketAsset).category}
                </span>
              </div>
              <p className="text-xs text-[#787b86] font-medium">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(item.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-[#fff8ea] border-[#f7931a]/40 text-[#f7931a]'
                  : 'bg-white border-[#e0e3eb] text-[#787b86] hover:text-[#131722]'
              }`}
              title="Watchlist"
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#f7931a]' : ''}`} />
            </button>
            <button
              onClick={() => alert(`Price alert created for ${item.symbol}!`)}
              className="p-2 rounded-lg border border-[#e0e3eb] bg-white text-[#787b86] hover:text-[#131722] transition-colors cursor-pointer"
              title="Set Alert"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert(`Direct link copied for ${item.symbol}!`);
              }}
              className="p-2 rounded-lg border border-[#e0e3eb] bg-white text-[#787b86] hover:text-[#131722] transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#e0e3eb] bg-white text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Toast Notification */}
          {showTradeSuccess && (
            <div className="p-3 bg-[#e6f7f3] border border-[#089981]/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#089981] animate-in fade-in slide-in-from-top-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{showTradeSuccess}</span>
            </div>
          )}

          {/* Pricing & Timeframe Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tabular-nums text-[#131722]">
                  {item.symbol.includes('USD') && item.price < 5
                    ? displayPrice.toFixed(5)
                    : displayPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </span>
                <span
                  className={`flex items-center text-sm font-bold tabular-nums ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {isUp ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)} (
                  {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`})
                </span>
              </div>
              <p className="text-xs text-[#787b86] mt-0.5">
                {activePoint ? activePoint.label : 'Real-time Quote • Market Open'}
              </p>
            </div>

            {/* Timeframe Chips */}
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-lg">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-[#131722] shadow-2xs'
                      : 'text-[#787b86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="relative border border-[#e0e3eb] rounded-xl p-4 bg-white overflow-hidden shadow-2xs">
            <svg
              className="w-full h-56 overflow-visible cursor-crosshair"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, (mouseX - paddingX) / (rect.width - 2 * paddingX)));
                const idx = Math.round(ratio * (chartPoints.length - 1));
                setHoverIndex(idx);
              }}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? '#089981' : '#f23645'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isUp ? '#089981' : '#f23645'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map((pct, i) => (
                <line
                  key={i}
                  x1={paddingX}
                  y1={chartHeight * pct}
                  x2={chartWidth - paddingX}
                  y2={chartHeight * pct}
                  stroke="#f0f3fa"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area Under Line */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Main Line */}
              <path
                d={linePath}
                fill="none"
                stroke={isUp ? '#089981' : '#f23645'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Cursor Vertical Line & Dot */}
              {hoverIndex !== null && pathCoords[hoverIndex] && (
                <>
                  <line
                    x1={pathCoords[hoverIndex].x}
                    y1={paddingY}
                    x2={pathCoords[hoverIndex].x}
                    y2={chartHeight - paddingY}
                    stroke="#787b86"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={pathCoords[hoverIndex].x}
                    cy={pathCoords[hoverIndex].y}
                    r="5"
                    fill={isUp ? '#089981' : '#f23645'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                </>
              )}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoverIndex !== null && pathCoords[hoverIndex] && (
              <div
                className="absolute top-2 pointer-events-none bg-[#131722] text-white text-xs px-2.5 py-1 rounded shadow-lg transition-transform"
                style={{
                  left: `${(pathCoords[hoverIndex].x / chartWidth) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="font-bold tabular-nums">${pathCoords[hoverIndex].price.toFixed(2)}</div>
                <div className="text-[10px] text-[#d1d4dc]">{pathCoords[hoverIndex].label}</div>
              </div>
            )}
          </div>

          {/* Quick Simulated Trading & Order Bar */}
          <div className="p-4 bg-[#f8f9fd] rounded-xl border border-[#e0e3eb] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#131722] uppercase tracking-wider">
                Simulate Order:
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={sharesInput}
                  onChange={(e) => setSharesInput(e.target.value)}
                  className="w-16 px-2 py-1 text-xs border border-[#e0e3eb] rounded-md bg-white text-center font-bold"
                />
                <span className="text-xs text-[#787b86]">Units</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleSimulateTrade('SELL')}
                className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-[#f23645] bg-[#fdecee] hover:bg-[#fad8db] border border-[#f23645]/30 rounded-lg transition-colors cursor-pointer"
              >
                Sell {item.symbol}
              </button>
              <button
                onClick={() => handleSimulateTrade('BUY')}
                className="flex-1 sm:flex-none px-6 py-2 text-xs font-bold text-white bg-[#089981] hover:bg-[#07806c] rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Buy {item.symbol}
              </button>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h4 className="text-sm font-bold text-[#131722] mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#2962ff]" />
              <span>Key Statistics</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#e0e3eb]">
                <span className="text-[11px] text-[#787b86] block">52-Week Range</span>
                <span className="text-xs font-bold text-[#131722] tabular-nums mt-1 block">
                  ${(item.price * 0.72).toFixed(2)} - ${(item.price * 1.15).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#e0e3eb]">
                <span className="text-[11px] text-[#787b86] block">Volume</span>
                <span className="text-xs font-bold text-[#131722] tabular-nums mt-1 block">
                  {'volume' in item ? (item as MarketAsset).volume : '124.5M'}
                </span>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#e0e3eb]">
                <span className="text-[11px] text-[#787b86] block">Market Cap</span>
                <span className="text-xs font-bold text-[#131722] tabular-nums mt-1 block">
                  {'marketCap' in item ? (item as MarketAsset).marketCap || '—' : '$4.2T'}
                </span>
              </div>
              <div className="p-3 bg-[#f8f9fd] rounded-xl border border-[#e0e3eb]">
                <span className="text-[11px] text-[#787b86] block">Technical Rating</span>
                <span className="text-xs font-bold text-[#089981] mt-1 block">
                  {'technicalRating' in item ? (item as MarketAsset).technicalRating : 'Strong Buy'}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Sector */}
          {'description' in item && (item as MarketAsset).description && (
            <div className="p-4 rounded-xl border border-[#e0e3eb] bg-white">
              <span className="text-xs font-bold text-[#131722] block mb-1">Company Overview</span>
              <p className="text-xs text-[#434651] leading-relaxed">
                {(item as MarketAsset).description}
              </p>
            </div>
          )}

          {/* Latest News & Analysis */}
          <div>
            <h4 className="text-sm font-bold text-[#131722] mb-3">Latest News &amp; Headlines</h4>
            <div className="space-y-2">
              {NEWS_ITEMS.map((news, idx) => (
                <div
                  key={idx}
                  onClick={() => alert(`Opening article: "${news.title}"`)}
                  className="p-3 rounded-xl border border-[#e0e3eb] hover:bg-[#f8f9fd] hover:border-[#d1d4dc] transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#131722] hover:text-[#2962ff] transition-colors">
                      {news.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-[#787b86] mt-1">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#787b86] flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
