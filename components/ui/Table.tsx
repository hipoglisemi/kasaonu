'use client'

import React from 'react'
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
}

interface TableProps<T> {
    data: T[]
    columns: Column<T>[]
    searchPlaceholder?: string
    onSearch?: (query: string) => void
    title?: string
    description?: string
    action?: React.ReactNode
}

export function Table<T extends { id?: string | number }>({
    data,
    columns,
    searchPlaceholder = 'Ara...',
    onSearch,
    title,
    description,
    action
}: TableProps<T>) {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Header Section */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>

                <div className="flex items-center gap-3">
                    {onSearch && (
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                onChange={(e) => onSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 h-10 w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all placeholder:text-gray-400"
                            />
                        </div>
                    )}
                    {action && (
                        <div className="shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">Sonuç bulunamadı</h4>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs">
                            Arama kriterlerinize uygun kayıt bulunmamaktadır.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                {columns.map((col, i) => (
                                    <th
                                        key={i}
                                        className={cn(
                                            "px-6 py-3 first:pl-6 last:pr-6 whitespace-nowrap",
                                            col.className
                                        )}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, rowIdx) => (
                                <tr
                                    key={item.id || rowIdx}
                                    className="group hover:bg-gray-50/80 transition-colors"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={cn(
                                                "px-6 py-4 first:pl-6 last:pr-6 text-gray-700",
                                                col.className
                                            )}
                                        >
                                            {col.cell ? col.cell(item) : (col.accessorKey ? String(item[col.accessorKey]) : '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Footer / Pagination (Static for now) */}
            {data.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Toplam <span className="font-medium text-gray-900">{data.length}</span> kayıt gösteriliyor
                    </p>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-1 rounded-md text-gray-400 cursor-not-allowed hover:bg-gray-100">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button disabled className="p-1 rounded-md text-gray-400 cursor-not-allowed hover:bg-gray-100">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
