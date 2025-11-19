'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import GameCard from '@/app/components/GameCard'; // Import จาก components

// Type สำหรับข้อมูลเกมที่ดึงมาจาก API
export interface GameProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image?: string | null;
  isNew?: boolean;
}

const CATEGORIES = ['All', 'Action', 'RPG', 'Adventure', 'Strategy', 'Sport', 'Simulation'];

export default function ShopPage() {
  // --- STATE MANAGEMENT ---
  const [games, setGames] = useState<GameProduct[]>([]); 
  const [isLoading, setIsLoading] = useState(true);      
  const [error, setError] = useState<string | null>(null); 
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- 1. REAL DATA FETCHING ---
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null); 

        // ⭐ เรียก API /api/products ที่เราสร้างไว้
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setGames(data); 

      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError("ไม่สามารถโหลดข้อมูลเกมได้ในขณะนี้");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchGames();
  }, []);

  // --- 2. FILTER LOGIC ---
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Game<span className="text-purple-500">Store</span>
            </h1>
            <p className="text-slate-400">เลือกซื้อเกมลิขสิทธิ์แท้ ในราคาที่คุ้มค่าที่สุด</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <input
              type="text"
              placeholder="ค้นหาเกม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm text-white placeholder-slate-500 backdrop-blur-sm"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar mask-linear-fade">
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 backdrop-blur-sm sticky left-0 z-10">
             <SlidersHorizontal className="w-5 h-5 text-slate-400" />
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- CONTENT AREA --- */}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-900 rounded-2xl h-[380px] animate-pulse border border-slate-800">
                <div className="h-56 bg-slate-800/50 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-800/50 rounded w-3/4" />
                  <div className="h-4 bg-slate-800/50 rounded w-1/2" />
                  <div className="pt-6 flex justify-between items-center">
                    <div className="h-8 bg-slate-800/50 rounded w-24" />
                    <div className="h-10 w-10 bg-slate-800/50 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) 
        /* Error State */
        : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-900/10 border border-red-900/30 rounded-3xl">
            <div className="p-4 bg-red-900/20 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-400">{error}</h3>
            <p className="text-slate-400 text-sm mt-2">โปรดตรวจสอบการเชื่อมต่อ API ของคุณ</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-slate-800 rounded-full text-sm font-bold hover:bg-slate-700 transition border border-slate-700"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )
        /* Success State */
        : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) 
        /* Not Found State */
        : (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-600">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-300">ไม่พบเกมที่คุณค้นหา</h3>
            <p className="text-slate-500 mt-2">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

      </div>
    </div>
  );
}