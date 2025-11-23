
import React, { useState, useEffect } from 'react';
import { DisciplineSection } from './components/DisciplineSection';
import { fetchDeepDive } from './services/gemini';
import { ResearchItem, DISCIPLINES } from './types';
import { X, Sparkles, Menu, Search } from 'lucide-react';

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);
  const [selectedDisciplineName, setSelectedDisciplineName] = useState<string>('');
  const [deepDiveContent, setDeepDiveContent] = useState<string>('');
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  const handleArticleClick = (item: ResearchItem, disciplineName: string) => {
    setSelectedItem(item);
    setSelectedDisciplineName(disciplineName);
  };

  useEffect(() => {
    const generateAnalysis = async () => {
        if (!selectedItem) return;
        setLoadingDeepDive(true);
        setDeepDiveContent('');
        try {
            const content = await fetchDeepDive(selectedItem.title, selectedDisciplineName);
            setDeepDiveContent(content);
        } catch (e) {
            setDeepDiveContent("无法生成深度分析，请稍后再试。");
        } finally {
            setLoadingDeepDive(false);
        }
    };

    if (selectedItem) {
        generateAnalysis();
    }
  }, [selectedItem, selectedDisciplineName]);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-white text-[#121212]">
      
      {/* NYT Web Masthead */}
      <header className="border-b border-gray-200">
        {/* Utility Bar */}
        <div className="px-4 md:px-8 py-2 flex justify-between items-center text-[11px] font-sans-serif-header font-bold tracking-widest uppercase text-gray-600 hidden md:flex">
            <div className="flex items-center gap-4">
                <Menu className="w-4 h-4 cursor-pointer hover:text-black" />
                <Search className="w-4 h-4 cursor-pointer hover:text-black" />
            </div>
            <div className="flex items-center gap-6">
                <span>U.S.</span>
                <span>International</span>
                <span>Canada</span>
                <span>Español</span>
                <span>中文</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="bg-black text-white px-2 py-1 rounded-sm">SUBSCRIBE</span>
               <button className="bg-gray-100 px-2 py-1 rounded-sm border border-gray-200 hover:bg-gray-200">LOG IN</button>
            </div>
        </div>

        {/* Main Logo Area */}
        <div className="py-6 md:py-8 text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-serif tracking-tight text-black leading-none mb-2" style={{fontFamily: '"Playfair Display", serif'}}>
                OmniScience.
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-xs md:text-sm font-sans-serif-header text-gray-500 mt-3">
                 <span className="font-bold text-black">{currentDate}</span>
                 <span className="hidden md:inline text-gray-300">|</span>
                 <span className="italic font-serif text-gray-700">Global Frontier Research Aggregator</span>
            </div>
        </div>

        {/* Navigation Bar Simulation */}
        <div className="border-t border-b border-double border-gray-200 py-3 overflow-x-auto">
            <div className="max-w-[1400px] mx-auto px-6 flex justify-center gap-6 md:gap-8 min-w-max">
                {["Science", "Health", "Technology", "Space", "Climate", "Physics", "Archaeology", "AI"].map(nav => (
                    <span key={nav} className="text-xs font-bold font-sans-serif-header text-gray-700 hover:underline cursor-pointer uppercase tracking-wide">
                        {nav}
                    </span>
                ))}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-8 pb-24 pt-8">
        <div className="flex flex-col gap-4">
            {DISCIPLINES.map((discipline) => (
                <DisciplineSection 
                    key={discipline.id} 
                    discipline={discipline} 
                    onArticleClick={(item) => handleArticleClick(item, discipline.name)} 
                />
            ))}
        </div>

        <div className="mt-24 pt-12 border-t border-gray-200 text-center pb-12">
             <h3 className="font-serif font-bold text-2xl mb-2 tracking-tight">OmniScience.</h3>
             <div className="flex justify-center gap-4 text-xs text-gray-500 font-sans-serif-header mt-4 uppercase tracking-wider">
                <span>About Us</span>
                <span>Contact</span>
                <span>Terms of Service</span>
                <span>Privacy</span>
             </div>
             <p className="text-gray-400 text-[10px] mt-6 font-sans-serif-header">© 2024 OmniScience Frontier Company</p>
        </div>
      </main>

      {/* Article Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/30 backdrop-blur-[2px]">
            <div 
                className="absolute inset-0"
                onClick={() => setSelectedItem(null)}
            />
            <div className="relative w-full max-w-[900px] bg-white shadow-2xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                <div className="p-8 md:p-12 bg-white">
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="fixed md:absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition-colors z-20"
                    >
                        <X className="w-6 h-6 text-gray-800" />
                    </button>

                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <span className="font-sans-serif-header text-xs font-bold tracking-widest uppercase text-gray-500 mb-3 block">
                            {selectedDisciplineName}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-black leading-tight mb-4">
                            {selectedItem.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 font-sans-serif-header">
                            <span className="font-bold text-black uppercase text-xs">{selectedItem.source || "OMNI WIRE"}</span>
                            <span>•</span>
                            <span>{selectedItem.date}</span>
                        </div>
                    </div>

                    <div className="max-w-[680px] mx-auto">
                        <p className="text-xl md:text-2xl font-serif text-gray-800 leading-relaxed mb-10 font-light italic">
                            {selectedItem.summary}
                        </p>

                        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans-serif-header">
                                Gemini 2.5 AI Deep Analysis
                            </span>
                        </div>

                        {loadingDeepDive ? (
                            <div className="space-y-6 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                <div className="h-48 bg-gray-50 rounded w-full mt-8"></div>
                            </div>
                        ) : (
                            <div className="prose prose-lg prose-gray max-w-none font-serif text-gray-800 prose-headings:font-sans-serif-header prose-headings:font-bold prose-h3:text-lg prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-10 prose-p:leading-loose">
                                {deepDiveContent.split('\n').map((line, i) => {
                                    if (line.trim().startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>
                                    if (line.trim().startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-10 mb-4">{line.replace('## ', '')}</h2>
                                    if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc pl-2 mb-2">{line.replace('- ', '')}</li>
                                    if (line.trim() === '') return <br key={i}/>
                                    return <p key={i} className="mb-5">{line.replace(/\*\*/g, '')}</p> 
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
