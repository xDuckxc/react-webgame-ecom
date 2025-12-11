# ระบบร้านค้าเกมออนไลน์ (Game E-commerce)

แพลตฟอร์มอีคอมเมิร์ซสำหรับจำหน่ายเกมดิจิทัล พัฒนาด้วย Next.js 16, React 19 และ Prisma ORM พร้อมระบบยืนยันตัวตน, แดชบอร์ดแอดมิน, การจัดการสินค้า และระบบส่งมอบ Key เกมอัตโนมัติ

## 🚀 ฟีเจอร์หลัก

- **ระบบยืนยันตัวตน** - เข้าสู่ระบบ/สมัครสมาชิกที่ปลอดภัยด้วย bcryptjs
- **ระบบจัดการสิทธิ์** - แบ่งบทบาทเป็น USER และ ADMIN
- **แคตตาล็อกสินค้า** - เรียกดูเกมตามหมวดหมู่ พร้อมคะแนนและราคา
- **แดชบอร์ดแอดมิน** - จัดการสินค้าและผู้ใช้งานแบบครบวงจร
- **ระบบ Key เกมดิจิทัล** - ส่งมอบ Key เกมอัตโนมัติเมื่อซื้อสำเร็จ
- **ระบบเติมเงิน** - เติมเงินผ่าน QR Code (SCB PromptPay)
- **Mobile Menu** - เมนูสำหรับมือถือ (Burger Menu)
- **ฐานข้อมูล** - MySQL พร้อม Prisma ORM

## 🛠 เทคโนโลยีที่ใช้

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MySQL with Prisma ORM
- **Authentication**: Custom JWT with bcryptjs
- **Payment**: SCB Developer API (QR Payment)
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## 📋 ความต้องการของระบบ

- Node.js 18.0.0 หรือสูงกว่า
- npm หรือ yarn
- MySQL 8.0 หรือสูงกว่า

## 🔧 การติดตั้ง

### 1. Clone และติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies หลัก
npm install

# ติดตั้ง dependencies ของ Next.js app
npm run install-all
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# SCB Developer API (สำหรับ QR Payment)
SCB_API_KEY="your_scb_api_key"
SCB_BILLER_ID="your_biller_id"
```

### 3. ตั้งค่าฐานข้อมูล

```bash
# Generate Prisma Client
DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom" npm run db:generate

# Push schema ไปยังฐานข้อมูล
DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom" npm run db:push
```

### 4. เริ่มต้น Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### 5. (ทางเลือก) เติมข้อมูลสินค้าอัตโนมัติ

```bash
pip install "sqlalchemy>=2" "pymysql>=1" requests
python3 game-ecommerce/src/app/api.py --fetch --import-db --csv-dir . --db-url "mysql+pymysql://root:@127.0.0.1:3306/game_ecom"
```

## 📁 โครงสร้างโปรเจกต์

```
react-webgame-ecom/
├── game-ecommerce/              # Next.js application
│   ├── src/
│   │   └── app/
│   │       ├── admin/           # หน้าแอดมิน
│   │       ├── api/             # API routes
│   │       │   ├── topup/       # API เติมเงิน
│   │       │   ├── checkout/    # API ชำระเงิน
│   │       │   └── dashboard/   # API แดชบอร์ด
│   │       ├── components/      # React components
│   │       ├── login/           # หน้าเข้าสู่ระบบ
│   │       ├── register/        # หน้าสมัครสมาชิก
│   │       ├── shop/            # หน้าร้านค้า
│   │       ├── topup/           # หน้าเติมเงิน
│   │       ├── inventory/       # คลังเกม
│   │       └── layout.tsx       # Root layout
│   └── public/                  # Static assets
├── prisma/                      # Database configuration
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
└── README.md                    # เอกสารนี้
```

## 🎮 คำสั่งที่ใช้บ่อย

```bash
npm run dev          # เริ่ม development server
npm run build        # Build สำหรับ production
npm run start        # เริ่ม production server
npm run lint         # รัน ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema ไปยังฐานข้อมูล
npm run db:studio    # เปิด Prisma Studio
```

## 🔐 บัญชีแอดมินเริ่มต้น

สร้างบัญชีแอดมินได้ 2 วิธี:

1. สมัครสมาชิกผ่าน UI แล้วเปลี่ยน role เป็น ADMIN ใน Prisma Studio
2. ใช้ Prisma Studio เพื่อสร้างผู้ใช้ใหม่:
   ```bash
   npm run db:studio
   ```

## 💰 ระบบเติมเงิน (Top-Up System)

### วิธีใช้งาน:

1. เข้าสู่ระบบ
2. คลิก Profile → เติมเงิน
3. ระบุจำนวนเงิน
4. กด "สร้าง QR Code"
5. สแกน QR ด้วยแอพธนาคาร (SCB Easy)
6. ชำระเงิน
7. ระบบตรวจสอบอัตโนมัติและเติมเงินให้

### ฟีเจอร์:

- ✅ QR Payment ผ่าน SCB PromptPay
- ✅ Mock QR สำหรับทดสอบ (ถ้า SCB API ไม่พร้อม)
- ✅ Countdown timer 15 นาที
- ✅ Auto-check สถานะทุก 3 วินาที
- ✅ ปุ่มทดสอบชำระเงิน (Mock Mode)

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - สมัครสมาชิก
- `POST /api/login` - เข้าสู่ระบบ

### Products
- `GET /api/products` - ดึงรายการสินค้าทั้งหมด
- `POST /api/products` - เพิ่มสินค้า (Admin เท่านั้น)

### Top-Up
- `POST /api/topup/qr` - สร้าง QR Code
- `POST /api/topup/webhook` - Webhook จาก SCB
- `GET /api/topup/status/[topupId]` - เช็คสถานะ

### Dashboard
- `GET /api/dashboard` - ข้อมูลแดชบอร์ดแอดมิน

## 🚀 การ Deploy

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables สำหรับ Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
SCB_API_KEY="production_api_key"
SCB_BILLER_ID="production_biller_id"
```

## 🆘 แก้ปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล
```bash
# Reset database
rm prisma/dev.db
npm run db:push
```

### ปัญหา Prisma Client
```bash
# Generate Prisma client ใหม่
npm run db:generate
```

### Port ถูกใช้งานอยู่
```bash
# Next.js จะใช้ port ถัดไปอัตโนมัติ
# หรือระบุ port เอง
npm run dev -- -p 3001
```

## 📝 หมายเหตุ

- ระบบเติมเงินใช้ SCB Sandbox สำหรับทดสอบ
- สำหรับ Production ต้องใช้ API Key และ Biller ID จริง
- ต้องตั้งค่า Webhook URL ใน SCB Developer Portal
- ใช้ ngrok สำหรับทดสอบ Webhook ใน Development

## 📄 License

MIT License

## 👨‍💻 ผู้พัฒนา

พัฒนาโดย [Your Name]

---

**เวอร์ชัน:** 2.0  
**อัปเดตล่าสุด:** 11 ธันวาคม 2568
