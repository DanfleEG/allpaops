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
  ChevronRight,
  Tag
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
  { id: 'precios', label: 'Planes y Precios', icon: Tag },
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
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M4.22144 4.44173C4.40933 4.41778 4.57522 4.55946 4.57522 4.74902V10.1984C4.57522 16.003 4.86905 25.8203 14.9629 25.8203C21.1812 25.8203 25.3606 20.8478 25.3606 15.0193C25.3606 9.19075 20.3337 4.86076 14.0755 4.86076C13.3079 4.86076 12.6863 5.48132 12.6863 6.24755V10.0248C12.6863 10.0248 14.1874 10.0208 14.5032 10.0208C18.7646 10.0208 20.2097 13.2174 20.2097 15.0193C20.2097 18.3975 17.9771 20.6143 15.1948 20.6143C11.7189 20.6143 9.71211 17.8407 9.71211 14.9774V2.89331C9.71411 1.29501 11.0113 0 12.6104 0C30.4375 0 34.8429 6.79429 34.8429 11.3358C34.8429 22.8771 21.485 32 12.7982 32C2.22465 32 0 22.1208 0 14.9514C0 6.82023 2.42653 4.68117 4.22144 4.44173Z" fill="#22B94F"/>
              </svg>
            </div>
            <span className="font-bold text-white text-xl tracking-tight">AllpaOps</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 flex items-center justify-center mx-auto">
            <svg viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M4.22144 4.44173C4.40933 4.41778 4.57522 4.55946 4.57522 4.74902V10.1984C4.57522 16.003 4.86905 25.8203 14.9629 25.8203C21.1812 25.8203 25.3606 20.8478 25.3606 15.0193C25.3606 9.19075 20.3337 4.86076 14.0755 4.86076C13.3079 4.86076 12.6863 5.48132 12.6863 6.24755V10.0248C12.6863 10.0248 14.1874 10.0208 14.5032 10.0208C18.7646 10.0208 20.2097 13.2174 20.2097 15.0193C20.2097 18.3975 17.9771 20.6143 15.1948 20.6143C11.7189 20.6143 9.71211 17.8407 9.71211 14.9774V2.89331C9.71411 1.29501 11.0113 0 12.6104 0C30.4375 0 34.8429 6.79429 34.8429 11.3358C34.8429 22.8771 21.485 32 12.7982 32C2.22465 32 0 22.1208 0 14.9514C0 6.82023 2.42653 4.68117 4.22144 4.44173Z" fill="#22B94F"/>
            </svg>
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
                  ? 'bg-[#10B981] text-white font-medium' 
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
              <div className="w-10 h-10 bg-[#10B981]/20 rounded-full flex items-center justify-center text-[#059669] font-bold">JD</div>
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
            <div className="w-10 h-10 bg-[#10B981]/20 rounded-full flex items-center justify-center text-[#059669] font-bold text-sm">JD</div>
            <button onClick={onLogout} className="text-gray-400 hover:text-white" title="Cerrar Sesión">
               <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
