'use client'

import { ShoppingCart, Shirt, Fuel, Utensils } from 'lucide-react'

interface QuickActionsProps {
    onSelect: (category: string) => void
    activeCategory?: string
}

const categories = [
    { id: 'market-gida', label: 'Market & Gıda', icon: ShoppingCart },
    { id: 'akaryakit', label: 'Akaryakıt', icon: Fuel },
    { id: 'giyim-aksesuar', label: 'Giyim & Aksesuar', icon: Shirt },
    { id: 'restoran-kafe', label: 'Restoran & Kafe', icon: Utensils },
]

export function QuickActions({ onSelect, activeCategory }: QuickActionsProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id

                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isActive
                            ? 'bg-rose-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                            }`}
                    >
                        <Icon size={20} />
                        <span>{cat.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
