
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalculatorCategory } from '../types';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarProps {
  categories: CalculatorCategory[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, isOpen, onClose }) => {
  const location = useLocation();
  // State to track collapsed categories (key = title, value = isCollapsed)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Overlay - Visible on Mobile & Tablet (hidden on Desktop lg) */}
      {isOpen && (
        <div 
          className="fixed top-14 md:top-16 left-0 right-0 bottom-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed top-14 md:top-16 left-0 bottom-0 z-40 w-72 bg-white border-r border-slate-200 overflow-y-auto transform transition-transform duration-300 ease-out shadow-xl lg:shadow-none
          lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 space-y-1">
           {categories.map((cat) => {
             const isCollapsed = collapsed[cat.title];
             const hasActiveChild = cat.items.some(item => item.path === location.pathname);

             return (
               <div key={cat.title} className="mb-2">
                 <button 
                   onClick={() => toggle(cat.title)}
                   className={`
                     w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group select-none
                     ${hasActiveChild ? 'bg-brand-50/50' : 'hover:bg-slate-50'}
                   `}
                 >
                   <div className="flex items-center gap-3 font-bold text-sm text-slate-700 uppercase tracking-wide">
                      <span className={`${hasActiveChild ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} transition-colors`}>
                        {cat.icon}
                      </span>
                      {cat.title}
                   </div>
                   <div className={`text-slate-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-0'}`}>
                     {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                   </div>
                 </button>
                 
                 <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}`}
                 >
                   <ul className="mt-1 mb-3 space-y-0.5 ml-3 border-l-2 border-slate-100 pl-2">
                     {cat.items.map(item => {
                       const isActive = location.pathname === item.path;
                       
                       return (
                         <li key={item.label}>
                           <Link
                             to={item.path}
                             onClick={onClose}
                             className={`
                               block px-3 py-2 rounded-md text-sm transition-all duration-200 relative
                               ${isActive 
                                 ? 'text-brand-700 font-bold bg-brand-50' 
                                 : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                             `}
                           >
                             {item.label}
                             {isActive && (
                               <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[11px] w-1 h-6 bg-brand-500 rounded-r-full"></div>
                             )}
                           </Link>
                         </li>
                       );
                     })}
                   </ul>
                 </div>
               </div>
             );
           })}
        </div>
      </aside>
    </>
  );
};
