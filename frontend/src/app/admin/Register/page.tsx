"use client"
import { useState, useEffect } from 'react'
import {
  UserPlus, Mail, Lock, Home, ChevronRight,
  User, Phone, CreditCard, Calendar, ShieldCheck, UserCheck
} from 'lucide-react'

export default function RegisterTenantPage() {
  const [formData, setFormData] = useState({
    roomNumber: '',
    fullName: '',
    idCard: '',
    phone: '',
    startDate: '',
    endDate: '',
    deposit: '',
    birthDate: '', // สำคัญ: NestJS ใช้ตัวนี้เจนรหัสผ่าน
    email: ''
  })

  const [rooms, setRooms] = useState<any[]>([]) // เก็บข้อมูลห้องจาก DB
  const [isLoading, setIsLoading] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<{
    username: string;
    tempPassword: string;
  } | null>(null)

  // 1. ดึงข้อมูลห้องพักที่มีสถานะ available จากฐานข้อมูลจริง
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:3000/rooms?status=available', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setRooms(data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();

    // ตั้งค่าวันเริ่มสัญญาเป็นปัจจุบัน
    const now = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, startDate: now }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const token = localStorage.getItem('access_token');

    // 2. จัด Payload ให้ตรงตาม CreateUserByAdminDto และ ProfileDto ของคุณ
    const payload = {
      email: formData.email,
      role: 'tenant',
      profile: {
        fullName: formData.fullName,
        phone: formData.phone,
        idCardNumber: formData.idCard,
        birthDate: formData.birthDate,
        avatarUrl: null,
        avatarPublicId: null
      }
    }

    try {
      // 3. ยิง API ไปที่ UsersController
      const response = await fetch('http://localhost:3000/users/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        // ดึงค่า temporaryPassword ตามชื่อที่เขียนไว้ใน users.service.ts
        setRegistrationResult({
          username: result.user?.email || formData.email,
          tempPassword: result.temporaryPassword 
        })
        alert("ลงทะเบียนผู้เช่าและสร้างบัญชีสำเร็จ!")
      } else {
        alert(result.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("ไม่สามารถเชื่อมต่อกับ Server ได้")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">

      <main className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">

          {/* --- Header Section --- */}
          <div className="bg-[#1e293b] rounded-xl p-8 text-white shadow-lg flex items-start gap-6 border border-slate-700">
            <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-400/30 shadow-inner shrink-0">
              <div className="bg-blue-500 p-3 rounded-xl shadow-lg shadow-blue-500/50">
                <UserPlus size={40} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 tracking-wide leading-tight">
                ลงทะเบียนผู้เช่าและจัดทำสัญญา
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                เลือกห้องพักจากฐานข้อมูลและระบุข้อมูลผู้เช่า รหัสผ่านจะถูกสร้างจาก <span className="text-blue-400 font-bold">อีเมล + วันเกิด</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-0 bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden font-sans">

            {/* Box 1: ฝั่งซ้าย - ข้อมูลผู้เช่า */}
            <div className="lg:flex-[1.5] flex flex-col border-r border-slate-200 bg-white">
              <div className="p-6 border-b border-slate-300 bg-slate-50/50 flex items-center gap-2 font-black text-slate-800 uppercase text-sm tracking-wider">
                <UserCheck size={20} className="text-blue-600" />
                <span>ข้อมูลผู้เช่าและสัญญา</span>
              </div>

              <div className="p-8 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-medium">
                  
                  {/* --- หมายเลขห้องพัก ดึงจาก DB --- */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">หมายเลขห้องพัก (จากระบบ)</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-3 text-slate-400" size={16} />
                      <select 
                        name="roomNumber" 
                        value={formData.roomNumber} 
                        required 
                        onChange={handleInputChange} 
                        className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 appearance-none"
                      >
                        <option value="">เลือกห้องพักที่ว่าง...</option>
                        {rooms.map((room) => (
                          <option key={room._id} value={room.roomNumber}>
                            ห้อง {room.roomNumber} - {room.roomType.toUpperCase()} (฿{room.prices.toLocaleString()})
                          </option>
                        ))}
                        {rooms.length === 0 && <option disabled>ไม่มีห้องว่างในฐานข้อมูล</option>}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">ชื่อ-นามสกุล</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input name="fullName" value={formData.fullName} required onChange={handleInputChange} placeholder="ชื่อจริง - นามสกุล" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">เลขบัตรประชาชน</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input name="idCard" value={formData.idCard} required onChange={handleInputChange} placeholder="1-xxxx-xxxxx-xx-x" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">เบอร์โทรศัพท์</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input name="phone" value={formData.phone} required onChange={handleInputChange} placeholder="08x-xxx-xxxx" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-slate-600">วันเกิด (ใช้สร้างรหัสผ่าน)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input type="date" name="birthDate" value={formData.birthDate} required onChange={handleInputChange} className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">อีเมล (ใช้เป็น Username)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input type="email" name="email" value={formData.email} required onChange={handleInputChange} placeholder="email@example.com" className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm shadow-sm" />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-blue-600">วันเริ่มสัญญา</label>
                    <input type="date" name="startDate" value={formData.startDate} required onChange={handleInputChange} className="w-full p-3 bg-blue-50 border border-blue-100 rounded-xl outline-none text-sm text-blue-700 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-red-600">วันหมดสัญญา</label>
                    <input type="date" name="endDate" value={formData.endDate} required onChange={handleInputChange} className="w-full p-3 bg-red-50 border border-red-100 rounded-xl outline-none text-sm text-red-700 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-green-600">เงินประกัน (฿)</label>
                    <input type="number" name="deposit" value={formData.deposit} required onChange={handleInputChange} placeholder="0.00" className="w-full p-3 bg-green-50 border border-green-100 rounded-xl outline-none font-bold text-green-700 text-sm" />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full ${isLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.97] group`}
                  >
                    <span>{isLoading ? 'กำลังประมวลผล...' : 'ยืนยันการลงทะเบียน'}</span>
                    {!isLoading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Box 2: ฝั่งขวา - ข้อมูลเข้าระบบจาก Backend */}
            <div className={`lg:flex-1 flex flex-col transition-all duration-500 ${registrationResult ? 'bg-emerald-50/50' : 'bg-slate-50/30'}`}>
              <div className="p-6 border-b border-slate-300 bg-slate-50/50 flex items-center gap-2 font-black text-slate-800 uppercase text-sm tracking-wider">
                <Lock size={18} className="text-blue-600" />
                <span>ข้อมูลเข้าระบบ</span>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className={`p-5 bg-white border rounded-2xl shadow-sm space-y-3 transition-all ${registrationResult ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-200'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อผู้ใช้งาน (Username)</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-black ${registrationResult ? 'text-emerald-700' : 'text-slate-400 italic'}`}>
                        {registrationResult?.username || 'รอการบันทึกข้อมูล...'}
                      </span>
                      <User size={20} className={registrationResult ? 'text-emerald-500' : 'text-slate-300'} />
                    </div>
                  </div>

                  <div className={`p-5 bg-white border rounded-2xl shadow-sm space-y-3 transition-all ${registrationResult ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-200'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัสผ่านชั่วคราว (Temporary Password)</p>
                    <div className="flex items-center justify-between font-mono">
                      <span className={`text-xl font-bold ${registrationResult ? 'text-blue-600 animate-pulse' : 'text-slate-300'}`}>
                        {registrationResult?.tempPassword || '********'}
                      </span>
                      <Lock size={20} className={registrationResult ? 'text-blue-500' : 'text-slate-300'} />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                    <ShieldCheck size={16} />
                    Security Notice
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {registrationResult 
                      ? "สร้างบัญชีสำเร็จ! รหัสผ่านคือ [อีเมล prefix + วันเกิด] โปรดแจ้งให้ผู้เช่าทราบ" 
                      : "เมื่อกดลงทะเบียน ระบบ NestJS จะสุ่มสร้างรหัสผ่านและคืนค่ามาแสดงที่นี่"}
                  </p>
                </div>
              </div>
            </div>
          </form>

          <footer className="flex justify-between items-center px-4 pt-8 border-t border-slate-200 opacity-40 text-[9px] font-bold uppercase tracking-widest">
            <p>EasyProperty System v2.0</p>
            <p suppressHydrationWarning>SYNC: {formData.roomNumber || 'PENDING'}</p>
          </footer>
        </div>
      </main>
    </div>
  )
}