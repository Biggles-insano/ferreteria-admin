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
exports.deleteProveedor = exports.updateProveedor = exports.createProveedor = exports.getProveedores = exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClientes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- CLIENTES ---
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield prisma.cliente.findMany({
            where: { is_activo: true },
            include: {
                grupo_cliente: true,
                lista_precio: true,
                termino_pago: true
            },
            orderBy: { nombre: 'asc' }
        });
        res.json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});
exports.getClientes = getClientes;
const createCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, nit, email, telefono, direccion, grupo_cliente_id, lista_precio_id, termino_pago_id, exento_impuestos } = req.body;
        const cliente = yield prisma.cliente.create({
            data: {
                nombre, nit, email, telefono, direccion,
                grupo_cliente_id: Number(grupo_cliente_id),
                lista_precio_id: Number(lista_precio_id),
                termino_pago_id: Number(termino_pago_id),
                exento_impuestos: Boolean(exento_impuestos)
            }
        });
        res.status(201).json(cliente);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
});
exports.createCliente = createCliente;
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        // Convert IDs to numbers if present
        if (data.grupo_cliente_id)
            data.grupo_cliente_id = Number(data.grupo_cliente_id);
        if (data.lista_precio_id)
            data.lista_precio_id = Number(data.lista_precio_id);
        if (data.termino_pago_id)
            data.termino_pago_id = Number(data.termino_pago_id);
        const cliente = yield prisma.cliente.update({
            where: { id: Number(id) },
            data
        });
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
});
exports.updateCliente = updateCliente;
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.cliente.update({
            where: { id: Number(id) },
            data: { is_activo: false }
        });
        res.json({ message: 'Cliente eliminado (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
});
exports.deleteCliente = deleteCliente;
// --- PROVEEDORES ---
const getProveedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveedores = yield prisma.proveedor.findMany({
            where: { is_activo: true },
            include: { termino_pago: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(proveedores);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
});
exports.getProveedores = getProveedores;
const createProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, nit, email, telefono, direccion, termino_pago_id } = req.body;
        const proveedor = yield prisma.proveedor.create({
            data: {
                nombre, nit, email, telefono, direccion,
                termino_pago_id: Number(termino_pago_id)
            }
        });
        res.status(201).json(proveedor);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
});
exports.createProveedor = createProveedor;
const updateProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.termino_pago_id)
            data.termino_pago_id = Number(data.termino_pago_id);
        const proveedor = yield prisma.proveedor.update({
            where: { id: Number(id) },
            data
        });
        res.json(proveedor);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
});
exports.updateProveedor = updateProveedor;
const deleteProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.proveedor.update({
            where: { id: Number(id) },
            data: { is_activo: false }
        });
        res.json({ message: 'Proveedor eliminado (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
});
exports.deleteProveedor = deleteProveedor;
