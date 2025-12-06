
import React, { useState } from 'react';
import { Box, Cylinder, Construction, ShoppingBag } from 'lucide-react';
import { SEO } from './SEO';

export const ConcreteCalculator: React.FC = () => {
  const [type, setType] = useState<'slab' | 'column'>('slab');
  
  // Dimensions
  const [len, setLen] = useState(10); // ft
  const [width, setWidth] = useState(10); // ft
  const [depth, setDepth] = useState(4); // inches
  
  const [height, setHeight] = useState(10); // ft
  const [diameter, setDiameter] = useState(12); // inches
  
  const [quantity, setQuantity] = useState(1);

  const calculate = () => {
    let volCuFt = 0;
    
    // Safety: Use absolute values to prevent negative volumes from typos
    if (type === 'slab') {
        volCuFt = Math.abs(len) * Math.abs(width) * (Math.abs(depth) / 12);
    } else {
        const radiusFt = (Math.abs(diameter) / 2) / 12;
        volCuFt = Math.PI * Math.pow(radiusFt, 2) * Math.abs(height);
    }

    volCuFt *= Math.abs(quantity);

    const volCuYd = volCuFt / 27;
    const bags60 = volCuFt / 0.45; // Approx 0.45 cu ft per 60lb bag
    const bags80 = volCuFt / 0.60; // Approx 0.60 cu ft per 80lb bag

    return { volCuFt, volCuYd, bags60, bags80 };
  };

  const res = calculate();

  // Styles
  const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
  const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Concrete Calculator - Slabs & Columns"
        description="Calculate concrete volume in cubic yards and estimate the number of 60lb or 80lb premix bags needed for slabs, footings, and columns."
        keywords="concrete calculator, cement calculator, slab calculator, cubic yards calculator, premix bags calculator, construction calculator"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Concrete <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Estimate volume and premix bags needed.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                   <Construction size={18} className="text-brand-600"/> Project Details
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Shape</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                           <button onClick={() => setType('slab')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition ${type === 'slab' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                             <Box size={16}/> Slab / Footing
                           </button>
                           <button onClick={() => setType('column')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition ${type === 'column' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                             <Cylinder size={16}/> Column
                           </button>
                        </div>
                    </div>

                    {type === 'slab' ? (
                       <div className="space-y-4">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Length (ft)</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={len} onChange={e => setLen(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Width (ft)</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Depth (inches)</label>
                              <div className={inputContainerClass}>
                                 <input type="number" value={depth} onChange={e => setDepth(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                       </div>
                    ) : (
                       <div className="space-y-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Height (ft)</label>
                              <div className={inputContainerClass}>
                                 <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Diameter (inches)</label>
                              <div className={inputContainerClass}>
                                 <input type="number" value={diameter} onChange={e => setDiameter(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                       </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Quantity</label>
                        <div className={inputContainerClass}>
                           <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                        </div>
                    </div>
                </div>
            </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
             {/* Volume Card */}
             <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-center h-[200px]">
                 <div className="relative z-10">
                     <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Required Volume</div>
                     <div className="flex items-baseline gap-3">
                        <div className="text-6xl font-bold tracking-tight">{res.volCuYd.toFixed(2)}</div>
                        <div className="text-xl font-medium text-slate-400">cubic yards</div>
                     </div>
                     <div className="mt-2 text-sm text-brand-400 font-mono font-bold">
                        {res.volCuFt.toFixed(2)} cubic feet
                     </div>
                 </div>
                 <div className="absolute right-0 bottom-0 p-6 opacity-5">
                    <Construction size={180} />
                 </div>
             </div>

             {/* Bags Card */}
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-brand-600"/> Premix Bags Needed
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-bold text-slate-900 mb-1">{Math.ceil(res.bags60)}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">60lb Bags</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl font-bold text-slate-900 mb-1">{Math.ceil(res.bags80)}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">80lb Bags</div>
                    </div>
                 </div>
                 <p className="text-center text-xs text-slate-400 mt-6">
                    Estimates include spill waste allowance. Always buy 5-10% extra.
                 </p>
             </div>
         </div>
      </div>
    </div>
  );
};
