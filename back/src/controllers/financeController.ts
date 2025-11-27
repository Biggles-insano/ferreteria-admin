import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- CAJAS ---

export const getCajas = async (req: Request, res: Response) => {
    try {
        const cajas = await prisma.caja.findMany({
            where: { is_activa: true },
            include: { sucursal: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(cajas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener cajas' });
    }
};

export const createCaja = async (req: Request, res: Response) => {
    try {
        const { sucursal_id, codigo, nombre } = req.body;
        const caja = await prisma.caja.create({
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre
            }
        });
        res.status(201).json(caja);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear caja' });
    }
};

export const updateCaja = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sucursal_id, codigo, nombre, is_activa } = req.body;
        const caja = await prisma.caja.update({
            where: { id: Number(id) },
            data: {
                sucursal_id: Number(sucursal_id),
                codigo,
                nombre,
                is_activa: is_activa !== undefined ? Boolean(is_activa) : undefined
            }
        });
        res.json(caja);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar caja' });
    }
};

export const deleteCaja = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.caja.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Caja eliminada (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar caja' });
    }
};
