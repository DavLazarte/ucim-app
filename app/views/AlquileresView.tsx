"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ucim.test/api";
const WHATSAPP_NUMBER = "5493815344312"; // TODO: Cambiar por el real de UCIM

interface Space {
  id: number;
  name: string;
  description: string;
  default_price: string;
}

interface RentalRecord {
  id: number;
  space_name: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function AlquileresView() {
  const { token, socio } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [rentals, setRentals] = useState<RentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Hacemos las peticiones de forma secuencial en lugar de Promise.all
      // para evitar que el servidor de desarrollo de PHP (que es single-threaded) se sature
      const spacesRes = await fetch(`${API_URL}/spaces`, { headers: { "Authorization": `Bearer ${token}` } });
      if (spacesRes.ok) setSpaces(await spacesRes.json());
      
      const rentalsRes = await fetch(`${API_URL}/rentals`, { headers: { "Authorization": `Bearer ${token}` } });
      if (rentalsRes.ok) setRentals(await rentalsRes.json());
    } catch (e) {}
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Aprobado</span>;
    if (status === 'pending') return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">En Revisión</span>;
    if (status === 'rejected') return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">Rechazado</span>;
    return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{status}</span>;
  };

  const openRequestModal = (space: Space) => {
    setSelectedSpace(space);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/rentals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          space_id: selectedSpace.id,
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
          notes: notes
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // WhatsApp Message
        const mensaje = `Hola UCIM! Solicito reservar un espacio desde la App.%0A%0A*Trámite N°:* ${data.rental_id}%0A*Socio:* ${socio?.first_name} ${socio?.last_name}%0A*Espacio:* ${selectedSpace.name}%0A*Desde:* ${startDate} a las ${startTime}hs%0A*Hasta:* ${endDate} a las ${endTime}hs%0A*Notas:* ${notes || 'Ninguna'}%0A%0AQuedo atento a la confirmación, saludos!`;
        
        setShowModal(false);
        fetchData();
        
        // Reset form
        setStartDate(""); setStartTime(""); setEndDate(""); setEndTime(""); setNotes("");
        
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error al solicitar. Verifique las fechas.");
      }
    } catch (e) {
      alert("Error de conexión. Intente nuevamente.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      <header className="px-1 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-slate-900">Alquilar Espacios</h1>
        <p className="text-slate-500 text-sm mt-1">Salones y oficinas de UCIM</p>
      </header>

      {/* Catálogo de Espacios */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Espacios Disponibles</h3>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2].map(i => <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100"></div>)}
          </div>
        ) : spaces.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm">No hay espacios disponibles actualmente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {spaces.map(space => (
              <div key={space.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{space.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{space.description || "Espacio para reuniones y eventos."}</p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-50">
                  <span className="font-bold text-blue-900 text-sm">Tarifa base: ${space.default_price}</span>
                  <button 
                    onClick={() => openRequestModal(space)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all"
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Solicitudes */}
      <div className="pt-4">
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Mis Solicitudes</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-white rounded-2xl shadow-sm border border-slate-100"></div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm">No solicitaste ningún alquiler todavía.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rentals.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800 text-sm">{r.space_name}</span>
                  {getStatusBadge(r.status)}
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Desde: <span className="font-medium text-slate-700">{r.start_time}</span></p>
                  <p>Hasta: <span className="font-medium text-slate-700">{r.end_time}</span></p>
                </div>
                {r.status === 'pending' && (
                  <p className="text-[10px] text-amber-600 mt-3 bg-amber-50 p-2 rounded-lg inline-block border border-amber-100">
                    A la espera de confirmación de administración.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Solicitar Alquiler */}
      {showModal && selectedSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative my-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h2 className="text-xl font-bold text-slate-800 mb-1">Solicitar {selectedSpace.name}</h2>
            <p className="text-sm text-slate-500 mb-6">Completa las fechas y te contactaremos para confirmar.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de Inicio</label>
                  <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Hora Inicio</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de Fin</label>
                  <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Hora Fin</label>
                  <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notas (Opcional)</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl text-sm min-h-[80px]" 
                  placeholder="Ej: Necesitamos proyector, sillas extras..."
                />
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex gap-3 items-start mt-2 border border-blue-100">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-xs font-medium">Al tocar el botón, se enviará la petición a UCIM y se abrirá WhatsApp para dejar asentado el trámite.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
              >
                {isSubmitting ? "Procesando..." : (
                  <>
                    <span>Enviar Solicitud por WhatsApp</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
