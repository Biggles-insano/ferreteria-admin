import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createBodegaSchema } from '../schemas';
import {
    getBodegas, createBodega, updateBodega, deleteBodega,
    getExistencias
} from '../controllers/inventoryController';

const router = Router();

router.use(authenticateToken);

// Bodegas
router.get('/bodegas', getBodegas);
router.post('/bodegas', validateRequest(createBodegaSchema), createBodega);
router.put('/bodegas/:id', validateRequest(createBodegaSchema), updateBodega);
router.delete('/bodegas/:id', deleteBodega);

// Existencias
router.get('/existencias', getExistencias);

export default router;
