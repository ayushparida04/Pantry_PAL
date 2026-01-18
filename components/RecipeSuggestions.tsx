
import React from 'react';
import { RecipeSummary } from '../types';

interface RecipeSuggestionsProps {
  recipes: RecipeSummary[];
  onSelect: (recipe: RecipeSummary) => void;
  onBack: () => void;
  loading: boolean;
}

export const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ recipes, onSelect, onBack, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-medium text-slate-600">Gemini is curating recipes for you...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-3xl font-serif text-slate-800">Suggested Recipes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => onSelect(recipe)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="h-48 bg-slate-200 flex items-center justify-center relative">
               <img src={`https://picsum.photos/seed/${recipe.id}/400/300`} className="w-full h-full object-cover opacity-80" alt={recipe.title} />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                 {recipe.matchPercentage}% Match
               </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{recipe.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{recipe.description}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-auto pt-4 border-t border-slate-50">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {recipe.prepTime}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
