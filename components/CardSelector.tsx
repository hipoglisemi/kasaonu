'use client'

import { useState, useEffect } from 'react'
import { CreditCard, X, Check } from 'lucide-react'

interface Card {
    id: number
    name: string
    bank: {
        name: string
    }
}

interface CardSelectorProps {
    isOpen: boolean
    onClose: () => void
    selectedCardIds: number[]
    onSelectionChange: (cardIds: number[]) => void
}

export default function CardSelector({
    isOpen,
    onClose,
    selectedCardIds,
    onSelectionChange,
}: CardSelectorProps) {
    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            fetchCards()
        }
    }, [isOpen])

    const fetchCards = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/cards')
            const data = await response.json()
            setCards(data.cards || [])
        } catch (error) {
            console.error('Failed to fetch cards:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleCard = (cardId: number) => {
        const newSelection = selectedCardIds.includes(cardId)
            ? selectedCardIds.filter((id) => id !== cardId)
            : [...selectedCardIds, cardId]
        onSelectionChange(newSelection)
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-indigo-100 p-2">
                            <CreditCard className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Kartlarım</h2>
                            <p className="text-sm text-gray-600">
                                {selectedCardIds.length} kart seçildi
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Card List */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="h-16 animate-pulse rounded-xl bg-gray-100"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cards.map((card) => {
                                const isSelected = selectedCardIds.includes(card.id)
                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => toggleCard(card.id)}
                                        className={`w-full rounded-xl border-2 p-4 text-left transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    {isSelected ? (
                                                        <Check className="h-5 w-5 text-white" />
                                                    ) : (
                                                        <CreditCard
                                                            className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-400'
                                                                }`}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {card.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {card.bank.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    )
}
