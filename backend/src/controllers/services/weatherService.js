import { CONFIG } from '../../config.js';

class WeatherService {
    
    // Función auxiliar para fetch con timeout
    async fetchWithTimeout(resource, options = {}) {
        const { timeout = 5000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    }

    async getMaritimeConditions() {
        try {
            // 1. Fetch a OpenWeatherMap
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.LOCATION.lat}&lon=${CONFIG.LOCATION.lon}&appid=${CONFIG.OPENWEATHER_KEY}&units=metric`;
            
            const weatherRes = await this.fetchWithTimeout(weatherUrl);
            if (!weatherRes.ok) throw new Error(`Weather API Error: ${weatherRes.status}`);
            const weatherData = await weatherRes.json();

            // 2. Fetch a VesselFinder (Simulado porque la API pública es limitada)
            // En un caso real, usarías la API de pago de VesselFinder o MarineTraffic
            let vesselCount = 0;
            try {
                // Simulación de fetch a VesselFinder
                // const vesselRes = await this.fetchWithTimeout('https://api.vesselfinder.com/vessels?zone=tierrabomba...');
                // const vesselData = await vesselRes.json();
                vesselCount = Math.floor(Math.random() * 8); // Simulamos entre 0 y 8 barcos
            } catch (err) {
                console.warn("No se pudo conectar con VesselFinder, asumiendo tráfico 0");
            }

            // 3. Procesamiento de Datos
            const windSpeedMs = weatherData.wind.speed;
            const windKnots = windSpeedMs * 1.94384; // Conversión m/s a nudos
            const visibilityKm = weatherData.visibility / 1000;
            const weatherCondition = weatherData.weather[0].main; // Rain, Clear, Clouds, Thunderstorm

            // 4. Determinar Estado (Lógica)
            let status = 'verde';
            let probability = 10;
            let description = 'Condiciones óptimas para navegación menor.';

            // Regla Roja: Viento >= 25 nudos O Visibilidad < 3km O Tormenta
            if (windKnots >= 25 || visibilityKm < 3 || weatherCondition === 'Thunderstorm') {
                status = 'rojo';
                probability = 80 + (windKnots - 25);
                description = `PELIGRO: Vientos fuertes (${windKnots.toFixed(1)} kn) o tormenta en curso.`;
            }
            // Regla Amarilla: Viento >= 15 nudos O Visibilidad < 8km O Tráfico alto
            else if (windKnots >= 15 || visibilityKm < 8 || vesselCount > 5) {
                status = 'amarillo';
                probability = 40 + (windKnots - 15);
                description = `PRECAUCIÓN: Mar picado o visibilidad reducida. Tráfico: ${vesselCount} buques.`;
            }

            // Limitar probabilidad a 100
            probability = Math.min(Math.round(probability), 100);

            return {
                status,
                description,
                probability,
                timestamp: new Date().toISOString(),
                data_source: {
                    wind_knots: parseFloat(windKnots.toFixed(2)),
                    visibility_km: visibilityKm,
                    vessel_traffic: vesselCount,
                    weather_condition: weatherCondition
                }
            };

        } catch (error) {
            console.error('Error en servicio:', error);
            throw error;
        }
    }
}

export default new WeatherService();