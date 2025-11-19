'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, Star, Package } from 'lucide-react';
import { GameProduct } from '@/app/shop/page';

interface GameCardProps {
  game: GameProduct;
}

export default function GameCard({ game }: GameCardProps) {
  // คำนวณเปอร์เซ็นต์ส่วนลด (ถ้ามีราคาเต็ม)
  const discountPercentage = game.originalPrice 
    ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col h-full">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-56 overflow-hidden bg-slate-950">
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

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {game.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              NEW
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Overlay Buttons (Show on Hover) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button className="p-3 bg-white text-slate-900 rounded-full hover:bg-purple-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl">
            <ShoppingCart size={20} />
          </button>
          <button className="p-3 bg-slate-800 text-white rounded-full hover:bg-red-500 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-xl">
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-grow relative">
        {/* Category */}
        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">
          {game.category}
        </div>

        {/* Title */}
        <Link href={`/shop/${game.id}`} className="block flex-grow">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-purple-400 transition-colors line-clamp-2 mb-1">
            {game.title}
          </h3>
        </Link>

        {/* Rating (Mockup) */}
        <div className="flex items-center gap-1 mb-4">
           {[...Array(5)].map((_, i) => (
             <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
           ))}
           <span className="text-xs text-slate-500 ml-1">(4.8)</span>
        </div>

        {/* Price Section */}
        <div className="pt-4 border-t border-slate-800 mt-auto flex justify-between items-end">
          <div>
            {game.originalPrice && (
              <div className="text-xs text-slate-500 line-through mb-0.5">
                ฿{game.originalPrice.toLocaleString()}
              </div>
            )}
            <div className="text-xl font-bold text-white font-mono">
              <span className="text-purple-400">฿</span>
              {game.price.toLocaleString()}
            </div>
          </div>

          <button className="text-xs font-bold text-white bg-slate-800 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors">
            รายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
}