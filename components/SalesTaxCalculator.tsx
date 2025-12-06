
import React, { useState } from 'react';
import { DollarSign, ShoppingCart, Receipt } from 'lucide-react';
import { SEO } from './SEO';
import { useCurrency } from '../context/CurrencyContext';

export const SalesTaxCalculator: React.FC = () => {
  const { currency } = useCurrency();
  const symbol = currency.symbol;

  const [amount, setAmount] = useState<number>(100);
  const [taxRate, setTaxRate] = useState<number>(7.25);
  const [isReverse, setIsReverse] = useState(false);

  const calculate = () => {
    if (isReverse) {
      const preTax = amount / (1 + taxRate / 100);
      const tax = amount - preTax;
      return { preTax, tax, total: amount };
    } else {
      const tax = amount * (taxRate / 100);
      const total = amount + tax;
      return { preTax: amount, tax, total };
    }
  };

  const result = calculate();

  // Styles
  const inputContainerClass = "flex items-center bg-white border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 overflow-hidden transition shadow-sm h-12";
  const iconClass = "pl-3 pr-2 text-slate-400 font-bold";
  const fieldClass = "flex-1 w-full h-full p-2 outline-none font-bold text-black min-w-0 bg-transparent !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Sales Tax Calculator - Forward & Reverse"
        description="Calculate sales tax from price or reverse calculate tax from total price. Supports custom tax rates."
        keywords="sales tax calculator, reverse tax calculator, tax calculator, vat calculator, gst calculator, sales tax"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Sales Tax <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500">Calculate tax or reverse tax from total.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inputs */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                 <DollarSign size={18} className="text-brand-600"/> Parameters
              </h2>

              <div className="space-y-5">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Calculation Mode</label>
                   <div className="flex bg-slate-100 p-1 rounded-lg">
                     <button 
                       onClick={() => setIsReverse(false)}
                       className={`flex-1 py-2 rounded-md font-bold text-sm transition ${!isReverse ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       Add Tax
                     </button>
                     <button 
                       onClick={() => setIsReverse(true)}
                       className={`flex-1 py-2 rounded-md font-bold text-sm transition ${isReverse ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       Reverse Tax
                     </button>
                   </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
                      {isReverse ? 'Total Price (Inc. Tax)' : 'Price Before Tax'}
                    </label>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Tax Rate (%)</label>
                    <div className={inputContainerClass}>
                        <input 
                            type="number" 
                            step="0.01"
                            value={taxRate} 
                            onChange={e => setTaxRate(Number(e.target.value))}
                            className={fieldClass}
                            style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                        />
                        <div className="pr-3 pl-2 text-slate-500 font-bold select-none bg-slate-50 h-full flex items-center border-l border-slate-100">%</div>
                    </div>
                    
                    <div className="flex gap-2 mt-2 flex-wrap">
                       {[5, 7.25, 8.875, 10].map(r => (
                          <button 
                            key={r}
                            onClick={() => setTaxRate(r)} 
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600 transition"
                          >
                            {r}%
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Dashboard Results */}
        <div className="lg:col-span-8 space-y-6">
           {/* Summary Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
                 <div className="relative z-10">
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Total Price</p>
                    <div className="text-3xl lg:text-4xl font-bold tracking-tight mb-1">
                       {symbol}{result.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                 </div>
                 <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <ShoppingCart size={80} />
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                 <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Tax Amount</p>
                    <div className="text-2xl font-bold text-amber-500">
                       {symbol}{result.tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">At {taxRate}% rate</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                 <div>
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Net Price</p>
                    <div className="text-2xl font-bold text-slate-800">
                       {symbol}{result.preTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">Before Tax</p>
              </div>
           </div>

           {/* Receipt View */}
           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center">
               <div className="max-w-md w-full bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                     <Receipt className="text-slate-400" size={24}/>
                  </div>
                  
                  <h3 className="text-center font-bold text-slate-800 uppercase tracking-widest mb-6 mt-2">Receipt</h3>
                  
                  <div className="space-y-4 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="text-slate-900 font-bold text-lg">{symbol}{result.preTax.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Tax ({taxRate}%)</span>
                        <span className="text-amber-600 font-bold text-lg">+ {symbol}{result.tax.toFixed(2)}</span>
                     </div>
                     <div className="my-2 border-t-2 border-dashed border-slate-300"></div>
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-800 font-bold uppercase">Total</span>
                        <span className="text-brand-600 font-extrabold text-2xl">{symbol}{result.total.toFixed(2)}</span>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
