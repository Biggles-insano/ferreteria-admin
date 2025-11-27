import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- BODEGAS ---

export const getBodegas = async (req: Request, res: Response) => {
    try {
        const bodegas = await prisma.bodega.findMany({
            where: { is_activa: true },
            include: { sucursal: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(bodegas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener bodegas' });
    }
};

export const createBodega = async (req: Request, res: Response) => {
    try {
        const { sucursal_id, codigo, nombre, es_default } = req.body;
        const bodega = await prisma.bodega.create({
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre,
                es_default: Boolean(es_default)
            }
        });
        res.status(201).json(bodega);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear bodega' });
    }
};

export const updateBodega = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sucursal_id, codigo, nombre, es_default, is_activa } = req.body;
        const bodega = await prisma.bodega.update({
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
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar bodega' });
    }
};

export const deleteBodega = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.bodega.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Bodega eliminada (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar bodega' });
    }
};

// --- EXISTENCIAS ---

export const getExistencias = async (req: Request, res: Response) => {
    try {
        const { bodega_id, producto_id } = req.query;

        const where: any = {};
        if (bodega_id) where.bodega_id = Number(bodega_id);
        if (producto_id) where.producto_id = Number(producto_id);

        const existencias = await prisma.existencia.findMany({
            where,
            include: {
                producto: true,
                bodega: true
            }
        });
        res.json(existencias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener existencias' });
    }
};
