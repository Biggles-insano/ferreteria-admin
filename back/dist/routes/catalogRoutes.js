"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const schemas_1 = require("../schemas");
const catalogController_1 = require("../controllers/catalogController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken);
// Categorias
router.get('/categorias', catalogController_1.getCategorias);
router.post('/categorias', (0, validateRequest_1.validateRequest)(schemas_1.createCategoriaSchema), catalogController_1.createCategoria);
router.put('/categorias/:id', (0, validateRequest_1.validateRequest)(schemas_1.createCategoriaSchema), catalogController_1.updateCategoria);
router.delete('/categorias/:id', catalogController_1.deleteCategoria);
// Marcas
router.get('/marcas', catalogController_1.getMarcas);
router.post('/marcas', (0, validateRequest_1.validateRequest)(schemas_1.createMarcaSchema), catalogController_1.createMarca);
router.put('/marcas/:id', (0, validateRequest_1.validateRequest)(schemas_1.createMarcaSchema), catalogController_1.updateMarca);
router.delete('/marcas/:id', catalogController_1.deleteMarca);
// Unidades
router.get('/unidades', catalogController_1.getUnidades);
router.post('/unidades', (0, validateRequest_1.validateRequest)(schemas_1.createUnidadSchema), catalogController_1.createUnidad);
router.put('/unidades/:id', (0, validateRequest_1.validateRequest)(schemas_1.createUnidadSchema), catalogController_1.updateUnidad);
router.delete('/unidades/:id', catalogController_1.deleteUnidad);
exports.default = router;
