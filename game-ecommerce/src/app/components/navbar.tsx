'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, Menu, X, Gamepad2, LogOut, Wallet, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Interface ให้ตรงกับข้อมูลที่ API Login ส่งมา
interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number; // ต้องมี field นี้
}

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // โหลดข้อมูล User จาก LocalStorage เมื่อเข้าเว็บ
  useEffect(() => {
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user session", e);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsProfileOpen(false);
    router.push('/login');
    window.location.reload(); 
  };

  const getAvatarUrl = (seed: string) => {
    // ใช้ seed เป็น username เพื่อให้รูปเหมือนเดิมตลอด
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
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

          {/* Right Side Area */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? (
              // --- USER LOGGED IN ---
              <div className="flex items-center gap-4 animate-fade-in">
                
                {/* Wallet Balance (ดึงจาก user.balance ที่มาจาก DB) */}
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Your Balance</span>
                  <div className="flex items-center text-green-400 font-bold bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700/50">
                    <Wallet className="w-3 h-3 mr-1.5" />
                    {/* ถ้าไม่มีค่าให้แสดง 0 */}
                    ฿{user.balance ? user.balance.toLocaleString() : '0'}
                  </div>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 py-1.5 pl-1.5 pr-3 rounded-full transition-all border border-slate-700 hover:border-purple-500/50 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600 group-hover:border-purple-400 transition-colors">
                      <img 
                        src={getAvatarUrl(user.username || 'User')} 
                        alt={user.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate text-slate-200 group-hover:text-white">
                      {user.username}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Items */}
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-3 border-b border-slate-800">
                          <p className="text-xs text-slate-500 font-medium uppercase">Signed in as</p>
                          <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        </div>
                        
                        <div className="py-1">
                            {user.role === 'ADMIN' && (
                                <Link href="/admin" className="block px-4 py-2 text-sm text-purple-400 hover:bg-slate-800 hover:text-purple-300 font-medium">
                                  Admin Dashboard
                                </Link>
                            )}
                            <Link href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">โปรไฟล์ของฉัน</Link>
                        </div>

                        <div className="py-1 border-t border-slate-800">
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            ออกจากระบบ
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // --- GUEST ---
              <div className="flex items-center gap-3 animate-fade-in">
                <Link href="/register" className="hidden sm:block border border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-400 px-4 py-2 rounded-full transition-all text-sm font-bold">สมัครสมาชิก</Link>
                <Link href="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full flex items-center transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 text-sm font-bold">
                  <User className="h-4 w-4 mr-2" />
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {user ? (
              <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-4">
                <img src={getAvatarUrl(user.username || 'User')} className="w-12 h-12 rounded-full bg-slate-700 border border-slate-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{user.username}</div>
                  <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 text-sm text-green-400 font-bold flex items-center">
                    <Wallet className="w-3 h-3 mr-1" /> 
                    ฿{user.balance?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            ) : null}

             <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">หน้าแรก</Link>
             <Link href="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">ร้านค้า</Link>
             
             {!user ? (
               <div className="flex flex-col gap-3 pt-2">
                  <Link href="/login" className="block text-center w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2.5 rounded-lg font-bold">เข้าสู่ระบบ</Link>
                  <Link href="/register" className="block text-center w-full border border-slate-700 text-slate-300 hover:border-purple-500 hover:text-white px-3 py-2.5 rounded-lg font-bold">สมัครสมาชิก</Link>
               </div>
             ) : (
               <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium">
                 <LogOut className="w-5 h-5 mr-3" />
                 ออกจากระบบ
               </button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}