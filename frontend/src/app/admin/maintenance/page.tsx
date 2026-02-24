"use client"


import { useEffect, useState } from "react"

interface MaintenanceItem {
  id: string
  room: string
  issue: string
  priority: "urgent" | "high" | "medium"
  date: string
  status: "pending" | "in_progress" | "resolved"
}

function PriorityBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    urgent: "bg-red-100 text-red-600",
    high: "bg-yellow-100 text-yellow-600",
    medium: "bg-indigo-100 text-indigo-600",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[value]}`}>
      {value.toUpperCase()}
    </span>
  )
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    pending: "bg-orange-100 text-orange-600",
    in_progress: "bg-blue-100 text-blue-600",
    resolved: "bg-green-100 text-green-600",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[value]}`}>
      {value.replace("_", " ").toUpperCase()}
    </span>
  )
}

export default function AdminMaintenancePage() {
  const [data, setData] = useState<MaintenanceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 ตรงนี้เปลี่ยนเป็น API จริงภายหลังได้เลย
    const fetchData = async () => {
      try {
        // const res = await fetch("/api/maintenance")
        // const result = await res.json()
        // setData(result)

        // mock structure ชั่วคราว
        setData([])
      } catch (error) {
        console.error("Failed to fetch maintenance data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
        <p className="text-sm text-gray-500">
          Manage and track all repair requests from tenants
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-wrap gap-4 items-center">
        <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Time</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Room</th>
              <th className="px-6 py-4 text-left">Issue</th>
              <th className="px-6 py-4 text-left">Priority</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Loading maintenance requests...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No maintenance requests found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">{item.room}</td>
                  <td className="px-6 py-4">{item.issue}</td>
                  <td className="px-6 py-4">
                    <PriorityBadge value={item.priority} />
                  </td>
                  <td className="px-6 py-4">{item.date}</td>
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
  )
}
