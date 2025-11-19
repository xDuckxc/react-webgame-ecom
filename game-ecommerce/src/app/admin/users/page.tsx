'use client';
import { useEffect, useState } from 'react';
import { User as UserIcon, Shield, Wallet } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">จัดการสมาชิก</h1>
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4">User Info</th>
              <th className="p-4">Role</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 divide-y divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-full"><UserIcon size={20} /></div>
                    <div>
                      <div className="font-bold text-white">{user.username || 'No Name'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   {user.role === 'ADMIN' ? (
                     <span className="flex items-center gap-1 text-purple-400 bg-purple-900/20 px-2 py-1 rounded text-xs border border-purple-800"><Shield size={12}/> ADMIN</span>
                   ) : (
                     <span className="text-slate-500 text-xs bg-slate-800 px-2 py-1 rounded">USER</span>
                   )}
                </td>
                <td className="p-4 font-mono text-green-400 flex items-center gap-2">
                  <Wallet size={16} /> ฿{user.balance.toLocaleString()}
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString('th-TH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}