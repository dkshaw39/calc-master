
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { RefreshCw, Copy, ShieldCheck, Volume2, Lock } from 'lucide-react';
import { SEO } from './SEO';

export const PasswordGenerator: React.FC = () => {
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        upper: true,
        lower: true,
        numbers: true,
        symbols: true,
        ambiguous: false, 
    });
    const [mode, setMode] = useState<'random' | 'pronounceable'>('random');
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(0);

    const generate = () => {
        let result = '';
        if (mode === 'pronounceable') {
            const cons = 'bcdfghjklmnpqrstvwxyz';
            const vows = 'aeiou';
            for (let i = 0; i < length; i++) {
                result += (i % 2 === 0) ? cons[Math.floor(Math.random()*cons.length)] : vows[Math.floor(Math.random()*vows.length)];
            }
            if (options.upper) result = result.charAt(0).toUpperCase() + result.slice(1);
            if (options.numbers) result += Math.floor(Math.random() * 100);
        } else {
            let charset = '';
            if (options.lower) charset += 'abcdefghijklmnopqrstuvwxyz';
            if (options.upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (options.numbers) charset += '0123456789';
            if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            if (!options.ambiguous) charset = charset.replace(/[Il1O0]/g, '');
            if (!charset) charset = 'abcdef'; 
            for (let i = 0; i < length; i++) {
                result += charset.charAt(Math.floor(Math.random() * charset.length));
            }
        }
        setPassword(result);
        calculateStrength(result);
    };

    const calculateStrength = (pwd: string) => {
        let s = 0;
        if (pwd.length > 8) s += 1;
        if (pwd.length > 12) s += 1;
        if (pwd.length > 16) s += 1;
        if (/[A-Z]/.test(pwd)) s += 1;
        if (/[0-9]/.test(pwd)) s += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) s += 1;
        setStrength(Math.min(s, 5)); 
    };

    useEffect(() => generate(), [length, options, mode]);

    const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-600'];
    const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
             <SEO 
                title="Password Generator - Secure & Random"
                description="Generate strong, secure passwords instantly. Choose between random characters or pronounceable passwords. Adjust length and complexity."
                keywords="password generator, secure password, random password, strong password creator, password security"
             />
             <header className="mb-2 pt-2">
                <h1 className="text-2xl font-bold text-slate-900">Password <span className="text-brand-600">Generator</span></h1>
                <p className="text-sm text-slate-500 mt-1">Create secure credentials instantly.</p>
             </header>

             <div className="grid lg:grid-cols-12 gap-6 items-start">
                 
                 {/* Left: Settings */}
                 <div className="lg:col-span-4 space-y-6">
                     <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                         <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <Lock size={18} className="text-brand-600"/> Settings
                         </h2>
                         
                         <div className="space-y-6">
                             <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Mode</label>
                                 <div className="flex bg-slate-100 p-1 rounded-lg">
                                     <button onClick={() => setMode('random')} className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-bold text-sm transition ${mode === 'random' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}>
                                         <ShieldCheck size={16}/> Random
                                     </button>
                                     <button onClick={() => setMode('pronounceable')} className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-md font-bold text-sm transition ${mode === 'pronounceable' ? 'bg-white shadow text-brand-600' : 'text-slate-500'}`}>
                                         <Volume2 size={16}/> Speakable
                                     </button>
                                 </div>
                             </div>

                             <div>
                                 <label className="flex justify-between font-bold text-slate-700 mb-4">
                                     <span className="text-xs uppercase text-slate-500">Length</span>
                                     <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-sm">{length}</span>
                                 </label>
                                 <input type="range" min="6" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"/>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {[
                                     { k: 'upper', l: 'ABC', dis: mode === 'pronounceable' },
                                     { k: 'lower', l: 'abc', dis: mode === 'pronounceable' },
                                     { k: 'numbers', l: '123', dis: false },
                                     { k: 'symbols', l: '@#$', dis: mode === 'pronounceable' },
                                     { k: 'ambiguous', l: 'No lI1', dis: mode === 'pronounceable' }
                                 ].map((o: any) => (
                                     <label key={o.k} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${options[o.k as keyof typeof options] ? 'bg-brand-50 border-brand-200' : 'border-slate-200'} ${o.dis ? 'opacity-50 pointer-events-none' : ''}`}>
                                         <input 
                                           type="checkbox" 
                                           checked={options[o.k as keyof typeof options]} 
                                           onChange={e => setOptions({...options, [o.k]: e.target.checked})}
                                           className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 shrink-0"
                                         />
                                         <span className="font-bold text-sm text-slate-700">{o.l}</span>
                                     </label>
                                 ))}
                             </div>

                             <Button onClick={generate} size="lg" className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800">
                                 <RefreshCw className="mr-2" size={18}/> Regenerate
                             </Button>
                         </div>
                     </div>
                 </div>

                 {/* Right: Results */}
                 <div className="lg:col-span-8 space-y-6">
                     <div className="bg-slate-900 rounded-2xl p-8 shadow-xl min-h-[250px] flex flex-col justify-center items-center relative group overflow-hidden">
                         <div className="font-mono text-3xl md:text-5xl text-white break-all text-center font-bold tracking-tight z-10 max-w-full">
                             {password}
                         </div>
                         <button 
                           onClick={() => navigator.clipboard.writeText(password)}
                           className="mt-6 flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition backdrop-blur-sm z-10"
                         >
                             <Copy size={18}/> Copy to Clipboard
                         </button>
                         {/* BG Noise/Pattern */}
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                     </div>

                     <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                         <div className="flex justify-between items-center mb-4">
                             <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">Security Strength</div>
                             <div className={`font-bold text-lg ${strength > 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                 {strengthLabel[strength]}
                             </div>
                         </div>
                         <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                             {[0,1,2,3,4].map(i => (
                                 <div key={i} className={`flex-1 transition-all duration-500 ${i < strength ? strengthColor[strength] : 'bg-transparent'}`}></div>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};
