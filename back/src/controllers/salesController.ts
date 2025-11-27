import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- PEDIDOS DE VENTA ---

export const getPedidos = async (req: Request, res: Response) => {
    try {
        const pedidos = await prisma.pedidoVenta.findMany({
            include: {
                cliente: true,
                vendedor: true,
                detalles: true
            },
            orderBy: { fecha_pedido: 'desc' }
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

export const createPedido = async (req: Request, res: Response) => {
    try {
        const { cliente_id, vendedor_id, fecha_pedido, monto_total, estado, detalles } = req.body;

        const pedido = await prisma.pedidoVenta.create({
            data: {
                cliente_id: Number(cliente_id),
                vendedor_id: Number(vendedor_id),
                fecha_pedido: new Date(fecha_pedido),
                monto_total: Number(monto_total),
                estado,
                detalles: {
                    create: detalles.map((d: any) => ({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear pedido' });
    }
};

// --- FACTURAS DE VENTA ---

export const getFacturas = async (req: Request, res: Response) => {
    try {
        const facturas = await prisma.facturaVenta.findMany({
            include: {
                cliente: true,
                vendedor: true,
                detalles: true
            },
            orderBy: { fecha_factura: 'desc' }
        });
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener facturas' });
    }
};

export const createFactura = async (req: Request, res: Response) => {
    try {
        const {
            cliente_id, sucursal_id, vendedor_id, fecha_factura,
            moneda_id, serie_folio_id, serie, folio,
            monto_total, estado, metodo_pago_id, detalles
        } = req.body;

        const factura = await prisma.facturaVenta.create({
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
                    create: detalles.map((d: any) => ({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear factura' });
    }
};
