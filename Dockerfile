# syntax = docker/dockerfile:1

# กำหนดเวอร์ชัน Node.js
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# กำหนด working directory หลัก (ใช้ตามที่คุณตั้งมา)
WORKDIR /react-webgame-ecom

# --- หมายเหตุ: ลบ ENV NODE_ENV="production" จากตรงนี้ออกชั่วคราว ---
# เพื่อให้ขั้นตอน Build สามารถใช้เครื่องมือ Dev (เช่น PostCSS/Tailwind) ได้สะดวกที่สุด


# --- STAGE 1: BUILD (สร้าง Asset) ---
FROM base AS build

# ติดตั้งแพ็คเกจที่จำเป็นสำหรับ build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# ติดตั้ง Node Modules ของโปรเจกต์หลัก (Root)
COPY package-lock.json package.json ./
# ใช้ --include=dev เพื่อให้ได้เครื่องมือ Build ครบถ้วน
RUN npm ci --include=dev

# Generate Prisma Client
COPY prisma .
RUN npx prisma generate

# Copy code ส่วนที่เหลือทั้งหมด
COPY . .

# *** จุดที่แก้ไขสำคัญ ***
# 1. ย้ายไปยังโฟลเดอร์ Next.js ย่อย
WORKDIR /react-webgame-ecom/game-ecommerce

# 2. ติดตั้ง Dependencies ในโฟลเดอร์ย่อย **พร้อมกับ devDependencies**
# ต้องมี --include=dev เพื่อให้ติดตั้ง TailwindCSS และ PostCSS ได้
RUN npm ci --include=dev

# 3. ย้ายกลับไปยัง Root Directory
WORKDIR /react-webgame-ecom
# **********************

# Build application
RUN npm run build

# ลบ dependencies ที่ไม่จำเป็นออกเพื่อลดขนาด Image
RUN npm prune --omit=dev


# --- STAGE 2: FINAL (สำหรับ Production) ---
FROM base

# *** ตั้งค่า Production Environment ที่นี่แทน ***
ENV NODE_ENV="production"

# ติดตั้งแพ็คเกจที่จำเป็นสำหรับการ Deploy
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application จาก Stage Build
COPY --from=build /react-webgame-ecom /react-webgame-ecom

# กำหนด Environment Port
ENV PORT=3000

# Start the server
EXPOSE 3000
CMD [ "npm", "run", "start" ]