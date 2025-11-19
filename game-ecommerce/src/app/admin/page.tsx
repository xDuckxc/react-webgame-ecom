'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, Package, ShoppingCart, 
  Clock, DollarSign, CheckCircle, XCircle 
} from 'lucide-react';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
  recentOrders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { username: string | null; email: string };
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500 animate-pulse">กำลังโหลดข้อมูล Dashboard...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-6">ภาพรวมระบบ (Dashboard)</h1>

      {/* 1. Stats Grid (การ์ดสรุปยอด) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: ยอดขายรวม */}
        <StatCard 
          title="ยอดขายรวม (PAID)" 
          value={`฿${data.stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={24} className="text-green-400" />}
          bgClass="bg-green-900/10 border-green-900/30"
        />
        
        {/* Card: คำสั่งซื้อ */}
        <StatCard 
          title="คำสั่งซื้อทั้งหมด" 
          value={data.stats.totalOrders} 
          icon={<ShoppingCart size={24} className="text-blue-400" />}
          bgClass="bg-blue-900/10 border-blue-900/30"
        />

        {/* Card: สินค้า */}
        <StatCard 
          title="สินค้าในระบบ" 
          value={data.stats.totalProducts} 
          icon={<Package size={24} className="text-purple-400" />}
          bgClass="bg-purple-900/10 border-purple-900/30"
        />

        {/* Card: สมาชิก */}
        <StatCard 
          title="สมาชิกทั้งหมด" 
          value={data.stats.totalUsers} 
          icon={<Users size={24} className="text-orange-400" />}
          bgClass="bg-orange-900/10 border-orange-900/30"
        />
      </div>

      {/* 2. Recent Orders (ตารางออเดอร์ล่าสุด) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={20} className="text-slate-400" /> คำสั่งซื้อล่าสุด
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-400 text-sm uppercase border-b border-slate-800">
              <tr>
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">ลูกค้า</th>
                <th className="pb-3">ยอดเงิน</th>
                <th className="pb-3">สถานะ</th>
                <th className="pb-3 text-right">เวลา</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 divide-y divide-slate-800">
              {data.recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">ยังไม่มีคำสั่งซื้อ</td></tr>
              ) : (
                data.recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 pl-2 font-mono text-xs text-slate-500">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-white">{order.user?.username || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{order.user?.email}</div>
                    </td>
                    <td className="py-4 font-mono">
                      ฿{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 text-right text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
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

// --- Sub-Components (เพื่อความสะอาดของโค้ด) ---

function StatCard({ title, value, icon, bgClass }: { title: string, value: string | number, icon: React.ReactNode, bgClass: string }) {
  return (
    <div className={`p-6 rounded-2xl border ${bgClass} flex items-center justify-between`}>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 shadow-sm">
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'PAID') {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800"><CheckCircle size={12}/> PAID</span>;
  }
  if (status === 'PENDING') {
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800"><Clock size={12}/> PENDING</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800"><XCircle size={12}/> CANCELLED</span>;
}