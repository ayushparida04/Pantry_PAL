import { Ingredient } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const pantryRequest = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Pantry API failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

export const fetchPantryItems = () => pantryRequest<Ingredient[]>("/api/pantry");

export const addPantryItem = (item: Omit<Ingredient, "id">) =>
  pantryRequest<Ingredient>("/api/pantry", {
    method: "POST",
    body: JSON.stringify(item),
  });

export const removePantryItem = (itemId: string) =>
  pantryRequest<{ ok: boolean }>(`/api/pantry/${itemId}`, { method: "DELETE" });

export const clearPantryItems = () => pantryRequest<{ ok: boolean }>("/api/pantry", { method: "DELETE" });
