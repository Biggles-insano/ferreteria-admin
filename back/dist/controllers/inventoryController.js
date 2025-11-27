"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExistencias = exports.deleteBodega = exports.updateBodega = exports.createBodega = exports.getBodegas = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- BODEGAS ---
const getBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodegas = yield prisma.bodega.findMany({
            where: { is_activa: true },
            include: { sucursal: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(bodegas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener bodegas' });
    }
});
exports.getBodegas = getBodegas;
const createBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sucursal_id, codigo, nombre, es_default } = req.body;
        const bodega = yield prisma.bodega.create({
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre,
                es_default: Boolean(es_default)
            }
        });
        res.status(201).json(bodega);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear bodega' });
    }
});
exports.createBodega = createBodega;
const updateBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { sucursal_id, codigo, nombre, es_default, is_activa } = req.body;
        const bodega = yield prisma.bodega.update({
            where: { id: Number(id) },
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre,
                es_default: Boolean(es_default),
                is_activa: is_activa !== undefined ? Boolean(is_activa) : undefined
            }
        });
        res.json(bodega);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar bodega' });
    }
});
exports.updateBodega = updateBodega;
const deleteBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.bodega.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Bodega eliminada (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar bodega' });
    }
});
exports.deleteBodega = deleteBodega;
// --- EXISTENCIAS ---
const getExistencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bodega_id, producto_id } = req.query;
        const where = {};
        if (bodega_id)
            where.bodega_id = Number(bodega_id);
        if (producto_id)
            where.producto_id = Number(producto_id);
        const existencias = yield prisma.existencia.findMany({
            where,
            include: {
                producto: true,
                bodega: true
            }
        });
        res.json(existencias);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener existencias' });
    }
});
exports.getExistencias = getExistencias;
