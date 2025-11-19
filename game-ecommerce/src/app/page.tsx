'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle } from 'lucide-react';
import HeroSection from '@/app/components/home/HeroSection'; // Import จากไฟล์ที่กำลังจะสร้าง
import GameCard from '@/app/components/GameCard'; // Import จากไฟล์ GameCard
import { GameProduct } from '@/app/shop/page'; // Import Type จากหน้า Shop

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [featuredGames, setFeaturedGames] = useState<GameProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // ⭐ เปลี่ยนเป็น /api/products เพื่อดึงข้อมูลจริง
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // เลือก 3 เกมแรก (หรือ 3 เกมล่าสุด) มาแสดงเป็น Featured
        setFeaturedGames(data.slice(0, 3));

      } catch (err) {
        console.error("Failed to fetch featured games", err);
        setError("ไม่สามารถโหลดข้อมูลเกมแนะนำได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              เกมยอดฮิต <span className="text-purple-500">ประจำสัปดาห์</span>
            </h2>
            <p className="text-slate-400 text-sm">เกมขายดีที่เราคัดสรรมาเพื่อคุณโดยเฉพาะ</p>
          </div>
          
          <Link href="/shop" className="group flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium">
            ดูทั้งหมด
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-900 rounded-2xl h-[420px] animate-pulse border border-slate-800">
                <div className="h-64 bg-slate-800/50 rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-800/50 rounded w-3/4" />
                  <div className="h-4 bg-slate-800/50 rounded w-1/2" />
                  <div className="pt-4 flex justify-between items-center">
                    <div className="h-8 bg-slate-800/50 rounded w-24" />
                    <div className="h-10 w-10 bg-slate-800/50 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-16 bg-red-900/10 border border-red-900/30 rounded-3xl">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          // Success State
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* 3. Banner Promotion (Call to Action) */}
      <div className="relative py-24 mt-10 overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-purple-900/20 border-y border-purple-500/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay fixed-bg" />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            พร้อมที่จะเริ่ม <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">การผจญภัยครั้งใหม่</span> หรือยัง?
          </h2>
          <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
            สมัครสมาชิกวันนี้ รับโค้ดส่วนลดพิเศษทันที <span className="text-white font-bold bg-purple-600 px-2 py-0.5 rounded">10% OFF</span> สำหรับการสั่งซื้อครั้งแรก
            พร้อมเข้าถึงเกมระดับ AAA ในราคาที่จับต้องได้
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/shop" 
              className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl shadow-purple-900/20 transform hover:-translate-y-1"
            >
              🛒 เลือกซื้อเกมเลย
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/30 border border-purple-400/20 transform hover:-translate-y-1"
            >
              ✨ สมัครสมาชิกฟรี
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}