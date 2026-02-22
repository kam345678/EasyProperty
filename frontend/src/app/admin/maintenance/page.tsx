"use client"

import AdminTopNav from "@/components/AdminTopNav"
import { useState } from "react"

const mockData = [
  {
    id: "#MR-1072",
    room: "301",
    issue: "แอร์ไม่เย็น",
    priority: "urgent",
    date: "May 11, 10:33 AM",
    status: "in_progress",
  },
  {
    id: "#MR-1071",
    room: "401",
    issue: "ประตูเสีย",
    priority: "high",
    date: "May 11, 10:33 AM",
    status: "pending",
  },
  {
    id: "#MR-1076",
    room: "502",
    issue: "น้ำไม่ไหล",
    priority: "medium",
    date: "May 11, 10:33 AM",
    status: "resolved",
  },
]

function PriorityBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    urgent: "bg-red-600 text-white",
    high: "bg-yellow-400 text-black",
    medium: "bg-indigo-600 text-white",
  }

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${styles[value]}`}>
      {value.toUpperCase()}
    </span>
  )
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    pending: "bg-orange-500 text-white",
    in_progress: "bg-blue-600 text-white",
    resolved: "bg-green-600 text-white",
  }

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${styles[value]}`}>
      {value.replace("_", " ").toUpperCase()}
    </span>
  )
}

export default function AdminMaintenancePage() {
  const [data] = useState(mockData)

  return (
    <div className="space-y-6">
      <AdminTopNav />

      {/* Title */}
      <h1 className="text-2xl font-bold">Maintenance</h1>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-center">
        <select className="border rounded-md px-3 py-2 text-sm">
          <option>All Time</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>

        <select className="border rounded-md px-3 py-2 text-sm">
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Room</th>
              <th className="px-6 py-3 text-left">Issue</th>
              <th className="px-6 py-3 text-left">Priority</th>
              <th className="px-6 py-3 text-left">Date Reported</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{item.id}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}