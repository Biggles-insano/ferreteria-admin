import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductos = async (req: Request, res: Response) => {
    try {
        const productos = await prisma.producto.findMany({
            where: { is_activo: true },
            include: {
                marca: true,
                categoria: true,
                unidad: true,
                impuesto: true
            },
            orderBy: { nombre: 'asc' }
        });
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

export const getProductoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const producto = await prisma.producto.findUnique({
            where: { id: Number(id) },
            include: {
                marca: true,
                categoria: true,
                unidad: true,
                impuesto: true
            }
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

export const createProducto = async (req: Request, res: Response) => {
    try {
        const {
            codigo_producto,
            nombre,
            marca_id,
            categoria_id,
            unidad_id,
            impuesto_id,
            precio_base,
            stock_minimo,
            punto_reorden,
            descripcion,
            control_vencimiento
        } = req.body;

        // Validar duplicados de código
        const existing = await prisma.producto.findUnique({
            where: { codigo_producto }
        });

        if (existing) {
            return res.status(400).json({ error: 'El código de producto ya existe' });
        }

        const producto = await prisma.producto.create({
            data: {
                codigo_producto,
                nombre,
                marca_id: Number(marca_id),
                categoria_id: Number(categoria_id),
                unidad_id: Number(unidad_id),
                impuesto_id: Number(impuesto_id),
                precio_base: Number(precio_base),
                stock_minimo: Number(stock_minimo || 0),
                punto_reorden: Number(punto_reorden || 0),
                descripcion,
                control_vencimiento: Boolean(control_vencimiento)
            }
        });

        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

export const updateProducto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            codigo_producto,
            nombre,
            marca_id,
            categoria_id,
            unidad_id,
            impuesto_id,
            precio_base,
            stock_minimo,
            punto_reorden,
            descripcion,
            control_vencimiento,
            is_activo
        } = req.body;

        const producto = await prisma.producto.update({
            where: { id: Number(id) },
            data: {
                codigo_producto,
                nombre,
                marca_id: Number(marca_id),
                categoria_id: Number(categoria_id),
                unidad_id: Number(unidad_id),
                impuesto_id: Number(impuesto_id),
                precio_base: Number(precio_base),
                stock_minimo: Number(stock_minimo),
                punto_reorden: Number(punto_reorden),
                descripcion,
                control_vencimiento: Boolean(control_vencimiento),
                is_activo: is_activo !== undefined ? Boolean(is_activo) : undefined
            }
        });

        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

export const deleteProducto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.producto.update({
            where: { id: Number(id) },
            data: { is_activo: false }
        });
        res.json({ message: 'Producto eliminado (soft delete)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
