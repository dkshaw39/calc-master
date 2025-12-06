
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export const StandardCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState<string | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [isDegree, setIsDegree] = useState(true);
  const [showSciMobile, setShowSciMobile] = useState(true);
  const [historyText, setHistoryText] = useState('');
  const [isError, setIsError] = useState(false);

  // --- Core Logic ---

  const calculate = (rightOperand: number, pendingOperator: string): number | string => {
    const leftOperand = value || 0;
    let res = 0;
    switch (pendingOperator) {
      case '+': res = leftOperand + rightOperand; break;
      case '-': res = leftOperand - rightOperand; break;
      case '×': res = leftOperand * rightOperand; break;
      case '÷': 
        if (rightOperand === 0) return 'Error';
        res = leftOperand / rightOperand; 
        break;
      case 'pow': res = Math.pow(leftOperand, rightOperand); break; // x^y
      default: res = rightOperand;
    }
    return res;
  };

  const inputDigit = (digit: string) => {
    if (isError) {
        setDisplay(digit);
        setIsError(false);
        setValue(null);
        setPendingOperator(null);
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
        setPendingOperator(null);
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

  const clearAll = () => {
    setValue(null);
    setDisplay('0');
    setPendingOperator(null);
    setWaitingForOperand(false);
    setHistoryText('');
    setIsError(false);
  };

  const performOperation = (nextOperator: string) => {
    if (isError) return;
    const inputValue = parseFloat(display);

    if (value === null) {
      setValue(inputValue);
      setHistoryText(`${display} ${nextOperator}`);
    } else if (pendingOperator) {
      const result = calculate(inputValue, pendingOperator);
      
      if (result === 'Error') {
          setDisplay('Error');
          setIsError(true);
          setValue(null);
          setPendingOperator(null);
          return;
      }

      setValue(result as number);
      setDisplay(String(result));
      setHistoryText(`${result} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setPendingOperator(nextOperator);
  };

  const handleEquals = () => {
    if (isError) return;
    if (!pendingOperator || value === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(inputValue, pendingOperator);

    if (result === 'Error') {
        setDisplay('Error');
        setIsError(true);
        setValue(null);
        setPendingOperator(null);
        return;
    }

    setDisplay(String(result));
    setHistoryText(''); // Clear expression history on result
    setValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
  };

  // --- Scientific Functions (Immediate) ---

  const performScientific = (func: string) => {
    if (isError) return;
    const current = parseFloat(display);
    let result = 0;
    
    // Trig Helpers
    const toRad = (n: number) => isDegree ? n * (Math.PI / 180) : n;
    const toDeg = (n: number) => isDegree ? n * (180 / Math.PI) : n;

    switch (func) {
      case 'sin': result = Math.sin(toRad(current)); break;
      case 'cos': result = Math.cos(toRad(current)); break;
      case 'tan': result = Math.tan(toRad(current)); break;
      case 'asin': result = toDeg(Math.asin(current)); break;
      case 'acos': result = toDeg(Math.acos(current)); break;
      case 'atan': result = toDeg(Math.atan(current)); break;
      case 'sqrt': result = Math.sqrt(current); break;
      case 'sq': result = Math.pow(current, 2); break; // x^2
      case 'log': result = Math.log10(current); break;
      case 'ln': result = Math.log(current); break;
      case '10x': result = Math.pow(10, current); break;
      case 'inv': result = 1 / current; break; // 1/x
      case 'fact': 
        if (current < 0 || current > 170) result = Infinity; // JS Number limit
        else {
           let r = 1;
           for(let i = 2; i <= Math.floor(current); i++) r *= i;
           result = r;
        }
        break;
      case 'percent': result = current / 100; break;
      case 'rand': result = Math.random(); break;
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      default: return;
    }

    if (!isFinite(result) || isNaN(result)) {
        setDisplay('Error');
        setIsError(true);
        return;
    }

    // Format output to avoid crazy precision issues
    const formatted = parseFloat(result.toFixed(10)); 
    setDisplay(String(formatted));
    setWaitingForOperand(true);
  };

  // --- Memory ---
  const handleMemory = (action: 'MC' | 'MR' | 'M+') => {
    if (isError) return;
    const current = parseFloat(display);
    if (action === 'MC') setMemory(0);
    if (action === 'MR') {
      setDisplay(String(memory));
      setWaitingForOperand(true);
    }
    if (action === 'M+') {
      setMemory(memory + current);
      setWaitingForOperand(true); // Usually M+ acts like equals/commit
    }
  };

  // --- UI Components ---

  const Btn = ({ label, onClick, variant = 'num', className = '' }: any) => {
    // Compact heights for better viewport fit: h-9 on mobile, h-12 on desktop
    const base = "relative h-9 md:h-12 text-sm md:text-base rounded-lg font-medium transition-all active:scale-[0.98] select-none flex items-center justify-center touch-manipulation";
    
    // Variants
    const styles: any = {
      num: "bg-white text-slate-800 hover:bg-slate-50 shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-slate-200",
      op: "bg-brand-50 text-brand-600 hover:bg-brand-100 shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-brand-100 font-semibold text-lg",
      sci: "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-[0_1px_0_rgba(0,0,0,0.05)] border border-slate-200 text-xs md:text-sm",
      action: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200/50 border border-transparent font-bold text-lg",
      danger: "bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 font-semibold"
    };

    return (
      <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
        {label}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-4xl mx-auto">
      
      {/* --- Display Area --- */}
      <div className="bg-slate-900 p-3 md:p-5 text-right relative min-h-[80px] md:min-h-[130px] flex flex-col justify-end">
        {/* Top Indicators */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-3">
           <div className="flex bg-slate-800 rounded-md p-0.5">
              <button 
                onClick={() => setIsDegree(true)} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${isDegree ? 'bg-slate-600 text-white' : 'text-slate-500'}`}
              >DEG</button>
              <button 
                onClick={() => setIsDegree(false)} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${!isDegree ? 'bg-slate-600 text-white' : 'text-slate-500'}`}
              >RAD</button>
           </div>
           {memory !== 0 && (
             <div className="bg-slate-800 text-brand-400 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-700">M</div>
           )}
        </div>

        {/* Previous Operator / History */}
        <div className="text-slate-400 font-mono text-xs md:text-sm h-5 mb-0 opacity-80">{historyText}</div>

        {/* Main Display */}
        <div className={`text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-tight overflow-hidden text-ellipsis leading-none ${isError ? 'text-red-400' : ''}`}>
          {display}
        </div>
      </div>

      {/* --- Keypad Container --- */}
      <div className="p-2 md:p-4 bg-slate-50">
        
        {/* Mobile Toggle */}
        <button 
          onClick={() => setShowSciMobile(!showSciMobile)}
          className="md:hidden w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-lg mb-2 text-slate-600 font-bold shadow-sm text-xs uppercase tracking-wide hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          {showSciMobile ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          {showSciMobile ? 'Hide Scientific Keys' : 'Show Scientific Keys'}
        </button>

        <div className="flex flex-col md:flex-row gap-2">
          
          {/* Scientific Panel (Left) - Equal Width */}
          <div className={`grid grid-cols-4 gap-1 md:gap-1.5 md:flex-1 ${showSciMobile ? 'grid' : 'hidden md:grid'}`}>
            <Btn variant="sci" label="sin" onClick={() => performScientific('sin')} />
            <Btn variant="sci" label="cos" onClick={() => performScientific('cos')} />
            <Btn variant="sci" label="tan" onClick={() => performScientific('tan')} />
            <Btn variant="sci" label="ln" onClick={() => performScientific('ln')} />
            
            <Btn variant="sci" label={<>sin⁻¹</>} onClick={() => performScientific('asin')} />
            <Btn variant="sci" label={<>cos⁻¹</>} onClick={() => performScientific('acos')} />
            <Btn variant="sci" label={<>tan⁻¹</>} onClick={() => performScientific('atan')} />
            <Btn variant="sci" label="log" onClick={() => performScientific('log')} />

            <Btn variant="sci" label="π" onClick={() => performScientific('pi')} />
            <Btn variant="sci" label="e" onClick={() => performScientific('e')} />
            <Btn variant="sci" label={<>x²</>} onClick={() => performScientific('sq')} />
            <Btn variant="sci" label={<>xʸ</>} onClick={() => performOperation('pow')} />

            <Btn variant="sci" label="√" onClick={() => performScientific('sqrt')} />
            <Btn variant="sci" label="10ˣ" onClick={() => performScientific('10x')} />
            <Btn variant="sci" label="1/x" onClick={() => performScientific('inv')} />
            <Btn variant="sci" label="n!" onClick={() => performScientific('fact')} />

            {/* Memory Row */}
            <Btn variant="sci" label="MC" className="text-orange-600 font-bold" onClick={() => handleMemory('MC')} />
            <Btn variant="sci" label="MR" className="font-bold" onClick={() => handleMemory('MR')} />
            <Btn variant="sci" label="M+" className="font-bold" onClick={() => handleMemory('M+')} />
            <Btn variant="sci" label="Rand" onClick={() => performScientific('rand')} />
          </div>

          {/* Divider (Desktop) */}
          <div className="hidden md:block w-px bg-slate-200 mx-1"></div>

          {/* Standard Panel (Right) - Equal Width */}
          <div className="grid grid-cols-4 gap-1 md:gap-1.5 md:flex-1">
             {/* Row 1 */}
             <Btn variant="danger" label="AC" onClick={clearAll} />
             <Btn variant="danger" label={<RotateCcw size={16}/>} onClick={() => setDisplay('0')} />
             <Btn variant="sci" label="%" onClick={() => performScientific('percent')} />
             <Btn variant="op" label="÷" onClick={() => performOperation('÷')} />

             {/* Row 2 */}
             <Btn label="7" onClick={() => inputDigit('7')} />
             <Btn label="8" onClick={() => inputDigit('8')} />
             <Btn label="9" onClick={() => inputDigit('9')} />
             <Btn variant="op" label="×" onClick={() => performOperation('×')} />

             {/* Row 3 */}
             <Btn label="4" onClick={() => inputDigit('4')} />
             <Btn label="5" onClick={() => inputDigit('5')} />
             <Btn label="6" onClick={() => inputDigit('6')} />
             <Btn variant="op" label="-" onClick={() => performOperation('-')} />

             {/* Row 4 */}
             <Btn label="1" onClick={() => inputDigit('1')} />
             <Btn label="2" onClick={() => inputDigit('2')} />
             <Btn label="3" onClick={() => inputDigit('3')} />
             <Btn variant="op" label="+" onClick={() => performOperation('+')} />

             {/* Row 5 */}
             <Btn label="0" className="col-span-2" onClick={() => inputDigit('0')} />
             <Btn label="." onClick={inputDecimal} />
             <Btn variant="action" label="=" onClick={handleEquals} />
          </div>
        </div>
      </div>
    </div>
  );
};
