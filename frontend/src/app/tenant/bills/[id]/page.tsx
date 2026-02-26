"use client";

import { useEffect, useState } from "react";
import { invoiceService } from "@/services/invoice.service";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Receipt } from "lucide-react";

export default function BillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const billId = params.id as string;
  const [file, setFile] = useState<File | null>(null);
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const status = bill?.payment?.status;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "รอชำระเงิน", color: "bg-yellow-100 text-yellow-700" };
      case "paid_pending_review":
        return { label: "รอตรวจสอบ", color: "bg-blue-100 text-blue-700" };
      case "paid":
        return { label: "ชำระแล้ว", color: "bg-emerald-100 text-emerald-700" };
      case "rejected":
        return { label: "สลิปไม่ถูกต้อง", color: "bg-red-100 text-red-700" };
      case "overdue":
        return { label: "เกินกำหนดชำระ", color: "bg-gray-200 text-gray-700" };
      default:
        return { label: "-", color: "bg-gray-100 text-gray-600" };
    }
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await invoiceService.getInvoiceById(billId);
        setBill(data);
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    if (billId) fetchInvoice();
  }, [billId]);

  const handleUpload = async () => {
    if (!file) return alert("กรุณาเลือกไฟล์สลิปก่อนครับ");

    try {
      await invoiceService.payInvoice(
        billId,
        file,
        new Date().toISOString()
      );
      alert("อัพโหลดสลิปเรียบร้อยแล้ว");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    }
  };

  return (
    <>
      {loading && <p className="text-center text-gray-500">กำลังโหลด...</p>}
      {!loading && bill && (
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
              <h2 className="text-2xl font-bold text-gray-800 mb-1">ใบแจ้งหนี้</h2>
              <p className="text-sm font-medium text-indigo-600">{bill.billingPeriod}</p>
              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    getStatusConfig(status).color
                  }`}
                >
                  {getStatusConfig(status).label}
                </span>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-5 mb-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">รายการค่าใช้จ่าย</h3>
              <div className="space-y-3">
                {bill && (
                  <>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>ค่าเช่า</span>
                      <span>{bill.amounts?.rent?.toLocaleString()} ฿</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>ค่าน้ำ</span>
                      <span>{bill.amounts?.waterTotal?.toLocaleString()} ฿</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>ค่าไฟ</span>
                      <span>{bill.amounts?.electricTotal?.toLocaleString()} ฿</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>ค่าบริการอื่นๆ</span>
                      <span>{bill.amounts?.serviceFee?.toLocaleString()} ฿</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
                <span className="font-bold text-gray-800">ยอดสุทธิ</span>
                <span className="text-2xl font-black text-red-600">{bill?.amounts?.grandTotal?.toLocaleString()} ฿</span>
              </div>
            </div>

            {(status === "pending" || status === "rejected") && (
              <>
                {/* Payment Information Section */}
                <div className="bg-white border border-indigo-100 rounded-2xl p-5 mb-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                    ช่องทางการโอนเงิน
                  </h3>

                  <div className="flex flex-col items-center mb-4">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=EasyApartment-1234567890"
                      alt="QR Code"
                      className="rounded-xl border"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      สแกน QR เพื่อโอนเข้าบัญชี EasyApartment
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">ชื่อบัญชี</span>
                      <span>EasyApartment Co.,Ltd.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ธนาคาร</span>
                      <span>ธนาคารกสิกรไทย</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">เลขที่บัญชี</span>
                      <span>123-4-56789-0</span>
                    </div>
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
                  {file && (
                    <p className="text-xs font-medium text-emerald-600 mt-3 flex items-center gap-1">
                      ✓ {file.name}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleUpload}
                  className="w-full rounded-2xl bg-indigo-600 p-4 text-white font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  ยืนยันการชำระเงิน
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}