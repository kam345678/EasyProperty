"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Upload, Save, Trash2 } from 'lucide-react'

const STORAGE_KEY = 'adminProfileImage'

export default function AdminProfilePage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [savedUrl, setSavedUrl] = useState<string | null>(null)

  useEffect(() => {
    // load saved image from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSavedUrl(stored)
    } catch (e) {}
  }, [])

  useEffect(() => {
    // create preview object URL when file changes
    if (!file) {
      // clear preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const onSelect = (f: File | null) => {
    setFile(f)
  }

  const handleSave = async () => {
    if (!file) return
    // convert to base64 to persist
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      try {
      localStorage.setItem(STORAGE_KEY, dataUrl)
      setSavedUrl(dataUrl)
      // notify other listeners/tab
      try { window.dispatchEvent(new CustomEvent('adminProfileImageUpdated', { detail: dataUrl })) } catch (e) {}
        // clear preview and file selection
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        setFile(null)
      } catch (e) {
        console.error('Failed to save image', e)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      try { window.dispatchEvent(new CustomEvent('adminProfileImageUpdated', { detail: null })) } catch (e) {}
    } catch (e) {}
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setFile(null)
    setSavedUrl(null)
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {savedUrl ? (
                <img src={savedUrl} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user?.name ?? 'Admin'}</h2>
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
                ) : savedUrl ? (
                  <img src={savedUrl} alt="saved" className="h-full object-contain" />
                ) : (
                  <div className="text-sm text-gray-400">No preview available</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={!file} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:shadow transition disabled:opacity-50">
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
    </div>
  )
}
