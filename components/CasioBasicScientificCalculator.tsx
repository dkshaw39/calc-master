
import React, { useState } from 'react';
import { SEO } from './SEO';

// --- UI Helper Components ---

const TopOvalBtn = ({ label, labelColor = 'text-white', onClick }: any) => (
  <div className="flex flex-col items-center gap-0.5">
      <span className={`text-[8px] font-bold ${labelColor} leading-none`}>{label}</span>
      <button 
      onClick={onClick}
      className="w-[36px] h-[18px] rounded-full bg-[#8c9199] shadow-[0_2px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] active:shadow-none border-t border-white/30"
      ></button>
  </div>
);

const FunctionBtn = ({ label, shiftLabel, alphaLabel, onClick }: any) => (
  <div className="flex flex-col items-center justify-end relative h-8 w-full mb-2">
     <div className="flex w-full justify-center gap-1 absolute -top-2 left-0 right-0">
        {shiftLabel && <span className="text-[#d9a64e] text-[8px] font-bold whitespace-nowrap">{shiftLabel}</span>}
        {alphaLabel && <span className="text-[#c9454a] text-[8px] font-bold whitespace-nowrap">{alphaLabel}</span>}
     </div>
     <button 
       onClick={onClick}
       className="w-full h-[22px] rounded-[3px] bg-[#33373d] text-white font-medium text-[10px] shadow-[0_2px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(0,0,0,0.4)] border-t border-white/10 hover:bg-[#3f444d] transition-colors"
     >
       {label}
     </button>
  </div>
);

const MainBtn = ({ label, onClick, variant = 'num', subLabel }: any) => {
  // fx-991MS Color Scheme
  let bg = "bg-[#d1d5da] text-slate-900 border-white/70"; // Number keys (Light Grey)
  if (variant === 'op') bg = "bg-[#454a52] text-white border-white/10"; // Operations (Dark Grey)
  if (variant === 'del') bg = "bg-[#c75c5c] text-white border-white/20"; // DEL/AC (Muted Red)
  if (variant === 'ac') bg = "bg-[#c75c5c] text-white border-white/20"; 
  
  return (
    <div className="flex flex-col items-center relative pt-3 w-full">
      {subLabel && <div className="absolute top-0 text-[#d9a64e] text-[8px] font-bold whitespace-nowrap">{subLabel}</div>}
      <button 
        onClick={onClick}
        className={`w-full h-[30px] rounded-[5px] font-bold text-base shadow-[0_2px_0_rgba(0,0,0,0.3)] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] border-t ${bg} flex items-center justify-center hover:brightness-110 transition-all`}
      >
        {label}
      </button>
    </div>
  );
};

export const CasioBasicScientificCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isDegree, setIsDegree] = useState(true);
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);

  // --- Logic ---
  
  const insert = (val: string) => {
    setExpression(prev => prev + val);
    setShift(false);
    setAlpha(false);
  };

  const clearAll = () => {
    setExpression('');
    setResult('');
    setShift(false);
    setAlpha(false);
  };

  const deleteChar = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      let evalStr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        // Inverse Trig First
        .replace(/asin\(/g, isDegree ? '(180/Math.PI)*Math.asin(' : 'Math.asin(')
        .replace(/acos\(/g, isDegree ? '(180/Math.PI)*Math.acos(' : 'Math.acos(')
        .replace(/atan\(/g, isDegree ? '(180/Math.PI)*Math.atan(' : 'Math.atan(')
        // Standard Trig
        .replace(/sin\(/g, isDegree ? 'Math.sin((Math.PI/180)*' : 'Math.sin(')
        .replace(/cos\(/g, isDegree ? 'Math.cos((Math.PI/180)*' : 'Math.cos(')
        .replace(/tan\(/g, isDegree ? 'Math.tan((Math.PI/180)*' : 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/\^/g, '**');

      const openParens = (evalStr.match(/\(/g) || []).length;
      const closeParens = (evalStr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        evalStr += ')'.repeat(openParens - closeParens);
      }

      // eslint-disable-next-line no-new-func
      const res = new Function('return ' + evalStr)();
      
      if (!isFinite(res) || isNaN(res)) {
        setResult('Error');
      } else {
        const formatted = parseFloat(res.toPrecision(10));
        const resStr = String(formatted);
        setResult(resStr);
      }
    } catch (e) {
      setResult('Syntax Error');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12 flex flex-col items-center">
      <SEO 
        title="Casio fx-82MS Simulator - Online Scientific Calculator"
        description="Free online simulator for Casio fx-82MS and fx-991MS scientific calculators. Classic S-V.P.A.M. design for school math, trigonometry, and fractions."
        keywords="casio calculator, casio fx-82ms simulator, fx-991ms online, scientific calculator online, s-v.p.a.m. calculator, high school math calculator, fraction calculator"
      />
      <header className="mb-2 pt-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Casio <span className="text-brand-600">fx-991MS</span></h1>
        <p className="text-sm text-slate-500 mt-1">Classic scientific calculator simulator.</p>
      </header>

      <div className="flex justify-center px-2 py-4 md:py-8 w-full">
           {/* Calculator Body - Responsive Width */}
           <div className="w-full max-w-[350px] bg-[#22262b] rounded-t-[16px] rounded-b-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] border-b-8 border-[#15171a] relative p-4 pb-8 select-none">
              
              {/* Branding Area */}
              <div className="flex justify-between items-start mb-3 px-1">
                 <div className="flex-1">
                    <div className="text-white font-bold text-lg leading-none">CASIO</div>
                    <div className="text-white/90 text-[10px] font-serif italic font-bold mt-1 mb-0.5">fx-991MS</div>
                    <div className="text-[#d9a64e] text-[9px] font-black tracking-widest italic">S-V.P.A.M.</div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <div className="w-16 h-6 bg-[#3a3633] rounded overflow-hidden relative shadow-inner border border-[#666] mb-0.5">
                        <div className="absolute inset-0 grid grid-cols-4 divide-x divide-white/20 opacity-50"><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div className="text-white/50 text-[7px] font-bold tracking-wider uppercase">Two Way Power</div>
                 </div>
              </div>

              {/* Screen Area */}
              <div className="bg-[#1a1c20] p-3 rounded-t-[8px] rounded-b-[16px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mb-4 border-b border-white/5 mx-0.5">
                 <div className="bg-[#c2dcb3] h-[60px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)] border border-[#777] rounded-[3px] p-2 flex flex-col justify-between font-mono relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-black"></div>
                    
                    {/* Indicators Overlay */}
                    <div className="absolute top-0 right-1 flex text-[8px] text-black font-bold gap-1 z-20">
                       <span className="opacity-100">S</span>
                       <span className="opacity-10">A</span>
                       <span onClick={() => setIsDegree(!isDegree)} className="opacity-100 cursor-pointer">{isDegree ? 'D' : 'R'}</span>
                    </div>

                    {/* Expression Line */}
                    <div className="text-xs font-semibold text-black leading-tight min-h-[1.5em] relative z-10 font-mono pl-0.5 pr-8 mt-1 whitespace-nowrap overflow-x-auto scrollbar-hide">
                       {expression}<span className="animate-pulse opacity-50">_</span>
                    </div>

                    {/* Result Line */}
                    <div className="text-right text-2xl font-bold text-black tracking-tighter leading-none relative z-10 font-mono pr-0.5 pb-0.5 whitespace-nowrap overflow-x-auto scrollbar-hide">
                       {result}
                    </div>
                 </div>
              </div>

              {/* Top Control Deck */}
              <div className="relative h-[80px] mb-1 px-0.5">
                  {/* Replay Button - Smaller */}
                  <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-24 h-16 z-10">
                      <div className="w-full h-full bg-[#9da2aa] rounded-[50%] shadow-[0_3px_6px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] border-b border-black/40 flex items-center justify-center relative cursor-pointer active:scale-[0.98] transition-transform">
                          <div className="text-[8px] font-bold text-[#d9a64e] tracking-[0.1em] mb-3">COPY</div>
                          <div className="absolute text-[7px] font-bold text-[#555] tracking-widest mt-1">REPLAY</div>
                          {/* Arrows */}
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-slate-600 text-[9px]">▲</div>
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-slate-600 text-[9px]">▼</div>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 text-[9px]">◀</div>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 text-[9px]">▶</div>
                      </div>
                  </div>

                  {/* Left Buttons */}
                  <div className="absolute left-0 top-0 flex gap-3 pl-1">
                     <TopOvalBtn label="SHIFT" labelColor="text-[#d9a64e]" onClick={() => setShift(!shift)} />
                     <TopOvalBtn label="ALPHA" labelColor="text-[#c9454a]" onClick={() => setAlpha(!alpha)} />
                  </div>

                  {/* Right Buttons */}
                  <div className="absolute right-0 top-0 flex gap-3 pr-1">
                     <TopOvalBtn label="MODE CLR" labelColor="text-white/70" onClick={() => setIsDegree(!isDegree)} />
                     <TopOvalBtn label="ON" labelColor="text-white/70" onClick={clearAll} />
                  </div>
              </div>

              {/* Special Function Row under Replay */}
              <div className="flex justify-between px-1 mb-3">
                  <div className="flex gap-1.5">
                      <FunctionBtn label="CALC" shiftLabel="SOLVE" />
                      <FunctionBtn label="∫dx" shiftLabel="d/dx" />
                  </div>
                  {/* Gap for Replay */}
                  <div className="w-6"></div>
                  <div className="flex gap-1.5">
                      <FunctionBtn label="x⁻¹" shiftLabel="x!" />
                      <FunctionBtn label="CONST" shiftLabel="CONV" />
                  </div>
              </div>

              {/* Scientific Grid */}
              <div className="grid grid-cols-6 gap-x-1.5 gap-y-1 mb-4 px-0.5">
                  <FunctionBtn label="ab/c" shiftLabel="d/c" />
                  <FunctionBtn label="√" shiftLabel="³√" onClick={() => insert('√(')} />
                  <FunctionBtn label="x²" shiftLabel="x³" onClick={() => insert('^2')} />
                  <FunctionBtn label="^" shiftLabel="x√" onClick={() => insert('^')} />
                  <FunctionBtn label="log" shiftLabel="10ˣ" onClick={() => insert(shift ? '10^' : 'log(')} />
                  <FunctionBtn label="ln" shiftLabel="eˣ" onClick={() => insert(shift ? 'e^' : 'ln(')} />
                  
                  <FunctionBtn label="(-)" shiftLabel="A" onClick={() => insert('-')} />
                  <FunctionBtn label="°'″" shiftLabel="B" />
                  <FunctionBtn label="hyp" shiftLabel="C" />
                  <FunctionBtn label="sin" shiftLabel="sin⁻¹" alphaLabel="D" onClick={() => insert(shift ? 'asin(' : 'sin(')} />
                  <FunctionBtn label="cos" shiftLabel="cos⁻¹" alphaLabel="E" onClick={() => insert(shift ? 'acos(' : 'cos(')} />
                  <FunctionBtn label="tan" shiftLabel="tan⁻¹" alphaLabel="F" onClick={() => insert(shift ? 'atan(' : 'tan(')} />
                  
                  <FunctionBtn label="RCL" shiftLabel="STO" />
                  <FunctionBtn label="ENG" shiftLabel="←" />
                  <FunctionBtn label="(" shiftLabel="%" onClick={() => insert('(')} />
                  <FunctionBtn label=")" shiftLabel="," alphaLabel="X" onClick={() => insert(')')} />
                  <FunctionBtn label="," shiftLabel=";" alphaLabel="Y" />
                  <FunctionBtn label="M+" shiftLabel="M-" alphaLabel="M" />
              </div>

              {/* Main Keypad */}
              <div className="grid grid-cols-5 gap-x-2 gap-y-2 px-0.5 mt-2">
                 <MainBtn label="7" onClick={() => insert('7')} />
                 <MainBtn label="8" onClick={() => insert('8')} />
                 <MainBtn label="9" onClick={() => insert('9')} />
                 <MainBtn label="DEL" variant="del" subLabel="INS" onClick={deleteChar} />
                 <MainBtn label="AC" variant="ac" subLabel="OFF" onClick={clearAll} />

                 <MainBtn label="4" onClick={() => insert('4')} />
                 <MainBtn label="5" onClick={() => insert('5')} />
                 <MainBtn label="6" onClick={() => insert('6')} />
                 <MainBtn label="×" variant="op" subLabel="nPr" onClick={() => insert('×')} />
                 <MainBtn label="÷" variant="op" subLabel="nCr" onClick={() => insert('÷')} />

                 <MainBtn label="1" onClick={() => insert('1')} />
                 <MainBtn label="2" onClick={() => insert('2')} />
                 <MainBtn label="3" onClick={() => insert('3')} />
                 <MainBtn label="+" variant="op" subLabel="Pol" onClick={() => insert('+')} />
                 <MainBtn label="-" variant="op" subLabel="Rec" onClick={() => insert('-')} />

                 <MainBtn label="0" onClick={() => insert('0')} />
                 <MainBtn label="." subLabel="Rnd" onClick={() => insert('.')} />
                 <MainBtn label="EXP" subLabel="π" onClick={() => insert(shift ? 'π' : 'e+')} />
                 <MainBtn label="Ans" subLabel="DRG" />
                 <MainBtn label="=" onClick={calculate} subLabel="%" />
              </div>
           </div>
      </div>

      {/* SEO Article */}
      <article className="prose prose-slate max-w-4xl w-full mx-auto px-6 py-12 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Casio fx-82MS / fx-991MS Online Simulator</h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          The <strong>Casio fx-82MS</strong> is one of the most widely used scientific calculators in high schools and universities. 
          Our online simulator faithfully recreates the S-V.P.A.M. (Super Visually Perfect Algebraic Method) experience, allowing students to perform complex calculations directly in the browser.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Classic Design</h3>
              <p className="text-slate-600 text-sm">
                 Featuring the familiar 2-line display, where the top line shows the calculation formula and the bottom line shows the result. 
                 This "MS" (Mathematical Standard) series layout is beloved for its reliability and ease of use.
              </p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Essential Functions</h3>
              <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
                 <li>Fraction Calculations (using the a b/c key)</li>
                 <li>Permutation and Combination (nPr, nCr)</li>
                 <li>Statistical Calculations (Standard Deviation)</li>
                 <li>Multi-statement Calculation</li>
              </ul>
           </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4">Perfect for Students</h3>
        <p className="text-slate-600 mb-8">
           Whether you are studying algebra, trigonometry, or physics, this simulator allows you to practice with the exact button layout you'll find in the classroom.
           It's an excellent backup for when you leave your physical calculator at school.
        </p>
      </article>
    </div>
  );
};
