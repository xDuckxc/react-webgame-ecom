'use client';

import { useState } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // ดึง User จาก LocalStorage แบบ Manual เพื่อความชัวร์ (หรือจะดึงจาก Context ก็ได้ถ้ามี)
  const getUser = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user_session');
        return stored ? JSON.parse(stored) : null;
    }
    return null;
  };

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    const user = getUser();
    
    if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนชำระเงิน');
        // อาจจะ redirect ไปหน้า login
        // router.push('/login');
        return;
    }
    
    // Confirm Dialog
    if (!confirm(`ยืนยันการชำระเงินยอดรวม ฿${totalPrice.toLocaleString()}?`)) return;

    setIsProcessing(true);

    try {
      // เรียก API ตัดเงิน
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cartItems: cart
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'เกิดข้อผิดพลาดในการชำระเงิน');
      }

      // สำเร็จ!
      clearCart(); // ล้างตะกร้า
      setIsCartOpen(false); // ปิด Sidebar
      
      // แจ้งเตือน User
      alert('🎉 ชำระเงินสำเร็จ! คุณได้รับ Key เกมเรียบร้อยแล้ว');
      
      // พาไปหน้า Inventory
      router.push('/inventory');

    } catch (error: any) {
      alert(`❌ ไม่สามารถชำระเงินได้: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="flex-1 flex flex-col bg-slate-900 shadow-2xl border-l border-slate-800 h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="text-purple-500" /> 
              ตะกร้าสินค้า <span className="text-sm font-normal text-slate-400">({cart.length})</span>
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
                <ShoppingCart className="w-16 h-16 opacity-20" />
                <p>ตะกร้าของคุณยังว่างอยู่</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-800" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h4 className="text-white font-medium line-clamp-1 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-2 py-1 border border-slate-800">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-white"><Minus size={12} /></button>
                        <span className="text-white text-xs w-4 text-center font-mono">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-white"><Plus size={12} /></button>
                      </div>
                      <div className="text-purple-400 font-bold text-sm">฿{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-500 self-start p-1"><Trash2 size={16} /></button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="bg-slate-950 border-t border-slate-800 p-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300 font-semibold">ยอดรวม</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ฿{totalPrice.toLocaleString()}
                </span>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> กำลังประมวลผล...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} /> ยืนยันการชำระเงิน
                  </>
                )}
              </button>
              
              <button onClick={clearCart} disabled={isProcessing} className="w-full text-xs text-slate-500 hover:text-red-400">
                ล้างตะกร้าสินค้า
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}