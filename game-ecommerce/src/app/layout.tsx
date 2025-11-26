import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Import Context และ Components ที่เราสร้างไว้
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/app/components/navbar';        // ตรวจสอบ Path ว่าไฟล์อยู่ที่ components/Navbar หรือ app/components/navbar
import CartSidebar from '@/app/components/CartSidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameZone",
  description: "E-commerce for Gamers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {/* 2. ครอบ CartProvider เป็นชั้นนอกสุด */}
        <CartProvider>
          
          {/* Navbar อยู่ใน Provider เพื่อให้เข้าถึงจำนวนสินค้าในตะกร้าได้ */}
          <Navbar />
          
          <main className="min-h-screen pt-4">
            {children}
          </main>

          {/* ใส่ CartSidebar ไว้ตรงนี้ เพื่อให้มันลอยทับหน้าเว็บได้ทุกหน้า */}
          <CartSidebar />
          
        </CartProvider>
      </body>
    </html>
  );
}