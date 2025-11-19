import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. ดึงข้อมูลสรุป (ทำพร้อมกันด้วย Promise.all เพื่อความเร็ว)
    const [userCount, productCount, orderCount, revenueAggregate, recentOrders] = await Promise.all([
      // นับ User ทั้งหมด
      prisma.user.count(),
      
      // นับสินค้าทั้งหมด
      prisma.product.count(),
      
      // นับออเดอร์ทั้งหมด
      prisma.order.count(),
      
      // รวมยอดเงิน (เฉพาะสถานะ PAID)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'PAID' }
      }),

      // ดึง 5 ออเดอร์ล่าสุด
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { username: true, email: true } } // Join ตาราง User มาเอาชื่อ
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: userCount,
        totalProducts: productCount,
        totalOrders: orderCount,
        totalRevenue: revenueAggregate._sum.totalAmount || 0, // ถ้าไม่มีออเดอร์เลยให้เป็น 0
      },
      recentOrders
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}