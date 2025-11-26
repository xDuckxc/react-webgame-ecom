'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Package, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext'; // Import Context ที่เพิ่งสร้าง

// Interface ต้องตรงกับข้อมูลที่ส่งมาจากหน้า Shop
interface GameProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image?: string | null;
  rating?: number;
}

interface GameCardProps {
  game: GameProduct;
}

export default function GameCard({ game }: GameCardProps) {
  const { addToCart } = useCart(); // เรียกใช้ hook

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col h-full">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
             <Package size={48} opacity={0.5} />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700/50">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
            {game.category}
          </span>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/shop/${game.id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-purple-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
        </Link>

        {/* Rating (Mockup หรือรับจาก DB) */}
        <div className="flex items-center gap-1 mb-4">
           {[...Array(5)].map((_, i) => (
             <Star key={i} size={12} className={`fill-current ${i < (game.rating || 4) ? 'text-yellow-500' : 'text-slate-700'}`} />
           ))}
           <span className="text-xs text-slate-500 ml-1">({game.rating || 4.5})</span>
        </div>

        {/* Footer: Price & Button */}
        <div className="pt-4 border-t border-slate-800 mt-auto flex justify-between items-center">
          <div>
            {game.originalPrice && (
              <div className="text-xs text-slate-500 line-through">
                ฿{game.originalPrice.toLocaleString()}
              </div>
            )}
            <div className="text-xl font-bold text-white">
              <span className="text-purple-500 text-sm mr-0.5">฿</span>
              {game.price.toLocaleString()}
            </div>
          </div>

          <button 
            onClick={() => addToCart(game)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg shadow-purple-900/20"
          >
            <Plus size={16} strokeWidth={3} />
            <span className="hidden sm:inline">เพิ่ม</span>
          </button>
        </div>
      </div>
    </div>
  );
}