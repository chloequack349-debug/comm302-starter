import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IndexCardData } from '../types/market';

interface IndicesCardsProps {
  indices: IndexCardData[];
  onSelectIndex: (index: IndexCardData) => void;
  onViewAllIndices: () => void;
  recentTickSymbol?: string;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  indices,
  onSelectIndex,
  onViewAllIndices,
  recentTickSymbol,
}) => {
  return (
    <section className="mb-14" data-purpose="indices-cards-row">
      {/* Section Link Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onViewAllIndices}
          className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors group cursor-pointer bg-transparent border-none p-0"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 text-[#131722] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center text-xs font-semibold text-[#089981] bg-[#e6f7f3] px-2.5 py-1 rounded-full border border-[#089981]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981] mr-1.5 animate-pulse" />
            US Markets Open
          </span>
        </div>
      </div>

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((item) => {
          const isUp = item.change >= 0;
          const isTicked = recentTickSymbol === item.symbol;

          // Render SVG sparkline
          const sparklineCoords = item.sparkline;
          const min = Math.min(...sparklineCoords);
          const max = Math.max(...sparklineCoords);
          const range = max - min || 1;
          const svgPoints = sparklineCoords
            .map((val, idx) => {
              const x = 2 + (idx / (sparklineCoords.length - 1)) * 96;
              const y = 30 - ((val - min) / range) * 24;
              return `${x},${y}`;
            })
            .join(' L ');

          return (
            <article
              key={item.id}
              onClick={() => onSelectIndex(item)}
              className={`p-4 rounded-xl border border-[#e0e3eb] bg-[#f8f9fd]/70 hover:bg-white hover:border-[#d1d4dc] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between h-[134px] group relative overflow-hidden ${
                isTicked ? (isUp ? 'animate-flash-up' : 'animate-flash-down') : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[11px] tracking-tighter shadow-2xs flex-shrink-0"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.badgeNumber}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors leading-tight">
                      {item.name}
                    </h2>
                    <span className="text-xs text-[#787b86] font-medium">
                      {item.exchangeCode} • {item.country}
                    </span>
                  </div>
                </div>

                {/* Mini Sparkline */}
                <svg
                  className={`w-20 h-7 ${isUp ? 'text-[#089981]' : 'text-[#f23645]'} stroke-current`}
                  fill="none"
                  viewBox="0 0 100 35"
                >
                  <path
                    d={`M ${svgPoints}`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <span className="text-xl font-bold tabular-nums text-[#131722]">
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div
                  className={`flex items-center text-xs font-semibold tabular-nums ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  <span className="mr-1">
                    {isUp ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}
                  </span>
                  <span>
                    ({isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`})
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
