"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ucim.test/api";

export default function PerfilView() {
  const { socio, token, fetchSocioData } = useAuth();
  
  // Tabs: 'personal' o 'empresa'
  const [activeTab, setActiveTab] = useState<"personal" | "empresa">("personal");
  
  // Estado local para los datos personales
  const [personalData, setPersonalData] = useState({
    first_name: socio?.first_name || "",
    last_name: socio?.last_name || "",
    dni: socio?.dni || "",
    email: socio?.email || "",
    phone: socio?.phone || "",
    address: socio?.address || "",
    locality: socio?.locality || "",
    birth_date: socio?.birth_date || "",
    admission_date: socio?.admission_date || "",
    position_in_company: socio?.position_in_company || "",
    password: "", // Contraseña opcional
  });

  // Estado local para la empresa (tomamos la primera si tiene)
  const empresa = socio?.companies && socio.companies.length > 0 ? socio.companies[0] : null;
  const [companyData, setCompanyData] = useState({
    business_name: empresa?.business_name || "",
    fantasy_name: empresa?.fantasy_name || "",
    cuit: empresa?.cuit || "",
    address: empresa?.address || "",
    locality: empresa?.locality || "",
    phone: empresa?.phone || "",
    email: empresa?.email || "",
    contact_name: empresa?.contact_name || "",
    employees: empresa?.employees || "",
    activities: empresa?.activities || "",
    preferred_payment_method: empresa?.preferred_payment_method || "",
    publish_logo: empresa?.publish_logo ?? true,
    admission_date: empresa?.admission_date || "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const savePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(personalData)
      });

      if (res.ok) {
        await fetchSocioData(token!);
        setMessage({ type: "success", text: "Datos personales guardados con éxito." });
      } else {
        setMessage({ type: "error", text: "Hubo un error al guardar." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de red." });
    }
    setSaving(false);
    
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const saveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/company/${empresa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(companyData)
      });

      if (res.ok) {
        await fetchSocioData(token!);
        setMessage({ type: "success", text: "Datos de la empresa guardados con éxito." });
      } else {
        setMessage({ type: "error", text: "Hubo un error al guardar." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de red." });
    }
    setSaving(false);

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header className="px-1 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Mantené tus datos actualizados</p>
      </header>

      {/* TABS */}
      <div className="flex bg-slate-200/60 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
            activeTab === "personal" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500"
          }`}
        >
          Mis Datos
        </button>
        {empresa && (
          <button
            onClick={() => setActiveTab("empresa")}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
              activeTab === "empresa" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Mi Empresa
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* FORM DATOS PERSONALES */}
      {activeTab === "personal" && (
        <form onSubmit={savePersonal} className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">DNI</label>
            <input type="text" name="dni" value={personalData.dni} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email de Acceso y Contacto</label>
            <input type="email" name="email" value={personalData.email} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nueva Contraseña (Opcional)</label>
            <input type="password" name="password" value={personalData.password} onChange={handlePersonalChange} placeholder="Dejar en blanco para no cambiar" className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" name="first_name" value={personalData.first_name} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Apellido</label>
              <input type="text" name="last_name" value={personalData.last_name} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
            <input type="text" name="phone" value={personalData.phone} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
              <input type="text" name="address" value={personalData.address} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Localidad</label>
              <input type="text" name="locality" value={personalData.locality} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">F. Nacimiento</label>
              <input type="date" name="birth_date" value={personalData.birth_date} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">F. Ingreso</label>
              <input type="date" name="admission_date" value={personalData.admission_date} onChange={handlePersonalChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Cargo principal</label>
              <select name="position_in_company" value={personalData.position_in_company} onChange={handlePersonalChange as any} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all">
                <option value="">Seleccionar...</option>
                <option value="owner">Propietario / Dueño</option>
                <option value="partner">Socio / Co-Fundador</option>
                <option value="director">Director / Gerente General</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all mt-4 disabled:opacity-70">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      )}

      {/* FORM DATOS EMPRESA */}
      {activeTab === "empresa" && empresa && (
        <form onSubmit={saveCompany} className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">CUIT</label>
            <input type="text" name="cuit" value={companyData.cuit} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Razón Social</label>
            <input type="text" name="business_name" value={companyData.business_name} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre de Fantasía</label>
            <input type="text" name="fantasy_name" value={companyData.fantasy_name} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Comercial</label>
            <input type="email" name="email" value={companyData.email} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
              <input type="text" name="phone" value={companyData.phone} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contacto</label>
              <input type="text" name="contact_name" value={companyData.contact_name} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
              <input type="text" name="address" value={companyData.address} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Localidad</label>
              <input type="text" name="locality" value={companyData.locality} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Cantidad de Empleados</label>
              <select name="employees" value={companyData.employees} onChange={handleCompanyChange as any} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all">
                <option value="">Seleccionar...</option>
                <option value="none">No tengo</option>
                <option value="0-5">Entre 0 a 5</option>
                <option value="5-10">Entre 5 a 10</option>
                <option value="10-15">Entre 10 a 15</option>
                <option value="15-20">Entre 15 a 20</option>
                <option value="20+">Más de 20</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Actividades de la Empresa</label>
              <textarea name="activities" value={companyData.activities} onChange={handleCompanyChange as any} rows={3} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all"></textarea>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Método de pago preferido</label>
              <select name="preferred_payment_method" value={companyData.preferred_payment_method} onChange={handleCompanyChange as any} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all">
                <option value="">Seleccionar...</option>
                <option value="transfer">Transferencia</option>
                <option value="collector">Cobrador</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">F. Ingreso Empresa</label>
              <input type="date" name="admission_date" value={companyData.admission_date} onChange={handleCompanyChange} className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all" />
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="publish_logo" checked={companyData.publish_logo} onChange={(e) => setCompanyData({...companyData, publish_logo: e.target.checked})} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" />
              <label htmlFor="publish_logo" className="text-sm font-medium text-slate-700">Autoriza publicar logo en el sitio</label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all mt-4 disabled:opacity-70">
            {saving ? "Guardando..." : "Guardar Empresa"}
          </button>
        </form>
      )}

    </div>
  );
}
