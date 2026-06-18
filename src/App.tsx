/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tareo } from './pages/Tareo';
import { Sanidad } from './pages/Sanidad';
import { Trazabilidad } from './pages/Trazabilidad';
import { MapaLotes } from './pages/MapaLotes';
import { Integraciones } from './pages/Integraciones';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tareo':
        return <Tareo />;
      case 'sanidad':
        return <Sanidad />;
      case 'trazabilidad':
        return <Trazabilidad />;
      case 'mapa':
        return <MapaLotes />;
      case 'integraciones':
        return <Integraciones />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fafaf9] overflow-hidden text-[#1a1a1a] selection:bg-[#556b2f]/20">
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
          <div className="flex items-center gap-4">
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

