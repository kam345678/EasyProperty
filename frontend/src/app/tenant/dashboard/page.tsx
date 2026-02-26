"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Home, FileText, Wrench, User, Hash, CreditCard, AlertTriangle } from "lucide-react";
import { logout } from '@/lib/api'
import { useEffect, useState } from "react";
import { getMyContract } from "@/services/contracts.service";
import { invoiceService } from "@/services/invoice.service";
import ModalAlert from "@/components/ModalAlert";

export default function TenantDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [roomNumber, setRoomNumber] = useState<string>("-");
  const [tenantName, setTenantName] = useState<string>("ผู้เช่า");
  const [latestBill, setLatestBill] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("-");
  const [latestInvoiceId, setLatestInvoiceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmAction, setAlertConfirmAction] = useState<(() => void) | undefined>(undefined);

  const handleLogout = () => {
    setAlertType("info");
    setAlertMessage("คุณแน่ใจที่ต้องการออกจากระบบหรือไม่?");
    setAlertConfirmAction(() => async () => {
      try {
        await logout();
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
        router.push("/login");
      }
    });
    setAlertOpen(true);
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const contract = await getMyContract();

        if (contract?.roomId?.roomNumber) {
          setRoomNumber(contract.roomId.roomNumber);
        }

        if (contract?.tenantId?.profile?.fullName) {
          setTenantName(contract.tenantId.profile.fullName);
        } else if (contract?.tenantId?.email) {
          setTenantName(contract.tenantId.email);
        }

        const invoiceResponse = await invoiceService.getMyInvoices();
        const invoices = Array.isArray(invoiceResponse) ? invoiceResponse : invoiceResponse?.data;
        if (invoices && Array.isArray(invoices) && invoices.length > 0) {
          const sorted = [...invoices].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const latest = sorted[0];

          setLatestBill(latest.amounts?.grandTotal || 0);
          setLatestInvoiceId(latest._id || "");

          const rawStatus =
            latest.payment?.status ||
            latest.status ||
            "";

          const normalizedStatus = String(rawStatus).toLowerCase();

          setPaymentStatus(
            normalizedStatus === "paid"
              ? "ชำระแล้ว"
              : normalizedStatus === "paid_pending_review"
              ? "รอตรวจสอบการชำระเงิน"
              : normalizedStatus === "pending"
              ? "รอชำระ"
              : normalizedStatus === "rejected"
              ? "การชำระเงินถูกปฏิเสธ"
              : normalizedStatus === "overdue"
              ? "ค้างชำระ"
              : "-"
          );
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="mx-auto max-w-6xl px-2 sm:px-0">
        
        {/* HERO SECTION */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 sm:p-10 text-white shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                ยินดีต้อนรับกลับมา, {loading ? "..." : tenantName} 👋
              </h1>
              <p className="mt-3 text-base sm:text-lg text-indigo-100">
                นี่คือภาพรวมข้อมูลการพักอาศัยและใบแจ้งหนี้ล่าสุดของคุณ
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg transition font-medium text-sm whitespace-nowrap hover:bg-red-100 hover:text-red-700"
            >
              <LogOut size={18} />
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* MOBILE TAB BAR */}
        <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
          <div className="mx-auto max-w-6xl px-2">
            <nav className="rounded-t-2xl bg-white/90 backdrop-blur border-t px-3 py-2 flex justify-between items-center shadow-lg">
              <Link
                href="/tenant/dashboard"
                className={`flex flex-col items-center text-sm ${
                  pathname === "/tenant/dashboard" ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <Home size={20} />
                <span className="text-xs">หน้าแรก</span>
              </Link>

              <Link
                href="/tenant/bills"
                className={`flex flex-col items-center text-sm ${
                  pathname?.startsWith("/tenant/bills") ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <FileText size={20} />
                <span className="text-xs">บิล</span>
              </Link>

              <Link
                href="/tenant/maintenance"
                className={`flex flex-col items-center text-sm ${
                  pathname?.startsWith("/tenant/maintenance") ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <Wrench size={20} />
                <span className="text-xs">แจ้งซ่อม</span>
              </Link>

              <Link
                href="/tenant/profile"
                className={`flex flex-col items-center text-sm ${
                  pathname?.startsWith("/tenant/profile") ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <User size={20} />
                <span className="text-xs">บัญชี</span>
              </Link>
            </nav>
          </div>
        </div>
        {/* MOBILE STATS (horizontal scroll) */}
        <div className="flex flex-col gap-3 pb-2 sm:hidden">
          <div className="w-full rounded-xl bg-white p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hash className="text-indigo-400" size={18} />
              <div>
                <p className="text-xs font-medium text-gray-500">ห้อง</p>
                <p className="text-base font-semibold text-gray-900">{loading ? "..." : roomNumber}</p>
              </div>
            </div>
            <div />
          </div>

          <div className="w-full rounded-xl bg-white p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="text-red-400" size={18} />
              <div>
                <p className="text-xs font-medium text-gray-500">บิลล่าสุด</p>
                <p className="text-base font-semibold text-red-600">{loading ? "..." : latestBill.toLocaleString()} ฿</p>
              </div>
            </div>
            <div />
          </div>

          <div className="w-full rounded-xl bg-white p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-500" size={18} />
              <div>
                <p className="text-xs font-medium text-gray-500">สถานะ</p>
                <p className="mt-1 inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold text-red-700 bg-red-50 border border-red-100">{loading ? "..." : paymentStatus}</p>
              </div>
            </div>
            <div />
          </div>
        </div>

        {/* STATS GRID (desktop/tablet) */}
        <div className="hidden sm:grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          
          {/* ROOM CARD */}
          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-100 transition group-hover:scale-125"></div>
            <p className="text-sm font-medium text-gray-500">หมายเลขห้อง</p>
            <p className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">
              {loading ? "..." : roomNumber}
            </p>
          </div>

          {/* BILL CARD */}
          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100 transition group-hover:scale-125"></div>
            <p className="text-sm font-medium text-gray-500">ใบแจ้งหนี้ล่าสุด</p>
            <p className="mt-4 text-2xl sm:text-3xl font-bold text-red-600">
              {loading ? "..." : latestBill.toLocaleString()} THB
            </p>
          </div>

          {/* STATUS CARD */}
          <div className="group relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-100 transition group-hover:scale-125"></div>
            <p className="text-sm font-medium text-gray-500">สถานะการชำระเงิน</p>

            <span
              className={`mt-5 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow ${
                paymentStatus === "ค้างชำระ"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {loading ? "..." : paymentStatus}
            </span>
          </div>
        </div>

        {/* EXTRA PANEL */}
        <div className="mt-12 rounded-3xl bg-white/70 p-6 sm:p-8 backdrop-blur-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800">
            การดำเนินการด่วน
          </h2>

          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <Link
              href={latestInvoiceId ? `/tenant/bills/${latestInvoiceId}` : "#"}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-indigo-700 text-center"
            >
              ชำระเงินตอนนี้
            </Link>

            <Link
              href="/tenant/bills"
              className="w-full sm:w-auto rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:scale-105 hover:bg-gray-300 text-center"
            >
              ดูประวัติ
            </Link>

            <button className="w-full sm:w-auto rounded-xl bg-blue-100 px-6 py-3 font-semibold text-blue-600 transition hover:scale-105 hover:bg-blue-200 text-center">
              ติดต่อผู้ดูแลระบบ
            </button>

            <Link
              href="/tenant/maintenance"
              className="w-full sm:w-auto rounded-xl bg-yellow-100 px-6 py-3 font-semibold text-yellow-600 transition hover:scale-105 hover:bg-yellow-200 text-center"
            >
              แจ้งซ่อม
            </Link>
          </div>
        </div>

      </div>
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => {
          setAlertOpen(false);
          setAlertConfirmAction(undefined);
        }}
        onConfirm={alertConfirmAction}
      />
    </div>
  );
}
