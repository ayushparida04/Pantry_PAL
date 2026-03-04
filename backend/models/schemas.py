from __future__ import annotations

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    id: str | None = None
    name: str
    amount: str = ""
    category: str = "Ingredient"


class RecipeSummary(BaseModel):
    id: str
    title: str
    description: str
    prepTime: str
    difficulty: str
    matchPercentage: float


class Instruction(BaseModel):
    step: int
    text: str
    tip: str | None = None


class Nutrition(BaseModel):
    calories: str
    protein: str
    carbs: str
    fats: str


class DetailedRecipe(RecipeSummary):
    ingredients: list[Ingredient]
    instructions: list[Instruction]
    nutrition: Nutrition
    substitutions: list[str] = Field(default_factory=list)


class PantryRequest(BaseModel):
    ingredients: list[str]


class RecipeRequest(BaseModel):
    title: str
    available_ingredients: list[str]
