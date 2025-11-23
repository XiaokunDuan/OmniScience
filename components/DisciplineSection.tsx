
import React, { useState, useEffect, useRef } from 'react';
import { Discipline, ResearchItem, ResearchResponse } from '../types';
import { fetchFrontierResearch } from '../services/gemini';
import { NewsCard } from './NewsCard';
import { StockWidget } from './StockWidget';
import { ShieldCheck } from 'lucide-react';

interface DisciplineSectionProps {
  discipline: Discipline;
  onArticleClick: (item: ResearchItem) => void;
}

export const DisciplineSection: React.FC<DisciplineSectionProps> = ({ discipline, onArticleClick }) => {
  const [data, setData] = useState<ResearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasFetched.current) {
          fetchData();
        }
      },
      { threshold: 0.05, rootMargin: '150px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchData = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFrontierResearch(discipline.name);
      setData(result);
    } catch (err) {
      setError("无法连接至全球权威数据库");
      hasFetched.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-12 min-h-[400px]">
      {/* NYT Web Style Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-t-2 border-black pt-2 mb-6">
        <div>
            <h2 className="text-xs font-bold tracking-widest uppercase font-sans-serif-header text-black mb-1">
                {discipline.category}
            </h2>
            <div className="flex items-baseline gap-4">
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-black">
                    {discipline.name}
                </h1>
                {/* Authoritative Sources Label */}
                {data?.primeSources && data.primeSources.length > 0 && (
                    <div className="hidden lg:flex items-center gap-2 text-[10px] font-sans-serif-header text-gray-500 translate-y-[-4px]">
                        <ShieldCheck className="w-3 h-3 text-gray-400" />
                        <span className="uppercase tracking-wide font-semibold">Primary Sources:</span>
                        <span className="font-medium text-gray-700">{data.primeSources.join(', ')}</span>
                    </div>
                )}
            </div>
        </div>
        
         {/* Mobile Source Label */}
         {data?.primeSources && data.primeSources.length > 0 && (
             <div className="lg:hidden mt-2 flex items-center gap-2 text-[10px] font-sans-serif-header text-gray-500">
                <ShieldCheck className="w-3 h-3 text-gray-400" />
                <span className="uppercase tracking-wide font-semibold">Sources:</span>
                <span className="font-medium text-gray-700">{data.primeSources.slice(0,2).join(', ')}</span>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-200 w-24 mb-3"></div>
                <div className="h-6 bg-gray-200 w-full mb-3"></div>
                <div className="h-24 bg-gray-100 w-full mb-2"></div>
                <div className="h-2 bg-gray-100 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center border-t border-b border-gray-100">
            <p className="text-gray-500 font-serif mb-4 text-sm">{error}</p>
            <button 
                onClick={() => { hasFetched.current = false; fetchData(); }}
                className="px-4 py-1 text-xs border border-gray-300 hover:bg-black hover:text-white transition-colors font-sans-serif-header uppercase tracking-wider"
            >
                Reload
            </button>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main News Area */}
            <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                 {data.items.length > 0 && (
                    <div className="lg:col-span-5 lg:pr-8 lg:border-r border-gray-200">
                        <NewsCard 
                            item={data.items[0]} 
                            index={0} 
                            onClick={onArticleClick} 
                            variant="feature"
                        />
                    </div>
                 )}

                <div className="lg:col-span-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-10">
                        {data.items.slice(1).map((item, idx) => (
                            <NewsCard 
                            key={item.id || idx} 
                            item={item} 
                            index={idx + 1} 
                            onClick={onArticleClick} 
                            variant="standard"
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Stock Analysis Widget - Full Width Bottom */}
            {data.stockAnalysis && data.stockAnalysis.stocks.length > 0 && (
                <div className="col-span-1 lg:col-span-12">
                    <StockWidget analysis={data.stockAnalysis} />
                </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};
