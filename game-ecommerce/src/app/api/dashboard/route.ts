import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [userCount, productCount, orderCount, revenueAggregate, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED' }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { status: 'COMPLETED' },
        include: {
          user: { select: { username: true, email: true } }
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: revenueAggregate._sum.totalAmount || 0,
      },
      recentOrders
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}