// src/app/admin/layout.tsx
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, Users, LogOut, Gamepad2 } from 'lucide-react';
//ss
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-purple-900/20 hover:text-purple-400 rounded-xl transition-all">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/admin/products/add" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-purple-900/20 hover:text-purple-400 rounded-xl transition-all">
            <PlusCircle size={20} />
            <span>เพิ่มสินค้า & Keys</span>
          </Link>
          
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-purple-900/20 hover:text-purple-400 rounded-xl transition-all">
            <Users size={20} />
            <span>จัดการผู้ใช้</span>
          </Link>
        </nav>

        {/* Logout Area */}
        <div className="p-4 border-t border-slate-800">
          <form action="/api/auth/logout" method="POST"> 
            {/* หรือใช้ Client Component สำหรับปุ่ม Logout */}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-all">
              <LogOut size={20} />
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}