"use client";

import Link from "next/link";
import { FileText, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function BillsPage() {
  const bills = [
    { id: 1, month: "มกราคม 2026", total: 1500, type: "ค่าซ่อมบำรุง", status: "ค้างชำระ" },
    { id: 2, month: "มกราคม 2026", total: 3500, type: "ค่าห้อง", status: "ค้างชำระ" },
    { id: 3, month: "ธันวาคม 2025", total: 3200, type: "ค่าห้อง", status: "ชำระแล้ว" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          ใบแจ้งหนี้ของฉัน
        </h1>

        <div className="flex flex-col gap-4">
          {bills.map((bill) => (
            <Link
              href={`/tenant/bills/${bill.id}`}
              key={bill.id}
              className="group flex flex-col rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-gray-100/50"
            >
              {/* --- ส่วนบน: ข้อมูลบิล --- */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                      bill.status === "ชำระแล้ว"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {bill.status === "ชำระแล้ว" ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <AlertCircle size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">{bill.type}</p>
                    <p className="text-sm text-gray-500">{bill.month}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="font-bold text-lg text-gray-900">
                      {bill.total.toLocaleString()} ฿
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        bill.status === "ชำระแล้ว" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {bill.status}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-indigo-600" size={20} />
                </div>
              </div>

              {/* --- ส่วนล่าง: ปุ่มชำระเงิน (แสดงเฉพาะที่ยังไม่จ่าย) --- */}
              {bill.status !== "ชำระแล้ว" && (
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <div className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-indigo-500">
                    ชำระเงิน
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}