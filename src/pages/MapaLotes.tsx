import React from 'react';
import { LOTES } from '../data';

export function MapaLotes() {
  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Mapa de Lotes</h2>
        <p className="text-gray-500 text-sm">Vista espacial simplificada del estado operativo de los campos.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <div className="flex gap-6 mb-8 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
            <span className="text-gray-600 font-medium">En Carencia Activa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
            <span className="text-gray-600 font-medium">Listo para Cosecha</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
            <span className="text-gray-600 font-medium">Cosechado Seguro</span>
          </div>
        </div>

        {/* Estructura de mapa estilizado. Se agrupan para dar una forma de terreno */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {LOTES.map((lote) => {
            const isEnCarencia = lote.carencia > 0;
            return (
              <div 
                key={lote.nombre}
                className={`
                  aspect-square rounded-xl border relative p-4 flex flex-col justify-end transition-transform hover:scale-[1.02] cursor-default shadow-sm
                  ${lote.estado === 'En Carencia Activa' 
                    ? 'bg-red-50/30 border-red-200 hover:border-red-300' 
                    : lote.estado === 'Cosechado Seguro'
                    ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                    : 'bg-green-50/50 border-green-200 hover:border-green-300'}
                `}
              >
                {/* Patrón de líneas sutil imitando surcos de campo */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)' }}
                ></div>

                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 tracking-tight leading-none mb-1">
                    {lote.nombre}
                  </h3>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {lote.cultivo}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {lote.hectareas}ha
                    </p>
                  </div>
                  
                  {isEnCarencia && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold font-mono text-xs shadow-lg ring-4 ring-white">
                      {lote.carencia}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
