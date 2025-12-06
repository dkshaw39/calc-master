
import React, { useState } from 'react';
import { Button } from './Button';
import { Utensils, Zap, Scale, Ruler, User } from 'lucide-react';
import { SEO } from './SEO';

export const CalorieCalculator: React.FC = () => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState('maintain'); // cut, bulk, maintain
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    // Validate inputs
    const w = Math.max(1, weight);
    const h = Math.max(1, height);
    const a = Math.max(1, age);

    // Mifflin-St Jeor Equation
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    const tdee = Math.round(bmr * activity);
    
    // Adjust for Goal
    let target = tdee;
    if (goal === 'cut') target = tdee - 500;
    if (goal === 'bulk') target = tdee + 500;
    
    setResult(Math.max(0, target));
  };

  // Macro Splits
  const getMacros = (cals: number, type: 'balanced' | 'lowcarb' | 'highprotein') => {
      let ratios = { c: 0.4, p: 0.3, f: 0.3 };
      if (type === 'lowcarb') ratios = { c: 0.2, p: 0.4, f: 0.4 };
      if (type === 'highprotein') ratios = { c: 0.3, p: 0.4, f: 0.3 };

      return {
          c: Math.round((cals * ratios.c) / 4),
          p: Math.round((cals * ratios.p) / 4),
          f: Math.round((cals * ratios.f) / 9)
      };
  };

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Calorie Calculator & Macro Planner"
        description="Calculate your daily calorie needs for weight loss (cut), maintenance, or muscle gain (bulk). Get a personalized macro nutrient breakdown."
        keywords="calorie calculator, macro calculator, tdee calculator, daily calorie intake, weight loss calculator, bulking calculator"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Calorie <span className="text-brand-600">Planner</span></h1>
        <p className="text-sm text-slate-500">Calculate calories, macros, and zig-zag schedules.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                 <Utensils size={18} className="text-brand-600"/> Your Stats
              </h2>
              
              <div className="space-y-5">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Gender</label>
                     <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${gender === 'male' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Male</button>
                        <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${gender === 'female' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Female</button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Age</label>
                     <div className={inputContainerClass}>
                        <div className={iconClass}><User size={18}/></div>
                        <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Height (cm)</label>
                        <div className={inputContainerClass}>
                           <div className={iconClass}><Ruler size={18}/></div>
                           <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
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
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Activity</label>
                     <div className={inputContainerClass}>
                        <select 
                           value={activity} 
                           onChange={e => setActivity(Number(e.target.value))} 
                           className={`${fieldClass} cursor-pointer bg-transparent`}
                           style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                        >
                           <option value={1.2}>Sedentary (Office job)</option>
                           <option value={1.375}>Light Exercise (1-2 days)</option>
                           <option value={1.55}>Moderate Exercise (3-5 days)</option>
                           <option value={1.725}>Heavy Exercise (6-7 days)</option>
                           <option value={1.9}>Athlete (2x per day)</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Goal</label>
                     <div className="grid grid-cols-3 gap-2">
                        {['cut', 'maintain', 'bulk'].map(g => (
                           <button 
                             key={g} 
                             onClick={() => setGoal(g)} 
                             className={`py-3 rounded-lg font-bold text-xs uppercase border transition ${goal === g ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                           >
                              {g}
                           </button>
                        ))}
                     </div>
                  </div>

                  <Button onClick={calculate} size="lg" className="w-full mt-4 h-12 text-base">Calculate Plan</Button>
              </div>
           </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8 space-y-6">
           {result !== null ? (
               <>
                 {/* Top Hero */}
                 <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                     <div className="relative z-10">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Daily Target</div>
                        <div className="text-5xl lg:text-6xl font-bold tracking-tight mb-2">{result.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">Calories per day</div>
                     </div>
                     <div className="relative z-10 flex gap-4">
                         <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-brand-400">{Math.round(result * 7).toLocaleString()}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">Weekly Total</div>
                         </div>
                     </div>
                     {/* BG Decor */}
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                        <Zap size={150} />
                     </div>
                 </div>

                 {/* Macros Grid */}
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">Macro Nutrient Splits</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { name: 'Balanced', type: 'balanced', color: 'bg-blue-500' },
                        { name: 'Low Carb', type: 'lowcarb', color: 'bg-emerald-500' },
                        { name: 'High Protein', type: 'highprotein', color: 'bg-rose-500' }
                    ].map((plan: any) => {
                        const m = getMacros(result, plan.type);
                        return (
                            <div key={plan.name} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
                                <div className={`h-1 w-8 rounded-full mb-3 ${plan.color}`}></div>
                                <h3 className="font-bold text-slate-800 mb-2">{plan.name}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between text-slate-600"><span>Carbs</span> <span className="font-bold text-slate-900">{m.c}g</span></div>
                                    <div className="flex justify-between text-slate-600"><span>Protein</span> <span className="font-bold text-slate-900">{m.p}g</span></div>
                                    <div className="flex justify-between text-slate-600"><span>Fats</span> <span className="font-bold text-slate-900">{m.f}g</span></div>
                                </div>
                            </div>
                        );
                    })}
                 </div>

                 {/* Zig Zag Schedule */}
                 <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Zig-Zag Schedule (Prevents Adaptation)</h3>
                    </div>
                    <div className="grid grid-cols-7 divide-x divide-slate-100 overflow-x-auto">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            let mult = 1.0;
                            let style = "text-slate-600";
                            if ([0, 2, 4].includes(i)) { mult = 1.15; style = "text-red-500 font-bold"; } // High
                            else if ([1, 3].includes(i)) { mult = 0.85; style = "text-blue-500 font-bold"; } // Low
                            else { mult = 1.0; style = "text-slate-900 font-medium"; }

                            return (
                                <div key={day} className="p-4 text-center min-w-[60px]">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">{day}</div>
                                    <div className={`text-sm ${style}`}>{Math.round(result * mult)}</div>
                                </div>
                            );
                        })}
                    </div>
                 </div>

               </>
           ) : (
               <div className="h-full flex items-center justify-center text-slate-400 p-12 bg-white rounded-2xl border border-dashed border-slate-300 min-h-[300px]">
                   <div className="text-center">
                       <Utensils size={48} className="mx-auto mb-4 opacity-50"/>
                       <p className="font-medium">Enter your details to generate a plan</p>
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
