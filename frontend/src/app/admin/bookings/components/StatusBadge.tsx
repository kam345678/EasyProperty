'use client';
import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    'Available': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Occupied': 'bg-rose-50 text-rose-600 border-rose-200',
  };

  return (
    <div className="flex items-center justify-center">
      <span className={`
        px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm
        ${colorMap[status] || 'bg-slate-100 text-slate-400 border-slate-200'}
      `}>
        {status}
      </span>
    </div>
  );
}