
import React, { useState } from 'react';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { SEO } from './SEO';
import { useCurrency } from '../context/CurrencyContext';

export const InflationCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(10);
  
  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const purchasingPower = amount / Math.pow(1 + rate / 100, years);
  
  const data = [
    { name: 'Start', amount: amount, power: amount },
    { name: `In ${years} Years`, amount: parseFloat(futureValue.toFixed(2)), power: parseFloat(purchasingPower.toFixed(2)) }
  ];

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400 font-bold";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Inflation Calculator - Future Value & Purchasing Power"
        description="Calculate the future value of money and purchasing power erosion based on inflation rates. Visualize the impact of inflation over time."
        keywords="inflation calculator, future value calculator, purchasing power calculator, inflation impact, cpi calculator"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Inflation <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Estimate future costs and purchasing power.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inputs */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                 <TrendingUp size={18} className="text-brand-600"/> Parameters
              </h2>
              
              <div className="space-y-5">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Current Amount</label>
                   <div className={inputContainerClass}>
                      <div className={iconClass}>{symbol}</div>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(Number(e.target.value))}
                        className={fieldClass}
                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                      />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Inflation Rate (%)</label>
                   <div className={inputContainerClass}>
                      <input 
                        type="number" 
                        step="0.1"
                        value={rate} 
                        onChange={e => setRate(Number(e.target.value))}
                        className={fieldClass}
                        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                      />
                      <div className="pr-3 pl-2 text-slate-500 font-bold select-none bg-slate-50 h-full flex items-center border-l border-slate-100">%</div>
                   </div>
                   <p className="text-xs text-slate-400 mt-2 ml-1">US Historical Avg is approx 3.3%</p>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Duration (Years)</label>
                   <div className="bg-white border border-slate-300 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-900 font-bold">{years} Years</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="50" 
                        value={years} 
                        onChange={e => setYears(Number(e.target.value))} 
                        className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                      />
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Future Cost */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Future Cost</p>
                       <div className="bg-red-500/20 text-red-300 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <ArrowUpRight size={12}/> +{((futureValue/amount - 1)*100).toFixed(0)}%
                       </div>
                    </div>
                    <div className="text-4xl font-bold tracking-tight mb-2">
                       {symbol}{futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-slate-400 text-sm">
                       Cost to buy the same items in {years} years.
                    </p>
                 </div>
              </div>

              {/* Card 2: Purchasing Power */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Purchasing Power</p>
                       <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <ArrowDownRight size={12}/> -{(100 - (purchasingPower / amount * 100)).toFixed(1)}%
                       </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-800 tracking-tight mb-2">
                       {symbol}{purchasingPower.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                 </div>
                 <p className="text-slate-400 text-sm">
                    Value of today's {symbol}{amount} in {years} years.
                 </p>
              </div>
           </div>

           {/* Chart */}
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-600"/> Visual Impact
               </h3>
               <div className="h-[350px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={data} barGap={20}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                           <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                           <YAxis hide />
                           <Tooltip 
                              cursor={{fill: 'transparent'}}
                              formatter={(value: number) => `${symbol}${value.toLocaleString()}`}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                           />
                           <Legend />
                           <Bar dataKey="amount" name="Cost of Goods" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={60} />
                           <Bar dataKey="power" name="Value of Money" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={60} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
