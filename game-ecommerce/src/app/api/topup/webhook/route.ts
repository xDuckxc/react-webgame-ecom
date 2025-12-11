import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, billPaymentRef1, amount } = body;

    if (!transactionId || !billPaymentRef1) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const topupId = billPaymentRef1;

    await prisma.$transaction(async (tx) => {
      const topup = await tx.topUp.findUnique({
        where: { id: topupId }
      });

      if (!topup) throw new Error('ไม่พบรายการเติมเงิน');
      if (topup.status === 'COMPLETED') return;

      await tx.topUp.update({
        where: { id: topupId },
        data: { status: 'COMPLETED' }
      });

      await tx.user.update({
        where: { id: topup.userId },
        data: { balance: { increment: Math.floor(topup.amount) } }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
