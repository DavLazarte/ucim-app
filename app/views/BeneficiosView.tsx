"use client";

import { useAuth } from "../context/AuthContext";

export default function BeneficiosView() {
  const { socio, categoriasBeneficios, loading } = useAuth();

  if (!socio) return null;

  return (
    <div className="space-y-6 animate-fade-in pt-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Catálogo de Beneficios</h2>
        <p className="text-sm text-slate-500">Separados por categoría</p>
      </div>

      {!socio.is_al_dia && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-700">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium">Regularizá tu estado de cuenta para poder aprovechar estos descuentos en los comercios adheridos.</p>
        </div>
      )}

      {loading ? (
        <div className="text-center text-slate-500 py-10">Cargando catálogo...</div>
      ) : categoriasBeneficios.length === 0 ? (
        <div className="text-center text-slate-500 py-10">No hay beneficios disponibles actualmente.</div>
      ) : (
        <div className="space-y-8">
          {categoriasBeneficios.map((categoria) => (
            <div key={categoria.id} className="space-y-4">
              <h3 className="font-black text-slate-800 border-b-2 border-slate-200 pb-2 flex items-center gap-2">
                <span className="text-blue-600">▪</span> {categoria.name}
              </h3>
              
              <div className="grid gap-4">
                {categoria.benefits.map((beneficio: any) => (
                  <div key={beneficio.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden transition-opacity ${!socio.is_al_dia ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{beneficio.company_name}</h4>
                        <p className="text-sm text-slate-600">{beneficio.title}</p>
                      </div>
                      <div className="bg-amber-100 text-amber-700 font-black px-3 py-1.5 rounded-xl text-sm whitespace-nowrap">
                        {beneficio.discount_percentage}% OFF
                      </div>
                    </div>
                    
                    {beneficio.description && (
                      <p className="text-xs text-slate-500 italic mt-[-8px]">
                        "{beneficio.description}"
                      </p>
                    )}
                    
                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      {socio.is_al_dia ? (
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1.5 uppercase tracking-wide">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Habilitado
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-500 flex items-center gap-1.5 uppercase tracking-wide">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"></path></svg>
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
