"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../schemas");
const purchaseController_1 = require("../controllers/purchaseController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// Ordenes de Compra
router.get('/ordenes', purchaseController_1.getOrdenesCompra);
router.post('/ordenes', (0, validateRequest_1.validateRequest)(schemas_1.createOrdenCompraSchema), purchaseController_1.createOrdenCompra);
// Recepciones
router.get('/recepciones', purchaseController_1.getRecepciones);
router.post('/recepciones', (0, validateRequest_1.validateRequest)(schemas_1.createRecepcionSchema), purchaseController_1.createRecepcion);
exports.default = router;
