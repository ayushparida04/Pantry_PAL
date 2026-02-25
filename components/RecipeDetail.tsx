
import React, { useEffect, useState } from 'react';
import { DetailedRecipe } from '../types';
import { generateRecipeImage } from '../services/geminiService';

interface RecipeDetailProps {
  recipe: DetailedRecipe;
  onBack: () => void;
  onCook: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, onCook }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoadingImage(true);
      const imgUrl = await generateRecipeImage(recipe.title);
      setImage(imgUrl);
      setLoadingImage(false);
    };
    fetchImage();
  }, [recipe.title]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-fadeIn pb-24">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-3xl font-serif text-slate-800">Recipe Details</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Meta */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-200 aspect-video shadow-2xl">
            {image ? (
              <img src={image} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                {loadingImage ? (
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                ) : (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
                <p className="text-sm">AI Visualization</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
              <h1 className="text-4xl font-bold text-white leading-tight">{recipe.title}</h1>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Step-by-Step Instructions
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step) => (
                <div key={step.step} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    {step.step}
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-700 leading-relaxed text-lg">{step.text}</p>
                    {step.tip && (
                      <p className="text-sm bg-amber-50 text-amber-800 p-3 rounded-lg border-l-4 border-amber-400">
                        <strong>Pro Tip:</strong> {step.tip}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ingredients & Stats */}
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl">
             <h3 className="text-xl font-bold mb-6">Pantry Check</h3>
             <ul className="space-y-4">
               {recipe.ingredients.map((ing, i) => (
                 <li key={i} className="flex items-start justify-between gap-4">
                   <div className="flex flex-col">
                     <span className={`font-medium ${ing.isPantryItem ? 'text-white' : 'text-emerald-400'}`}>
                       {ing.name}
                     </span>
                     <span className="text-xs opacity-70">{ing.amount}</span>
                   </div>
                   {ing.isPantryItem ? (
                     <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                   ) : (
                     <span className="text-[10px] bg-emerald-800 px-2 py-1 rounded-full text-emerald-300 font-bold uppercase tracking-tight">Need to buy</span>
                   )}
                 </li>
               ))}
             </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Nutrition (per serving)</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl text-center">
                 <span className="block text-2xl font-bold text-slate-800">{recipe.nutrition.calories}</span>
                 <span className="text-xs text-slate-400 uppercase">Calories</span>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl text-center">
                 <span className="block text-2xl font-bold text-slate-800">{recipe.nutrition.protein}</span>
                 <span className="text-xs text-slate-400 uppercase">Protein</span>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl text-center">
                 <span className="block text-2xl font-bold text-slate-800">{recipe.nutrition.carbs}</span>
                 <span className="text-xs text-slate-400 uppercase">Carbs</span>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl text-center">
                 <span className="block text-2xl font-bold text-slate-800">{recipe.nutrition.fats}</span>
                 <span className="text-xs text-slate-400 uppercase">Fats</span>
               </div>
            </div>
          </div>

          {recipe.substitutions.length > 0 && (
            <div className="bg-slate-50 rounded-3xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Smart Substitutions</h3>
              <ul className="space-y-2">
                {recipe.substitutions.map((sub, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-emerald-500">•</span> {sub}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-center z-50">
        <button
          onClick={onCook}
          className="w-full max-w-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Start Guided Cooking
        </button>
      </div>
    </div>
  );
};
