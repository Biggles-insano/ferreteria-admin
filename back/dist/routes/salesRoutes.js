"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../schemas");
const salesController_1 = require("../controllers/salesController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// Pedidos
router.get('/pedidos', salesController_1.getPedidos);
router.post('/pedidos', (0, validateRequest_1.validateRequest)(schemas_1.createPedidoSchema), salesController_1.createPedido);
// Facturas
router.get('/facturas', salesController_1.getFacturas);
router.post('/facturas', (0, validateRequest_1.validateRequest)(schemas_1.createFacturaSchema), salesController_1.createFactura);
exports.default = router;
