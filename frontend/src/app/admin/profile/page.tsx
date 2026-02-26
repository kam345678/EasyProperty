"use client"

import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import { getProfile } from '@/lib/auth'
import { Upload, Save, Trash2 } from 'lucide-react'
import ModalAlert from "@/components/ModalAlert"

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info")
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getProfile()
        const resolvedUser = profile?.user ? profile.user : profile
        setUser(resolvedUser)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const previewUrl = React.useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const onSelect = (f: File | null) => {
    setFile(f)
  }

  const handleSave = async () => {
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const { data } = await api.post("/upload/avatars", formData)

      setUser((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatar: data.avatar,
        },
      }))

      setFile(null)
      setAlertType("success")
      setAlertMessage("บันทึกรูปโปรไฟล์สำเร็จ")
      setAlertOpen(true)
    } catch (err) {
      console.error("Failed to upload avatar", err)
      setAlertType("error")
      setAlertMessage("อัปโหลดรูปโปรไฟล์ไม่สำเร็จ")
      setAlertOpen(true)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    try {
      await api.delete("/upload/avatars")

      setUser((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatar: null,
        },
      }))
      setAlertType("success")
      setAlertMessage("ลบรูปโปรไฟล์สำเร็จ")
      setAlertOpen(true)
    } catch (err) {
      console.error("Failed to remove avatar", err)
      setAlertType("error")
      setAlertMessage("ลบรูปโปรไฟล์ไม่สำเร็จ")
      setAlertOpen(true)
    }

    setFile(null)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return <div className="p-6 text-red-500">ไม่พบข้อมูลผู้ดูแลระบบ</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {(user as any)?.profile?.avatar.url ? (
                <img src={(user as any).profile.avatar.url} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{(user as any)?.profile?.fullName ?? 'Admin'}</h2>
              <p className="text-sm text-gray-500">{user?.email ?? 'Admin@gmail.com'}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1 bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Profile Image</label>
              <div className="flex items-center gap-3">
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <label htmlFor="file-input" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border hover:shadow transition text-sm cursor-pointer">
                  <Upload size={16} />
                  <span>Choose image</span>
                </label>
                <div className="text-sm text-gray-500">PNG, JPG up to 5MB</div>
              </div>
            </div>

            <div className="col-span-1 bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="w-full h-44 bg-white rounded-md flex items-center justify-center border border-dashed">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="h-full object-contain" />
                ) : (user as any)?.profile?.avatar.url ? (
                  <img src={(user as any).profile.avatar.url} alt="saved" className="h-full object-contain" />
                ) : (
                  <div className="text-sm text-gray-400">No preview available</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={!file || uploading} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:shadow transition disabled:opacity-50">
              <Save size={16} />
              <span>Save</span>
            </button>

            <button onClick={handleRemove} className="inline-flex items-center gap-2 bg-white border px-4 py-2 rounded-xl hover:shadow transition">
              <Trash2 size={16} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  )
}
