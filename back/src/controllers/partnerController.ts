import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- CLIENTES ---

export const getClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await prisma.cliente.findMany({
            where: { is_activo: true },
            include: {
                grupo_cliente: true,
                lista_precio: true,
                termino_pago: true
            },
            orderBy: { nombre: 'asc' }
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

export const createCliente = async (req: Request, res: Response) => {
    try {
        const {
            nombre, nit, email, telefono, direccion,
            grupo_cliente_id, lista_precio_id, termino_pago_id,
            exento_impuestos
        } = req.body;

        const cliente = await prisma.cliente.create({
            data: {
                nombre, nit, email, telefono, direccion,
                grupo_cliente_id: Number(grupo_cliente_id),
                lista_precio_id: Number(lista_precio_id),
                termino_pago_id: Number(termino_pago_id),
                exento_impuestos: Boolean(exento_impuestos)
            }
        });
        res.status(201).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
};

export const updateCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Convert IDs to numbers if present
        if (data.grupo_cliente_id) data.grupo_cliente_id = Number(data.grupo_cliente_id);
        if (data.lista_precio_id) data.lista_precio_id = Number(data.lista_precio_id);
        if (data.termino_pago_id) data.termino_pago_id = Number(data.termino_pago_id);

        const cliente = await prisma.cliente.update({
            where: { id: Number(id) },
            data
        });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
};

export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.cliente.update({
            where: { id: Number(id) },
            data: { is_activo: false }
        });
        res.json({ message: 'Cliente eliminado (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
};

// --- PROVEEDORES ---

export const getProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await prisma.proveedor.findMany({
            where: { is_activo: true },
            include: { termino_pago: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

export const createProveedor = async (req: Request, res: Response) => {
    try {
        const {
            nombre, nit, email, telefono, direccion,
            termino_pago_id
        } = req.body;

        const proveedor = await prisma.proveedor.create({
            data: {
                nombre, nit, email, telefono, direccion,
                termino_pago_id: Number(termino_pago_id)
            }
        });
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
};

export const updateProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.termino_pago_id) data.termino_pago_id = Number(data.termino_pago_id);

        const proveedor = await prisma.proveedor.update({
            where: { id: Number(id) },
            data
        });
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
};

export const deleteProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.proveedor.update({
            where: { id: Number(id) },
            data: { is_activo: false }
        });
        res.json({ message: 'Proveedor eliminado (soft delete)' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
};
