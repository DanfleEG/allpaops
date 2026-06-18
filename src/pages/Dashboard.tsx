import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const kpis = [
  { label: 'Total Jabas Hoy', value: '1,942' },
  { label: 'Total Jabas Período Completo', value: '31,652' },
  { label: 'Trabajadores Activos Hoy', value: '24 de 30' },
  { label: 'Lotes en Carencia Activa', value: '5 de 10' }
];

const dataTrabajadores = [
  { name: 'Ana Lucía', jabas: 185 },
  { name: 'Luis Alberto', jabas: 162 },
  { name: 'Carlos E.', jabas: 145 },
  { name: 'María Elena', jabas: 130 },
  { name: 'Jorge Antonio', jabas: 121 },
];

const dataCultivos = [
  { name: 'Palta', value: 41 },
  { name: 'Arándano', value: 30 },
  { name: 'Uva', value: 29 },
];

const COLORS = ['#556b2f', '#819835', '#b5c873'];

const dataEvolucion = [
  { dia: 'Lun', jabas: 1200 },
  { dia: 'Mar', jabas: 1450 },
  { dia: 'Mié', jabas: 1600 },
  { dia: 'Jue', jabas: 1850 },
  { dia: 'Vie', jabas: 1700 },
  { dia: 'Sáb', jabas: 1942 },
];

const dataRendimiento = [
  { lote: 'B1', rto: 145 },
  { lote: 'B2', rto: 130 },
  { lote: 'A1', rto: 120 },
  { lote: 'C2', rto: 110 },
  { lote: 'A3', rto: 95 },
];

export function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Operativo</h2>
        <p className="text-gray-500 text-sm">Resumen en tiempo real de la cosecha y campo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-3xl font-light tabular-nums text-[#1a1c18]">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-transparent">
        {/* Top Trabajadores */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-bold text-gray-700 mb-4">Ranking de Jabas por Trabajador</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTrabajadores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="jabas" fill="#556b2f" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jabas por Cultivo */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-bold text-gray-700 mb-4">Distribución por Cultivo</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCultivos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dataCultivos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center gap-3 min-w-[120px]">
              {dataCultivos.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 leading-tight">{entry.name}</p>
                    <p className="text-xs text-gray-400 font-mono font-bold">{entry.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evolución Semanal */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-bold text-gray-700 mb-4">Evolución Semanal de Cosecha</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataEvolucion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <Tooltip cursor={{ stroke: '#d6d3d1' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="jabas" stroke="#556b2f" strokeWidth={3} dot={{ r: 4, fill: '#556b2f', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rendimiento por Hectárea */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1">
          <h3 className="font-bold text-gray-700 mb-4">Rendimiento (Jabas/Ha) por Lote</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataRendimiento} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="lote" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="rto" fill="#819835" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
