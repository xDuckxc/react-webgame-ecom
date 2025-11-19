import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { // เลือกเฉพาะข้อมูลที่จะแสดง (ไม่เอา Password)
        id: true,
        email: true,
        username: true,
        role: true,
        balance: true,
        createdAt: true
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}