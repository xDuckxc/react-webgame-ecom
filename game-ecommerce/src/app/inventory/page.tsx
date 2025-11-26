'use client';

import { useEffect, useState } from 'react';
import { Package, Key, Copy, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface MyProductKey {
  id: string;
  code: string;
  product: { 
    title: string;
    image: string | null;
    category: string;
  };
  purchaseDate: string;
}

export default function InventoryPage() {
  const [keys, setKeys] = useState<MyProductKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const storedUser = localStorage.getItem('user_session');
        if (!storedUser) {
            setLoading(false);
            return;
        }
        
        const { id } = JSON.parse(storedUser);

        const res = await fetch(`/api/inventory?userId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setKeys(data);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package className="text-purple-500" size={32} />
          คลังสินค้าของฉัน (My Inventory)
        </h1>

        {keys.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg mb-4">คุณยังไม่มีสินค้าในครอบครอง</p>
            <Link href="/shop" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition inline-block">
              ไปเลือกซื้อสินค้ากันเถอะ
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {keys.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-purple-500/30 transition-all shadow-lg">
                {/* รูปสินค้า */}
                <div className="w-full md:w-48 h-32 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800 relative">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">No Image</div>
                  )}
                </div>

                {/* รายละเอียด */}
                <div className="flex-1 text-center md:text-left w-full">
                  <div className="inline-block bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-xs mb-2 border border-purple-500/20 uppercase font-bold tracking-wider">
                    {item.product.category}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.product.title}</h3>
                  <p className="text-slate-500 text-sm">วันที่ซื้อ: {new Date(item.purchaseDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                </div>

                {/* ส่วนแสดง Key */}
                <div className="w-full md:w-auto bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2 min-w-[280px]">
                  <span className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Key size={12} /> Product Key / Code
                  </span>
                  <div className="flex items-center justify-between bg-slate-900 rounded border border-slate-800 p-2 relative group">
                    <code className="text-purple-400 font-mono font-bold text-lg tracking-wider truncate px-2">
                      {item.code}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(item.code, item.id)}
                      className="ml-3 text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded hover:bg-slate-700"
                      title="Copy Key"
                    >
                      {copiedId === item.id ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}