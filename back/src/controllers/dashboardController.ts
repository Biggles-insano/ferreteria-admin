import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Total Sales Today (approximate)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const salesToday = await prisma.pedidoVenta.aggregate({
            _sum: {
                monto_total: true
            },
            where: {
                fecha_pedido: {
                    gte: today
                }
            }
        });

        // 2. Count of Products
        const totalProducts = await prisma.producto.count({
            where: { is_activo: true }
        });

        // 3. Count of Low Stock Products
        // For simplicity, we'll fetch all products and filter in memory if the dataset is small, 
        // or doing a raw query if performance is key. 
        // Since we don't have a direct 'stock' column on product but in 'Existencia', this is tricky.
        // We will just count products for now and maybe list active alerts if we had an alerts system.
        // Let's try to get a count of products where their sum of existencias is low.
        // This is complex for Prisma without raw query or grouping.
        // We will SKIP exact low stock count for this MVP iteration and return a placeholder or 0.

        // 4. Recent Sales (Last 5)
        const recentSales = await prisma.pedidoVenta.findMany({
            take: 5,
            orderBy: { fecha_pedido: 'desc' },
            include: {
                cliente: true
            }
        });

        res.json({
            salesToday: salesToday._sum.monto_total || 0,
            totalProducts,
            lowStockCount: 0, // Placeholder
            recentSales
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
};
