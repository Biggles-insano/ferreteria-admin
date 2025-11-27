import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createProductoSchema, updateProductoSchema } from '../schemas';
import {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} from '../controllers/productController';

const router = Router();

router.use(authenticateToken);

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', validateRequest(createProductoSchema), createProducto);
router.put('/:id', validateRequest(updateProductoSchema), updateProducto);
router.delete('/:id', deleteProducto);

export default router;
