"use client"

import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import { ChevronDown, Image as ImageIcon, Check, X, Eye } from 'lucide-react'

type Invoice = {
  id: string | number
  invoiceNo: string
  tenant: string
  amount: string
  slipUrl?: string | null
}

type Props = {
  invoices?: Invoice[]
  onApprove?: (inv: Invoice) => void
  onReject?: (inv: Invoice) => void
}

const sampleData: Invoice[] = [
  { id: 1, invoiceNo: '#INV-1023', tenant: 'Jirayu Vanasin', amount: '฿12,500', slipUrl: '' },
]

export default function PaymentTable({ invoices, onApprove, onReject }: Props) {
  const list = useMemo(() => (invoices && invoices.length ? invoices : sampleData), [invoices])

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | number | null>(null)

  const openPreview = (url?: string | null) => {
    if (!url) return
    setPreviewUrl(url)
  }

  const closePreview = () => setPreviewUrl(null)

  const handleApprove = (inv: Invoice) => {
    onApprove?.(inv)
    setOpenDropdown(null)
  }

  const handleReject = (inv: Invoice) => {
    onReject?.(inv)
    setOpenDropdown(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Payment Approvals</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-100 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Invoice No</th>
              <th className="text-left px-4 py-3">Tenant Name</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Slip Image</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {list.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{inv.invoiceNo}</td>
                <td className="px-4 py-3">{inv.tenant}</td>
                <td className="px-4 py-3">{inv.amount}</td>
                <td className="px-4 py-3">
                  {inv.slipUrl ? (
                    <button onClick={() => openPreview(inv.slipUrl)} className="inline-block w-20 h-12 overflow-hidden rounded-md">
                      <img src={inv.slipUrl} alt="slip" className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="w-20 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      <ImageIcon size={18} />
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === inv.id ? null : inv.id)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    <span>ยืนยันชำระ</span>
                    <ChevronDown size={14} />
                  </button>

                  {openDropdown === inv.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-md py-1 z-50">
                      <button onClick={() => handleApprove(inv)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><Check size={14} /> Approve</button>
                      <button onClick={() => handleReject(inv)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"><X size={14} /> Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!previewUrl} onClose={closePreview}>
        {previewUrl && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Slip preview</h3>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700"><Eye size={18} /></button>
            </div>
            <div className="w-full h-[60vh] bg-black/5 flex items-center justify-center">
              <img src={previewUrl} alt="preview" className="max-h-[60vh] object-contain" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}