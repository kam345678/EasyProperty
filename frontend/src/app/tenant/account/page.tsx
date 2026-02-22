"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/auth";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.warn("No access token found");
          setLoading(false);
          return;
        }

        const profile = await getProfile();
        console.log("PROFILE RESPONSE:", profile);

        // รองรับทั้งกรณี backend ส่ง user ตรง ๆ หรือ { user: {...} }
        const resolvedUser = profile?.user ? profile.user : profile;

        setUser(resolvedUser);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">ไม่พบข้อมูลผู้ใช้</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">ข้อมูลบัญชีผู้ใช้</h1>

      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p><strong>ID:</strong> {user._id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>ชื่อ:</strong> {user.profile?.fullName}</p>
        <p><strong>เบอร์โทร:</strong> {user.profile?.phone}</p>
      </div>
    </div>
  );
}