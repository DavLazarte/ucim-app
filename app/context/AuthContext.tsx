"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "admin" | "secretary" | "member";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  phone?: string;
  address?: string;
  locality?: string;
  birth_date?: string;
  admission_date?: string;
  position_in_company?: string;
  account_status: string;
  is_al_dia: boolean;
  companies?: {
    id: number;
    business_name: string;
    monthly_price?: number;
    [key: string]: any;
  }[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  socio: Socio | null;
  categoriasBeneficios: any[];
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  fetchSocioData: (token: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ucim.test/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [socio, setSocio] = useState<Socio | null>(null);
  const [categoriasBeneficios, setCategoriasBeneficios] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBeneficiosGlobal = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/benefits`, {
        headers: { "Authorization": `Bearer ${authToken}`, "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setCategoriasBeneficios(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("ucim_token");
      const savedUserStr = localStorage.getItem("ucim_user");
      
      if (savedToken && savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          setToken(savedToken);
          setUser(parsedUser);
          setIsLoggedIn(true);

          if (parsedUser.role === "member") {
            // Fetch concurrentemente para ganar velocidad
            await Promise.all([
              fetchSocioData(savedToken),
              fetchBeneficiosGlobal(savedToken)
            ]);
          }
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchSocioData = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json"
        }
      });
      if (!res.ok) throw new Error("Sesión expirada");
      
      const data = await res.json();
      setSocio(data);
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  const login = async (newToken: string, newUser: User) => {
    localStorage.setItem("ucim_token", newToken);
    localStorage.setItem("ucim_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
    
    if (newUser.role === "member") {
      await Promise.all([
        fetchSocioData(newToken),
        fetchBeneficiosGlobal(newToken)
      ]);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        });
      } catch (e) { }
    }
    localStorage.removeItem("ucim_token");
    localStorage.removeItem("ucim_user");
    setToken(null);
    setUser(null);
    setSocio(null);
    setCategoriasBeneficios([]);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, socio, categoriasBeneficios, isLoggedIn, loading, login, logout, fetchSocioData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
