import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CountrySuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SUGGESTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    country: { type: Type.STRING },
    city: { type: Type.STRING },
    reasoning: { type: Type.STRING },
    stats: {
      type: Type.OBJECT,
      properties: {
        internetSpeed: { type: Type.STRING },
        costOfLiving: { type: Type.STRING },
        safetyScore: { type: Type.STRING },
        visaEase: { type: Type.STRING },
      },
    },
    budgets: {
      type: Type.OBJECT,
      properties: {
        affordable: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            estimatedMonthly: { type: Type.STRING },
            stays: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifestyle: { type: Type.STRING },
          },
        },
        luxury: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            estimatedMonthly: { type: Type.STRING },
            stays: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifestyle: { type: Type.STRING },
          },
        },
      },
    },
    logistics: {
      type: Type.OBJECT,
      properties: {
        visaProcess: { type: Type.STRING },
        healthInsurance: { type: Type.STRING },
        transportInfo: { type: Type.STRING },
        culture: { type: Type.ARRAY, items: { type: Type.STRING } },
        safety: {
          type: Type.OBJECT,
          properties: {
            emergencyNumbers: {
              type: Type.OBJECT,
              properties: {
                police: { type: Type.STRING },
                ambulance: { type: Type.STRING },
              },
            },
            nomadTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            precautions: { type: Type.STRING },
          },
        },
        womenSpecific: {
          type: Type.OBJECT,
          properties: {
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            dressCode: { type: Type.STRING },
            hygieneProductsAvailability: { type: Type.STRING },
            soloTravelAdvice: { type: Type.STRING },
            transportSafety: {
              type: Type.OBJECT,
              properties: {
                publicTransport: { type: Type.STRING },
                rideSharing: { type: Type.STRING },
                scams: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        },
      },
    },
    recommendations: {
      type: Type.OBJECT,
      properties: {
        stays: { type: Type.ARRAY, items: { type: Type.STRING } },
        coworking: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          activity: { type: Type.STRING },
          description: { type: Type.STRING },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
            },
            required: ["lat", "lng"],
          },
        },
      },
    },
  },
  required: ["country", "city", "reasoning", "stats", "budgets", "logistics", "recommendations", "itinerary"],
};

export async function getNomadSuggestions(profile: UserProfile): Promise<CountrySuggestion[]> {
  const cacheKey = `suggestions_${JSON.stringify(profile.interests)}_${profile.wealth}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const prompt = `You are an expert digital nomad travel consultant. 
  Based on this user profile, suggest 3 countries/cities that would be perfect for them.
  
  User Profile:
  - Interests: ${profile.interests.join(", ")}
  - Wealth/Budget: ${profile.wealth}
  - Internet Requirement: ${profile.internetRequirement}
  
  Provide detailed info for each including budget tiers (Affordable vs Luxury), visa process, health insurance (suggest specific nomad-friendly providers like SafetyWing, Genki, or local mandatory plans), local transport (include typical costs, efficiency, and specific apps or passes like Grab, Bolt, or monthly transit cards), local etiquette/cultural norms (concise tips), safety & emergency information (police: string, ambulance: string, general safety tips for nomads, and any specific local risks or precautions), women-specific needs (safety tips for women, dress code recommendations for cultural sensitivity, availability of feminine hygiene products, solo female travel advice, and specific transportation safety advice covering public transit, ride-sharing, and common scams), coworking spaces, and a sample 3-day itinerary. 
  IMPORTANT: For every itinerary item, provide precise latitude and longitude coordinates so they can be plotted on a map.
  
  Be specific and use real-world current data. Provide accurate coordinates.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: SUGGESTION_SCHEMA,
        },
      },
    });

    if (!response.text) throw new Error("No response from Gemini");
    const data = JSON.parse(response.text);
    localStorage.setItem(cacheKey, response.text);
    return data;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    throw error;
  }
}

export async function searchCityInfo(cityQuery: string): Promise<CountrySuggestion> {
  const cacheKey = `city_${cityQuery.toLowerCase()}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const prompt = `You are an expert digital nomad consultant. 
  Provide a complete dossier for the city: "${cityQuery}". 
  Include all stats, budget tiers (Affordable vs Luxury), logistics (visa details, specific health insurance recommendations like SafetyWing or local requirements, detailed transport options including costs and recommended apps, local cultural etiquette, a dedicated safety section with emergency numbers, and a specialized section for female nomads focusing on safety, dressing, hygiene, solo travel, and specific transit safety/scam prevention), stays, coworking, and a 3-day itinerary with precise latitude/longitude coordinates.
  Focus on the digital nomad perspective.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SUGGESTION_SCHEMA,
      },
    });

    if (!response.text) throw new Error("No response from Gemini");
    const data = JSON.parse(response.text);
    localStorage.setItem(cacheKey, response.text);
    return data;
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
}
