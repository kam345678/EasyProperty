"use client";

import { useState } from "react";
import { Upload, X, Wrench } from "lucide-react";

export default function MaintenancePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!title || !description) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนครับ");
      return;
    }
    alert("ส่งคำร้องแจ้งซ่อมเรียบร้อยแล้ว");
    setTitle("");
    setDescription("");
    removeImage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-8 pb-24 sm:pb-8 pt-6 sm:pt-10 flex justify-center items-start">
      <div className="w-full max-w-2xl rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl border border-white">
        
        <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <Wrench size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            แจ้งซ่อมบำรุง
            </h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 ml-14">แจ้งปัญหาการใช้งานหรืออุปกรณ์ชำรุดภายในห้องพัก</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">หัวข้อปัญหา <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="เช่น แอร์ไม่เย็น, ก๊อกน้ำรั่ว"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-base focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">รายละเอียด <span className="text-red-500">*</span></label>
            <textarea
              placeholder="อธิบายอาการเบื้องต้น หรือจุดที่เกิดปัญหา..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-base focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">แนบรูปภาพประกอบ <span className="text-gray-400 font-normal">(ถ้ามี)</span></label>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl p-8 cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all">
                <Upload className="mb-3 text-indigo-400" size={32} />
                <p className="text-sm font-bold text-indigo-900">แตะเพื่อเลือกรูปภาพ</p>
                <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img src={imagePreview} alt="Preview" className="w-full h-48 sm:h-64 object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 rounded-2xl bg-indigo-600 p-4 text-white font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
        >
          ส่งเรื่องแจ้งซ่อม
        </button>
      </div>
    </div>
  );
}