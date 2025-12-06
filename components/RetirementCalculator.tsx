
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DollarSign, TrendingUp, Clock, AlertCircle, PieChart, Percent, Calendar } from 'lucide-react';
import { SEO } from './SEO';
import { useCurrency } from '../context/CurrencyContext';

interface YearlyData {
  age: number;
  savings: number;
  contribution: number;
  withdrawal: number;
  interest: number;
}

// --- UI Helper Components ---

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
    <div className="p-1.5 bg-brand-50 text-brand-600 rounded-md"><Icon size={16}/></div>
    {title}
  </h3>
);

const InputField = ({ label, value, onChange, icon: Icon, prefix, suffix, min, max, step }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">{label}</label>
    <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all shadow-sm relative">
      {prefix && (
        <div className="pl-3 pr-1 text-slate-500 font-bold select-none">{prefix}</div>
      )}
      {Icon && !prefix && (
        <div className="pl-3 text-slate-400 shrink-0">
          <Icon size={18} />
        </div>
      )}
      <input 
        type="number" 
        value={isNaN(value) ? '' : value} 
        onChange={e => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
        min={min} max={max} step={step}
        style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
        className={`flex-1 w-full bg-transparent text-black font-bold py-3 ${Icon || prefix ? 'pl-2' : 'pl-4'} ${suffix ? 'pr-2' : 'pr-4'} outline-none min-w-0 placeholder-slate-400 relative z-10 !text-black`}
      />
      {suffix && (
        <div className="bg-slate-50 border-l border-slate-100 px-3 py-3 text-slate-600 font-bold text-sm whitespace-nowrap shrink-0 h-full flex items-center">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

const SliderField = ({ label, value, onChange, min, max, suffix = '' }: any) => (
  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</label>
      <span className="text-brand-800 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200 text-sm">
        {value}{suffix}
      </span>
    </div>
    <input 
      type="range" 
      min={min} max={max} 
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 hover:accent-brand-700 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30"
    />
  </div>
);

export const RetirementCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  // --- Inputs ---
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [annualIncrease, setAnnualIncrease] = useState(2); // % increase in contribution
  
  const [preRetireReturn, setPreRetireReturn] = useState(7); // %
  const [postRetireReturn, setPostRetireReturn] = useState(5); // %
  const [inflation, setInflation] = useState(2.5); // %
  
  const [desiredIncome, setDesiredIncome] = useState(60000); // Annual income needed in today's dollars

  // --- Calculations ---
  const simulation = useMemo(() => {
    // Safety caps
    const startAge = Math.min(Math.max(currentAge, 18), 100);
    const endAge = Math.min(Math.max(lifeExpectancy, startAge + 1), 120);
    const retire = Math.min(Math.max(retireAge, startAge), endAge);

    let balance = currentSavings;
    let contribution = monthlyContribution * 12;
    
    const data: YearlyData[] = [];
    let runOutAge: number | null = null;
    let maxSavings = 0;

    for (let age = startAge; age <= endAge; age++) {
      const isRetired = age >= retire;
      
      let yearlyInterest = 0;
      let yearlyContribution = 0;
      let yearlyWithdrawal = 0;
      
      // 1. Calculate Interest
      const rate = isRetired ? postRetireReturn / 100 : preRetireReturn / 100;
      yearlyInterest = balance * rate;

      // 2. Contributions or Withdrawals
      if (!isRetired) {
        yearlyContribution = contribution;
        // Increase contribution for next year
        contribution = contribution * (1 + annualIncrease / 100);
      } else {
        // Calculate needed income adjusted for inflation
        const inflationFactor = Math.pow(1 + inflation / 100, age - startAge);
        yearlyWithdrawal = desiredIncome * inflationFactor;
      }

      // 3. Update Balance
      balance = balance + yearlyInterest + yearlyContribution - yearlyWithdrawal;

      // Check if ran out
      if (balance < 0) {
        balance = 0;
        if (runOutAge === null) runOutAge = age;
      }

      if (balance > maxSavings) maxSavings = balance;

      data.push({
        age,
        savings: Math.round(balance),
        contribution: Math.round(yearlyContribution),
        withdrawal: Math.round(yearlyWithdrawal),
        interest: Math.round(yearlyInterest)
      });
    }

    const retirementSavings = data.find(d => d.age === retire)?.savings || 0;

    return {
      data,
      runOutAge,
      retirementSavings,
      maxSavings
    };
  }, [currentAge, retireAge, lifeExpectancy, currentSavings, monthlyContribution, annualIncrease, preRetireReturn, postRetireReturn, inflation, desiredIncome]);

  const formatMoney = (val: number) => `${symbol}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <SEO 
        title="Retirement Calculator & 401k Planner"
        description="Plan your financial future with our advanced Retirement Calculator. Visualize savings growth, adjust for inflation, and see when you can retire comfortably."
        keywords="retirement calculator, 401k calculator, retirement planner, investment growth, retirement savings, inflation adjustment"
      />
      {/* Header */}
      <header className="text-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-slate-900">Retirement <span className="text-brand-600">Planner</span></h1>
        <p className="text-sm text-slate-500 mt-1">Visualize your path to financial freedom.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Inputs (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Timeline */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
             <SectionHeader icon={Clock} title="Timeline" />
             <div className="space-y-5">
                <SliderField label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} />
                <SliderField label="Retire Age" value={retireAge} onChange={setRetireAge} min={currentAge + 1} max={90} />
                <SliderField label="Life Expectancy" value={lifeExpectancy} onChange={setLifeExpectancy} min={retireAge + 1} max={110} />
             </div>
          </div>

          {/* Card 2: Financials */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
             <SectionHeader icon={DollarSign} title="Savings & Goals" />
             <div className="space-y-5">
                <InputField 
                  label="Current Savings" 
                  value={currentSavings} 
                  onChange={setCurrentSavings} 
                  prefix={symbol}
                />
                <InputField 
                  label="Monthly Contribution" 
                  value={monthlyContribution} 
                  onChange={setMonthlyContribution} 
                  prefix={symbol}
                />
                <InputField 
                  label="Annual Income Needed" 
                  value={desiredIncome} 
                  onChange={setDesiredIncome} 
                  prefix={symbol}
                  suffix="(Today's Value)"
                />
             </div>
          </div>

          {/* Card 3: Market Assumptions */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
             <SectionHeader icon={TrendingUp} title="Market Assumptions" />
             {/* Stacks on mobile, side-by-side on desktop */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Pre-Retire Return" value={preRetireReturn} onChange={setPreRetireReturn} suffix="%" step={0.1}/>
                <InputField label="Post-Retire Return" value={postRetireReturn} onChange={setPostRetireReturn} suffix="%" step={0.1}/>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <InputField label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1}/>
                <InputField label="Contrib. Increase" value={annualIncrease} onChange={setAnnualIncrease} suffix="%" step={0.5}/>
             </div>
          </div>

        </div>

        {/* Right Content: Visualization (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Top Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                       <DollarSign size={14}/> Projected Nest Egg
                    </div>
                    <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 break-all">
                      {formatMoney(simulation.retirementSavings)}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                       at age {retireAge}
                    </div>
                 </div>
                 <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform translate-y-2">
                    <TrendingUp size={120} />
                 </div>
              </div>

              <div className={`p-8 rounded-3xl shadow-lg border-2 flex flex-col justify-center transition-colors ${simulation.runOutAge ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                 {simulation.runOutAge ? (
                    <>
                      <div className="flex items-center gap-3 text-red-700 font-bold text-xl mb-2">
                         <div className="p-2 bg-red-100 rounded-full"><AlertCircle size={24}/></div>
                         Money Depleted
                      </div>
                      <p className="text-red-800/80 font-medium">
                        At your current pace, your savings will run out at age <span className="font-bold text-red-900 text-lg">{simulation.runOutAge}</span>.
                      </p>
                    </>
                 ) : (
                    <>
                      <div className="flex items-center gap-3 text-emerald-700 font-bold text-xl mb-2">
                         <div className="p-2 bg-emerald-100 rounded-full"><TrendingUp size={24}/></div>
                         On Track!
                      </div>
                      <p className="text-emerald-800/80 font-medium">
                        Your savings are projected to last through age <span className="font-bold text-emerald-900 text-lg">{lifeExpectancy}</span> with a surplus.
                      </p>
                    </>
                 )}
              </div>
           </div>

           {/* Main Graph */}
           <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-2">
                 <h3 className="text-lg font-bold text-slate-900">Portfolio Trajectory</h3>
                 <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-brand-500"></div>Savings Balance</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Retirement Start</div>
                 </div>
              </div>
              
              <div className="h-[300px] md:h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulation.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                       <XAxis 
                          dataKey="age" 
                          stroke="#94a3b8" 
                          tick={{fontSize: 12, fill: '#64748b'}}
                          axisLine={false}
                          tickLine={false}
                          dy={10}
                       />
                       <YAxis 
                          stroke="#94a3b8" 
                          tick={{fontSize: 12, fill: '#64748b'}}
                          tickFormatter={(value) => `${symbol}${value/1000}k`}
                          axisLine={false}
                          tickLine={false}
                          dx={-10}
                       />
                       <Tooltip 
                          formatter={(value: number) => formatMoney(value)}
                          labelFormatter={(label) => `Age ${label}`}
                          contentStyle={{ 
                              borderRadius: '12px', 
                              border: 'none', 
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                              padding: '12px 16px',
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              color: '#0f172a'
                          }}
                          itemStyle={{ color: '#0284c7', fontWeight: 600 }}
                       />
                       <ReferenceLine x={retireAge} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Retirement', fill: '#f59e0b', fontSize: 12, position: 'insideTopLeft' }} />
                       <Area 
                          type="monotone" 
                          dataKey="savings" 
                          stroke="#0284c7" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorSavings)" 
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#0284c7' }}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Info Article */}
           <article className="prose prose-slate max-w-none bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Planning for a Secure Future</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Successful retirement planning isn't just about saving—it's about understanding how your money grows and how inflation impacts your purchasing power. 
                This calculator uses a sophisticated projection model that accounts for:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 not-prose">
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 mb-1">Compound Growth</div>
                    <div className="text-sm text-slate-600">Your earnings generate their own earnings, accelerating growth over time.</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 mb-1">Inflation</div>
                    <div className="text-sm text-slate-600">We adjust your future withdrawal needs to match today's purchasing power.</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 mb-1">Drawdown Phase</div>
                    <div className="text-sm text-slate-600">Simulates drawing from your portfolio after retirement to replace your salary.</div>
                 </div>
              </div>

              <p className="text-slate-600 text-sm">
                <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. It assumes a constant rate of return, which does not reflect actual market volatility. 
                Consider consulting a qualified financial advisor for personalized advice.
              </p>
           </article>
        </div>
      </div>
    </div>
  );
};
