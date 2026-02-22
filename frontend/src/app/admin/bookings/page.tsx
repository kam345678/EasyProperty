"use client"

import { useMemo, useState } from "react"

type Booking = {
  id: number
  room: string
  guestName: string
  checkIn: string
  checkOut: string
  nights: number
  type: "Daily" | "Monthly"
  status: "Confirmed" | "Checked-in" | "Checked-out"
}

const mockData: Booking[] = [
  { id: 1, room: "101", guestName: "Jirayu Vanasin", checkIn: "2026-05-06", checkOut: "2026-05-07", nights: 1, type: "Daily", status: "Confirmed" },
  { id: 2, room: "102", guestName: "Somchai Saetang", checkIn: "2026-05-06", checkOut: "2026-05-07", nights: 1, type: "Daily", status: "Confirmed" },
  { id: 3, room: "103", guestName: "Nina Williams", checkIn: "2026-05-05", checkOut: "2026-05-07", nights: 2, type: "Daily", status: "Checked-out" },
  { id: 4, room: "104", guestName: "Kazuya Mishima", checkIn: "2026-05-06", checkOut: "2026-05-07", nights: 1, type: "Daily", status: "Confirmed" },
  { id: 5, room: "105", guestName: "Jirayu Vanasin", checkIn: "2026-05-01", checkOut: "2026-05-30", nights: 30, type: "Monthly", status: "Checked-in" },
  { id: 6, room: "106", guestName: "Somsak Rakthai", checkIn: "2026-05-06", checkOut: "2026-05-07", nights: 1, type: "Daily", status: "Confirmed" },
  { id: 7, room: "201", guestName: "John Doe", checkIn: "2026-05-06", checkOut: "2026-05-07", nights: 1, type: "Daily", status: "Confirmed" },
]

export default function BookingsPage() {
  // 1. State สำหรับค่าที่ "กำลัง" เลือกหรือพิมพ์ (ยังไม่แสดงผลในตาราง)
  const [tempStatus, setTempStatus] = useState("All")
  const [tempSearch, setTempSearch] = useState("")

  // 2. State สำหรับค่าที่ "ยืนยัน" แล้ว (ใช้ filter จริงในตาราง)
  const [appliedStatus, setAppliedStatus] = useState("All")
  const [appliedSearch, setAppliedSearch] = useState("")
  
  const [page, setPage] = useState(1)
  const perPage = 7

  // Logic การ Filter จะอ้างอิงจากค่าที่ "Applied" เท่านั้น
  const filtered = useMemo(() => {
    return mockData.filter((b) => {
      const matchesStatus = appliedStatus === "All" || b.status === appliedStatus
      const matchesSearch = 
        b.guestName.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        b.room.includes(appliedSearch)
      
      return matchesStatus && matchesSearch
    })
  }, [appliedStatus, appliedSearch])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const handleApplyFilters = () => {
    setAppliedStatus(tempStatus)
    setAppliedSearch(tempSearch)
    setPage(1) // รีเซ็ตหน้ากลับไปหน้า 1 เมื่อมีการกรองใหม่
  }

  const badgeStyle = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-600"
      case "Checked-in": return "bg-blue-600"
      case "Checked-out": return "bg-gray-600"
      default: return "bg-gray-400"
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <header>
        <div className="flex items-center gap-3 mb-1">
    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bookings</h1>
    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full mt-1">
      {filtered.length} Items
    </span>
  </div>
  <p className="text-gray-500 text-sm">ตรวจสอบและดูแลสถานะการจองทั้งหมด</p>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex items-center gap-4 border border-gray-100">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or room..."
              value={tempSearch} // เชื่อมกับค่าชั่วคราว
              className="w-full border pl-10 pr-5 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
              onChange={(e) => setTempSearch(e.target.value)}
            />
          </div>

          {/* Status Select */}
          <select
            value={tempStatus} // เชื่อมกับค่าชั่วคราว
            onChange={(e) => setTempStatus(e.target.value)}
            className="border px-5 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Checked-out">Checked-out</option>
          </select>

          {/* ปุ่ม Apply Filters */}
          <button 
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            Apply Filters
          </button>
        </div>
      </header>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="p-5 font-bold">Room</th>
              <th className="p-5 font-bold">Guest Name</th>
              <th className="p-5 font-bold">Check-In</th>
              <th className="p-5 font-bold">Check-Out</th>
              <th className="p-5 font-bold">Nights</th>
              <th className="p-5 font-bold">Type</th>
              <th className="p-5 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length > 0 ? (
              paginated.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5 font-bold text-gray-800">{b.room}</td>
                  <td className="p-5 text-gray-700 font-medium">{b.guestName}</td>
                  <td className="p-5 text-gray-500 text-sm">{new Date(b.checkIn).toLocaleDateString("en-GB")}</td>
                  <td className="p-5 text-gray-500 text-sm">{new Date(b.checkOut).toLocaleDateString("en-GB")}</td>
                  <td className="p-5 text-gray-700">{b.nights}</td>
                  <td className="p-5 text-gray-600">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${b.type === 'Monthly' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm inline-block min-w-[100px] ${badgeStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">No bookings found</p>
                    <p className="text-sm">Try adjusting your filters or search terms</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Section */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50/50">
          <div className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{filtered.length}</span> results found
          </div>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold transition-all shadow-sm ${
                  page === i + 1
                    ? "bg-blue-600 text-white border-blue-600 scale-105"
                    : "bg-white text-gray-600 hover:border-blue-300 hover:text-blue-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}