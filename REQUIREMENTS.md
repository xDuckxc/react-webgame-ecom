# ความต้องการของระบบ (System Requirements)

## 📋 ความต้องการด้านซอฟต์แวร์

### ระบบปฏิบัติการ
- Windows 10/11
- macOS 10.15 หรือสูงกว่า
- Linux (Ubuntu 20.04 LTS หรือสูงกว่า)

### Runtime & Tools
- **Node.js**: 18.0.0 หรือสูงกว่า
- **npm**: 9.0.0 หรือสูงกว่า (มากับ Node.js)
- **MySQL**: 8.0 หรือสูงกว่า
- **Git**: สำหรับ version control

### เบราว์เซอร์ที่รองรับ
- Google Chrome (แนะนำ)
- Mozilla Firefox
- Microsoft Edge
- Safari

## 💻 ความต้องการด้านฮาร์ดแวร์

### สำหรับ Development
- **CPU**: Intel Core i5 หรือเทียบเท่า
- **RAM**: 8 GB ขึ้นไป (แนะนำ 16 GB)
- **Storage**: 10 GB พื้นที่ว่าง
- **Internet**: สำหรับดาวน์โหลด dependencies

### สำหรับ Production
- **CPU**: 2 cores ขึ้นไป
- **RAM**: 4 GB ขึ้นไป
- **Storage**: 20 GB ขึ้นไป
- **Bandwidth**: ขึ้นอยู่กับจำนวนผู้ใช้

## 📦 Dependencies หลัก

### Frontend
```json
{
  "next": "^16.0.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^4.0.0"
}
```

### Backend & Database
```json
{
  "@prisma/client": "^6.19.0",
  "prisma": "^6.19.0",
  "bcryptjs": "^2.4.3"
}
```

### UI & Icons
```json
{
  "lucide-react": "latest"
}
```

## 🔧 การติดตั้ง Dependencies

### 1. ติดตั้ง Node.js
```bash
# ตรวจสอบเวอร์ชัน
node --version  # ควรเป็น v18.0.0 ขึ้นไป
npm --version   # ควรเป็น v9.0.0 ขึ้นไป
```

### 2. ติดตั้ง MySQL
```bash
# macOS (ใช้ Homebrew)
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql

# Windows
# ดาวน์โหลดจาก https://dev.mysql.com/downloads/mysql/
```

### 3. ติดตั้ง Project Dependencies
```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# ติดตั้ง dependencies ของ Next.js app
npm run install-all
```

## 🗄️ การตั้งค่าฐานข้อมูล

### สร้าง Database
```sql
CREATE DATABASE game_ecom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ตั้งค่า User (ถ้าจำเป็น)
```sql
CREATE USER 'root_admin'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON game_ecom.* TO 'root_admin'@'localhost';
FLUSH PRIVILEGES;
```

### ตั้งค่า Environment Variables
```env
DATABASE_URL="mysql://root_admin:root@127.0.0.1:3306/game_ecom"
```

## 🔐 ความต้องการด้านความปลอดภัย

### Environment Variables ที่จำเป็น
- `DATABASE_URL` - URL เชื่อมต่อฐานข้อมูล
- `NEXTAUTH_SECRET` - Secret key สำหรับ authentication
- `NEXTAUTH_URL` - URL ของแอปพลิเคชัน
- `SCB_API_KEY` - API Key จาก SCB Developer (ถ้าใช้ QR Payment)
- `SCB_BILLER_ID` - Biller ID จาก SCB Developer

### การรักษาความปลอดภัย
- ไม่ commit `.env` ลง Git
- ใช้ HTTPS ใน Production
- เปลี่ยน `NEXTAUTH_SECRET` เป็นค่าที่ปลอดภัย
- ใช้ strong password สำหรับ database

## 🌐 ความต้องการด้าน Network

### Development
- Port 3000 (Next.js dev server)
- Port 3306 (MySQL)
- Internet connection (สำหรับ SCB API)

### Production
- Port 80/443 (HTTP/HTTPS)
- Port 3306 (MySQL - ควรจำกัดการเข้าถึง)
- SSL Certificate (แนะนำ)

## 📱 SCB Developer API (สำหรับ QR Payment)

### ความต้องการ
- บัญชี SCB Developer (https://developer.scb/)
- API Key (Sandbox หรือ Production)
- Biller ID
- Webhook URL (ต้องเป็น HTTPS ใน Production)

### สำหรับ Development
```bash
# ใช้ ngrok สำหรับ Webhook testing
ngrok http 3000
```

## 🧪 ความต้องการสำหรับ Testing

### Tools
- Jest (สำหรับ unit testing)
- Cypress (สำหรับ E2E testing)
- Postman (สำหรับ API testing)

### Test Database
```env
TEST_DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom_test"
```

## 📊 ความต้องการด้าน Performance

### Minimum
- Response time < 2 วินาที
- Database query time < 500ms
- Page load time < 3 วินาที

### Recommended
- Response time < 1 วินาที
- Database query time < 200ms
- Page load time < 1.5 วินาที

## 🔄 ความต้องการด้าน Backup

### Database Backup
```bash
# Backup database
mysqldump -u root_admin -p game_ecom > backup.sql

# Restore database
mysql -u root_admin -p game_ecom < backup.sql
```

### Backup Schedule (แนะนำ)
- Daily: Database backup
- Weekly: Full system backup
- Monthly: Archive backup

## 📞 การติดต่อและการสนับสนุน

### เอกสารเพิ่มเติม
- README.md - คู่มือการใช้งาน
- API Documentation - เอกสาร API
- SCB Developer Docs - https://developer.scb/

### ปัญหาที่พบบ่อย
- ดูที่ README.md ส่วน "แก้ปัญหา"
- เช็ค GitHub Issues
- ติดต่อทีมพัฒนา

---

**หมายเหตุ:** ความต้องการนี้อาจเปลี่ยนแปลงตามเวอร์ชันของโปรเจกต์
