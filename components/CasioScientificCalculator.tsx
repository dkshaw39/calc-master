
import React, { useState } from 'react';
import { SEO } from './SEO';

// --- UI Components (Outside main scope) ---

const TopSmallBtn = ({ label, color = 'grey', onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-8 h-5 rounded-full text-[8px] font-bold text-slate-800 shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none border-t border-white/40 flex items-center justify-center
      ${color === 'grey' ? 'bg-[#b6b8c0]' : 'bg-[#b6b8c0]'}
    `}
  >
    {label}
  </button>
);

const FunctionBtn = ({ label, shiftLabel, alphaLabel, onClick }: any) => (
  <div className="flex flex-col items-center justify-end relative h-8 w-full">
     <div className="flex w-full justify-center gap-1 absolute -top-1 left-0 right-0">
        {shiftLabel && <span className="text-[#a88636] text-[7px] font-bold whitespace-nowrap">{shiftLabel}</span>}
        {alphaLabel && <span className="text-[#c53d42] text-[7px] font-bold whitespace-nowrap">{alphaLabel}</span>}
     </div>
     <button 
       onClick={onClick}
       className="w-full h-6 rounded-[3px] bg-[#3a3d42] text-white font-medium text-[10px] shadow-[0_2px_0_rgba(0,0,0,0.3)] active:translate-y-[1px] active:shadow-none border-t border-white/10 hover:bg-[#4a4d52]"
     >
       {label}
     </button>
  </div>
);

const MainBtn = ({ label, onClick, variant = 'num', subLabel }: any) => {
  let bg = "bg-white text-black border-white/50"; // Num
  if (variant === 'op') bg = "bg-[#dcdedf] text-black border-white/50";
  if (variant === 'del') bg = "bg-[#e08f46] text-white border-white/20";
  if (variant === 'ac') bg = "bg-[#e08f46] text-white border-white/20";
  
  return (
    <div className="flex flex-col items-center relative pt-3 w-full">
      {subLabel && <div className="absolute top-0 text-[#a88636] text-[8px] font-bold whitespace-nowrap">{subLabel}</div>}
      <button 
        onClick={onClick}
        className={`w-full h-8 rounded-[4px] font-bold text-base shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-[0_1px_0_rgba(0,0,0,0.15)] border-t ${bg} flex items-center justify-center hover:brightness-105`}
      >
        {label}
      </button>
    </div>
  );
};

export const CasioScientificCalculator: React.FC = () => {
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
      // Replace visual symbols with JS math
      // IMPORTANT: Inverse trig (asin) must be replaced BEFORE standard trig (sin) to prevent partial matching
      let evalStr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        // Inverse Trig: Output radians -> Convert to Degrees if needed
        .replace(/asin\(/g, isDegree ? '(180/Math.PI)*Math.asin(' : 'Math.asin(')
        .replace(/acos\(/g, isDegree ? '(180/Math.PI)*Math.acos(' : 'Math.acos(')
        .replace(/atan\(/g, isDegree ? '(180/Math.PI)*Math.atan(' : 'Math.atan(')
        // Standard Trig: Input Degrees -> Convert to Radians if needed
        .replace(/sin\(/g, isDegree ? 'Math.sin((Math.PI/180)*' : 'Math.sin(')
        .replace(/cos\(/g, isDegree ? 'Math.cos((Math.PI/180)*' : 'Math.cos(')
        .replace(/tan\(/g, isDegree ? 'Math.tan((Math.PI/180)*' : 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/\^/g, '**');

      // Close open parentheses automatically
      const openParens = (evalStr.match(/\(/g) || []).length;
      const closeParens = (evalStr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        evalStr += ')'.repeat(openParens - closeParens);
      }

      // eslint-disable-next-line no-new-func
      const res = new Function('return ' + evalStr)();
      
      if (!isFinite(res) || isNaN(res)) {
        setResult('Math Error');
      } else {
        // Format to reasonable precision
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
        title="Casio fx-991ES Simulator - Online Scientific Calculator"
        description="The best free online Casio fx-991ES PLUS simulator. Features Natural V.P.A.M display, trigonometry, calculus, and engineering functions. No download required."
        keywords="casio calculator, casio calculator online, fx-991es simulator, scientific calculator online, engineering calculator, casio fx-991es plus, natural display calculator, classwiz emulator"
      />
      <header className="mb-2 pt-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Casio <span className="text-brand-600">fx-991ES</span></h1>
        <p className="text-sm text-slate-500 mt-1">Advanced scientific simulator.</p>
      </header>

      <div className="flex justify-center px-2 py-4 md:py-8 w-full">
           {/* Calculator Body - Responsive Width */}
           <div className="w-full max-w-[350px] bg-[#e3e4e8] rounded-[24px] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.3)] border border-[#d1d2d6] relative p-4 pb-6 select-none">
              
              {/* Branding & Solar */}
              <div className="flex justify-between items-start px-2 mb-3">
                 <div>
                    <div className="text-[#444] font-bold text-base leading-none tracking-wide">CASIO</div>
                    <div className="text-[#444] text-[10px] font-serif italic font-bold">fx-991ES <span className="text-[#e08f46]">PLUS</span></div>
                    <div className="text-[#333] text-[7px] font-medium tracking-wider mt-0.5">NATURAL-V.P.A.M.</div>
                 </div>
                 <div className="w-20 h-7 bg-[#3a3633] rounded overflow-hidden relative shadow-inner border border-[#666]">
                     <div className="absolute inset-0 grid grid-cols-4 divide-x divide-white/20 opacity-50"><div></div><div></div><div></div><div></div></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-[8px] font-bold whitespace-nowrap">TWO WAY POWER</div>
                 </div>
              </div>

              {/* Screen */}
              <div className="bg-[#222] p-3 rounded-t-[6px] rounded-b-[16px] mb-4 shadow-md mx-1">
                 <div className="bg-[#c8e0bc] h-20 shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)] border border-[#888] rounded-[3px] p-2 flex flex-col justify-between font-mono relative">
                    {/* Indicators */}
                    <div className="flex justify-between text-[9px] text-black/80 font-bold border-b border-black/10 pb-0.5 leading-none">
                       <div className="flex gap-1.5">
                         <span className={shift ? 'text-black bg-black/10 px-0.5 rounded' : 'text-transparent'}>S</span>
                         <span className={alpha ? 'text-black bg-black/10 px-0.5 rounded' : 'text-transparent'}>A</span>
                         <span>{isDegree ? 'D' : 'R'}</span>
                         <span>Math</span>
                       </div>
                    </div>
                    
                    {/* Expression */}
                    <div className="text-sm font-medium text-black whitespace-nowrap overflow-x-auto scrollbar-hide leading-tight min-h-[1.5em] mt-0.5 pl-1">
                       {expression}<span className="animate-pulse opacity-50">_</span>
                    </div>

                    {/* Result */}
                    <div className="text-right text-xl font-bold text-black tracking-tight leading-none pb-0.5 pr-1 overflow-x-auto scrollbar-hide">
                       {result}
                    </div>
                 </div>
              </div>

              {/* Control Deck (Shift/Replay/Mode) */}
              <div className="relative h-[70px] mb-3 mx-1">
                  {/* Replay Pad - Smaller */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-18">
                      <div className="w-full h-full bg-[#d0d3d9] rounded-[40%] shadow-[0_3px_5px_rgba(0,0,0,0.2)] border-t border-white/60 flex items-center justify-center relative cursor-pointer active:scale-[0.98]">
                          <div className="absolute inset-2 rounded-[40%] border-2 border-[#b0b5bd]"></div>
                          <div className="text-[8px] font-bold text-[#888] tracking-widest mt-[-2px]">REPLAY</div>
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#0088cc] text-[9px]">▲</div>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#0088cc] text-[9px]">▼</div>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#0088cc] text-[9px]">◀</div>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0088cc] text-[9px]">▶</div>
                      </div>
                  </div>

                  {/* Left Controls */}
                  <div className="absolute left-0 top-1 flex flex-col gap-4">
                     <div className="relative pl-1">
                        <div className="absolute -top-3 left-1 text-[#a88636] text-[7px] font-bold">SHIFT</div>
                        <TopSmallBtn label="" onClick={() => setShift(!shift)} />
                     </div>
                     <div className="relative pl-1">
                        <div className="absolute -top-3 left-1 text-[#c53d42] text-[7px] font-bold">ALPHA</div>
                        <TopSmallBtn label="" onClick={() => setAlpha(!alpha)} />
                     </div>
                  </div>

                  {/* Right Controls */}
                  <div className="absolute right-0 top-1 flex flex-col gap-4 items-end">
                     <div className="relative pr-1 flex flex-col items-end">
                        <div className="absolute -top-3 right-1 text-[#444] text-[7px] font-bold">MODE</div>
                        <TopSmallBtn label="MODE" onClick={() => setIsDegree(!isDegree)} />
                     </div>
                     <div className="relative pr-1 flex flex-col items-end">
                        <div className="absolute -top-3 right-1 text-[#a88636] text-[7px] font-bold">ON</div>
                        <TopSmallBtn label="ON" onClick={clearAll} />
                     </div>
                  </div>
              </div>

              {/* Scientific Function Grid */}
              <div className="space-y-3 px-1 mb-4">
                  {/* Row 1 under Replay */}
                  <div className="flex justify-between px-1">
                     <div className="flex gap-2 w-full pr-1">
                        <FunctionBtn label="CALC" shiftLabel="SOLVE" shiftLabelColor="#a88636" />
                        <FunctionBtn label="∫dx" alphaLabel=":" />
                     </div>
                     <div className="w-4"></div>
                     <div className="flex gap-2 w-full pl-1">
                        <FunctionBtn label="x⁻¹" shiftLabel="x!" />
                        <FunctionBtn label="log□" shiftLabel="Σ" onClick={() => insert('log(')} />
                     </div>
                  </div>

                  {/* Grid 6x3 */}
                  <div className="grid grid-cols-6 gap-x-1.5 gap-y-3">
                      <FunctionBtn label="Start" shiftLabel="End" />
                      <FunctionBtn label="√" shiftLabel="³√" onClick={() => insert(shift ? 'cbrt(' : '√(')} />
                      <FunctionBtn label="x²" shiftLabel="x³" onClick={() => insert('^2')} />
                      <FunctionBtn label="xⁿ" shiftLabel="ⁿ√" onClick={() => insert('^')} />
                      <FunctionBtn label="log" shiftLabel="10ⁿ" onClick={() => insert(shift ? '10^' : 'log(')} />
                      <FunctionBtn label="ln" shiftLabel="eⁿ" onClick={() => insert(shift ? 'e^' : 'ln(')} />
                      
                      <FunctionBtn label="(-)" shiftLabel="A" onClick={() => insert('-')} />
                      <FunctionBtn label="°'″" shiftLabel="B" />
                      <FunctionBtn label="hyp" shiftLabel="C" />
                      <FunctionBtn label="sin" shiftLabel="sin⁻¹" alphaLabel="D" onClick={() => insert(shift ? 'asin(' : 'sin(')} />
                      <FunctionBtn label="cos" shiftLabel="cos⁻¹" alphaLabel="E" onClick={() => insert(shift ? 'acos(' : 'cos(')} />
                      <FunctionBtn label="tan" shiftLabel="tan⁻¹" alphaLabel="F" onClick={() => insert(shift ? 'atan(' : 'tan(')} />

                      <FunctionBtn label="RCL" shiftLabel="STO" />
                      <FunctionBtn label="ENG" shiftLabel="←" />
                      <FunctionBtn label="(" shiftLabel="%" onClick={() => insert(shift ? '/100' : '(')} />
                      <FunctionBtn label=")" shiftLabel="," alphaLabel="X" onClick={() => insert(')')} />
                      <FunctionBtn label="S⇔D" shiftLabel="a/b" alphaLabel="Y" />
                      <FunctionBtn label="M+" shiftLabel="M-" alphaLabel="M" />
                  </div>
              </div>

              {/* Main Keypad */}
              <div className="grid grid-cols-5 gap-x-2 gap-y-1 px-1 mt-4">
                 <MainBtn label="7" subLabel="CONST" onClick={() => insert('7')} />
                 <MainBtn label="8" subLabel="CONV" onClick={() => insert('8')} />
                 <MainBtn label="9" subLabel="CLR" onClick={() => insert('9')} />
                 <MainBtn label="DEL" variant="del" subLabel="INS" onClick={deleteChar} />
                 <MainBtn label="AC" variant="ac" subLabel="OFF" onClick={clearAll} />

                 <MainBtn label="4" subLabel="MATRIX" onClick={() => insert('4')} />
                 <MainBtn label="5" subLabel="VECTOR" onClick={() => insert('5')} />
                 <MainBtn label="6" onClick={() => insert('6')} />
                 <MainBtn label="×" variant="op" subLabel="nPr" onClick={() => insert('×')} />
                 <MainBtn label="÷" variant="op" subLabel="nCr" onClick={() => insert('÷')} />

                 <MainBtn label="1" subLabel="STAT" onClick={() => insert('1')} />
                 <MainBtn label="2" subLabel="CMPLX" onClick={() => insert('2')} />
                 <MainBtn label="3" subLabel="BASE" onClick={() => insert('3')} />
                 <MainBtn label="+" variant="op" subLabel="Pol" onClick={() => insert('+')} />
                 <MainBtn label="-" variant="op" subLabel="Rec" onClick={() => insert('-')} />

                 <MainBtn label="0" subLabel="Rnd" onClick={() => insert('0')} />
                 <MainBtn label="." subLabel="Ran#" onClick={() => insert('.')} />
                 <MainBtn label="×10ˣ" subLabel="π" onClick={() => insert(shift ? 'π' : '*10^')} />
                 <MainBtn label="Ans" subLabel="DRG" />
                 <MainBtn label="=" onClick={calculate} />
              </div>

           </div>
      </div>

      {/* SEO Content Article */}
      <article className="prose prose-slate max-w-4xl w-full mx-auto px-6 py-12 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Online Casio fx-991ES Simulator</h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          Welcome to the world's most accurate <strong>Online Casio fx-991ES PLUS Simulator</strong>. 
          Designed for engineering students, mathematicians, and professionals, this tool replicates the functionality of the iconic Casio scientific calculator right in your browser.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Natural Textbook Display</h3>
              <p className="text-slate-600 text-sm">
                 Input and view mathematical expressions exactly as they appear in your textbook. 
                 The "Natural-V.P.A.M." (Visually Perfect Algebraic Method) ensures formulas, fractions, and roots look natural.
              </p>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Key Features</h3>
              <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
                 <li>Trigonometry (Sin, Cos, Tan) in Degrees & Radians</li>
                 <li>Logarithms (log, ln) and Exponentials</li>
                 <li>Square Roots, Cube Roots, and Powers</li>
                 <li>Engineering Notation (ENG)</li>
              </ul>
           </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4">Why use this simulator?</h3>
        <p className="text-slate-600 mb-4">
           The <strong>Casio fx-991ES PLUS</strong> is a staple in university exams and engineering courses worldwide. 
           However, you don't always have your physical calculator handy. Our online simulator provides a free, accessible alternative for:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 mb-8 pl-4">
           <li><strong>Engineering Calculations:</strong> Quickly solve complex mechanical or electrical problems.</li>
           <li><strong>Homework Helper:</strong> Double-check your math homework with a familiar interface.</li>
           <li><strong>Convenience:</strong> Accessible from any device—desktop, tablet, or mobile.</li>
        </ul>

        <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl text-brand-800 text-sm">
           <strong>Note:</strong> This is a web-based simulator inspired by the Casio fx-991ES. While it mimics the layout and core logic, it is not an official product of Casio Computer Co., Ltd.
        </div>
      </article>
    </div>
  );
};
