import React, { useState } from 'react';
import { Database, MessageSquare, Network, Building2, Server, CheckCircle2, X } from 'lucide-react';
import { ERPS } from '../data';

interface ModalData {
  title: string;
  type: 'db' | 'mcp' | 'whatsapp' | 'erp';
  name?: string;
}

export function Integraciones() {
  const [modal, setModal] = useState<ModalData | null>(null);

  const renderModalContent = () => {
    if (!modal) return null;

    if (modal.type === 'db') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 break-all text-gray-600">
             postgres://admin:****@aws-eu-central-1.supabase.com:5432/allpa_prod
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Conexión Establecida (Tiraje 12ms)
           </div>
        </div>
      );
    }

    if (modal.type === 'mcp') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p className="text-[#556b2f] font-bold mb-2">// Server Name: AllpaOps Agent Toolkit</p>
             <p>URL: https://mcp.allpaops.com/v1</p>
             <p>Capabilities: read_harvest, check_rules</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Heartbeat OK (Activo)
           </div>
        </div>
      );
    }

    if (modal.type === 'whatsapp') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>WABA ID: 1049283948572</p>
             <p>Teléfono: +51 987 654 321</p>
             <p>Webhook: /api/v1/wa/incoming</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> API Vinculada
           </div>
        </div>
      );
    }

    if (modal.type === 'erp') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>ERP: {modal.name}</p>
             <p>Endpoint: https://api.allpaops.com/sync/{modal.name?.toLowerCase().replace(' ', '')}</p>
             <p>Última sincronización: Hace 2 minutos</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Push Automático Configurado
           </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Integraciones</h2>
        <p className="text-gray-500 text-sm">Conectores para flujo de datos bidireccional.</p>
      </div>

      <div className="bg-orange-50/50 border border-orange-200 text-orange-800 text-sm px-4 py-3 rounded-lg mb-8 flex gap-3">
        <Network className="shrink-0" size={20} />
        <p>Estas integraciones son configuraciones de demostración para ilustrar la capacidad del sistema de interactuar con ecosistemas externos y no realizan llamadas de red reales.</p>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Server size={20} className="text-[#556b2f]" />
          Conectividad de Datos Base
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center mb-4 border border-gray-100">
              <Database size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Base de Datos SQL</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Conexión directa a PostgreSQL, MySQL o Supabase para analítica.
            </p>
            <button 
              onClick={() => setModal({ title: 'Configuración SQL', type: 'db' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center mb-4 border border-gray-100">
              <Network size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Protocolo MCP</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Model Context Protocol. Expone funciones a agentes de Inteligencia Artificial.
            </p>
            <button 
              onClick={() => setModal({ title: 'Servidor MCP', type: 'mcp' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4 border border-green-100">
              <MessageSquare size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">WhatsApp API</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Business API para recepción de tareo mediante mensajes estructurados.
            </p>
            <button 
              onClick={() => setModal({ title: 'WhatsApp Business API', type: 'whatsapp' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Building2 size={20} className="text-[#556b2f]" />
          Sincronización con ERPs Agrotech
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {ERPS.map(erp => (
            <div key={erp.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center justify-between min-h-[160px] group hover:border-[#556b2f]/30 transition-colors">
              <div className="flex-1 flex items-center justify-center">
                 {/* Placeholders, if real logos were provided they would go here */}
                 <div className="flex flex-col items-center">
                   <Building2 size={28} className="text-gray-300 mb-3 group-hover:text-[#556b2f] transition-colors" />
                   <span className="font-medium tracking-tight text-gray-800">{erp.name}</span>
                 </div>
              </div>
              <button 
                onClick={() => setModal({ title: `Conexión a ${erp.name}`, type: 'erp', name: erp.name })}
                className="w-full mt-4 bg-white border border-gray-200 text-gray-600 font-medium py-1.5 rounded-lg text-xs hover:bg-[#556b2f] hover:text-white hover:border-[#556b2f] transition-colors"
               >
                Conectar
              </button>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900">{modal.title}</h3>
              <button 
                onClick={() => setModal(null)}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {renderModalContent()}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setModal(null)}
                className="px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
