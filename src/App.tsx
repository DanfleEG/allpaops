/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tareo, INITIAL_REGISTERS } from './pages/Tareo';
import { Sanidad } from './pages/Sanidad';
import { Trazabilidad } from './pages/Trazabilidad';
import { MapaLotes } from './pages/MapaLotes';
import { Integraciones } from './pages/Integraciones';
import { Precios } from './pages/Precios';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [totalJabasHoy, setTotalJabasHoy] = useState(1942);
  const [registrosTareo, setRegistrosTareo] = useState(INITIAL_REGISTERS);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  const formattedDate = currentTime.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard totalJabasHoy={totalJabasHoy} />;
      case 'tareo':
        return <Tareo 
          registros={registrosTareo} 
          setRegistros={setRegistrosTareo} 
          setTotalJabasHoy={setTotalJabasHoy} 
        />;
      case 'sanidad':
        return <Sanidad />;
      case 'trazabilidad':
        return <Trazabilidad />;
      case 'mapa':
        return <MapaLotes />;
      case 'integraciones':
        return <Integraciones />;
      case 'precios':
        return <Precios />;
      default:
        return <Dashboard totalJabasHoy={totalJabasHoy} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fafaf9] overflow-hidden text-[#1a1a1a] selection:bg-[#10B981]/20">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          setIsAuthenticated(false);
          setActiveTab('dashboard');
        }} 
      />
      
      <main className="flex-1 flex flex-col h-full shrink-0">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-100 hidden sm:flex">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#10B981]" />
                <span className="capitalize">{formattedDate}</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2 font-mono">
                <Clock size={14} className="text-[#10B981]" />
                <span>{formattedTime}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">Sincronización: <strong>Hace 12s</strong></span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full fade-in animate-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

