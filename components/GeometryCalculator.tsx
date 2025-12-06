
import React, { useState } from 'react';
import { Circle, Triangle, Cylinder, Square, Ruler } from 'lucide-react';
import { SEO } from './SEO';

export const GeometryCalculator: React.FC = () => {
  const [shape, setShape] = useState('rectangle');
  
  // Dynamic Inputs
  const [val1, setVal1] = useState(10); // L / Base / Radius
  const [val2, setVal2] = useState(5);  // W / Height
  
  // Logic
  // Safety: Dimensions must be positive
  const v1 = Math.abs(val1);
  const v2 = Math.abs(val2);

  let area = 0;
  let volume = 0;
  let perimeter = 0;
  let formulaArea = '';
  let formulaVol = '';

  switch (shape) {
    case 'rectangle':
      area = v1 * v2;
      perimeter = 2 * (v1 + v2);
      formulaArea = 'A = l × w';
      break;
    case 'triangle':
      area = 0.5 * v1 * v2;
      formulaArea = 'A = ½ × b × h';
      break;
    case 'circle':
      area = Math.PI * Math.pow(v1, 2);
      perimeter = 2 * Math.PI * v1; 
      formulaArea = 'A = πr²';
      break;
    case 'cylinder':
      volume = Math.PI * Math.pow(v1, 2) * v2;
      area = (2 * Math.PI * v1 * v2) + (2 * Math.PI * Math.pow(v1, 2)); 
      formulaVol = 'V = πr²h';
      formulaArea = 'SA = 2πrh + 2πr²';
      break;
    case 'sphere':
      volume = (4/3) * Math.PI * Math.pow(v1, 3);
      area = 4 * Math.PI * Math.pow(v1, 2); 
      formulaVol = 'V = 4/3 πr³';
      formulaArea = 'SA = 4πr²';
      break;
    case 'cone':
      volume = Math.PI * Math.pow(v1, 2) * (v2 / 3);
      formulaVol = 'V = πr²(h/3)';
      break;
  }

  const shapes = [
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'triangle', label: 'Triangle', icon: Triangle },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'cylinder', label: 'Cylinder', icon: Cylinder },
    { id: 'sphere', label: 'Sphere', icon: Circle },
    { id: 'cone', label: 'Cone', icon: Triangle },
  ];

  // Styles
  const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
  const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Geometry Calculator - Area, Volume & Perimeter"
        description="Calculate area, perimeter, volume, and surface area for 2D and 3D shapes including circles, rectangles, cylinders, and spheres."
        keywords="geometry calculator, area calculator, volume calculator, perimeter calculator, shape calculator, math formulas"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Geometry <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Area, Volume, and Perimeter solver.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Ruler size={18} className="text-brand-600"/> Configuration
                 </h2>
                 
                 <div className="space-y-6">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Select Shape</label>
                        <div className="grid grid-cols-2 gap-2">
                           {shapes.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setShape(s.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition border ${shape === s.id ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                              >
                                <s.icon size={16}/> {s.label}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4 border-t border-slate-100 pt-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
                             {shape === 'circle' || shape === 'sphere' || shape === 'cylinder' || shape === 'cone' ? 'Radius (r)' : shape === 'triangle' ? 'Base (b)' : 'Length (l)'}
                           </label>
                           <div className={inputContainerClass}>
                              <input type="number" value={val1} onChange={e => setVal1(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                           </div>
                        </div>

                        {(shape === 'rectangle' || shape === 'triangle' || shape === 'cylinder' || shape === 'cone') && (
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
                                {shape === 'rectangle' ? 'Width (w)' : 'Height (h)'}
                              </label>
                              <div className={inputContainerClass}>
                                 <input type="number" value={val2} onChange={e => setVal2(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                        )}
                     </div>
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
             <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                 <div className="relative z-10 flex flex-col gap-8">
                     {formulaVol ? (
                        <div>
                           <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Volume</div>
                           <div className="text-6xl font-bold tracking-tight break-all">{volume.toFixed(2)}</div>
                           <div className="text-sm font-mono text-brand-400 mt-1">{formulaVol}</div>
                        </div>
                     ) : (
                        <div>
                           <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Area</div>
                           <div className="text-6xl font-bold tracking-tight break-all">{area.toFixed(2)}</div>
                           <div className="text-sm font-mono text-brand-400 mt-1">{formulaArea}</div>
                        </div>
                     )}

                     {formulaVol ? (
                        shape !== 'cone' && (
                           <div className="border-t border-white/10 pt-6">
                              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Surface Area</div>
                              <div className="text-3xl font-semibold text-slate-200 break-all">{area.toFixed(2)}</div>
                           </div>
                        )
                     ) : (
                        shape !== 'triangle' && (
                           <div className="border-t border-white/10 pt-6">
                              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Perimeter / Circumference</div>
                              <div className="text-3xl font-semibold text-slate-200 break-all">{perimeter.toFixed(2)}</div>
                           </div>
                        )
                     )}
                 </div>
                 {/* BG Graphic */}
                 <div className="absolute right-0 bottom-0 opacity-10 p-8">
                    {/* Simplified graphics for performance */}
                    <div className="border-[20px] border-white w-48 h-48 rounded-full"></div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};
