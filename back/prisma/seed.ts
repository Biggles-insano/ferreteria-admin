import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Roles
    const adminRole = await prisma.rol.upsert({
        where: { id: 1 },
        update: {},
        create: {
            nombre: 'Admin',
            descripcion: 'Administrador del sistema con acceso total',
        },
    });

    const cajeroRole = await prisma.rol.upsert({
        where: { id: 2 },
        update: {},
        create: {
            nombre: 'Cajero',
            descripcion: 'Usuario con acceso a punto de venta y caja',
        },
    });

    const inventarioRole = await prisma.rol.upsert({
        where: { id: 3 },
        update: {},
        create: {
            nombre: 'Inventario',
            descripcion: 'Encargado de inventario con permisos de edición',
        },
    });

    console.log('Roles created/verified.');

    // --- Admin User ---
    const adminEmail = 'admin@ferreteria.com';
    const password = 'password123'; // Common password for all test users
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await prisma.usuario.findFirst({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const user = await prisma.usuario.create({
            data: {
                nombre: 'Administrador',
                email: adminEmail,
                contrasena_hash: hashedPassword,
                rol_por_defecto_id: adminRole.id,
                is_activo: true,
            },
        });
        await prisma.usuarioRol.create({ data: { usuario_id: user.id, rol_id: adminRole.id } });
        console.log(`Admin created: ${adminEmail}`);
    }

    // --- Cajero User ---
    const cajeroEmail = 'cajero@ferreteria.com';
    const existingCajero = await prisma.usuario.findFirst({ where: { email: cajeroEmail } });
    if (!existingCajero) {
        const user = await prisma.usuario.create({
            data: {
                nombre: 'Cajero Vendedor',
                email: cajeroEmail,
                contrasena_hash: hashedPassword,
                rol_por_defecto_id: cajeroRole.id,
                is_activo: true,
            },
        });
        await prisma.usuarioRol.create({ data: { usuario_id: user.id, rol_id: cajeroRole.id } });
        console.log(`Cajero created: ${cajeroEmail}`);
    }

    // --- Inventario User ---
    const invEmail = 'inventario@ferreteria.com';
    const existingInv = await prisma.usuario.findFirst({ where: { email: invEmail } });
    if (!existingInv) {
        const user = await prisma.usuario.create({
            data: {
                nombre: 'Encargado Inventario',
                email: invEmail,
                contrasena_hash: hashedPassword,
                rol_por_defecto_id: inventarioRole.id,
                is_activo: true,
            },
        });
        await prisma.usuarioRol.create({ data: { usuario_id: user.id, rol_id: inventarioRole.id } });
        console.log(`Inventario created: ${invEmail}`);
    }

    console.log(`\nSeed finished. All users have password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
