
import React from 'react';
import { ResearchItem } from '../types';

interface NewsCardProps {
  item: ResearchItem;
  onClick: (item: ResearchItem) => void;
  index: number;
  variant?: 'feature' | 'standard';
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, onClick, variant = 'standard' }) => {
  const isFeature = variant === 'feature';

  return (
    <article 
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => onClick(item)}
    >
      {/* Meta Info */}
      <div className="flex items-center gap-2 mb-2.5">
        {item.source && (
            <span className="font-sans-serif-header text-[10px] font-bold tracking-wider uppercase text-gray-800">
                {item.source}
            </span>
        )}
        <span className="text-[10px] text-gray-400 font-sans-serif-header">
           {item.date}
        </span>
      </div>

      {/* Headline */}
      <h3 className={`
        font-serif font-bold text-black leading-[1.1] mb-3 group-hover:text-gray-600 transition-colors
        ${isFeature ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}
      `}>
        {item.title}
      </h3>

      {/* Summary */}
      <p className={`
        text-gray-600 font-serif leading-relaxed
        ${isFeature ? 'text-base md:text-lg line-clamp-6' : 'text-sm line-clamp-4'}
      `}>
        {item.summary}
      </p>

      {/* Bottom Elements */}
      <div className="mt-auto pt-3">
         <div className="text-[10px] text-gray-400 font-sans-serif-header uppercase tracking-wide text-right">
            {isFeature ? 'Read Deep Dive Analysis →' : ''}
         </div>
      </div>
    </article>
  );
};
