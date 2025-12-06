
import React, { useState } from 'react';
import { Sun } from 'lucide-react';
import { SEO } from './SEO';

// Key component must be outside to prevent focus loss issues
const Key = ({ label, type = 'num', onClick, className = '' }: any) => {
  // Casio-style plastic keys
  const baseStyle = "relative h-10 sm:h-12 rounded-lg font-bold text-xl flex items-center justify-center transition-all active:top-[2px] select-none shadow-[0_3px_0_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] border-t border-white/10";
  
  let colorStyle = "bg-[#333] text-white"; // Standard Black Key
  if (type === 'red') colorStyle = "bg-[#d14] text-white shadow-[0_3px_0_#903]"; 
  if (type === 'accent') colorStyle = "bg-[#444] text-white"; 
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${colorStyle} ${className}`}>
      {label}
    </button>
  );
};

export const CasioCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  
  // Logic State
  const [value, setValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isError, setIsError] = useState(false);

  // --- Input Logic ---
  const inputDigit = (digit: string) => {
    if (isError) {
        setDisplay(digit);
        setIsError(false);
        setValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
    }

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (isError) {
        setDisplay('0.');
        setIsError(false);
        setValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
    }
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearEntry = () => {
    setDisplay('0');
    setIsError(false);
  };

  const allClear = () => {
    setValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setDisplay('0');
    setIsError(false);
  };

  // --- Arithmetic ---
  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': 
        if (b === 0) return 'Error';
        return a / b;
      default: return b;
    }
  };

  const handleOperator = (nextOp: string) => {
    if (isError) return;
    const inputValue = parseFloat(display);

    if (value === null) {
      setValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const result = calculate(value, inputValue, operator);
      
      if (result === 'Error') {
          setDisplay('Error');
          setIsError(true);
          setValue(null);
          setOperator(null);
          return;
      }

      setValue(result as number);
      setDisplay(String(parseFloat((result as number).toPrecision(12))));
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const handleEquals = () => {
    if (isError) return;
    if (operator && value !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(value, inputValue, operator);
      
      if (result === 'Error') {
          setDisplay('Error');
          setIsError(true);
          setValue(null);
          setOperator(null);
          return;
      }

      const formatted = parseFloat((result as number).toPrecision(12));
      const resStr = String(formatted);
      
      setDisplay(resStr);
      setValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  // --- Functions ---
  const handlePercent = () => {
    if (isError) return;
    const current = parseFloat(display);
    if (value !== null && operator) {
      const percentVal = value * (current / 100);
      setDisplay(String(percentVal));
    } else {
      setDisplay(String(current / 100));
    }
  };

  const handleSqrt = () => {
    if (isError) return;
    const current = parseFloat(display);
    if (current < 0) {
        setDisplay('Error');
        setIsError(true);
        return;
    }
    const res = Math.sqrt(current);
    setDisplay(String(res));
    setWaitingForOperand(true);
  };

  const handleMemory = (action: 'M+' | 'M-' | 'MR' | 'MC') => {
    if (isError) return;
    const current = parseFloat(display);
    if (action === 'M+') setMemory(prev => prev + current);
    if (action === 'M-') setMemory(prev => prev - current);
    if (action === 'MC') setMemory(0);
    if (action === 'MR') {
       setDisplay(String(memory));
       setWaitingForOperand(true);
    }
    setWaitingForOperand(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12 flex flex-col items-center">
      <SEO 
        title="Online Desk Calculator - Casio Style"
        description="A simple, robust online desk calculator inspired by the Casio MS-80 series. Features large buttons, memory functions, and clear display for office and home use."
        keywords="casio calculator, desk calculator, simple online calculator, office calculator, casio ms-80 simulator, business calculator, tax calculator, basic calculator"
      />
      <header className="mb-2 pt-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Casio <span className="text-brand-600">Basic</span></h1>
        <p className="text-sm text-slate-500 mt-1">Standard desk calculator simulator.</p>
      </header>

      <div className="flex justify-center px-2 py-4 md:py-8 w-full">
          {/* Calculator Body - Responsive Width */}
          <div className="w-full max-w-[340px] bg-[#222] p-4 rounded-[1.5rem] shadow-2xl border-b-8 border-[#111] relative">
            
            {/* Branding Row */}
            <div className="flex justify-between items-start mb-4 px-2">
               <div>
                  <div className="text-white font-bold italic text-lg tracking-wider">CASIO</div>
                  <div className="text-white/50 text-[10px] font-bold mt-0.5">MS-80B <span className="ml-2">12 DIGITS</span></div>
               </div>
               
               {/* Solar Panel */}
               <div className="w-16 h-6 bg-[#333] rounded border border-[#555] shadow-inner relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 grid grid-cols-4 divide-x divide-white/10 opacity-30"><div></div><div></div><div></div><div></div></div>
                  <Sun size={10} className="text-amber-700/50 relative z-10"/>
               </div>
            </div>

            {/* Display Screen */}
            <div className="bg-[#c5dca0] h-24 rounded-lg border-[4px] border-[#444] mb-4 p-3 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] flex flex-col justify-between">
               {/* Indicators */}
               <div className="flex gap-2 text-[10px] font-bold text-slate-800 opacity-70 font-mono h-3">
                   {isError && <span className="text-red-900">E</span>}
                   {memory !== 0 && <span>M</span>}
                   {operator && !isError && <span className="border border-slate-600 px-1 rounded-sm">{operator}</span>}
                   {value !== null && value < 0 && !isError && <span>-</span>}
               </div>
               
               {/* Main Digits */}
               <div className="text-right text-[36px] sm:text-[40px] leading-none font-mono text-slate-900 tracking-tight font-medium overflow-x-auto scrollbar-hide whitespace-nowrap">
                 {display}
               </div>
            </div>

            {/* Keypad Area */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 p-1">
                
                {/* Row 1: Memory */}
                <Key label="MC" type="accent" onClick={() => handleMemory('MC')} className="text-sm"/>
                <Key label="MR" type="accent" onClick={() => handleMemory('MR')} className="text-sm"/>
                <Key label="M-" type="accent" onClick={() => handleMemory('M-')} className="text-sm"/>
                <Key label="M+" type="accent" onClick={() => handleMemory('M+')} className="text-sm"/>

                {/* Row 2: Func */}
                <Key label="%" type="accent" onClick={handlePercent} />
                <Key label="√" type="accent" onClick={handleSqrt} />
                <Key label="C" type="red" onClick={clearEntry} />
                <Key label="AC" type="red" onClick={allClear} />

                {/* Row 3 */}
                <Key label="7" onClick={() => inputDigit('7')} />
                <Key label="8" onClick={() => inputDigit('8')} />
                <Key label="9" onClick={() => inputDigit('9')} />
                <Key label="÷" type="accent" onClick={() => handleOperator('÷')} className="text-2xl font-light"/>

                {/* Row 4 */}
                <Key label="4" onClick={() => inputDigit('4')} />
                <Key label="5" onClick={() => inputDigit('5')} />
                <Key label="6" onClick={() => inputDigit('6')} />
                <Key label="×" type="accent" onClick={() => handleOperator('×')} className="text-2xl font-light"/>

                {/* Row 5 */}
                <Key label="1" onClick={() => inputDigit('1')} />
                <Key label="2" onClick={() => inputDigit('2')} />
                <Key label="3" onClick={() => inputDigit('3')} />
                <Key label="-" type="accent" onClick={() => handleOperator('-')} className="text-3xl font-light"/>

                {/* Row 6 */}
                <Key label="0" onClick={() => inputDigit('0')} />
                <Key label="." onClick={inputDecimal} />
                <Key label="=" type="accent" onClick={handleEquals} className="text-2xl"/>
                <Key label="+" type="accent" onClick={() => handleOperator('+')} className="text-2xl font-light"/>
            </div>
          </div>
      </div>

      {/* SEO Article */}
      <article className="prose prose-slate max-w-4xl w-full mx-auto px-6 py-12 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Online Desk Calculator</h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          This <strong>Online Basic Calculator</strong> is designed for speed and simplicity. 
          Modeled after the classic Casio MS-80 series found in offices around the world, it provides a reliable interface for everyday arithmetic, accounting, and business calculations.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Key Functions</h3>
              <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
                 <li><strong>Memory Keys (M+, M-, MR, MC):</strong> Store intermediate results for complex multi-step calculations.</li>
                 <li><strong>Percentage (%):</strong> Quickly calculate markups, discounts, and tax.</li>
                 <li><strong>Square Root (√):</strong> Essential for basic geometry and statistical estimation.</li>
              </ul>
           </div>
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Best For</h3>
              <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
                 <li>Balancing checkbooks and personal finance.</li>
                 <li>Retail calculations (profit margin, sales tax).</li>
                 <li>Office work and simple accounting tasks.</li>
              </ul>
           </div>
        </div>
      </article>
    </div>
  );
};
