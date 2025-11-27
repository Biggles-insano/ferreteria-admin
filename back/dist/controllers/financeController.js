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
exports.deleteCaja = exports.updateCaja = exports.createCaja = exports.getCajas = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- CAJAS ---
const getCajas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cajas = yield prisma.caja.findMany({
            where: { is_activa: true },
            include: { sucursal: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(cajas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener cajas' });
    }
});
exports.getCajas = getCajas;
const createCaja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sucursal_id, codigo, nombre } = req.body;
        const caja = yield prisma.caja.create({
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre
            }
        });
        res.status(201).json(caja);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear caja' });
    }
});
exports.createCaja = createCaja;
const updateCaja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { sucursal_id, codigo, nombre, is_activa } = req.body;
        const caja = yield prisma.caja.update({
            where: { id: Number(id) },
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre,
                is_activa: is_activa !== undefined ? Boolean(is_activa) : undefined
            }
        });
        res.json(caja);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar caja' });
    }
});
exports.updateCaja = updateCaja;
const deleteCaja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.caja.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Caja eliminada (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar caja' });
    }
});
exports.deleteCaja = deleteCaja;
