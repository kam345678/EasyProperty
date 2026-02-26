"use client"

import { useEffect, useState } from "react"
import ModalAlert from "@/components/ModalAlert"

interface MaintenanceItem {
  id: string
  tenant: string
  room: string
  issue: string
  description: string
  priority: "urgent" | "high" | "medium"
  date: string
  status: "pending" | "in_progress" | "resolved"
  images: {
    url: string
    publicId: string
  }[]
  repairLogs: {
    status: string
    note: string
    updatedAt: string
  }[]
}

function PriorityBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    urgent: "bg-red-50 text-red-600 border border-red-200",
    high: "bg-orange-50 text-orange-600 border border-orange-200",
    medium: "bg-blue-50 text-blue-600 border border-blue-200",
  }

  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider ${styles[value] || "bg-gray-100 text-gray-600"}`}>
      {value?.toUpperCase()}
    </span>
  )
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    in_progress: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  }

  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider ${styles[value] || "bg-gray-100 text-gray-600"}`}>
      {value?.replace("_", " ").toUpperCase()}
    </span>
  )
}

export default function AdminMaintenancePage() {
  const [data, setData] = useState<MaintenanceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertConfirmAction, setAlertConfirmAction] = useState<(() => void) | undefined>(undefined)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch("http://localhost:3000/api/v1/maintenance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()

      const formatted: MaintenanceItem[] = result.map((item: any) => ({
        id: item._id,
        tenant: item.reportedBy?.email || "Unknown",
        room: item.roomId?.roomNumber
          ? `Room ${item.roomId.roomNumber} (Floor ${item.roomId.floor})`
          : "-",
        issue: item.title,
        description: item.description,
        priority: item.priority,
        date: new Date(item.createdAt).toLocaleString(),
        status: item.status === "completed" ? "resolved" : item.status,
        images: item.images || [],
        repairLogs: item.repairLogs || [],
      }))

      setData(formatted)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch(
        `http://localhost:3000/api/v1/maintenance/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      )

      if (!res.ok) {
        setAlertType("error")
        setAlertMessage("อัปเดตสถานะไม่สำเร็จ")
        setAlertOpen(true)
        return
      }

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "resolved" } : item
        )
      )

      setSelectedItem((prev) =>
        prev ? { ...prev, status: "resolved" } : prev
      )
      setAlertType("success")
      setAlertMessage("อัปเดตสถานะสำเร็จ")
      setAlertOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = (id: string) => {
    setAlertType("info")
    setAlertMessage("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")
    setAlertConfirmAction(() => async () => {
      try {
        const token = localStorage.getItem("accessToken")

        const res = await fetch(
          `http://localhost:3000/api/v1/maintenance/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) {
          setAlertType("error")
          setAlertMessage("ลบงานไม่สำเร็จ")
          setAlertConfirmAction(undefined)
          return
        }

        setData((prev) => prev.filter((item) => item.id !== id))
        setSelectedItem(null)

        setAlertType("success")
        setAlertMessage("ลบงานสำเร็จ")
        setAlertConfirmAction(undefined)
      } catch (error) {
        console.error(error)
        setAlertType("error")
        setAlertMessage("เกิดข้อผิดพลาดขณะลบงาน")
        setAlertConfirmAction(undefined)
      }
    })
    setAlertOpen(true)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Maintenance Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all property repair requests
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-semibold tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                      กำลังโหลดข้อมูล...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    ไม่มีรายการแจ้งซ่อมในขณะนี้
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{item.tenant}</td>
                    <td className="px-6 py-4 text-gray-600">{item.room}</td>
                    <td className="px-6 py-4 text-gray-900 group-hover:text-indigo-600 transition-colors">{item.issue}</td>
                    <td className="px-6 py-4">
                      <PriorityBadge value={item.priority} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{item.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge value={item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8 relative transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Maintenance Detail</h2>
              <p className="text-xs text-gray-500 mt-1">Ref ID: {selectedItem.id}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Tenant</span>
                  <span className="font-medium text-gray-900">{selectedItem.tenant}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Room</span>
                  <span className="font-medium text-gray-900">{selectedItem.room}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Status</span>
                  <StatusBadge value={selectedItem.status} />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Priority</span>
                  <PriorityBadge value={selectedItem.priority} />
                </div>
              </div>

              <div>
                <h3 className="text-gray-500 text-xs font-medium mb-1">Title</h3>
                <p className="font-medium text-gray-900 text-base">{selectedItem.issue}</p>
              </div>

              <div>
                <h3 className="text-gray-500 text-xs font-medium mb-1">Description</h3>
                <p className="text-gray-700 bg-gray-50/50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div>
                <h3 className="text-gray-500 text-xs font-medium mb-1">Reported on</h3>
                <p className="text-gray-700">{selectedItem.date}</p>
              </div>

              {selectedItem.images.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-gray-900 font-semibold mb-3 border-b pb-2">Attached Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedItem.images.map((img, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img
                          src={img.url}
                          alt={`Maintenance attachment ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 flex flex-wrap gap-3 mt-4 border-t border-gray-100">
                {selectedItem.status === "pending" && (
                  <button
                    onClick={() => handleComplete(selectedItem.id)}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ทำงานเสร็จแล้ว
                  </button>
                )}

                {selectedItem.status === "resolved" && (
                  <button
                    onClick={() => handleDelete(selectedItem.id)}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors border border-red-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    ลบงาน
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 sm:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                >
                  ปิดหน้าต่าง
                </button>
              </div>

            </div>
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