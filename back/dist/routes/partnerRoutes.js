"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../schemas");
const partnerController_1 = require("../controllers/partnerController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// Clientes
router.get('/clientes', partnerController_1.getClientes);
router.post('/clientes', (0, validateRequest_1.validateRequest)(schemas_1.createClienteSchema), partnerController_1.createCliente);
router.put('/clientes/:id', (0, validateRequest_1.validateRequest)(schemas_1.createClienteSchema), partnerController_1.updateCliente);
router.delete('/clientes/:id', partnerController_1.deleteCliente);
// Proveedores
router.get('/proveedores', partnerController_1.getProveedores);
router.post('/proveedores', (0, validateRequest_1.validateRequest)(schemas_1.createProveedorSchema), partnerController_1.createProveedor);
router.put('/proveedores/:id', (0, validateRequest_1.validateRequest)(schemas_1.createProveedorSchema), partnerController_1.updateProveedor);
router.delete('/proveedores/:id', partnerController_1.deleteProveedor);
exports.default = router;
