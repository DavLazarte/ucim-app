"use client";

import { useState, useEffect } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Verificar si ya descartó el cartel antes
    if (localStorage.getItem("ucim_pwa_dismissed")) {
      setHasDismissed(true);
      return;
    }

    // Detectar si ya está en modo Standalone (App instalada)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Detección de iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);

    if (isIOS && isSafari) {
      // Retrasar el cartel de iOS unos segundos para no ser molesto ni bien carga
      const timer = setTimeout(() => setShowIOSModal(true), 3000);
      return () => clearTimeout(timer);
    }

    // Detección de Android / Desktop Chrome (Evento nativo)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem("ucim_pwa_dismissed", "true");
    setHasDismissed(true);
    setShowAndroidModal(false);
    setShowIOSModal(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowAndroidModal(false);
      }
    }
  };

  if (hasDismissed) return null;

  // MODAL ANDROID / CHROME NATIVO
  if (showAndroidModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-900/60 backdrop-blur-sm p-4 pb-8 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative translate-y-0">
          <button onClick={dismiss} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div className="flex items-center gap-4 mb-5 mt-2">
            <img src="/logo.webp" alt="UCIM" className="w-16 h-16 object-contain bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm" />
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">Instalar UCIM App</h3>
              <p className="text-sm text-slate-500">Acceso rápido y sin navegador</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mb-6 px-1">
            Agregá la credencial digital a la pantalla de inicio de tu celular para no tener que buscar la página web cada vez que vayas a un comercio.
          </p>
          
          <div className="flex gap-3">
            <button onClick={dismiss} className="flex-1 py-3.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Más tarde
            </button>
            <button onClick={handleInstallClick} className="flex-1 py-3.5 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg shadow-blue-700/30 transition-colors">
              Instalar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MODAL INSTRUCCIONES iOS (SAFARI)
  if (showIOSModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 pb-8 animate-fade-in">
        <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative translate-y-0">
          <button onClick={dismiss} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div className="text-center mb-6 mt-4">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
              <img src="/logo.webp" alt="UCIM" className="w-12 h-12 object-contain" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Instalar en iPhone</h3>
            <p className="text-sm text-slate-500 mt-1 px-4">Instalá la credencial como una app nativa en tu teléfono.</p>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
              <p className="text-sm text-slate-700 flex-1">Tocá el botón <strong>Compartir</strong> en la barra inferior de Safari.</p>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <div className="h-px bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
              <p className="text-sm text-slate-700 flex-1">Buscá y seleccioná <strong>"Agregar a Inicio"</strong> en la lista.</p>
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
          
          <button onClick={dismiss} className="w-full py-3.5 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return null;
}
