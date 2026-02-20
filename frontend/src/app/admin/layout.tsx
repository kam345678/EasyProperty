import Sidebar from "@/components/Sidebar"
import { AuthProvider } from '@/context/AuthContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </AuthProvider>
  )
}