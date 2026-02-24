"use client"


import { useState, useEffect } from 'react'
import AdminTopNav from "@/components/AdminTopNav"
import { 
  ReceiptText, 
  Home, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  MessageSquare,
  Send,
  X,
  ChevronDown
} from 'lucide-react'

export default function BillingPage() {
  // --- 1. ข้อมูลจำลองรายการห้องพัก ---
  const availableRooms = [
    { id: '501', name: 'คุณจิรายุ ตั้งศรีสุข', email: 'jirayu.t@email.com' },
    { id: '502', name: 'คุณนีน่า มานะ', email: 'nina.m@email.com' },
    { id: '403', name: 'คุณสมชาย สายลุย', email: 'somchai.s@email.com' },
    { id: '305', name: 'คุณวิภา ใจดี', email: 'wipa.j@email.com' },
  ]

  // --- 2. State Management ---
  const [selectedRoomId, setSelectedRoomId] = useState('502')
  const [items, setItems] = useState([
    { id: 1, description: 'ค่าเช่าห้องประจำเดือน', amount: 5000 },
    { id: 2, description: 'ค่าน้ำ (เหมาจ่าย)', amount: 200 },
  ])
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')

  // ป้องกัน Hydration Error สำหรับวันที่
  useEffect(() => {
    setDueDate(new Date().toISOString().split('T')[0])
  }, [])

  // หาข้อมูลผู้เช่าจากห้องที่เลือก
  const currentTenant = availableRooms.find(r => r.id === selectedRoomId) || availableRooms[0]

  // --- 3. Logic Functions ---
  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', amount: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
    ))
  }

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    // กำหนด h-screen และ flex-col เพื่อให้ส่วน main เลื่อนได้อิสระ
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">
      {/* ส่วน Main ตั้งค่า overflow-auto เพื่อให้เลื่อนขึ้นลงได้ */}
      <main className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">
          
          {/* --- Header Section (ตามโค้ดที่คุณต้องการ) --- */}
          <div className="bg-[#1e293b] rounded-xl p-8 text-white shadow-lg flex items-start gap-6 border border-slate-700">
              {/* ส่วนของโลโก้/ไอคอน */}
              <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-400/30 shadow-inner shrink-0">
                  <div className="bg-blue-500 p-3 rounded-xl shadow-lg shadow-blue-500/50">
                      <ReceiptText size={40} className="text-white" />
                  </div>
              </div>

              {/* ส่วนของข้อความ */}
              <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2 tracking-wide leading-tight">
                      กรุณากรอกรายละเอียดเกี่ยวกับค่าเช่าและค่าบริการเพื่อแจ้งบิลให้แต่ละห้อง
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                      ระบบแจ้งเตือนค่าเช่าและค่าบริการ จะส่งไปทางกล่องข้อความของแต่ละคน 
                      เพื่อให้ลูกบ้านรับทราบและดำเนินการชำระเงินผ่านระบบของตนเองได้อย่างสะดวก
                  </p>
              </div>
          </div>

          {/* --- Main Content Boxes --- */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Box 1: ฝั่งซ้าย (ข้อมูลและรายการ) */}
            <div className="lg:flex-[1.5] bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-fit">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 font-bold">
                    <Home size={20} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">เลือกห้องที่จะเรียกเก็บ</label>
                    <div className="relative">
                      <select 
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="appearance-none bg-transparent font-bold text-lg text-slate-800 pr-8 outline-none cursor-pointer"
                      >
                        {availableRooms.map(room => (
                          <option key={room.id} value={room.id}>ห้อง {room.id}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-0 top-1.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={addItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md"
                >
                  <Plus size={16} /> เพิ่มรายการค่าใช้จ่าย
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* ข้อมูลผู้เช่า */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ชื่อผู้เช่า (Tenant)</p>
                    <p className="text-base font-bold text-slate-800 flex items-center gap-2 font-sans">
                      <User size={16} className="text-slate-400" /> {currentTenant.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">อีเมล (Contact)</p>
                    <p className="text-sm text-slate-500 font-medium italic truncate">{currentTenant.email}</p>
                  </div>
                </div>

                {/* รายการเรียกเก็บ */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">รายการเรียกเก็บเงิน</p>
                    <p className="text-[10px] text-slate-400 italic">* ข้อมูลจะปรากฏที่หน้าลูกบ้านทันที</p>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center group animate-in slide-in-from-left-2 duration-300">
                        <input 
                          type="text" 
                          value={item.description || ''}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="คำอธิบายรายการ..."
                          className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none text-sm transition-all shadow-sm"
                        />
                        <div className="relative w-44 shrink-0">
                          <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-xs">฿</span>
                          <input 
                            type="number" 
                            value={item.amount ?? 0}
                            onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                            className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-2xl text-right font-black text-blue-600 outline-none text-sm shadow-sm"
                          />
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: ฝั่งขวา (สรุปและยืนยัน) */}
            <div className="lg:flex-1 space-y-6 h-fit lg:sticky lg:top-0">
              {/* Grand Total */}
              <div className="bg-[#1e293b] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden border border-slate-700">
                <div className="absolute -right-6 -top-6 opacity-5 rotate-12 pointer-events-none">
                  <ReceiptText size={160} />
                </div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-3">Grand Total</p>
                <h2 className="text-4xl xl:text-5xl font-black tracking-tighter flex items-baseline gap-2">
                  <span className="text-2xl font-normal opacity-40">฿</span>
                  {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
              </div>

              {/* Settings & Send Button */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <Calendar size={16} className="text-blue-500" /> กำหนดชำระภายในวันที่
                  </label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-700 outline-none text-center text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <MessageSquare size={16} className="text-blue-500" /> บันทึกเพิ่มเติมถึงผู้เช่า
                  </label>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="เขียนข้อความสั้นๆ ถึงผู้เช่า..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 min-h-[100px] resize-none transition-all"
                  />
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 xl:py-5 rounded-[1.5rem] font-black text-base shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.97] group">
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  ส่งใบแจ้งหนี้ไปยังลูกบ้าน
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-8 flex justify-between items-center opacity-40 text-[10px] border-t border-slate-200">
            <p className="font-bold uppercase tracking-widest">EasyProperty Admin Panel v2.0</p>
            <p className="font-mono" suppressHydrationWarning>
              ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}