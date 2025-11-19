'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface LoginFormProps {
  // onLoginSuccess is now optional or can be used for non-admin flow
  onSuccess: () => void; 
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Custom function to handle custom redirection logic
  const handleRedirect = (role: string) => {
    if (role === 'Admin') {
      // **เงื่อนไข: ถ้าเป็น Admin ให้เข้าสู่หน้า Backend ทันที**
      window.location.href = '/admin/dashboard';
    } else {
      // สำหรับผู้ใช้ทั่วไปหรือ Role อื่นๆ
      window.location.href = '/'; 
    }
    // Note: onSuccess() can still be called here if needed for parent state updates
    // onSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // --- 1. เรียก API Login ---
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // --- 2. แปลงข้อมูล ---
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      // --- 3. (สำคัญ) บันทึก Session และตรวจสอบ Role ---
      // ต้องมั่นใจว่า API คืนค่า user object ที่มี field 'role' 
      const user = data.user;
      if (!user || !user.role) {
        throw new Error('ข้อมูลผู้ใช้ไม่สมบูรณ์จากเซิร์ฟเวอร์');
      }

      localStorage.setItem('user_session', JSON.stringify(user));

      // แสดง Toast สำเร็จ
      setSuccessMessage(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${user.role} (${user.email})`);

      // 4. เปลี่ยนเส้นทางตาม Role
      setTimeout(() => handleRedirect(user.role), 1000); 

    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border rounded-xl shadow-2xl bg-white border-t-4 border-green-600">
      
      {/* Custom Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded-lg shadow-xl flex items-center text-sm z-50 transition-all duration-300">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-green-700">
          เข้าสู่ระบบสมาชิก
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          GAMEZONE ยินดีต้อนรับ
        </p>
      </div>

      {/* แสดง Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@example.com (Admin: admin@)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 shadow-md 
            ${loading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg hover:shadow-green-500/50'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                กำลังตรวจสอบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;