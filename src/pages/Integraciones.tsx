import React, { useState } from 'react';
import { Database, MessageSquare, Network, Building2, Server, CheckCircle2, X, Send, Smartphone, MessageCircle, Workflow, Zap, Hash, Eye, EyeOff } from 'lucide-react';
import { ERPS } from '../data';
import { createClient } from '@supabase/supabase-js';

interface ModalData {
  title: string;
  type: 'db' | 'redis' | 'mcp' | 'whatsapp' | 'telegram' | 'sms' | 'erp' | 'n8n' | 'slack' | 'zapier' | 'supabase';
  name?: string;
  configStr?: string;
}

function SupabaseConnectionTest({ onSuccess }: { onSuccess: () => void }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const testConnection = async () => {
    if (!url || !key) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase.from('cultivos').select('*').limit(1);
      
      if (error) {
        throw error;
      }
      
      setStatus('success');
      onSuccess();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Error desconocido al conectar con Supabase');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Project URL</label>
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://tu-proyecto.supabase.co"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Anon/Public Key</label>
        <div className="relative">
          <input 
            type={showKey ? "text" : "password"}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="eyJ..."
            className="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 focus:border-[#556b2f] text-sm"
          />
          <button 
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      
      <button
        onClick={testConnection}
        disabled={status === 'loading' || !url || !key}
        className={`w-full font-medium py-2 px-4 rounded-lg transition-colors text-sm ${
          status === 'loading' || !url || !key
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
            : 'bg-[#556b2f] hover:bg-[#556b2f]/90 text-white'
        }`}
      >
        {status === 'loading' ? 'Probando...' : 'Probar Conexión'}
      </button>

      {status === 'success' && (
        <div className="text-sm font-medium bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 flex items-start gap-2">
           <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-600"/>
           <span>✓ Conexión exitosa — Base de datos respondiendo correctamente</span>
        </div>
      )}

      {status === 'error' && (
        <div className="text-sm font-medium bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-start gap-2 break-words">
           <X size={18} className="shrink-0 mt-0.5 text-red-600"/>
           <span>✗ No se pudo conectar: {errorMsg}</span>
        </div>
      )}
    </div>
  );
}

export function Integraciones() {
  const [modal, setModal] = useState<ModalData | null>(null);
  const [supabaseSuccess, setSupabaseSuccess] = useState(false);

  const renderModalContent = () => {
    if (!modal) return null;

    if (modal.type === 'supabase') {
      return <SupabaseConnectionTest onSuccess={() => setSupabaseSuccess(true)} />;
    }

    if (modal.type === 'db') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 break-all text-gray-600">
             postgres://admin:****@{modal.configStr || 'aws-eu-central-1.supabase.com'}:5432/allpa_prod
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Conexión Establecida (Tiraje 12ms)
           </div>
        </div>
      );
    }

    if (modal.type === 'redis') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 break-all text-gray-600">
             redis://default:****@{modal.configStr || 'redis.allpaops.com'}:6379
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Conexión Establecida (Caché rápido)
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

    if (modal.type === 'telegram') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>Bot Username: @allpaops_bot</p>
             <p>Token: 123456789:AAG...</p>
             <p>Webhook: /api/v1/tg/webhook</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Bot Activo
           </div>
        </div>
      );
    }

    if (modal.type === 'sms') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>Provider: Twilio</p>
             <p>Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxx</p>
             <p>Sender ID: ALLPAOPS</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Configurado
           </div>
        </div>
      );
    }

    if (modal.type === 'n8n') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>Host: n8n.allpaops.com</p>
             <p>Webhook URL: /webhook/sync</p>
             <p>Workflows Activos: 12</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Instancia Conectada
           </div>
        </div>
      );
    }

    if (modal.type === 'zapier') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>App ID: AllpaOps Beta</p>
             <p>API Key: zpk_live_***</p>
             <p>Zaps Configurados: 4</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Autenticado
           </div>
        </div>
      );
    }

    if (modal.type === 'slack') {
      return (
        <div className="space-y-4 font-mono text-sm">
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-600">
             <p>Workspace: AllpaOps Team</p>
             <p>Canal: #alertas-cosecha</p>
             <p>Bot Scopes: chat:write, files:write</p>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
             <CheckCircle2 size={16} /> Workspace Vinculado
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

      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Database size={20} className="text-[#556b2f]" />
          Bases de Datos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#336791]/10 text-[#336791] flex items-center justify-center mb-4 border border-[#336791]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" xmlSpace="preserve" viewBox="0 0 432.071 445.383"><g style={{fillRule:"nonzero",clipRule:"nonzero",fill:"none",stroke:"#fff",strokeWidth:"12.4651",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:4}}><path d="M323.205 324.227c2.833-23.601 1.984-27.062 19.563-23.239l4.463.392c13.517.615 31.199-2.174 41.587-7 22.362-10.376 35.622-27.7 13.572-23.148-50.297 10.376-53.755-6.655-53.755-6.655 53.111-78.803 75.313-178.836 56.149-203.322-52.27-66.789-142.748-35.206-144.262-34.386l-.482.089c-9.938-2.062-21.06-3.294-33.554-3.496-22.761-.374-40.032 5.967-53.133 15.904 0 0-161.408-66.498-153.899 83.628 1.597 31.936 45.777 241.655 98.47 178.31 19.259-23.163 37.871-42.748 37.871-42.748 9.242 6.14 20.307 9.272 31.912 8.147l.897-.765c-.281 2.876-.157 5.689.359 9.019-13.572 15.167-9.584 17.83-36.723 23.416-27.457 5.659-11.326 15.734-.797 18.367 12.768 3.193 42.305 7.716 62.268-20.224l-.795 3.188c5.325 4.26 4.965 30.619 5.72 49.452.756 18.834 2.017 36.409 5.856 46.771 3.839 10.36 8.369 37.05 44.036 29.406 29.809-6.388 52.6-15.582 54.677-101.107" style={{fill:"#000",stroke:"#000",strokeWidth:"37.3953",strokeLinecap:"butt",strokeLinejoin:"miter"}}/><path stroke="none" d="M402.395 271.23c-50.302 10.376-53.76-6.655-53.76-6.655 53.111-78.808 75.313-178.843 56.153-203.326-52.27-66.785-142.752-35.2-144.262-34.38l-.486.087c-9.938-2.063-21.06-3.292-33.56-3.496-22.761-.373-40.026 5.967-53.127 15.902 0 0-161.411-66.495-153.904 83.63 1.597 31.938 45.776 241.657 98.471 178.312 19.26-23.163 37.869-42.748 37.869-42.748 9.243 6.14 20.308 9.272 31.908 8.147l.901-.765c-.28 2.876-.152 5.689.361 9.019-13.575 15.167-9.586 17.83-36.723 23.416-27.459 5.659-11.328 15.734-.796 18.367 12.768 3.193 42.307 7.716 62.266-20.224l-.796 3.188c5.319 4.26 9.054 27.711 8.428 48.969-.626 21.259-1.044 35.854 3.147 47.254 4.191 11.4 8.368 37.05 44.042 29.406 29.809-6.388 45.256-22.942 47.405-50.555 1.525-19.631 4.976-16.729 5.194-34.28l2.768-8.309c3.192-26.611.507-35.196 18.872-31.203l4.463.392c13.517.615 31.208-2.174 41.591-7 22.358-10.376 35.618-27.7 13.573-23.148z" style={{fill:"#336791",stroke:"none"}}/><path d="M215.866 286.484c-13.385 49.516.348 99.377 5.193 111.495 4.848 12.118 15.223 35.688 50.9 28.045 29.806-6.39 40.651-18.756 45.357-46.051 3.466-20.082 10.148-75.854 11.005-87.281M173.104 38.256S11.583-27.76 19.092 122.365c1.597 31.938 45.779 241.664 98.473 178.316 19.256-23.166 36.671-41.335 36.671-41.335M260.349 26.207c-5.591 1.753 89.848-34.889 144.087 34.417 19.159 24.484-3.043 124.519-56.153 203.329"/><path d="M348.282 263.953s3.461 17.036 53.764 6.653c22.04-4.552 8.776 12.774-13.577 23.155-18.345 8.514-59.474 10.696-60.146-1.069-1.729-30.355 21.647-21.133 19.96-28.739-1.525-6.85-11.979-13.573-18.894-30.338-6.037-14.633-82.796-126.849 21.287-110.183 3.813-.789-27.146-99.002-124.553-100.599-97.385-1.597-94.19 119.762-94.19 119.762" style={{strokeLinejoin:"bevel"}}/><path d="M188.604 274.334c-13.577 15.166-9.584 17.829-36.723 23.417-27.459 5.66-11.326 15.733-.797 18.365 12.768 3.195 42.307 7.718 62.266-20.229 6.078-8.509-.036-22.086-8.385-25.547-4.034-1.671-9.428-3.765-16.361 3.994z"/><path d="M187.715 274.069c-1.368-8.917 2.93-19.528 7.536-31.942 6.922-18.626 22.893-37.255 10.117-96.339-9.523-44.029-73.396-9.163-73.436-3.193-.039 5.968 2.889 30.26-1.067 58.548-5.162 36.913 23.488 68.132 56.479 64.938"/><path d="M172.517 141.7c-.288 2.039 3.733 7.48 8.976 8.207 5.234.73 9.714-3.522 9.998-5.559.284-2.039-3.732-4.285-8.977-5.015-5.237-.731-9.719.333-9.996 2.367z" style={{fill:"#fff",strokeWidth:"4.155",strokeLinecap:"butt",strokeLinejoin:"miter"}}/><path d="M331.941 137.543c.284 2.039-3.732 7.48-8.976 8.207-5.238.73-9.718-3.522-10.005-5.559-.277-2.039 3.74-4.285 8.979-5.015 5.239-.73 9.718.333 10.002 2.368z" style={{fill:"#fff",strokeWidth:"2.0775",strokeLinecap:"butt",strokeLinejoin:"miter"}}/><path d="M350.676 123.432c.863 15.994-3.445 26.888-3.988 43.914-.804 24.748 11.799 53.074-7.191 81.435"/></g></svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">PostgreSQL</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Conexión directa a PostgreSQL para analítica y reportería avanzada.
            </p>
            <button 
              onClick={() => setModal({ title: 'Conexión PostgreSQL', type: 'db', configStr: 'pg.allpaops.com' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#C6302B]/10 text-[#C6302B] flex items-center justify-center mb-4 border border-[#C6302B]/20">
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 220" className="w-6 h-6">
                <path d="M246 169c-13.7 7-84.5 36.2-99.5 44-15.1 7.9-23.5 7.8-35.4 2.1C99.2 209.4 24 179 10.3 172.5 3.6 169.3 0 166.5 0 164v-26s98-21.3 113.9-27c15.8-5.6 21.3-5.8 34.8-.9 13.4 5 94 19.5 107.3 24.3V160c0 2.5-3 5.3-10 9" fill="#912626"/>
                <path d="M246 143.2c-13.7 7.1-84.5 36.2-99.5 44-15.1 8-23.5 7.9-35.4 2.2-11.9-5.7-87.2-36.1-100.8-42.6-13.5-6.5-13.8-11-.5-16.2 13.4-5.2 88.2-34.6 104-40.3 16-5.6 21.4-5.8 34.9-1 13.4 5 83.8 33 97.1 37.9 13.3 4.9 13.8 8.9.2 16" fill="#C6302B"/>
                <path d="M246 127c-13.7 7.2-84.5 36.3-99.5 44.2-15.1 7.8-23.5 7.7-35.4 2-11.9-5.6-87.2-36-100.8-42.6-6.7-3.2-10.3-6-10.3-8.5V96.2s98-21.3 113.9-27c15.8-5.7 21.3-5.9 34.8-1 13.4 5 94 19.5 107.3 24.4V118c0 2.5-3 5.4-10 9" fill="#912626"/>
                <path d="M246 101.4c-13.7 7-84.5 36.2-99.5 44-15.1 7.9-23.5 7.8-35.4 2.1C99.2 141.8 24 111.4 10.3 105c-13.5-6.5-13.8-11-.5-16.1C23.2 83.5 98 54 113.8 48.5c16-5.7 21.4-6 34.9-1 13.4 5 83.8 33 97.1 37.8 13.3 5 13.8 9 .2 16" fill="#C6302B"/>
                <path d="M246 83.7c-13.7 7-84.5 36.2-99.5 44-15.1 7.9-23.5 7.8-35.4 2.1C99.2 124.1 24 93.7 10.3 87.2 3.6 84 0 81.2 0 78.7v-26s98-21.3 113.9-27c15.8-5.6 21.3-5.8 34.8-.9 13.4 5 94 19.5 107.3 24.4v25.5c0 2.5-3 5.3-10 9" fill="#912626"/>
                <path d="M246 58c-13.7 7-84.5 36.1-99.5 44-15.1 7.9-23.5 7.8-35.4 2C99.2 98.5 24 68 10.3 61.6c-13.5-6.5-13.8-11-.5-16.2C23.2 40.1 98 10.7 113.8 5c16-5.6 21.4-5.8 34.9-.9 13.4 5 83.8 33 97.1 37.8 13.3 4.9 13.8 9 .2 16" fill="#C6302B"/>
                <path d="m159.3 32.8-22 2.2-5 11.9-8-13.2L99 31.4l19-6.9-5.8-10.5 17.8 7 16.7-5.5-4.5 10.9 17 6.4M131 90.3l-41-17 58.8-9.1-17.8 26M74 39.3c17.5 0 31.5 5.5 31.5 12.2 0 6.8-14 12.2-31.4 12.2s-31.5-5.4-31.5-12.2c0-6.7 14.1-12.2 31.5-12.2" fill="#FFF"/>
                <path d="M185.3 36 220 49.8l-34.8 13.7V36" fill="#621B1C"/>
                <path d="M146.8 51.2 185.3 36v27.5l-3.8 1.5-34.7-13.8" fill="#9A2928"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Redis</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Store en memoria para caché rápido y manejo de sesiones.
            </p>
            <button 
              onClick={() => setModal({ title: 'Conexión Redis', type: 'redis', configStr: 'redis.allpaops.com' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E] flex items-center justify-center mb-4 border border-[#3ECF8E]/20">
              <svg viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
                <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#249361"/>
                    <stop offset="1" stopColor="#3ECF8E"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
                    <stop/>
                    <stop offset="1" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Supabase</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Conexión a cluster gestionado de Supabase para integraciones modernas.
            </p>
            <button 
              onClick={() => { setModal({ title: 'Conectar Supabase', type: 'supabase' }); setSupabaseSuccess(false); }}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Network size={20} className="text-[#556b2f]" />
          Model Context Protocol (MCP)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
              <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>ModelContextProtocol</title><path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z"></path><path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z"></path></svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AllpaOps Toolkit</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Expone funciones base del sistema para agentes IA (lecturas de cosecha, tareo).
            </p>
            <button 
              onClick={() => setModal({ title: 'Servidor MCP - Toolkit', type: 'mcp' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center mb-4 border border-gray-100">
              <Server size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Local/Desktop Agent</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Integración MCP con herramientas de escritorio y copilot.
            </p>
            <button 
              onClick={() => setModal({ title: 'Servidor MCP - Local', type: 'mcp' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
          <MessageCircle size={20} className="text-[#556b2f]" />
          Comunicaciones y Redes Sociales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-4 border border-[#25D366]/20">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M17.47 16.03c-.22.6-1.12 1.13-1.66 1.25-.43.1-.96.16-3.03-.71-2.48-1.04-4.13-3.66-4.25-3.83-.12-.17-1.02-1.36-1.02-2.6s.64-1.83.86-2.06c.18-.18.47-.25.68-.25h.35c.16 0 .37-.06.57.42.22.53.74 1.79.8 1.93.07.14.12.31.02.51-.1.2-.14.33-.29.48-.15.15-.31.33-.44.47-.15.14-.3.29-.14.58.16.29.74 1.23 1.59 1.99.78.69 1.58.94 1.83 1.06.25.11.45.1.62-.05.18-.16.63-.73.86-1.02.2-.26.44-.22.68-.13.25.1 1.57.74 1.83.87.27.13.44.2.51.31.07.11.07.64-.15 1.24zM12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.73 1.5 5.25L2.3 22.5l5.35-1.4c1.47.85 3.16 1.35 4.96 1.35 6.07 0 11-4.93 11-11S18.07 2 12 2zm0 18.5c-1.58 0-3.09-.41-4.41-1.13l-.32-.17-3.28.86.87-3.2-.2-.3B3.5 14.86 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">WhatsApp API</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Recepción de reportes diarios de jefes de campo vía WhatsApp.
            </p>
            <button 
              onClick={() => setModal({ title: 'WhatsApp Business', type: 'whatsapp' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center mb-4 border border-[#229ED9]/20">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Telegram Bot</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Comandos estructurados y alertas instantáneas a través de Telegram.
            </p>
            <button 
              onClick={() => setModal({ title: 'Telegram Bot', type: 'telegram' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mb-4 border border-gray-200">
              <Smartphone size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Alertas SMS</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Mensajería SMS para recordatorios y alertas críticas desconectadas.
            </p>
            <button 
              onClick={() => setModal({ title: 'Configuración SMS', type: 'sms' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Workflow size={20} className="text-[#556b2f]" />
          Herramientas de Automatización
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#ea4b71]/10 text-[#ea4b71] flex items-center justify-center mb-4 border border-[#ea4b71]/20 p-2">
               <svg viewBox="0 0 228 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-current"><path fillRule="evenodd" clipRule="evenodd" d="M204 48C192.817 48 183.42 40.3514 180.756 30H153.248C147.382 30 142.376 34.241 141.412 40.0272L140.425 45.9456C139.489 51.5648 136.646 56.4554 132.626 60C136.646 63.5446 139.489 68.4352 140.425 74.0544L141.412 79.9728C142.376 85.759 147.382 90 153.248 90H156.756C159.42 79.6486 168.817 72 180 72C193.255 72 204 82.7452 204 96C204 109.255 193.255 120 180 120C168.817 120 159.42 112.351 156.756 102H153.248C141.516 102 131.504 93.5181 129.575 81.9456L128.588 76.0272C127.624 70.241 122.618 66 116.752 66H107.244C104.58 76.3514 95.183 84 84 84C72.817 84 63.4204 76.3514 60.7561 66H47.2439C44.5796 76.3514 35.183 84 24 84C10.7452 84 0 73.2548 0 60C0 46.7452 10.7452 36 24 36C35.183 36 44.5796 43.6486 47.2439 54H60.7561C63.4204 43.6486 72.817 36 84 36C95.183 36 104.58 43.6486 107.244 54H116.752C122.618 54 127.624 49.759 128.588 43.9728L129.575 38.0544C131.504 26.4819 141.516 18 153.248 18L180.756 18C183.42 7.64864 192.817 0 204 0C217.255 0 228 10.7452 228 24C228 37.2548 217.255 48 204 48ZM204 36C210.627 36 216 30.6274 216 24C216 17.3726 210.627 12 204 12C197.373 12 192 17.3726 192 24C192 30.6274 197.373 36 204 36ZM24 72C30.6274 72 36 66.6274 36 60C36 53.3726 30.6274 48 24 48C17.3726 48 12 53.3726 12 60C12 66.6274 17.3726 72 24 72ZM96 60C96 66.6274 90.6274 72 84 72C77.3726 72 72 66.6274 72 60C72 53.3726 77.3726 48 84 48C90.6274 48 96 53.3726 96 60ZM192 96C192 102.627 186.627 108 180 108C173.373 108 168 102.627 168 96C168 89.3726 173.373 84 180 84C186.627 84 192 89.3726 192 96Z" fill="currentColor"/></svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">n8n</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Despliegue de flujos de trabajo avanzados y orquestación de datos on-premise.
            </p>
            <button 
              onClick={() => setModal({ title: 'Configuración n8n', type: 'n8n' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-4 border border-orange-100">
               <Zap size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Zapier</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Integración no-code rápida con más de 5,000 aplicaciones web.
            </p>
            <button 
              onClick={() => setModal({ title: 'Configuración Zapier', type: 'zapier' })}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm"
            >
              Ver Conexión
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-lg bg-[#E01E5A]/10 text-[#E01E5A] flex items-center justify-center mb-4 border border-[#E01E5A]/20">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Slack</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Notificaciones de cosecha y alertas automatizadas a canales de equipo.
            </p>
            <button 
              onClick={() => setModal({ title: 'Slack Workspace', type: 'slack' })}
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
          <div className={`bg-white rounded-xl w-full max-w-md shadow-xl border overflow-hidden animate-in zoom-in-95 duration-200 ${
            supabaseSuccess ? 'border-green-500 ring-4 ring-green-500/10' : 'border-gray-100'
          }`}>
            <div className={`flex items-center justify-between p-4 border-b bg-gray-50/50 ${supabaseSuccess ? 'border-green-100' : 'border-gray-100'}`}>
              <h3 className="font-bold text-gray-900">{modal.title}</h3>
              <button 
                onClick={() => { setModal(null); setSupabaseSuccess(false); }}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {renderModalContent()}
            </div>
            <div className={`p-4 border-t bg-gray-50 flex justify-end ${supabaseSuccess ? 'border-green-100' : 'border-gray-100'}`}>
              <button 
                onClick={() => { setModal(null); setSupabaseSuccess(false); }}
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
