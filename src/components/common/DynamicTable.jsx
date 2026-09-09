import React from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Edit, Trash2, Eye } from 'lucide-react';

const DynamicTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSearch,
  onFilter,
  actions = [],
  title,
}) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm text-xs transition-all duration-300">
      {/* Table Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</h2>
          <p className="text-xs text-zinc-500 font-medium">Manage and view candidates ledger entries efficiently.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all w-full sm:w-48 font-medium outline-none"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
          <button className="p-1.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-900 transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3.5 py-2.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800"
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-3.5 py-2.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-3.5 py-2.5">
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                    </td>
                  ))}
                  {actions.length > 0 && <td className="px-3.5 py-2.5"><div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-8 ml-auto"></div></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-3.5 py-8 text-center text-zinc-400 italic">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row._id || i}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3.5 py-2 text-zinc-600 dark:text-zinc-300 font-medium">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-3.5 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions.includes('view') && (
                          <button 
                            onClick={() => row.onView?.(row)}
                            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-all cursor-pointer"
                            title="View Profile & Evaluation"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {actions.includes('edit') && (
                          <button 
                            onClick={() => row.onEdit?.(row)}
                            disabled={!row.onEdit}
                            className={`p-1 rounded transition-all ${!row.onEdit ? 'opacity-30 cursor-not-allowed text-zinc-300' : 'text-zinc-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer'}`}
                            title={!row.onEdit ? "Edit not available" : "Edit Candidate"}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {actions.includes('delete') && (
                          <button 
                            onClick={() => row.onDelete?.(row)}
                            className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                            title="Delete Candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium text-zinc-500 bg-zinc-50/20">
          <p>
            Showing <span className="font-semibold text-zinc-800 dark:text-zinc-200">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-zinc-800 dark:text-zinc-200">{pagination.total}</span> entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange?.(i + 1)}
                  className={`w-5 h-5 rounded text-xs font-bold transition-all cursor-pointer ${
                    pagination.page === i + 1
                      ? 'bg-zinc-900 text-white border border-zinc-900'
                      : 'text-zinc-600 hover:bg-zinc-100 border border-transparent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="p-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
