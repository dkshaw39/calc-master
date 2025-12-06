
import React, { useState } from 'react';
import { ArrowRightLeft, Ruler } from 'lucide-react';
import { SEO } from './SEO';

const units: any = {
    length: { base: 'm', items: { m: 1, km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, yd: 1.09361, ft: 3.28084, in: 39.3701 } },
    weight: { base: 'kg', items: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274, ton: 0.001 } },
    temperature: { base: 'C', items: { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' } },
    area: { base: 'm2', items: { m2: 1, km2: 0.000001, ft2: 10.7639, ac: 0.000247105, ha: 0.0001 } },
    volume: { base: 'l', items: { l: 1, ml: 1000, m3: 0.001, gal: 0.264172, qt: 1.05669, pt: 2.11338, cup: 4.22675 } },
    speed: { base: 'mps', items: { mps: 1, kph: 3.6, mph: 2.23694, knot: 1.94384 } },
    time: { base: 's', items: { s: 1, min: 1/60, hr: 1/3600, day: 1/86400, week: 1/604800, yr: 1/31536000 } },
    digital: { base: 'B', items: { B: 1, KB: 1/1024, MB: 1/1048576, GB: 1/1073741824, TB: 1/1099511627776 } }
};

export const UnitConverter: React.FC = () => {
    const [category, setCategory] = useState('length');
    const [val, setVal] = useState<number>(1);
    const [from, setFrom] = useState('m');
    const [to, setTo] = useState('ft');

    const handleCatChange = (c: string) => {
        setCategory(c);
        const keys = Object.keys(units[c].items);
        setFrom(keys[0]);
        setTo(keys[1] || keys[0]);
    };

    const convert = () => {
        // Safety check for empty or invalid input
        if (isNaN(val)) return 0;

        if (category === 'temperature') {
            if (from === to) return val;
            let celsius = val;
            if (from === 'F') celsius = (val - 32) * 5/9;
            if (from === 'K') celsius = val - 273.15;
            
            if (to === 'C') return celsius;
            if (to === 'F') return (celsius * 9/5) + 32;
            if (to === 'K') return celsius + 273.15;
            return val;
        } else {
            const data = units[category];
            const baseVal = val / data.items[from];
            return baseVal * data.items[to];
        }
    };

    const result = convert();

    // Styles
    const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
    const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 !text-black";

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
            <SEO 
               title="Unit Converter - Length, Weight, Temp & More"
               description="Convert between measurements for length, weight, temperature, area, volume, speed, and time. Quick and accurate conversion tool."
               keywords="unit converter, measurement converter, length converter, weight converter, temperature converter, metric to imperial"
            />
            <header className="mb-2 pt-2">
               <h1 className="text-2xl font-bold text-slate-900">Unit <span className="text-brand-600">Converter</span></h1>
               <p className="text-sm text-slate-500 mt-1">Convert between common units of measurement.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
               
               {/* Left: Inputs */}
               <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                       <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                          <Ruler size={18} className="text-brand-600"/> Settings
                       </h2>
                       
                       <div className="space-y-6">
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Category</label>
                              <div className="flex flex-wrap gap-2">
                                 {Object.keys(units).map(cat => (
                                    <button 
                                       key={cat}
                                       onClick={() => handleCatChange(cat)}
                                       className={`px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition border ${category === cat ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                       {cat}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Value</label>
                              <div className={inputContainerClass}>
                                 <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">From Unit</label>
                              <div className={inputContainerClass}>
                                 <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-transparent outline-none font-bold text-slate-900 cursor-pointer" style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}>
                                     {Object.keys(units[category].items).map(u => <option key={u} value={u}>{u}</option>)}
                                 </select>
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">To Unit</label>
                              <div className={inputContainerClass}>
                                 <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-transparent outline-none font-bold text-slate-900 cursor-pointer" style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}>
                                     {Object.keys(units[category].items).map(u => <option key={u} value={u}>{u}</option>)}
                                 </select>
                              </div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Right: Results */}
               <div className="lg:col-span-8 space-y-6">
                   <div className="bg-slate-900 text-white rounded-2xl p-10 shadow-xl flex flex-col justify-center items-center h-[300px] relative overflow-hidden">
                       <div className="relative z-10 text-center">
                          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">Converted Result</div>
                          <div className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-none break-all">
                             {Number.isInteger(result) ? result : result.toFixed(4).replace(/\.?0+$/, '')}
                          </div>
                          <div className="inline-block bg-white/10 px-6 py-2 rounded-full text-lg font-bold text-slate-200">
                             {to}
                          </div>
                       </div>
                       <div className="absolute right-8 bottom-8 opacity-10">
                          <ArrowRightLeft size={150} />
                       </div>
                   </div>
               </div>
            </div>
        </div>
    );
};
