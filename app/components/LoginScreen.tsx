"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ucim.test/api";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Credenciales incorrectas");

      // Pasamos el token y el user (que ahora devuelve role) al context
      await login(data.token, data.user);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-sm relative z-10">
        <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 border border-white/50">
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase px-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
                className="w-full bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase px-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu clave de acceso"
                required
                className="w-full bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all duration-300 hover:shadow-blue-900/40 active:scale-[0.98] mt-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? "Verificando..." : "Ingresar a mi cuenta"}
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          © {new Date().getFullYear()} UCIM — Monteros, Tucumán
        </p>
      </div>
    </main>
  );
}
