"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Tab = "inicio" | "carnet" | "beneficios" | "cuenta";

const socio = {
  nombre: "Carlos Méndez",
  numero: "UCM-0142",
  dni: "28456789",
  estado: "al_dia",
  cuota: 8500,
  vencimiento: "01/07/2025",
};

const beneficios = [
  {
    id: 1,
    nombre: "Farmacia del Centro",
    descuento: "20% OFF",
    categoria: "Salud",
    requiere_al_dia: true,
  },
  {
    id: 2,
    nombre: "Asesoramiento Legal",
    descuento: "Gratis",
    categoria: "Legal",
    requiere_al_dia: true,
  },
  {
    id: 3,
    nombre: "Seguros Litoral",
    descuento: "Tarifa especial",
    categoria: "Seguros",
    requiere_al_dia: true,
  },
  {
    id: 4,
    nombre: "Capacitaciones UCIM",
    descuento: "100% bonificado",
    categoria: "Capacitación",
    requiere_al_dia: false,
  },
];

const movimientos = [
  { fecha: "01/06/2025", concepto: "Cuota Junio", monto: 8500, tipo: "credito" },
  { fecha: "01/05/2025", concepto: "Cuota Mayo", monto: 8500, tipo: "credito" },
  { fecha: "01/04/2025", concepto: "Cuota Abril", monto: 7500, tipo: "credito" },
  { fecha: "01/03/2025", concepto: "Cuota Marzo", monto: 7500, tipo: "credito" },
];

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("inicio");
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Interceptar el evento de instalación
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Solo mostramos el modal si no estamos logueados (para no molestar) o si lo forzamos
      if (!isLoggedIn) {
        setShowInstallModal(true);
      }
    });
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallModal(false);
      }
    }
  };

  const formatMoney = (value: number) => `$${value.toLocaleString("es-AR")} ARS`;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="w-full max-w-sm relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 border border-white/50">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/logo.webp" 
                  alt="UCIM Logo" 
                  className="h-24 w-auto object-contain drop-shadow-md transition-transform hover:scale-105"
                />
              </div>
              <h2 className="text-slate-500 text-sm font-medium tracking-wide">PORTAL DEL SOCIO</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase px-1">DNI del Socio</label>
                <input
                  placeholder="Ingresá tu DNI"
                  defaultValue={socio.dni}
                  className="w-full bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase px-1">Contraseña</label>
                <input
                  type="password"
                  placeholder="Tu clave de acceso"
                  className="w-full bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-700"
                />
              </div>

              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all duration-300 hover:shadow-blue-900/40 active:scale-[0.98] mt-2"
              >
                Ingresar a mi cuenta
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-8 font-medium">
            © {new Date().getFullYear()} UCIM — Paraná, Entre Ríos
          </p>

          {/* Botón manual para forzar la vista del modal en desarrollo */}
          <button 
            onClick={() => setShowInstallModal(true)}
            className="mt-6 w-full py-2 bg-slate-200/50 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Probar Modal de Instalación
          </button>
        </div>

        {/* PWA Install Modal */}
        {showInstallModal && (
          <div className="absolute inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-900/40 backdrop-blur-sm p-4 pb-8 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative translate-y-0">
              <button 
                onClick={() => setShowInstallModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <img src="/logo.webp" alt="UCIM" className="w-14 h-14 object-contain bg-slate-50 p-2 rounded-2xl border border-slate-100" />
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">Instalar App UCIM</h3>
                  <p className="text-sm text-slate-500">Acceso rápido a tu credencial</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                Instalá nuestra app en tu celular para acceder más rápido a tu credencial digital y presentarla en comercios sin necesidad de usar el navegador.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowInstallModal(false)}
                  className="flex-1 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Más tarde
                </button>
                <button 
                  onClick={handleInstallClick}
                  className="flex-1 py-3 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg shadow-blue-700/30 transition-colors"
                >
                  Instalar ahora
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28 font-sans">
      {/* Premium Header */}
      <header className="bg-white px-6 pt-12 pb-4 shadow-sm sticky top-0 z-30 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="UCIM Logo" className="h-10 w-auto" />
        </div>
        <div className="h-10 w-10 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center text-blue-900 font-bold shadow-inner">
          {socio.nombre.charAt(0)}
        </div>
      </header>

      <div className="p-5 max-w-md mx-auto">
        
        {/* INICIO */}
        {tab === "inicio" && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-slate-800">Hola, {socio.nombre.split(" ")[0]}</h1>
              <p className="text-slate-500 text-sm">Bienvenido a tu portal de beneficios</p>
            </div>

            {/* Quick Status Card */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-3xl p-6 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-1">Estado de cuenta</p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-bold tracking-wide uppercase text-green-400">Al Día</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold">
                  {socio.numero}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end relative z-10">
                <div>
                  <p className="text-blue-200 text-xs mb-1">Próximo vencimiento</p>
                  <p className="font-medium">{socio.vencimiento}</p>
                </div>
                <button onClick={() => setTab("carnet")} className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-50 transition-colors active:scale-95">
                  Ver Credencial
                </button>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-3">Accesos rápidos</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTab("beneficios")}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left hover:shadow-md hover:border-blue-100 transition-all group"
                >
                  <div className="bg-amber-100 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                    🎁
                  </div>
                  <h3 className="font-semibold text-slate-800">Beneficios</h3>
                  <p className="text-xs text-slate-500 mt-1">Explorar comercios</p>
                </button>

                <button
                  onClick={() => setTab("cuenta")}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left hover:shadow-md hover:border-blue-100 transition-all group"
                >
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <h3 className="font-semibold text-slate-800">Pagos</h3>
                  <p className="text-xs text-slate-500 mt-1">Ver mis cuotas</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARNET DIGITAL */}
        {tab === "carnet" && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 text-center">Tu Credencial</h2>
            <p className="text-center text-sm text-slate-500 mb-6 -mt-4">Mostrá este código para acceder a tus beneficios</p>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 relative">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white text-center">
                <img src="/logo.webp" alt="UCIM" className="h-12 w-auto mx-auto mb-3 brightness-0 invert" />
                <h3 className="text-xl font-bold">{socio.nombre}</h3>
                <p className="text-blue-200 text-sm mt-1">{socio.numero}</p>
              </div>
              
              <div className="p-8 flex flex-col items-center">
                <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-100 mb-6 relative">
                  <QRCodeSVG value={`ucim.org.ar/verificar/${socio.numero}`} size={200} />
                  
                  {socio.estado !== "al_dia" && (
                    <div className="absolute inset-0 bg-red-600/95 text-white flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                      <span className="text-4xl mb-2">🔒</span>
                      <span className="font-bold text-lg">Membresía inactiva</span>
                    </div>
                  )}
                </div>

                <div className={`px-6 py-2 rounded-full border flex items-center gap-2 font-bold ${socio.estado === 'al_dia' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                  {socio.estado === 'al_dia' ? (
                    <>
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      SOCIO AL DÍA
                    </>
                  ) : 'PENDIENTE DE PAGO'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BENEFICIOS */}
        {tab === "beneficios" && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Beneficios</h2>
              <p className="text-sm text-slate-500">Descuentos exclusivos por ser socio</p>
            </div>

            <div className="space-y-4">
              {beneficios.map((beneficio) => {
                const tieneAcceso = !beneficio.requiere_al_dia || socio.estado === "al_dia";
                return (
                  <div key={beneficio.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
                          {beneficio.categoria}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight mt-1">{beneficio.nombre}</h3>
                      </div>
                      <div className="bg-amber-100 text-amber-700 font-black px-3 py-1.5 rounded-xl text-sm whitespace-nowrap">
                        {beneficio.descuento}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                      {tieneAcceso ? (
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Disponible para usar
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-red-500 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"></path></svg>
                          Requiere estar al día
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUENTA */}
        {tab === "cuenta" && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Mi Cuenta</h2>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-sm mb-1">Deuda actual</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-white">$0</p>
                  <p className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded">¡Al día!</p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Próxima cuota</p>
                    <p className="font-semibold text-lg">{formatMoney(socio.cuota)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">Vencimiento</p>
                    <p className="font-semibold text-lg">{socio.vencimiento}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 mb-5">Historial de Pagos</h3>
              
              <div className="space-y-0">
                {movimientos.map((movimiento, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{movimiento.concepto}</p>
                        <p className="text-xs text-slate-500 font-medium">{movimiento.fecha}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-800">{formatMoney(movimiento.monto)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-40">
        <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-slate-200/50 shadow-2xl rounded-2xl overflow-hidden flex justify-between px-2 py-1">
          <button
            onClick={() => setTab("inicio")}
            className={`flex flex-col items-center justify-center w-1/4 py-3 rounded-xl transition-all duration-300 ${
              tab === "inicio" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={tab === "inicio" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="text-[10px] font-bold">Inicio</span>
          </button>

          <button
            onClick={() => setTab("carnet")}
            className={`flex flex-col items-center justify-center w-1/4 py-3 rounded-xl transition-all duration-300 relative ${
              tab === "carnet" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <svg className="w-6 h-6 mb-1" fill={tab === "carnet" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            <span className="text-[10px] font-bold">Carnet</span>
          </button>

          <button
            onClick={() => setTab("beneficios")}
            className={`flex flex-col items-center justify-center w-1/4 py-3 rounded-xl transition-all duration-300 ${
              tab === "beneficios" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={tab === "beneficios" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
            <span className="text-[10px] font-bold">Promo</span>
          </button>

          <button
            onClick={() => setTab("cuenta")}
            className={`flex flex-col items-center justify-center w-1/4 py-3 rounded-xl transition-all duration-300 ${
              tab === "cuenta" ? "text-blue-700 bg-blue-50/80 scale-105" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={tab === "cuenta" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            <span className="text-[10px] font-bold">Pagos</span>
          </button>
        </nav>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
