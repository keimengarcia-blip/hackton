import React from 'react';
import { Wind, Eye, CheckCircle2, AlertTriangle, XCircle, Navigation, Clock, Loader2, Waves, Anchor, Fish, Compass } from 'lucide-react';

export interface MaritimeStatusResponse {
  status: 'verde' | 'amarillo' | 'rojo';
  description: string;
  probability: number;
  data_source: {
    wind_knots: number;
    visibility_km: number;
    weather_condition: string;
  };
  timestamp: string;
}

const PescaSeguraApp: React.FC<{ data?: MaritimeStatusResponse }> = ({ data }) => {
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-ocean flex flex-col items-center justify-center p-10 text-center">
        <div className="relative">
          <Waves className="w-16 h-16 md:w-20 md:h-20 text-ocean-light animate-wave mb-4" />
          <Anchor className="w-8 h-8 md:w-10 md:h-10 text-sand absolute -bottom-2 -right-2 animate-float" />
        </div>
        <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-sand animate-spin mb-4" />
        <h2 className="text-xl md:text-2xl font-display font-bold text-white">Consultando al mar...</h2>
        <p className="text-ocean-light/80 md:text-lg">Estamos revisando las condiciones en Tierrabomba.</p>
      </div>
    );
  }

  const statusConfig = {
    verde: { 
      bg: 'bg-gradient-safe', 
      ring: 'ring-safe/30',
      icon: CheckCircle2, 
      label: 'MAR SEGURO',
      sublabel: '¡Buen día para pescar!'
    },
    amarillo: { 
      bg: 'bg-gradient-caution', 
      ring: 'ring-caution/30',
      icon: AlertTriangle, 
      label: 'PRECAUCIÓN',
      sublabel: 'Mantente alerta'
    },
    rojo: { 
      bg: 'bg-gradient-danger', 
      ring: 'ring-danger/30',
      icon: XCircle, 
      label: 'PELIGRO',
      sublabel: 'No salgas a pescar'
    }
  };

  const current = statusConfig[data.status];
  const StatusIcon = current.icon;
  const time = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gradient-ocean flex flex-col font-sans relative overflow-hidden">
      {/* Decorative wave background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="currentColor" 
            className="text-sand"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,208C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        {/* Extra decorative elements for larger screens */}
        <Fish className="hidden lg:block absolute top-32 right-20 w-16 h-16 text-sand animate-float opacity-50" />
        <Compass className="hidden lg:block absolute bottom-40 left-16 w-12 h-12 text-sand animate-wave opacity-40" />
      </div>

      <header className="relative bg-white/10 backdrop-blur-md p-5 md:p-6 lg:p-8 flex justify-between items-center border-b border-white/10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-white flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-coral rounded-xl shadow-lg">
                <Anchor className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              TIERRABOMBA
            </h1>
            <p className="text-ocean-light/80 text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" /> Actualizado: {time}
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Waves className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-ocean-light animate-wave" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Responsive grid: stack on mobile, side-by-side on tablet+ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            
            {/* Main Status Card */}
            <div className={`${current.bg} rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 lg:p-12 text-white shadow-card ring-4 ${current.ring} flex flex-col items-center justify-center text-center transition-all duration-500 relative overflow-hidden lg:min-h-[400px]`}>
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-20 h-20 md:w-28 md:h-28 bg-white/5 rounded-full" />
              
              <div className="relative">
                <StatusIcon size={120} className="mb-4 drop-shadow-lg animate-float md:w-36 md:h-36 lg:w-40 lg:h-40" strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-1 leading-none tracking-tight">{current.label}</h2>
              <p className="text-sm md:text-base lg:text-lg font-medium opacity-80 mb-3">{current.sublabel}</p>
              <p className="text-lg md:text-xl font-medium opacity-90 leading-tight max-w-md">{data.description}</p>
            </div>

            {/* Right side content for larger screens */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="card-island group hover:scale-[1.02] transition-transform md:p-6 lg:p-8">
                  <div className="p-3 md:p-4 bg-ocean/10 rounded-xl mb-2 md:mb-3 group-hover:bg-ocean/20 transition-colors">
                    <Wind className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-ocean" />
                  </div>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-foreground">{data.data_source.wind_knots}</span>
                  <span className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider">Nudos Viento</span>
                </div>

                <div className="card-island group hover:scale-[1.02] transition-transform md:p-6 lg:p-8">
                  <div className="p-3 md:p-4 bg-coral/10 rounded-xl mb-2 md:mb-3 group-hover:bg-coral/20 transition-colors">
                    <Eye className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-coral" />
                  </div>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-foreground">{data.data_source.visibility_km}<span className="text-lg md:text-xl">km</span></span>
                  <span className="text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-wider">Visibilidad</span>
                </div>
              </div>

              {/* Weather condition badge */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-soft border border-sand/20 flex items-center gap-3 md:gap-4 flex-1">
                <div className="p-2 md:p-3 bg-gradient-to-br from-ocean to-ocean-dark rounded-xl md:rounded-2xl">
                  <Navigation className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-wider">Condición Actual</p>
                  <p className="font-display font-bold text-foreground text-lg md:text-xl lg:text-2xl">{data.data_source.weather_condition}</p>
                </div>
              </div>

              {/* Probability indicator - only on larger screens */}
              <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-soft border border-sand/20 items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">Confianza del Pronóstico</p>
                  <div className="h-3 bg-sand/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-ocean to-coral rounded-full transition-all duration-500"
                      style={{ width: `${data.probability}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl md:text-3xl font-display font-black text-foreground">{data.probability}%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer wave decoration */}
      <footer className="relative h-16 md:h-20 bg-gradient-to-t from-sand/20 to-transparent">
        <p className="text-center text-ocean-light/60 text-xs md:text-sm font-medium pt-4 md:pt-6">
          🎣 Pesca Segura • Isla Colombiana
        </p>
      </footer>
    </div>
  );
};

export default PescaSeguraApp;
