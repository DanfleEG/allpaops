import React, { useState } from 'react';

const TRABAJADORES = ['Ana Lucía', 'Luis Alberto', 'Carlos E.', 'María Elena', 'Jorge Antonio'];
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

const INITIAL_REGISTERS = [
  { id: 1, hora: '07:15', trabajador: 'Ana Lucía', lote: 'A3', actividad: 'Cosecha', cantidad: 187, modalidad: 'Destajo' },
  { id: 2, hora: '07:22', trabajador: 'Luis Alberto', lote: 'B2', actividad: 'Cosecha', cantidad: 162, modalidad: 'Destajo' },
  { id: 3, hora: '07:30', trabajador: 'Carlos E.', lote: 'C4', actividad: 'Cosecha', cantidad: 145, modalidad: 'Jornal' },
  { id: 4, hora: '08:05', trabajador: 'María Elena', lote: 'B3', actividad: 'Cosecha', cantidad: 128, modalidad: 'Destajo' },
  { id: 5, hora: '08:12', trabajador: 'Jorge Antonio', lote: 'C2', actividad: 'Poda', cantidad: '-', modalidad: 'Jornal' },
];

export function Tareo() {
  const [trabajador, setTrabajador] = useState(TRABAJADORES[0]);
  const [lote, setLote] = useState(LOTES[0]);
  const [actividad, setActividad] = useState(ACTIVIDADES[0]);
  const [cantidad, setCantidad] = useState('');
  const [modalidad, setModalidad] = useState(MODALIDADES[0]);

  const carenciaDias = CARENCIA_POR_LOTE[lote];
  const isBlocked = carenciaDias !== null && actividad === 'Cosecha';

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-6">Registrar Tareo</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trabajador</label>
              <select
                value={trabajador}
                onChange={(e) => setTrabajador(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
              >
                {TRABAJADORES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lote</label>
              <select
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
              >
                {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Actividad</label>
              <select
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
              >
                {ACTIVIDADES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CANT. COSECHADA (Jabas)</label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] font-mono text-sm"
                placeholder="Ej: 45"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Modalidad de pago</label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
              >
                {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          
          {isBlocked && (
            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
              <span>⚠️ Bloqueado: Lote en periodo de carencia activa ({carenciaDias} días restantes). Registrar esta cosecha expondría el lote a rechazo en exportación.</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={isBlocked}
              className={`font-medium py-2 px-6 rounded-lg transition-colors text-sm ${
                isBlocked 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70' 
                  : 'bg-[#556b2f] hover:bg-[#556b2f]/90 text-white'
              }`}
            >
              Registrar Tareo
            </button>
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
              {INITIAL_REGISTERS.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{r.hora}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{r.trabajador}</td>
                  <td className="px-5 py-3">
                    <span className="font-medium text-gray-700 bg-gray-100/80 border border-gray-200/60 px-2.5 py-1 rounded-md text-xs">
                      {r.lote}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      r.actividad === 'Cosecha' ? 'bg-green-50 text-green-700 border border-green-100/50' : 'bg-orange-50 text-orange-700 border border-orange-100/50'
                    }`}>
                      {r.actividad}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-gray-800">{r.cantidad}</td>
                  <td className="px-5 py-3 text-gray-600 text-sm">{r.modalidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
