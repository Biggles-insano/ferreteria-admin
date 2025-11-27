import { z } from 'zod';

// --- Auth Schemas ---

export const registerSchema = z.object({
    body: z.object({
        nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        email: z.string().email('Email inválido'),
        password: z.string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
            .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
            .regex(/^[a-zA-Z0-9]+$/, 'La contraseña solo puede contener caracteres alfanuméricos'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'La contraseña es requerida'),
    }),
});

// --- Catalog Schemas ---

export const createCategoriaSchema = z.object({
    body: z.object({
        nombre: z.string().min(2, 'El nombre es requerido'),
        descripcion: z.string().optional(),
    }),
});

export const createMarcaSchema = z.object({
    body: z.object({
        nombre: z.string().min(2, 'El nombre es requerido'),
    }),
});

export const createUnidadSchema = z.object({
    body: z.object({
        nombre: z.string().min(1, 'El nombre es requerido'),
        simbolo: z.string().min(1, 'El símbolo es requerido'),
        decimales: z.number().int().min(0).max(4).optional(),
    }),
});

// --- Product Schemas ---

export const createProductoSchema = z.object({
    body: z.object({
        codigo_producto: z.string().min(1, 'Código es requerido'),
        nombre: z.string().min(1, 'Nombre es requerido'),
        marca_id: z.number().int().positive(),
        categoria_id: z.number().int().positive(),
        unidad_id: z.number().int().positive(),
        impuesto_id: z.number().int().positive(),
        precio_base: z.number().min(0),
        stock_minimo: z.number().min(0).optional(),
        punto_reorden: z.number().min(0).optional(),
        descripcion: z.string().optional(),
        control_vencimiento: z.boolean().optional(),
    }),
});

export const updateProductoSchema = z.object({
    body: z.object({
        codigo_producto: z.string().min(1).optional(),
        nombre: z.string().min(1).optional(),
        marca_id: z.number().int().positive().optional(),
        categoria_id: z.number().int().positive().optional(),
        unidad_id: z.number().int().positive().optional(),
        impuesto_id: z.number().int().positive().optional(),
        precio_base: z.number().min(0).optional(),
        stock_minimo: z.number().min(0).optional(),
        punto_reorden: z.number().min(0).optional(),
        descripcion: z.string().optional(),
        control_vencimiento: z.boolean().optional(),
        is_activo: z.boolean().optional(),
    }),
});

// --- Inventory Schemas ---

export const createBodegaSchema = z.object({
    body: z.object({
        sucursal_id: z.number().int().positive(),
        codigo: z.string().min(1),
        nombre: z.string().min(1),
        es_default: z.boolean().optional(),
    }),
});

// --- Partner Schemas ---

export const createClienteSchema = z.object({
    body: z.object({
        nombre: z.string().min(1),
        nit: z.string().min(1),
        email: z.string().email(),
        telefono: z.string().min(1),
        direccion: z.string().min(1),
        grupo_cliente_id: z.number().int().positive(),
        lista_precio_id: z.number().int().positive(),
        termino_pago_id: z.number().int().positive(),
        exento_impuestos: z.boolean().optional(),
    }),
});

export const createProveedorSchema = z.object({
    body: z.object({
        nombre: z.string().min(1),
        nit: z.string().min(1),
        email: z.string().email(),
        telefono: z.string().min(1),
        direccion: z.string().min(1),
        termino_pago_id: z.number().int().positive(),
    }),
});

// --- Sales Schemas ---

const detalleVentaSchema = z.object({
    producto_id: z.number().int().positive(),
    bodega_id: z.number().int().positive().optional(), // Optional for orders, required for invoices usually
    cantidad: z.number().positive(),
    precio_unitario: z.number().min(0),
    descuento: z.number().min(0).optional(),
    total: z.number().min(0),
});

export const createPedidoSchema = z.object({
    body: z.object({
        cliente_id: z.number().int().positive(),
        vendedor_id: z.number().int().positive(),
        fecha_pedido: z.string().datetime().or(z.date()), // Accept ISO string or Date object
        monto_total: z.number().min(0),
        estado: z.enum(['pendiente', 'confirmado', 'cancelado']),
        detalles: z.array(detalleVentaSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});

export const createFacturaSchema = z.object({
    body: z.object({
        cliente_id: z.number().int().positive(),
        sucursal_id: z.number().int().positive(),
        vendedor_id: z.number().int().positive(),
        fecha_factura: z.string().datetime().or(z.date()),
        moneda_id: z.number().int().positive(),
        serie_folio_id: z.number().int().positive(),
        serie: z.string(),
        folio: z.number().int(),
        monto_total: z.number().min(0),
        estado: z.enum(['pendiente', 'pagada', 'cancelada']),
        metodo_pago_id: z.number().int().positive(),
        detalles: z.array(detalleVentaSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});

// --- Purchase Schemas ---

const detalleCompraSchema = z.object({
    producto_id: z.number().int().positive(),
    cantidad: z.number().positive(),
    precio_unitario: z.number().min(0),
    total: z.number().min(0),
});

export const createOrdenCompraSchema = z.object({
    body: z.object({
        proveedor_id: z.number().int().positive(),
        sucursal_id: z.number().int().positive(),
        fecha_orden: z.string().datetime().or(z.date()),
        estado: z.enum(['pendiente', 'confirmada', 'entregada', 'cancelada']),
        detalles: z.array(detalleCompraSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});

const detalleRecepcionSchema = z.object({
    producto_id: z.number().int().positive(),
    orden_compra_detalle_id: z.number().int().positive().optional(),
    cantidad_recibida: z.number().positive(),
    costo_unitario: z.number().min(0),
    total: z.number().min(0),
});

export const createRecepcionSchema = z.object({
    body: z.object({
        orden_compra_id: z.number().int().positive(),
        bodega_id: z.number().int().positive(),
        fecha_recepcion: z.string().datetime().or(z.date()),
        estado: z.enum(['pendiente', 'completa', 'parcial', 'rechazada']),
        detalles: z.array(detalleRecepcionSchema).min(1, 'Debe incluir al menos un producto'),
    }),
});

// --- Finance Schemas ---

export const createCajaSchema = z.object({
    body: z.object({
        sucursal_id: z.number().int().positive(),
        codigo: z.string().min(1),
        nombre: z.string().min(1),
    }),
});
