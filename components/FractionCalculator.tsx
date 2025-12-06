
import React, { useState } from 'react';
import { Divide } from 'lucide-react';
import { SEO } from './SEO';

export const FractionCalculator: React.FC = () => {
  // Fraction A
  const [wholeA, setWholeA] = useState<number | ''>('');
  const [numA, setNumA] = useState<number>(1);
  const [denA, setDenA] = useState<number>(2);

  // Fraction B
  const [wholeB, setWholeB] = useState<number | ''>('');
  const [numB, setNumB] = useState<number>(1);
  const [denB, setDenB] = useState<number>(4);

  const [op, setOp] = useState('+');

  // Logic
  const calculate = () => {
     // Safety: Denominators cannot be 0
     const safeDenA = denA === 0 ? 1 : denA;
     const safeDenB = denB === 0 ? 1 : denB;

     // Convert to improper
     const wA = Number(wholeA) || 0;
     const nA = (wA * safeDenA) + numA;
     
     const wB = Number(wholeB) || 0;
     const nB = (wB * safeDenB) + numB;

     let resNum = 0;
     let resDen = safeDenA * safeDenB;

     switch(op) {
        case '+': resNum = (nA * safeDenB) + (nB * safeDenA); break;
        case '-': resNum = (nA * safeDenB) - (nB * safeDenA); break;
        case '*': resNum = nA * nB; resDen = safeDenA * safeDenB; break;
        case '/': resNum = nA * safeDenB; resDen = safeDenA * nB; break;
     }

     if (resDen === 0) return { num: 0, den: 0, mixedWhole: 0, mixedNum: 0, decimal: 0, error: "Division by Zero" };

     // Reduce
     const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
     const divisor = Math.abs(gcd(resNum, resDen));
     
     const simplifiedNum = resNum / divisor;
     const simplifiedDen = resDen / divisor;

     // Mixed
     const mixedWhole = Math.floor(simplifiedNum / simplifiedDen);
     const mixedNum = simplifiedNum % simplifiedDen;

     return {
        num: simplifiedNum,
        den: simplifiedDen,
        mixedWhole,
        mixedNum,
        decimal: simplifiedNum / simplifiedDen
     };
  };

  const result = calculate();

  const FractionInput = ({ label, w, sw, n, sn, d, sd }: any) => (
     <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-3 text-center">{label}</label>
        <div className="flex items-center gap-2 justify-center">
            <input 
               type="number" 
               value={w} 
               onChange={e => sw(Number(e.target.value))} 
               placeholder="0"
               className="w-14 h-14 text-center bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-xl focus:ring-2 focus:ring-brand-500 outline-none"
               style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
            />
            <div className="flex flex-col gap-2">
               <input 
                  type="number" 
                  value={n} 
                  onChange={e => sn(Number(e.target.value))} 
                  className="w-14 p-1 text-center bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
               />
               <div className="h-0.5 bg-slate-400 w-full rounded-full"></div>
               <input 
                  type="number" 
                  value={d} 
                  onChange={e => sd(Number(e.target.value))} 
                  className="w-14 p-1 text-center bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
               />
            </div>
        </div>
     </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Fraction Calculator - Add, Subtract, Multiply, Divide"
        description="Solve fraction problems with step-by-step mixed number support. Simplify fractions and convert to decimals."
        keywords="fraction calculator, mixed number calculator, simplify fractions, fraction math, fraction to decimal"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Fraction <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Arithmetic with mixed fractions.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-6 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Divide size={18} className="text-brand-600"/> Equation
                 </h2>
                 
                 <div className="flex flex-col gap-6 items-center">
                     <div className="flex items-center gap-4 w-full justify-center">
                        <FractionInput label="1st Fraction" w={wholeA} sw={setWholeA} n={numA} sn={setNumA} d={denA} sd={setDenA} />
                     </div>

                     <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
                        {['+', '-', '*', '/'].map(o => (
                           <button 
                              key={o} 
                              onClick={() => setOp(o)}
                              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold transition ${op === o ? 'bg-brand-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:text-slate-800'}`}
                           >
                              {o === '*' ? '×' : o === '/' ? '÷' : o}
                           </button>
                        ))}
                     </div>

                     <div className="flex items-center gap-4 w-full justify-center">
                        <FractionInput label="2nd Fraction" w={wholeB} sw={setWholeB} n={numB} sn={setNumB} d={denB} sd={setDenB} />
                     </div>
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-6 space-y-6">
             <div className="bg-slate-900 text-white rounded-2xl p-10 shadow-xl flex flex-col items-center justify-center h-full min-h-[300px]">
                 <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Result</div>
                 
                 {result.error ? (
                    <div className="text-red-400 font-bold text-2xl">{result.error}</div>
                 ) : (
                    <>
                        <div className="flex items-center gap-8">
                            {/* Mixed Result */}
                            {result.mixedWhole > 0 && result.mixedNum > 0 && (
                                <div className="text-center">
                                <div className="text-sm text-slate-500 mb-2 font-bold uppercase">Mixed</div>
                                <div className="flex items-center gap-2 text-5xl font-bold">
                                    <span>{result.mixedWhole}</span>
                                    <div className="flex flex-col gap-1 text-2xl text-brand-400">
                                        <span className="border-b border-brand-400/30">{result.mixedNum}</span>
                                        <span>{result.den}</span>
                                    </div>
                                </div>
                                </div>
                            )}

                            {result.mixedWhole > 0 && result.mixedNum > 0 && <div className="h-16 w-px bg-white/10"></div>}

                            {/* Improper Result */}
                            <div className="text-center">
                                <div className="text-sm text-slate-500 mb-2 font-bold uppercase">Fraction</div>
                                <div className="flex flex-col gap-1 text-4xl font-bold text-white">
                                <span className="border-b border-white/20 pb-1">{result.num}</span>
                                <span>{result.den}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-white/10 px-6 py-2 rounded-full font-mono text-lg text-brand-200">
                            = {result.decimal.toFixed(4)}
                        </div>
                    </>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};
