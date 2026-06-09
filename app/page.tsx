"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./components/LoginScreen";
import AdminRedirectView from "./components/AdminRedirectView";
import BottomNav from "./components/BottomNav";
import InicioView from "./views/InicioView";
import CarnetView from "./views/CarnetView";
import BeneficiosView from "./views/BeneficiosView";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

type Tab = "inicio" | "carnet" | "beneficios" | "cuenta";

function AppContent() {
  const { isLoggedIn, loading, user, socio } = useAuth();
  const [tab, setTab] = useState<Tab>("inicio");

  // Pantalla de carga inicial (verificando sesión)
  if (loading && !isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <img src="/logo.webp" alt="UCIM" className="h-16 w-auto opacity-50 mb-4" />
          <p className="text-slate-400 font-medium">Cargando...</p>
        </div>
      </main>
    );
  }

  // Si no hay sesión, mostramos Login
  if (!isLoggedIn || !user) {
    return <LoginScreen />;
  }

  // Si es admin o secretaria, los bloqueamos y mandamos a Filament
  if (user.role === "admin" || user.role === "secretary") {
    return <AdminRedirectView />;
  }

  // Si es socio, pero los datos del perfil aún no cargaron (transición rápida)
  if (!socio && user.role === "member") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <p className="text-slate-400 font-medium">Cargando tu credencial...</p>
        </div>
      </main>
    );
  }

  // Interfaz Principal del Socio
  return (
    <main className="min-h-screen bg-slate-50 pb-28 font-sans">
      <div className="p-5 max-w-md mx-auto">
        {tab === "inicio" && <InicioView setTab={setTab} />}
        {tab === "carnet" && <CarnetView />}
        {tab === "beneficios" && <BeneficiosView />}
        
        {tab === "cuenta" && (
          <div className="space-y-6 animate-fade-in text-center py-10">
            <h2 className="text-2xl font-bold text-slate-800">Próximamente</h2>
            <p className="text-slate-500">Aquí podrás ver tu historial de pagos en el futuro.</p>
          </div>
        )}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
      <PWAInstallPrompt />

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

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
