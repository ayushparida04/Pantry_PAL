
import React, { useState } from 'react';
import { DetailedRecipe } from '../types';

interface CookingModeProps {
  recipe: DetailedRecipe;
  onExit: () => void;
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = recipe.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const step = recipe.instructions[currentStep];

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col overflow-hidden text-white">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
           <button onClick={onExit} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           <div>
             <h2 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">{recipe.title}</h2>
             <p className="text-slate-400 text-sm">Step {currentStep + 1} of {totalSteps}</p>
           </div>
        </div>
        <div className="hidden md:block w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
           <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Step Guide */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-4xl mx-auto space-y-12">
           <div className="space-y-4">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Current Task</span>
              <h3 className="text-4xl md:text-6xl font-bold leading-tight animate-slideUp">
                {step.text}
              </h3>
           </div>

           {step.tip && (
             <div className="bg-emerald-900/40 p-8 rounded-3xl border border-emerald-500/30 flex gap-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                  <h4 className="font-bold text-emerald-300 text-lg mb-2">Chef's Advice</h4>
                  <p className="text-slate-200 text-lg">{step.tip}</p>
               </div>
             </div>
           )}
        </div>

        {/* Sidebar Ingredients (Desktop) */}
        <div className="hidden lg:block w-80 bg-slate-800/50 p-8 overflow-y-auto">
          <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-6">Ingredients</h4>
          <ul className="space-y-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between items-center gap-4 text-sm">
                <span className="text-slate-100">{ing.name}</span>
                <span className="text-slate-500 font-mono text-xs">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Progress Bar (Mobile) */}
      <div className="md:hidden w-full h-1 bg-slate-800">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Navigation Controls */}
      <div className="p-8 md:p-12 flex items-center justify-between max-w-6xl mx-auto w-full">
         <button
           onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
           disabled={currentStep === 0}
           className="px-8 py-4 text-lg font-bold text-slate-400 hover:text-white disabled:opacity-0 transition-all flex items-center gap-3"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
           Previous
         </button>

         {currentStep < totalSteps - 1 ? (
           <button
             onClick={() => setCurrentStep(prev => prev + 1)}
             className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-12 py-5 rounded-2xl shadow-2xl shadow-emerald-900/50 transition-all transform hover:scale-105 active:scale-95 text-xl flex items-center gap-3"
           >
             Next Step
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
           </button>
         ) : (
           <button
             onClick={onExit}
             className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-12 py-5 rounded-2xl shadow-2xl transition-all transform hover:scale-105 text-xl flex items-center gap-3"
           >
             Finish Cooking
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
           </button>
         )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
