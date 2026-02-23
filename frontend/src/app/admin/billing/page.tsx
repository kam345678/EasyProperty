"use client"

import { useState, useMemo } from "react"

type Room = {
  id: string
  roomNumber: string
  tenantName: string
  tenantEmail: string
}

type BillItem = {
  type: string
  amount: number
}

export default function BillingPage() {
  // 🔹 mock ห้อง (เอาไว้ก่อน)
  const rooms: Room[] = [
    {
      id: "1",
      roomNumber: "101",
      tenantName: "Somchai Jaidee",
      tenantEmail: "somchai@email.com",
    },
    {
      id: "2",
      roomNumber: "102",
      tenantName: "Suda Dee",
      tenantEmail: "suda@email.com",
    },
  ]

  const [selectedRoomId, setSelectedRoomId] = useState<string>("")
  const [items, setItems] = useState<BillItem[]>([
    { type: "ค่าน้ำ", amount: 0 },
    { type: "ค่าไฟ", amount: 0 },
  ])
  const [message, setMessage] = useState("")

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.amount), 0)
  }, [items])

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items]
    // @ts-ignore
    updated[index][field] = field === "amount" ? Number(value) : value
    setItems(updated)
  }

  const addItem = () => {
    setItems([...items, { type: "รายการเพิ่มเติม", amount: 0 }])
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* 🔹 ฝั่งซ้าย */}
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* เลือกห้อง */}
          <div>
            <label className="font-semibold">เลือกห้องพัก</label>
            <select
              className="w-full mt-2 border p-2 rounded"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">-- เลือกห้อง --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  ห้อง {room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          {/* แสดง tenant */}
          {selectedRoom && (
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>ชื่อ:</strong> {selectedRoom.tenantName}</p>
              <p><strong>อีเมล:</strong> {selectedRoom.tenantEmail}</p>
            </div>
          )}

          {/* รายการบิล */}
          <div>
            <h2 className="font-semibold mb-3">รายการบิล</h2>

            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={item.type}
                  onChange={(e) =>
                    handleItemChange(index, "type", e.target.value)
                  }
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) =>
                    handleItemChange(index, "amount", e.target.value)
                  }
                  className="w-32 border p-2 rounded"
                />
              </div>
            ))}

            <button
              onClick={addItem}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + เพิ่มรายการ
            </button>
          </div>

          {/* รวมเงิน */}
          <div className="text-right font-bold text-lg">
            รวมทั้งหมด: {totalAmount.toLocaleString()} บาท
          </div>
        </div>

        {/* 🔹 ฝั่งขวา */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">ข้อความถึงผู้เช่า</h2>
          <textarea
            rows={10}
            className="w-full border p-3 rounded"
            placeholder="พิมพ์ข้อความถึงผู้เช่า..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button className="mt-4 w-full bg-green-600 text-white py-3 rounded font-semibold">
            ส่งแจ้งเตือน
          </button>
        </div>
      </div>
    </div>
  )
}