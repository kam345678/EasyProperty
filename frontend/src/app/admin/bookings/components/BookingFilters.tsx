'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function BookingFilters({ onApply }: { onApply: (data: any) => void }) {
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  const handleUpdate = (newStatus: string, newSearch: string) => {
    onApply({ status: newStatus, search: newSearch });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900 p-5 rounded-[2rem] border border-slate-800 shadow-xl">
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
        {['All', 'Available', 'Occupied'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); handleUpdate(s, search); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              status === s 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-80 group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search room or resident..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); handleUpdate(status, e.target.value); }}
          className="w-full pl-11 pr-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-600 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}