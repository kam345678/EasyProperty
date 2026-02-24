"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AdminTopNav from "@/components/AdminTopNav";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    fullName?: string;
    avatarUrl?: string;
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchWithAuth("/auth/profile");

        // ป้องกัน role ไม่ใช่ admin
        if (data.role !== "admin") {
          router.push("/login");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("Failed to load admin:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-sm">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar pathname={pathname} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopNav user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}