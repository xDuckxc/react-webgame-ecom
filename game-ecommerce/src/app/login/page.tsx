'use client'; 

import LoginForm from '@/app/components/auth/LoginForm';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link'; // Import Link เข้ามา

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/'); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            เข้าสู่ระบบสมาชิก
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            GAMEZONE ยินดีต้อนรับ
          </p>
        </div> */}
        
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* --- ส่วนที่เพิ่มเข้ามา: ลิงก์ไปหน้า Register --- */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="text-purple-500 hover:text-purple-400 font-bold transition-colors">
              ลงทะเบียนสมาชิกใหม่
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}