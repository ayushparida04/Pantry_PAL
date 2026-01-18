
import React, { useState, useEffect } from 'react';
import { AppView, Ingredient, RecipeSummary, DetailedRecipe } from './types';
import { generateRecipeSuggestions, getDetailedRecipe } from './services/geminiService';
import { PantryView } from './components/PantryView';
import { RecipeSuggestions } from './components/RecipeSuggestions';
import { RecipeDetail } from './components/RecipeDetail';
import { CookingMode } from './components/CookingMode';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PANTRY);
  const [pantry, setPantry] = useState<Ingredient[]>([]);
  const [suggestions, setSuggestions] = useState<RecipeSummary[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);
  const [loading, setLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('smart_pantry');
    if (saved) setPantry(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_pantry', JSON.stringify(pantry));
  }, [pantry]);

  const addIngredient = (input: string) => {
    // Simple parsing logic: handle "2 eggs" -> { name: "eggs", amount: "2" }
    const match = input.match(/^(\d+\s*\w*)?\s*(.*)$/);
    const amount = match?.[1]?.trim() || '';
    const name = match?.[2]?.trim() || input;
    
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name,
      amount,
      category: 'Ingredient' // AI could improve this later
    };
    setPantry([...pantry, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setPantry(pantry.filter(i => i.id !== id));
  };

  const findRecipes = async () => {
    if (pantry.length === 0) return;
    setLoading(true);
    setCurrentView(AppView.DISCOVER);
    try {
      const results = await generateRecipeSuggestions(pantry.map(i => `${i.amount} ${i.name}`));
      setSuggestions(results);
    } catch (error) {
      console.error(error);
      alert("Something went wrong finding recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = async (summary: RecipeSummary) => {
    setLoading(true);
    try {
      const detail = await getDetailedRecipe(summary.title, pantry.map(i => i.name));
      setSelectedRecipe(detail);
      setCurrentView(AppView.RECIPE_DETAIL);
    } catch (error) {
      console.error(error);
      alert("Error loading recipe details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(AppView.PANTRY)}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13zM7 13a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
          </div>
          <span className="font-serif text-xl font-bold text-slate-800 hidden sm:inline">SmartPantry AI</span>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => setCurrentView(AppView.PANTRY)}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === AppView.PANTRY ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
           >
             My Pantry
           </button>
           <button 
             onClick={() => findRecipes()}
             disabled={pantry.length === 0}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === AppView.DISCOVER ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'} disabled:opacity-50`}
           >
             Discovery
           </button>
        </div>
      </nav>

      <main className="container mx-auto mt-8">
        {currentView === AppView.PANTRY && (
          <PantryView 
            ingredients={pantry} 
            onAdd={addIngredient} 
            onRemove={removeIngredient}
            onClear={() => setPantry([])}
            onSuggest={findRecipes}
          />
        )}

        {currentView === AppView.DISCOVER && (
          <RecipeSuggestions 
            recipes={suggestions} 
            onSelect={handleSelectRecipe} 
            onBack={() => setCurrentView(AppView.PANTRY)}
            loading={loading}
          />
        )}

        {currentView === AppView.RECIPE_DETAIL && selectedRecipe && (
          <RecipeDetail 
            recipe={selectedRecipe}
            onBack={() => setCurrentView(AppView.DISCOVER)}
            onCook={() => setCurrentView(AppView.COOKING_MODE)}
          />
        )}

        {currentView === AppView.COOKING_MODE && selectedRecipe && (
          <CookingMode 
            recipe={selectedRecipe}
            onExit={() => setCurrentView(AppView.RECIPE_DETAIL)}
          />
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
