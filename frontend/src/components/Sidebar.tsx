"use client"


import Link from 'next/link'
import { Home, Calendar, FileText, Wrench, BarChart2, Receipt, UserPlus } from 'lucide-react'

const items = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/billing', label: 'Billing', icon: Receipt },
  { href: '/admin/Invoices', label: 'Invoices', icon: FileText },
  { href: '/admin/Register', label: 'Register Tenant', icon: UserPlus},
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
]

interface SidebarProps {
  pathname: string;
}

export default function Sidebar({ pathname }: SidebarProps) {

  return (
    <aside className="w-60 bg-slate-900 text-slate-100 h-full flex flex-col p-6 shrink-0">
      <div className="mb-8">
        <div className="text-white text-2xl font-extrabold">EasyProperty</div>
        <div className="text-sm text-slate-400 mt-1">Admin</div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          
          // --- Logic Fix: Dashboard จะ active เฉพาะตอนอยู่หน้า /admin เท่านั้น ---
          const active = it.href === '/admin' 
            ? pathname === '/admin' 
            : pathname === it.href || pathname?.startsWith(it.href + '/')
          
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                active 
                ? 'bg-slate-800 border-l-4 border-blue-500 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{it.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 text-xs text-slate-400">
        © 2026 EasyProperty
      </div>
    </aside>
  )
}