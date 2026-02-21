"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAuth } from '@/context/AuthContext'
import { Bell, User, Search, ChevronsDown } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminTopNav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  // Load avatar from localStorage on mount and when pathname changes
  useEffect(() => {
    try {
      const img = localStorage.getItem('adminProfileImage')
      setAvatarUrl(img)
    } catch (e) {
      setAvatarUrl(null)
    }
  }, [pathname])

  // Listen to storage events from other tabs and custom events in same tab
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'adminProfileImage') setAvatarUrl(e.newValue)
    }
    function onCustom(e: Event) {
      const ev = e as CustomEvent<string | null>
      setAvatarUrl(ev.detail ?? null)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('adminProfileImageUpdated', onCustom as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('adminProfileImageUpdated', onCustom as EventListener)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="w-full flex items-center justify-between rounded-md bg-white px-6 shadow-xs">
  <div className="flex items-center">
    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
      Admin Dashboard
    </h1>
  </div>


        <div className="flex-1 px-6">
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="search"
              placeholder="Search properties, tenants"
              className="w-full bg-gray-100 rounded-full py-3 px-4 pl-10 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="p-2 rounded hover:bg-gray-100 transition">
            <Bell size={18} className="text-gray-600" />
          </button>

          <div className="relative" ref={ref}>
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-gray-700">{user?.name ? user.name.charAt(0) : 'A'}</span>
                )}
              </div>
              <ChevronsDown size={14} className="text-gray-600" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-md py-1 z-50">
                <button onClick={() => { setOpen(false); router.push('/admin/profile') }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><User size={14} /> View Profile</button>
                <button onClick={() => { logout(); setOpen(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
