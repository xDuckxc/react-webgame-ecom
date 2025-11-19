# Game E-commerce Setup Guide

## Prerequisites
- Node.js 18 or higher
- MySQL database server
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install Next.js app dependencies
cd game-ecommerce
npm install
cd ..
```

### 2. Database Setup
1. Create a MySQL database named `game_ecom`
2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/game_ecom"
```

### 3. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Or run migrations (if migration files exist)
npm run db:migrate
```

### 4. Environment Configuration
Create/update `.env` file in the root directory:
```env
DATABASE_URL="mysql://root_admin:root@localhost:8889/game_ecom"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure
```
react-webgame-ecom/
├── game-ecommerce/          # Next.js application
│   ├── src/
│   │   └── app/
│   │       ├── api/         # API routes
│   │       ├── admin/       # Admin panel
│   │       ├── components/  # React components
│   │       ├── login/       # Login page
│   │       ├── register/    # Registration page
│   │       └── shop/        # Shop page
│   ├── public/              # Static assets
│   └── package.json         # Next.js dependencies
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── generated/               # Generated Prisma client
├── .env                     # Environment variables
└── package.json             # Root dependencies
```

## Available Scripts

### Root Level
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run install-all` - Install all dependencies

### Next.js App Level (in game-ecommerce/)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js app
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint

## Features
- User authentication (login/register)
- Role-based access control (USER/ADMIN)
- Product catalog management
- Shopping cart functionality
- Order processing
- Admin dashboard
- Digital key delivery system
- Responsive design with Tailwind CSS

## Admin Access
Default admin credentials (create manually in database):
- Email: admin@example.com
- Password: admin123
- Role: ADMIN

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL server is running
2. Verify database credentials in `.env`
3. Check if database `game_ecom` exists

### Prisma Issues
1. Run `npm run db:generate` after schema changes
2. Use `npm run db:push` for development
3. Use `npm run db:migrate` for production

### Port Conflicts
If port 3000 is in use, Next.js will automatically use the next available port.

## Production Deployment
1. Set production environment variables
2. Run `npm run build`
3. Use `npm run start` or deploy to hosting platform
4. Ensure database is accessible from production environment
