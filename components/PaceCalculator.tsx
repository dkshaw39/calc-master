
import React, { useState } from 'react';
import { Timer, MapPin, Activity, Gauge } from 'lucide-react';
import { SEO } from './SEO';

export const PaceCalculator: React.FC = () => {
  const [mode, setMode] = useState<'pace' | 'time' | 'distance'>('pace'); // What to calculate
  
  // State
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(30);
  const [secs, setSecs] = useState(0);
  
  const [dist, setDist] = useState(5);
  const [distUnit, setDistUnit] = useState<'km' | 'mi'>('km');
  
  const [paceMins, setPaceMins] = useState(6);
  const [paceSecs, setPaceSecs] = useState(0);
  const [paceUnit, setPaceUnit] = useState<'km' | 'mi'>('km');

  // Logic
  const getResult = () => {
    // Force positive values
    const totalTimeSec = (Math.abs(hours) * 3600) + (Math.abs(mins) * 60) + Math.abs(secs);
    const distanceKm = distUnit === 'km' ? Math.abs(dist) : Math.abs(dist) * 1.60934;
    const paceSecPerKm = (Math.abs(paceMins) * 60 + Math.abs(paceSecs)) * (paceUnit === 'km' ? 1 : 1.60934);

    if (mode === 'pace') {
       if (distanceKm <= 0 || totalTimeSec <= 0) return null;
       const calcPaceSecPerKm = totalTimeSec / distanceKm;
       const displayPaceSec = calcPaceSecPerKm / (paceUnit === 'km' ? 1 : 1.60934);
       return {
          label: 'Your Pace',
          val: `${Math.floor(displayPaceSec / 60)}:${Math.floor(displayPaceSec % 60).toString().padStart(2, '0')}`,
          unit: `min / ${paceUnit}`
       };
    }
    
    if (mode === 'time') {
       if (distanceKm <= 0) return null;
       const calcTimeSec = distanceKm * paceSecPerKm;
       const h = Math.floor(calcTimeSec / 3600);
       const m = Math.floor((calcTimeSec % 3600) / 60);
       const s = Math.floor(calcTimeSec % 60);
       return {
          label: 'Total Time',
          val: `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
          unit: 'h:m:s'
       };
    }

    if (mode === 'distance') {
       if (totalTimeSec <= 0 || paceSecPerKm <= 0) return null;
       const calcDistKm = totalTimeSec / paceSecPerKm;
       const displayDist = calcDistKm / (distUnit === 'km' ? 1 : 1.60934);
       return {
          label: 'Distance',
          val: displayDist.toFixed(2),
          unit: distUnit
       };
    }
    return null;
  };

  const res = getResult();

  // Styles
  const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
  const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 text-center !text-black min-w-0";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Running Pace Calculator"
        description="Calculate running pace, finish time, or distance. Plan your marathon, half-marathon, 10k, or 5k race strategy."
        keywords="pace calculator, running calculator, marathon pace, race time predictor, running speed, km per min"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Pace <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Calculate pace, time, or distance.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Activity size={18} className="text-brand-600"/> Settings
                 </h2>

                 <div className="space-y-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">I want to calculate</label>
                        <div className="flex flex-col gap-2">
                          {[
                             { id: 'pace', label: 'Pace', icon: Activity },
                             { id: 'time', label: 'Time', icon: Timer },
                             { id: 'distance', label: 'Distance', icon: MapPin }
                          ].map((m: any) => (
                             <button
                               key={m.id}
                               onClick={() => setMode(m.id)}
                               className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${mode === m.id ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                             >
                               <m.icon size={18}/> {m.label}
                             </button>
                          ))}
                        </div>
                     </div>

                     {mode !== 'time' && (
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Time</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                               <div className="flex-1 min-w-0">
                                  <div className={inputContainerClass}>
                                     <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                  </div>
                                  <div className="text-[10px] text-center text-slate-400 mt-1 font-bold">Hrs</div>
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className={inputContainerClass}>
                                     <input type="number" value={mins} onChange={e => setMins(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                  </div>
                                  <div className="text-[10px] text-center text-slate-400 mt-1 font-bold">Mins</div>
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className={inputContainerClass}>
                                     <input type="number" value={secs} onChange={e => setSecs(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                  </div>
                                  <div className="text-[10px] text-center text-slate-400 mt-1 font-bold">Secs</div>
                               </div>
                            </div>
                        </div>
                     )}

                     {mode !== 'distance' && (
                         <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Distance</label>
                            <div className="flex gap-2">
                               <div className="flex-[2]">
                                  <div className={inputContainerClass}>
                                     <input type="number" value={dist} onChange={e => setDist(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                  </div>
                               </div>
                               <div className="flex-1">
                                  <select 
                                    value={distUnit} 
                                    onChange={e => setDistUnit(e.target.value as any)} 
                                    className="w-full h-full bg-slate-50 border border-slate-300 rounded-lg px-2 font-bold text-slate-700 outline-none"
                                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                  >
                                     <option value="km">km</option>
                                     <option value="mi">mi</option>
                                  </select>
                               </div>
                            </div>
                            {/* Quick Select */}
                            <div className="flex gap-2 flex-wrap">
                               {[
                                 {l:'5K', v:5, u:'km'}, {l:'10K', v:10, u:'km'}, {l:'Half', v:21.0975, u:'km'}, {l:'Marathon', v:42.195, u:'km'}
                               ].map(preset => (
                                  <button 
                                    key={preset.l}
                                    onClick={() => { setDist(preset.v); setDistUnit(preset.u as any); }}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition"
                                  >
                                    {preset.l}
                                  </button>
                               ))}
                            </div>
                         </div>
                     )}

                     {mode !== 'pace' && (
                         <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Pace</label>
                            <div className="flex gap-2">
                               <div className="flex-[2] flex bg-white border border-slate-300 rounded-lg p-1 shadow-sm items-center">
                                   <input type="number" value={paceMins} onChange={e => setPaceMins(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                   <span className="font-bold text-slate-400 mx-1">:</span>
                                   <input type="number" value={paceSecs} onChange={e => setPaceSecs(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                               </div>
                               <div className="flex-1">
                                  <select 
                                    value={paceUnit} 
                                    onChange={e => setPaceUnit(e.target.value as any)} 
                                    className="w-full h-full bg-slate-50 border border-slate-300 rounded-lg px-2 font-bold text-slate-700 outline-none"
                                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                  >
                                     <option value="km">/ km</option>
                                     <option value="mi">/ mi</option>
                                  </select>
                               </div>
                            </div>
                         </div>
                     )}
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
             <div className="bg-slate-900 text-white rounded-2xl p-10 shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                 <div className="relative z-10 text-center">
                     {res ? (
                        <>
                           <div className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                              <Gauge size={18}/> {res.label}
                           </div>
                           <div className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-none break-all">
                              {res.val}
                           </div>
                           <div className="inline-block bg-white/10 px-6 py-2 rounded-full text-lg font-medium text-slate-200">
                              {res.unit}
                           </div>
                        </>
                     ) : (
                        <div className="text-slate-500 font-medium">Enter values to calculate</div>
                     )}
                 </div>
                 {/* BG Graphic */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
             </div>
         </div>
      </div>
    </div>
  );
};
