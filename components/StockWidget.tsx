
import React, { useState } from 'react';
import { StockImpact } from '../types';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface StockWidgetProps {
  analysis: {
    summary: string;
    stocks: StockImpact[];
  };
}

// Helper to generate a random sparkline path
const generateSparkline = (sentiment: string, width: number, height: number) => {
  const points = [];
  let y = height / 2;
  const steps = 20;
  const stepX = width / steps;

  for (let i = 0; i <= steps; i++) {
    const randomMove = (Math.random() - 0.5) * (height * 0.6);
    // Bias the movement based on sentiment
    const bias = sentiment === 'Bullish' ? -2 : sentiment === 'Bearish' ? 2 : 0;
    y = Math.max(5, Math.min(height - 5, y + randomMove + bias));
    points.push(`${i * stepX},${y}`);
  }
  return `M${points.join(' L')}`;
};

export const StockWidget: React.FC<StockWidgetProps> = ({ analysis }) => {
  const [activeTicker, setActiveTicker] = useState<string | null>(null);

  return (
    <div className="mt-8 border-t-4 border-black pt-6 bg-gray-50/50 p-6 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif font-bold text-xl text-black flex items-center gap-2">
          Market Signals
          <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-sm font-sans-serif-header uppercase tracking-widest font-medium">
            Beta
          </span>
        </h3>
        <span className="text-xs text-gray-500 font-sans-serif-header uppercase tracking-wide">
          Powered by Gemini Finance
        </span>
      </div>

      <p className="text-sm font-serif text-gray-700 mb-8 leading-relaxed italic border-l-2 border-gray-300 pl-4">
        "{analysis.summary}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysis.stocks.map((stock) => {
          const isBullish = stock.sentiment === 'Bullish';
          const isBearish = stock.sentiment === 'Bearish';
          const colorClass = isBullish ? 'text-green-700' : isBearish ? 'text-red-700' : 'text-gray-600';
          const strokeColor = isBullish ? '#15803d' : isBearish ? '#b91c1c' : '#4b5563';
          const bgClass = activeTicker === stock.ticker ? 'bg-white shadow-lg ring-1 ring-gray-200' : 'bg-white border border-gray-200 hover:border-gray-400';

          return (
            <div 
              key={stock.ticker}
              className={`p-4 transition-all duration-200 cursor-pointer group relative ${bgClass}`}
              onMouseEnter={() => setActiveTicker(stock.ticker)}
              onMouseLeave={() => setActiveTicker(null)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-sans-serif-header font-bold text-lg text-black">
                    {stock.ticker}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider truncate max-w-[120px]">
                    {stock.name}
                  </div>
                </div>
                <div className={`text-right ${colorClass}`}>
                  <div className="font-mono font-bold text-sm">{stock.simulatedPrice}</div>
                  <div className="flex items-center justify-end text-[10px] font-bold gap-0.5">
                    {isBullish ? <TrendingUp size={10} /> : isBearish ? <TrendingDown size={10} /> : <Minus size={10} />}
                    {stock.simulatedChange}
                  </div>
                </div>
              </div>

              {/* Interactive Chart Area */}
              <div className="h-12 w-full mt-2 mb-3 overflow-hidden relative">
                <svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="none">
                  <path 
                    d={generateSparkline(stock.sentiment, 200, 50)} 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Mock Interactive Line */}
                  <line x1="0" y1="48" x2="200" y2="48" stroke="#e5e7eb" strokeWidth="1" />
                </svg>
                {/* Tooltip Simulation */}
                <div className={`absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-[1px] transition-opacity duration-200 ${activeTicker === stock.ticker ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <span className="text-[10px] font-sans-serif-header font-bold uppercase text-black px-2 py-1 border border-black bg-white shadow-sm">
                        View Analysis
                    </span>
                </div>
              </div>

              {/* Analysis Text (Always visible but highlighted on hover) */}
              <div className="relative">
                 <div className="flex items-start gap-1.5">
                    <Info className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600 font-serif leading-tight">
                        {stock.reason}
                    </p>
                 </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};
