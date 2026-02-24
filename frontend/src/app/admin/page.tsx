"use client"

import StatCard from "@/components/StatCard"
import RoomMatrix from "@/components/RoomMatrix"
import PaymentTable from "@/components/PaymentTable"
import RevenueChart from "@/components/RevenueChart"


export default function AdminDashboard() {

  const floors = [
    {
      floor: 5,
      rooms: [
        { id: "1", roomNumber: "501", status: "available" },
        { id: "2", roomNumber: "502", status: "available" },
        { id: "3", roomNumber: "503", status: "occupied" },
        { id: "4", roomNumber: "504", status: "occupied" },
        { id: "5", roomNumber: "505", status: "cleaning" },
        { id: "6", roomNumber: "506", status: "cleaning" },
      ],
    },
    {
      floor: 4,
      rooms: [
        { id: "7", roomNumber: "401", status: "available" },
        { id: "8", roomNumber: "402", status: "available" },
        { id: "9", roomNumber: "403", status: "occupied" },
        { id: "10", roomNumber: "404", status: "occupied" },
        { id: "11", roomNumber: "405", status: "occupied" },
        { id: "12", roomNumber: "406", status: "cleaning" },
      ],
    },
  ]

  const invoices = [
    { id: 1, invoiceNo: "#INV-1023", tenant: "Jirayu", amount: "฿12,500" },
    { id: 2, invoiceNo: "#INV-1024", tenant: "Nina", amount: "฿10,200" },
  ]

  const revenueData = [
    { month: "Nov", revenue: 30000 },
    { month: "Dec", revenue: 50000 },
    { month: "Jan", revenue: 80000 },
    { month: "Feb", revenue: 60000 },
    { month: "Mar", revenue: 90000 },
    { month: "Apr", revenue: 110000 },
  ]

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="รายได้เดือนนี้" value="120,000 บาท" borderColor="border-green-500" />
        <StatCard title="อัตราการเข้าพัก" value="85%" borderColor="border-red-400" />
        <StatCard title="งานรอซ่อม" value="8" borderColor="border-yellow-400" />
        <StatCard title="ห้องว่าง" value="2" borderColor="border-blue-400" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <RoomMatrix floors={floors} />
        </div>

        <div className="col-span-5 space-y-6">
          <PaymentTable invoices={invoices} />
          <RevenueChart data={revenueData} />
        </div>
      </div>
    </div>
  )
}