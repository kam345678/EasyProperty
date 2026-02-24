'use client';
import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import ContractModal from './ContractModal';
import { Eye, ChevronRight } from 'lucide-react';

export default function BookingTable({ bookings }: { bookings: any[] }) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  return (
    // ตัว Container ของตารางเปลี่ยนเป็นสีขาว (bg-white)
    <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden border border-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {/* หัวตารางใช้สีเทาอ่อนเพื่อให้ดูสะอาด */}
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5 text-left">Room Unit</th>
              <th className="px-8 py-5 text-left">Resident Name</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((b: any) => (
              <tr key={b.id} className="hover:bg-blue-50/50 transition-all duration-200 group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white group-hover:bg-blue-600 transition-all duration-300 shadow-md">
                      {b.room}
                    </div>
                    <span className="font-bold text-slate-900">Monthly Unit</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`font-bold ${b.guest === '-' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {b.guest}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedRoom(b)}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 text-blue-600 rounded-xl font-bold text-[11px] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Details <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRoom && <ContractModal data={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </div>
  );
}