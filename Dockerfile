# syntax = docker/dockerfile:1

# กำหนดเวอร์ชัน Node.js
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# กำหนด working directory หลัก
WORKDIR /react-webgame-ecom

# กำหนด environment เป็น production
ENV NODE_ENV="production"


# --- STAGE 1: BUILD (สร้าง Asset) ---
FROM base AS build

# ติดตั้งแพ็คเกจที่จำเป็นสำหรับ build และทำความสะอาด cache
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# ติดตั้ง Node Modules ของโปรเจกต์หลัก (Root)
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY prisma .
RUN npx prisma generate

# Copy code ส่วนที่เหลือทั้งหมด
COPY . .

# *** แก้ไข: ติดตั้ง Dependencies สำหรับโปรเจกต์ย่อย Next.js ***
# 1. ย้ายไปยังโฟลเดอร์ Next.js ย่อย
WORKDIR /react-webgame-ecom/game-ecommerce
# 2. ติดตั้ง Dependencies ในโฟลเดอร์ย่อย (เพื่อให้หา 'next' เจอ)
RUN npm ci

# 3. ย้ายกลับไปยัง Root Directory
WORKDIR /react-webgame-ecom
# **************************************************************

# Build application (ซึ่งคำสั่งนี้จะไปสั่ง build ใน game-ecommerce ต่อตามที่คุณตั้งค่าไว้)
RUN npm run build

# ลบ dependencies ที่ใช้สำหรับพัฒนาออก
RUN npm prune --omit=dev


# --- STAGE 2: FINAL (สำหรับ Production) ---
FROM base

# ติดตั้งแพ็คเกจที่จำเป็นสำหรับการ Deploy
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application จาก Stage Build
COPY --from=build /react-webgame-ecom /react-webgame-ecom

# กำหนด Environment Port สำหรับ Node.js/Next.js
ENV PORT=3000

# Start the server (รัน npm start ที่ /app ซึ่งจะสั่ง start app Next.js ต่อไป)
EXPOSE 3000
CMD [ "npm", "run", "start" ]