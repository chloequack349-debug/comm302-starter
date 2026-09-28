import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { REGIONS } from '../data/marketData';

interface HeroProps {
  currentRegion: string;
  onSelectRegion: (regionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ currentRegion, onSelectRegion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedRegionObj = REGIONS.find((r) => r.id === currentRegion) || REGIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="text-center mb-10 relative" data-purpose="hero-title">
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center cursor-pointer group select-none text-left bg-transparent border-none p-0 focus:outline-none"
          aria-expanded={isOpen}
          title="Change region or market perspective"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight tv-headline text-[#131722] group-hover:text-[#2962ff] transition-colors">
            {selectedRegionObj.name}
          </h1>
          <ChevronDown
            className={`w-7 h-7 sm:w-8 sm:h-8 ml-3 text-[#131722] group-hover:text-[#2962ff] group-hover:translate-y-0.5 transition-all stroke-[2.7] ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] py-2 z-30 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#787b86] uppercase tracking-wider border-b border-[#f0f3fa]">
              Select Market View
            </div>
            {REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  onSelectRegion(region.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-[#f0f3fa] transition-colors ${
                  currentRegion === region.id
                    ? 'font-bold text-[#2962ff] bg-[#f0f3fa]/50'
                    : 'text-[#131722]'
                }`}
              >
                <span>{region.name}</span>
                {currentRegion === region.id && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
