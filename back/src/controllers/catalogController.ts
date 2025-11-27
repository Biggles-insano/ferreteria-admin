import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- CATEGORIAS ---

export const getCategorias = async (req: Request, res: Response) => {
    try {
        const categorias = await prisma.categoria.findMany({
            where: { is_activa: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

export const createCategoria = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = await prisma.categoria.create({
            data: { nombre, descripcion }
        });
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

export const updateCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, is_activa } = req.body;
        const categoria = await prisma.categoria.update({
            where: { id: Number(id) },
            data: { nombre, descripcion, is_activa }
        });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

export const deleteCategoria = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Soft delete
        await prisma.categoria.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Categoría eliminada (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};

// --- MARCAS ---

export const getMarcas = async (req: Request, res: Response) => {
    try {
        const marcas = await prisma.marca.findMany({
            where: { is_activa: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(marcas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener marcas' });
    }
};

export const createMarca = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        const marca = await prisma.marca.create({
            data: { nombre }
        });
        res.status(201).json(marca);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear marca' });
    }
};

export const updateMarca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, is_activa } = req.body;
        const marca = await prisma.marca.update({
            where: { id: Number(id) },
            data: { nombre, is_activa }
        });
        res.json(marca);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar marca' });
    }
};

export const deleteMarca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.marca.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Marca eliminada (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar marca' });
    }
};

// --- UNIDADES ---

export const getUnidades = async (req: Request, res: Response) => {
    try {
        const unidades = await prisma.unidad.findMany({
            where: { is_activa: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(unidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener unidades' });
    }
};

export const createUnidad = async (req: Request, res: Response) => {
    try {
        const { nombre, simbolo, decimales } = req.body;
        const unidad = await prisma.unidad.create({
            data: { nombre, simbolo, decimales }
        });
        res.status(201).json(unidad);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear unidad' });
    }
};

export const updateUnidad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, simbolo, decimales, is_activa } = req.body;
        const unidad = await prisma.unidad.update({
            where: { id: Number(id) },
            data: { nombre, simbolo, decimales, is_activa }
        });
        res.json(unidad);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar unidad' });
    }
};

export const deleteUnidad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.unidad.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Unidad eliminada (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar unidad' });
    }
};
