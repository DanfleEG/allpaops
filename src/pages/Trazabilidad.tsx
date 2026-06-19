import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { LOTES } from '../data';

export function Trazabilidad() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [showReport, setShowReport] = useState(false);

  const steps = [
    "Iniciando...",
    "Consolidando registros de cosecha...",
    "Verificando periodos de carencia...",
    "Generando bitácora final audit-ready..."
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowReport(false);
    setStep(1);

    setTimeout(() => setStep(2), 800);
    setTimeout(() => setStep(3), 1600);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
      setStep(0);
    }, 2500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Trazabilidad / Audit-Ready</h2>
        <p className="text-gray-500 text-sm">Generación de reportes de cumplimiento para auditorías (GlobalG.A.P, etc.).</p>
      </div>

      {!showReport && (
        <div className="bg-white rounded-xl border border-gray-100 p-10 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
          {!isGenerating ? (
            <>
              <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-6 shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reporte Consolidado</h3>
              <p className="text-gray-500 text-center max-w-md mb-8 text-sm">
                Agrupa todos los registros de tareo y variables de sanidad de la campaña actual, 
                listo para presentar a inspectores.
              </p>
              
              <button
                onClick={handleGenerate}
                className="bg-[#556b2f] hover:bg-[#556b2f]/90 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <FileText size={20} />
                Generar Reporte de Auditoría
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm">
              <Loader2 className="w-10 h-10 animate-spin text-accent mb-6" />
              <div className="space-y-3 w-full">
                {steps.map((text, idx) => {
                  const isActive = step === idx;
                  const isPast = step > idx;
                  if (idx === 0) return null; // skip initial

                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                        isActive ? 'text-[#556b2f] font-medium' : 
                        isPast ? 'text-gray-400' : 'text-gray-300'
                      }`}
                    >
                      <div>
                        {isPast ? <CheckCircle2 size={16} /> : 
                         isActive ? <Loader2 size={16} className="animate-spin" /> : 
                         <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                      </div>
                      {text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {showReport && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20}/>
                Reporte Generado Exitosamente
              </h3>
              <p className="text-sm font-mono text-gray-500 mt-1">ID: AUD-{new Date().getTime().toString().slice(-6)} • {new Date().toLocaleDateString()}</p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors">
              <Download size={16} />
              Descargar PDF
            </button>
          </div>

          <div className="p-8 pb-12">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Header Report */}
              <div className="text-center border-b border-gray-100 pb-8">
                <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-1">ALLPAOPS</h1>
                <p className="text-gray-400 text-sm tracking-widest uppercase font-semibold">Certificado de Trazabilidad</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Período</p>
                  <p className="font-mono text-sm text-gray-800 font-medium">1-14 {new Date().toLocaleString('es', { month: 'short' })}</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Lotes Auditados</p>
                  <p className="font-mono text-sm text-gray-800 font-medium">10 / 10</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Registros Cons.</p>
                  <p className="font-mono text-sm text-gray-800 font-medium">3,492</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Cumplimiento</p>
                  <p className="font-mono text-sm text-green-700 font-bold">100%</p>
                </div>
              </div>

              {/* Lotes summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Estado de Inocuidad por Lote</h4>
                <div className="space-y-2 text-sm font-mono">
                  {LOTES.map(lote => (
                    <div key={lote.nombre} className="flex justify-between items-center py-1">
                      <span className="text-gray-600">{lote.nombre} ({lote.cultivo})</span>
                      {lote.estado === 'En Carencia Activa' && (
                        <span className="text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded text-xs">Carencia: {lote.carencia}d</span>
                      )}
                      {lote.estado === 'Listo para Cosecha' && (
                        <span className="text-green-600 border border-green-200 bg-green-50 px-2 py-0.5 rounded text-xs">Listo para Cosecha</span>
                      )}
                      {lote.estado === 'Cosechado Seguro' && (
                        <span className="text-blue-600 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded text-xs">Cosechado Seguro</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
