import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // import จากไฟล์ที่สร้างข้างบน
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // 1. รับค่าจาก Form
    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isNew = formData.get('isNew') === 'true'; // รับค่า Boolean
    const keysString = formData.get('keys') as string;
    const imageFile = formData.get('image') as File | null;

    // 2. จัดการรูปภาพ (Upload)
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // 3. จัดการ Keys (แปลง JSON String -> Array)
    let keysData: string[] = [];
    if (keysString) {
      try {
        keysData = JSON.parse(keysString);
      } catch (e) {
        return NextResponse.json({ message: 'Invalid keys format' }, { status: 400 });
      }
    }

    // 4. ⭐ บันทึกลง Database ด้วย Prisma (Create Product + Keys)
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price,
        originalPrice,
        category,
        image: imageUrl,
        isNew,
        // สร้าง ProductKey เชื่อมกับ Product นี้ทันที
        keys: {
          create: keysData.map((code) => ({
            code: code,
            isUsed: false
          }))
        }
      },
      include: {
        keys: true // ส่งข้อมูล keys กลับมาดูด้วย
      }
    });

    return NextResponse.json({ message: 'Success', product: newProduct });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET: ดึงสินค้าทั้งหมด พร้อมจำนวน Stock
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: {
          // ⭐ สำคัญ: นับเฉพาะ keys ที่ยังไม่ถูกใช้ (isUsed: false)
          select: { keys: { where: { isUsed: false } } } 
        }
      },
      orderBy: {
        createdAt: 'desc' // เรียงจากใหม่ไปเก่า
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}