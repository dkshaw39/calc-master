
import React, { useState } from 'react';
import { addDays, format, differenceInWeeks } from 'date-fns';
import { Button } from './Button';
import { Baby, Calendar, Heart, Eye, Activity } from 'lucide-react';
import { SEO } from './SEO';

export const PregnancyCalculator: React.FC = () => {
    const [lastPeriod, setLastPeriod] = useState(new Date().toISOString().split('T')[0]);
    const [cycleLength, setCycleLength] = useState(28);
    const [calculated, setCalculated] = useState(false);

    // Results
    const lmp = new Date(lastPeriod);
    const cycleAdj = cycleLength - 28;
    const dueDate = addDays(lmp, 280 + cycleAdj);
    
    // Milestones
    const milestones = [
        { week: 4, title: 'Positive Test', icon: Activity, date: addDays(lmp, 28 + cycleAdj) },
        { week: 6, title: 'First Heartbeat', icon: Heart, date: addDays(lmp, 42 + cycleAdj) },
        { week: 12, title: 'End of 1st Trimester', icon: Baby, date: addDays(lmp, 84 + cycleAdj) },
        { week: 20, title: 'Anatomy Scan (Gender)', icon: Eye, date: addDays(lmp, 140 + cycleAdj) },
        { week: 24, title: 'Viability', icon: Activity, date: addDays(lmp, 168 + cycleAdj) },
        { week: 27, title: 'End of 2nd Trimester', icon: Baby, date: addDays(lmp, 189 + cycleAdj) },
        { week: 40, title: 'Due Date', icon: Calendar, date: dueDate },
    ];

    const currentWeeks = differenceInWeeks(new Date(), lmp);

    // Styles
    const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
    const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
             <SEO 
                title="Pregnancy Calculator - Due Date & Milestones"
                description="Calculate your pregnancy due date based on last period. View a weekly timeline of key fetal milestones and trimester dates."
                keywords="pregnancy calculator, due date calculator, conception calculator, pregnancy timeline, trimester chart"
             />
             <header className="mb-2 pt-2">
                <h1 className="text-2xl font-bold text-slate-900">Pregnancy <span className="text-brand-600">Calculator</span></h1>
                <p className="text-sm text-slate-500 mt-1">Estimate due date and key fetal milestones.</p>
             </header>

             <div className="grid lg:grid-cols-12 gap-6 items-start">
                 {/* Left: Inputs */}
                 <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                           <Calendar size={18} className="text-brand-600"/> Dates
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">First Day of Last Period</label>
                                <div className={inputContainerClass}>
                                   <input 
                                     type="date" 
                                     value={lastPeriod} 
                                     onChange={e => setLastPeriod(e.target.value)} 
                                     className={fieldClass}
                                     style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                   />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Avg Cycle Length (Days)</label>
                                <div className={inputContainerClass}>
                                   <input 
                                     type="number" 
                                     value={cycleLength} 
                                     onChange={e => setCycleLength(Number(e.target.value))} 
                                     className={fieldClass}
                                     style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                                   />
                                </div>
                            </div>
                            <Button onClick={() => setCalculated(true)} size="lg" className="w-full h-12 text-base mt-2">
                               Calculate Timeline
                            </Button>
                        </div>
                    </div>
                 </div>

                 {/* Right: Results */}
                 <div className="lg:col-span-8 space-y-6">
                     {calculated ? (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                             {/* Hero Result */}
                             <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                                 <div className="relative z-10">
                                     <div className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-2">Estimated Due Date</div>
                                     <div className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 break-words">
                                         {format(dueDate, 'MMMM do')}
                                     </div>
                                     <div className="text-xl text-slate-300 font-medium">
                                         {format(dueDate, 'yyyy')} • {format(dueDate, 'EEEE')}
                                     </div>
                                 </div>
                                 {/* Background Decor */}
                                 <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                                     <Baby size={180} />
                                 </div>
                             </div>

                             {/* Timeline */}
                             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
                                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Activity size={18} className="text-brand-600"/> Pregnancy Timeline
                                 </h3>
                                 <div className="relative pl-4 md:pl-8">
                                     <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                                     <div className="space-y-6">
                                         {milestones.map((m, i) => (
                                             <div key={i} className="relative flex items-center gap-4 md:gap-6 group">
                                                 <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm transition shrink-0 ${currentWeeks >= m.week ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <m.icon size={20} className="md:w-6 md:h-6" />
                                                 </div>
                                                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                     <div>
                                                         <div className="text-xs font-bold text-slate-400 uppercase mb-0.5">Week {m.week}</div>
                                                         <div className="font-bold text-slate-800">{m.title}</div>
                                                     </div>
                                                     <div className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg self-start sm:self-auto">
                                                         {format(m.date, 'MMM d')}
                                                     </div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="h-full min-h-[300px] flex items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                             <div className="text-center">
                                 <Baby size={48} className="mx-auto mb-4 opacity-50"/>
                                 <p className="font-medium">Enter dates to see your timeline</p>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};
