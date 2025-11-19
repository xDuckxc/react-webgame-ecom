'use client';

import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { 
  Save, Key, UploadCloud, X, 
  Tag, DollarSign, Type, FileText, LayoutGrid, Star, Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // ใช้ Ref เพื่อช่วยในการ Reset ค่า input file ถ้าต้องการ
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State ข้อมูล
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: 'Action',
    description: '',
    isNew: false,
    keysInput: ''
  });

  // State รูปภาพ
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle Input Text
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ⭐ Handle Image Upload (ส่วนสำคัญ)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. เก็บไฟล์ลง State เพื่อเตรียมส่ง API
      setImageFile(file);
      // 2. สร้าง URL ชั่วคราวเพื่อแสดงรูป Preview ทันที
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ปุ่มลบรูป
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input file
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // แปลง Keys
      const keysArray = formData.keysInput.split('\n').map(k => k.trim()).filter(k => k !== '');
      
      // ใช้ FormData เพื่อส่งไฟล์
      const data = new FormData();
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('originalPrice', formData.originalPrice);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('isNew', String(formData.isNew));
      data.append('keys', JSON.stringify(keysArray));
      
      // แนบไฟล์รูปภาพไปด้วย (ถ้ามี)
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        body: data, // Browser จะจัดการ Header Content-Type ให้อัตโนมัติ
      });

      if (!res.ok) throw new Error('Failed');
      
      alert('✅ เพิ่มสินค้าเรียบร้อย!');
      router.push('/admin/products');

    } catch (error) {
      console.error(error);
      alert('❌ เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsLoading(false);
    }
  };

  // Utility Classes
  const labelStyle = "block text-purple-300 text-sm font-bold mb-2 uppercase tracking-wider";
  const inputStyle = "w-full bg-slate-950 border-2 border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-600/30">
          <Save className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">เพิ่มสินค้าใหม่</h1>
          <p className="text-slate-400 text-sm">กรอกข้อมูลสินค้า รูปภาพ และ Keys</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Left Column: Image & Keys (4/12) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ⭐ Image Upload Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <label className={labelStyle}>รูปปกเกม</label>
            
            {/* พื้นที่แสดง Preview หรือ ปุ่มอัปโหลด */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed border-slate-700 hover:border-purple-500 transition-all group">
              
              {imagePreview ? (
                // กรณีมีรูปแล้ว: แสดงรูป + ปุ่มลบ
                <div className="relative w-full h-full">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg backdrop-blur-sm"
                    title="ลบรูปภาพ"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                // กรณีไม่มีรูป: แสดงพื้นที่ให้กดอัปโหลด
                // ใช้ <label> ซ้อนข้างในเพื่อให้กดได้ทั้งพื้นที่
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors duration-300">
                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-slate-300 font-bold text-lg">คลิกเพื่ออัปโหลด</p>
                  <p className="text-slate-500 text-sm mt-1">หรือลากไฟล์มาวางที่นี่</p>
                  <p className="text-slate-600 text-xs mt-4">รองรับ JPG, PNG (Max 5MB)</p>
                  
                  {/* Input file ถูกซ่อนไว้ แต่ทำงานเมื่อกด Label */}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange} 
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Keys Input */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <label className={labelStyle}>Game Keys</label>
              <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-800">Bulk Import</span>
            </div>
            <textarea 
              name="keysInput" 
              rows={8} 
              onChange={handleChange} 
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl p-4 text-green-400 font-mono text-sm focus:outline-none focus:border-purple-500 transition-all resize-none placeholder-slate-700"
              placeholder={`XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY`}
            />
          </div>
        </div>

        {/* --- Right Column: Details (8/12) --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <FileText className="text-purple-500" /> ข้อมูลทั่วไป
            </h2>

            {/* Title */}
            <div>
              <label className={labelStyle}>ชื่อเกม</label>
              <div className="relative">
                <Type className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input 
                  name="title" 
                  onChange={handleChange} 
                  required 
                  className={`${inputStyle} pl-12`}
                  placeholder="ใส่ชื่อเกม..." 
                />
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>หมวดหมู่</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <select name="category" onChange={handleChange} className={`${inputStyle} pl-12 appearance-none cursor-pointer`}>
                    <option value="Action">Action</option>
                    <option value="RPG">RPG</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Sport">Sport</option>
                    <option value="Simulation">Simulation</option>
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none text-slate-500">▼</div>
                </div>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-4 p-3.5 w-full bg-slate-950 border-2 border-slate-800 rounded-xl cursor-pointer hover:border-purple-500/50 transition-all">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.isNew ? 'bg-purple-600 border-purple-600' : 'border-slate-600'}`}>
                    {formData.isNew && <Star size={14} className="text-white fill-white" />}
                  </div>
                  <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="hidden" />
                  <span className="text-white font-medium select-none">สินค้ามาใหม่ (New Arrival)</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>ราคาขาย (บาท)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <input 
                    name="price" 
                    type="number" 
                    onChange={handleChange} 
                    required 
                    className={`${inputStyle} pl-12 text-green-400 font-mono text-lg`} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>ราคาเต็ม (ส่วนลด)</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-3.5 text-slate-500" size={20} />
                  <input 
                    name="originalPrice" 
                    type="number" 
                    onChange={handleChange} 
                    className={`${inputStyle} pl-12 text-slate-400 font-mono text-lg`} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelStyle}>รายละเอียดสินค้า</label>
              <textarea 
                name="description" 
                rows={10} 
                onChange={handleChange} 
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl p-6 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all text-lg leading-relaxed"
                placeholder="พิมพ์รายละเอียด..."
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-600/20 transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              {isLoading ? 'กำลังบันทึก...' : <><Save size={22} /> บันทึกสินค้า</>}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
}