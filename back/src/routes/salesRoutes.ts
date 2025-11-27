import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createPedidoSchema, createFacturaSchema } from '../schemas';
import {
    getPedidos, createPedido,
    getFacturas, createFactura
} from '../controllers/salesController';

const router = Router();

router.use(authenticateToken);

// Pedidos
router.get('/pedidos', getPedidos);
router.post('/pedidos', validateRequest(createPedidoSchema), createPedido);

// Facturas
router.get('/facturas', getFacturas);
router.post('/facturas', validateRequest(createFacturaSchema), createFactura);

export default router;
