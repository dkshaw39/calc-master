
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, Briefcase, Calendar, Check } from 'lucide-react';
import { SEO } from './SEO';
import { useCurrency } from '../context/CurrencyContext';

export const SalaryCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  const [grossSalary, setGrossSalary] = useState(65000);
  const [payFrequency, setPayFrequency] = useState('year'); // year, month, week, hour
  const [filingStatus, setFilingStatus] = useState('single'); // single, married

  const results = useMemo(() => {
    let annualGross = grossSalary;
    if (payFrequency === 'month') annualGross = grossSalary * 12;
    if (payFrequency === 'week') annualGross = grossSalary * 52;
    if (payFrequency === 'biweek') annualGross = grossSalary * 26;
    if (payFrequency === 'hour') annualGross = grossSalary * 40 * 52;

    const standardDeduction = filingStatus === 'single' ? 14600 : 29200;
    const taxableIncome = Math.max(0, annualGross - standardDeduction);
    
    let fedTax = 0;
    const brackets = filingStatus === 'single' 
      ? [
          { limit: 11600, rate: 0.10 },
          { limit: 47150, rate: 0.12 },
          { limit: 100525, rate: 0.22 },
          { limit: 191950, rate: 0.24 },
          { limit: 243725, rate: 0.32 },
          { limit: 609350, rate: 0.35 },
          { limit: Infinity, rate: 0.37 }
        ]
      : [
          { limit: 23200, rate: 0.10 },
          { limit: 94300, rate: 0.12 },
          { limit: 201050, rate: 0.22 },
          { limit: 383900, rate: 0.24 },
          { limit: 487450, rate: 0.32 },
          { limit: 731200, rate: 0.35 },
          { limit: Infinity, rate: 0.37 }
      ];

    let previousLimit = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      const chunk = Math.min(remainingIncome, bracket.limit - previousLimit);
      if (chunk <= 0) break;
      fedTax += chunk * bracket.rate;
      remainingIncome -= chunk;
      previousLimit = bracket.limit;
    }

    const ssCap = 168600;
    const ssTax = Math.min(annualGross, ssCap) * 0.062;
    const medicareTax = annualGross * 0.0145;
    const ficaTax = ssTax + medicareTax;
    const stateTax = annualGross * 0.045; 

    const totalTax = fedTax + ficaTax + stateTax;
    const netPay = annualGross - totalTax;

    return {
      annual: { gross: annualGross, net: netPay, fed: fedTax, fica: ficaTax, state: stateTax },
      monthly: { gross: annualGross/12, net: netPay/12 },
      biweekly: { gross: annualGross/26, net: netPay/26 },
      weekly: { gross: annualGross/52, net: netPay/52 }
    };
  }, [grossSalary, payFrequency, filingStatus]);

  const pieData = [
    { name: 'Net Pay', value: results.annual.net, color: '#0ea5e9' },
    { name: 'Federal Tax', value: results.annual.fed, color: '#f59e0b' },
    { name: 'FICA', value: results.annual.fica, color: '#64748b' },
    { name: 'State Tax', value: results.annual.state, color: '#94a3b8' },
  ];

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-500 font-bold";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
       <SEO 
        title="Salary Calculator & Paycheck Estimator"
        description="Calculate your take-home pay (Net Pay) after Federal Tax, FICA, and State Taxes. View a detailed breakdown for annual, monthly, and bi-weekly paychecks."
        keywords="salary calculator, paycheck calculator, net pay calculator, take home pay, federal tax calculator, income tax calculator"
      />
       <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Salary <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Find your actual take-home pay.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Input Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Briefcase size={20} className="text-brand-600"/> Income Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Gross Income</label>
                <div className={inputContainerClass}>
                   <div className={iconClass}>{symbol}</div>
                   <input 
                    type="number" 
                    value={grossSalary} 
                    onChange={e => setGrossSalary(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Frequency</label>
                <div className={inputContainerClass}>
                    <select 
                        value={payFrequency} 
                        onChange={e => setPayFrequency(e.target.value)}
                        className={`${fieldClass} bg-transparent cursor-pointer`}
                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    >
                        <option value="year">Annually</option>
                        <option value="month">Monthly</option>
                        <option value="biweek">Bi-Weekly</option>
                        <option value="week">Weekly</option>
                        <option value="hour">Hourly (40h/wk)</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Filing Status</label>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                     onClick={() => setFilingStatus('single')}
                     className={`p-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${filingStatus === 'single' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                   >
                     {filingStatus === 'single' && <Check size={14}/>} Single
                   </button>
                   <button 
                     onClick={() => setFilingStatus('married')}
                     className={`p-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${filingStatus === 'married' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                   >
                     {filingStatus === 'married' && <Check size={14}/>} Married
                   </button>
                </div>
              </div>

              <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-xs text-brand-800 leading-relaxed">
                <strong>Tax Note:</strong> Calculations use 2024/2025 Federal Brackets + Standard Deduction. State tax estimated at 4.5%.
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (Dashboard) */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="relative z-10 flex-1">
                 <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Estimated Annual Net Pay</div>
                 <div className="text-5xl lg:text-6xl font-bold tracking-tight mb-2 break-all">
                    {symbol}{Math.round(results.annual.net).toLocaleString()}
                 </div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-brand-200">
                    <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                    {((results.annual.net / results.annual.gross) * 100).toFixed(1)}% of Gross Income
                 </div>
              </div>
              
              <div className="w-48 h-48 relative z-10 shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={pieData} 
                         dataKey="value" 
                         innerRadius={40} 
                         outerRadius={70} 
                         paddingAngle={3}
                         stroke="none"
                       >
                          {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                       </Pie>
                       <Tooltip formatter={(value: number) => `${symbol}${Math.round(value).toLocaleString()}`} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              
              {/* BG Decor */}
              <div className="absolute right-0 bottom-0 p-8 opacity-5">
                 <DollarSign size={200} />
              </div>
           </div>

           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-200">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Calendar size={18} className="text-brand-600"/> Paycheck Breakdown
               </h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-white text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4">Frequency</th>
                      <th className="px-6 py-4">Gross Pay</th>
                      <th className="px-6 py-4 text-brand-600">Take Home</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   <tr className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-slate-900">Annually</td>
                     <td className="px-6 py-4 text-slate-600">{symbol}{Math.round(results.annual.gross).toLocaleString()}</td>
                     <td className="px-6 py-4 font-bold text-brand-700 text-lg">{symbol}{Math.round(results.annual.net).toLocaleString()}</td>
                   </tr>
                   <tr className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-slate-900">Monthly</td>
                     <td className="px-6 py-4 text-slate-600">{symbol}{Math.round(results.monthly.gross).toLocaleString()}</td>
                     <td className="px-6 py-4 font-bold text-brand-700 text-lg">{symbol}{Math.round(results.monthly.net).toLocaleString()}</td>
                   </tr>
                   <tr className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-slate-900">Bi-Weekly</td>
                     <td className="px-6 py-4 text-slate-600">{symbol}{Math.round(results.biweekly.gross).toLocaleString()}</td>
                     <td className="px-6 py-4 font-bold text-brand-700 text-lg">{symbol}{Math.round(results.biweekly.net).toLocaleString()}</td>
                   </tr>
                   <tr className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-medium text-slate-900">Weekly</td>
                     <td className="px-6 py-4 text-slate-600">{symbol}{Math.round(results.weekly.gross).toLocaleString()}</td>
                     <td className="px-6 py-4 font-bold text-brand-700 text-lg">{symbol}{Math.round(results.weekly.net).toLocaleString()}</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
