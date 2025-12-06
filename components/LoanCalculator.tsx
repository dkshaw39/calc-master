
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar, DollarSign, Percent, Clock, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { SEO } from './SEO';
import { useCurrency } from '../context/CurrencyContext';

interface AmortizationRow {
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export const LoanCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  // Inputs
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTermYears, setLoanTermYears] = useState(5);
  const [loanTermMonths, setLoanTermMonths] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const [showSchedule, setShowSchedule] = useState(false);

  // Calculations
  const calculations = useMemo(() => {
    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = (loanTermYears * 12) + loanTermMonths;
    
    let monthlyPayment = 0;

    if (interestRate === 0) {
      monthlyPayment = principal / totalMonths;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const schedule: AmortizationRow[] = [];
    let currentBalance = principal;
    let totalInterest = 0;
    const start = new Date(startDate);

    for (let i = 1; i <= totalMonths; i++) {
      const interestPayment = currentBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      currentBalance -= principalPayment;
      
      if (currentBalance < 0) currentBalance = 0;

      totalInterest += interestPayment;

      schedule.push({
        date: format(addMonths(start, i), 'MMM yyyy'),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: currentBalance
      });
    }

    return {
      monthlyPayment,
      totalPayment: monthlyPayment * totalMonths,
      totalInterest,
      schedule
    };
  }, [loanAmount, interestRate, loanTermYears, loanTermMonths, startDate]);

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400 font-bold";
  const suffixClass = "pr-3 pl-2 text-slate-500 font-bold select-none bg-slate-50 h-full flex items-center border-l border-slate-100";
  const fieldClass = "w-full p-2 h-full outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in w-full overflow-hidden">
      <SEO 
        title="Loan Calculator with Amortization Schedule"
        description="Advanced loan calculator for personal loans, business loans, or general debt. View your detailed amortization schedule and monthly payment breakdown."
        keywords="loan calculator, personal loan calculator, debt calculator, amortization schedule, monthly payment, interest calculator"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Loan <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Calculate payments and interest for any loan.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Inputs (Sidebar) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <DollarSign size={18} className="text-brand-600"/> Loan Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Loan Amount</label>
                <div className={inputContainerClass}>
                  <div className={iconClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Interest Rate (APR)</label>
                <div className={inputContainerClass}>
                  <input 
                    type="number" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className={`${fieldClass} pl-3`}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                  <div className={suffixClass}>%</div>
                </div>
              </div>

              {/* Stack inputs on mobile for better touch targets and no overflow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Term (Years)</label>
                  <div className={inputContainerClass}>
                     <div className={iconClass}><Clock size={18}/></div>
                     <input 
                      type="number" 
                      value={loanTermYears} 
                      onChange={(e) => setLoanTermYears(Number(e.target.value))}
                      className={fieldClass}
                      style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Months</label>
                  <div className={inputContainerClass}>
                    <input 
                      type="number" 
                      value={loanTermMonths} 
                      onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                      className={`${fieldClass} px-3`}
                      style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Start Date</label>
                <div className={inputContainerClass}>
                  <div className={iconClass}><Calendar size={18} /></div>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results (Dashboard) */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-slate-900 text-white p-5 md:p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10 min-w-0">
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Monthly Payment</p>
                  <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1 break-all">
                    {symbol}{calculations.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <DollarSign size={80} />
                </div>
             </div>

             <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Total Interest</p>
                  <div className="text-2xl font-bold text-amber-500 break-all">
                    {symbol}{calculations.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">Cost of borrowing</div>
             </div>

             <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Total Payoff</p>
                  <div className="text-2xl font-bold text-slate-700 break-all">
                    {symbol}{calculations.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">Principal + Interest</div>
             </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
               <PieIcon size={18} className="text-brand-600"/> Payment Composition
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Total', principal: loanAmount, interest: calculations.totalInterest }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip 
                         cursor={{fill: 'transparent'}}
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         formatter={(value: number) => `${symbol}${value.toLocaleString()}`}
                      />
                      <Legend />
                      <Bar dataKey="principal" name="Principal" stackId="a" fill="#0284c7" radius={[4, 0, 0, 4]} barSize={60} />
                      <Bar dataKey="interest" name="Interest" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">P</div>
                        <div className="min-w-0 flex-1">
                           <div className="text-xs text-slate-500 font-bold uppercase">Principal</div>
                           <div className="text-lg font-bold text-slate-900 break-all">{symbol}{loanAmount.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">I</div>
                        <div className="min-w-0 flex-1">
                           <div className="text-xs text-slate-500 font-bold uppercase">Interest</div>
                           <div className="text-lg font-bold text-slate-900 break-all">{symbol}{Math.round(calculations.totalInterest).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden w-full max-w-full">
            <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50 gap-4">
               <h3 className="text-lg font-bold text-slate-800">Amortization Schedule</h3>
               <button 
                 onClick={() => setShowSchedule(!showSchedule)}
                 className="w-full sm:w-auto text-sm font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-lg transition border border-brand-200 bg-white"
               >
                 {showSchedule ? 'Collapse Table' : 'Show Full Schedule'}
               </button>
            </div>
            
            <div className={`overflow-x-auto w-full transition-all duration-500 ${showSchedule ? 'max-h-[800px]' : 'max-h-[300px]'}`}>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-3 md:px-6 py-3 font-bold whitespace-nowrap">Date</th>
                    <th className="px-3 md:px-6 py-3 font-bold whitespace-nowrap">Payment</th>
                    <th className="px-3 md:px-6 py-3 font-bold text-brand-600 whitespace-nowrap">Principal</th>
                    <th className="px-3 md:px-6 py-3 font-bold text-amber-600 whitespace-nowrap">Interest</th>
                    <th className="px-3 md:px-6 py-3 font-bold text-right whitespace-nowrap">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculations.schedule.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 md:px-6 py-3 font-medium text-slate-900 whitespace-nowrap">{row.date}</td>
                      <td className="px-3 md:px-6 py-3 text-slate-600 whitespace-nowrap">{symbol}{row.payment.toFixed(2)}</td>
                      <td className="px-3 md:px-6 py-3 text-slate-600 font-medium whitespace-nowrap">{symbol}{row.principal.toFixed(2)}</td>
                      <td className="px-3 md:px-6 py-3 text-slate-600 whitespace-nowrap">{symbol}{row.interest.toFixed(2)}</td>
                      <td className="px-3 md:px-6 py-3 text-slate-900 font-bold text-right whitespace-nowrap">{symbol}{row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!showSchedule && (
                 <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
