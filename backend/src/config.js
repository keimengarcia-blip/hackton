import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3000,
    OPENWEATHER_KEY: process.env.OPENWEATHER_API_KEY,
    // Coordenadas frente a Tierrabomba (Punta Arena)
    LOCATION: {
        lat: 10.3486,
        lon: -75.5756
    }
};