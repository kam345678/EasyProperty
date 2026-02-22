'use client';
import React, { useState } from 'react';

type Filters = {
  dateRange: string;
  status: string;
  allStatuses: boolean;
};

export default function BookingFilters({ onApply }: { onApply: (f: Filters) => void }) {
  const [dateRange, setDateRange] = useState('This month');
  const [status, setStatus] = useState('All');
  const [allStatuses, setAllStatuses] = useState(true);

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full md:w-60 rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none">
            <option>This month</option>
            <option>Last 7 days</option>
            <option>Next 30 days</option>
            <option>Custom range</option>
          </select>
        </div>

        <div className="w-48">
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none">
            <option>All</option>
            <option>Confirmed</option>
            <option>Checked-in</option>
            <option>Checked-out</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="w-44 flex items-end">
          <label className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <input type="checkbox" checked={allStatuses} onChange={(e) => setAllStatuses(e.target.checked)} className="rounded border-gray-300" />
            <span>All Statuses</span>
          </label>
        </div>

        <div className="ml-auto">
          <button onClick={() => onApply({ dateRange, status, allStatuses })} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
