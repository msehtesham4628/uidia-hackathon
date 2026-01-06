import { GoogleGenAI, Type } from "@google/genai";
import { AggregatedStats, AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDataset = async (stats: AggregatedStats): Promise<AIAnalysisResult> => {
  // We send aggregated stats to avoid token limits with raw CSV data
  // Grouping dates for brevity if needed, but 30 days is fine.
  
  const promptContext = JSON.stringify({
    total_records: stats.totalRecords,
    success_rate: stats.successRate.toFixed(2) + '%',
    enrolment_vs_updates: { new: stats.totalNew, updates: stats.totalUpdates },
    daily_trends: stats.byDate.map(d => `${d.date}: ${d.count} total, ${d.rejections} rejected`),
    state_distribution: stats.byState.slice(0, 5), // Top 5 states
  });

  const prompt = `
    You are a Senior Data Scientist at UIDAI (Unique Identification Authority of India).
    Analyze the following aggregated Aadhaar enrolment and update data.
    
    Data Context: ${promptContext}

    Your goal is to:
    1. Identify anomalies (e.g., high rejection rates on specific days, unusual state activity).
    2. Predict trends for the next week based on the daily volume.
    3. Provide actionable recommendations to improve system efficiency or reduce fraud.

    Return the response in JSON format conforming to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief executive summary of the data health." },
            anomalies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  detectedAt: { type: Type.STRING },
                  affectedDimension: { type: Type.STRING }
                }
              }
            },
            predictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING },
                  forecastValue: { type: Type.NUMBER },
                  trend: { type: Type.STRING, enum: ["Up", "Down", "Stable"] },
                  confidence: { type: Type.NUMBER },
                  rationale: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails or key is missing
    return {
      summary: "Could not generate AI analysis at this time.",
      anomalies: [],
      predictions: [],
      recommendations: ["Check API Key configuration.", "Ensure data integrity."]
    };
  }
};
