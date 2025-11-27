import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createOrdenCompraSchema, createRecepcionSchema } from '../schemas';
import {
    getOrdenesCompra, createOrdenCompra,
    getRecepciones, createRecepcion
} from '../controllers/purchaseController';

const router = Router();

router.use(authenticateToken);

// Ordenes de Compra
router.get('/ordenes', getOrdenesCompra);
router.post('/ordenes', validateRequest(createOrdenCompraSchema), createOrdenCompra);

// Recepciones
router.get('/recepciones', getRecepciones);
router.post('/recepciones', validateRequest(createRecepcionSchema), createRecepcion);

export default router;
