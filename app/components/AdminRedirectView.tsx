"use client";

import { useAuth } from "../context/AuthContext";

export default function AdminRedirectView() {
  const { user, logout } = useAuth();
  
  // URL dinámica del backend para armar el link directo al panel
  const backendUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : "http://ucim.test";
    
  const filamentUrl = `${backendUrl}/admin`;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso Administrativo</h2>
        <p className="text-slate-500 mb-8">
          Hola <strong>{user?.name}</strong>. Esta aplicación móvil es de uso exclusivo para Socios. Como tenés el rol de <strong>{user?.role === 'admin' ? 'Administrador' : 'Secretaría'}</strong>, debés gestionar el sistema desde el Panel Web.
        </p>
        
        <div className="space-y-3">
          <a 
            href={filamentUrl}
            className="block w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold shadow-lg transition-colors"
          >
            Ir al Sistema Web
          </a>
          <button 
            onClick={logout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </main>
  );
}
