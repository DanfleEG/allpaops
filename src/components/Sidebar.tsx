import React, { useState } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  ClipboardList, 
  LeafyGreen, 
  ShieldCheck, 
  Blocks,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Building2 },
  { id: 'tareo', label: 'Tareo de Campo', icon: ClipboardList },
  { id: 'sanidad', label: 'Sanidad y Carencia', icon: LeafyGreen },
  { id: 'trazabilidad', label: 'Trazabilidad', icon: ShieldCheck },
  { id: 'mapa', label: 'Mapa de Lotes', icon: MapIcon },
  { id: 'integraciones', label: 'Integraciones', icon: Blocks },
];

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={`flex flex-col bg-[#1a1c18] text-white shrink-0 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } h-full`}
    >
      <div className="flex items-center justify-between h-16 p-6">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#556b2f] flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-bold text-white text-xl tracking-tight">AllpaOps</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#556b2f] flex items-center justify-center text-white font-bold text-lg mx-auto">
            A
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1 rounded-md hover:bg-white/10 text-gray-400 ${collapsed ? 'hidden' : 'block'}`}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      {collapsed && (
        <button 
          onClick={() => setCollapsed(false)}
          className="p-2 mx-auto rounded-md hover:bg-white/10 text-gray-400"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={collapsed ? tab.label : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-[#556b2f] text-white font-medium' 
                  : 'text-gray-400 hover:bg-white/5'
              } ${collapsed ? 'justify-center' : 'justify-start'}`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              {!collapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/10 mt-auto">
        {!collapsed && (
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#556b2f]/20 rounded-full flex items-center justify-center text-[#8da46c] font-bold">JD</div>
              <div className="text-left">
                <p className="text-sm font-medium">Gerencia</p>
                <p className="text-xs text-gray-500">AllpaOps</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 bg-[#556b2f]/20 rounded-full flex items-center justify-center text-[#8da46c] font-bold text-sm">JD</div>
            <button onClick={onLogout} className="text-gray-400 hover:text-white" title="Cerrar Sesión">
               <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
