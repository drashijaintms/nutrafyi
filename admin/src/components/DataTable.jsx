import React, { useState } from "react";
import Loader from "./Loader";

export default function DataTable({
  columns,
  data = [],
  loading = false,
  pagination = null,
  search = null,
  filters = [],
  bulkActions = [],
  onBulkAction = null,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map((row) => row._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const executeBulkAction = () => {
    if (!bulkAction || selectedIds.length === 0 || !onBulkAction) return;
    onBulkAction(bulkAction, selectedIds);
    // Reset selection after action
    setSelectedIds([]);
    setBulkAction("");
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Search and Filters Toolbar */}
      <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Bulk actions */}
        {bulkActions.length > 0 && selectedIds.length > 0 ? (
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="text-sm bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Bulk Actions ({selectedIds.length} selected)</option>
              {bulkActions.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
            <button
              onClick={executeBulkAction}
              disabled={!bulkAction}
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <select
                key={filter.accessor}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="text-sm bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        {/* Search Input */}
        {search && (
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder || "Search..."}
              className="w-full text-sm pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {bulkActions.length > 0 && (
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} className="py-20">
                  <Loader />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                  className="py-16 text-center text-slate-400 font-medium"
                >
                  No items found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row._id || rowIdx} className="hover:bg-slate-50/50 transition-colors">
                  {bulkActions.length > 0 && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row._id)}
                        onChange={(e) => handleSelectRow(row._id, e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && data.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-medium text-slate-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="text-xs font-semibold px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="text-xs font-semibold px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
