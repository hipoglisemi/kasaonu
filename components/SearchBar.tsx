'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
    defaultValue?: string
}

export function SearchBar({
    onSearch,
    placeholder = 'Ara...',
    defaultValue = ''
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim().length >= 1) {
            onSearch(query.trim())
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full group">
            <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-12 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all placeholder:text-gray-400 h-10"
                />
                <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>
        </form>
    )
}
