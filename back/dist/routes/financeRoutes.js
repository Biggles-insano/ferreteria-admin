"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../schemas");
const financeController_1 = require("../controllers/financeController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// Cajas
router.get('/cajas', financeController_1.getCajas);
router.post('/cajas', (0, validateRequest_1.validateRequest)(schemas_1.createCajaSchema), financeController_1.createCaja);
router.put('/cajas/:id', (0, validateRequest_1.validateRequest)(schemas_1.createCajaSchema), financeController_1.updateCaja);
router.delete('/cajas/:id', financeController_1.deleteCaja);
exports.default = router;
