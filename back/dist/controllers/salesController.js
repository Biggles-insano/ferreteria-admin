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
exports.createFactura = exports.getFacturas = exports.createPedido = exports.getPedidos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- PEDIDOS DE VENTA ---
const getPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pedidos = yield prisma.pedidoVenta.findMany({
            include: {
                cliente: true,
                vendedor: true,
                detalles: true
            },
            orderBy: { fecha_pedido: 'desc' }
        });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});
exports.getPedidos = getPedidos;
const createPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cliente_id, vendedor_id, fecha_pedido, monto_total, estado, detalles } = req.body;
        const pedido = yield prisma.pedidoVenta.create({
            data: {
                cliente_id: Number(cliente_id),
                vendedor_id: Number(vendedor_id),
                fecha_pedido: new Date(fecha_pedido),
                monto_total: Number(monto_total),
                estado,
                detalles: {
                    create: detalles.map((d) => ({
                        producto_id: Number(d.producto_id),
                        cantidad: Number(d.cantidad),
                        precio_unitario: Number(d.precio_unitario),
                        descuento: Number(d.descuento || 0),
                        total: Number(d.total)
                    }))
                }
            },
            include: { detalles: true }
        });
        res.status(201).json(pedido);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear pedido' });
    }
});
exports.createPedido = createPedido;
// --- FACTURAS DE VENTA ---
const getFacturas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturas = yield prisma.facturaVenta.findMany({
            include: {
                cliente: true,
                vendedor: true,
                detalles: true
            },
            orderBy: { fecha_factura: 'desc' }
        });
        res.json(facturas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener facturas' });
    }
});
exports.getFacturas = getFacturas;
const createFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cliente_id, sucursal_id, vendedor_id, fecha_factura, moneda_id, serie_folio_id, serie, folio, monto_total, estado, metodo_pago_id, detalles } = req.body;
        const factura = yield prisma.facturaVenta.create({
            data: {
                cliente_id: Number(cliente_id),
                sucursal_id: Number(sucursal_id),
                vendedor_id: Number(vendedor_id),
                fecha_factura: new Date(fecha_factura),
                moneda_id: Number(moneda_id),
                serie_folio_id: Number(serie_folio_id),
                serie,
                folio: Number(folio),
                monto_total: Number(monto_total),
                estado,
                metodo_pago_id: Number(metodo_pago_id),
                detalles: {
                    create: detalles.map((d) => ({
                        producto_id: Number(d.producto_id),
                        bodega_id: Number(d.bodega_id),
                        cantidad: Number(d.cantidad),
                        precio_unitario: Number(d.precio_unitario),
                        descuento: Number(d.descuento || 0),
                        total: Number(d.total)
                    }))
                }
            },
            include: { detalles: true }
        });
        res.status(201).json(factura);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear factura' });
    }
});
exports.createFactura = createFactura;
