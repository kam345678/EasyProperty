"use client"

import { useState, useEffect } from 'react'
import AdminTopNav from "@/components/AdminTopNav"
import {
  UserPlus, Mail, Lock, Home, ChevronRight,
  User, Phone, CreditCard, Calendar, ShieldCheck, UserCheck
} from 'lucide-react'

export default function RegisterTenantPage() {
  const [formData, setFormData] = useState({
    roomNumber: '', fullName: '', idCard: '', phone: '',
    startDate: '', endDate: '', deposit: '',
    email: '', username: '', password: '', confirmPassword: ''
  })

  useEffect(() => {
    const now = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, startDate: now }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit Data:", formData)
    alert("ลงทะเบียนสำเร็จ!")
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
                บันทึกข้อมูลส่วนบุคคลและรายละเอียดสัญญาเช่าเพื่อเริ่มต้นการใช้งานระบบ
              </p>
            </div>
          </div>

          {/* --- Main Content Area (2 Boxes ติดกัน) --- */}
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-0 bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden font-sans">

            {/* Box 1: ข้อมูลผู้เช่า (ฝั่งซ้าย) */}
            <div className="lg:flex-[1.5] flex flex-col border border-slate-300 rounded-[2rem] overflow-hidden bg-white shadow-xl">
              <div className="p-6 border-b border-slate-300 bg-slate-50/50 flex items-center gap-2 font-black text-slate-800 uppercase text-sm tracking-wider">
                <UserCheck size={20} className="text-blue-600" />
                <span>ข้อมูลผู้เช่าและสัญญา</span>
              </div>

              <div className="p-8 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-medium">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">หมายเลขห้องพัก</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-3 text-slate-400" size={16} />
                      <select name="roomNumber" value={formData.roomNumber || ''} required onChange={handleInputChange} className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 appearance-none">
                        <option value="">เลือกห้องพัก...</option>
                        <option value="501">ห้อง 501</option>
                        <option value="502">ห้อง 502</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">ชื่อ-นามสกุล</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input name="fullName" value={formData.fullName || ''} required onChange={handleInputChange} placeholder="ชื่อจริง - นามสกุล" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">เลขบัตรประชาชน</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input name="idCard" value={formData.idCard || ''} required onChange={handleInputChange} placeholder="1-xxxx-xxxxx-xx-x" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">เบอร์โทรศัพท์</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input name="phone" value={formData.phone || ''} required onChange={handleInputChange} placeholder="08x-xxx-xxxx" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  {/* เพิ่มวันเกิด */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-slate-600">วันเกิด</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input type="date" name="birthDate" value={formData.birthDate || ''} required onChange={handleInputChange} className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">อีเมล</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3 text-slate-400" size={16} />
                      <input type="email" name="email" value={formData.email || ''} required onChange={handleInputChange} placeholder="email@example.com" className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm shadow-sm" />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-blue-600">วันเริ่มสัญญา</label>
                    <input type="date" name="startDate" value={formData.startDate || ''} required onChange={handleInputChange} className="w-full p-3 bg-blue-50 border border-blue-100 rounded-xl outline-none text-sm text-blue-700 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-red-600">วันหมดสัญญา</label>
                    <input type="date" name="endDate" value={formData.endDate || ''} required onChange={handleInputChange} className="w-full p-3 bg-red-50 border border-red-100 rounded-xl outline-none text-sm text-red-700 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 italic text-green-600">เงินประกัน (฿)</label>
                    <input type="number" name="deposit" value={formData.deposit || ''} required onChange={handleInputChange} placeholder="0.00" className="w-full p-3 bg-green-50 border border-green-100 rounded-xl outline-none font-bold text-green-700 text-sm" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.97] group">
                    <span>ยืนยันการลงทะเบียน</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

           {/* Box 2: ฝั่งขวา (ข้อมูลเข้าระบบจาก Backend) */}
<div className="lg:flex-1 bg-slate-50/30 flex flex-col border border-slate-300">
  <div className="p-6 border-b border-slate-300 bg-slate-50/50 flex items-center gap-2 font-black text-slate-800 uppercase text-sm tracking-wider">
    <Lock size={18} className="text-blue-600" />
    <span>ข้อมูลเข้าระบบ</span>
  </div>

  <div className="p-8 space-y-6 flex-1 flex flex-col justify-center">
    {/* ส่วนแสดง Username ที่ระบบเจนให้ */}
    <div className="space-y-4">
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อผู้ใช้งาน (Generated Username)</p>
        <div className="flex items-center justify-between">
          {/* สมมติว่าดึงมาจาก backend: data.username */}
          <span className="text-lg font-black text-slate-700">{formData.username || 'ระบบจะสร้างให้อัตโนมัติ'}</span>
          <User size={20} className="text-slate-300" />
        </div>
      </div>

      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัสผ่านชั่วคราว (Temporary Password)</p>
        <div className="flex items-center justify-between font-mono">
          <span className="text-lg font-bold text-blue-600 tracking-wider">********</span>
          <Lock size={20} className="text-slate-300" />
        </div>
      </div>
    </div>

    {/* คำแนะนำการใช้งาน */}
    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
        <ShieldCheck size={16} />
        System Security Notice
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        ข้อมูลการเข้าใช้งานจะถูกส่งไปยังอีเมล <span className="font-bold text-slate-700">{formData.email || 'ที่ระบุ'}</span> โดยอัตโนมัติ 
        ผู้เช่าต้องเปลี่ยนรหัสผ่านเมื่อเข้าสู่ระบบครั้งแรก
      </p>
    </div>

    <div className="mt-auto pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 text-center uppercase tracking-tighter">
      Data will be synchronized with central server
    </div>
  </div>
</div>

          </form>

          {/* Footer */}
          <footer className="flex justify-between items-center px-4 pt-8 border-t border-slate-200 opacity-40 text-[9px] font-bold uppercase tracking-widest">
            <p>EasyProperty System v2.0</p>
            <p suppressHydrationWarning>ID: {Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
          </footer>
        </div>
      </main>
    </div>
  )
}