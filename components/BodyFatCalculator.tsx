
import React, { useState } from 'react';
import { Activity, Ruler, Scale, User } from 'lucide-react';
import { SEO } from './SEO';

export const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(175); // cm
  const [neck, setNeck] = useState(35); // cm
  const [waist, setWaist] = useState(80); // cm
  const [hip, setHip] = useState(95); // cm (female only)
  
  const calculate = () => {
    // US Navy Method
    let bf = 0;
    // Safety: Log arguments must be positive
    // Male: waist - neck
    // Female: waist + hip - neck
    
    if (gender === 'male') {
        const val = waist - neck;
        if (val <= 0) return 0; // Invalid measurement
        bf = 495 / (1.0324 - 0.19077 * Math.log10(val) + 0.15456 * Math.log10(height)) - 450;
    } else {
        const val = waist + hip - neck;
        if (val <= 0) return 0; // Invalid measurement
        bf = 495 / (1.29579 - 0.35004 * Math.log10(val) + 0.22100 * Math.log10(height)) - 450;
    }
    
    if (isNaN(bf) || !isFinite(bf)) return 0;
    return Math.max(2, Math.min(bf, 60)); 
  };

  const bodyFat = calculate();
  const fatMass = weight * (bodyFat / 100);
  const leanMass = weight - fatMass;

  const getCategory = (bf: number, g: string) => {
     if (bf === 0) return { label: 'Invalid Data', color: 'text-slate-400', bg: 'bg-slate-100' };
     
     if (g === 'male') {
         if (bf < 6) return { label: 'Essential Fat', color: 'text-blue-600', bg: 'bg-blue-50' };
         if (bf < 14) return { label: 'Athletes', color: 'text-green-600', bg: 'bg-green-50' };
         if (bf < 18) return { label: 'Fitness', color: 'text-green-500', bg: 'bg-green-50' };
         if (bf < 25) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-50' };
         return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
     } else {
         if (bf < 14) return { label: 'Essential Fat', color: 'text-blue-600', bg: 'bg-blue-50' };
         if (bf < 21) return { label: 'Athletes', color: 'text-green-600', bg: 'bg-green-50' };
         if (bf < 25) return { label: 'Fitness', color: 'text-green-500', bg: 'bg-green-50' };
         if (bf < 32) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-50' };
         return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
     }
  };

  const category = getCategory(bodyFat, gender);

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Body Fat Calculator - US Navy Method"
        description="Calculate body fat percentage using the accurate US Navy Tape Measure method. Get a breakdown of lean mass vs. fat mass."
        keywords="body fat calculator, navy method calculator, body composition, lean mass calculator, body fat percentage"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Body Fat <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Estimate body fat using the Navy Method.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <User size={18} className="text-brand-600"/> Measurements
                 </h2>

                 <div className="space-y-5">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Gender</label>
                       <div className="flex bg-slate-100 p-1 rounded-lg">
                         <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${gender === 'male' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Male</button>
                         <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${gender === 'female' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Female</button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Age</label>
                          <div className={inputContainerClass}>
                             <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Weight (kg)</label>
                          <div className={inputContainerClass}>
                             <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                          </div>
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Height (cm)</label>
                       <div className={inputContainerClass}>
                          <div className={iconClass}><Ruler size={18}/></div>
                          <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-4">Tape Measurements (cm)</h3>
                        <div className="space-y-4">
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Neck</label>
                               <div className={inputContainerClass}>
                                  <input type="number" value={neck} onChange={e => setNeck(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                               </div>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Waist (at navel)</label>
                               <div className={inputContainerClass}>
                                  <input type="number" value={waist} onChange={e => setWaist(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                               </div>
                            </div>
                            {gender === 'female' && (
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Hip (at widest)</label>
                                   <div className={inputContainerClass}>
                                      <input type="number" value={hip} onChange={e => setHip(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                   </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-center h-[250px]">
                <div className="relative z-10">
                   <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Estimated Body Fat</div>
                   <div className="text-6xl font-bold tracking-tight mb-4 flex items-baseline gap-2">
                      {bodyFat.toFixed(1)} <span className="text-2xl text-slate-400 font-medium">%</span>
                   </div>
                   <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${category.bg} ${category.color}`}>
                      {category.label}
                   </div>
                </div>
                <div className="absolute right-0 bottom-0 p-6 opacity-10">
                   <Activity size={150} />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Scale size={18} className="text-brand-600"/> Composition Breakdown
               </h3>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-slate-700">Fat Mass</span>
                        <span className="text-slate-900">{fatMass.toFixed(1)} kg</span>
                     </div>
                     <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.min(100, bodyFat)}%` }} className="h-full bg-amber-500 transition-all duration-1000"></div>
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-slate-700">Lean Mass</span>
                        <span className="text-slate-900">{leanMass.toFixed(1)} kg</span>
                     </div>
                     <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.max(0, 100 - bodyFat)}%` }} className="h-full bg-brand-600 transition-all duration-1000"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
