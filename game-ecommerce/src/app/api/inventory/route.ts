import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// ✅ 1. Import Enum 'OrderStatus' มาจาก @prisma/client
import { OrderStatus } from '@prisma/client'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json([], { status: 400 });

  try {
    const keys = await prisma.productKey.findMany({
      where: {
        order: {
          userId: userId,
          // ✅ 2. เปลี่ยน 'COMPLETED' (String) เป็น OrderStatus.COMPLETED (Enum Member)
          status: OrderStatus.COMPLETED 
        }
      },
      include: {
        product: true,
        order: true
      },
      orderBy: {
        order: { createdAt: 'desc' }
      }
    });

    const formattedKeys = keys.map(k => ({
      id: k.id,
      code: k.code,
      product: {
        title: k.product.title,
        image: k.product.image,
        category: k.product.category
      },
      purchaseDate: k.order?.createdAt
    }));

    return NextResponse.json(formattedKeys);

  } catch (error) {
    console.error("Inventory Error:", error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}