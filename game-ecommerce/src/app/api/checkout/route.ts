import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// ✅ 1. เพิ่มการ Import Enum 'OrderStatus' จาก @prisma/client
import { OrderStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, cartItems } = body;

    if (!userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // เริ่ม Transaction (Atomic Operation)
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. ดึงข้อมูล User ล่าสุดเพื่อเช็คยอดเงิน
      const user = await tx.user.findUnique({
        where: { id: userId }
      });

      if (!user) throw new Error('ไม่พบผู้ใช้งาน');

      let totalAmount = 0;
      // กำหนด Type ให้ชัดเจนสำหรับ OrderItems
      const orderItemsData: { 
          productTitle: string; 
          price: number; 
          productId: string 
      }[] = [];
      
      const assignedKeyIds: string[] = [];

      for (const item of cartItems) {
        // 2. ตรวจสอบข้อมูลสินค้าล่าสุด
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`ไม่พบสินค้า ID: ${item.id}`);

        // 3. เช็ค Stock Key
        for (let i = 0; i < item.quantity; i++) {
            const availableKey = await tx.productKey.findFirst({
              where: { 
                productId: item.id, 
                isUsed: false,
                id: { notIn: assignedKeyIds }
              }
            });
    
            if (!availableKey) {
              throw new Error(`ขออภัย สินค้า "${product.title}" หมดชั่วคราว (Key ไม่พอ)`);
            }
            
            assignedKeyIds.push(availableKey.id);
        }

        totalAmount += product.price * item.quantity;
        
        // สร้างรายการสินค้าใน Order
        orderItemsData.push({
          productTitle: product.title,
          price: product.price,
          productId: product.id
        });
      }

      // 4. เช็คเงินในกระเป๋า
      if (user.balance < totalAmount) {
        throw new Error(`ยอดเงินไม่พอ (ขาดอีก ฿${(totalAmount - user.balance).toLocaleString()})`);
      }

      // 5. ตัดเงิน User
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalAmount } }
      });

      // 6. สร้าง Order บันทึกประวัติ
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          
          // ✅ 2. ต้องใช้แบบนี้ (Enum Member) ห้ามใช้ 'COMPLETED' (String)
          status: OrderStatus.COMPLETED, 
          
          items: {
            create: orderItemsData
          }
        }
      });

      // 7. แจก Key
      for (const keyId of assignedKeyIds) {
        await tx.productKey.update({
          where: { id: keyId },
          data: { 
            isUsed: true,
            orderId: newOrder.id
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: result.id });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'การชำระเงินล้มเหลว' }, { status: 500 });
  }
}