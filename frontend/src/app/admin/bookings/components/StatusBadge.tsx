'use client';
import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  const base = 'inline-flex px-3 py-1 rounded-full text-sm font-medium';
  const map: Record<string, string> = {
    'Confirmed': 'bg-green-100 text-green-800',
    'Checked-in': 'bg-blue-100 text-blue-800',
    'Checked-out': 'bg-gray-100 text-gray-700',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  const cls = `${base} ${map[status] ?? 'bg-gray-100 text-gray-700'}`;

  return <span className={cls}>{status}</span>;
}
