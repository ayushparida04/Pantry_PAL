
import React from 'react';

interface GuideViewProps {
  onQuickAdd: (items: string[]) => void;
  onNavigateToPantry: () => void;
}

export const GuideView: React.FC<GuideViewProps> = ({ onQuickAdd, onNavigateToPantry }) => {
  const features = [
    {
      title: "🧠 AI-Generated Recipes",
      desc: "Gemini analyzes your pantry to create unique, delicious recipes that minimize waste.",
      icon: "✨",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "📋 Smart Parsing",
      desc: "Type naturally like '2 eggs' or 'half a cup of milk'. Our AI understands quantities perfectly.",
      icon: "🔍",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "👨‍🍳 Cooking Mode",
      desc: "Step-by-step guided mode with progress tracking and professional chef tips.",
      icon: "🔪",
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "📊 Nutrition Check",
      desc: "Get instant estimates for calories, protein, and more for every generated meal.",
      icon: "🥗",
      color: "bg-rose-50 text-rose-600"
    }
  ];

  const quickPantryItems = [
    "Eggs", "Milk", "Bread", "Chicken", "Rice", "Onion", "Garlic", "Pasta"
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-16 animate-fadeIn pb-24">
      <header className="text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold tracking-wide uppercase">
          Now Powered by Gemini 3
        </div>
        <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">Your Kitchen,<br/><span className="text-emerald-600">Reimagined.</span></h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          The ultimate intelligent companion for home cooks. Stop wondering what's for dinner and start cooking with what you already have.
        </p>
      </header>

      {/* Interactive Quick Start */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Ready to Start?</h2>
          <p className="text-slate-500">Add some basics to your pantry with one tap:</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {quickPantryItems.map((item) => (
            <button
              key={item}
              onClick={() => onQuickAdd([item])}
              className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-medium hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-95"
            >
              + {item}
            </button>
          ))}
        </div>
        <div className="flex justify-center pt-4">
           <button 
             onClick={onNavigateToPantry}
             className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2 group"
           >
             Go to My Pantry
             <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
           </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex gap-6">
            <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {f.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Visual Roadmap / Steps */}
      <section className="bg-slate-900 rounded-[3.5rem] p-10 md:p-20 text-white overflow-hidden relative shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif italic">How it works</h2>
            <div className="space-y-10">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg shadow-emerald-500/20">1</div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold">Stock Up</h4>
                  <p className="text-slate-400">Add ingredients manually or use our smart suggestions.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg shadow-emerald-500/20">2</div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold">Discover</h4>
                  <p className="text-slate-400">Gemini analyzes compatibility and generates low-waste recipes.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg shadow-emerald-500/20">3</div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold">Execute</h4>
                  <p className="text-slate-400">Follow interactive steps with tips designed by culinary AI.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
             <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl absolute inset-0"></div>
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative z-10 rotate-3 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-white/20 rounded-full"></div>
                  <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="h-20 bg-emerald-500/20 rounded-2xl border border-emerald-500/30"></div>
                    <div className="h-20 bg-blue-500/20 rounded-2xl border border-blue-500/30"></div>
                  </div>
                  <div className="h-4 w-full bg-white/10 rounded-full"></div>
                  <div className="h-32 bg-slate-800 rounded-2xl"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-12 border-t border-slate-200">
        <p className="text-slate-400 text-sm font-medium">SmartPantry AI © 2025</p>
        <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
          <span>Gemini-Powered</span>
          <span>Zero-Waste</span>
          <span>Open Source</span>
        </div>
      </footer>
    </div>
  );
};
