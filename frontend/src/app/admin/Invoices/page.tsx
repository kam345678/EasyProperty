"use client"

import React, { useMemo, useState } from "react"
import { Eye, Trash2, Search } from "lucide-react"

interface Invoice {
  id: string
  tenant: string
  room: string
  amount: number
  period: string
  status: "paid" | "pending"
  date: string
}

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState("")

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV001", tenant: "John Doe", room: "A101", amount: 5000, status: "paid", date: "2026-02-01",period: "May- 1-30,2026" },
    { id: "INV002", tenant: "Jane Smith", room: "B202", amount: 4500, status: "pending", date: "2026-02-05",period: "May- 1-30,2026" },
    { id: "INV003", tenant: "Michael Tan", room: "C303", amount: 6000, status: "pending", date: "2026-02-10",period: "May- 1-30,2026" },
  ])

  // 🔎 Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.tenant.toLowerCase().includes(search.toLowerCase()) ||
      inv.room.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, invoices])

  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0)

  const outstanding = invoices
    .filter(i => i.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const handleDelete = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <header className="bg-white border-b rounded-xl px-6 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">
          Invoices Management
        </h1>
        <p className="text-sm text-gray-500">
          ดูรายการบิลทั้งหมดของผู้เช่า
        </p>
      </header>

      {/* Top Section (Summary + Search) */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">

          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-3xl font-semibold mt-2">
              {total.toLocaleString()} ฿
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              รายได้รวมทั้งหมด
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Outstanding Amount</p>
            <h2 className="text-3xl font-semibold text-red-600 mt-2">
              {outstanding.toLocaleString()} ฿
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              ยอดค้างชำระทั้งหมด
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white  lg:w-80 mt-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoice, tenant, room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
    <tr>
      <th className="p-4 text-left">Invoice</th>
      <th className="p-4 text-left">Tenant</th>
      <th className="p-4 text-left">Room</th>
      <th className="p-4 text-left">Period</th>
      <th className="p-4 text-left">Amount</th>
      <th className="p-4 text-left">Status</th>
      <th className="p-4 text-center">Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredInvoices.map(inv => (
      <tr key={inv.id} className="border-t hover:bg-gray-50 transition">

        {/* Invoice */}
        <td className="p-4 font-medium text-gray-800">
          {inv.id}
        </td>

        {/* Tenant */}
        <td className="p-4">
          {inv.tenant}
        </td>

        {/* Room */}
        <td className="p-4">
          {inv.room}
        </td>

        {/* Period */}
        <td className="p-4 text-gray-600">
          {inv.period}
        </td>

        {/* Amount */}
        <td className="p-4 font-semibold">
          {inv.amount.toLocaleString()} ฿
        </td>

        {/* Status */}
        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              inv.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {inv.status}
          </span>
        </td>

        {/* Action */}
        <td className="p-4 flex justify-center gap-3">
          <button className="text-blue-600 hover:scale-110 transition">
            <Eye size={18} />
          </button>

          <button
            onClick={() => handleDelete(inv.id)}
            className="text-red-600 hover:scale-110 transition"
          >
            <Trash2 size={18} />
          </button>
        </td>

      </tr>
    ))}

    {filteredInvoices.length === 0 && (
      <tr>
        <td colSpan={7} className="text-center p-6 text-gray-400">
          No invoices found
        </td>
      </tr>
    )}
  </tbody>
</table>
        </div>
      </div>

    </div>
  )
}