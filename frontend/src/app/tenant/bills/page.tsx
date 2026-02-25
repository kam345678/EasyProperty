"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { invoiceService } from "@/services/invoice.service";

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {

       const data = await invoiceService.getMyInvoices();
        setBills(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl sm:text-3xl font-extrabold text-gray-801 tracking-tight">
          ใบแจ้งหนี้ของฉัน
        </h1>

        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          ) : bills.length === 0 ? (
            <p className="text-gray-500">ไม่มีใบแจ้งหนี้</p>
          ) : (
            bills.map((bill) => (
              <Link
                href={`/tenant/bills/${bill._id}`}
                key={bill._id}
                className="group flex flex-col rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-gray-100/50"
              >
                {/* --- ส่วนบน: ข้อมูลบิล --- */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                        bill.payment?.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {bill.payment?.status === "paid" ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <AlertCircle size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-base">ใบแจ้งหนี้</p>
                      <p className="text-sm text-gray-500">{bill.billingPeriod}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        {bill.amounts?.grandTotal?.toLocaleString()} ฿
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          bill.payment?.status === "paid"
                            ? "text-green-600"
                            : bill.payment?.status === "paid_pending_review"
                            ? "text-yellow-600"
                            : bill.payment?.status === "overdue"
                            ? "text-red-700"
                            : bill.payment?.status === "rejected"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {bill.payment?.status === "paid"
                          ? "ชำระแล้ว"
                          : bill.payment?.status === "paid_pending_review"
                          ? "รอตรวจสอบสลิป"
                          : bill.payment?.status === "overdue"
                          ? "เกินกำหนดชำระ"
                          : bill.payment?.status === "rejected"
                          ? "สลิปถูกปฏิเสธ"
                          : "รอชำระเงิน"}
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-indigo-600" size={20} />
                  </div>
                </div>

                {/* --- ส่วนล่าง: ปุ่มชำระเงิน (แสดงเฉพาะสถานะ pending หรือ rejected) --- */}
                {(bill.payment?.status === "pending" ||
                  bill.payment?.status === "rejected") && (
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <div className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-indigo-500">
                      ชำระเงิน
                    </div>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}