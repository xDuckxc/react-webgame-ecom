'use client';

import Link from 'next/link';
import { Gamepad2, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative h-[600px] flex items-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
          alt="Gaming Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Gamepad2 size={16} />
            <span>The Ultimate Game Store</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Discover Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">Next Adventure</span>
          </h1>
          
          <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
            แหล่งรวมเกมลิขสิทธิ์แท้ราคาถูกกว่า 5,000+ เกม พร้อมรับประกันสินค้าและการจัดส่งคีย์อัตโนมัติทันทีตลอด 24 ชม.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/shop"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2 group"
            >
              Explore Store
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/about"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all backdrop-blur-md"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/10 flex gap-8 sm:gap-12">
            <div>
              <div className="text-3xl font-bold text-white">5K+</div>
              <div className="text-slate-500 text-sm mt-1">Games</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-slate-500 text-sm mt-1">Secure</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-slate-500 text-sm mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}