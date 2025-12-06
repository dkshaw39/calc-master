
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalculatorCategory } from '../types';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface CalculatorListProps {
  category: CalculatorCategory;
}

export const CalculatorList: React.FC<CalculatorListProps> = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const LIMIT = 4;
  const items = category.items;
  const hasMore = items.length > LIMIT;
  const visibleItems = isExpanded ? items : items.slice(0, LIMIT);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group/card relative">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-50/50 rounded-full blur-2xl group-hover/card:bg-brand-100/50 transition-colors"></div>

      <div className="p-6 border-b border-slate-100 flex items-center gap-4 relative z-10">
        <div className="p-3 bg-white border border-slate-100 text-brand-600 rounded-2xl shadow-sm group-hover/card:scale-110 group-hover/card:border-brand-100 group-hover/card:text-brand-700 transition-all duration-300">
           {category.icon}
        </div>
        <h3 className="font-bold text-slate-800 text-xl tracking-tight group-hover/card:text-brand-800 transition-colors">
          {category.title}
        </h3>
      </div>
      
      <div className="p-3 flex-1 bg-slate-50/30 flex flex-col">
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <li key={item.label}>
              <Link 
                to={item.path}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:text-brand-700 hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200/60 transition-all duration-200 group/item text-sm font-semibold"
              >
                <span>{item.label}</span>
                <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">
                   <ArrowRight size={12} strokeWidth={3} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {hasMore && (
            <button 
                onClick={(e) => {
                    e.currentTarget.blur();
                    setIsExpanded(!isExpanded);
                }}
                className="w-full mt-2 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide hover:bg-white hover:text-brand-600 hover:shadow-sm rounded-xl transition-all"
            >
                {isExpanded ? (
                    <>Show Less <ChevronUp size={14} strokeWidth={3}/></>
                ) : (
                    <>Show {items.length - LIMIT} More <ChevronDown size={14} strokeWidth={3}/></>
                )}
            </button>
        )}
      </div>
    </div>
  );
};
