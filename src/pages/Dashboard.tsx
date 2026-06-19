import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<'dia' | 'semana'>('semana');

  const [loadingTop, setLoadingTop] = useState(true);
  const [jabasFiltro, setJabasFiltro] = useState<number | null>(null);
  const [jabasPeriodo, setJabasPeriodo] = useState<number | null>(null);
  const [trabajadoresFiltro, setTrabajadoresFiltro] = useState<{ activos: number; total: number } | null>(null);
  const [carenciaActiva, setCarenciaActiva] = useState<{ activos: number; total: number } | null>(null);

  const [loadingCharts, setLoadingCharts] = useState(true);
  const [dataTrabajadores, setDataTrabajadores] = useState<any[]>([]);
  const [dataCultivos, setDataCultivos] = useState<any[]>([]);
  const [dataCultivosColors, setDataCultivosColors] = useState<string[]>([]);
  const [dataEvolucion, setDataEvolucion] = useState<any[]>([]);
  const [dataRendimiento, setDataRendimiento] = useState<any[]>([]);

  // We only fetch values that do not depend on the toggle ONCE.
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        // Total Jabas Período Completo (Todo el histórico)
        const { data: dataPeriodo } = await supabase
          .from('tareo_registros')
          .select('cantidad_jabas')
          .eq('actividad', 'Cosecha');
        const sumPeriodo = dataPeriodo?.reduce((acc, curr) => acc + (Number(curr.cantidad_jabas) || 0), 0) || 0;
        setJabasPeriodo(sumPeriodo);

        // Lotes en Carencia Activa
        const { count: countCarencia } = await supabase
          .from('lotes')
          .select('*', { count: 'exact', head: true })
          .gt('dias_carencia_restantes', 0);
        
        const { count: countLotes } = await supabase
          .from('lotes')
          .select('*', { count: 'exact', head: true });
        
        setCarenciaActiva({ activos: countCarencia || 0, total: countLotes || 0 });

      } catch (e) {
        console.error("Error fetching static KPIs", e);
      }
    };
    fetchStaticData();
  }, []);

  // Fetch toggle-dependent data
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoadingTop(true);
      setLoadingCharts(true);

      try {
        const limaDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' }); 
        const todayEnd = new Date(`${limaDateStr}T23:59:59.999-05:00`);
        let start = new Date(`${limaDateStr}T00:00:00.000-05:00`);
        
        if (periodoSeleccionado === 'semana') {
          start.setDate(start.getDate() - 6);
        }
        
        const toSupabaseUTC = (d: Date) => d.toISOString().replace('T', ' ').replace('Z', '');
        const startUTC = toSupabaseUTC(start);
        const endUTC = toSupabaseUTC(todayEnd);

        // Fetch ALL tareo_registros in date range involving Cosecha
        const { data: recordsCosecha } = await supabase
          .from('tareo_registros')
          .select('id, cantidad_jabas, trabajador_id, lote_id, hora_registro, trabajadores(nombre)')
          .eq('actividad', 'Cosecha')
          .gte('hora_registro', startUTC)
          .lte('hora_registro', endUTC);

        // Calculate jabasFiltro
        const sumFiltro = recordsCosecha?.reduce((acc, curr) => acc + (Number(curr.cantidad_jabas) || 0), 0) || 0;
        setJabasFiltro(sumFiltro);

        // Fetch distinct workers in date range (any activity)
        const { data: recordsWorkers } = await supabase
          .from('tareo_registros')
          .select('trabajador_id')
          .gte('hora_registro', startUTC)
          .lte('hora_registro', endUTC);
          
        const uniqueTrabajadores = new Set(recordsWorkers?.map(r => r.trabajador_id)).size;
        
        const { count: countTotalTrab } = await supabase
          .from('trabajadores')
          .select('*', { count: 'exact', head: true });
          
        setTrabajadoresFiltro({ activos: uniqueTrabajadores, total: countTotalTrab || 0 });

        setLoadingTop(false);

        // --- CHARTS DATA ---
        
        // 1. Ranking de Jabas por Trabajador (top 5)
        const workerSums: Record<string, number> = {};
        recordsCosecha?.forEach((r: any) => {
          const t = r.trabajadores;
          const name = (Array.isArray(t) ? t[0]?.nombre : t?.nombre) || 'Desconocido';
          workerSums[name] = (workerSums[name] || 0) + (Number(r.cantidad_jabas) || 0);
        });
        const topWorkers = Object.entries(workerSums)
          .map(([name, jabas]) => ({ name, jabas }))
          .sort((a, b) => b.jabas - a.jabas)
          .slice(0, 5);
        setDataTrabajadores(topWorkers);

        // Load Lotes Info
        const { data: lotesInfo } = await supabase
          .from('lotes')
          .select('id, codigo, hectareas, cultivos(nombre, color_hex)');
          
        const lotesMap: Record<string, any> = {};
        lotesInfo?.forEach(l => lotesMap[l.id] = l);

        // 2. Distribución por Cultivo
        const cultivoSums: Record<string, number> = {};
        const cultivoColors: Record<string, string> = {};
        recordsCosecha?.forEach(r => {
          const lote = lotesMap[r.lote_id];
          if (lote && lote.cultivos) {
            const cData = Array.isArray(lote.cultivos) ? lote.cultivos[0] : lote.cultivos;
            const cName = cData?.nombre || 'Desconocido';
            const cColor = cData?.color_hex || '#D4A017';
            cultivoSums[cName] = (cultivoSums[cName] || 0) + (Number(r.cantidad_jabas) || 0);
            if (!cultivoColors[cName]) cultivoColors[cName] = cColor;
          }
        });
        
        const totalJabasCultivo = Object.values(cultivoSums).reduce((a, b) => a + b, 0);
        const calcCultivos = Object.entries(cultivoSums).map(([name, sum]) => ({
          name,
          value: totalJabasCultivo > 0 ? Math.round((sum / totalJabasCultivo) * 100) : 0,
        })).sort((a, b) => b.value - a.value);
        setDataCultivos(calcCultivos);
        setDataCultivosColors(calcCultivos.map(c => cultivoColors[c.name]));

        // 3. Rendimiento por Lote
        const loteSums: Record<string, number> = {};
        recordsCosecha?.forEach(r => {
          const lId = r.lote_id;
          loteSums[lId] = (loteSums[lId] || 0) + (Number(r.cantidad_jabas) || 0);
        });
        const rendimientoData = Object.entries(loteSums).map(([lId, sum]) => {
          const lote = lotesMap[lId];
          const has = lote?.hectareas || 1; // prevent div by zero
          return {
            lote: lote?.codigo || '?',
            rto: Math.round(sum / has)
          };
        }).sort((a, b) => b.rto - a.rto).slice(0, 5);
        setDataRendimiento(rendimientoData);

        // 4. Evolución
        const evoMap: Record<string, number> = {};
        recordsCosecha?.forEach(r => {
          // r.hora_registro is local time as a string YYYY-MM-DD HH:MM:SS
          // create a Date object in UTC by appending Z as it's standard ISO DB output
          const d = new Date(r.hora_registro.replace(' ', 'T') + 'Z');
          if (periodoSeleccionado === 'semana') {
            const shortDay = d.toLocaleDateString('es-PE', { weekday: 'short', timeZone: 'America/Lima' });
            // Let's capitalize the first letter directly and handle accents
            const dayKey = shortDay.charAt(0).toUpperCase() + shortDay.slice(1).replace('.', '');
            evoMap[dayKey] = (evoMap[dayKey] || 0) + (Number(r.cantidad_jabas) || 0);
          } else {
            // hora -> e.g., "08:00"
            const hour = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }).split(':')[0] + ':00';
            evoMap[hour] = (evoMap[hour] || 0) + (Number(r.cantidad_jabas) || 0);
          }
        });

        if (periodoSeleccionado === 'semana') {
          // Generate last 7 days ordered sequence
          const evoArray = [];
          for (let i = 6; i >= 0; i--) {
            const past = new Date(todayEnd.getTime());
            past.setDate(past.getDate() - i);
            let sDay = past.toLocaleDateString('es-PE', { weekday: 'short', timeZone: 'America/Lima' });
            sDay = sDay.charAt(0).toUpperCase() + sDay.slice(1).replace('.', '');
            evoArray.push({ label: sDay, jabas: evoMap[sDay] || 0 });
          }
          setDataEvolucion(evoArray);
        } else {
          // Generate hours array (from earliest to latest in records or just 06:00 to 18:00)
          const evoArray = [];
          for (let i = 6; i <= 18; i++) {
            const hourStr = (i < 10 ? '0' + i : i) + ':00';
            evoArray.push({ label: hourStr, jabas: evoMap[hourStr] || 0 });
          }
          setDataEvolucion(evoArray);
        }

        setLoadingCharts(false);

      } catch (e) {
        console.error("Error fetching filtered KPIs", e);
        setLoadingTop(false);
        setLoadingCharts(false);
      }
    };
    
    fetchFilteredData();
  }, [periodoSeleccionado]);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Operativo</h2>
          <p className="text-gray-500 text-sm">Resumen en tiempo real de la cosecha y campo.</p>
        </div>
        
        {/* Toggle Global */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setPeriodoSeleccionado('hoy' as any)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${periodoSeleccionado === 'dia' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setPeriodoSeleccionado('semana')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${periodoSeleccionado === 'semana' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Semana
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        {/* Total Jabas (Dinámico) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {periodoSeleccionado === 'dia' ? 'Total Jabas Hoy' : 'Total Jabas Semana'}
          </p>
          <div className="h-9 flex items-center">
            {loadingTop ? (
              <span className="text-gray-300 font-bold">...</span>
            ) : (
              <p className="text-3xl font-light tabular-nums text-[#1a1c18]">
                {jabasFiltro?.toLocaleString('en-US') || 0}
              </p>
            )}
          </div>
        </div>

        {/* Total Jabas Histórico */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Total Jabas Período Completo
          </p>
          <div className="h-9 flex items-center">
            {jabasPeriodo === null ? (
              <span className="text-gray-300 font-bold">...</span>
            ) : (
              <p className="text-3xl font-light tabular-nums text-[#1a1c18]">
                {jabasPeriodo.toLocaleString('en-US')}
              </p>
            )}
          </div>
        </div>

        {/* Trabajadores Activos (Dinámico) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {periodoSeleccionado === 'dia' ? 'Trabajadores Activos Hoy' : 'Trabajadores Activos (Semana)'}
          </p>
          <div className="h-9 flex items-center">
             {loadingTop || !trabajadoresFiltro ? (
              <span className="text-gray-300 font-bold">...</span>
            ) : (
              <p className="text-3xl font-light tabular-nums text-[#1a1c18]">
                {trabajadoresFiltro.activos} de {trabajadoresFiltro.total}
              </p>
            )}
          </div>
        </div>

        {/* Carencia Activa (Estático) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Lotes en Carencia Activa
          </p>
          <div className="h-9 flex items-center">
            {!carenciaActiva ? (
              <span className="text-gray-300 font-bold">...</span>
            ) : (
              <p className="text-3xl font-light tabular-nums text-[#1a1c18]">
                {carenciaActiva.activos} de {carenciaActiva.total}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-transparent">
        {/* Top Trabajadores */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1 relative">
          <h3 className="font-bold text-gray-700 mb-4">
            Ranking de Jabas por Trabajador {periodoSeleccionado === 'dia' ? '(Hoy)' : '(Últimos 7 días)'}
          </h3>
          <div className="h-64 flex items-center justify-center">
            {loadingCharts ? (
               <span className="text-gray-300 font-bold">...</span>
            ) : dataTrabajadores.length === 0 ? (
               <span className="text-gray-400 text-sm">No hay datos</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTrabajadores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRanking" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#14532D" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="jabas" fill="url(#colorRanking)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Distribución por Cultivo */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1 relative">
          <h3 className="font-bold text-gray-700 mb-4">
            Distribución por Cultivo {periodoSeleccionado === 'dia' ? '(Hoy)' : '(Últimos 7 días)'}
          </h3>
          <div className="h-64 flex items-center justify-center">
            {loadingCharts ? (
               <span className="text-gray-300 font-bold">...</span>
            ) : dataCultivos.length === 0 ? (
               <span className="text-gray-400 text-sm">No hay datos</span>
            ) : (
              <>
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
                        <Cell key={`cell-${index}`} fill={dataCultivosColors[index]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center gap-3 min-w-[120px]">
                  {dataCultivos.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dataCultivosColors[index] }} />
                      <div>
                        <p className="text-sm font-medium text-gray-700 leading-tight">{entry.name}</p>
                        <p className="text-xs text-gray-400 font-mono font-bold">{entry.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Evolución Semanal */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1 relative">
          <h3 className="font-bold text-gray-700 mb-4">
            {periodoSeleccionado === 'dia' ? 'Evolución por Hora' : 'Evolución Semanal de Cosecha'}
          </h3>
          <div className="h-64 flex items-center justify-center">
            {loadingCharts ? (
               <span className="text-gray-300 font-bold">...</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataEvolucion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <Tooltip cursor={{ stroke: '#d6d3d1' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="jabas" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Rendimiento por Hectárea */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-1 relative">
          <h3 className="font-bold text-gray-700 mb-4">
            Rendimiento (Jabas/Ha) por Lote {periodoSeleccionado === 'dia' ? '(Hoy)' : '(Últimos 7 días)'}
          </h3>
          <div className="h-64 flex items-center justify-center">
            {loadingCharts ? (
               <span className="text-gray-300 font-bold">...</span>
            ) : dataRendimiento.length === 0 ? (
               <span className="text-gray-400 text-sm">No hay datos</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataRendimiento} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="lote" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                  <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="rto" fill="#A0522D" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
