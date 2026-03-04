from __future__ import annotations

import json
import os
from typing import Any

from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=os.getenv("GEMINI_API_KEY", ""),
    temperature=0.4,
)


recipe_suggestion_prompt = PromptTemplate.from_template(
    """
You are SmartPantry AI, an expert chef focused on reducing food waste.
Given this pantry list: {ingredients}
Return ONLY JSON array with 3-4 recipe summaries.
Schema:
[
  {{"id":"string","title":"string","description":"string","prepTime":"string","difficulty":"Easy|Medium|Hard","matchPercentage": number}}
]
"""
)

recipe_detail_prompt = PromptTemplate.from_template(
    """
You are SmartPantry AI.
Generate a detailed recipe for "{title}" using available ingredients: {available_ingredients}.
Clearly reflect missing ingredients via isPantryItem false.
Return ONLY JSON object using schema:
{{
  "id":"string",
  "title":"string",
  "description":"string",
  "prepTime":"string",
  "difficulty":"Easy|Medium|Hard",
  "matchPercentage": number,
  "ingredients":[{{"name":"string","amount":"string","isPantryItem":boolean}}],
  "instructions":[{{"step":number,"text":"string","tip":"string"}}],
  "nutrition":{{"calories":"string","protein":"string","carbs":"string","fats":"string"}},
  "substitutions":["string"]
}}
"""
)

json_parser = JsonOutputParser()

recipe_suggestion_chain = recipe_suggestion_prompt | llm | StrOutputParser() | json_parser
recipe_detail_chain = recipe_detail_prompt | llm | StrOutputParser() | json_parser


def get_cooking_assistant_response(
    recipe_title: str,
    user_question: str,
    chat_history: list[dict[str, Any]],
) -> str:
    memory = ConversationBufferMemory(return_messages=True)
    for message in chat_history:
        role = message.get("role", "user")
        content = message.get("content", "")
        if role == "assistant":
            memory.chat_memory.add_ai_message(content)
        else:
            memory.chat_memory.add_user_message(content)

    context = memory.buffer_as_messages
    prompt = (
        f"You are a calm cooking assistant for the recipe '{recipe_title}'. "
        f"Conversation so far: {json.dumps([m.content for m in context])}. "
        f"User question: {user_question}. Provide concise, practical guidance."
    )
    response = llm.invoke(prompt)
    return response.content if hasattr(response, "content") else str(response)
