"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import RoomMatrix from "@/components/RoomMatrix";
import PaymentTable from "@/components/PaymentTable";
import RevenueChart from "@/components/RevenueChart";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { 
  X, User, FileText, Calendar, DollarSign, 
  BedDouble, Zap, Droplets, Phone, Mail, Plus 
} from "lucide-react";

export default function AdminDashboard() {
  const [floors, setFloors] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFurniture, setNewFurniture] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsData, summaryData] = await Promise.all([
          fetchWithAuth("/rooms"),
          fetchWithAuth("/dashboard-admin/summary")
        ]);

        if (Array.isArray(roomsData)) {
          const grouped = roomsData.reduce((acc: any, room: any) => {
            if (!acc[room.floor]) acc[room.floor] = [];
            acc[room.floor].push(room);
            return acc;
          }, {});

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

  // ✅ ฟังก์ชันอัปเดตเฟอร์นิเจอร์ (รักษาข้อมูลเก่าไว้ครบถ้วน)
  const handleUpdateFurniture = async (updatedList: string[]) => {
    try {
      const response = await fetchWithAuth(`/rooms/${selectedRoom._id}/amenities`, {
        method: 'PATCH',
        data: { 
          amenities: updatedList 
        }
      });

      if (response) {
        // 1. อัปเดตข้อมูลใน Modal (ใช้ ...selectedRoom เพื่อไม่ให้มิเตอร์และสัญญาหาย)
        setSelectedRoom({ 
          ...selectedRoom, 
          furniture: updatedList,
          amenities: updatedList // อัปเดตทั้งคู่เพื่อความชัวร์
        });
        
        // 2. อัปเดตข้อมูลใน floors หลัก (ใช้ ...r เพื่อรักษาข้อมูลห้องอื่นๆ)
        setFloors(prevFloors => prevFloors.map(f => ({
          ...f,
          rooms: f.rooms.map((r: any) => 
            r._id === selectedRoom._id ? { ...r, furniture: updatedList, amenities: updatedList } : r
          )
        })));
        
        console.log("บันทึกเฟอร์นิเจอร์สำเร็จ!");
      }
    } catch (error: any) {
      console.error("Update Error:", error.response?.data || error);
      alert("ไม่สามารถบันทึกได้: " + (error.response?.data?.message || "เกิดข้อผิดพลาด"));
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen font-sans">
      {/* --- ส่วนสถิติ --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="รายได้เดือนนี้" value={summary ? `฿${summary.stats.monthlyRevenue?.toLocaleString()}` : "฿0"} borderColor="border-green-500" />
        <StatCard title="อัตราการเข้าพัก" value={summary ? `${summary.stats.occupancyRate}%` : "0%"} borderColor="border-rose-400" />
        <StatCard title="งานรอซ่อม" value={summary ? summary.stats.pendingMaintenance : "0"} borderColor="border-yellow-400" />
        <StatCard title="ห้องว่าง" value={summary ? summary.stats.availableRooms : "0"} borderColor="border-blue-400" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          {loading ? (
            <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-slate-100 animate-pulse text-slate-400">กำลังโหลด...</div>
          ) : (
            <RoomMatrix floors={floors} onRoomClick={handleRoomClick} />
          )}
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <PaymentTable invoices={summary?.recentInvoices || []} />
          <RevenueChart data={summary?.revenueChart || []} />
        </div>
      </div>

      {/* --- Modal รายละเอียดห้องพัก --- */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className={`p-8 text-white flex justify-between items-center ${selectedRoom.status === 'occupied' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">ห้อง {selectedRoom.roomNumber}</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-[0.2em]">{selectedRoom.roomType || 'Standard'} • Floor {selectedRoom.floor}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* ราคาเช่า */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ราคาเช่ารายเดือน</p>
                  <p className="text-3xl font-black text-slate-800 italic">฿{selectedRoom.monthlyPrice?.toLocaleString() || "0"}</p>
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase shadow-md">Monthly</div>
              </div>

              {/* มิเตอร์น้ำไฟ (ข้อมูลจะไม่หายแล้ว) */}
              {selectedRoom.lastMeter && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 flex items-center gap-3">
                    <div className="bg-amber-500 p-2 rounded-xl text-white"><Zap size={16}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 leading-none mb-1">ไฟฟ้าล่าสุด</p>
                      <p className="text-lg font-black text-slate-700">{selectedRoom.lastMeter.electric} u.</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-xl text-white"><Droplets size={16}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 leading-none mb-1">ประปาล่าสุด</p>
                      <p className="text-lg font-black text-slate-700">{selectedRoom.lastMeter.water} u.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ข้อมูลผู้เช่า */}
              {selectedRoom.tenantInfo && (
                <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100 flex items-center gap-4 shadow-sm">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><User size={24} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">ข้อมูลผู้เช่า</p>
                    <p className="font-black text-indigo-900 text-xl leading-tight">{selectedRoom.tenantInfo.fullName}</p>
                    <p className="text-xs text-indigo-600 font-bold"><Phone size={10} className="inline mr-1" /> {selectedRoom.tenantInfo.phone}</p>
                  </div>
                </div>
              )}
              
              {/* สัญญาเช่า */}
              {selectedRoom.contractDetails && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-rose-400 uppercase flex items-center gap-2 px-1 tracking-widest"><FileText size={14} /> รายละเอียดสัญญา</p>
                  <div className="border-2 border-rose-100 p-6 rounded-[2.5rem] grid grid-cols-2 gap-6 bg-rose-50/20">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase mb-1 font-bold">เริ่มสัญญา</p>
                      <p className="text-sm font-black text-slate-700">{new Date(selectedRoom.contractDetails.startDate).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase mb-1 font-bold">มัดจำ</p>
                      <p className="text-lg font-black text-rose-600">฿{selectedRoom.contractDetails.deposit?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ส่วนจัดการเฟอร์นิเจอร์ */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 px-1 tracking-widest"><BedDouble size={14} /> สิ่งอำนวยความสะดวก</p>
                <div className="flex gap-2">
                  <input 
                    type="text" value={newFurniture} onChange={(e) => setNewFurniture(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && newFurniture.trim()) { handleUpdateFurniture([...(selectedRoom.furniture || []), newFurniture.trim()]); setNewFurniture(""); } }}
                    placeholder="เพิ่มรายการ..." className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <button onClick={() => { if(newFurniture.trim()) { handleUpdateFurniture([...(selectedRoom.furniture || []), newFurniture.trim()]); setNewFurniture(""); } }}
                    className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all"><Plus size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedRoom.furniture || []).map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-[10px] rounded-2xl font-black uppercase border border-slate-200">
                      {item}
                      <button onClick={() => { const newList = selectedRoom.furniture.filter((_: any, idx: number) => idx !== i); handleUpdateFurniture(newList); }}
                        className="text-slate-300 hover:text-rose-500 transition-colors"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}