
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeSummary, DetailedRecipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Cache Implementation ---
const CACHE_PREFIX = 'smartpantry_v1_';

const getCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn('Cache read error', e);
    return null;
  }
};

const setCache = <T>(key: string, data: T): void => {
  try {
    // Basic storage management: If local storage is full, we could clear it, 
    // but for now we just catch the error to prevent app crash.
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Cache write error - likely quota exceeded', e);
  }
};

// Generate a consistent key for ingredients regardless of order
const generateIngredientsKey = (ingredients: string[]): string => {
  return ingredients
    .map(i => i.trim().toLowerCase())
    .sort()
    .join('|');
};

export const generateRecipeSuggestions = async (ingredients: string[]): Promise<RecipeSummary[]> => {
  const ingredientsKey = generateIngredientsKey(ingredients);
  const cacheKey = `suggestions_${ingredientsKey}`;

  const cachedData = getCache<RecipeSummary[]>(cacheKey);
  if (cachedData) {
    console.log("Serving recipe suggestions from cache");
    return cachedData;
  }

  const prompt = `Based on these ingredients: ${ingredients.join(", ")}, suggest 3-4 possible recipes. 
  Focus on reducing food waste. Provide brief summaries.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER }
          },
          required: ["id", "title", "description", "prepTime", "difficulty", "matchPercentage"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    setCache(cacheKey, data);
    return data;
  } catch (e) {
    console.error("Failed to parse recipes", e);
    return [];
  }
};

export const getDetailedRecipe = async (title: string, availableIngredients: string[]): Promise<DetailedRecipe> => {
  // We include ingredients in the key because the "missing ingredients" logic depends on what the user currently has.
  const ingredientsKey = generateIngredientsKey(availableIngredients);
  const cacheKey = `detail_${title.trim().toLowerCase()}_${ingredientsKey}`;

  const cachedData = getCache<DetailedRecipe>(cacheKey);
  if (cachedData) {
    console.log("Serving detailed recipe from cache");
    return cachedData;
  }

  const prompt = `Generate a detailed recipe for "${title}". 
  The user has: ${availableIngredients.join(", ")}. 
  Highlight which ingredients are missing. Include nutrition and substitutions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          matchPercentage: { type: Type.NUMBER },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
                isPantryItem: { type: Type.BOOLEAN }
              }
            }
          },
          instructions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER },
                text: { type: Type.STRING },
                tip: { type: Type.STRING }
              }
            }
          },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.STRING },
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fats: { type: Type.STRING }
            }
          },
          substitutions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["id", "title", "ingredients", "instructions", "nutrition"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  setCache(cacheKey, data);
  return data;
};

export const generateRecipeImage = async (title: string): Promise<string | null> => {
  const cacheKey = `image_${title.trim().toLowerCase()}`;
  
  const cachedData = getCache<string>(cacheKey);
  if (cachedData) {
    console.log("Serving image from cache");
    return cachedData;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality, professional food photography shot of ${title}, styled for a cookbook, on a clean kitchen table.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        setCache(cacheKey, imageUrl);
        return imageUrl;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};
