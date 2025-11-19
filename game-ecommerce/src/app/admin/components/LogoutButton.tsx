// src/components/admin/LogoutButton.tsx
"use client";

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. เรียก API เพื่อเคลียร์ Session หรือ Cookie
    // await fetch('/api/auth/logout', { method: 'POST' });

    // 2. ลบ Token ใน LocalStorage (ถ้ามี)
    // localStorage.removeItem('token');

    // 3. Redirect ไปหน้า Login
    alert('Logged out!');
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full flex items-center text-red-400 hover:text-red-300 transition-colors"
    >
      <span className="mr-2">🚪</span> Logout
    </button>
  );
}