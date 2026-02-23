"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Calendar,
  FileText,
  Wrench,
  BarChart2,
  DollarSign,
  UserPlus,
  CreditCard
} from 'lucide-react'

const items = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/invoices', label: 'Invoices', icon: FileText },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/admin/income-expenses', label: 'Income & Expenses', icon: DollarSign },
  { href: '/admin/register', label: 'Register', icon: UserPlus },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-slate-900 text-slate-100 h-full flex flex-col p-6">
      <div className="mb-8">
        <div className="text-white text-2xl font-extrabold">EasyProperty</div>
        <div className="text-sm text-slate-400 mt-1">Admin</div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const Icon = it.icon
          const active = pathname === it.href || pathname?.startsWith(it.href + '/')
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${active ? 'bg-slate-800 border-l-4 border-blue-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{it.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} EasyProperty</div>
    </aside>
  )
}