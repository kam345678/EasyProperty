"use client"

import { useMemo, useState } from "react"
import BookingFilters from "./components/BookingFilters"
import BookingTable from "./components/BookingTable"
import { LayoutDashboard, Sparkles, Search } from 'lucide-react'

const mockData = [
  { id: 1, room: "101", guest: "Jirayu Vanasin", checkIn: "2026-05-01", checkOut: "2027-05-01", status: "Occupied", rent: 5500, deposit: 11000 },
  { id: 2, room: "102", guest: "-", checkIn: "-", checkOut: "-", status: "Available", rent: 5500, deposit: 11000 },
  { id: 3, room: "103", guest: "Nina Williams", checkIn: "2025-12-01", checkOut: "2026-12-01", status: "Occupied", rent: 6000, deposit: 12000 },
  { id: 4, room: "104", guest: "-", checkIn: "-", checkOut: "-", status: "Available", rent: 5500, deposit: 11000 },
  { id: 5, room: "105", guest: "Somsak Rakthai", checkIn: "2026-01-15", checkOut: "2027-01-15", status: "Occupied", rent: 5500, deposit: 11000 },
]

export default function BookingsPage() {
  const [filterState, setFilterState] = useState({ status: 'All', search: '' });

  const filteredBookings = useMemo(() => {
    return mockData.filter((b) => {
      const matchesStatus = filterState.status === "All" || b.status === filterState.status;
      const matchesSearch = b.guest.toLowerCase().includes(filterState.search.toLowerCase()) || 
                           b.room.includes(filterState.search);
      return matchesStatus && matchesSearch;
    });
  }, [filterState]);

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      {/* --- Premium Header (Dark Accents) --- */}
      <header className="w-full bg-white px-8 py-6 border-b border-slate-200 shrink-0 shadow-sm relative z-10">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            {/* กล่องไอคอนสีเข้ม Slate-900 */}
            <div className="bg-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-200">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-0.5 bg-slate-950 ">
                <Sparkles size={12} className="text-slate-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory System</p>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Room <span className="text-slate-900 underline decoration-blue-500 decoration-4 underline-offset-4">Inventory</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-1 h-8 bg-slate-900 rounded-full" />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Units</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{mockData.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-[#f8fafc]">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <BookingFilters onApply={(val: any) => setFilterState(val)} />
          <BookingTable bookings={filteredBookings} />
          
          <footer className="py-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
              EasyProperty Admin Console v2.4.0
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}