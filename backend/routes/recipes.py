from __future__ import annotations

import hashlib
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.db import CachedRecipe, get_db
from models.schemas import DetailedRecipe, PantryRequest, RecipeRequest, RecipeSummary
from services.gemini_service import generate_recipe_image
from services.langchain_agent import (
    get_cooking_assistant_response,
    recipe_detail_chain,
    recipe_suggestion_chain,
)

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


class ImageRequest(BaseModel):
    title: str


class ChatRequest(BaseModel):
    recipe_title: str
    question: str
    chat_history: list[dict[str, Any]] = Field(default_factory=list)


def _make_ingredients_key(ingredients: list[str]) -> str:
    normalized = "|".join(sorted(i.strip().lower() for i in ingredients if i.strip()))
    return hashlib.sha256(normalized.encode()).hexdigest()


@router.post("/suggestions", response_model=list[RecipeSummary])
async def recipe_suggestions(payload: PantryRequest, db: AsyncSession = Depends(get_db)):
    ingredients_key = _make_ingredients_key(payload.ingredients)
    cached_result = await db.execute(select(CachedRecipe).where(CachedRecipe.ingredients_key == ingredients_key))
    cached = cached_result.scalar_one_or_none()
    if cached:
        return [RecipeSummary(**item) for item in cached.recipe_data]

    result = recipe_suggestion_chain.invoke({"ingredients": ", ".join(payload.ingredients)})
    recipes = [RecipeSummary(**item) for item in result]

    db.add(CachedRecipe(ingredients_key=ingredients_key, recipe_data=[r.model_dump() for r in recipes]))
    await db.commit()
    return recipes


@router.post("/detail", response_model=DetailedRecipe)
async def recipe_detail(payload: RecipeRequest):
    result = recipe_detail_chain.invoke(
        {"title": payload.title, "available_ingredients": ", ".join(payload.available_ingredients)}
    )
    return DetailedRecipe(**result)


@router.post("/image")
async def recipe_image(payload: ImageRequest):
    image_data = generate_recipe_image(payload.title)
    return {"image_url": f"data:image/png;base64,{image_data}" if image_data else None}


@router.post("/chat")
async def recipe_chat(payload: ChatRequest):
    response = get_cooking_assistant_response(
        recipe_title=payload.recipe_title,
        user_question=payload.question,
        chat_history=payload.chat_history,
    )
    return {"response": response}
