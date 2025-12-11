'use client';

import { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import QRModal from '../components/QRModal';

export default function TopUpPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  const quickAmounts = [100, 300, 500, 1000, 2000, 5000];

  useEffect(() => {
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentBalance(user.balance || 0);
    }
  }, []);

  const handleTopUp = async () => {
    const storedUser = localStorage.getItem('user_session');
    if (!storedUser) {
      alert('กรุณาเข้าสู่ระบบ');
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;
    const topupAmount = parseInt(amount);

    if (!topupAmount || topupAmount <= 0) {
      alert('กรุณาระบุจำนวนเงิน');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/topup/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: topupAmount })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await res.json();
      
      if (data.success) {
        setQrData(data);
        setShowQR(true);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error: any) {
      console.error('Top-up error:', error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQRSuccess = (newBalance: number) => {
    setShowQR(false);
    alert(`✅ ชำระเงินสำเร็จ!\n\nยอดเงินคงเหลือ: ฿${newBalance.toLocaleString()}`);
    setCurrentBalance(newBalance);
    
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.balance = newBalance;
      localStorage.setItem('user_session', JSON.stringify(user));
    }
    
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                <QrCode size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">เติมเงินด้วย QR Payment</h1>
                <p className="text-blue-100 text-base mt-1">ชำระเงินผ่าน SCB PromptPay</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-sm text-blue-100 mb-1">ยอดเงินคงเหลือปัจจุบัน</p>
              <p className="text-3xl font-bold">฿{currentBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">จำนวนเงิน (บาท)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ระบุจำนวนเงิน"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-2xl font-bold text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>

            <div className="mb-8">
              <p className="text-base font-semibold text-gray-700 mb-3">เลือกจำนวนเงินด่วน</p>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="py-4 border-2 border-gray-300 rounded-xl hover:bg-purple-50 hover:border-purple-500 transition-all font-bold text-lg text-gray-700 hover:text-purple-600"
                  >
                    ฿{amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTopUp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังสร้าง QR Code...' : '🔐 สร้าง QR Code เพื่อชำระเงิน'}
            </button>

            <p className="text-sm text-gray-500 mt-6 text-center leading-relaxed">
              * ชำระเงินผ่าน QR Code ด้วย SCB PromptPay
            </p>
          </div>
        </div>
      </div>

      {showQR && qrData && (
        <QRModal
          topupId={qrData.topupId}
          qrImage={qrData.qrImage}
          amount={qrData.amount}
          expiresAt={qrData.expiresAt}
          isMock={qrData.isMock}
          onSuccess={handleQRSuccess}
          onCancel={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
