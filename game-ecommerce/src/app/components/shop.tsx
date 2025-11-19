import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

// ประกาศ Interface ไว้ เพื่อให้ Type ปลอดภัยเมื่อต่อ DB ในอนาคต
export interface GameProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  rating: number;
  imageUrl?: string; // ใส่ ? ไว้เผื่อบางอันไม่มีรูป
}

interface GameCardProps {
  game: GameProduct;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col h-full">
      
      {/* ส่วนรูปภาพ (Image Placeholder) */}
      <div className="relative h-48 bg-slate-800 w-full overflow-hidden group-hover:scale-105 transition-transform duration-500">
        {/* ถ้ามีรูปจริงให้ใช้ <Image /> ของ Next.js แทนตรงนี้ */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-600">
           {game.imageUrl ? (
             <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
           ) : (
             <span className="text-4xl font-bold opacity-20">GAME</span>
           )}
        </div>
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">
          {game.category}
        </span>
      </div>

      {/* ส่วนเนื้อหา */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
            {game.title}
          </h3>
        </div>
        
        <div className="flex items-center mb-4 space-x-1">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm text-slate-400">{game.rating}</span>
        </div>

        {/* ส่วนราคาและปุ่ม - ดันลงไปล่างสุดด้วย mt-auto */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            ฿{game.price.toLocaleString()}
          </span>
          
          <button className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-purple-500/20">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;