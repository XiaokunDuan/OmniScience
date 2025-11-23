
import { GoogleGenAI } from "@google/genai";
import { ResearchItem, ResearchResponse, StockImpact } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一个具备双重身份的专家：
1. "OmniScience" 平台的严肃科学主编。
2. 华尔街顶级的生物/科技/工业板块分析师。

你的职责是：
1. 报道全球前沿科学突破。
2. **深度分析这些突破对资本市场的影响**，具体到上市公司。

**信源要求**: 仅限 Nature, Science, 顶级大学 (MIT, Harvard) 及权威机构 (NASA, FDA)。
**语言要求**: 输出必须全部为专业的简体中文。
`;

export const fetchFrontierResearch = async (disciplineName: string): Promise<ResearchResponse> => {
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    任务：为【${disciplineName}】版块撰写今日简报及投资分析。
    
    第一步：搜索过去 3-6 个月该领域最重大的 3 个科学突破。
    第二步：分析这些突破关联的上市公司。例如：
    - 新型电池突破 -> 关联 Tesla (TSLA), CATL, Albemarle
    - 阿尔茨海默新药 -> 关联 Biogen (BIIB), Lilly (LLY)
    - AI 算法优化 -> 关联 NVIDIA (NVDA), Google (GOOGL)

    输出格式（JSON inside Markdown）：
    \`\`\`json
    {
      "items": [
        {
          "id": "uuid1",
          "title": "中文新闻标题 (专业、简洁)",
          "summary": "中文导语。200字以内。",
          "date": "YYYY-MM-DD",
          "source": "Nature Vol. 628",
          "tags": ["标签1"],
          "relevanceScore": 95
        }
      ],
      "primeSources": ["Nature", "MIT"],
      "stockAnalysis": {
        "summary": "一段话总结该领域的科学突破如何影响近期板块走势（中文）。",
        "stocks": [
          {
            "ticker": "NVDA",
            "name": "NVIDIA Corp",
            "sentiment": "Bullish", 
            "reason": "新发现的算法极度依赖 GPU 并行计算，将直接拉动算力需求。",
            "simulatedPrice": 895.42,
            "simulatedChange": "+2.4%"
          },
          {
             "ticker": "TSLA",
             "name": "Tesla Inc",
             "sentiment": "Neutral",
             "reason": "虽然固态电池技术有突破，但商业化落地仍需5年以上。",
             "simulatedPrice": 175.30,
             "simulatedChange": "-0.5%"
          }
        ]
      }
    }
    \`\`\`
    (注意：请提供 3-4 个相关的真实股票代码。如果没有直接关联的，请找行业龙头的。)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const groundingUrls: string[] = [];
    groundingChunks.forEach(chunk => {
        if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
    });

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    let items: ResearchItem[] = [];
    let primeSources: string[] = [];
    let stockAnalysis = { summary: "暂无市场数据", stocks: [] as StockImpact[] };

    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        items = parsed.items || [];
        primeSources = parsed.primeSources || [];
        if (parsed.stockAnalysis) {
            stockAnalysis = parsed.stockAnalysis;
        }
      } catch (e) {
        console.error("JSON Parse Error", e);
      }
    }

    return {
      items,
      groundingUrls: Array.from(new Set(groundingUrls)).slice(0, 5),
      primeSources,
      stockAnalysis
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const fetchDeepDive = async (topicTitle: string, discipline: string): Promise<string> => {
    const modelId = "gemini-2.5-flash"; 
    
    const prompt = `
      请以《纽约时报》深度报道的笔触，为【${discipline}】领域的以下主题撰写一份分析报告：
      主题："${topicTitle}"
      
      请包含：
      1. 科学原理深度解析。
      2. **商业价值与市场潜力估算**。
      3. 权威机构的评价。
      
      语言：简体中文。
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 1024 } }
      });
      return response.text || "暂时无法生成深度解析。";
    } catch (error) {
      return "生成错误。";
    }
  };
