
import React, { useState } from 'react';
import { Shuffle, List } from 'lucide-react';
import { Button } from './Button';
import { SEO } from './SEO';

export const RandomNumberGenerator: React.FC = () => {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [count, setCount] = useState(1);
    const [allowDuplicates, setAllowDuplicates] = useState(true);
    const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
    
    const [results, setResults] = useState<number[]>([]);

    const generate = () => {
        let nums: number[] = [];
        // Safety: Swap if min > max
        const trueMin = Math.min(min, max);
        const trueMax = Math.max(min, max);
        const range = trueMax - trueMin + 1;
        
        // Safety: Don't crash browser
        const safeCount = Math.min(1000, Math.max(1, count));

        if (!allowDuplicates && safeCount > range) {
           alert("Range is too small for unique numbers.");
           return;
        }

        if (allowDuplicates) {
           for(let i=0; i<safeCount; i++) {
              nums.push(Math.floor(Math.random() * range) + trueMin);
           }
        } else {
           const set = new Set<number>();
           // Safety breakout loop
           let attempts = 0;
           while(set.size < safeCount && attempts < 10000) {
              set.add(Math.floor(Math.random() * range) + trueMin);
              attempts++;
           }
           nums = Array.from(set);
        }

        if (sort === 'asc') nums.sort((a,b) => a - b);
        if (sort === 'desc') nums.sort((a,b) => b - a);

        setResults(nums);
    };

    // Styles
    const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
    const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 text-center !text-black";

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
            <SEO 
                title="Random Number Generator - RNG Tool"
                description="Generate true random numbers within a range. Options for sorting, unique values, and generating multiple numbers at once."
                keywords="random number generator, rng, randomize numbers, random picker, number generator"
            />
            <header className="mb-2 pt-2">
               <h1 className="text-2xl font-bold text-slate-900">Random <span className="text-brand-600">Generator</span></h1>
               <p className="text-sm text-slate-500 mt-1">Generate single numbers or sequences.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
               
               {/* Left: Settings */}
               <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                       <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                          <Shuffle size={18} className="text-brand-600"/> Settings
                       </h2>
                       
                       <div className="space-y-5">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Min</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Max</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Quantity</label>
                              <div className={inputContainerClass}>
                                 <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>

                           <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <label className="flex items-center gap-3 cursor-pointer select-none w-full">
                                 <input type="checkbox" checked={allowDuplicates} onChange={e => setAllowDuplicates(e.target.checked)} className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"/>
                                 <span className="text-sm font-bold text-slate-700">Allow Duplicates</span>
                              </label>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sort Order</label>
                              <div className="flex bg-slate-100 p-1 rounded-lg">
                                 {['none', 'asc', 'desc'].map(s => (
                                    <button 
                                      key={s} 
                                      onClick={() => setSort(s as any)}
                                      className={`flex-1 py-2 rounded-md text-sm font-bold capitalize transition ${sort === s ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                       {s}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <Button onClick={generate} size="lg" className="w-full text-lg h-12 mt-2">
                              Generate
                           </Button>
                       </div>
                   </div>
               </div>

               {/* Right: Results */}
               <div className="lg:col-span-8 space-y-6">
                   <div className="bg-slate-900 rounded-2xl p-6 min-h-[300px] flex flex-col shadow-xl">
                       <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
                          <span>Result</span>
                          <span>{results.length} items</span>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto max-h-[500px] text-white scrollbar-thin scrollbar-thumb-slate-700">
                          {results.length === 0 ? (
                             <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                <List size={48} className="mb-2"/>
                                <span>Ready to generate</span>
                             </div>
                          ) : results.length === 1 ? (
                             <div className="h-full flex items-center justify-center">
                                <span className="text-[120px] font-bold tracking-tighter text-brand-400 animate-in zoom-in">{results[0]}</span>
                             </div>
                          ) : (
                             <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {results.map((n, i) => (
                                   <div key={i} className="bg-white/10 p-3 rounded-lg text-center font-mono font-bold text-lg animate-in fade-in zoom-in hover:bg-white/20 transition" style={{animationDelay: `${Math.min(i * 10, 500)}ms`}}>
                                      {n}
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                   </div>
               </div>
            </div>
        </div>
    );
};
