import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await prisma.usuario.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.usuario.create({
            data: {
                nombre,
                email,
                contrasena_hash: hashedPassword,
            },
        });

        const token = generateToken({ id: user.id, email: user.email });

        res.status(201).json({ user: { id: user.id, nombre: user.nombre, email: user.email }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Generate a dummy hash for timing attacks mitigation
// This hash matches "password" with cost 10, pre-calculated to avoid startup delay
const DUMMY_HASH = '$2b$10$RJUaQ3QnEEUrnjFDtnShhunVXOkxdmFawm675NkOtgX.P.8zo6COa';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation is handled by middleware now, but we keep this as backup or remove it
        // if (!email || !password) ... (Removed since Zod handles it)

        const user = await prisma.usuario.findFirst({
            where: { email },
            include: {
                roles: {
                    include: {
                        rol: true
                    }
                }
            }
        });

        // Timing Attack Mitigation:
        // Always execute comparePassword to consume the same amount of time
        // regardless of whether the user exists or not.
        const targetHash = user ? user.contrasena_hash : DUMMY_HASH;
        const isMatch = await comparePassword(password, targetHash);

        if (!user || !isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, email: user.email });

        const userRoles = user.roles.map(ur => ur.rol.nombre);

        res.json({
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                roles: userRoles
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
