import weatherService from './services/weatherService.js';

// Persistencia en memoria (variable volátil)
let currentAlertState = {
    status: 'verde',
    description: 'Sistema inicializado',
    timestamp: new Date().toISOString(),
    probability: 0
};

// Esta función permite al monitor automático inyectar datos
export const updateGlobalState = (data) => {
    currentAlertState = { ...data, type: 'automatic_sync' };
};

export const updateManualStatus = (req, res) => {
    try {
        const { status, description, probability } = req.body;

        // Validaciones básicas
        const validStatuses = ['rojo', 'amarillo', 'verde'];
        if (!status || !validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ 
                error: 'Estado inválido. Valores permitidos: rojo, amarillo, verde' 
            });
        }

        // Actualizar estado
        currentAlertState = {
            status: status.toLowerCase(),
            description: description || 'Actualización manual',
            probability: probability || 100,
            timestamp: new Date().toISOString(),
            type: 'manual'
        };

        return res.status(200).json({
            message: 'Estado actualizado manualmente',
            data: currentAlertState
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateAutoStatus = async (req, res) => {
    try {
        // Llamar al servicio que usa fetch
        const climaticData = await weatherService.getMaritimeConditions();

        // Actualizar estado global
        currentAlertState = {
            ...climaticData,
            type: 'automatic'
        };

        return res.status(200).json({
            message: 'Análisis de Tierrabomba completado',
            data: currentAlertState
        });

    } catch (error) {
        return res.status(502).json({ 
            error: 'Error al conectar con servicios de clima', 
            details: error.message 
        });
    }
};

export const getStatus = (req, res) => {
    return res.status(200).json(currentAlertState);
};
export const getCurrentStatusValue = () => {
    return currentAlertState.status;
};