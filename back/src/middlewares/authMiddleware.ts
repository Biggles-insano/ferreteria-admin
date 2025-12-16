import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    const user = verifyToken(token);
    if (!user) {
        return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }

    req.user = user;
    next();
};

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authorizeRole = (allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const userWithRoles = await prisma.usuario.findUnique({
                where: { id: req.user.id },
                include: { roles: { include: { rol: true } } }
            });

            if (!userWithRoles) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            const userRoleNames = userWithRoles.roles.map(ur => ur.rol.nombre);
            const hasPermission = userRoleNames.some(role => allowedRoles.includes(role));

            if (!hasPermission) {
                return res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes' });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ error: 'Error interno de autorización' });
        }
    };
};
