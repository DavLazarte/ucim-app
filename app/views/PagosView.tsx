"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://ucim.test/api";
const WHATSAPP_NUMBER = "543863515328"; // TODO: Cambiar por el real de UCIM

interface PaymentRecord {
  id: number;
  type: string;
  amount: string;
  method: string;
  status: string;
  period_from: string;
  period_to: string;
  created_at: string;
}

export default function PagosView() {
  const { token, socio } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const empresa = socio?.companies && socio.companies.length > 0 ? socio.companies[0] : null;
  const monthlyPrice = empresa?.monthly_price || 0;
  
  // Calculamos el monto total en base a los meses seleccionados
  const amountToPay = selectedMonths.length * monthlyPrice;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/payments`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const toggleMonth = (m: string) => {
    if (selectedMonths.includes(m)) {
      setSelectedMonths(selectedMonths.filter(month => month !== m));
    } else {
      setSelectedMonths([...selectedMonths, m]);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Pagado</span>;
    if (status === 'pending') return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">Pendiente / En revisión</span>;
    if (status === 'overdue') return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">Vencido</span>;
    return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{status}</span>;
  };

  const getTypeLabel = (type: string) => {
    if (type === 'quota') return 'Cuota Social';
    if (type === 'event') return 'Evento';
    if (type === 'rental') return 'Alquiler';
    if (type === 'other') return 'Extra';
    return type;
  };

  const handleInformarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMonths.length === 0) {
      alert("Por favor seleccione al menos un mes.");
      return;
    }
    
    setIsSubmitting(true);

    const sortedMonths = [...selectedMonths].sort((a, b) => parseInt(a) - parseInt(b));
    const firstMonth = sortedMonths[0];
    const lastMonth = sortedMonths[sortedMonths.length - 1];

    const periodFrom = `${year}-${firstMonth}-01`;
    const lastDay = new Date(parseInt(year), parseInt(lastMonth), 0).getDate();
    const periodTo = `${year}-${lastMonth}-${lastDay}`;

    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amountToPay,
          period_from: periodFrom,
          period_to: periodTo
        })
      });

      if (res.ok) {
        const data = await res.json();
        const paymentId = data.payment_id;
        
        // Formar el mensaje de WhatsApp
        const mesesTexto = sortedMonths.join(', ');
        const mensaje = `Hola UCIM! Acabo de informar un pago desde la App.%0A%0A*Trámite N°:* ${paymentId}%0A*Socio:* ${socio?.first_name} ${socio?.last_name}%0A*Periodo:* Mes(es) ${mesesTexto} de ${year}%0A*Monto:* $${amountToPay}%0A%0AAdjunto el comprobante de transferencia:`;
        
        // Cerrar modal y refrescar
        setShowModal(false);
        fetchPayments();
        setSelectedMonths([]);
        
        // Redirigir a WhatsApp
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
      }
    } catch (e) {
      alert("Error de conexión. Intente nuevamente.");
    }
    setIsSubmitting(false);
  };

  const monthNames = [
    { value: "01", label: "Ene" }, { value: "02", label: "Feb" }, { value: "03", label: "Mar" },
    { value: "04", label: "Abr" }, { value: "05", label: "May" }, { value: "06", label: "Jun" },
    { value: "07", label: "Jul" }, { value: "08", label: "Ago" }, { value: "09", label: "Sep" },
    { value: "10", label: "Oct" }, { value: "11", label: "Nov" }, { value: "12", label: "Dic" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      <header className="px-1 pt-2 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Pagos</h1>
          <p className="text-slate-500 text-sm mt-1">Historial y trámites</p>
        </div>
      </header>

      {/* Botón Principal (Llamado a la acción) */}
      <button 
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Informar un Pago</h3>
            <p className="text-white/80 text-xs">Avisar de una transferencia</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      {/* Historial */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Historial de Pagos</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl shadow-sm border border-slate-100"></div>)}
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm">No se encontraron pagos registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm">{getTypeLabel(p.type)}</span>
                    <span className="text-slate-400 text-xs text-uppercase">• {p.method === 'transfer' ? 'Transf.' : 'Cobrador'}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Periodo: {p.period_from ? p.period_from.substring(0,7) : 'N/A'} 
                    <span className="mx-2">|</span> 
                    Trámite #{p.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 mb-1">${p.amount}</p>
                  {getStatusBadge(p.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para informar pago */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h2 className="text-xl font-bold text-slate-800 mb-1">Informar Transferencia</h2>
            <p className="text-sm text-slate-500 mb-6">Seleccioná los meses a abonar (Valor: ${monthlyPrice}/mes).</p>
            
            <form onSubmit={handleInformarPago} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Meses a abonar</label>
                <div className="grid grid-cols-4 gap-2">
                  {monthNames.map(m => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => toggleMonth(m.value)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        selectedMonths.includes(m.value)
                          ? "bg-blue-100 border-blue-500 text-blue-800"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Año</label>
                <select 
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 p-3 rounded-xl text-sm transition-all"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Total a transferir:</span>
                  <span className="text-2xl font-black text-blue-900">${amountToPay}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex gap-3 items-start mt-2 border border-blue-100">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-xs font-medium">Al tocar el botón, se generará el trámite y serás redirigido a WhatsApp para enviar la foto del comprobante.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
              >
                {isSubmitting ? "Procesando..." : (
                  <>
                    <span>Enviar Comprobante</span>
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
