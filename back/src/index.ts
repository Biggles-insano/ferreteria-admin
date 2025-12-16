import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';
import productRoutes from './routes/productRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import partnerRoutes from './routes/partnerRoutes';
import salesRoutes from './routes/salesRoutes';
import purchaseRoutes from './routes/purchaseRoutes';
import financeRoutes from './routes/financeRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

import { authenticateToken } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger, consoleLogger } from './middlewares/requestLogger';

app.use(helmet()); // Security Headers
app.use(cors());
app.use(express.json());

// Logging
app.use(consoleLogger);
app.use(requestLogger);

app.use('/api/auth', authRoutes);

// Protected Routes
// Protected Routes
app.use('/api/catalogos', catalogRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/inventario', inventoryRoutes);
app.use('/api/terceros', partnerRoutes);
app.use('/api/ventas', salesRoutes);
app.use('/api/compras', purchaseRoutes);
app.use('/api/finanzas', financeRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Example endpoint to verify DB connection
app.get('/api/sucursales', authenticateToken, async (req, res) => {
    try {
        const sucursales = await prisma.sucursal.findMany();
        res.json(sucursales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
