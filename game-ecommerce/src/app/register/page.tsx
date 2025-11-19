'use client';

import RegisterForm from '@/app/components/auth/RegisterForm'; // ตรวจสอบ path ให้ตรง
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    // เมื่อสมัครเสร็จ ให้เด้งไปหน้า Login หรือหน้าแรก
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        {/* เรียกใช้ Form ที่คุณมี */}
        <RegisterForm onSuccess={handleRegisterSuccess} />

        {/* ลิงก์กลับไปหน้า Login กรณีมีบัญชีแล้ว */}
        <div className="text-center mt-4">
          <p className="text-slate-400 text-sm">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-purple-500 hover:text-purple-400 font-bold transition-colors">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}