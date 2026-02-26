"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Eye, Trash2, Search } from "lucide-react"
import { invoiceService } from "@/services/invoice.service"
import ModalAlert from "@/components/ModalAlert"

interface Invoice {
  _id: string
  tenantId?: {
    name?: string
    firstName?: string
    lastName?: string
    email?: string
    profile?: {
      firstName?: string
      lastName?: string
      fullName?: string
    }
  }
  roomId?: {
    roomNumber?: string
  }
  amounts: {
    grandTotal: number
  }
  billingPeriod: string
  payment: {
    status: "pending" | "paid_pending_review" | "paid" | "rejected" | "overdue"
    slipUrl?: string
  }
  createdAt: string
}

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState("")

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertConfirmAction, setAlertConfirmAction] = useState<(() => void) | undefined>(undefined)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceService.getAllInvoices()
        const invoiceData = data.data || data
        setInvoices(invoiceData)
        console.log("Invoices response:", invoiceData)
        if (invoiceData?.length) {
          console.log("First invoice tenant object:", invoiceData[0].tenantId)
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  // 🔎 Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv._id.toLowerCase().includes(search.toLowerCase()) ||
      inv.tenantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.roomId?.roomNumber?.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, invoices])

  const total = invoices
    .filter(inv => inv.payment?.status === "paid")
    .reduce((sum, inv) => sum + (inv.amounts?.grandTotal || 0), 0)

  const outstanding = invoices
    .filter(inv =>
      inv.payment?.status === "pending" ||
      inv.payment?.status === "rejected"
    )
    .reduce((sum, inv) => sum + (inv.amounts?.grandTotal || 0), 0)

  const handleDelete = (id: string) => {
    setAlertType("info")
    setAlertMessage("คุณต้องการลบบิลนี้ใช่หรือไม่?")
    setAlertConfirmAction(() => async () => {
      try {
        await invoiceService.deleteInvoice(id)
        setInvoices(prev => prev.filter(inv => inv._id !== id))
        setAlertType("success")
        setAlertMessage("ลบบิลสำเร็จ")
        setAlertConfirmAction(undefined)
      } catch (error: any) {
        console.error("Failed to delete invoice:", error)
        setAlertType("error")
        setAlertMessage(
          error?.response?.data?.message ||
          "ไม่สามารถลบบิลได้ กรุณาลองใหม่อีกครั้ง"
        )
        setAlertConfirmAction(undefined)
      }
    })
    setAlertOpen(true)
  }

  const handleConfirm = async (id: string, status: "paid" | "rejected") => {
    try {
      await invoiceService.confirmInvoice(id, status)
      setInvoices(prev =>
        prev.map(inv =>
          inv._id === id
            ? {
                ...inv,
                payment: { ...inv.payment, status },
              }
            : inv
        )
      )
    } catch (error) {
      console.error("Failed to confirm invoice:", error)
    }
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
    {loading && (
      <tr>
        <td colSpan={7} className="text-center p-6 text-gray-400">
          Loading invoices...
        </td>
      </tr>
    )}
    {filteredInvoices.map(inv => (
      <tr key={inv._id} className="border-t hover:bg-gray-50 transition">

        {/* Invoice */}
        <td className="p-4 font-medium text-gray-800">
          {inv._id}
        </td>

        {/* Tenant */}
        <td className="p-4">
          {inv.tenantId
            ? inv.tenantId.profile?.fullName ||
              `${inv.tenantId.profile?.firstName || ""} ${inv.tenantId.profile?.lastName || ""}`.trim() ||
              inv.tenantId.name ||
              "-"
            : "-"}
        </td>

        {/* Room */}
        <td className="p-4">
          {inv.roomId?.roomNumber || "-"}
        </td>

        {/* Period */}
        <td className="p-4 text-gray-600">
          {inv.billingPeriod}
        </td>

        {/* Amount */}
        <td className="p-4 font-semibold">
          {(inv.amounts?.grandTotal || 0).toLocaleString()} ฿
        </td>

        {/* Status */}
        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              inv.payment?.status === "paid"
                ? "bg-green-100 text-green-700"
                : inv.payment?.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : inv.payment?.status === "paid_pending_review"
                ? "bg-blue-100 text-blue-700"
                : inv.payment?.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {inv.payment?.status}
          </span>
        </td>

        {/* Action */}
        <td className="p-4 flex justify-center gap-3">
          <button
            onClick={() => setSelectedInvoice(inv)}
            className="text-blue-600 hover:scale-110 transition"
          >
            <Eye size={18} />
          </button>

          {inv.payment?.status === "paid_pending_review" && (
            <>
              <button
                onClick={() => handleConfirm(inv._id, "paid")}
                className="text-green-600 text-xs border border-green-600 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition"
              >
                Approve
              </button>

              <button
                onClick={() => handleConfirm(inv._id, "rejected")}
                className="text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
              >
                Reject
              </button>
            </>
          )}

          <button
            onClick={() => handleDelete(inv._id)}
            className="text-red-600 hover:scale-110 transition"
          >
            <Trash2 size={18} />
          </button>
        </td>

      </tr>
    ))}

    {!loading && filteredInvoices.length === 0 && (
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

    {/* Invoice Detail Modal */}
    {selectedInvoice && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
          
          <h2 className="text-xl font-semibold mb-4">
            Invoice Detail
          </h2>

          <div className="space-y-2 text-sm">
            <p><strong>Invoice ID:</strong> {selectedInvoice._id}</p>
            <p><strong>Tenant:</strong> 
              {selectedInvoice.tenantId?.profile?.fullName ||
               `${selectedInvoice.tenantId?.profile?.firstName || ""} ${selectedInvoice.tenantId?.profile?.lastName || ""}`.trim() ||
               selectedInvoice.tenantId?.name ||
               "-"}
            </p>
            <p><strong>Room:</strong> {selectedInvoice.roomId?.roomNumber || "-"}</p>
            <p><strong>Period:</strong> {selectedInvoice.billingPeriod}</p>
            <p><strong>Total:</strong> {(selectedInvoice.amounts?.grandTotal || 0).toLocaleString()} ฿</p>
            <p><strong>Status:</strong> {selectedInvoice.payment?.status}</p>
          </div>

          {selectedInvoice.payment?.slipUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Payment Slip:</p>
              <img
                src={selectedInvoice.payment.slipUrl}
                alt="Slip"
                className="rounded-lg border max-h-64 object-contain"
              />
            </div>
          )}

          {selectedInvoice.payment?.status === "paid_pending_review" && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={async () => {
                  await handleConfirm(selectedInvoice._id, "paid")
                  setSelectedInvoice(null)
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Approve Payment
              </button>

              <button
                onClick={async () => {
                  await handleConfirm(selectedInvoice._id, "rejected")
                  setSelectedInvoice(null)
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Reject Payment
              </button>
            </div>
          )}

          <button
            onClick={() => setSelectedInvoice(null)}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

        </div>
      </div>
    )}

      <ModalAlert
        open={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={() => {
          setAlertOpen(false)
          setAlertConfirmAction(undefined)
        }}
        onConfirm={alertConfirmAction}
      />
    </div>
  )
}