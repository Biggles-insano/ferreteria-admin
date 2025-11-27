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
exports.deleteProducto = exports.updateProducto = exports.createProducto = exports.getProductoById = exports.getProductos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield prisma.producto.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});
exports.getProductos = getProductos;
const getProductoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const producto = yield prisma.producto.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});
exports.getProductoById = getProductoById;
const createProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { codigo_producto, nombre, marca_id, categoria_id, unidad_id, impuesto_id, precio_base, stock_minimo, punto_reorden, descripcion, control_vencimiento } = req.body;
        // Validar duplicados de código
        const existing = yield prisma.producto.findUnique({
            where: { codigo_producto }
        });
        if (existing) {
            return res.status(400).json({ error: 'El código de producto ya existe' });
        }
        const producto = yield prisma.producto.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
});
exports.createProducto = createProducto;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { codigo_producto, nombre, marca_id, categoria_id, unidad_id, impuesto_id, precio_base, stock_minimo, punto_reorden, descripcion, control_vencimiento, is_activo } = req.body;
        const producto = yield prisma.producto.update({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});
exports.updateProducto = updateProducto;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.producto.update({
            where: { id: Number(id) },
            data: { is_activo: false }
        });
        res.json({ message: 'Producto eliminado (soft delete)' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});
exports.deleteProducto = deleteProducto;
