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
exports.deleteUnidad = exports.updateUnidad = exports.createUnidad = exports.getUnidades = exports.deleteMarca = exports.updateMarca = exports.createMarca = exports.getMarcas = exports.deleteCategoria = exports.updateCategoria = exports.createCategoria = exports.getCategorias = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- CATEGORIAS ---
const getCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield prisma.categoria.findMany({
            where: { is_activa: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(categorias);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});
exports.getCategorias = getCategorias;
const createCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion } = req.body;
        const categoria = yield prisma.categoria.create({
            data: { nombre, descripcion }
        });
        res.status(201).json(categoria);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear categoría' });
    }
});
exports.createCategoria = createCategoria;
const updateCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, descripcion, is_activa } = req.body;
        const categoria = yield prisma.categoria.update({
            where: { id: Number(id) },
            data: { nombre, descripcion, is_activa }
        });
        res.json(categoria);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
});
exports.updateCategoria = updateCategoria;
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Soft delete
        yield prisma.categoria.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Categoría eliminada (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
});
exports.deleteCategoria = deleteCategoria;
// --- MARCAS ---
const getMarcas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const marcas = yield prisma.marca.findMany({
            where: { is_activa: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(marcas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener marcas' });
    }
});
exports.getMarcas = getMarcas;
const createMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const marca = yield prisma.marca.create({
            data: { nombre }
        });
        res.status(201).json(marca);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear marca' });
    }
});
exports.createMarca = createMarca;
const updateMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, is_activa } = req.body;
        const marca = yield prisma.marca.update({
            where: { id: Number(id) },
            data: { nombre, is_activa }
        });
        res.json(marca);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar marca' });
    }
});
exports.updateMarca = updateMarca;
const deleteMarca = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.marca.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Marca eliminada (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar marca' });
    }
});
exports.deleteMarca = deleteMarca;
// --- UNIDADES ---
const getUnidades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unidades = yield prisma.unidad.findMany({
            where: { is_activa: true },
            orderBy: { nombre: 'asc' }
        });
        res.json(unidades);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener unidades' });
    }
});
exports.getUnidades = getUnidades;
const createUnidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, simbolo, decimales } = req.body;
        const unidad = yield prisma.unidad.create({
            data: { nombre, simbolo, decimales }
        });
        res.status(201).json(unidad);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear unidad' });
    }
});
exports.createUnidad = createUnidad;
const updateUnidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, simbolo, decimales, is_activa } = req.body;
        const unidad = yield prisma.unidad.update({
            where: { id: Number(id) },
            data: { nombre, simbolo, decimales, is_activa }
        });
        res.json(unidad);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar unidad' });
    }
});
exports.updateUnidad = updateUnidad;
const deleteUnidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.unidad.update({
            where: { id: Number(id) },
            data: { is_activa: false }
        });
        res.json({ message: 'Unidad eliminada (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar unidad' });
    }
});
exports.deleteUnidad = deleteUnidad;
