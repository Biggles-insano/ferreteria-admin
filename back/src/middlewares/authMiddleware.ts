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
