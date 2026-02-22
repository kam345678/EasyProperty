'use client';
import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

type Booking = {
  id: number;
  room: string;
  guest: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  type: string;
  status: string;
};

export default function BookingTable({ bookings, total, pageSize }: { bookings: Booking[]; total: number; pageSize: number }) {
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-In</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-Out</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nights</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{b.room}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{b.guest}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(b.checkIn).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(b.checkOut).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{b.nights}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{b.type}</td>
                <td className="px-6 py-4 text-sm"> <StatusBadge status={b.status} /> </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {bookings.length}/{total}</div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded-md ${page===p ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'} hover:shadow`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
