'use client';
import React from 'react';
import { X } from 'lucide-react';

export default function ContractModal({ data, onClose }: { data: any, onClose: () => void }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Room {data.room}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Resident</p>
              <p className="text-sm font-medium text-slate-900">{data.guest}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Rent</p>
                <p className="text-sm font-bold text-slate-900">{data.rent?.toLocaleString()} ฿</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Deposit</p>
                <p className="text-sm font-bold text-slate-900">{data.deposit?.toLocaleString()} ฿</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-50 text-[11px]">
               <div className="flex justify-between font-medium">
                  <span className="text-slate-400 uppercase tracking-wider">Start Date</span>
                  <span className="text-slate-900">{data.checkIn}</span>
               </div>
               <div className="flex justify-between font-medium">
                  <span className="text-slate-400 uppercase tracking-wider">End Date</span>
                  <span className="text-slate-900">{data.checkOut}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition">
            Close
          </button>
          <button className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded transition hover:bg-black">
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}