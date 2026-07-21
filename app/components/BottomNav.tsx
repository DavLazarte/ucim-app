"use client";

import { useAuth } from "../context/AuthContext";

interface BottomNavProps {
  tab: "inicio" | "carnet" | "beneficios" | "pagos" | "cuenta";
  setTab: (tab: "inicio" | "carnet" | "beneficios" | "pagos" | "cuenta") => void;
}

export default function BottomNav({ tab, setTab }: BottomNavProps) {
  const { socio } = useAuth();

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-40">
      <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-slate-200/50 shadow-2xl rounded-2xl overflow-hidden flex justify-between px-2 py-1">
        <button
          onClick={() => setTab("inicio")}
          className={`flex flex-col items-center justify-center w-1/5 py-3 rounded-xl transition-all duration-300 ${
            tab === "inicio" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill={tab === "inicio" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>

        <button
          onClick={() => setTab("carnet")}
          className={`flex flex-col items-center justify-center w-1/5 py-3 rounded-xl transition-all duration-300 relative ${
            tab === "carnet" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {socio && !socio.is_al_dia && <div className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
          <svg className="w-6 h-6 mb-1" fill={tab === "carnet" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          <span className="text-[10px] font-bold">Carnet</span>
        </button>

        <button
          onClick={() => setTab("beneficios")}
          className={`flex flex-col items-center justify-center w-1/5 py-3 rounded-xl transition-all duration-300 ${
            tab === "beneficios" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill={tab === "beneficios" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
          <span className="text-[10px] font-bold">Promo</span>
        </button>

        <button
          onClick={() => setTab("pagos")}
          className={`flex flex-col items-center justify-center w-1/5 py-3 rounded-xl transition-all duration-300 ${
            tab === "pagos" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill={tab === "pagos" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          <span className="text-[10px] font-bold">Pagos</span>
        </button>

        <button
          onClick={() => setTab("cuenta")}
          className={`flex flex-col items-center justify-center w-1/5 py-3 rounded-xl transition-all duration-300 ${
            tab === "cuenta" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill={tab === "cuenta" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
