"use client"

import { useState } from "react"
import Modal from "./Modal"

type Room = {
  id: string
  roomNumber: string
  status: string
}

type Floor = {
  floor: number
  rooms: Room[]
}

const statusColor: Record<string, string> = {
  available: "bg-green-500",
  occupied: "bg-red-500",
  booked: "bg-blue-500",
  cleaning: "bg-yellow-400",
}

export default function RoomMatrix({ floors }: { floors: Floor[] }) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const updateStatus = async (status: string) => {
    if (!selectedRoom) return   // ✅ กัน null crash

    await fetch(`http://localhost:3000/rooms/${selectedRoom.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    setSelectedRoom(null)
  }

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow board max-w-full">
        <h2 className="text-xl font-bold mb-4">Room Status</h2>

       {/* ภายใน floors.map */}
{floors.map((floor) => (
  <div key={floor.floor} className="mb-8"> {/* เพิ่ม margin-bottom ระหว่างชั้นเล็กน้อย */}
    
    {/* แก้ไขตรงนี้: เพิ่มเส้นขอบด้านล่างให้ชื่อชั้น */}
    <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">
      {floor.floor}th Floor
    </h3>

    <div className="flex gap-2 flex-wrap border-b-3 border-slate-200 pb-4 overflow-x-auto">
      {floor.rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => setSelectedRoom(room)}
          className={`cursor-pointer w-10 h-8 sm:w-14 sm:h-10 min-w-[40px] rounded-lg shadow-sm text-white flex items-center justify-center text-xs sm:text-xs font-bold transition-transform hover:scale-105 active:scale-95 ${statusColor[room.status]}`}
        >
          {room.roomNumber}
        </div>
      ))}
    </div>
  </div>
))}
      </div>

      <Modal
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
      >
        {selectedRoom && (
          <>
            <h2 className="text-xl font-bold mb-4">
              ห้อง {selectedRoom.roomNumber}
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => updateStatus("available")}
                className="w-full bg-green-500 text-white p-2 rounded"
              >
                ว่าง
              </button>

              <button
                onClick={() => updateStatus("occupied")}
                className="w-full bg-red-500 text-white p-2 rounded"
              >
                มีคนอยู่
              </button>

              <button
                onClick={() => updateStatus("cleaning")}
                className="w-full bg-yellow-400 text-white p-2 rounded"
              >
                รอทำความสะอาด
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}