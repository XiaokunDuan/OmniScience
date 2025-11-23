
export enum DisciplineCategory {
  NATURAL_SCIENCES = "自然科学",
  FORMAL_SCIENCES = "形式科学",
  SOCIAL_SCIENCES = "社会科学",
  HUMANITIES = "人文科学",
  APPLIED_SCIENCES = "应用科学"
}

export interface Discipline {
  id: string;
  name: string;
  category: DisciplineCategory;
  icon: string;
  description: string;
}

export interface StockImpact {
  ticker: string;
  name: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  reason: string; // The AI analysis
  simulatedPrice: number; // Mock price for UI
  simulatedChange: string; // Mock percent change
}

export interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source?: string;
  url?: string;
  tags: string[];
  relevanceScore: number;
}

export interface ResearchResponse {
  items: ResearchItem[];
  groundingUrls: string[];
  primeSources: string[];
  stockAnalysis: {
    summary: string; // General market impact summary
    stocks: StockImpact[];
  };
}

export const DISCIPLINES: Discipline[] = [
  // High Market Impact: Tech & AI (NASDAQ Movers)
  { id: 'cs', name: '计算机科学', category: DisciplineCategory.FORMAL_SCIENCES, icon: 'Cpu', description: 'AI, Quantum, Cybersecurity, SaaS Trends' },
  
  // High Market Impact: Biotech & Pharma (Healthcare Sector)
  { id: 'medicine', name: '医学', category: DisciplineCategory.APPLIED_SCIENCES, icon: 'Stethoscope', description: 'FDA Approvals, Immunotherapy, Clinical Trials' },
  { id: 'biology', name: '生物技术', category: DisciplineCategory.NATURAL_SCIENCES, icon: 'Dna', description: 'CRISPR, Genomics, Synthetic Bio' },

  // High Market Impact: Energy, Mining & Commodities
  { id: 'earth_science', name: '地球与能源', category: DisciplineCategory.NATURAL_SCIENCES, icon: 'Globe2', description: 'Oil/Gas, Lithium Mining, Rare Earths' },
  { id: 'ecology', name: '绿色经济', category: DisciplineCategory.NATURAL_SCIENCES, icon: 'Leaf', description: 'ESG, Carbon Credits, Renewable Energy' },

  // High Market Impact: Semis & Materials (Industrial Sector)
  { id: 'physics', name: '硬科技物理', category: DisciplineCategory.NATURAL_SCIENCES, icon: 'Atom', description: 'Semiconductors, Superconductors, Optics' },
  { id: 'chemistry', name: '材料化学', category: DisciplineCategory.NATURAL_SCIENCES, icon: 'FlaskConical', description: 'Battery Tech, Polymers, Industrial Materials' },

  // High Market Impact: Macro & Manufacturing
  { id: 'economics', name: '宏观经济', category: DisciplineCategory.SOCIAL_SCIENCES, icon: 'TrendingUp', description: 'Fed Policy, Inflation, Global Trade' },
  { id: 'engineering', name: '前沿工程', category: DisciplineCategory.APPLIED_SCIENCES, icon: 'Wrench', description: 'EVs, Robotics, Aerospace, Defense' },
];
