import express from 'express';
import cors from 'cors'
import { CONFIG } from './src/config.js';
import alertRoutes from './src/routes/alertRoutes.js';
import weatherService from './src/services/weatherService.js';
import { updateGlobalState, getCurrentStatusValue } from './src/controllers/alertController.js';

const app = express();
app.use(express.json());
app.use('/api/alert', alertRoutes);

// --- LÓGICA DE AUTOMATIZACIÓN ---
const MINUTOS = 5;
const INTERVALO = MINUTOS * 60 * 1000;

const startMonitoring = () => {
    console.log(`📡 Monitor iniciado: Verificando Tierrabomba cada ${MINUTOS} minutos...`);

    setInterval(async () => {
        try {
            // 1. Guardamos el estado anterior para comparar
            const oldStatus = getCurrentStatusValue();

            console.log('🔄 Ejecutando análisis climático automático...');
            const newData = await weatherService.getMaritimeConditions();
            const newStatus = newData.status;

            // 2. Actualizamos el estado global en el controlador
            updateGlobalState(newData);
            console.log(`✅ Estado actual: ${newStatus.toUpperCase()}`);

            // 3. Verificamos si hubo un cambio para disparar el Webhook
            if (newStatus !== oldStatus) {
                console.log(`⚠️ CAMBIO DETECTADO (${oldStatus} -> ${newStatus}). Notificando externo...`);

                // Fetch al servicio externo (Webhook)
                fetch('https://api.del-externo.com/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: "MARITIME_STATUS_CHANGE",
                        previous_status: oldStatus,
                        current_status: newStatus,
                        description: newData.description,
                        timestamp: newData.timestamp
                    })
                }).catch(err => console.error("⚠️ No se pudo contactar al externo:", err.message));
            }

        } catch (error) {
            console.error('❌ Error en el monitor automático:', error.message);
        }
    }, INTERVALO);
};

app.listen(CONFIG.PORT, () => {
    console.log(`🚀 Servidor en puerto ${CONFIG.PORT}`);
    // Ejecutamos una vez al arrancar para no esperar los primeros 5 min
    startMonitoring();
});