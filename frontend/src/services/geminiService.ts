import { DetailedRecipe, RecipeSummary } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const request = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

export const generateRecipeSuggestions = async (ingredients: string[]): Promise<RecipeSummary[]> => {
  return request<RecipeSummary[]>("/api/recipes/suggestions", { ingredients });
};

export const getDetailedRecipe = async (
  title: string,
  availableIngredients: string[]
): Promise<DetailedRecipe> => {
  return request<DetailedRecipe>("/api/recipes/detail", {
    title,
    available_ingredients: availableIngredients,
  });
};

export const generateRecipeImage = async (title: string): Promise<string | null> => {
  const response = await request<{ image_url: string | null }>("/api/recipes/image", { title });
  return response.image_url;
};

export const askCookingQuestion = async (
  recipeTitle: string,
  question: string,
  chatHistory: ChatMessage[]
): Promise<string> => {
  const response = await request<{ response: string }>("/api/recipes/chat", {
    recipe_title: recipeTitle,
    question,
    chat_history: chatHistory,
  });
  return response.response;
};
