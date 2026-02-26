"use client"

import React, { useEffect, useState } from "react"
import Modal from "./Modal"
import { Image as ImageIcon, Check, X, Eye, ExternalLink, Loader2 } from "lucide-react"
import { invoiceService } from "@/services/invoice.service"

type Invoice = {
  _id: string
  billingPeriod: string
  tenantId?: {
    _id: string
    email: string
    profile?: { fullName?: string }
  }
  roomId?: {
    _id: string
    roomNumber: string
  }
  amounts?: {
    grandTotal: number
  }
  payment?: {
    status: "pending" | "paid_pending_review" | "paid" | "rejected" | "overdue"
    slipUrl?: string // ❗ ตัวปัญหา: บางอันมี บางอันไม่มี
  }
}



export default function PaymentTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await invoiceService.getAllInvoices()
      const invoiceData = response?.data || response || []
      
      // ✅ แก้ไข: กรองเอาเฉพาะรายการที่รอแอดมินตรวจสอบสลิปเท่านั้น
      const filtered = Array.isArray(invoiceData) 
        ? invoiceData.filter((inv: Invoice) => inv.payment?.status === "paid_pending_review")
        : []
        
      setInvoices(filtered)
    } catch (error) {
      console.error("Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInvoices() }, [])

  // เปลี่ยนส่วนนี้
  const handleConfirm = async (id: string, status: "paid" | "rejected") => {
    try {
      // 1. ยิง API บอกหลังบ้านให้เปลี่ยนสถานะ
      await invoiceService.confirmInvoice(id, status)
      
      // 2. ✅ ลบรายการออกจากหน้าจอทันที ไม่ต้องรอโหลดใหม่ (Optimistic Update)
      setInvoices((prev) => prev.filter((inv) => inv._id !== id))
      
    } catch (error) {
      console.error("Update Error:", error)
      alert("Error updating status")
    }
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
          รายการชำระเงิน <span className="text-blue-500">({invoices.length})</span>
        </h2>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : invoices.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold uppercase italic text-xs">ไม่มีรายการรอตรวจสอบ</div>
      ) : (
        /* ✅ แก้ไข Scrollbar: ใช้ max-h และ custom-scrollbar */
        <div className="rounded-3xl border border-slate-100 overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto overflow-x-auto custom-scrollbar">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Tenant / Room</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-center">Slip</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-600 italic">{inv.billingPeriod}</td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-800 leading-none">{inv.tenantId?.profile?.fullName || inv.tenantId?.email}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">ห้อง {inv.roomId?.roomNumber}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-700 italic italic">฿{(inv.amounts?.grandTotal || 0).toLocaleString()}</td>
                    
                    {/* ✅ แก้ไขรูปภาพ: เช็คให้ดีก่อนโชว์ */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {inv.payment?.slipUrl ? (
                          <button
                            onClick={() => setPreviewUrl(inv.payment!.slipUrl!)}
                            className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200 hover:ring-blue-400 transition-all active:scale-95 group/img"
                          >
                            <img src={inv.payment.slipUrl} alt="slip" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity"><Eye size={14} /></div>
                          </button>
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleConfirm(inv._id, "paid")}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-[9px] font-black uppercase italic bg-emerald-500 text-white hover:bg-emerald-600 transition-all active:scale-95"
                        >
                          <Check size={9} /> Approve
                        </button>

                        <button
                          onClick={() => handleConfirm(inv._id, "rejected")}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-[9px] font-black uppercase italic bg-rose-500 text-white hover:bg-rose-600 transition-all active:scale-95"
                        >
                          <X size={9} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slip Preview Modal */}
      <Modal isOpen={!!previewUrl} onClose={() => setPreviewUrl(null)}>
        {previewUrl && (
          <div className="p-4 text-center">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-black uppercase italic">Evidence</h3>
               <button onClick={() => window.open(previewUrl, '_blank')} className="text-blue-500 flex items-center gap-1 text-[10px] font-bold uppercase">Full View <ExternalLink size={12}/></button>
             </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-100 p-2 inline-block border-4 border-white">
              <img src={previewUrl} alt="slip" className="max-h-[70vh] object-contain rounded-2xl" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}