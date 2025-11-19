import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ตรวจสอบว่า path นี้ถูกต้อง
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    console.log("--- API VERSION FIXED LOADED ---"); // เช็คบรรทัดนี้ใน Terminal

    const body = await req.json();
    const { username, email, password } = body;

    console.log("Register Request:", { username, email });

    // 1. Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // 2. เช็ค Email ซ้ำ (ใช้ findFirst)
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: email 
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. สร้าง User (ปล่อยให้ Role เป็น Default)
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        // role: 'USER', // ลบออก ให้ DB ใส่ค่า default เอง ป้องกัน Error
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Full Register Error:', error); // ดู Error เต็มๆ ที่นี่
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}