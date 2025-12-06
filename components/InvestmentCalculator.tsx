
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Calendar, PieChart, Table as TableIcon, RefreshCw, ArrowUpRight } from 'lucide-react';
import { SEO } from './SEO';
import { useCurrency } from '../context/CurrencyContext';

// --- Reusable Input Component (High Visibility) ---
const InputGroup = ({ label, value, onChange, prefix, suffix, type = "number", min, max, step }: any) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all shadow-sm overflow-hidden h-12">
      {prefix && (
        <div className="pl-3 pr-2 text-slate-400 font-medium select-none">
          {prefix}
        </div>
      )}
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)}
        min={min} max={max} step={step}
        className="flex-1 w-full h-full bg-transparent border-none outline-none text-slate-900 font-bold p-2 placeholder-slate-300 min-w-0"
        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
        placeholder="0"
      />
      {suffix && (
        <div className="bg-slate-50 border-l border-slate-200 px-3 h-full flex items-center text-sm font-bold text-slate-600 select-none whitespace-nowrap">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

const SelectGroup = ({ label, value, onChange, options }: any) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative h-12">
      <select 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-full bg-white border border-slate-300 rounded-lg px-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer shadow-sm"
        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

export const InvestmentCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  const [startingAmount, setStartingAmount] = useState(10000);
  const [contribution, setContribution] = useState(500);
  const [contributionFreq, setContributionFreq] = useState('monthly');
  const [returnRate, setReturnRate] = useState(7.0);
  const [years, setYears] = useState(10);
  const [compoundFreq, setCompoundFreq] = useState('annually');
  const [inflationRate, setInflationRate] = useState(0);
  
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  const results = useMemo(() => {
    // Safety parsing
    const start = Math.abs(Number(startingAmount)) || 0;
    const contrib = Math.abs(Number(contribution)) || 0;
    const rate = Number(returnRate) || 0;
    // Cap duration to 100 years to prevent browser freeze
    const time = Math.min(Math.abs(Number(years)), 100) || 0;
    const inflation = Number(inflationRate) || 0;

    let balance = start;
    let totalPrincipal = start;
    const data = [];
    
    const annualRate = rate / 100;
    const inflationDec = inflation / 100;
    
    const compPerYear = compoundFreq === 'monthly' ? 12 : compoundFreq === 'quarterly' ? 4 : compoundFreq === 'semi-annually' ? 2 : 1;
    const totalMonths = time * 12;
    
    data.push({
      year: 0,
      principal: start,
      interest: 0,
      balance: start,
      formattedYear: `Year 0`
    });

    let currentPrincipal = start;
    let currentBalance = start;

    for (let m = 1; m <= totalMonths; m++) {
      let monthlyContrib = 0;
      if (contributionFreq === 'monthly') monthlyContrib = contrib;
      else if (contributionFreq === 'annually' && m % 12 === 0) monthlyContrib = contrib;
      
      currentPrincipal += monthlyContrib;
      currentBalance += monthlyContrib;

      const ratePerComp = annualRate / compPerYear;
      // Apply interest at compounding intervals
      if (m % (12 / compPerYear) === 0) {
        currentBalance = currentBalance * (1 + ratePerComp);
      }

      // Record yearly data
      if (m % 12 === 0) {
        const year = m / 12;
        const totalInterest = currentBalance - currentPrincipal;
        
        // Basic inflation adjustment (Present Value)
        // PV = FV / (1 + r)^n
        const inflationAdjusted = currentBalance / Math.pow(1 + inflationDec, year);

        data.push({
          year,
          formattedYear: `Year ${year}`,
          principal: Math.round(currentPrincipal),
          interest: Math.round(totalInterest),
          balance: Math.round(currentBalance),
          inflationAdjusted: Math.round(inflationAdjusted)
        });
      }
    }

    return {
      endBalance: Math.round(currentBalance),
      totalPrincipal: Math.round(currentPrincipal),
      totalInterest: Math.round(currentBalance - currentPrincipal),
      data
    };
  }, [startingAmount, contribution, contributionFreq, returnRate, years, compoundFreq, inflationRate]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Investment Calculator - Compound Interest Dashboard"
        description="Professional compound interest calculator. Visualize portfolio growth, contributions, and inflation impact with interactive charts and tables."
        keywords="investment calculator, compound interest, financial planning, wealth growth, roi calculator, inflation calculator"
      />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investment <span className="text-brand-600">Calculator</span></h1>
          <p className="text-sm text-slate-500">Project your financial growth over time.</p>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Settings Panel (First on Mobile) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6">
              <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                 <RefreshCw size={18} className="text-brand-600"/> Parameters
              </h2>
              
              <div className="space-y-6">
                 {/* Section 1 */}
                 <div className="space-y-4">
                    <InputGroup 
                      label="Starting Amount" 
                      prefix={symbol} 
                      value={startingAmount} 
                      onChange={setStartingAmount} 
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <InputGroup 
                         label="Duration" 
                         value={years} 
                         onChange={setYears} 
                         suffix="Years"
                         max={100}
                       />
                       <InputGroup 
                         label="Return Rate" 
                         value={returnRate} 
                         onChange={setReturnRate} 
                         suffix="%"
                         step={0.1}
                       />
                    </div>
                 </div>

                 <div className="border-t border-slate-100 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       <div className="md:col-span-2">
                          <InputGroup 
                            label="Contributions" 
                            prefix={symbol} 
                            value={contribution} 
                            onChange={setContribution} 
                          />
                       </div>
                       <div className="md:col-span-1">
                          <SelectGroup 
                            label="Frequency"
                            value={contributionFreq} 
                            onChange={setContributionFreq}
                            options={[
                              {value: 'monthly', label: 'Monthly'},
                              {value: 'annually', label: 'Yearly'}
                            ]}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="border-t border-slate-100 pt-4 space-y-4">
                    <SelectGroup 
                      label="Compound Frequency"
                      value={compoundFreq} 
                      onChange={setCompoundFreq}
                      options={[
                        {value: 'annually', label: 'Annually'},
                        {value: 'semi-annually', label: 'Semi-Annually'},
                        {value: 'quarterly', label: 'Quarterly'},
                        {value: 'monthly', label: 'Monthly'}
                      ]}
                    />
                    <InputGroup 
                         label="Inflation Rate (Optional)" 
                         value={inflationRate} 
                         onChange={setInflationRate} 
                         suffix="%"
                         step={0.1}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Visualization Panel (Second on Mobile) */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Summary Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Total Value */}
              <div className="bg-slate-900 text-white p-5 md:p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                 <div className="relative z-10 min-w-0">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                       End Balance <ArrowUpRight size={14}/>
                    </div>
                    <div className="text-3xl lg:text-3xl xl:text-4xl font-bold tracking-tight mb-2 break-words">
                       {symbol}{results.endBalance.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded w-fit">
                       <TrendingUp size={12}/> 
                       {((results.endBalance / (results.totalPrincipal || 1)) * 100).toFixed(0)}% ROI
                    </div>
                 </div>
                 <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                    <DollarSign size={100} />
                 </div>
              </div>

              {/* Card 2: Interest */}
              <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                 <div className="min-w-0">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Interest</div>
                    <div className="text-2xl lg:text-2xl xl:text-3xl font-bold text-brand-600 break-words">
                       {symbol}{results.totalInterest.toLocaleString()}
                    </div>
                 </div>
                 <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500" style={{ width: `${(results.totalInterest / results.endBalance) * 100}%` }}></div>
                 </div>
                 <div className="text-xs text-slate-400 mt-2">
                    {((results.totalInterest / results.endBalance) * 100).toFixed(1)}% of total
                 </div>
              </div>

              {/* Card 3: Principal */}
              <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                 <div className="min-w-0">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Principal</div>
                    <div className="text-2xl lg:text-2xl xl:text-3xl font-bold text-slate-800 break-words">
                       {symbol}{results.totalPrincipal.toLocaleString()}
                    </div>
                 </div>
                 <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600" style={{ width: `${(results.totalPrincipal / results.endBalance) * 100}%` }}></div>
                 </div>
                 <div className="text-xs text-slate-400 mt-2">
                    Your contributions
                 </div>
              </div>
           </div>

           {/* Chart/Table Container */}
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 overflow-x-auto">
                 <button 
                   onClick={() => setActiveTab('chart')}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'chart' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                 >
                    <TrendingUp size={16}/> Growth Chart
                 </button>
                 <button 
                   onClick={() => setActiveTab('table')}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'table' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                 >
                    <TableIcon size={16}/> Yearly Schedule
                 </button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-8 flex-1">
                 {activeTab === 'chart' ? (
                    <div className="h-[300px] md:h-[450px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={results.data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                             <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                                   <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                             <XAxis 
                                dataKey="year" 
                                stroke="#94a3b8" 
                                tick={{fontSize: 12, fill: '#64748b'}}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                             />
                             <YAxis 
                                stroke="#94a3b8" 
                                tick={{fontSize: 12, fill: '#64748b'}}
                                tickFormatter={(val) => `${symbol}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                             />
                             <Tooltip 
                                formatter={(val: number) => `${symbol}${val.toLocaleString()}`}
                                contentStyle={{ 
                                   backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                   borderRadius: '12px', 
                                   border: 'none', 
                                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                   padding: '12px'
                                }}
                                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}
                             />
                             <Legend verticalAlign="top" height={36}/>
                             <Area 
                                type="monotone" 
                                dataKey="balance" 
                                name="Total Balance"
                                stroke="#0284c7" 
                                strokeWidth={3}
                                fill="url(#colorBalance)" 
                                animationDuration={1000}
                             />
                             <Area 
                                type="monotone" 
                                dataKey="principal" 
                                name="Principal"
                                stroke="#94a3b8" 
                                strokeWidth={2}
                                fill="transparent" 
                                strokeDasharray="5 5"
                             />
                             {inflationRate > 0 && (
                                <Area 
                                  type="monotone" 
                                  dataKey="inflationAdjusted" 
                                  name="Purchasing Power"
                                  stroke="#f59e0b" 
                                  strokeWidth={2}
                                  fill="transparent" 
                                  strokeDasharray="3 3"
                                />
                             )}
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 ) : (
                    <div className="overflow-x-auto h-[300px] md:h-[450px] scrollbar-thin scrollbar-thumb-slate-200 pr-2">
                       <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
                             <tr>
                                <th className="px-4 md:px-6 py-3 font-bold rounded-l-lg whitespace-nowrap">Year</th>
                                <th className="px-4 md:px-6 py-3 font-bold whitespace-nowrap">Principal</th>
                                <th className="px-4 md:px-6 py-3 font-bold text-brand-600 whitespace-nowrap">Interest</th>
                                <th className="px-4 md:px-6 py-3 font-bold text-right rounded-r-lg whitespace-nowrap">Balance</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {results.data.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-4 md:px-6 py-3 font-medium text-slate-900">{row.year}</td>
                                   <td className="px-4 md:px-6 py-3 text-slate-600">{symbol}{row.principal.toLocaleString()}</td>
                                   <td className="px-4 md:px-6 py-3 text-brand-600 font-bold">+{symbol}{row.interest.toLocaleString()}</td>
                                   <td className="px-4 md:px-6 py-3 text-slate-900 font-bold text-right">{symbol}{row.balance.toLocaleString()}</td>
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
    </div>
  );
};
