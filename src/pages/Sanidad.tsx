import React from 'react';
import { LOTES } from '../data';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export function Sanidad() {
  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Sanidad y Carencia</h2>
        <p className="text-gray-500 text-sm">Monitoreo de periodos de carencia por aplicación de pesticidas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {LOTES.map((lote) => {
          const isEnCarencia = lote.carencia > 0;

          return (
            <div 
              key={lote.nombre}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-all relative overflow-hidden ${
                isEnCarencia ? 'border-red-100 bg-red-50/30' : 'border-gray-100'
              }`}
            >
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-bold tracking-tight ${isEnCarencia ? 'text-red-800' : 'text-gray-800'}`}>
                    {lote.nombre}
                  </h3>
                  <p className={`text-[10px] font-bold uppercase mt-1 ${isEnCarencia ? 'text-red-600' : 'text-gray-400'}`}>
                    {lote.cultivo} • {lote.hectareas} HA
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  {lote.estado === 'En Carencia Activa' && (
                    <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold uppercase">En Carencia Activa</span>
                  )}
                  {lote.estado === 'Listo para Cosecha' && (
                    <span className="text-[10px] bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded font-bold uppercase">Listo para Cosecha</span>
                  )}
                  {lote.estado === 'Cosechado Seguro' && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">Cosechado Seguro</span>
                  )}
                </div>
                {isEnCarencia && (
                  <div className="text-right flex items-center gap-1">
                    <span className="text-2xl font-light tabular-nums text-red-600 leading-none">
                      -{lote.carencia}
                    </span>
                    <span className="text-[10px] text-red-500 block uppercase tracking-wider font-bold">
                      Días
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
