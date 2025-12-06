
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SEO } from './SEO';
import { Home, DollarSign, Percent, Calendar, PieChart as PieChartIcon } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const MortgageCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  const [homeValue, setHomeValue] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(4800); // Annual
  const [insurance, setInsurance] = useState(1200); // Annual
  const [hoa, setHoa] = useState(0); // Monthly

  const [breakdown, setBreakdown] = useState<{
    monthlyPI: number;
    monthlyTax: number;
    monthlyIns: number;
    totalMonthly: number;
    totalInterest: number;
    loanAmount: number;
  } | null>(null);

  // Sync Down Payment Amount -> Percent
  const handleAmountChange = (val: number) => {
    setDownPayment(val);
    setDownPaymentPercent(Number(((val / homeValue) * 100).toFixed(2)));
  };

  // Sync Down Payment Percent -> Amount
  const handlePercentChange = (val: number) => {
    setDownPaymentPercent(val);
    setDownPayment(Math.round((val / 100) * homeValue));
  };

  useEffect(() => {
    const loanAmount = homeValue - downPayment;
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;

    let monthlyPI = 0;
    if (interestRate === 0) {
      monthlyPI = loanAmount / n;
    } else {
      monthlyPI = loanAmount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    const monthlyTax = propertyTax / 12;
    const monthlyIns = insurance / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyIns + hoa;
    const totalInterest = (monthlyPI * n) - loanAmount;

    setBreakdown({
      monthlyPI,
      monthlyTax,
      monthlyIns,
      totalMonthly,
      totalInterest,
      loanAmount
    });
  }, [homeValue, downPayment, loanTerm, interestRate, propertyTax, insurance, hoa]);

  const data = breakdown ? [
    { name: 'Principal & Interest', value: breakdown.monthlyPI },
    { name: 'Property Tax', value: breakdown.monthlyTax },
    { name: 'Home Insurance', value: breakdown.monthlyIns },
    { name: 'HOA Fees', value: hoa },
  ].filter(d => d.value > 0) : [];

  const COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#ef4444'];
  
  // Reusable Flex Input Style
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const prefixClass = "pl-3 pr-2 text-slate-500 font-bold select-none";
  const suffixClass = "pr-3 pl-2 text-slate-500 font-bold select-none bg-slate-50 h-full flex items-center border-l border-slate-100";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
      <SEO 
        title="Mortgage Calculator 2025 - With Taxes, Insurance & HOA"
        description="Calculate your monthly mortgage payment including principal, interest, property taxes, homeowner's insurance, and HOA fees. See your full 2025 amortization schedule."
        keywords="mortgage calculator, mortgage payment calculator, home loan calculator, pmi calculator, housing costs, amortization schedule 2025"
      />
      <div className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Mortgage <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Estimate your monthly payment and loan breakdown.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Home size={18} className="text-brand-600"/> Loan Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Home Price</label>
                <div className={inputContainerClass}>
                  <div className={prefixClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={homeValue}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setHomeValue(val);
                      setDownPayment(Math.round((downPaymentPercent / 100) * val));
                    }}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Down Payment</label>
                <div className="flex gap-2">
                   <div className={`${inputContainerClass} flex-1 min-w-[120px]`}>
                      <div className={prefixClass}>{symbol}</div>
                      <input 
                        type="number" 
                        value={downPayment}
                        onChange={e => handleAmountChange(Number(e.target.value))}
                        className={fieldClass}
                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                      />
                   </div>
                   <div className={`${inputContainerClass} w-24 shrink-0`}>
                      <input 
                        type="number" 
                        value={downPaymentPercent}
                        onChange={e => handlePercentChange(Number(e.target.value))}
                        className={`${fieldClass} text-center`}
                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                      />
                      <div className="pr-3 text-slate-500 font-bold">%</div>
                   </div>
                </div>
              </div>

              {/* Stack on mobile, side-by-side on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Loan Term</label>
                  <div className={inputContainerClass}>
                    <select 
                      value={loanTerm}
                      onChange={e => setLoanTerm(Number(e.target.value))}
                      className={`${fieldClass} bg-transparent cursor-pointer`}
                      style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    >
                      <option value={10}>10 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={30}>30 Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Interest Rate</label>
                  <div className={inputContainerClass}>
                    <input 
                      type="number" 
                      step="0.01"
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                      className={fieldClass}
                      style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    />
                    <div className={suffixClass}>%</div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mt-8 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <DollarSign size={18} className="text-slate-400"/> Taxes & Fees
            </h2>

            <div className="space-y-5">
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Property Tax / Year</label>
                <div className={inputContainerClass}>
                  <div className={prefixClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={propertyTax}
                    onChange={e => setPropertyTax(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Home Insurance / Year</label>
                <div className={inputContainerClass}>
                  <div className={prefixClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={insurance}
                    onChange={e => setInsurance(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">HOA Fees / Month</label>
                <div className={inputContainerClass}>
                  <div className={prefixClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={hoa}
                    onChange={e => setHoa(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results (Dashboard) */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Top Summary Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                 <div className="relative z-10 min-w-0">
                   <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Monthly Payment</p>
                   <div className="text-3xl lg:text-4xl font-bold tracking-tight mb-1 break-words">
                     {symbol}{breakdown?.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                   </div>
                   <p className="text-xs text-brand-400 font-medium">Includes Tax & Insurance</p>
                 </div>
                 <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <DollarSign size={80} />
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                 <div className="min-w-0">
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Total Interest</p>
                    <div className="text-2xl font-bold text-amber-500 break-words">
                       {symbol}{Math.round(breakdown?.totalInterest || 0).toLocaleString()}
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">Over {loanTerm} years</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                 <div className="min-w-0">
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Loan Amount</p>
                    <div className="text-2xl font-bold text-slate-800 break-words">
                       {symbol}{breakdown?.loanAmount.toLocaleString()}
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">Principal</p>
              </div>
           </div>

           {/* Visualization Section */}
           <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <PieChartIcon className="text-brand-600" size={20}/> Payment Breakdown
             </h3>
             
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={data}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip 
                          formatter={(value: number) => `${symbol}${Math.round(value)}`} 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                       />
                       <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                   </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand-600"></div>
                        <span className="text-slate-700 text-sm font-medium">Principal & Interest</span>
                      </div>
                      <span className="font-bold text-slate-900">{symbol}{Math.round(breakdown?.monthlyPI || 0)}</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                        <span className="text-slate-700 text-sm font-medium">Property Tax</span>
                      </div>
                      <span className="font-bold text-slate-900">{symbol}{Math.round(breakdown?.monthlyTax || 0)}</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-slate-700 text-sm font-medium">Home Insurance</span>
                      </div>
                      <span className="font-bold text-slate-900">{symbol}{Math.round(breakdown?.monthlyIns || 0)}</span>
                   </div>
                    {hoa > 0 && (
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-slate-700 text-sm font-medium">HOA Fees</span>
                        </div>
                        <span className="font-bold text-slate-900">{symbol}{hoa}</span>
                      </div>
                    )}
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
