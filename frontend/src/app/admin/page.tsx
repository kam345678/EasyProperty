"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import RoomMatrix from "@/components/RoomMatrix";
import PaymentTable from "@/components/PaymentTable";
import RevenueChart from "@/components/RevenueChart";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { 
  X, User, FileText, Calendar, DollarSign, 
  BedDouble, Zap, Droplets, Phone, Mail 
} from "lucide-react";

export default function AdminDashboard() {
  const [floors, setFloors] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsData, summaryData] = await Promise.all([
          fetchWithAuth("/rooms"),
          fetchWithAuth("/dashboard-admin/summary")
        ]);

        if (Array.isArray(roomsData)) {
          // จัดกลุ่มห้องตามชั้น
          const grouped = roomsData.reduce((acc: any, room: any) => {
            if (!acc[room.floor]) acc[room.floor] = [];
            acc[room.floor].push(room);
            return acc;
          }, {});

          // เรียงลำดับชั้นจากสูงลงต่ำ
          const formatted = Object.keys(grouped)
            .sort((a, b) => Number(b) - Number(a))
            .map((floor) => ({ floor: Number(floor), rooms: grouped[floor] }));
          setFloors(formatted);
        }
        setSummary(summaryData);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen font-sans">
      {/* --- ส่วนสรุปสถิติด้านบน --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="รายได้เดือนนี้" 
          value={summary ? `฿${summary.stats.monthlyRevenue?.toLocaleString()}` : "฿0"} 
          borderColor="border-green-500" 
        />
        <StatCard 
          title="อัตราการเข้าพัก" 
          value={summary ? `${summary.stats.occupancyRate}%` : "0%"} 
          borderColor="border-rose-400" 
        />
        <StatCard 
          title="งานรอซ่อม" 
          value={summary ? summary.stats.pendingMaintenance : "0"} 
          borderColor="border-yellow-400" 
        />
        <StatCard 
          title="ห้องว่าง" 
          value={summary ? summary.stats.availableRooms : "0"} 
          borderColor="border-blue-400" 
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ผังห้องพัก (ซ้าย) */}
        <div className="col-span-12 lg:col-span-7">
          {loading ? (
            <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-slate-100 animate-pulse text-slate-400">
              กำลังโหลดข้อมูลผังห้องพัก...
            </div>
          ) : (
            <RoomMatrix floors={floors} onRoomClick={handleRoomClick} />
          )}
        </div>

        {/* ข้อมูลการจ่ายเงิน & กราฟ (ขวา) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <PaymentTable invoices={summary?.recentInvoices || []} />
          <RevenueChart data={summary?.revenueChart || []} />
        </div>
      </div>

      {/* --- Modal รายละเอียดห้องพัก --- */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className={`p-8 text-white flex justify-between items-center ${
              selectedRoom.status === 'occupied' ? 'bg-rose-500' : 'bg-emerald-500'
            }`}>
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">
                  ห้อง {selectedRoom.roomNumber}
                </h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.2em]">
                  {selectedRoom.roomType || 'Standard Unit'} • Floor {selectedRoom.floor}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* ส่วนราคาเช่า */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ราคาเช่ารายเดือน</p>
                  <p className="text-3xl font-black text-slate-800 italic">
                    ฿{selectedRoom.monthlyPrice?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase italic shadow-md">
                  Monthly
                </div>
              </div>

              {/* ข้อมูลมิเตอร์ล่าสุด (จาก lastMeterReading) */}
              {selectedRoom.lastMeter && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-3">
                    <div className="bg-amber-500 p-2 rounded-xl text-white"><Zap size={16}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase leading-none mb-1">ไฟฟ้าล่าสุด</p>
                      <p className="text-lg font-black text-slate-700 leading-none">{selectedRoom.lastMeter.electric} <span className="text-[10px] font-normal">u.</span></p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 shadow-sm flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-xl text-white"><Droplets size={16}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 uppercase leading-none mb-1">ประปาล่าสุด</p>
                      <p className="text-lg font-black text-slate-700 leading-none">{selectedRoom.lastMeter.water} <span className="text-[10px] font-normal">u.</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* ข้อมูลผู้เช่า (ดึงจาก tenantInfo.profile) */}
              {selectedRoom.tenantInfo ? (
                <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100 flex items-center gap-4 shadow-sm">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">ข้อมูลผู้เช่า</p>
                    <p className="font-black text-indigo-900 text-xl leading-tight">
                      {selectedRoom.tenantInfo.fullName}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <p className="text-xs text-indigo-600 flex items-center gap-1 font-bold">
                        <Phone size={10} /> {selectedRoom.tenantInfo.phone}
                      </p>
                      {selectedRoom.tenantInfo.email && (
                        <p className="text-xs text-indigo-400 flex items-center gap-1 font-medium">
                          <Mail size={10} /> {selectedRoom.tenantInfo.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedRoom.status === 'occupied' ? (
                <div className="p-5 bg-rose-50 rounded-3xl border border-rose-100 text-center animate-pulse">
                   <p className="text-xs text-rose-600 font-bold uppercase tracking-tighter italic">
                    ⚠️ พบสถานะเช่าอยู่ แต่ไม่พบข้อมูลผู้เช่าหรือสัญญาที่ Active
                   </p>
                </div>
              ) : null}

              {/* รายละเอียดสัญญาเช่า */}
              {selectedRoom.contractDetails && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-rose-400 uppercase flex items-center gap-2 px-1 tracking-widest">
                    <FileText size={14} /> รายละเอียดสัญญาเช่า
                  </p>
                  <div className="border-2 border-rose-100 p-6 rounded-[2.5rem] grid grid-cols-2 gap-6 bg-rose-50/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><FileText size={80} /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase mb-1 font-bold">วันที่เริ่มสัญญา</p>
                      <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                        <Calendar size={14} className="text-rose-400" /> 
                        {new Date(selectedRoom.contractDetails.startDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase mb-1 font-bold">วันที่หมดสัญญา</p>
                      <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                        <Calendar size={14} className="text-rose-400" /> 
                        {new Date(selectedRoom.contractDetails.endDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-rose-100 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase mb-1 font-bold tracking-widest">เงินมัดจำประกัน</p>
                        <p className="text-3xl font-black text-rose-600 flex items-center gap-1">
                          <DollarSign size={20} className="mt-1" /> 
                          {selectedRoom.contractDetails.deposit?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="text-[9px] font-black text-rose-300 uppercase border border-rose-200 px-3 py-1 rounded-full">Secure</div>
                    </div>
                  </div>
                </div>
              )}

              {/* รายการสิ่งอำนวยความสะดวก */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 px-1 tracking-widest">
                  <BedDouble size={14} /> สิ่งอำนวยความสะดวกภายในห้อง
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.furniture?.length > 0 ? (
                    selectedRoom.furniture.map((item: string, i: number) => (
                      <span 
                        key={i} 
                        className="px-5 py-2 bg-slate-100 text-slate-600 text-[10px] rounded-2xl font-black uppercase shadow-sm border border-slate-200 hover:bg-white hover:text-blue-600 transition-all cursor-default"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <div className="w-full py-4 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                      <p className="text-[10px] text-slate-300 font-bold uppercase italic">ไม่มีข้อมูลเฟอร์นิเจอร์</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}