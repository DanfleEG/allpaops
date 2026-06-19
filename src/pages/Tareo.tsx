import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const TRABAJADORES = [
  'Ana Lucía — DNI 45218976',
  'Luis Alberto — DNI 41873209',
  'Carlos E. — DNI 47625183',
  'María Elena — DNI 44910267',
  'Jorge Antonio — DNI 46327510'
];
const LOTES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'C4'];
const ACTIVIDADES = ['Cosecha', 'Poda', 'Fumigación', 'Riego', 'Deshierbe'];
const MODALIDADES = ['Destajo', 'Jornal'];

const CARENCIA_POR_LOTE: Record<string, number | null> = {
  'A1': 11,
  'A2': 9,
  'A3': null,
  'B1': 16,
  'B2': null,
  'B3': null,
  'C1': 5,
  'C2': null,
  'C3': 10,
  'C4': null,
};

export const INITIAL_REGISTERS = [
  { id: 1, hora: '07:15', trabajador: 'Ana Lucía', lote: 'A3', actividad: 'Cosecha', cantidad: 187, modalidad: 'Destajo' },
  { id: 2, hora: '07:22', trabajador: 'Luis Alberto', lote: 'B2', actividad: 'Cosecha', cantidad: 162, modalidad: 'Destajo' },
  { id: 3, hora: '07:30', trabajador: 'Carlos E.', lote: 'A3', actividad: 'Cosecha', cantidad: 199, modalidad: 'Jornal' },
  { id: 4, hora: '08:05', trabajador: 'María Elena', lote: 'B3', actividad: 'Cosecha', cantidad: 128, modalidad: 'Destajo' },
  { id: 5, hora: '08:12', trabajador: 'Jorge Antonio', lote: 'C2', actividad: 'Poda', cantidad: '-', modalidad: 'Jornal' },
];

export function Tareo({ setTotalJabasHoy }: any) {
  const [dni, setDni] = useState('');
  const [trabajadorId, setTrabajadorId] = useState<string | null>(null);
  const [trabajadorNombre, setTrabajadorNombre] = useState<string | null>(null);
  const [dniStatus, setDniStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [lote, setLote] = useState(LOTES[0]);
  const [actividad, setActividad] = useState(ACTIVIDADES[0]);
  const [cantidad, setCantidad] = useState('');
  const [modalidad, setModalidad] = useState(MODALIDADES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [registrosTareo, setRegistrosTareo] = useState<any[]>([]);
  const [loadingRegistros, setLoadingRegistros] = useState(true);
  const [errorRegistros, setErrorRegistros] = useState('');

  const carenciaDias = CARENCIA_POR_LOTE[lote];
  const isBlocked = carenciaDias !== null && actividad === 'Cosecha';

  const fetchRegistros = async () => {
    setLoadingRegistros(true);
    setErrorRegistros('');
    try {
      const { data, error } = await supabase
        .from('tareo_registros')
        .select('*, trabajadores(nombre), lotes(codigo)')
        .order('hora_registro', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }
      setRegistrosTareo(data || []);
    } catch (err: any) {
      setErrorRegistros(err.message || 'Error al cargar los registros');
    } finally {
      setLoadingRegistros(false);
    }
  };

  React.useEffect(() => {
    fetchRegistros();
  }, []);

  // Buscar DNI Effect
  React.useEffect(() => {
    const searchDNI = async () => {
      if (!dni) {
        setDniStatus('idle');
        setTrabajadorId(null);
        setTrabajadorNombre(null);
        return;
      }
      if (dni.length < 8) return; // Optional logic, or just let it search if it's less
      
      setDniStatus('loading');
      const { data, error } = await supabase
        .from('trabajadores')
        .select('id, nombre')
        .eq('dni', dni)
        .limit(1)
        .single();
        
      if (!error && data) {
        setTrabajadorId(data.id);
        setTrabajadorNombre(data.nombre);
        setDniStatus('success');
      } else {
        setTrabajadorId(null);
        setTrabajadorNombre(null);
        setDniStatus('error');
      }
    };
    
    // Debounce
    const timerId = setTimeout(() => {
      searchDNI();
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [dni]);

  const handleRegistrar = async () => {
    if (isBlocked || !trabajadorId) return;
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const numCantidad = actividad === 'Cosecha' ? (parseInt(cantidad) || 0) : 0;

      // 1. Fetch lote_id
      const { data: loteData, error: loteError } = await supabase
        .from('lotes')
        .select('id')
        .eq('codigo', lote)
        .limit(1)
        .single();

      if (loteError || !loteData) {
        throw new Error('No se encontró el lote en Supabase');
      }

      // 2. Insert into tareo_registros
      const { error: insertError } = await supabase
        .from('tareo_registros')
        .insert({
          trabajador_id: trabajadorId,
          lote_id: loteData.id,
          actividad: actividad,
          cantidad_jabas: actividad === 'Cosecha' ? numCantidad : null,
          modalidad_pago: modalidad
        });

      if (insertError) {
        throw new Error(`Error al insertar: ${insertError.message}`);
      }
      
      await fetchRegistros();

      if (actividad === 'Cosecha' && numCantidad > 0) {
        setTotalJabasHoy?.((prev: number) => prev + numCantidad);
      }

      // Reset form
      setDni('');
      setLote(LOTES[0]);
      setActividad(ACTIVIDADES[0]);
      setCantidad('');
      setModalidad(MODALIDADES[0]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Hubo un error inesperado al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-6">Registrar Tareo</h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">DNI del Trabajador</label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-sm"
                placeholder="Ej: 45218976"
                maxLength={8}
              />
              {dniStatus === 'loading' && <p className="mt-1 text-[11px] text-gray-500">Buscando...</p>}
              {dniStatus === 'success' && <p className="mt-1 text-[11px] text-green-600 font-medium">✓ {trabajadorNombre}</p>}
              {dniStatus === 'error' && dni.length > 0 && <p className="mt-1 text-[11px] text-red-600 font-medium">✗ DNI no encontrado en el sistema</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hora de Registro</label>
              <div className="relative">
                <input
                  type="text"
                  value={new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-3 pr-10 py-2 text-gray-500 focus:outline-none focus:ring-0 font-mono text-sm cursor-not-allowed"
                />
                <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Generado automáticamente — no editable</p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lote</label>
              <select
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-sm"
              >
                {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Actividad</label>
              <select
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-sm"
              >
                {ACTIVIDADES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {actividad === 'Cosecha' ? (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CANT. COSECHADA (Jabas)</label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] font-mono text-sm"
                  placeholder="Ej: 45"
                />
              </div>
            ) : (
              <div className="hidden lg:block"></div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Modalidad de pago</label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-sm"
              >
                {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          
          {(isBlocked || (modalidad === 'Destajo' && actividad === 'Cosecha' && cantidad && !isNaN(Number(cantidad)))) && (
            <div className="w-full">
              {isBlocked && (
                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                  <span>⚠️ Bloqueado: Lote en periodo de carencia activa ({carenciaDias} días restantes). Registrar esta cosecha expondría el lote a rechazo en exportación.</span>
                </div>
              )}
              {!isBlocked && modalidad === 'Destajo' && actividad === 'Cosecha' && cantidad && !isNaN(Number(cantidad)) && (
                <div className="bg-green-50 text-green-800 text-sm font-medium p-3 rounded-lg border border-green-200 shadow-sm">
                  Pago estimado: S/ {(Number(cantidad) * 0.8).toFixed(2)}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col items-end pt-2 gap-2">
            <button
              type="button"
              onClick={handleRegistrar}
              disabled={isBlocked || isSubmitting || !trabajadorId}
              className={`font-medium py-2 px-6 rounded-lg transition-colors text-sm ${
                isBlocked || isSubmitting || !trabajadorId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70' 
                  : 'bg-[#10B981] hover:bg-[#059669] text-white'
              }`}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Tareo'}
            </button>
            {errorMsg && (
              <div className="text-red-500 text-xs font-medium bg-red-50 px-3 py-1.5 rounded-md border border-red-100">
                {errorMsg}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-700">Registros de Hoy</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100 text-xs">
              <tr>
                <th className="px-5 py-3 font-bold uppercase tracking-wider">Hora</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider">Trabajador</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider">Lote</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider">Actividad</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider">Cantidad</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider">Modalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loadingRegistros && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500 font-medium tracking-wide">
                    Cargando registros...
                  </td>
                </tr>
              )}
              {errorRegistros && !loadingRegistros && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-red-500 font-medium">
                    {errorRegistros}
                  </td>
                </tr>
              )}
              {!loadingRegistros && !errorRegistros && registrosTareo.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500 font-medium">
                    No hay registros de hoy
                  </td>
                </tr>
              )}
              {!loadingRegistros && !errorRegistros && registrosTareo.map((r: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">
                    {r.hora_registro ? new Date(r.hora_registro.replace(' ', 'T') + 'Z').toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }) : ''}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">{r.trabajadores?.nombre}</td>
                  <td className="px-5 py-3">
                    <span className="font-medium text-gray-700 bg-gray-100/80 border border-gray-200/60 px-2.5 py-1 rounded-md text-xs">
                      {r.lotes?.codigo}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      r.actividad === 'Cosecha' ? 'bg-green-50 text-green-700 border border-green-100/50' : 'bg-orange-50 text-orange-700 border border-orange-100/50'
                    }`}>
                      {r.actividad}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-800">{r.cantidad_jabas || '-'}</td>
                  <td className="px-5 py-3 text-gray-600 text-sm">{r.modalidad_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
