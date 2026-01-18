
import { GoogleGenAI, Type } from "@google/genai";
import { RecipeSummary, DetailedRecipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRecipeSuggestions = async (ingredients: string[]): Promise<RecipeSummary[]> => {
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
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse recipes", e);
    return [];
  }
};

export const getDetailedRecipe = async (title: string, availableIngredients: string[]): Promise<DetailedRecipe> => {
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

  return JSON.parse(response.text || "{}");
};

export const generateRecipeImage = async (title: string): Promise<string | null> => {
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
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};
