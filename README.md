# 🍳 Pantry_PAL — SmartPantry AI

> **Turn your fridge into a 5-star kitchen.** AI-powered meal planning that generates recipes, step-by-step cooking guidance, and nutritional info — from ingredients you already have.

---

## ✨ Features

- 🧠 **AI Recipe Generation** — Powered by Google Gemini, suggests 3-4 personalized recipes from your pantry
- 📋 **Smart Ingredient Parsing** — Understands natural inputs like "3 large eggs" or "half a bunch of cilantro"
- 🥗 **Nutritional Intelligence** — Auto-estimates calories, protein, carbs, and fats for every dish
- 🖼️ **AI Food Photography** — Visualizes your meal before you start cooking
- 👨‍🍳 **Interactive Cooking Mode** — Distraction-free step-by-step cooking with a live Q&A chatbot
- ♻️ **Waste Reducer** — Prioritizes recipes that use up what you already have
- 💾 **Real Persistence** — SQLite-backed pantry storage via a REST API

---

## 🏗️ Architecture

```
React Frontend (Vite + TypeScript)
          ↓  HTTP fetch
FastAPI Backend (Python)
          ↓
LangChain Agent  →  Google Gemini API (gemini-2.0-flash)
          ↓
    SQLite Database (SQLAlchemy async)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **AI / LLM** | LangChain (LCEL), Google Gemini `gemini-2.0-flash` |
| **Database** | SQLite, SQLAlchemy (async), Pydantic v2 |
| **DevOps** | Docker, Docker Compose |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1️⃣ Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Add your GEMINI_API_KEY
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2️⃣ Frontend

```bash
cd frontend
cp .env.example .env           # VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev
```

### 🐳 Docker

```bash
docker-compose up --build
```

---

Built with ❤️ by [Ayush Parida](https://github.com/ayushparida04)
