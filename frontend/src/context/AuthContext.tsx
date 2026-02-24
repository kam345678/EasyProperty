"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

type User = { id?: string | number; name?: string | null; email?: string | null; role?: string } | null

type AuthContextType = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get('/auth/profile')
        setUser(data?.user ? data.user : data)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      })

      setUser(data?.user ? data.user : data)
      return { ok: true }
    } catch (err: any) {
      return {
        ok: false,
        message:
          err.response?.data?.message || 'Authentication failed',
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {}
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
