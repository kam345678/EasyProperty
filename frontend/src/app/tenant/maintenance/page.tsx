"use client";

import { useState } from "react";
import { Upload, X, Wrench } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import ModalAlert from "@/components/ModalAlert";

export default function MaintenancePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"urgent" | "high" | "medium">("medium");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      setAlertType("error");
      setAlertMessage("กรุณากรอกข้อมูลให้ครบถ้วนครับ");
      setAlertOpen(true);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);

      if (image) {
        formData.append("images", image);
      }

      await fetchWithAuth("/maintenance", {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlertType("success");
      setAlertMessage("ส่งคำร้องแจ้งซ่อมเรียบร้อยแล้ว");
      setAlertOpen(true);

      setTitle("");
      setDescription("");
      setPriority("medium");
      removeImage();
    } catch (error: any) {
      console.error("Maintenance error:", error);
      setAlertType("error");
      setAlertMessage("เกิดข้อผิดพลาดในการส่งข้อมูล");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const priorityStyles = {
    urgent: "bg-red-100 text-red-600 border-red-300",
    high: "bg-yellow-100 text-yellow-700 border-yellow-300",
    medium: "bg-indigo-100 text-indigo-600 border-indigo-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
            <Wrench size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            แจ้งซ่อมบำรุง
          </h1>
        </div>

        <p className="text-sm text-gray-500 mb-8 ml-14">
          แจ้งปัญหาการใช้งานหรืออุปกรณ์ชำรุดภายในห้องพัก
        </p>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              หัวข้อปัญหา *
            </label>
            <input
              type="text"
              placeholder="เช่น แอร์ไม่เย็น, ก๊อกน้ำรั่ว"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-4"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              รายละเอียด *
            </label>
            <textarea
              placeholder="อธิบายอาการ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-4 resize-none"
              rows={4}
            />
          </div>

          {/* 🔥 Priority Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ระดับความสำคัญ
            </label>

            <div className="flex gap-3">
              {(["high", "medium", "low"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`px-4 py-2 rounded-xl border font-semibold transition-all ${
                    priority === level
                      ? priorityStyles[level]
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              แนบรูปภาพ (ถ้ามี)
            </label>

            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer">
                <Upload className="mb-3 text-indigo-400" size={32} />
                <p className="text-sm font-bold text-indigo-900">
                  เลือกรูปภาพ
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 rounded-2xl bg-indigo-600 p-4 text-white font-bold disabled:opacity-60"
        >
          {loading ? "กำลังส่ง..." : "ส่งเรื่องแจ้งซ่อม"}
        </button>
      </div>
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}