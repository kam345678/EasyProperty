"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AdminTopNav from "@/components/AdminTopNav";
import { AuthProvider } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function AdminLayout({
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
        console.error("Failed to load admin:", err);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar pathname={pathname} />
        <main className="flex-1 overflow-hidden">
          <div className="mb-3">
            <AdminTopNav user={user} />
          </div>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}