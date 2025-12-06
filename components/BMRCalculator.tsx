
import React, { useState } from 'react';
import { Flame, Activity, User, Ruler, Scale } from 'lucide-react';
import { SEO } from './SEO';

export const BMRCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(70); // kg
  const [formula, setFormula] = useState('mifflin');

  const calculateBMR = () => {
    let bmr = 0;
    if (formula === 'mifflin') {
       // Mifflin-St Jeor
       bmr = (10 * weight) + (6.25 * height) - (5 * age);
       bmr += gender === 'male' ? 5 : -161;
    } else {
       // Harris-Benedict (Revised)
       if (gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
       } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
       }
    }
    return Math.round(bmr);
  };

  const bmr = calculateBMR();
  
  const multipliers = [
     { label: 'Sedentary', factor: 1.2, desc: 'Little or no exercise' },
     { label: 'Lightly Active', factor: 1.375, desc: 'Exercise 1-3 days/week' },
     { label: 'Moderately Active', factor: 1.55, desc: 'Exercise 3-5 days/week' },
     { label: 'Very Active', factor: 1.725, desc: 'Hard exercise 6-7 days/week' },
     { label: 'Extra Active', factor: 1.9, desc: 'Very hard exercise & physical job' },
  ];

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="BMR Calculator - Basal Metabolic Rate"
        description="Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Find out how many calories you burn at rest."
        keywords="bmr calculator, basal metabolic rate, tdee calculator, calorie needs, metabolism calculator"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">BMR <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Calculate your daily calorie needs.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
               <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Activity size={18} className="text-brand-600"/> Your Details
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
                          <div className={iconClass}><User size={18}/></div>
                          <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Weight (kg)</label>
                       <div className={inputContainerClass}>
                          <div className={iconClass}><Scale size={18}/></div>
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

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Equation</label>
                     <div className={inputContainerClass}>
                        <select 
                           value={formula} 
                           onChange={e => setFormula(e.target.value)} 
                           className={`${fieldClass} bg-transparent cursor-pointer`}
                           style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                        >
                           <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
                           <option value="harris">Harris-Benedict</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex items-center justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Your BMR</div>
                  <div className="text-6xl font-bold tracking-tight">{bmr.toLocaleString()}</div>
                  <div className="text-sm text-slate-400 mt-2 font-medium">Calories burned at rest / day</div>
               </div>
               <div className="absolute right-8 top-1/2 -translate-y-1/2 p-6 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                  <Flame size={60} className="text-amber-500"/>
               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Total Daily Energy Expenditure (TDEE)</h3>
               </div>
               <div className="divide-y divide-slate-100">
                  {multipliers.map((m) => (
                     <div key={m.label} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition gap-2">
                        <div>
                           <div className="font-bold text-slate-800 text-base">{m.label}</div>
                           <div className="text-xs text-slate-500">{m.desc}</div>
                        </div>
                        <div className="font-mono font-bold text-lg text-brand-600 bg-brand-50 px-4 py-2 rounded-lg border border-brand-100">
                           {Math.round(bmr * m.factor).toLocaleString()} <span className="text-xs font-normal text-brand-400">kcal</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
