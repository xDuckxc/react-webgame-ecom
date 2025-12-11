import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const topup = await prisma.topUp.create({
      data: {
        userId,
        amount,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    let qrImage = '';
    let transactionId = `TXN-${Date.now()}`;
    let useMock = false;

    if (process.env.SCB_API_KEY && process.env.SCB_BILLER_ID) {
      try {
        const scbResponse = await fetch('https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${process.env.SCB_API_KEY}`,
            'resourceOwnerId': process.env.SCB_BILLER_ID,
            'requestUId': `REQ-${Date.now()}`
          },
          body: JSON.stringify({
            qrType: 'PP',
            amount: amount.toFixed(2),
            ppType: 'BILLERID',
            ppId: process.env.SCB_BILLER_ID,
            ref1: topup.id.substring(0, 20),
            ref2: userId.substring(0, 20),
            ref3: 'TOPUP'
          })
        });

        const responseText = await scbResponse.text();
        
        if (scbResponse.ok && responseText.startsWith('{')) {
          const scbData = JSON.parse(responseText);
          if (scbData.data?.qrImage) {
            qrImage = scbData.data.qrImage;
            transactionId = scbData.data.transactionId || transactionId;
            console.log('✅ Using real SCB QR Code');
          } else {
            useMock = true;
          }
        } else {
          useMock = true;
        }
      } catch (error) {
        useMock = true;
      }
    } else {
      useMock = true;
    }

    if (useMock) {
      console.log('⚠️  Using Mock QR Code');
      qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TOPUP-${topup.id}-${amount}`;
    }

    await prisma.topUp.update({
      where: { id: topup.id },
      data: { qrImage, transactionId }
    });

    return NextResponse.json({
      success: true,
      topupId: topup.id,
      qrImage,
      amount,
      expiresAt: topup.expiresAt,
      isMock: useMock
    });

  } catch (error: any) {
    console.error('QR Generate Error:', error);
    return NextResponse.json({ error: error.message || 'สร้าง QR Code ล้มเหลว' }, { status: 500 });
  }
}
