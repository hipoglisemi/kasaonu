'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, ShoppingBag, Fuel, Sparkles, CreditCard } from 'lucide-react'
import CardSelector from '@/components/CardSelector'

interface Campaign {
  id: string
  title: string
  rewardText: string
  rewardValue: number
  rewardType: string
  card: {
    id: number
    name: string
    bank: {
      name: string
    }
  }
  brands: Array<{
    brand: {
      name: string
    }
  }>
}

const STORAGE_KEY = 'kasaonu_selected_cards'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([])
  const [isCardSelectorOpen, setIsCardSelectorOpen] = useState(false)

  // Load selected cards from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSelectedCardIds(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse stored cards:', error)
      }
    }
  }, [])

  const handleSelectionChange = (cardIds: number[]) => {
    setSelectedCardIds(cardIds)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardIds))
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setCampaigns([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await response.json()

      // Sort campaigns: user's cards first
      const sorted = (data.campaigns || []).sort((a: Campaign, b: Campaign) => {
        const aIsUserCard = selectedCardIds.includes(a.card.id)
        const bIsUserCard = selectedCardIds.includes(b.card.id)

        if (aIsUserCard && !bIsUserCard) return -1
        if (!aIsUserCard && bIsUserCard) return 1
        return 0
      })

      setCampaigns(sorted)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { name: 'Market', icon: ShoppingCart, query: 'market' },
    { name: 'Giyim', icon: ShoppingBag, query: 'giyim' },
    { name: 'Akaryakıt', icon: Fuel, query: 'akaryakit' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">KasaOnu</h1>
            </div>

            {/* My Cards Button */}
            <button
              onClick={() => setIsCardSelectorOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg"
            >
              <CreditCard className="h-4 w-4" />
              Kartlarım
              {selectedCardIds.length > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {selectedCardIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            En İyi Kredi Kartı
            <span className="block text-indigo-600">Kampanyalarını Keşfet</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Binlerce kampanya arasından size en uygun olanı bulun
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-10">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              placeholder="Migros, Zara, Shell..."
              className="block w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => {
                  setQuery(action.query)
                  handleSearch(action.query)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-md ring-1 ring-inset ring-gray-200 transition-all hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-300"
              >
                <action.icon className="h-4 w-4" />
                {action.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Kampanyalar aranıyor...</p>
          </div>
        )}

        {/* Results */}
        {!loading && campaigns.length > 0 && (
          <div className="mt-10 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {campaigns.length} kampanya bulundu
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {campaigns.map((campaign) => {
                const isUserCard = selectedCardIds.includes(campaign.card.id)

                return (
                  <div
                    key={campaign.id}
                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-indigo-300"
                  >
                    {/* User Card Badge */}
                    {isUserCard && (
                      <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        ✓ Kartınız
                      </div>
                    )}

                    {/* Card & Bank Info */}
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {campaign.card.name}
                      </div>
                      <span className="text-xs text-gray-500">
                        {campaign.card.bank.name}
                      </span>
                    </div>

                    {/* Campaign Title */}
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      {campaign.title}
                    </h4>

                    {/* Reward Text */}
                    <p className="mb-4 text-sm text-gray-600">
                      {campaign.rewardText}
                    </p>

                    {/* Reward Value */}
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-indigo-600">
                        {campaign.rewardValue}
                      </span>
                      <span className="text-sm text-gray-500">
                        {campaign.rewardType === 'points' && 'Puan'}
                        {campaign.rewardType === 'cashback' && 'TL'}
                        {campaign.rewardType === 'discount' && '₺ İndirim'}
                      </span>
                    </div>

                    {/* Brands */}
                    {campaign.brands.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {campaign.brands.map((b, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {b.brand.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <button className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg">
                      Detayları Gör
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && query.length >= 2 && campaigns.length === 0 && (
          <div className="mt-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Kampanya bulunamadı
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              &quot;{query}&quot; için sonuç bulunamadı. Farklı bir arama deneyin.
            </p>
          </div>
        )}
      </div>

      {/* Card Selector Modal */}
      <CardSelector
        isOpen={isCardSelectorOpen}
        onClose={() => setIsCardSelectorOpen(false)}
        selectedCardIds={selectedCardIds}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  )
}
