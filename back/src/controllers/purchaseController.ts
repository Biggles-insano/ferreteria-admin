import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- ORDENES DE COMPRA ---

export const getOrdenesCompra = async (req: Request, res: Response) => {
    try {
        const ordenes = await prisma.ordenCompra.findMany({
            include: {
                proveedor: true,
                sucursal: true,
                detalles: true
            },
            orderBy: { fecha_orden: 'desc' }
        });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener órdenes de compra' });
    }
};

export const createOrdenCompra = async (req: Request, res: Response) => {
    try {
        const { proveedor_id, sucursal_id, fecha_orden, estado, detalles } = req.body;

        const orden = await prisma.ordenCompra.create({
            data: {
                proveedor_id: Number(proveedor_id),
                sucursal_id: Number(sucursal_id),
                fecha_orden: new Date(fecha_orden),
                estado,
                detalles: {
                    create: detalles.map((d: any) => ({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear orden de compra' });
    }
};

// --- RECEPCIONES DE COMPRA ---

export const getRecepciones = async (req: Request, res: Response) => {
    try {
        const recepciones = await prisma.recepcionCompra.findMany({
            include: {
                orden_compra: true,
                bodega: true,
                detalles: true
            },
            orderBy: { fecha_recepcion: 'desc' }
        });
        res.json(recepciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recepciones' });
    }
};

export const createRecepcion = async (req: Request, res: Response) => {
    try {
        const { orden_compra_id, bodega_id, fecha_recepcion, estado, detalles } = req.body;

        const recepcion = await prisma.recepcionCompra.create({
            data: {
                orden_compra_id: Number(orden_compra_id),
                bodega_id: Number(bodega_id),
                fecha_recepcion: new Date(fecha_recepcion),
                estado,
                detalles: {
                    create: detalles.map((d: any) => ({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear recepción' });
    }
};
