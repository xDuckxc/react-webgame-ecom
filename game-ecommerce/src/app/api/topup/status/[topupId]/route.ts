import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { topupId: string } }) {
  try {
    const { topupId } = params;

    const topup = await prisma.topUp.findUnique({
      where: { id: topupId },
      include: { user: { select: { balance: true } } }
    });

    if (!topup) {
      return NextResponse.json({ error: 'ไม่พบรายการเติมเงิน' }, { status: 404 });
    }

    return NextResponse.json({
      topupId: topup.id,
      status: topup.status,
      amount: topup.amount,
      balance: topup.user.balance,
      expiresAt: topup.expiresAt
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
