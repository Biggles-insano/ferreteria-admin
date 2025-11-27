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
exports.createRecepcion = exports.getRecepciones = exports.createOrdenCompra = exports.getOrdenesCompra = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- ORDENES DE COMPRA ---
const getOrdenesCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ordenes = yield prisma.ordenCompra.findMany({
            include: {
                proveedor: true,
                sucursal: true,
                detalles: true
            },
            orderBy: { fecha_orden: 'desc' }
        });
        res.json(ordenes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener órdenes de compra' });
    }
});
exports.getOrdenesCompra = getOrdenesCompra;
const createOrdenCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proveedor_id, sucursal_id, fecha_orden, estado, detalles } = req.body;
        const orden = yield prisma.ordenCompra.create({
            data: {
                proveedor_id: Number(proveedor_id),
                sucursal_id: Number(sucursal_id),
                fecha_orden: new Date(fecha_orden),
                estado,
                detalles: {
                    create: detalles.map((d) => ({
                        producto_id: Number(d.producto_id),
                        cantidad: Number(d.cantidad),
                        precio_unitario: Number(d.precio_unitario),
                        total: Number(d.total)
                    }))
                }
            },
            include: { detalles: true }
        });
        res.status(201).json(orden);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear orden de compra' });
    }
});
exports.createOrdenCompra = createOrdenCompra;
// --- RECEPCIONES DE COMPRA ---
const getRecepciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recepciones = yield prisma.recepcionCompra.findMany({
            include: {
                orden_compra: true,
                bodega: true,
                detalles: true
            },
            orderBy: { fecha_recepcion: 'desc' }
        });
        res.json(recepciones);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener recepciones' });
    }
});
exports.getRecepciones = getRecepciones;
const createRecepcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orden_compra_id, bodega_id, fecha_recepcion, estado, detalles } = req.body;
        const recepcion = yield prisma.recepcionCompra.create({
            data: {
                orden_compra_id: Number(orden_compra_id),
                bodega_id: Number(bodega_id),
                fecha_recepcion: new Date(fecha_recepcion),
                estado,
                detalles: {
                    create: detalles.map((d) => ({
                        producto_id: Number(d.producto_id),
                        orden_compra_detalle_id: d.orden_compra_detalle_id ? Number(d.orden_compra_detalle_id) : null,
                        cantidad_recibida: Number(d.cantidad_recibida),
                        costo_unitario: Number(d.costo_unitario),
                        total: Number(d.total)
                    }))
                }
            },
            include: { detalles: true }
        });
        res.status(201).json(recepcion);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear recepción' });
    }
});
exports.createRecepcion = createRecepcion;
