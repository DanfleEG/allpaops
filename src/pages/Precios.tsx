import React, { useState } from 'react';
import { Check, X, Sprout, ShoppingBasket, Ship } from 'lucide-react';

export function Precios() {
  const [isAnnual, setIsAnnual] = useState(false);

  const getMailToUrl = (asunto: string, cuerpo: string) => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=danilo.david.eg@gmail.com&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full relative min-h-full">
      {/* Fondo de degradado sutil para la pantalla */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-white/10 pointer-events-none -z-10 rounded-xl" />

      <div className="mb-10 text-center relative z-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Planes y Precios</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
          Elige el plan que mejor se adapte a las necesidades de tu operación agrícola. 
          Escala conforme tu negocio crece.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Mensual</span>
          <button 
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 rounded-full bg-[#10B981] p-1 transition-colors relative shadow-inner"
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Anual</span>
            <span className="bg-green-100 text-green-800 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border border-green-200">
              Ahorra 20%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start mb-12 relative z-10 mt-12">
        {/* Plan 1: Campo */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col h-full transform transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="mb-6">
            <Sprout className="text-[#10B981] mb-4" size={32} strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Campo</h3>
            <p className="text-gray-500 text-sm h-10">Para el pequeño productor</p>
            <div className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-extrabold tracking-tight">S/ {isAnnual ? '119' : '149'}</span>
              <span className="ml-1 text-xl font-medium text-gray-500">/mes</span>
            </div>
          </div>
          <ul className="flex-1 space-y-4 mb-8 pt-2 border-t border-gray-50">
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Hasta 50 hectáreas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Hasta 10 lotes</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Hasta 30 trabajadores</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Tareo digital</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Sanidad y Carencia</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Soporte por email</span>
            </li>
            <li className="flex items-start gap-3 opacity-50">
              <X className="text-gray-400 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-500 text-sm line-through">Trazabilidad Audit-Ready</span>
            </li>
            <li className="flex items-start gap-3 opacity-50">
              <X className="text-gray-400 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-500 text-sm line-through">Integraciones (Power BI, WhatsApp)</span>
            </li>
          </ul>
          <a
            href={getMailToUrl("Quiero iniciar mi prueba gratuita - Plan Campo", "Hola, estoy interesado en iniciar mi prueba gratuita de 7 días del plan Campo de AllpaOps. Quedo atento a los siguientes pasos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-xl py-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Comenzar
          </a>
        </div>

        {/* Plan 2: Cosecha (Recomendado) */}
        <div className="bg-gradient-to-br from-[#10B981] to-[#14B8A6] rounded-2xl shadow-2xl p-8 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.5)] relative md:-mt-6 md:mb-6 border border-[#059669] z-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-[#10B981] px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg border border-green-50">
            Más Popular
          </div>
          <div className="mb-6">
            <ShoppingBasket className="text-green-300 mb-4" size={32} strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-white mb-2">Cosecha</h3>
            <p className="text-green-100/90 text-sm h-10">Para la empresa agroexportadora en crecimiento</p>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-4xl font-extrabold tracking-tight">S/ {isAnnual ? '319' : '399'}</span>
              <span className="ml-1 text-xl font-medium text-green-200">/mes</span>
            </div>
          </div>
          <ul className="flex-1 space-y-4 mb-8 pt-2 border-t border-green-700/50">
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-white text-sm font-medium">Hasta 300 hectáreas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-white text-sm font-medium">Hasta 50 lotes</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-white text-sm font-medium">Hasta 150 trabajadores</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-green-50 text-sm">Tareo digital</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-green-50 text-sm">Sanidad y Carencia</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-green-50 text-sm">Trazabilidad Audit-Ready (GlobalG.A.P.)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-green-50 text-sm">Integraciones (Power BI, WhatsApp)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-400 shrink-0 mt-0.5" size={18} strokeWidth={3} />
              <span className="text-green-50 text-sm">Soporte por email y chat</span>
            </li>
          </ul>
          <a
            href={getMailToUrl("Quiero iniciar mi prueba gratuita - Plan Cosecha", "Hola, estoy interesado en iniciar mi prueba gratuita de 7 días del plan Cosecha de AllpaOps. Quedo atento a los siguientes pasos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center bg-white text-[#059669] font-extrabold rounded-xl py-3 hover:bg-gray-50 hover:scale-[1.03] hover:shadow-xl hover:text-[#059669] transition-all duration-200"
          >
            Comenzar
          </a>
        </div>

        {/* Plan 3: Exportador */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col h-full transform transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="mb-6">
            <Ship className="text-[#10B981] mb-4" size={32} strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Exportador</h3>
            <p className="text-gray-500 text-sm h-10">Para grandes exportadoras multi-fundo</p>
            <div className="mt-4 flex items-baseline text-gray-900 h-[40px] items-end pb-1">
              <span className="text-3xl font-bold tracking-tight">Contactar a ventas</span>
            </div>
          </div>
          <ul className="flex-1 space-y-4 mb-8 pt-2 border-t border-gray-50">
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm font-medium">Hectáreas ilimitadas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm font-medium">Lotes ilimitados</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm font-medium">Trabajadores ilimitados</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Todo lo del plan Cosecha</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Integraciones con ERPs externos (SAP, Nisira, SpaceAG etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
              <span className="text-gray-600 text-sm">Soporte dedicado con Account Manager</span>
            </li>
          </ul>
          <a
            href={getMailToUrl("Consulta comercial - Plan Exportador", "Hola, represento a una empresa exportadora y quisiera más información sobre el plan Exportador de AllpaOps, incluyendo precios e integraciones disponibles.")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-xl py-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Contactar a Ventas
          </a>
        </div>
      </div>

      <div className="text-center relative z-10 pb-6">
        <p className="text-sm text-gray-500 font-medium">
          Todos los planes incluyen 7 días de prueba gratuita. Sin tarjeta de crédito requerida.
        </p>
      </div>
    </div>
  );
}
