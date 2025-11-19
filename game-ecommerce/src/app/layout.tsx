import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// เช็ค path ให้ถูกต้องตามโครงสร้างโฟลเดอร์จริงของคุณ
import Navbar from "@/app/components/navbar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// เก็บไว้แค่อันเดียว และแก้ไขข้อมูลให้ตรงกับเว็บ GameZone
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        {/* 1. ใส่ Navbar ไว้ตรงนี้ เพื่อให้แสดงทุกหน้า */}
        <Navbar />
        
        {/* 2. ใส่ Main Wrapper เพื่อคุมเนื้อหา */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}