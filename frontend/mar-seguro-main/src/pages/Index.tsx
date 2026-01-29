import React, { useState, useEffect, useCallback } from 'react';
import PescaSeguraApp, { type MaritimeStatusResponse } from '@/components/PescaSeguraApp';
import { AlertCircle, RefreshCw, Anchor, Waves } from 'lucide-react';

const Index = () => {
  const [clima, setClima] = useState<MaritimeStatusResponse | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);

  const fetchData = useCallback(async (isManual: boolean = false) => {
  if (isManual && isCooldown) return;

  setLoading(true);
  setError(null);

  try {
    // 1. Realizar la petición
    const response = await fetch('http://localhost:3000/api/alert/'); // Usa la URL que te dio el curl
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // 2. IMPORTANTE: Extraer el JSON de la respuesta
    const data: MaritimeStatusResponse = await response.json();
    
    // 3. Guardar los datos reales en el estado
    setClima(data);

    if (isManual) {
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 10000);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error de conexión');
    console.error("Error fetching data:", err);
  } finally {
    setLoading(false);
  }
}, [isCooldown]);

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-ocean flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Waves className="w-24 h-24 text-sand animate-wave" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Anchor className="w-16 h-16 text-sand animate-float" />
        </div>
        
        <div className="relative z-10">
          <div className="bg-danger/20 p-5 rounded-full mb-6 ring-4 ring-danger/10">
            <AlertCircle className="w-14 h-14 text-danger" />
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-3">SIN CONEXIÓN</h2>
          <p className="text-ocean-light/80 mb-6 max-w-xs">No pudimos conectar con el servidor. Verifica tu conexión a internet.</p>
          <button
            onClick={() => fetchData(true)}
            className="btn-primary flex items-center gap-3 mx-auto"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            REINTENTAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <PescaSeguraApp data={clima} />

      {!loading && (
        <button
          onClick={() => fetchData(true)}
          disabled={isCooldown}
          className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 
            p-4 md:p-5 lg:p-6 rounded-full shadow-card transition-all duration-500 z-50
            ${isCooldown
              ? 'bg-muted border-2 border-muted-foreground/20 opacity-50 cursor-not-allowed'
              : 'bg-white border-2 border-coral/20 active:rotate-180 hover:scale-110 hover:shadow-lg'
            }`}
          title={isCooldown ? "Espera unos segundos..." : "Refrescar clima"}
        >
          <RefreshCw className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${isCooldown ? 'text-muted-foreground' : 'text-coral'}`} />
          {isCooldown && (
            <span className="absolute -top-2 -right-2 bg-ocean-dark text-white text-[10px] md:text-xs px-2 py-1 rounded-full font-bold">
              Espera
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default Index;
