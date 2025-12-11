'use client';

import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

interface QRModalProps {
  topupId: string;
  qrImage: string;
  amount: number;
  expiresAt: string;
  isMock?: boolean;
  onSuccess: (balance: number) => void;
  onCancel: () => void;
}

export default function QRModal({ topupId, qrImage, amount, expiresAt, isMock = false, onSuccess, onCancel }: QRModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const expiry = new Date(expiresAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        alert('QR Code หมดอายุแล้ว');
        onCancel();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onCancel]);

  useEffect(() => {
    const checkStatus = setInterval(async () => {
      if (checking) return;
      setChecking(true);

      try {
        const res = await fetch(`/api/topup/status/${topupId}`);
        const data = await res.json();

        if (data.status === 'COMPLETED') {
          clearInterval(checkStatus);
          onSuccess(data.balance);
        }
      } catch (error) {
        console.error('Status check error:', error);
      } finally {
        setChecking(false);
      }
    }, 3000);

    return () => clearInterval(checkStatus);
  }, [topupId, onSuccess, checking]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleTestPayment = async () => {
    try {
      const res = await fetch(`/api/topup/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `TEST-${Date.now()}`,
          billPaymentRef1: topupId,
          amount: amount.toString()
        })
      });

      if (res.ok) {
        const statusRes = await fetch(`/api/topup/status/${topupId}`);
        const data = await statusRes.json();
        if (data.status === 'COMPLETED') {
          onSuccess(data.balance);
        }
      }
    } catch (error) {
      console.error('Test payment error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">สแกน QR เพื่อเติมเงิน</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">จำนวนเงินที่เติม</p>
          <p className="text-4xl font-bold text-blue-600">฿{amount.toLocaleString()}</p>
        </div>

        <div className="flex justify-center mb-6 bg-gray-50 p-4 rounded-xl">
          <img src={qrImage} alt="QR Code" className="w-72 h-72 border-4 border-blue-500 rounded-xl shadow-lg" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-6 bg-orange-50 py-3 px-4 rounded-lg border border-orange-200">
          <Clock size={24} className="text-orange-600" />
          <span className="font-mono text-2xl font-bold text-orange-600">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        <div className="text-center space-y-2">
          <p className="text-base font-semibold text-gray-800">📱 เปิดแอพธนาคารของคุณ</p>
          <p className="text-sm text-gray-600">สแกน QR Code เพื่อชำระเงิน</p>
          <p className="text-sm text-gray-600">ระบบจะตรวจสอบการชำระเงินอัตโนมัติ</p>
        </div>

        {isMock && (
          <button
            onClick={handleTestPayment}
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            ทดสอบชำระเงิน (Mock Mode)
          </button>
        )}

        {checking && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm font-medium">กำลังตรวจสอบ...</span>
          </div>
        )}
      </div>
    </div>
  );
}
