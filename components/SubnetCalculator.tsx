
import React, { useState } from 'react';
import { Network, Server, Globe, Shield } from 'lucide-react';
import { SEO } from './SEO';

export const SubnetCalculator: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);

  // Helper: IP to Long
  const ipToLong = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  // Helper: Long to IP
  const longToIp = (long: number) => {
    return [
       (long >>> 24) & 255,
       (long >>> 16) & 255,
       (long >>> 8) & 255,
       long & 255
    ].join('.');
  };

  const calculate = () => {
     if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return null;
     
     const mask = ~((1 << (32 - cidr)) - 1) >>> 0;
     const ipLong = ipToLong(ip);
     
     const netAddr = (ipLong & mask) >>> 0;
     const broadcast = (netAddr | (~mask >>> 0)) >>> 0;
     
     const firstHost = (netAddr + 1) >>> 0;
     const lastHost = (broadcast - 1) >>> 0;
     const numHosts = Math.pow(2, 32 - cidr) - 2;

     return {
        netmask: longToIp(mask),
        network: longToIp(netAddr),
        broadcast: longToIp(broadcast),
        firstHost: longToIp(firstHost),
        lastHost: longToIp(lastHost),
        count: numHosts > 0 ? numHosts : 0,
        binaryIp: ipLong.toString(2).padStart(32, '0').match(/.{8}/g)?.join('.')
     };
  };

  const res = calculate();

  // Styles
  const inputContainerClass = "bg-white border border-slate-300 rounded-lg p-3 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition";
  const fieldClass = "flex-1 w-full bg-transparent outline-none font-mono font-bold text-slate-900 !text-black";

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-fade-in pb-12">
      <SEO 
        title="Subnet Calculator - CIDR & IP Networks"
        description="IPv4 Subnet Calculator. Calculate network address, broadcast address, netmask, and usable host range from an IP and CIDR."
        keywords="subnet calculator, ip calculator, cidr calculator, network address, ipv4 subnetting, network mask"
      />
      <header className="mb-2 pt-2">
        <h1 className="text-2xl font-bold text-slate-900">Subnet <span className="text-brand-600">Calculator</span></h1>
        <p className="text-sm text-slate-500 mt-1">IPv4 CIDR network analysis tool.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
         
         {/* Left: Inputs */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Shield size={18} className="text-brand-600"/> Configuration
                 </h2>
                 
                 <div className="space-y-6">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">IP Address</label>
                         <div className={inputContainerClass}>
                             <input 
                               type="text" 
                               value={ip} 
                               onChange={e => setIp(e.target.value)} 
                               className={fieldClass}
                               placeholder="192.168.0.1"
                               style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                             />
                         </div>
                     </div>

                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">CIDR Notation</label>
                         <div className={inputContainerClass}>
                             <select 
                               value={cidr} 
                               onChange={e => setCidr(Number(e.target.value))}
                               className="w-full bg-transparent outline-none font-bold text-slate-900 cursor-pointer"
                               style={{ color: '#000000', opacity: 1, WebkitTextFillColor: '#000000' }}
                             >
                                {Array.from({length: 32}, (_, i) => i + 1).map(n => (
                                   <option key={n} value={n}>/{n}</option>
                                ))}
                             </select>
                         </div>
                     </div>
                 </div>
             </div>
         </div>

         {/* Right: Results */}
         <div className="lg:col-span-8 space-y-6">
             {res ? (
                 <div className="space-y-6">
                     {/* Network & Broadcast Grid */}
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                           <div>
                              <div className="flex items-center gap-2 text-brand-600 mb-1 font-bold uppercase text-xs">
                                 <Network size={16}/> Network
                              </div>
                              <div className="font-mono text-xl font-bold text-slate-900">{res.network}</div>
                           </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                           <div>
                              <div className="flex items-center gap-2 text-brand-600 mb-1 font-bold uppercase text-xs">
                                 <Globe size={16}/> Broadcast
                              </div>
                              <div className="font-mono text-xl font-bold text-slate-900">{res.broadcast}</div>
                           </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                           <div>
                              <div className="flex items-center gap-2 text-slate-500 mb-1 font-bold uppercase text-xs">
                                 Netmask
                              </div>
                              <div className="font-mono text-xl font-bold text-slate-800">{res.netmask}</div>
                           </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                           <div>
                              <div className="flex items-center gap-2 text-slate-500 mb-1 font-bold uppercase text-xs">
                                 <Server size={16}/> Hosts
                              </div>
                              <div className="font-mono text-xl font-bold text-slate-800">{res.count.toLocaleString()}</div>
                           </div>
                        </div>
                     </div>

                     {/* Host Range Hero */}
                     <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Usable Host Range</div>
                        <div className="font-mono text-2xl md:text-3xl font-bold flex flex-wrap items-center gap-4">
                           <span>{res.firstHost}</span>
                           <span className="text-brand-500">➜</span>
                           <span>{res.lastHost}</span>
                        </div>
                     </div>

                     {/* Binary */}
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Binary Visualization</div>
                         <div className="font-mono text-sm md:text-base text-slate-600 tracking-wider">
                             {res.binaryIp}
                         </div>
                         <div className="font-mono text-sm md:text-base tracking-wider mt-1 flex">
                            <span className="text-brand-600 font-bold">{'1'.repeat(cidr)}</span>
                            <span className="text-slate-300">{'0'.repeat(32-cidr)}</span>
                         </div>
                         <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Subnet Mask Bits</div>
                     </div>
                 </div>
             ) : (
                 <div className="h-full min-h-[300px] flex items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-slate-400">
                        <Network size={48} className="mx-auto mb-4 opacity-50"/>
                        <p className="font-medium">Enter valid IP to analyze</p>
                    </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};
