
import React, { useState } from 'react';
import { Ingredient } from '../types';

interface PantryViewProps {
  ingredients: Ingredient[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSuggest: () => void;
}

export const PantryView: React.FC<PantryViewProps> = ({ ingredients, onAdd, onRemove, onClear, onSuggest }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const categories = Array.from(new Set(ingredients.map(i => i.category)));

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fadeIn">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-serif text-slate-800">My Pantry</h1>
        <p className="text-slate-500">What's in your kitchen today?</p>
      </header>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter ingredient (e.g. Chicken breast, 2 eggs, Milk...)"
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm transition-all"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <p>Your pantry is empty. Add some ingredients to start cooking!</p>
          </div>
        ) : (
          ingredients.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">{item.category}</span>
                <span className="text-lg font-medium text-slate-700">{item.name}</span>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
          <button
            onClick={onSuggest}
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            Find Recipes
          </button>
          <button
            onClick={onClear}
            className="sm:w-32 py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
