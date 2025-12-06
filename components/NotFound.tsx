
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Home, Search, AlertCircle } from 'lucide-react';
import { SEO } from './SEO';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <SEO 
        title="Page Not Found" 
        description="The calculator you are looking for does not exist. Please browse our collection of free online financial, health, and math calculators."
        keywords="404, page not found, calculator not found"
      />
      
      <div className="bg-slate-50 p-6 rounded-full mb-6 relative">
        <div className="absolute inset-0 bg-brand-100 rounded-full animate-ping opacity-20"></div>
        <Calculator size={64} className="text-brand-600 relative z-10" />
        <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-100">
            <AlertCircle size={24} className="text-amber-500" fill="currentColor" color="white"/>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Calculator Not Found</h1>
      <p className="text-slate-500 max-w-md mb-8 text-lg">
        Oops! We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          to="/" 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
        >
          <Home size={18} />
          Go Home
        </Link>
        <Link 
          to="/mortgage" 
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm"
        >
          <Search size={18} />
          Browse Tools
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100 w-full max-w-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Calculators</p>
        <div className="flex flex-wrap justify-center gap-3">
            {[
                { l: 'Scientific Calculator', p: '/' },
                { l: 'Mortgage', p: '/mortgage' },
                { l: 'BMI', p: '/bmi' },
                { l: 'Casio Simulator', p: '/casio-scientific' },
                { l: 'Auto Loan', p: '/car-loan' },
                { l: 'Calorie', p: '/calorie' }
            ].map(c => (
                <Link key={c.l} to={c.p} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-600 hover:border-brand-200 transition">
                    {c.l}
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
