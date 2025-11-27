import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCategoriaSchema, createMarcaSchema, createUnidadSchema } from '../schemas';
import {
    getCategorias, createCategoria, updateCategoria, deleteCategoria,
    getMarcas, createMarca, updateMarca, deleteMarca,
    getUnidades, createUnidad, updateUnidad, deleteUnidad
} from '../controllers/catalogController';

const router = Router();

router.use(authenticateToken);

// Categorias
router.get('/categorias', getCategorias);
router.post('/categorias', validateRequest(createCategoriaSchema), createCategoria);
router.put('/categorias/:id', validateRequest(createCategoriaSchema), updateCategoria);
router.delete('/categorias/:id', deleteCategoria);

// Marcas
router.get('/marcas', getMarcas);
router.post('/marcas', validateRequest(createMarcaSchema), createMarca);
router.put('/marcas/:id', validateRequest(createMarcaSchema), updateMarca);
router.delete('/marcas/:id', deleteMarca);

// Unidades
router.get('/unidades', getUnidades);
router.post('/unidades', validateRequest(createUnidadSchema), createUnidad);
router.put('/unidades/:id', validateRequest(createUnidadSchema), updateUnidad);
router.delete('/unidades/:id', deleteUnidad);

export default router;
