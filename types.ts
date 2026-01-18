
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  amount?: string;
}

export interface RecipeSummary {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  matchPercentage: number;
}

export interface DetailedRecipe extends RecipeSummary {
  ingredients: {
    name: string;
    amount: string;
    isPantryItem: boolean;
  }[];
  instructions: {
    step: number;
    text: string;
    tip?: string;
  }[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  substitutions: string[];
}

export enum AppView {
  PANTRY = 'PANTRY',
  DISCOVER = 'DISCOVER',
  RECIPE_DETAIL = 'RECIPE_DETAIL',
  COOKING_MODE = 'COOKING_MODE'
}
