import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4 text-[#1a1a1a]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <svg viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M4.22144 4.44173C4.40933 4.41778 4.57522 4.55946 4.57522 4.74902V10.1984C4.57522 16.003 4.86905 25.8203 14.9629 25.8203C21.1812 25.8203 25.3606 20.8478 25.3606 15.0193C25.3606 9.19075 20.3337 4.86076 14.0755 4.86076C13.3079 4.86076 12.6863 5.48132 12.6863 6.24755V10.0248C12.6863 10.0248 14.1874 10.0208 14.5032 10.0208C18.7646 10.0208 20.2097 13.2174 20.2097 15.0193C20.2097 18.3975 17.9771 20.6143 15.1948 20.6143C11.7189 20.6143 9.71211 17.8407 9.71211 14.9774V2.89331C9.71411 1.29501 11.0113 0 12.6104 0C30.4375 0 34.8429 6.79429 34.8429 11.3358C34.8429 22.8771 21.485 32 12.7982 32C2.22465 32 0 22.1208 0 14.9514C0 6.82023 2.42653 4.68117 4.22144 4.44173Z" fill="#22B94F"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AllpaOps</h1>
          <p className="text-gray-500 text-sm mt-1 text-center font-medium">
            Orquestación Operativa Agrícola
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar con Google
              </>
            )}
          </button>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {!isLoading && (
              <>
                <svg className="w-5 h-5" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"/>
                  <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                  <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
                Continuar con Microsoft
              </>
            )}
            {isLoading && <span className="text-transparent">Cargando</span>}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
            Acceso restringido a personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
