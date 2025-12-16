import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';

        const whereClause = includeInactive ? {} : { is_activo: true };

        const users = await prisma.usuario.findMany({
            where: whereClause,
            include: {
                roles: {
                    include: {
                        rol: true
                    }
                }
            },
            orderBy: { id: 'asc' }
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            is_activo: user.is_activo,
            roles: user.roles.map(ur => ur.rol.nombre)
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, roles } = req.body; // roles is array of string names

        if (!nombre || !email || !password || !roles || !Array.isArray(roles)) {
            return res.status(400).json({ error: 'Missing or invalid fields' });
        }

        const existingUser = await prisma.usuario.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        // Find role IDs
        const rolesDb = await prisma.rol.findMany({
            where: { nombre: { in: roles } }
        });

        if (rolesDb.length !== roles.length) {
            return res.status(400).json({ error: 'One or more invalid roles' });
        }

        const newUser = await prisma.usuario.create({
            data: {
                nombre,
                email,
                contrasena_hash: hashedPassword,
                is_activo: true,
                roles: {
                    create: rolesDb.map(r => ({
                        rol_id: r.id
                    }))
                }
            },
            include: {
                roles: { include: { rol: true } }
            }
        });

        res.status(201).json({
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            roles: newUser.roles.map(ur => ur.rol.nombre)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, roles, is_activo } = req.body;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const existingUser = await prisma.usuario.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        let updateData: any = { nombre, email, is_activo };

        if (password) {
            updateData.contrasena_hash = await hashPassword(password);
        }

        // Transaction to update user and roles
        await prisma.$transaction(async (tx) => {
            // Update basic info
            await tx.usuario.update({
                where: { id: userId },
                data: updateData
            });

            // Update roles if provided
            if (roles && Array.isArray(roles)) {
                // Remove old roles
                await tx.usuarioRol.deleteMany({ where: { usuario_id: userId } });

                // Get new role IDs
                const rolesDb = await tx.rol.findMany({
                    where: { nombre: { in: roles } }
                });

                // Add new roles
                if (rolesDb.length > 0) {
                    await tx.usuarioRol.createMany({
                        data: rolesDb.map(r => ({
                            usuario_id: userId,
                            rol_id: r.id
                        }))
                    });
                }
            }
        });

        const updatedUser = await prisma.usuario.findUnique({
            where: { id: userId },
            include: { roles: { include: { rol: true } } }
        });

        res.json({
            id: updatedUser?.id,
            nombre: updatedUser?.nombre,
            email: updatedUser?.email,
            is_activo: updatedUser?.is_activo,
            roles: updatedUser?.roles.map(ur => ur.rol.nombre)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        // Soft delete (just set active to false, or actually delete?)
        // Requirement said "Soft delete or deactivation"
        // Let's implement toggle active status effectively, but this endpoint might be for actual deletion?
        // Usually safer to just deactivate. But let's follow the implementation plan which implied a delete action.
        // Actually, let's do a hard delete of relations and user for now for simplicity if "Delete" is requested,
        // OR better, just toggle is_activo via update.
        // Let's make this endpoint strictly deactivate for safety if it's "DELETE", or valid hard delete.
        // Given prisma relations, hard delete might fail if there are constraints (orders etc).
        // Let's default to deactivating.

        await prisma.usuario.update({
            where: { id: userId },
            data: { is_activo: false }
        });

        res.json({ message: 'User deactivated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};
