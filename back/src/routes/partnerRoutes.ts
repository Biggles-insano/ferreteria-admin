import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createClienteSchema, createProveedorSchema } from '../schemas';
import {
    getClientes, createCliente, updateCliente, deleteCliente,
    getProveedores, createProveedor, updateProveedor, deleteProveedor
} from '../controllers/partnerController';

const router = Router();

router.use(authenticateToken);

// Clientes
router.get('/clientes', getClientes);
router.post('/clientes', validateRequest(createClienteSchema), createCliente);
router.put('/clientes/:id', validateRequest(createClienteSchema), updateCliente);
router.delete('/clientes/:id', deleteCliente);

// Proveedores
router.get('/proveedores', getProveedores);
router.post('/proveedores', validateRequest(createProveedorSchema), createProveedor);
router.put('/proveedores/:id', validateRequest(createProveedorSchema), updateProveedor);
router.delete('/proveedores/:id', deleteProveedor);

export default router;
