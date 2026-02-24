"use client";

import { Bell, Home, FileText, Wrench, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchWithAuth("/auth/profile");
        setUser(data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }

    loadUser();
  }, []);

  return (
    // ครอบด้วย div เพื่อจัดการให้เมนูอยู่ล่างสุดเสมอถ้าเนื้อหาน้อย
    <div className="flex min-h-screen flex-col bg-gray-50 justify-center">
      {/* ================= TOP NAVIGATION BAR (Desktop) ================= */}
      <header className="sticky top-0 z-40 hidden border-b border-gray-200 bg-white shadow-sm md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-indigo-900">
                Portal
              </span>
            </div>

            {/* Middle: Desktop Menu */}
            <nav className="hidden space-x-8 md:flex">
              <Link
                href="/tenant/dashboard"
                className={`px-1 py-5 text-sm font-medium transition-colors ${
                  pathname === "/tenant/dashboard"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                หน้าหลัก
              </Link>
              <Link
                href="/tenant/bills"
                className={`px-1 py-5 text-sm font-medium transition-colors ${
                  pathname?.startsWith("/tenant/bills")
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                จ่ายค่าเช่า
              </Link>
              <Link
                href="/tenant/maintenance"
                className={`px-1 py-5 text-sm font-medium transition-colors ${
                  pathname?.startsWith("/tenant/maintenance")
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                แจ้งซ่อม
              </Link>
            </nav>

            {/* Right: User Profile & Notification */}
            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-gray-500">
                <Bell size={20} />
                <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              <Link href="/tenant/account">
              <div className="flex cursor-pointer items-center gap-2 border-l border-gray-200 pl-4">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                  {user?.profile?.avatar.url ? (
                    <img
                      src={user.profile.avatar.url}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.profile?.fullName?.charAt(0) || "U"
                  )}
                </div>
                <span className="hidden text-sm font-medium sm:block">
                  {user?.profile?.fullName || "Loading..."}
                </span>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      {/* เผื่อพื้นที่ด้านล่าง (pb-24) ให้มือถือ เพื่อไม่ให้เมนูล่างบังเนื้อหา */}
      <main className="flex-1 pb-24 md:pb-8">{children}</main>

      {/* ================= BOTTOM TAB BAR (Mobile) ================= */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="mx-auto px-2">
          <nav className="flex items-center justify-between rounded-t-2xl border-t bg-white/90 px-3 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur">
            <Link
              href="/tenant/dashboard"
              className={`flex flex-col items-center text-sm ${pathname === "/tenant/dashboard" ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              <Home size={24} className="mb-1" />
              <span className="text-[10px] font-medium">หน้าแรก</span>
            </Link>
            <Link
              href="/tenant/bills"
              className={`flex flex-col items-center text-sm ${pathname?.startsWith("/tenant/bills") ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              <FileText size={24} className="mb-1" />
              <span className="text-[10px] font-medium">บิล</span>
            </Link>
            <Link
              href="/tenant/maintenance"
              className={`flex flex-col items-center text-sm ${pathname?.startsWith("/tenant/maintenance") ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              <Wrench size={24} className="mb-1" />
              <span className="text-[10px] font-medium">แจ้งซ่อม</span>
            </Link>
            <Link
              href="/tenant/account"
              className={`flex flex-col items-center text-sm ${
                pathname === "/tenant/account"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User size={24} className="mb-1" />
              <span className="text-[10px] font-medium">บัญชี</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
