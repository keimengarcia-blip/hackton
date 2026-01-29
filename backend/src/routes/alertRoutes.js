import { Router } from 'express';
import { updateManualStatus, updateAutoStatus, getStatus } from '../controllers/alertController.js';

const router = Router();

// POST: Enviar estado manual
router.post('/manual', updateManualStatus);

// POST: Trigger para consumir APIs externas (OpenWeather + VesselFinder logic)
router.post('/auto', updateAutoStatus);

// GET: Obtener estado actual
router.get('/', getStatus);

export default router;