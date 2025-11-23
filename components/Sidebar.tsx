import React from 'react';
import { DISCIPLINES, Discipline, DisciplineCategory } from '../types';
import * as LucideIcons from 'lucide-react';

interface SidebarProps {
  selectedDiscipline: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedDiscipline, onSelect, isOpen, toggleSidebar }) => {
  
  // Group disciplines by category
  const groupedDisciplines = DISCIPLINES.reduce((acc, discipline) => {
    if (!acc[discipline.category]) {
      acc[discipline.category] = [];
    }
    acc[discipline.category].push(discipline);
    return acc;
  }, {} as Record<DisciplineCategory, Discipline[]>);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto custom-scrollbar
      `}>
        <div className="p-6">
            <div className="flex items-center gap-3 mb-8 text-cyan-400">
                <LucideIcons.Globe2 className="w-8 h-8" />
                <h1 className="text-xl font-bold tracking-tight text-white">OmniScience</h1>
            </div>

            <div className="space-y-8">
            {(Object.keys(groupedDisciplines) as DisciplineCategory[]).map((category) => (
                <div key={category}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 pl-2">
                    {category}
                </h3>
                <div className="space-y-1">
                    {groupedDisciplines[category].map((d) => {
                    const Icon = (LucideIcons as any)[d.icon] || LucideIcons.Circle;
                    const isSelected = selectedDiscipline === d.id;
                    
                    return (
                        <button
                        key={d.id}
                        onClick={() => {
                            onSelect(d.id);
                            if (window.innerWidth < 1024) toggleSidebar();
                        }}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                            ${isSelected 
                            ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50 shadow-lg shadow-cyan-900/20' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                        `}
                        >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{d.name}</span>
                        </button>
                    );
                    })}
                </div>
                </div>
            ))}
            </div>
        </div>
        
        {/* Footer info */}
        <div className="p-6 mt-auto border-t border-slate-800">
            <p className="text-xs text-slate-600">
                Powered by Google Gemini 2.5
            </p>
        </div>
      </aside>
    </>
  );
};
