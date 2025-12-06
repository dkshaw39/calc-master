
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calendar, DollarSign, Car, Percent } from 'lucide-react';
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

export const AutoLoanCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  // Auto Loan Specific Inputs
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [interestRate, setInterestRate] = useState(6.5); // APR
  const [loanTermMonths, setLoanTermMonths] = useState(60); 
  const [salesTaxRate, setSalesTaxRate] = useState(7.0);
  const [fees, setFees] = useState(450); 
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const [showSchedule, setShowSchedule] = useState(false);

  // Calculations
  const calculations = useMemo(() => {
    const taxableAmount = Math.max(0, vehiclePrice - tradeInValue);
    const salesTaxAmount = taxableAmount * (salesTaxRate / 100);
    const totalPrice = vehiclePrice + salesTaxAmount + fees;
    let loanAmount = (vehiclePrice + salesTaxAmount + fees) - downPayment - tradeInValue;
    if (loanAmount < 0) loanAmount = 0;

    const principal = loanAmount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = loanTermMonths;
    
    let monthlyPayment = 0;

    if (interestRate === 0) {
      monthlyPayment = principal / totalMonths;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) monthlyPayment = 0;

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
      salesTaxAmount,
      loanAmount,
      monthlyPayment,
      totalPayment: monthlyPayment * totalMonths,
      totalInterest,
      schedule,
      totalCost: totalPrice 
    };
  }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTermMonths, salesTaxRate, fees, startDate]);

  const pieData = [
    { name: 'Loan Principal', value: calculations.loanAmount },
    { name: 'Total Interest', value: calculations.totalInterest },
  ];
  
  const COLORS = ['#0284c7', '#f59e0b'];

  // Flexbox Input Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400 font-bold";
  const suffixClass = "pr-3 pl-2 text-slate-500 font-bold select-none bg-slate-50 h-full flex items-center border-l border-slate-100";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in">
      <SEO 
        title="Car Loan Calculator with Trade-In & Taxes"
        description="Calculate monthly car payments with our advanced Auto Loan Calculator. Includes inputs for trade-in value, sales tax, dealer fees, and down payment."
        keywords="car loan calculator, auto loan calculator, car payment estimator, vehicle financing, car loan interest, auto loan amortization"
      />
      <div className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Car Loan <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Finance breakdown including tax and fees.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Inputs (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Car size={18} className="text-brand-600"/> Vehicle Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Vehicle Price</label>
                <div className={inputContainerClass}>
                  <div className={iconClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={vehiclePrice} 
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Down Payment</label>
                  <div className={inputContainerClass}>
                     <div className={iconClass}>{symbol}</div>
                     <input 
                      type="number" 
                      value={downPayment} 
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className={fieldClass}
                      style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Trade-in</label>
                  <div className={inputContainerClass}>
                     <div className={iconClass}>{symbol}</div>
                     <input 
                      type="number" 
                      value={tradeInValue} 
                      onChange={(e) => setTradeInValue(Number(e.target.value))}
                      className={fieldClass}
                      style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Sales Tax</label>
                <div className={inputContainerClass}>
                  <input 
                    type="number" 
                    value={salesTaxRate} 
                    onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                  <div className={suffixClass}>%</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Fees (Title/Reg)</label>
                <div className={inputContainerClass}>
                  <div className={iconClass}>{symbol}</div>
                  <input 
                    type="number" 
                    value={fees} 
                    onChange={(e) => setFees(Number(e.target.value))}
                    className={fieldClass}
                    style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Loan Terms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Interest (APR)</label>
                      <div className={inputContainerClass}>
                         <input 
                          type="number" 
                          step="0.1"
                          value={interestRate} 
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className={fieldClass}
                          style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                        />
                        <div className={suffixClass}>%</div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Term</label>
                      <div className={inputContainerClass}>
                          <select 
                              value={loanTermMonths}
                              onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                              className={`${fieldClass} bg-transparent cursor-pointer`}
                              style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                          >
                              <option value={36}>36 Mo</option>
                              <option value={48}>48 Mo</option>
                              <option value={60}>60 Mo</option>
                              <option value={72}>72 Mo</option>
                              <option value={84}>84 Mo</option>
                          </select>
                      </div>
                    </div>
                  </div>
              </div>
              
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Start Date</label>
                <div className={inputContainerClass}>
                  <div className={iconClass}><Calendar size={16}/></div>
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
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10 min-w-0">
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Monthly Payment</p>
                  <div className="text-3xl lg:text-4xl font-bold tracking-tight mb-1 break-words">
                    {symbol}{calculations.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-xs text-brand-400 font-medium">{loanTermMonths} month term</p>
                </div>
                <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Car size={80} />
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Total Interest</p>
                  <div className="text-2xl font-bold text-amber-500 break-words">
                    {symbol}{calculations.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Cost of financing</p>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Amount Financed</p>
                  <div className="text-2xl font-bold text-slate-800 break-words">
                    {symbol}{calculations.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Loan principal</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Total Cost Breakdown</h3>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                       <span className="text-slate-600 font-medium">Vehicle Price</span>
                       <span className="font-bold text-slate-900">{symbol}{vehiclePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                       <span className="text-slate-600 font-medium">Sales Tax ({salesTaxRate}%)</span>
                       <span className="font-bold text-slate-900">+ {symbol}{Math.round(calculations.salesTaxAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                       <span className="text-slate-600 font-medium">Fees</span>
                       <span className="font-bold text-slate-900">+ {symbol}{fees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                       <span className="text-slate-600 font-medium">Down Payment</span>
                       <span className="font-bold text-emerald-600">- {symbol}{downPayment.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                       <span className="text-slate-600 font-medium">Trade-in Value</span>
                       <span className="font-bold text-emerald-600">- {symbol}{tradeInValue.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-200 my-2 pt-3 flex justify-between items-center">
                       <span className="text-slate-800 font-bold uppercase text-xs tracking-wide">Amount Financed</span>
                       <span className="text-brand-600 text-lg font-bold">{symbol}{Math.round(calculations.loanAmount).toLocaleString()}</span>
                    </div>
                 </div>
             </div>

             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Principal vs Interest</h3>
                <div className="flex-1 w-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${symbol}${Math.round(value).toLocaleString()}`} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
          
          {/* Amortization Schedule Toggle Area (Simplified for dashboard) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <button 
               onClick={() => setShowSchedule(!showSchedule)}
               className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition"
             >
                <span className="font-bold text-slate-800">View Amortization Schedule</span>
                <span className="text-brand-600 text-sm font-bold">{showSchedule ? 'Hide' : 'Show'}</span>
             </button>
             {showSchedule && (
                <div className="max-h-[400px] overflow-y-auto border-t border-slate-100">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 sticky top-0 text-xs uppercase font-bold text-slate-500">
                         <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Payment</th>
                            <th className="px-4 py-2">Interest</th>
                            <th className="px-4 py-2 text-right">Balance</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {calculations.schedule.map((row, i) => (
                            <tr key={i}>
                               <td className="px-4 py-2 font-medium">{row.date}</td>
                               <td className="px-4 py-2 text-slate-600">{symbol}{row.payment.toFixed(2)}</td>
                               <td className="px-4 py-2 text-amber-600">{symbol}{row.interest.toFixed(2)}</td>
                               <td className="px-4 py-2 text-right font-bold text-slate-900">{symbol}{row.balance.toFixed(2)}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
