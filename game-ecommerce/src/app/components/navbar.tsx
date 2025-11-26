'use client';

import { useState, useEffect } from 'react';
import { User, Menu, X, Gamepad2, LogOut, Wallet, ChevronDown, ShoppingCart, RefreshCw, LayoutDashboard, Bell } from 'lucide-react';
// ✅ ใช้ Relative Import แทน @/ เพื่อแก้ปัญหา Preview
import { useCart } from '@/context/CartContext';

// --- MOCK MODULES FOR PREVIEW (แก้ Error next/link, next/navigation) ---
const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>{children}</a>
);
const useRouter = () => ({
  push: (path: string) => { window.location.href = path; }
});
// ---------------------------------------------------------------------

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number;
}

export default function Navbar() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // State สำหรับ Badge แจ้งเตือน (สีแดง)
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // เช็คว่าเพิ่งซื้อของเสร็จหรือเปล่า (จาก LocalStorage flag)
        if (localStorage.getItem('new_purchase')) {
            setHasNotification(true);
        }
        
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1000);
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    window.location.reload(); 
  };

  const handleNotificationClick = () => {
    setHasNotification(false);
    localStorage.removeItem('new_purchase');
    router.push('/inventory');
  };

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center cursor-pointer group">
            <Gamepad2 className="h-8 w-8 text-purple-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="ml-2 text-xl font-bold tracking-wider">
              GAME<span className="text-purple-500">Z</span>ONE
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-slate-800 px-3 py-2 rounded-md transition text-sm font-medium text-slate-300 hover:text-white">หน้าแรก</Link>
              <Link href="/shop" className="hover:bg-slate-800 px-3 py-2 rounded-md transition text-sm font-medium text-slate-300 hover:text-white">ร้านค้า</Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? (
              <div className="flex items-center gap-4 animate-fade-in">
                
                {/* Cart Button */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all mr-1 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-purple-500/50">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Balance */}
                <div className="flex flex-col items-end mr-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Your Balance</span>
                    {isSyncing && <RefreshCw className="w-3 h-3 text-purple-500 animate-spin" />}
                  </div>
                  <div className="flex items-center text-green-400 font-bold bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700/50">
                    <Wallet className="w-3 h-3 mr-1.5" />
                    ฿{user.balance.toLocaleString()}
                  </div>
                </div>

                {/* Profile & Notification Area */}
                <div className="relative flex items-center gap-3">
                  
                  {/* ⭐ ปุ่มแจ้งเตือน (Bell) ⭐ */}
                  <button 
                    onClick={handleNotificationClick}
                    className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all group"
                    title="การแจ้งเตือน / คลังเกม"
                  >
                    <Bell className={`w-5 h-5 transition-colors ${hasNotification ? 'text-white animate-pulse' : 'group-hover:text-purple-400'}`} />
                    {/* จุดแดงแจ้งเตือน */}
                    {hasNotification && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                    )}
                  </button>

                  {/* Profile Dropdown Trigger */}
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 py-1.5 pl-1.5 pr-3 rounded-full transition-all border border-slate-700 hover:border-purple-500/50">
                    <img src={getAvatarUrl(user.username)} alt={user.username} className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600" />
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20">
                        <div className="px-4 py-3 border-b border-slate-800">
                          <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        </div>

                        {user.role === 'ADMIN' && (
                          <div className="py-1 border-b border-slate-800">
                            <Link href="/admin" className="w-full text-left px-4 py-2 text-sm text-purple-400 hover:bg-slate-800 hover:text-purple-300 flex items-center font-semibold">
                              <LayoutDashboard className="w-4 h-4 mr-2" />
                              จัดการระบบหลังบ้าน
                            </Link>
                          </div>
                        )}

                        <div className="py-1 border-b border-slate-800">
                            <Link href="/inventory" className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center">
                              <Gamepad2 className="w-4 h-4 mr-2" />
                              คลังเกมของฉัน
                            </Link>
                        </div>

                        <div className="py-1">
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center">
                            <LogOut className="w-4 h-4 mr-2" /> ออกจากระบบ
                          </button>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-400 hover:text-white">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {totalItems}
                      </span>
                    )}
                 </button>
                <Link href="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center">
                  <User className="h-4 w-4 mr-2" /> เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu */}
          <div className="-mr-2 flex md:hidden items-center">
             <button onClick={() => setIsCartOpen(true)} className="p-2 mr-2 text-slate-400 hover:text-white relative">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                   <span className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                     {totalItems}
                   </span>
                )}
             </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}