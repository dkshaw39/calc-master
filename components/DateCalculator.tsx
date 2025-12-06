
import React, { useState } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, addDays, format, differenceInBusinessDays } from 'date-fns';
import { Clock } from 'lucide-react';
import { SEO } from './SEO';

export const DateCalculator: React.FC = () => {
  const [tab, setTab] = useState(0);

  // Tab 0: Age / Diff
  const [date1, setDate1] = useState('1990-01-01');
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);

  // Tab 1: Add/Sub
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [operator, setOperator] = useState('add');
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState('days');

  const calculateDiff = () => {
    const start = new Date(date1);
    const end = new Date(date2);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, addYears(start, years));
    const days = differenceInDays(end, addMonths(addYears(start, years), months));
    const totalDays = differenceInDays(end, start);
    const businessDays = differenceInBusinessDays(end, start);

    return { years, months, days, totalDays, businessDays };
  };

  const calculateAdd = () => {
     const start = new Date(startDate);
     const amt = operator === 'add' ? amount : -amount;
     let res = start;
     if (unit === 'years') res = addYears(start, amt);
     if (unit === 'months') res = addMonths(start, amt);
     if (unit === 'days') res = addDays(start, amt);
     return res;
  };

  const diff = calculateDiff();
  const addedDate = calculateAdd();

  // Styles
  const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
  const fieldClass = "flex-1 w-full bg-transparent outline-none font-bold text-slate-900 !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Date Calculator - Age, Difference & Add Days"
        description="Calculate the duration between two dates (years, months, days) or add/subtract time from a date to find a future or past date."
        keywords="date calculator, age calculator, days between dates, add days to date, date duration, business days calculator"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Date <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">Calculate duration or add time.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Settings */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Clock size={18} className="text-brand-600"/> Settings
                 </h2>
                 
                 <div className="space-y-6">
                     <div>
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                          {['Difference', 'Add / Subtract'].map((t, i) => (
                             <button
                               key={i}
                               onClick={() => setTab(i)}
                               className={`flex-1 py-2 rounded-md text-sm font-bold transition ${tab === i ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}
                             >
                               {t}
                             </button>
                          ))}
                        </div>
                     </div>

                     {tab === 0 ? (
                        <div className="space-y-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Start Date</label>
                              <div className={inputContainerClass}>
                                 <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">End Date</label>
                              <div className={inputContainerClass}>
                                 <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Start Date</label>
                              <div className={inputContainerClass}>
                                 <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Operation</label>
                              <div className="flex gap-2">
                                 <button onClick={() => setOperator('add')} className={`flex-1 py-3 rounded-lg font-bold border transition ${operator === 'add' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-200 text-slate-600'}`}>Add</button>
                                 <button onClick={() => setOperator('sub')} className={`flex-1 py-3 rounded-lg font-bold border transition ${operator === 'sub' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-slate-200 text-slate-600'}`}>Subtract</button>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Amount</label>
                                 <div className={inputContainerClass}>
                                    <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className={fieldClass} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}/>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Unit</label>
                                 <div className={inputContainerClass}>
                                    <select value={unit} onChange={e => setUnit(e.target.value)} className={`${fieldClass} cursor-pointer bg-transparent`} style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}>
                                       <option value="days">Days</option>
                                       <option value="months">Months</option>
                                       <option value="years">Years</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
             {tab === 0 && diff ? (
                 <>
                    <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl flex flex-col justify-center h-[200px] relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Total Duration</div>
                          <div className="text-5xl font-bold tracking-tight mb-2 break-words">
                             {diff.years}y {diff.months}m {diff.days}d
                          </div>
                          <div className="text-brand-400 font-bold">{diff.totalDays.toLocaleString()} total days</div>
                       </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                       <h3 className="font-bold text-slate-800 mb-4">Breakdown</h3>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                             <div className="text-3xl font-bold text-slate-900 mb-1 break-all">{diff.totalDays.toLocaleString()}</div>
                             <div className="text-xs text-slate-500 font-bold uppercase">Days</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                             <div className="text-3xl font-bold text-slate-900 mb-1 break-all">{diff.businessDays.toLocaleString()}</div>
                             <div className="text-xs text-slate-500 font-bold uppercase">Business Days</div>
                          </div>
                       </div>
                    </div>
                 </>
             ) : (
                 <div className="bg-slate-900 text-white rounded-2xl p-10 shadow-xl flex flex-col justify-center items-center h-[300px] relative">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Resulting Date</div>
                    <div className="text-5xl md:text-6xl font-bold tracking-tight mb-2 text-center break-words">
                       {format(addedDate, 'MMM do')}
                    </div>
                    <div className="text-2xl text-brand-400 font-medium">
                       {format(addedDate, 'yyyy')}
                    </div>
                    <div className="text-slate-500 font-bold mt-4 bg-white/10 px-4 py-1 rounded-full text-sm">
                       {format(addedDate, 'EEEE')}
                    </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};
