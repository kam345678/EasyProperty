"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Receipt } from "lucide-react";

export default function BillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const billId = params.id as string;
  const [file, setFile] = useState<File | null>(null);

  const bills: { [key: string]: any } = {
    "1": {
      month: "มกราคม 2026",
      type: "ค่าซ่อมบำรุง",
      description: "ค่าซ่อมแอร์ที่พัง",
      items: [{ name: "ค่าซ่อมแอร์", amount: 1500 }],
      total: 1500,
    },
    "2": {
      month: "มกราคม 2026",
      type: "ค่าห้อง",
      description: "ค่าที่อยู่อาศัยสำหรับเดือนมกราคม",
      items: [
        { name: "ค่าเช่าห้อง", amount: 3000 },
        { name: "ค่าน้ำ", amount: 200 },
        { name: "ค่าไฟฟ้า", amount: 300 },
      ],
      total: 3500,
    },
  };

  const bill = bills[billId] || bills["1"];

  const handleUpload = () => {
    if (!file) return alert("กรุณาเลือกไฟล์สลิปก่อนครับ");
    alert("อัพโหลดสลิปเรียบร้อยแล้ว");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-8 pb-24 sm:pb-8 flex justify-center items-start pt-6 sm:pt-10">
      <div className="w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl border border-white">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">รายละเอียดชำระเงิน</h1>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-100 text-center">
          <div className="mx-auto bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
             <Receipt className="text-indigo-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{bill.type}</h2>
          <p className="text-sm font-medium text-indigo-600">{bill.month}</p>
          <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg inline-block">{bill.description}</p>
        </div>

        <div className="bg-gray-50/50 rounded-2xl p-5 mb-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">รายการค่าใช้จ่าย</h3>
          <div className="space-y-3">
            {bill.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-200/60 border-dashed last:border-0 last:pb-0">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-base text-gray-900 font-semibold">{item.amount.toLocaleString()} ฿</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
            <span className="font-bold text-gray-800">ยอดสุทธิ</span>
            <span className="text-2xl font-black text-red-600">{bill.total.toLocaleString()} ฿</span>
          </div>
        </div>

        <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-5 mb-6 bg-indigo-50/50 transition-colors hover:bg-indigo-50">
          <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <Upload size={16} /> แนบสลิปโอนเงิน
          </h3>
          <input
            type="file"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && <p className="text-xs font-medium text-emerald-600 mt-3 flex items-center gap-1">✓ {file.name}</p>}
        </div>

        <button
          onClick={handleUpload}
          className="w-full rounded-2xl bg-indigo-600 p-4 text-white font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
}