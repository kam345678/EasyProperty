"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { id?: string | number; name?: string | null; email?: string | null; role?: string } | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize from role cookie if present
  useEffect(() => {
    try {
      const cookies = Object.fromEntries(document.cookie.split(';').map(c => c.split('=').map(s => s.trim())))
      if (cookies['role'] === 'admin') {
        setUser({ id: 'admin', name: 'Admin', email: 'Admin@gmail.com', role: 'admin' })
      }
    } catch (e) {}
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Client-side validation per requirements
    if (password.length < 8) return { ok: false, message: 'Password must be at least 8 characters' }
    if (email !== 'Admin@gmail.com') return { ok: false, message: 'Authentication failed' }
    if (password !== '12345678') return { ok: false, message: 'Authentication failed' }

    const authUser = { id: 'admin', name: 'Admin', email, role: 'admin' }
    setUser(authUser)
    try {
      // role cookie for middleware/server checks
      document.cookie = `role=admin; path=/; max-age=${60 * 60 * 24}`
    } catch (e) {}
    return { ok: true }
  }

  const logout = async () => {
    // clear role cookie
    try {
      document.cookie = 'role=; path=/; max-age=0'
    } catch (e) {}
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

