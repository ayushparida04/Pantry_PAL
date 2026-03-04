from __future__ import annotations

import json
import os
from typing import Any

import google.generativeai as genai

from models.schemas import DetailedRecipe, RecipeSummary


genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))


def _json_or_default(text: str | None, default: Any):
    if not text:
        return default
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return default


def generate_recipe_suggestions(ingredients: list[str]) -> list[RecipeSummary]:
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = (
        "Return ONLY JSON. Suggest 3-4 recipes that reduce food waste using these ingredients: "
        f"{', '.join(ingredients)}. "
        "Schema: [{id,title,description,prepTime,difficulty,matchPercentage}]"
    )
    response = model.generate_content(prompt)
    payload = _json_or_default(response.text, [])
    return [RecipeSummary(**recipe) for recipe in payload]


def get_detailed_recipe(title: str, available_ingredients: list[str]) -> DetailedRecipe:
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = (
        "Return ONLY JSON for a detailed recipe. "
        f"Recipe title: {title}. Pantry ingredients: {', '.join(available_ingredients)}. "
        "Highlight missing ingredients and include substitutions and nutrition. "
        "Schema: {id,title,description,prepTime,difficulty,matchPercentage,"
        "ingredients:[{name,amount,isPantryItem}],instructions:[{step,text,tip}],"
        "nutrition:{calories,protein,carbs,fats},substitutions:[string]}"
    )
    response = model.generate_content(prompt)
    payload = _json_or_default(response.text, {})
    return DetailedRecipe(**payload)


def generate_recipe_image(title: str) -> str | None:
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(
        f"Generate a professional food photo of {title}. Return image output.",
        generation_config={"response_modalities": ["TEXT", "IMAGE"]},
    )
    candidates = getattr(response, "candidates", []) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        parts = getattr(content, "parts", []) if content else []
        for part in parts:
            inline = getattr(part, "inline_data", None)
            if inline and getattr(inline, "data", None):
                return inline.data
    return None
