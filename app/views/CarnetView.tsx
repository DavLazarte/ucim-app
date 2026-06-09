"use client";

import { useAuth } from "../context/AuthContext";

export default function CarnetView() {
  const { socio } = useAuth();

  if (!socio) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="pt-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Tu Credencial</h2>
        <p className="text-center text-sm text-slate-500 mb-6 mt-1">Presentá este carnet en los comercios adheridos</p>
      </div>

      <div className="relative group perspective-1000 mx-auto w-full max-w-sm">
        {/* Holographic Glow Effect */}
        <div className={`absolute -inset-1 rounded-[2.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${
          socio.is_al_dia 
            ? 'bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-600' 
            : 'bg-gradient-to-r from-red-400 via-rose-400 to-red-600'
        }`}></div>
        
        {/* Card Body */}
        <div className={`relative rounded-[2rem] shadow-2xl overflow-hidden border backdrop-blur-xl ${
          socio.is_al_dia 
            ? 'border-blue-200/50 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
            : 'border-red-200/50 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900'
        }`}>
          
          {/* Glassmorphism reflections */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="px-8 pt-8 pb-6 text-white text-center relative z-10">
            <img src="/logo.webp" alt="UCIM" className="h-10 w-auto mx-auto mb-6 brightness-0 invert opacity-90" />
            
            {/* Avatar / Seal */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className={`absolute inset-0 rounded-full flex items-center justify-center text-3xl font-black shadow-inner border-4 ${
                socio.is_al_dia
                  ? 'bg-gradient-to-br from-amber-200 to-amber-500 border-amber-100 text-amber-900'
                  : 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-100 text-slate-700'
              }`}>
                {socio.first_name.charAt(0)}{socio.last_name.charAt(0)}
              </div>
              
              {!socio.is_al_dia && (
                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full p-1.5 border-2 border-slate-900 shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
              )}
            </div>

            <h3 className="text-2xl font-black tracking-tight mt-2">{socio.first_name} <br/> {socio.last_name}</h3>
            <p className="text-white/60 text-xs tracking-[0.2em] mt-2 uppercase font-semibold">Socio Titular</p>
          </div>
          
          <div className="p-6 bg-black/20 backdrop-blur-md border-t border-white/10 relative z-10 flex justify-between items-center">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Documento</p>
              <p className="text-white font-mono font-bold tracking-widest">{socio.dni}</p>
            </div>

            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold shadow-lg ${
              socio.is_al_dia 
                ? 'bg-green-500/20 border-green-400/50 text-green-300' 
                : 'bg-red-500/20 border-red-400/50 text-red-300'
            }`}>
              {socio.is_al_dia ? 'ACTIVO' : 'SUSPENDIDO'}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
