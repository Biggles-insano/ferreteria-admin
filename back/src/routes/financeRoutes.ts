import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCajaSchema } from '../schemas';
import {
    getCajas, createCaja, updateCaja, deleteCaja
} from '../controllers/financeController';

const router = Router();

router.use(authenticateToken);

// Cajas
router.get('/cajas', getCajas);
router.post('/cajas', validateRequest(createCajaSchema), createCaja);
router.put('/cajas/:id', validateRequest(createCajaSchema), updateCaja);
router.delete('/cajas/:id', deleteCaja);

export default router;
