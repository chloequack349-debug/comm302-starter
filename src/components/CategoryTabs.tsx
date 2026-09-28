import React from 'react';
import { MarketCategory } from '../types/market';

interface CategoryTabsProps {
  currentCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

const CATEGORIES: MarketCategory[] = [
  'Overview',
  'Indices',
  'Stocks',
  'Crypto',
  'Forex',
  'Futures',
  'Bonds',
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  currentCategory,
  onSelectCategory,
}) => {
  return (
    <nav
      className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#e0e3eb] pb-3 mb-8 text-sm"
      data-purpose="asset-class-tabs"
    >
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap cursor-pointer transition-all ${
              isActive
                ? 'bg-[#131722] text-white shadow-xs'
                : 'text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
};
