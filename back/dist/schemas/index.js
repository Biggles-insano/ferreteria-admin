"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCajaSchema = exports.createRecepcionSchema = exports.createOrdenCompraSchema = exports.createFacturaSchema = exports.createPedidoSchema = exports.createProveedorSchema = exports.createClienteSchema = exports.createBodegaSchema = exports.updateProductoSchema = exports.createProductoSchema = exports.createUnidadSchema = exports.createMarcaSchema = exports.createCategoriaSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// --- Auth Schemas ---
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        email: zod_1.z.string().email('Email inválido'),
        password: zod_1.z.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
            .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
            .regex(/^[a-zA-Z0-9]+$/, 'La contraseña solo puede contener caracteres alfanuméricos'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email inválido'),
        password: zod_1.z.string().min(1, 'La contraseña es requerida'),
    }),
});
// --- Catalog Schemas ---
exports.createCategoriaSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(2, 'El nombre es requerido'),
        descripcion: zod_1.z.string().optional(),
    }),
});
exports.createMarcaSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(2, 'El nombre es requerido'),
    }),
});
exports.createUnidadSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1, 'El nombre es requerido'),
        simbolo: zod_1.z.string().min(1, 'El símbolo es requerido'),
        decimales: zod_1.z.number().int().min(0).max(4).optional(),
    }),
});
// --- Product Schemas ---
exports.createProductoSchema = zod_1.z.object({
    body: zod_1.z.object({
        codigo_producto: zod_1.z.string().min(1, 'Código es requerido'),
        nombre: zod_1.z.string().min(1, 'Nombre es requerido'),
        marca_id: zod_1.z.number().int().positive(),
        categoria_id: zod_1.z.number().int().positive(),
        unidad_id: zod_1.z.number().int().positive(),
        impuesto_id: zod_1.z.number().int().positive(),
        precio_base: zod_1.z.number().min(0),
        stock_minimo: zod_1.z.number().min(0).optional(),
        punto_reorden: zod_1.z.number().min(0).optional(),
        descripcion: zod_1.z.string().optional(),
        control_vencimiento: zod_1.z.boolean().optional(),
    }),
});
exports.updateProductoSchema = zod_1.z.object({
    body: zod_1.z.object({
        codigo_producto: zod_1.z.string().min(1).optional(),
        nombre: zod_1.z.string().min(1).optional(),
        marca_id: zod_1.z.number().int().positive().optional(),
        categoria_id: zod_1.z.number().int().positive().optional(),
        unidad_id: zod_1.z.number().int().positive().optional(),
        impuesto_id: zod_1.z.number().int().positive().optional(),
        precio_base: zod_1.z.number().min(0).optional(),
        stock_minimo: zod_1.z.number().min(0).optional(),
        punto_reorden: zod_1.z.number().min(0).optional(),
        descripcion: zod_1.z.string().optional(),
        control_vencimiento: zod_1.z.boolean().optional(),
        is_activo: zod_1.z.boolean().optional(),
    }),
});
// --- Inventory Schemas ---
exports.createBodegaSchema = zod_1.z.object({
    body: zod_1.z.object({
        sucursal_id: zod_1.z.number().int().positive(),
        codigo: zod_1.z.string().min(1),
        nombre: zod_1.z.string().min(1),
        es_default: zod_1.z.boolean().optional(),
    }),
});
// --- Partner Schemas ---
exports.createClienteSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1),
        nit: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        telefono: zod_1.z.string().min(1),
        direccion: zod_1.z.string().min(1),
        grupo_cliente_id: zod_1.z.number().int().positive(),
        lista_precio_id: zod_1.z.number().int().positive(),
        termino_pago_id: zod_1.z.number().int().positive(),
        exento_impuestos: zod_1.z.boolean().optional(),
    }),
});
exports.createProveedorSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1),
        nit: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        telefono: zod_1.z.string().min(1),
        direccion: zod_1.z.string().min(1),
        termino_pago_id: zod_1.z.number().int().positive(),
    }),
});
// --- Sales Schemas ---
const detalleVentaSchema = zod_1.z.object({
    producto_id: zod_1.z.number().int().positive(),
    bodega_id: zod_1.z.number().int().positive().optional(), // Optional for orders, required for invoices usually
    cantidad: zod_1.z.number().positive(),
    precio_unitario: zod_1.z.number().min(0),
    descuento: zod_1.z.number().min(0).optional(),
    total: zod_1.z.number().min(0),
});
exports.createPedidoSchema = zod_1.z.object({
    body: zod_1.z.object({
        cliente_id: zod_1.z.number().int().positive(),
        vendedor_id: zod_1.z.number().int().positive(),
        fecha_pedido: zod_1.z.string().datetime().or(zod_1.z.date()), // Accept ISO string or Date object
        monto_total: zod_1.z.number().min(0),
        estado: zod_1.z.enum(['pendiente', 'confirmado', 'cancelado']),
        detalles: zod_1.z.array(detalleVentaSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});
exports.createFacturaSchema = zod_1.z.object({
    body: zod_1.z.object({
        cliente_id: zod_1.z.number().int().positive(),
        sucursal_id: zod_1.z.number().int().positive(),
        vendedor_id: zod_1.z.number().int().positive(),
        fecha_factura: zod_1.z.string().datetime().or(zod_1.z.date()),
        moneda_id: zod_1.z.number().int().positive(),
        serie_folio_id: zod_1.z.number().int().positive(),
        serie: zod_1.z.string(),
        folio: zod_1.z.number().int(),
        monto_total: zod_1.z.number().min(0),
        estado: zod_1.z.enum(['pendiente', 'pagada', 'cancelada']),
        metodo_pago_id: zod_1.z.number().int().positive(),
        detalles: zod_1.z.array(detalleVentaSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});
// --- Purchase Schemas ---
const detalleCompraSchema = zod_1.z.object({
    producto_id: zod_1.z.number().int().positive(),
    cantidad: zod_1.z.number().positive(),
    precio_unitario: zod_1.z.number().min(0),
    total: zod_1.z.number().min(0),
});
exports.createOrdenCompraSchema = zod_1.z.object({
    body: zod_1.z.object({
        proveedor_id: zod_1.z.number().int().positive(),
        sucursal_id: zod_1.z.number().int().positive(),
        fecha_orden: zod_1.z.string().datetime().or(zod_1.z.date()),
        estado: zod_1.z.enum(['pendiente', 'confirmada', 'entregada', 'cancelada']),
        detalles: zod_1.z.array(detalleCompraSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});
const detalleRecepcionSchema = zod_1.z.object({
    producto_id: zod_1.z.number().int().positive(),
    orden_compra_detalle_id: zod_1.z.number().int().positive().optional(),
    cantidad_recibida: zod_1.z.number().positive(),
    costo_unitario: zod_1.z.number().min(0),
    total: zod_1.z.number().min(0),
});
exports.createRecepcionSchema = zod_1.z.object({
    body: zod_1.z.object({
        orden_compra_id: zod_1.z.number().int().positive(),
        bodega_id: zod_1.z.number().int().positive(),
        fecha_recepcion: zod_1.z.string().datetime().or(zod_1.z.date()),
        estado: zod_1.z.enum(['pendiente', 'completa', 'parcial', 'rechazada']),
        detalles: zod_1.z.array(detalleRecepcionSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});
// --- Finance Schemas ---
exports.createCajaSchema = zod_1.z.object({
    body: zod_1.z.object({
        sucursal_id: zod_1.z.number().int().positive(),
        codigo: zod_1.z.string().min(1),
        nombre: zod_1.z.string().min(1),
    }),
});
