"use client";
import { changePassword } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getMyContract } from "@/services/contracts.service";

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [contract, setContract] = useState<any>(null);
  const [contractLoading, setContractLoading] = useState(true);

  // password state
  const [oldPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const router = useRouter();

  // avatar
  const [uploading, setUploading] = useState(false);
  async function handleAvatarUpload(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/upload/avatars", formData);

      // update user state ทันทีจาก response backend
      setUser((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatar: data.avatar,
        },
      }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  }

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

    async function fetchContract() {
      try {
        const data = await getMyContract();
        setContract(data);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setContractLoading(false);
      }
    }

    fetchContract();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">ไม่พบข้อมูลผู้ใช้</div>;

  /* ============== เปลี่ยนรหัสผ่าน ======================= */
  async function handleChangePassword() {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      const res = await changePassword(oldPassword, newPassword);
      setPasswordSuccess(res.message);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "เปลี่ยนรหัสผ่านไม่สำเร็จ";

      setPasswordError(message);
    }
  }

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

          <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm cursor-pointer">
            {uploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAvatarUpload(e.target.files[0]);
                }
              }}
            />
          </label>
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
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>ชื่อ:</strong> {user.profile?.fullName || "-"}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {user.profile?.phone || "-"}
            </p>

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
        <h2 className="text-xl font-bold">จัดการรหัสผ่าน</h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="รหัสผ่านปัจจุบัน"
            className="w-full border rounded-lg p-2"
            value={oldPassword}
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

          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            เปลี่ยนรหัสผ่าน
          </button>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          {passwordSuccess && (
            <p className="text-green-600 text-sm">{passwordSuccess}</p>
          )}
        </div>
      </div>

      {/* ================= CONTRACT INFO ================= */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">ข้อมูลสัญญาเช่า</h2>

        {contractLoading ? (
          <div className="text-sm text-gray-500">กำลังโหลดข้อมูลสัญญา...</div>
        ) : contract ? (
          <div className="text-sm space-y-2">
            <p>
              <strong>เลขห้อง:</strong> {contract.roomId?.roomNumber || "-"}
            </p>
            <p>
              <strong>วันเริ่มสัญญา:</strong>{" "}
              {contract.startDate
                ? new Date(contract.startDate).toLocaleDateString()
                : "-"}
            </p>
            <p>
              <strong>วันหมดสัญญา:</strong>{" "}
              {contract.endDate
                ? new Date(contract.endDate).toLocaleDateString()
                : "-"}
            </p>
            <p>
              <strong>เงินประกัน:</strong>{" "}
              {contract.financials?.deposit
                ? `฿${contract.financials.deposit.toLocaleString()}`
                : "-"}
            </p>
            <p>
              <strong>สถานะสัญญา:</strong> {contract.status || "-"}
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-500">ไม่มีสัญญาที่ใช้งานอยู่</div>
        )}
      </div>
    
    </div>
  );
}
