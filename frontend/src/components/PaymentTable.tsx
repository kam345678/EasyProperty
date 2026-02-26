"use client"

import React, { useEffect, useState } from "react"
import Modal from "./Modal"
import { ChevronDown, Image as ImageIcon, Check, X, Eye } from "lucide-react"
import { invoiceService } from "@/services/invoice.service"

type Invoice = {
  _id: string
  billingPeriod: string
  tenantId?: {
    name?: string
    profile?: {
      fullName?: string
      firstName?: string
      lastName?: string
    }
  }
  roomId?: {
    roomNumber?: string
  }
  amounts?: {
    grandTotal?: number
  }
  payment?: {
    status?: "pending" | "paid_pending_review" | "paid" | "rejected" | "overdue"
    slipUrl?: string
  }
}



export default function PaymentTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Fetch invoices จาก backend
const fetchInvoices = async () => {
  try {
    setLoading(true)

    const response = await invoiceService.getAllInvoices()
    const invoiceData = response?.data || response || []

    console.log("========== RAW INVOICE DATA ==========")
    console.log(invoiceData)
    console.log("======================================")

    setInvoices(invoiceData) // ❗ ยังไม่ filter

  } catch (error) {
    console.error("Fetch Invoice Error:", error)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchInvoices()
  }, [])

  const openPreview = (url?: string) => {
    if (!url) return
    setPreviewUrl(url)
  }

  const closePreview = () => setPreviewUrl(null)

  // ✅ Approve / Reject
  const handleConfirm = async (
    id: string,
    status: "paid" | "rejected"
  ) => {
    try {
      await invoiceService.confirmInvoice(id, status)

      // โหลดใหม่หลังอัปเดต
      await fetchInvoices()
      setOpenDropdown(null)

    } catch (error) {
      console.error("Confirm Error:", error)
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
    }
  }

  const getTenantName = (inv: Invoice) => {
    return (
      inv.tenantId?.profile?.fullName ||
      `${inv.tenantId?.profile?.firstName || ""} ${inv.tenantId?.profile?.lastName || ""}`.trim() ||
      inv.tenantId?.name ||
      "-"
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          รายการรออนุมัติเงิน
        </h2>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">
          กำลังโหลด...
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-sm text-gray-400">
          ไม่มีรายการรออนุมัติ
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-100">

            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">Period</th>
                <th className="text-left px-4 py-3">Tenant</th>
                <th className="text-left px-4 py-3">Room</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Slip</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-t hover:bg-gray-50">

                  {/* Period */}
                  <td className="px-4 py-3">
                    {inv.billingPeriod}
                  </td>

                  {/* Tenant */}
                  <td className="px-4 py-3">
                    {getTenantName(inv)}
                  </td>

                  {/* Room */}
                  <td className="px-4 py-3">
                    {inv.roomId?.roomNumber || "-"}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-medium">
                    {(inv.amounts?.grandTotal || 0).toLocaleString()} ฿
                  </td>

                  {/* Slip */}
                  <td className="px-4 py-3">
                    {inv.payment?.slipUrl ? (
                      <button
                        onClick={() => openPreview(inv.payment?.slipUrl)}
                        className="inline-block w-20 h-12 overflow-hidden rounded-md border"
                      >
                        <img
                          src={inv.payment.slipUrl}
                          alt="slip"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="w-20 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === inv._id ? null : inv._id
                        )
                      }
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      <span>จัดการ</span>
                      <ChevronDown size={14} />
                    </button>

                    {openDropdown === inv._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-md py-1 z-50">
                        <button
                          onClick={() =>
                            handleConfirm(inv._id, "paid")
                          }
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Check size={14} /> Approve
                        </button>

                        <button
                          onClick={() =>
                            handleConfirm(inv._id, "rejected")
                          }
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slip Preview Modal */}
      <Modal isOpen={!!previewUrl} onClose={closePreview}>
        {previewUrl && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Slip Preview
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye size={18} />
              </button>
            </div>

            <div className="w-full h-[60vh] bg-black/5 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-[60vh] object-contain"
              />
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}