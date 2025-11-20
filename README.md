# Game E-commerce Web Application

A modern e-commerce platform for digital games built with Next.js 16, React 19, and Prisma ORM. Features user authentication, admin dashboard, product management, and digital key delivery system.

## 🚀 Features

- **User Authentication** - Secure login/register with bcryptjs encryption
- **Role-based Access Control** - USER and ADMIN roles with different permissions
- **Product Catalog** - Browse games by categories with ratings and pricing
- **Admin Dashboard** - Comprehensive admin panel for managing products and users
- **Digital Key System** - Automated delivery of game keys upon purchase
- **Responsive Design** - Mobile-first design with Tailwind CSS 4
- **Database Management** - MySQL database with Prisma ORM

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MySQL with Prisma ORM
- **Authentication**: Custom JWT with bcryptjs
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install Next.js app dependencies  
npm run install-all
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client (ใช้ตัวแปรรันคู่)
DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom" npm run db:generate

# Push schema (dev) หรือ migrate (prod)
DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom" npm run db:push
# DATABASE_URL="mysql://root:@127.0.0.1:3306/game_ecom" npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. (Optional) เติมข้อมูลสินค้าอัตโนมัติจาก FreeToGame API

```bash
pip install "sqlalchemy>=2" "pymysql>=1" requests
python3 game-ecommerce/src/app/api.py --fetch --import-db --csv-dir . --db-url "mysql+pymysql://root:@127.0.0.1:3306/game_ecom"
```
- ดึงเกมจาก API แตกไฟล์ CSV ตามหมวดหมู่
- นำเข้าข้อมูลสินค้า (รวมรูป `thumbnail`) ลงฐาน MySQL อัตโนมัติ  
  > ถ้าไม่ต้องการส่งรูปไป git ให้ลบไฟล์ CSV ออกจาก repo หรือเพิ่ม `.gitignore`

## 📁 Project Structure

```
react-webgame-ecom/
├── game-ecommerce/              # Next.js application
│   ├── src/
│   │   └── app/
│   │       ├── admin/           # Admin dashboard pages
│   │       ├── api/             # API routes
│   │       ├── components/      # React components
│   │       ├── login/           # Authentication pages
│   │       ├── register/        # User registration
│   │       ├── shop/            # Product catalog
│   │       ├── layout.tsx       # Root layout
│   │       ├── page.tsx         # Home page
│   │       └── globals.css      # Global styles
│   ├── public/                  # Static assets
│   └── package.json             # Next.js dependencies
├── prisma/                      # Database configuration
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── dev.db                   # SQLite database file
├── generated/                   # Generated Prisma client
├── .env                         # Environment variables
├── package.json                 # Root dependencies
├── SETUP.md                     # Detailed setup guide
└── TECHNICAL_REQUIREMENTS.md    # Technical specifications
```

## 🎮 Available Scripts

### Root Level Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run install-all  # Install all dependencies
```

## 🔐 Default Admin Access

To create an admin user, you can:

1. Register a normal user through the UI
2. Use Prisma Studio to change the role to ADMIN:
   ```bash
   npm run db:studio
   ```
3. Or manually insert an admin user into the database

## 🎯 Key Features Breakdown

### User Management
- Secure user registration and authentication
- Password encryption with bcryptjs
- Role-based access control (USER/ADMIN)
- User balance management for purchases

### Product Management
- Complete CRUD operations for game products
- Category-based organization
- Rating system and pricing management
- Image upload and management
- Digital key inventory system

### Admin Dashboard
- User management interface
- Product catalog management
- Order tracking and management
- System analytics and reporting

### E-commerce Features
- Shopping cart functionality
- Order processing system
- Digital key delivery
- Purchase history tracking

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User authentication

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (Admin only)

### Users
- `GET /api/users` - List users (Admin only)

### Dashboard
- `GET /api/dashboard` - Admin dashboard data

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [TECHNICAL_REQUIREMENTS.md](./TECHNICAL_REQUIREMENTS.md) - Technical specifications
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Reset database
rm prisma/dev.db
npm run db:push
```

**Prisma Client Issues**
```bash
# Regenerate Prisma client
npm run db:generate
```

**Port Already in Use**
- Next.js will automatically use the next available port
- Or specify a different port: `npm run dev -- -p 3001`

For more detailed troubleshooting, see [SETUP.md](./SETUP.md).
