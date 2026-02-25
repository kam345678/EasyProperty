"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import RoomMatrix from "@/components/RoomMatrix";
import PaymentTable from "@/components/PaymentTable";
import RevenueChart from "@/components/RevenueChart";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  status: "available" | "occupied" | "cleaning" | "maintenance";
}

export default function AdminDashboard() {
  const [floors, setFloors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);

        // ✅ ใช้ fetchWithAuth (baseURL มี /api/v1 แล้ว)
        const data: Room[] = await fetchWithAuth("/rooms");

        if (!Array.isArray(data)) {
          console.error("Rooms response is not array:", data);
          return;
        }

        // 🔹 group ตามชั้น
        const grouped = data.reduce((acc: any, room) => {
          if (!acc[room.floor]) {
            acc[room.floor] = [];
          }

          acc[room.floor].push({
            id: room._id,
            roomNumber: room.roomNumber,
            status: room.status,
          });

          return acc;
        }, {});

        const formatted = Object.keys(grouped)
          .sort((a, b) => Number(b) - Number(a))
          .map((floor) => ({
            floor: Number(floor),
            rooms: grouped[floor],
          }));

        setFloors(formatted);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const invoices = [
    { id: 1, invoiceNo: "#INV-1023", tenant: "Jirayu", amount: "฿12,500" },
    { id: 2, invoiceNo: "#INV-1024", tenant: "Nina", amount: "฿10,200" },
  ];

  const revenueData = [
    { month: "Nov", revenue: 30000 },
    { month: "Dec", revenue: 50000 },
    { month: "Jan", revenue: 80000 },
    { month: "Feb", revenue: 60000 },
    { month: "Mar", revenue: 90000 },
    { month: "Apr", revenue: 110000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="รายได้เดือนนี้"
          value="120,000 บาท"
          borderColor="border-green-500"
        />
        <StatCard
          title="อัตราการเข้าพัก"
          value="85%"
          borderColor="border-red-400"
        />
        <StatCard
          title="งานรอซ่อม"
          value="8"
          borderColor="border-yellow-400"
        />
        <StatCard
          title="ห้องว่าง"
          value="2"
          borderColor="border-blue-400"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          {loading ? (
            <div className="p-6 text-gray-500">กำลังโหลดข้อมูลห้อง...</div>
          ) : (
            <RoomMatrix floors={floors} />
          )}
        </div>

        <div className="col-span-5 space-y-6">
          <PaymentTable invoices={invoices} />
          <RevenueChart data={revenueData} />
        </div>
      </div>
    </div>
  );
}