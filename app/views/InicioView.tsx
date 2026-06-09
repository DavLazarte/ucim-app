"use client";

import { useAuth } from "../context/AuthContext";

interface InicioViewProps {
  setTab: (tab: "inicio" | "carnet" | "beneficios" | "cuenta") => void;
}

export default function InicioView({ setTab }: InicioViewProps) {
  const { socio, logout, categoriasBeneficios } = useAuth();

  if (!socio) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="bg-transparent px-1 pt-2 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="UCIM Logo" className="h-10 w-auto mix-blend-multiply" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="text-xs text-slate-400 hover:text-red-500 font-medium px-2">Salir</button>
          <div className="h-10 w-10 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center text-blue-900 font-bold shadow-inner">
            {socio.first_name.charAt(0)}
          </div>
        </div>
      </header>

      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-800">Hola, {socio.first_name.split(" ")[0]}</h1>
        <p className="text-slate-500 text-sm">Bienvenido a tu portal de beneficios</p>
      </div>

      <div className={`rounded-3xl p-6 shadow-xl text-white relative overflow-hidden group ${
        socio.is_al_dia 
          ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 shadow-blue-900/20'
          : 'bg-gradient-to-br from-red-600 via-red-500 to-red-700 shadow-red-600/20'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Estado de cuenta</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {socio.is_al_dia && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${socio.is_al_dia ? 'bg-green-400' : 'bg-red-200'}`}></span>
              </span>
              <span className={`font-bold tracking-wide uppercase ${socio.is_al_dia ? 'text-green-400' : 'text-white'}`}>
                {socio.is_al_dia ? 'Al Día' : 'Pendiente de Pago'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold">
            DNI {socio.dni}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end relative z-10">
          <div>
            <p className="text-white/80 text-xs mb-1">Tu perfil</p>
            <p className="font-medium text-sm truncate max-w-[150px]">{socio.first_name} {socio.last_name}</p>
          </div>
          <button onClick={() => setTab("carnet")} className={`bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-colors active:scale-95 ${socio.is_al_dia ? 'text-blue-900' : 'text-red-700'}`}>
            Ver Credencial
          </button>
        </div>
      </div>

      {/* Slider de Beneficios Destacados */}
      {categoriasBeneficios && categoriasBeneficios.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-end mb-4 px-1">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Beneficios Destacados</h2>
              <p className="text-xs text-slate-500">Aprovechá tus descuentos</p>
            </div>
            <button 
              onClick={() => setTab("beneficios")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Ver todos &rarr;
            </button>
          </div>
          
          {/* Scroll horizontal con snap */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 hide-scrollbar">
            {categoriasBeneficios
              .flatMap((cat: any) => cat.benefits)
              .slice(0, 5) // Tomamos los 5 primeros beneficios de cualquier categoría
              .map((beneficio: any) => (
                <div 
                  key={beneficio.id} 
                  className={`min-w-[240px] w-[240px] snap-center bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between ${!socio.is_al_dia ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h4 className="font-bold text-slate-800 text-base leading-tight line-clamp-2">
                      {beneficio.company_name}
                    </h4>
                    <span className="bg-amber-100 text-amber-700 font-black px-2 py-1 rounded-lg text-xs whitespace-nowrap">
                      {beneficio.discount_percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">{beneficio.title}</p>
                  
                  <div className="pt-2 border-t border-slate-50">
                    <button 
                      onClick={() => setTab("beneficios")}
                      className="text-xs font-semibold text-blue-600 w-full text-left"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3 px-1">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTab("beneficios")}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left hover:shadow-md hover:border-blue-100 transition-all group"
          >
            <div className="bg-amber-100 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              🎁
            </div>
            <h3 className="font-semibold text-slate-800">Beneficios</h3>
            <p className="text-xs text-slate-500 mt-1">Catálogo completo</p>
          </button>

          <button
            onClick={() => setTab("cuenta")}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left hover:shadow-md hover:border-blue-100 transition-all group opacity-50 cursor-not-allowed"
          >
            <div className="bg-slate-100 text-slate-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3">
              🚧
            </div>
            <h3 className="font-semibold text-slate-800">Pagos</h3>
            <p className="text-xs text-slate-500 mt-1">Próximamente</p>
          </button>
        </div>
      </div>
    </div>
  );
}
