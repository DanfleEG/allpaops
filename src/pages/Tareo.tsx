import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { TRABAJADORES, LOTES, Lote, RegistroCosecha } from '../data';

export function Tareo() {
  const [registros, setRegistros] = useState<RegistroCosecha[]>([]);
  const [trabajador, setTrabajador] = useState(TRABAJADORES[0]);
  const [lote, setLote] = useState(LOTES[0].nombre);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [jabas, setJabas] = useState<number | ''>('');

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jabas) return;
    
    const loteData = LOTES.find(l => l.nombre === lote);
    
    const nuevoRegistro: RegistroCosecha = {
      id: Math.random().toString(36).substring(2, 9),
      fecha,
      trabajador,
      lote,
      cultivo: loteData?.cultivo || 'Desconocido',
      jabas: Number(jabas)
    };

    setRegistros([nuevoRegistro, ...registros]);
    setJabas('');
  };

  const handleExportCSV = () => {
    if (registros.length === 0) return;

    const headers = ['ID', 'Fecha', 'Trabajador', 'Lote', 'Cultivo', 'Jabas'];
    const csvContent = [
      headers.join(','),
      ...registros.map(r => 
        [r.id, r.fecha, `"${r.trabajador}"`, r.lote, r.cultivo, r.jabas].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tareo_cosecha_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Tareo de Campo</h2>
          <p className="text-gray-500 text-sm">Registro diario de cosecha directamente en campo.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={registros.length === 0}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Download size={16} />
          Exportar a CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-6">Nuevo Registro</h3>
            <form onSubmit={handleRegistrar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] font-mono text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trabajador</label>
                <select
                  value={trabajador}
                  onChange={(e) => setTrabajador(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
                  required
                >
                  {TRABAJADORES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lote (Cultivo)</label>
                <select
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
                  required
                >
                  {LOTES.map(l => (
                    <option key={l.nombre} value={l.nombre}>{l.nombre} ({l.cultivo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Jabas Cosechadas</label>
                <input
                  type="number"
                  min="1"
                  value={jabas}
                  onChange={(e) => setJabas(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] font-mono text-sm"
                  placeholder="Ej: 45"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#556b2f] hover:bg-[#556b2f]/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Registrar Cosecha
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabla */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-700">Registros de Sesión ({registros.length})</h3>
            </div>
            
            <div className="flex-1 overflow-x-auto min-h-[300px]">
              {registros.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                  <ClipboardList size={48} className="mb-4 opacity-20" />
                  <p>No hay registros en esta sesión.</p>
                  <p className="text-sm">Agrega uno desde el formulario.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100 text-xs">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Trabajador</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Lote</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Jabas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {registros.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.fecha}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{r.trabajador}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-700">{r.lote}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">
                              {r.cultivo}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-right text-gray-800">{r.jabas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
