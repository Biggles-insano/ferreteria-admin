"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../schemas");
const inventoryController_1 = require("../controllers/inventoryController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// Bodegas
router.get('/bodegas', inventoryController_1.getBodegas);
router.post('/bodegas', (0, validateRequest_1.validateRequest)(schemas_1.createBodegaSchema), inventoryController_1.createBodega);
router.put('/bodegas/:id', (0, validateRequest_1.validateRequest)(schemas_1.createBodegaSchema), inventoryController_1.updateBodega);
router.delete('/bodegas/:id', inventoryController_1.deleteBodega);
// Existencias
router.get('/existencias', inventoryController_1.getExistencias);
exports.default = router;
