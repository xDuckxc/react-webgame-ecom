'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, Calendar, Key, AlertCircle } from 'lucide-react';

// กำหนด Type ให้ตรงกับข้อมูลที่ API ส่งมา
interface Product {
  id: string;
  title: string;
  price: number;
  image: string | null;
  category: string;
  createdAt: string;
  _count: {
    keys: number; // จำนวน stock ที่ได้จากการนับ
  };
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ฟังก์ชันค้นหา
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันแปลงวันที่
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Package className="text-purple-500" /> รายการสินค้า ({products.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">จัดการสินค้าและตรวจสอบสถานะ Keys</p>
        </div>
        
        <Link 
          href="/admin/products/add" 
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อเกม, หมวดหมู่..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-sm">
              <tr>
                <th className="p-4 font-semibold">สินค้า</th>
                <th className="p-4 font-semibold">หมวดหมู่</th>
                <th className="p-4 font-semibold text-center">Keys คงเหลือ</th>
                <th className="p-4 font-semibold">ราคา</th>
                <th className="p-4 font-semibold">
                    <div className="flex items-center gap-1">
                        <Calendar size={14}/> วันที่เพิ่ม
                    </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                    <AlertCircle size={32} />
                    <span className="mt-2">ไม่พบข้อมูลสินค้า</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/50 transition-colors group">
                    
                    {/* 1. ชื่อและรูป */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 relative">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">{product.title}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {product.id.slice(0,8)}...</div>
                        </div>
                      </div>
                    </td>

                    {/* 2. หมวดหมู่ */}
                    <td className="p-4">
                       <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm border border-slate-700">
                         {product.category}
                       </span>
                    </td>

                    {/* 3. Keys (Stock) */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <Key size={16} className={product._count.keys > 0 ? "text-green-400" : "text-red-400"} />
                        <span className={`font-bold text-lg ${product._count.keys > 0 ? "text-green-400" : "text-red-500"}`}>
                          {product._count.keys}
                        </span>
                      </div>
                      {product._count.keys === 0 && (
                        <div className="text-[10px] text-red-400 uppercase font-bold mt-1">Out of Stock</div>
                      )}
                    </td>

                    {/* 4. ราคา */}
                    <td className="p-4 font-mono text-purple-300 text-base">
                      ฿{product.price.toLocaleString()}
                    </td>

                    {/* 5. วันที่ */}
                    <td className="p-4 text-sm text-slate-400">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}