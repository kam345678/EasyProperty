import { AuthProvider } from '@/context/AuthContext'

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-8">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}
          <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-10 text-white shadow-2xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>

            <h1 className="text-4xl font-extrabold tracking-tight">EasyProperty Tenant Portal</h1>
            <p className="mt-3 text-lg text-indigo-100">Manage your room and payments easily</p>
          </div>

          {/* Tenant content: keep page-specific UI here */}
          <div>
            {/* Previously this app redirected to /admin; tenant UI can be extended here. */}
            <p className="text-slate-700">Welcome to the EasyProperty Tenant portal.</p>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
