# Ferretería Admin

Este proyecto contiene el sistema administrativo para la Ferretería.

## Estructura del Proyecto

- `back/`: Código fuente del Backend (Node.js + Express + Prisma).
- `front/`: Código fuente del Frontend (pendiente).
- `docker-compose.yml`: Configuración de Docker para la base de datos.

## Cómo Iniciar

### 1. Base de Datos (PostgreSQL)

El archivo `docker-compose.yml` está en la raíz del proyecto (`ferreteria-admin`).

**Comando:**
```bash
# Desde la carpeta ferreteria-admin
docker-compose up -d
```

### 2. Backend

El código del backend está en la carpeta `back`.

**Comando:**
```bash
# Desde la carpeta ferreteria-admin
cd back
npm run dev
```

El servidor iniciará en `http://localhost:3000`.