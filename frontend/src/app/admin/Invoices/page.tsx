"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Eye, Trash2, Search } from "lucide-react"
import { invoiceService } from "@/services/invoice.service"

interface Invoice {
  _id: string
  tenantId?: {
    name?: string
    profile?: {
      firstName?: string
      lastName?: string
      fullName?: string
    }
  }
  roomId?: {
    roomNumber?: string
  }
  amounts?: {
    grandTotal?: number
  }
  billingPeriod?: string
  payment?: {
    status?: "pending" | "paid_pending_review" | "paid" | "rejected" | "overdue"
    slipUrl?: string
  }
  createdAt?: string
}

export default function AdminInvoicesPage() {

  const [search, setSearch] = useState("")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // =========================
  // Fetch invoices
  // =========================

  useEffect(() => {

    const fetchInvoices = async () => {

      try {

        setLoading(true)

        const res = await invoiceService.getAllInvoices()

        const data = Array.isArray(res)
          ? res
          : res?.data ?? []

        setInvoices(data)

      } catch (error) {

        console.error("Fetch invoices failed:", error)
        setInvoices([])

      } finally {

        setLoading(false)

      }

    }

    fetchInvoices()

  }, [])

  // =========================
  // Filter
  // =========================

  const filteredInvoices = useMemo(() => {

    const lower = search.toLowerCase()

    return invoices.filter(inv => {

      const tenant =
        inv.tenantId?.profile?.fullName ||
        `${inv.tenantId?.profile?.firstName ?? ""} ${inv.tenantId?.profile?.lastName ?? ""}` ||
        inv.tenantId?.name ||
        ""

      const room = inv.roomId?.roomNumber ?? ""

      return (
        inv._id?.toLowerCase().includes(lower) ||
        tenant.toLowerCase().includes(lower) ||
        room.toLowerCase().includes(lower)
      )

    })

  }, [search, invoices])

  // =========================
  // Summary
  // =========================

  const total = invoices.reduce(
    (sum, inv) => sum + (inv.amounts?.grandTotal ?? 0),
    0
  )

  const outstanding = invoices
    .filter(i => i.payment?.status === "pending")
    .reduce(
      (sum, inv) => sum + (inv.amounts?.grandTotal ?? 0),
      0
    )

  // =========================
  // Delete
  // =========================

  const handleDelete = async (id: string) => {

    if (!confirm("ลบบิลนี้ใช่หรือไม่?")) return

    try {

      await invoiceService.deleteInvoice(id)

      setInvoices(prev =>
        prev.filter(inv => inv._id !== id)
      )

    } catch (error: any) {

      console.error(error)
      alert("ไม่สามารถลบได้")

    }

  }

  // =========================
  // Confirm
  // =========================

  const handleConfirm = async (
    id: string,
    status: "paid" | "rejected"
  ) => {

    try {

      await invoiceService.confirmInvoice(id, status)

      setInvoices(prev =>
        prev.map(inv =>
          inv._id === id
            ? {
                ...inv,
                payment: {
                  ...inv.payment,
                  status
                }
              }
            : inv
        )
      )

    } catch (error) {

      console.error(error)

    }

  }

  // =========================
  // Render
  // =========================

  return (

    <div className="p-6 space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold">
          Invoices Management
        </h1>
        <p className="text-gray-500 text-sm">
          รายการบิลทั้งหมด
        </p>
      </div>

      {/* Summary */}

      <div className="flex gap-6">

        <div className="bg-white p-4 rounded shadow">
          Total: {(total ?? 0).toLocaleString()} ฿
        </div>

        <div className="bg-white p-4 rounded shadow text-red-600">
          Outstanding: {(outstanding ?? 0).toLocaleString()} ฿
        </div>

        <div className="relative ml-auto">

          <Search
            size={16}
            className="absolute left-2 top-2.5 text-gray-400"
          />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 border rounded px-3 py-2"
            placeholder="Search..."
          />

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded shadow">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Tenant</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {loading && (

              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading...
                </td>
              </tr>

            )}

            {!loading && filteredInvoices.map(inv => {

              const tenant =
                inv.tenantId?.profile?.fullName ||
                `${inv.tenantId?.profile?.firstName ?? ""} ${inv.tenantId?.profile?.lastName ?? ""}` ||
                inv.tenantId?.name ||
                "-"

              return (

                <tr key={inv._id} className="border-b">

                  <td className="p-3">
                    {inv._id}
                  </td>

                  <td className="p-3">
                    {tenant}
                  </td>

                  <td className="p-3">
                    {inv.roomId?.roomNumber ?? "-"}
                  </td>

                  <td className="p-3">
                    {inv.billingPeriod ?? "-"}
                  </td>

                  <td className="p-3">
                    {(inv.amounts?.grandTotal ?? 0).toLocaleString()} ฿
                  </td>

                  <td className="p-3">
                    {inv.payment?.status ?? "-"}
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <Eye size={18}/>
                    </button>

                    <button
                      onClick={() => handleDelete(inv._id)}
                    >
                      <Trash2 size={18}/>
                    </button>

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

      {/* Modal */}

      {selectedInvoice && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-96">

            <h2 className="text-lg font-semibold mb-4">
              Invoice Detail
            </h2>

            <p>ID: {selectedInvoice._id}</p>
            <p>
              Amount:
              {(selectedInvoice.amounts?.grandTotal ?? 0).toLocaleString()} ฿
            </p>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="mt-4 border px-3 py-1 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  )

}