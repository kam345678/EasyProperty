"use client"
import { useState, useEffect } from 'react'
import {
  UserPlus, Lock, Home, ChevronRight,
  User, Phone, ShieldCheck, UserCheck
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
    birthDate: '', 
    email: ''
  })

  const [rooms, setRooms] = useState<any[]>([]) 
  const [isLoading, setIsLoading] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<{
    username: string;
    tempPassword: string;
  } | null>(null)

  // ✅ ตั้งค่าพอร์ตให้ตรงกับ Backend (NestJS ส่วนใหญ่คือ 3000)
  const BACKEND_URL = "http://localhost:3000/api/v1";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${BACKEND_URL}/rooms`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        const data = Array.isArray(result) ? result : (result.data || result.rooms || []);
        
        if (data.length > 0) {
          const availableRooms = data.filter((room: any) => 
            room.status && room.status.toString().toLowerCase().trim() === 'available'
          );
          setRooms(availableRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
    const now = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, startDate: now, endDate: now }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "idCard") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 13) setFormData(prev => ({ ...prev, [name]: onlyNums }))
      return;
    }
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) setFormData(prev => ({ ...prev, [name]: onlyNums }))
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.idCard.length !== 13 || formData.phone.length !== 10) {
      alert("กรุณากรอกข้อมูลเลขบัตรและเบอร์โทรให้ครบถ้วน");
      return;
    }

    setIsLoading(true)
    const currentToken = localStorage.getItem('accessToken');

    if (!currentToken) {
        alert("ไม่พบรหัสเข้าใช้งาน (Token) กรุณา Login ใหม่");
        setIsLoading(false);
        return;
    }

    try {
      // --- STEP 1: สร้าง USER (ยิงไปที่ UserController) ---
      // ✅ สังเกตเส้นทาง: /users/admin/create-user (มีตัว s)
      const userPayload = {
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

      console.log("🚀 Step 1: Creating User...");
      const userRes = await fetch(`${BACKEND_URL}/users/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(userPayload),
      })

      const userResult = await userRes.json()

      if (!userRes.ok) {
        throw new Error(userResult.message || `สร้าง User ไม่สำเร็จ (${userRes.status})`);
      }

      const newUserId = userResult.user?._id; 
      const tempPass = userResult.temporaryPassword;
      console.log("✅ Step 1 Success, User ID:", newUserId);

      // --- STEP 2: ค้นหาห้อง เพื่อเอา _id ---
      const selectedRoom = rooms.find(r => r.roomNumber === formData.roomNumber);
      if (!selectedRoom) throw new Error("ไม่พบข้อมูลห้องพักที่เลือก")

      // --- STEP 3: สร้าง CONTRACT ---
      const contractPayload = {
        roomId: selectedRoom._id,
        tenantId: newUserId,
        type: 'monthly',
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'active',
        financials: {
          deposit: Number(formData.deposit),
          advancePayment: 0 
        },
        createdAt: new Date().toISOString()
      }

      console.log("🚀 Step 2: Creating Contract...");
      const contractRes = await fetch(`${BACKEND_URL}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(contractPayload),
      })

      if (!contractRes.ok) {
        const contractError = await contractRes.json()
        throw new Error(contractError.message || "สร้างสัญญาไม่สำเร็จ");
      }

      console.log("✅ Step 2 Success!");

      // --- FINISH ---
      setRegistrationResult({
        username: userResult.user?.email || formData.email,
        tempPassword: tempPass 
      })
      alert("ลงทะเบียนผู้เช่าและจัดทำสัญญาสำเร็จ!")

    } catch (error: any) {
      console.error("Submit error:", error)
      alert(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden text-slate-900">
      <main className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">

          <div className="bg-[#1e293b] rounded-xl p-8 text-white shadow-lg flex items-start gap-6 border border-slate-700">
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
              <UserPlus size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 uppercase tracking-tight">ลงทะเบียนผู้เช่าและจัดทำสัญญา</h1>
              <p className="text-slate-400 text-sm">เลือกระบุข้อมูลผู้เช่าเพื่อสร้างบัญชีและจัดการห้องพักในระบบ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-0 bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden font-sans">

            <div className="lg:flex-[1.5] flex flex-col border-r border-slate-200 bg-white">
              <div className="p-6 border-b border-slate-300 bg-slate-50/50 flex items-center gap-2 font-black text-slate-800 uppercase text-sm">
                <UserCheck size={20} className="text-blue-600" />
                <span>ข้อมูลผู้เช่าและสัญญา</span>
              </div>

              <div className="p-8 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-medium">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">หมายเลขห้องพัก (ว่าง)</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-3 text-slate-400" size={16} />
                      <select 
                        name="roomNumber" 
                        value={formData.roomNumber} 
                        required 
                        onChange={handleInputChange} 
                        className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 appearance-none"
                      >
                        <option value="">-- เลือกห้องพัก --</option>
                        {rooms.map((room) => (
                          <option key={room._id} value={room.roomNumber}>
                            ห้อง {room.roomNumber} - {room.roomType.toUpperCase()} (฿{room.prices.toLocaleString()})
                          </option>
                        ))}
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
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">เลขบัตรประชาชน (13 หลัก)</label>
                    <input name="idCard" value={formData.idCard} required onChange={handleInputChange} placeholder="เลขบัตรประชาชน 13 หลัก" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">เบอร์โทรศัพท์ (10 หลัก)</label>
                    <input name="phone" value={formData.phone} required onChange={handleInputChange} placeholder="08XXXXXXXX" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic">วันเกิด (สำหรับสร้างรหัสผ่าน)</label>
                    <input type="date" name="birthDate" value={formData.birthDate} required onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">อีเมล (Username)</label>
                    <input type="email" name="email" value={formData.email} required onChange={handleInputChange} placeholder="example@email.com" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-600">วันเริ่มสัญญา</label>
                    <input type="date" name="startDate" value={formData.startDate} required onChange={handleInputChange} className="w-full p-3 bg-blue-50 border-none rounded-xl text-sm font-bold text-blue-700" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-red-600">วันหมดสัญญา</label>
                    <input 
                        type="date" 
                        name="endDate" 
                        value={formData.endDate} 
                        min={formData.startDate} 
                        required 
                        onChange={handleInputChange} 
                        className="w-full p-3 bg-red-50 border-none rounded-xl text-sm font-bold text-red-700" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-green-600">เงินประกัน (฿)</label>
                    <input type="number" name="deposit" value={formData.deposit} required onChange={handleInputChange} placeholder="0.00" className="w-full p-3 bg-green-50 border-none rounded-xl text-sm font-bold text-green-700 outline-none" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isLoading} className={`w-full ${isLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg`}>
                    {isLoading ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการลงทะเบียน'}
                    {!isLoading && <ChevronRight size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={`lg:flex-1 flex flex-col transition-all duration-500 ${registrationResult ? 'bg-emerald-50/50' : 'bg-slate-50/30'}`}>
              <div className="p-6 border-b border-slate-300 bg-slate-50/50 flex items-center gap-2 font-black text-slate-800 uppercase text-sm">
                <Lock size={18} className="text-blue-600" />
                <span>รหัสผ่านชั่วคราว</span>
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className={`p-5 bg-white border rounded-2xl shadow-sm space-y-2 ${registrationResult ? 'border-emerald-200' : 'border-slate-200'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                    <p className="text-lg font-black text-slate-700">{registrationResult?.username || 'รอการบันทึก...'}</p>
                  </div>
                  <div className={`p-5 bg-white border rounded-2xl shadow-sm space-y-2 ${registrationResult ? 'border-emerald-200 shadow-md' : 'border-slate-200'}`}>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Temporary Password</p>
                    <p className="text-2xl font-bold text-blue-600 tracking-wider font-mono">{registrationResult?.tempPassword || '********'}</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-xs text-slate-500 leading-relaxed">
                  <ShieldCheck size={16} className="inline mr-2 text-blue-600" />
                  โปรดแจ้งรหัสผ่านนี้ให้ผู้เช่าทราบเพื่อเข้าสู่ระบบครั้งแรก
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}