
import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';
import { SEO } from './SEO';

export const PercentageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState(15);
  const [val1B, setVal1B] = useState(200);
  const res1 = (val1A / 100) * val1B;

  // Mode 2: X is what % of Y?
  const [val2A, setVal2A] = useState(25);
  const [val2B, setVal2B] = useState(100);
  const res2 = val2B === 0 ? 0 : (val2A / val2B) * 100;

  // Mode 3: Percentage Change
  const [val3A, setVal3A] = useState(50);
  const [val3B, setVal3B] = useState(75);
  const res3 = val3A === 0 ? 0 : ((val3B - val3A) / val3A) * 100;
  const isIncrease = res3 > 0;

  const tabs = [
    { label: 'What is X% of Y?' },
    { label: 'X is what % of Y?' },
    { label: '% Change' },
  ];

  // Styles
  const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
  const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
       <SEO 
         title="Percentage Calculator - Change, Difference & Phrases"
         description="Calculate percentages easily. 'What is X% of Y?', 'X is what percent of Y?', and Percentage Change calculator."
         keywords="percentage calculator, percent calculator, percentage change, calculate percentage, math calculator"
       />
       <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Percentage <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Calculate percentages, increases, and decreases.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Percent size={18} className="text-brand-600"/> Calculation Mode
                 </h2>
                 
                 <div className="space-y-6">
                     <div className="flex flex-col gap-2">
                        {tabs.map((tab, idx) => (
                           <button
                             key={idx}
                             onClick={() => setActiveTab(idx)}
                             className={`px-4 py-3 rounded-xl text-sm font-bold text-left transition-all border ${activeTab === idx ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                           >
                             {tab.label}
                           </button>
                        ))}
                     </div>

                     <div className="border-t border-slate-100 pt-6 space-y-4">
                        {activeTab === 0 && (
                           <>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Percentage (X)</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={val1A} onChange={e => setVal1A(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                    <span className="text-slate-400 font-bold">%</span>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Value (Y)</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={val1B} onChange={e => setVal1B(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                           </>
                        )}
                        {activeTab === 1 && (
                           <>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Value (X)</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={val2A} onChange={e => setVal2A(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Total (Y)</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={val2B} onChange={e => setVal2B(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                           </>
                        )}
                        {activeTab === 2 && (
                           <>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Old Value</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={val3A} onChange={e => setVal3A(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">New Value</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={val3B} onChange={e => setVal3B(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                           </>
                        )}
                     </div>
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
             <div className="bg-slate-900 text-white rounded-2xl p-10 shadow-xl flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                 <div className="relative z-10 text-center w-full">
                     <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Calculated Result</div>
                     
                     {activeTab === 0 && (
                        <div className="text-7xl md:text-8xl font-extrabold tracking-tighter mb-2 break-all">{parseFloat(res1.toFixed(2))}</div>
                     )}
                     
                     {activeTab === 1 && (
                        <div className="text-7xl md:text-8xl font-extrabold tracking-tighter mb-2 break-all">{parseFloat(res2.toFixed(2))}<span className="text-4xl text-slate-500">%</span></div>
                     )}

                     {activeTab === 2 && (
                        <div>
                           <div className={`text-7xl md:text-8xl font-extrabold tracking-tighter mb-2 flex items-center justify-center gap-2 flex-wrap break-all ${isIncrease ? 'text-emerald-400' : res3 < 0 ? 'text-red-400' : 'text-white'}`}>
                              {res3 > 0 && '+'}
                              {parseFloat(res3.toFixed(2))}<span className="text-4xl opacity-50">%</span>
                           </div>
                           <div className="text-lg font-bold text-slate-400">
                              {res3 === 0 ? 'No Change' : isIncrease ? 'Increase' : 'Decrease'}
                           </div>
                        </div>
                     )}
                 </div>
                 
                 {/* Visual Bar */}
                 {activeTab === 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-800">
                       <div style={{ width: `${Math.min(val1A, 100)}%` }} className="h-full bg-brand-500 transition-all duration-500"></div>
                    </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};
