import express from 'express';
import cors from 'cors';
import { createServer } from 'http'; // 1. IMPORTANTE: Necesario para Socket.io
import { Server } from 'socket.io';   // 2. IMPORTANTE: El servidor de Sockets
import { CONFIG } from './src/config.js';
import alertRoutes from './src/routes/alertRoutes.js';
import weatherService from './src/services/weatherService.js';
import { updateGlobalState, getCurrentStatusValue } from './src/controllers/alertController.js';

const app = express();
app.use(express.json());
app.use(cors());

// Rutas API
app.use('/api/alert', alertRoutes);

// 3. Crear el Servidor HTTP vinculado a Express
const httpServer = createServer(app);

// 4. Inicializar Socket.io con el servidor HTTP y CORS
const io = new Server(httpServer, {
  cors: {
    origin: ["https://hackton-olive.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST"]
  }
});

// --- LÓGICA DE AUTOMATIZACIÓN ---
const MINUTOS = 5;
const INTERVALO = MINUTOS * 60 * 1000;

// Pasamos 'io' como parámetro para que la función pueda emitir mensajes
const startMonitoring = (ioInstance) => {
    console.log(`📡 Monitor iniciado: Verificando cada ${MINUTOS} minutos...`);

    setInterval(async () => {
        try {
            const oldStatus = getCurrentStatusValue();
            console.log('🔄 Ejecutando análisis climático automático...');
            
            const newData = await weatherService.getMaritimeConditions();
            const newStatus = newData.status;

            updateGlobalState(newData);
            console.log(`✅ Estado actual: ${newStatus.toUpperCase()}`);

            if (newStatus !== oldStatus) {
                console.log(`⚠️ CAMBIO DETECTADO (${oldStatus} -> ${newStatus}). Emitiendo a sockets...`);

                // Usamos la instancia de io recibida
                ioInstance.emit('status-update', {
                    event: "MARITIME_STATUS_CHANGE",
                    previous_status: oldStatus,
                    current_status: newStatus,
                    description: newData.description,
                    timestamp: newData.timestamp,
                    data_source: newData.data_source
                });
            }
        } catch (error) {
            console.error('❌ Error en el monitor automático:', error.message);
        }
    }, INTERVALO);
};

// 5. Arrancar el servidor usando httpServer (NO app.listen)
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    // Ejecutamos el monitor al arrancar
    startMonitoring(io);
});