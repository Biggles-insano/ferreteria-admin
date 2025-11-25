-- CreateEnum
CREATE TYPE "TipoPromocion" AS ENUM ('descuento', 'regalo');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('entrada', 'salida', 'ajuste');

-- CreateEnum
CREATE TYPE "OrigenMovimientoInventario" AS ENUM ('orden_compra_detalle', 'recepcion_compra_detalle', 'factura_venta_detalle', 'devolucion_cliente_detalle', 'devolucion_proveedor_detalle', 'ajuste', 'conteo', 'transferencia');

-- CreateEnum
CREATE TYPE "TipoAjusteInventario" AS ENUM ('sobrante', 'faltante', 'dano', 'robo');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('pendiente', 'confirmada', 'cancelada');

-- CreateEnum
CREATE TYPE "EstadoOrdenCompra" AS ENUM ('pendiente', 'confirmada', 'entregada', 'cancelada');

-- CreateEnum
CREATE TYPE "EstadoRecepcionCompra" AS ENUM ('pendiente', 'completa', 'parcial', 'rechazada');

-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('pendiente', 'confirmada', 'rechazada');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('pendiente', 'confirmado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('pendiente', 'pagada', 'cancelada');

-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('pendiente', 'pagado', 'vencido');

-- CreateEnum
CREATE TYPE "TipoMovimientoCaja" AS ENUM ('ingreso', 'egreso');

-- CreateTable
CREATE TABLE "sucursales" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" VARCHAR(32) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bodegas" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "es_default" BOOLEAN NOT NULL DEFAULT false,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bodegas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "simbolo" VARCHAR(10) NOT NULL,
    "decimales" INTEGER NOT NULL DEFAULT 2,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impuestos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tasa_porcentaje" DECIMAL(6,3) NOT NULL,
    "aplica_ventas" BOOLEAN NOT NULL DEFAULT true,
    "aplica_compras" BOOLEAN NOT NULL DEFAULT true,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "impuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "codigo_producto" VARCHAR(60) NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "unidad_id" INTEGER NOT NULL,
    "impuesto_id" INTEGER NOT NULL,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "stock_minimo" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "punto_reorden" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "descripcion" TEXT,
    "control_vencimiento" BOOLEAN NOT NULL DEFAULT false,
    "fecha_vencimiento" DATE,
    "is_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listas_precios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "listas_precios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precios_producto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "lista_precio_id" INTEGER NOT NULL,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "fecha_desde" DATE NOT NULL,
    "fecha_hasta" DATE,

    CONSTRAINT "precios_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" "TipoPromocion" NOT NULL,
    "valor" DECIMAL(6,2) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "producto_id" INTEGER,
    "grupo_cliente_id" INTEGER,

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos_clientes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "grupos_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "nit" VARCHAR(32) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(32) NOT NULL,
    "direccion" TEXT NOT NULL,
    "grupo_cliente_id" INTEGER NOT NULL,
    "lista_precio_id" INTEGER NOT NULL,
    "exento_impuestos" BOOLEAN NOT NULL DEFAULT false,
    "termino_pago_id" INTEGER NOT NULL,
    "is_activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "nit" VARCHAR(32) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(32) NOT NULL,
    "direccion" TEXT NOT NULL,
    "termino_pago_id" INTEGER NOT NULL,
    "is_activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_cliente" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(32) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "direccion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactos_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_proveedor" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(32) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "direccion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactos_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "direccion" TEXT NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "existencias" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "existencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "tipo_movimiento" "TipoMovimientoInventario" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "origen_tipo" "OrigenMovimientoInventario" NOT NULL,
    "origen_id" INTEGER NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transferencias_inventario" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "bodega_origen_id" INTEGER NOT NULL,
    "bodega_destino_id" INTEGER NOT NULL,
    "fecha_transferencia" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "transferencias_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteos_fisicos" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad_contada" DECIMAL(12,2) NOT NULL,
    "fecha_conteo" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "conteos_fisicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ajustes_inventario" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad_ajustada" DECIMAL(12,2) NOT NULL,
    "tipo_ajuste" "TipoAjusteInventario" NOT NULL,
    "fecha_ajuste" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "ajustes_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas_inventario" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "cantidad_reservada" DECIMAL(12,2) NOT NULL,
    "fecha_reserva" TIMESTAMP(3) NOT NULL,
    "estado_reserva" "EstadoReserva" NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "reservas_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_compra" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "fecha_orden" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoOrdenCompra" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_orden_compra" (
    "id" SERIAL NOT NULL,
    "orden_compra_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "impuesto_monto" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_orden_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recepciones_compra" (
    "id" SERIAL NOT NULL,
    "orden_compra_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "fecha_recepcion" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoRecepcionCompra" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recepciones_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recepciones_compra_detalle" (
    "id" SERIAL NOT NULL,
    "recepcion_compra_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "orden_compra_detalle_id" INTEGER,
    "cantidad_recibida" DECIMAL(12,2) NOT NULL,
    "costo_unitario" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "recepciones_compra_detalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_proveedor" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "fecha_factura" TIMESTAMP(3) NOT NULL,
    "moneda_id" INTEGER NOT NULL,
    "tipo_cambio" DECIMAL(12,6),
    "serie_folio_id" INTEGER NOT NULL,
    "serie" VARCHAR(10) NOT NULL,
    "folio" INTEGER NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factura_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_factura_proveedor" (
    "id" SERIAL NOT NULL,
    "factura_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_factura_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolucion_proveedor" (
    "id" SERIAL NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "fecha_devolucion" TIMESTAMP(3) NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devolucion_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_devolucion_proveedor" (
    "id" SERIAL NOT NULL,
    "devolucion_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_devolucion_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones_venta" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "vendedor_id" INTEGER NOT NULL,
    "fecha_cotizacion" TIMESTAMP(3) NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotizaciones_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_cotizacion_venta" (
    "id" SERIAL NOT NULL,
    "cotizacion_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_cotizacion_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_venta" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "vendedor_id" INTEGER NOT NULL,
    "fecha_pedido" TIMESTAMP(3) NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoPedido" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_pedido_venta" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_pedido_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_venta" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "vendedor_id" INTEGER NOT NULL,
    "fecha_factura" TIMESTAMP(3) NOT NULL,
    "moneda_id" INTEGER NOT NULL,
    "tipo_cambio" DECIMAL(12,6),
    "serie_folio_id" INTEGER NOT NULL,
    "serie" VARCHAR(10) NOT NULL,
    "folio" INTEGER NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoFactura" NOT NULL,
    "metodo_pago_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factura_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_factura_venta" (
    "id" SERIAL NOT NULL,
    "factura_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_factura_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devolucion_cliente" (
    "id" SERIAL NOT NULL,
    "factura_id" INTEGER NOT NULL,
    "fecha_devolucion" TIMESTAMP(3) NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devolucion_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_devolucion_cliente" (
    "id" SERIAL NOT NULL,
    "devolucion_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_devolucion_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas_credito" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "descripcion" TEXT,
    "fecha_emision" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_credito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_por_cobrar" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER,
    "proveedor_id" INTEGER,
    "factura_venta_id" INTEGER,
    "factura_proveedor_id" INTEGER,
    "monto_pendiente" DECIMAL(12,2) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoCuenta" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuentas_por_cobrar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cajas" (
    "id" SERIAL NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "is_activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aperturas_caja" (
    "id" SERIAL NOT NULL,
    "caja_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "monto_apertura" DECIMAL(12,2) NOT NULL,
    "fecha_apertura" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "aperturas_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cierres_caja" (
    "id" SERIAL NOT NULL,
    "caja_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "monto_cierre" DECIMAL(12,2) NOT NULL,
    "fecha_cierre" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "cierres_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cobros" (
    "id" SERIAL NOT NULL,
    "caja_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "factura_venta_id" INTEGER,
    "cuenta_id" INTEGER,
    "monto" DECIMAL(12,2) NOT NULL,
    "metodo_pago_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "cobros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_proveedor" (
    "id" SERIAL NOT NULL,
    "caja_id" INTEGER NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "factura_proveedor_id" INTEGER,
    "cuenta_id" INTEGER,
    "monto" DECIMAL(12,2) NOT NULL,
    "metodo_pago_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "pagos_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "es_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_caja" (
    "id" SERIAL NOT NULL,
    "tipo_movimiento" "TipoMovimientoCaja" NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "caja_id" INTEGER NOT NULL,
    "metodo_pago_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "comentarios" TEXT,

    CONSTRAINT "movimientos_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_documento" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series_folios" (
    "id" SERIAL NOT NULL,
    "tipo_documento_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "serie" VARCHAR(10) NOT NULL,
    "folio_inicial" INTEGER NOT NULL,
    "folio_actual" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "series_folios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monedas" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(3) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "simbolo" VARCHAR(5) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terminos_pago" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "dias_credito" INTEGER NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terminos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "contraseña_hash" VARCHAR(255) NOT NULL,
    "rol_por_defecto_id" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" SERIAL NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bitacora_actividades" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "detalle" TEXT,

    CONSTRAINT "bitacora_actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adjuntos" (
    "id" SERIAL NOT NULL,
    "tabla" VARCHAR(100) NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "ruta_archivo" VARCHAR(255) NOT NULL,
    "tipo_archivo" VARCHAR(50) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adjuntos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bodegas_codigo_key" ON "bodegas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_producto_key" ON "productos"("codigo_producto");

-- CreateIndex
CREATE UNIQUE INDEX "existencias_producto_id_bodega_id_key" ON "existencias"("producto_id", "bodega_id");

-- CreateIndex
CREATE UNIQUE INDEX "cajas_codigo_key" ON "cajas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "monedas_codigo_key" ON "monedas"("codigo");

-- AddForeignKey
ALTER TABLE "bodegas" ADD CONSTRAINT "bodegas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_impuesto_id_fkey" FOREIGN KEY ("impuesto_id") REFERENCES "impuestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas_precios" ADD CONSTRAINT "listas_precios_moneda_fkey" FOREIGN KEY ("moneda") REFERENCES "monedas"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios_producto" ADD CONSTRAINT "precios_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios_producto" ADD CONSTRAINT "precios_producto_lista_precio_id_fkey" FOREIGN KEY ("lista_precio_id") REFERENCES "listas_precios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_grupo_cliente_id_fkey" FOREIGN KEY ("grupo_cliente_id") REFERENCES "grupos_clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_grupo_cliente_id_fkey" FOREIGN KEY ("grupo_cliente_id") REFERENCES "grupos_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_lista_precio_id_fkey" FOREIGN KEY ("lista_precio_id") REFERENCES "listas_precios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_termino_pago_id_fkey" FOREIGN KEY ("termino_pago_id") REFERENCES "terminos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedores" ADD CONSTRAINT "proveedores_termino_pago_id_fkey" FOREIGN KEY ("termino_pago_id") REFERENCES "terminos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos_cliente" ADD CONSTRAINT "contactos_cliente_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos_proveedor" ADD CONSTRAINT "contactos_proveedor_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "existencias" ADD CONSTRAINT "existencias_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "existencias" ADD CONSTRAINT "existencias_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_inventario" ADD CONSTRAINT "transferencias_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_inventario" ADD CONSTRAINT "transferencias_inventario_bodega_origen_id_fkey" FOREIGN KEY ("bodega_origen_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_inventario" ADD CONSTRAINT "transferencias_inventario_bodega_destino_id_fkey" FOREIGN KEY ("bodega_destino_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteos_fisicos" ADD CONSTRAINT "conteos_fisicos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteos_fisicos" ADD CONSTRAINT "conteos_fisicos_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajustes_inventario" ADD CONSTRAINT "ajustes_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajustes_inventario" ADD CONSTRAINT "ajustes_inventario_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_inventario" ADD CONSTRAINT "reservas_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_inventario" ADD CONSTRAINT "reservas_inventario_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden_compra" ADD CONSTRAINT "detalle_orden_compra_orden_compra_id_fkey" FOREIGN KEY ("orden_compra_id") REFERENCES "ordenes_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden_compra" ADD CONSTRAINT "detalle_orden_compra_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepciones_compra" ADD CONSTRAINT "recepciones_compra_orden_compra_id_fkey" FOREIGN KEY ("orden_compra_id") REFERENCES "ordenes_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepciones_compra" ADD CONSTRAINT "recepciones_compra_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepciones_compra_detalle" ADD CONSTRAINT "recepciones_compra_detalle_recepcion_compra_id_fkey" FOREIGN KEY ("recepcion_compra_id") REFERENCES "recepciones_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepciones_compra_detalle" ADD CONSTRAINT "recepciones_compra_detalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepciones_compra_detalle" ADD CONSTRAINT "recepciones_compra_detalle_orden_compra_detalle_id_fkey" FOREIGN KEY ("orden_compra_detalle_id") REFERENCES "detalle_orden_compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_proveedor" ADD CONSTRAINT "factura_proveedor_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_proveedor" ADD CONSTRAINT "factura_proveedor_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_proveedor" ADD CONSTRAINT "factura_proveedor_serie_folio_id_fkey" FOREIGN KEY ("serie_folio_id") REFERENCES "series_folios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura_proveedor" ADD CONSTRAINT "detalle_factura_proveedor_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "factura_proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura_proveedor" ADD CONSTRAINT "detalle_factura_proveedor_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion_proveedor" ADD CONSTRAINT "devolucion_proveedor_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion_proveedor" ADD CONSTRAINT "detalle_devolucion_proveedor_devolucion_id_fkey" FOREIGN KEY ("devolucion_id") REFERENCES "devolucion_proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion_proveedor" ADD CONSTRAINT "detalle_devolucion_proveedor_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion_proveedor" ADD CONSTRAINT "detalle_devolucion_proveedor_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones_venta" ADD CONSTRAINT "cotizaciones_venta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones_venta" ADD CONSTRAINT "cotizaciones_venta_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_cotizacion_venta" ADD CONSTRAINT "detalle_cotizacion_venta_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_cotizacion_venta" ADD CONSTRAINT "detalle_cotizacion_venta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_venta" ADD CONSTRAINT "pedidos_venta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_venta" ADD CONSTRAINT "pedidos_venta_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido_venta" ADD CONSTRAINT "detalle_pedido_venta_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido_venta" ADD CONSTRAINT "detalle_pedido_venta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_venta" ADD CONSTRAINT "factura_venta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_venta" ADD CONSTRAINT "factura_venta_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_venta" ADD CONSTRAINT "factura_venta_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_venta" ADD CONSTRAINT "factura_venta_moneda_id_fkey" FOREIGN KEY ("moneda_id") REFERENCES "monedas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_venta" ADD CONSTRAINT "factura_venta_serie_folio_id_fkey" FOREIGN KEY ("serie_folio_id") REFERENCES "series_folios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_venta" ADD CONSTRAINT "factura_venta_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura_venta" ADD CONSTRAINT "detalle_factura_venta_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "factura_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura_venta" ADD CONSTRAINT "detalle_factura_venta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura_venta" ADD CONSTRAINT "detalle_factura_venta_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion_cliente" ADD CONSTRAINT "devolucion_cliente_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "factura_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion_cliente" ADD CONSTRAINT "detalle_devolucion_cliente_devolucion_id_fkey" FOREIGN KEY ("devolucion_id") REFERENCES "devolucion_cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion_cliente" ADD CONSTRAINT "detalle_devolucion_cliente_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion_cliente" ADD CONSTRAINT "detalle_devolucion_cliente_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "bodegas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_credito" ADD CONSTRAINT "notas_credito_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_por_cobrar" ADD CONSTRAINT "cuentas_por_cobrar_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_por_cobrar" ADD CONSTRAINT "cuentas_por_cobrar_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_por_cobrar" ADD CONSTRAINT "cuentas_por_cobrar_factura_venta_id_fkey" FOREIGN KEY ("factura_venta_id") REFERENCES "factura_venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_por_cobrar" ADD CONSTRAINT "cuentas_por_cobrar_factura_proveedor_id_fkey" FOREIGN KEY ("factura_proveedor_id") REFERENCES "factura_proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aperturas_caja" ADD CONSTRAINT "aperturas_caja_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aperturas_caja" ADD CONSTRAINT "aperturas_caja_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cierres_caja" ADD CONSTRAINT "cierres_caja_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cierres_caja" ADD CONSTRAINT "cierres_caja_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_factura_venta_id_fkey" FOREIGN KEY ("factura_venta_id") REFERENCES "factura_venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas_por_cobrar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_proveedor" ADD CONSTRAINT "pagos_proveedor_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_proveedor" ADD CONSTRAINT "pagos_proveedor_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_proveedor" ADD CONSTRAINT "pagos_proveedor_factura_proveedor_id_fkey" FOREIGN KEY ("factura_proveedor_id") REFERENCES "factura_proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_proveedor" ADD CONSTRAINT "pagos_proveedor_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas_por_cobrar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_proveedor" ADD CONSTRAINT "pagos_proveedor_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_folios" ADD CONSTRAINT "series_folios_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_folios" ADD CONSTRAINT "series_folios_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_por_defecto_id_fkey" FOREIGN KEY ("rol_por_defecto_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora_actividades" ADD CONSTRAINT "bitacora_actividades_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
