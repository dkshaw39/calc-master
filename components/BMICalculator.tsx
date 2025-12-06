
import React, { useState } from 'react';
import { Activity, Info, Scale, Ruler } from 'lucide-react';
import { SEO } from './SEO';

export const BMICalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(175); // cm
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Imperial specific inputs (converted to metric for calculation)
  const [weightLbs, setWeightLbs] = useState(154);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);

  const calculate = () => {
    let w = unit === 'metric' ? weight : weightLbs * 0.453592;
    let h = unit === 'metric' ? height : (heightFt * 30.48) + (heightIn * 2.54);
    
    // Safety check
    if (h <= 0 || w <= 0) return { bmi: 0, pi: 0, idealDevine: 0, healthyRange: { min: 0, max: 0 } };

    const hM = h / 100; // height in meters

    // 1. BMI
    const bmi = w / (hM * hM);

    // 2. Ponderal Index (kg/m^3)
    const pi = w / (hM * hM * hM);

    // 3. Ideal Weight Formulas (Devine)
    const heightInInches = h * 0.393701;
    let idealBase = 0;
    
    if (gender === 'male') {
        idealBase = 50 + 2.3 * (heightInInches - 60);
    } else {
        idealBase = 45.5 + 2.3 * (heightInInches - 60);
    }

    const minHealthy = 18.5 * (hM * hM);
    const maxHealthy = 25 * (hM * hM);

    return {
        bmi,
        pi,
        idealDevine: idealBase,
        healthyRange: { min: minHealthy, max: maxHealthy }
    };
  };

  const stats = calculate();

  const getStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-50', panel: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-green-500', bg: 'bg-green-50', panel: 'bg-green-50' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-500', bg: 'bg-orange-500', panel: 'bg-orange-50' };
    return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-500', panel: 'bg-red-50' };
  };

  const status = getStatus(stats.bmi);

  const getRotation = (bmi: number) => {
      const minVal = 15;
      const maxVal = 40;
      const clamped = Math.max(minVal, Math.min(maxVal, bmi));
      return ((clamped - minVal) / (maxVal - minVal)) * 180;
  };

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="BMI Calculator for Men & Women - Metric & Imperial"
        description="Calculate your Body Mass Index (BMI) instantly. Supports Metric (kg/cm) and Imperial (lbs/ft). See your ideal weight range and health category."
        keywords="bmi calculator, body mass index, bmi calculator for women, bmi calculator for men, ideal weight calculator, kg to lbs bmi"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">BMI <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Check your Body Mass Index and ideal weight.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                   <Scale size={18} className="text-brand-600"/> Body Stats
                </h2>
                
                <div className="space-y-5">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">System</label>
                       <div className="flex bg-slate-100 p-1 rounded-lg">
                           <button onClick={() => setUnit('metric')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${unit === 'metric' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Metric</button>
                           <button onClick={() => setUnit('imperial')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${unit === 'imperial' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Imperial</button>
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Gender</label>
                       <div className="flex bg-slate-100 p-1 rounded-lg">
                           <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${gender === 'male' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Male</button>
                           <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-md font-bold text-sm transition ${gender === 'female' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>Female</button>
                       </div>
                    </div>

                    {unit === 'metric' ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Height (cm)</label>
                                <div className={inputContainerClass}>
                                    <div className="pl-3 pr-2 text-slate-400"><Ruler size={18}/></div>
                                    <input 
                                        type="number" 
                                        value={height} 
                                        onChange={e => setHeight(Number(e.target.value))} 
                                        className={fieldClass}
                                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Weight (kg)</label>
                                <div className={inputContainerClass}>
                                    <div className="pl-3 pr-2 text-slate-400"><Scale size={18}/></div>
                                    <input 
                                        type="number" 
                                        value={weight} 
                                        onChange={e => setWeight(Number(e.target.value))} 
                                        className={fieldClass}
                                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Height</label>
                                <div className="flex gap-2">
                                    <div className={`${inputContainerClass} flex-1 min-w-0`}>
                                        <input 
                                            type="number" 
                                            placeholder="ft" 
                                            value={heightFt} 
                                            onChange={e => setHeightFt(Number(e.target.value))} 
                                            className={fieldClass}
                                            style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                        />
                                        <div className="pr-3 text-slate-400 font-bold text-sm">ft</div>
                                    </div>
                                    <div className={`${inputContainerClass} flex-1 min-w-0`}>
                                        <input 
                                            type="number" 
                                            placeholder="in" 
                                            value={heightIn} 
                                            onChange={e => setHeightIn(Number(e.target.value))} 
                                            className={fieldClass}
                                            style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                        />
                                        <div className="pr-3 text-slate-400 font-bold text-sm">in</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Weight (lbs)</label>
                                <div className={inputContainerClass}>
                                    <div className="pl-3 pr-2 text-slate-400"><Scale size={18}/></div>
                                    <input 
                                        type="number" 
                                        value={weightLbs} 
                                        onChange={e => setWeightLbs(Number(e.target.value))} 
                                        className={fieldClass}
                                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
         </div>

         {/* Right: Results Dashboard */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Main Gauge Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center relative overflow-hidden flex flex-col items-center">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Your BMI Result</h3>
                
                {/* Gauge Visualization */}
                <div className="relative h-40 w-80 mb-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full rounded-t-full bg-gradient-to-r from-blue-400 via-green-400 to-red-500 opacity-20"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-t-full border-[30px] border-slate-50 border-b-0"></div>
                    {/* Needle */}
                    <div 
                        className="absolute bottom-0 left-1/2 w-1.5 h-36 origin-bottom bg-slate-800 transition-transform duration-700 ease-out z-10"
                        style={{ transform: `translateX(-50%) rotate(${getRotation(stats.bmi) - 90}deg)` }}
                    >
                        <div className="w-5 h-5 bg-slate-900 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-md"></div>
                    </div>
                </div>

                <div className="text-7xl font-extrabold tracking-tighter text-slate-900 mb-2">
                    {stats.bmi.toFixed(1)}
                </div>
                <div className={`inline-block px-6 py-2 rounded-full text-base font-bold uppercase tracking-wide shadow-sm ${status.panel} ${status.color}`}>
                    {status.label}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-3 text-brand-600 text-xs font-bold uppercase">
                        <Activity size={16}/> Healthy Weight Range
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                        {Math.round(stats.healthyRange.min)} - {Math.round(stats.healthyRange.max)} <span className="text-lg font-normal text-slate-400">kg</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Target for "Normal" BMI (18.5 - 25)</p>
                </div>
                
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ideal Weight</div>
                            <div className="text-3xl font-bold">
                                {Math.round(stats.idealDevine)} <span className="text-lg text-slate-500">kg</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Devine Formula</div>
                        </div>
                        <div className="text-right">
                             <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ponderal Index</div>
                             <div className="text-2xl font-bold text-brand-400">{stats.pi.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>

         </div>
      </div>
    </div>
  );
};
