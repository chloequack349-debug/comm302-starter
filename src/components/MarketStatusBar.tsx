import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const MarketStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#f8f9fd] border-b border-[#e0e3eb] py-1.5 px-4 text-[11px] text-[#787b86]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse" />
            <span className="font-semibold text-[#131722]">New York:</span>
            <span>Open (09:30 - 16:00 EST)</span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="font-semibold text-[#131722]">London:</span>
            <span>Open (08:00 - 16:30 GMT)</span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#787b86]" />
            <span className="font-semibold text-[#131722]">Tokyo:</span>
            <span>Closed</span>
          </div>
          <div className="flex items-center gap-1.5 hidden lg:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="font-semibold text-[#131722]">Crypto:</span>
            <span>24/7 Global Trading</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[#434651] whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-[#787b86]" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};
