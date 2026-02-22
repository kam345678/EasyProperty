"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/auth";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const profile = await getProfile();
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">ไม่พบข้อมูลผู้ใช้</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      {/* ================= PROFILE SECTION ================= */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">ข้อมูลส่วนตัว</h2>

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500">
            {user.profile?.avatar.url ? (
              <img
                src={user.profile.avatar.url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              "No Avatar"
            )}
          </div>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            เปลี่ยนรูปโปรไฟล์
          </button>
        </div>

        {editMode ? (
          <div className="space-y-3">
            <input
              className="w-full border rounded-lg p-2"
              defaultValue={user.profile?.fullName}
              placeholder="ชื่อ-นามสกุล"
            />
            <input
              className="w-full border rounded-lg p-2"
              defaultValue={user.profile?.phone}
              placeholder="เบอร์โทร"
            />

            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                onClick={() => setEditMode(false)}
              >
                บันทึก
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm"
                onClick={() => setEditMode(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>ชื่อ:</strong> {user.profile?.fullName || "-"}</p>
            <p><strong>เบอร์โทร:</strong> {user.profile?.phone || "-"}</p>

            <button
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              onClick={() => setEditMode(true)}
            >
              แก้ไขข้อมูล
            </button>
          </div>
        )}
      </div>

      {/* ================= SECURITY SECTION ================= */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">จักการรหัสผ่าน</h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="รหัสผ่านปัจจุบัน"
            className="w-full border rounded-lg p-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            className="w-full border rounded-lg p-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            className="w-full border rounded-lg p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
            เปลี่ยนรหัสผ่าน
          </button>
        </div>
      </div>

      {/* ================= CONTRACT INFO ================= */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">ข้อมูลสัญญาเช่า</h2>

        <div className="text-sm space-y-2">
          <p><strong>เลขห้อง:</strong> -</p>
          <p><strong>วันเริ่มสัญญา:</strong> -</p>
          <p><strong>วันหมดสัญญา:</strong> -</p>
          <p><strong>เงินประกัน:</strong> -</p>
        </div>
      </div>

      {/* ================= BILLING HISTORY ================= */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">ประวัติการชำระเงิน</h2>

        <div className="text-sm text-gray-500">
          ยังไม่มีข้อมูลการชำระเงิน
        </div>
      </div>

    </div>
  );
}