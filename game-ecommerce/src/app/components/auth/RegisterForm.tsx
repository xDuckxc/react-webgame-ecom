'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // --- 1. เรียก API จริง ---
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      // --- 2. อ่านค่าที่ตอบกลับมา (แก้ปัญหา Unexpected token '<') ---
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("Server Error (Non-JSON response):", responseText);
        throw new Error("เกิดข้อผิดพลาดที่ฝั่งเซิร์ฟเวอร์ (โปรดตรวจสอบ Console)");
      }

      // --- 3. ตรวจสอบสถานะ ---
      if (!response.ok) {
        throw new Error(data.error || 'การลงทะเบียนล้มเหลว');
      }

      // --- 4. สำเร็จ ---
      alert(`ลงทะเบียนสำเร็จ! ยินดีต้อนรับ ${username}`);
      
      setUsername('');
      setEmail('');
      setPassword('');
      
      onSuccess();

    } catch (err: any) {
      console.error("Register Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border rounded-lg shadow-lg bg-green-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        ลงทะเบียนบัญชีใหม่
      </h2>
      
      {/* แสดง Error ถ้ามี */}
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-start text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            ชื่อผู้ใช้
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-green-300"
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
            minLength={6}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring focus:ring-green-300"
          />
          <p className="text-xs text-gray-500 mt-1">ความยาวอย่างน้อย 6 ตัวอักษร</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                กำลังลงทะเบียน...
              </>
            ) : (
              'ลงทะเบียน'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;