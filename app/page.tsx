'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, ShoppingBag, Fuel, CreditCard, Shirt, Utensils, Laptop, Package, ArrowLeft, RefreshCw } from 'lucide-react'
import CardSelector from '@/components/CardSelector'
import { ModernHeroSection } from '@/components/ModernHeroSection'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CampaignCard } from '@/components/CampaignCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { cn } from '@/lib/utils'

interface Campaign {
  id: number
  slug: string
  title: string
  rewardText: string
  rewardValue: number
  rewardType: string
  validUntil?: string
  imageUrl?: string | null
  card: {
    id: number
    name: string
    logoUrl?: string | null
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
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [featuredSort, setFeaturedSort] = useState<'newest' | 'popular'>('newest')
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([])
  const [isCardSelectorOpen, setIsCardSelectorOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Load selected cards and initial campaigns on mount
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

  // Refetch featured campaigns when sort changes
  useEffect(() => {
    fetchFeaturedCampaigns()
  }, [featuredSort])

  const fetchFeaturedCampaigns = async () => {
    setLoadingFeatured(true)
    try {
      const response = await fetch(`/api/campaigns?limit=20&sortBy=${featuredSort}`)
      const apiResponse = await response.json()
      if (apiResponse.success) {
        setFeaturedCampaigns(apiResponse.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch featured campaigns:', error)
    } finally {
      setLoadingFeatured(false)
    }
  }

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
      // Use GET with query params as per new architecture
      const params = new URLSearchParams()
      params.append('query', searchQuery)

      const response = await fetch(`/api/search?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const apiResponse = await response.json()

      if (apiResponse.success) {
        // Sort campaigns: user's cards first
        const sorted = (apiResponse.data || []).sort((a: Campaign, b: Campaign) => {
          const aIsUserCard = selectedCardIds.includes(a.card.id)
          const bIsUserCard = selectedCardIds.includes(b.card.id)

          if (aIsUserCard && !bIsUserCard) return -1
          if (!aIsUserCard && bIsUserCard) return 1
          return 0
        })

        setCampaigns(sorted)
      } else {
        console.error('Search API error:', apiResponse.error)
        setCampaigns([])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { name: 'Market & Gıda', icon: ShoppingCart, query: 'market-gida' },
    { name: 'Akaryakıt', icon: Fuel, query: 'akaryakit' },
    { name: 'Giyim & Aksesuar', icon: Shirt, query: 'giyim-aksesuar' },
    { name: 'Restoran & Kafe', icon: Utensils, query: 'restoran-kafe' },
    { name: 'Elektronik', icon: Laptop, query: 'elektronik' },
    { name: 'E-Ticaret', icon: Package, query: 'e-ticaret' },
  ]

  const handleCategoryClick = (categoryQuery: string) => {
    setActiveCategory(categoryQuery)
    setQuery(categoryQuery)
    handleSearch(categoryQuery)
  }

  const isSearching = query.trim().length >= 2 || activeCategory !== null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Search */}
      <Header
        searchQuery={query}
        onSearchChange={(value) => {
          setQuery(value)
          handleSearch(value)
          setActiveCategory(null)
        }}
        onSearchSubmit={() => handleSearch(query)}
        isFocused={isFocused}
        onFocusChange={setIsFocused}
      />

      {/* Body Content */}
      <div className="pt-16">
        {!isSearching ? (
          <>
            {/* Modern Hero Section */}
            <ModernHeroSection onSectorClick={handleCategoryClick} />

            {/* Featured Campaigns Section */}
            <section className="px-6 lg:px-20 py-20 bg-white animate-fade-in">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                      Öne Çıkan <span className="text-rose-600">Kampanyalar</span>
                    </h2>
                    <p className="text-slate-500 text-[14px] font-medium opacity-80">Sizin için seçtiğimiz güncel fırsatları keşfedin.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 border border-slate-200/60 rounded-xl bg-slate-50/50 flex gap-1 shadow-sm">
                      <button
                        onClick={() => setFeaturedSort('newest')}
                        className={cn(
                          "px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300",
                          featuredSort === 'newest'
                            ? "bg-white text-rose-600 shadow-sm border border-slate-200/60"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        En Yeniler
                      </button>
                      <button
                        onClick={() => setFeaturedSort('popular')}
                        className={cn(
                          "px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300",
                          featuredSort === 'popular'
                            ? "bg-white text-rose-600 shadow-sm border border-slate-200/60"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Popüler
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {loadingFeatured ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <LoadingSkeleton key={i} />
                    ))
                  ) : featuredCampaigns.length > 0 ? (
                    featuredCampaigns.map((campaign) => (
                      <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        isUserCard={selectedCardIds.includes(campaign.card.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                      Henüz öne çıkan kampanya bulunmuyor.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Search Results Section (KACF Style) */
          <section className="px-6 lg:px-20 py-16 animate-fade-in bg-white min-h-[80vh]">
            <div className="max-w-[1120px] mx-auto mb-16">
              <button
                onClick={() => {
                  setQuery('')
                  setActiveCategory(null)
                  setCampaigns([])
                }}
                className="group flex items-center gap-3 text-slate-500 hover:text-rose-600 transition-all mb-10 font-bold text-xs uppercase tracking-widest"
              >
                <div className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-rose-200 group-hover:bg-rose-50 transition-all shadow-sm">
                  <ArrowLeft size={16} />
                </div>
                Ana Sayfa
              </button>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                    {activeCategory ? quickActions.find(a => a.query === activeCategory)?.name : 'Arama Sonuçları'}
                  </h2>
                  <p className="text-slate-500 font-medium text-[14px] opacity-80">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin text-rose-500" /> Kampanyalar taranıyor...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        `"${query || (activeCategory && quickActions.find(a => a.query === activeCategory)?.name)}" araması için ${campaigns.length} sonuç listeleniyor.`
                      </span>
                    )}
                  </p>
                </div>

                {/* Active Filter Badges */}
                <div className="flex flex-wrap gap-2">
                  {(query || activeCategory) && (
                    <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                      {activeCategory ? quickActions.find(a => a.query === activeCategory)?.name : query}
                      <button
                        onClick={() => {
                          setQuery('')
                          setActiveCategory(null)
                          setCampaigns([])
                        }}
                        className="hover:scale-125 transition-transform ml-1"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {(query || activeCategory) && (
                    <button
                      onClick={() => {
                        setQuery('')
                        setActiveCategory(null)
                        setCampaigns([])
                      }}
                      className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-rose-600 uppercase tracking-widest px-4 py-2 border rounded-xl border-slate-200 hover:border-rose-200 transition-all shadow-sm bg-white"
                    >
                      <RefreshCw size={10} /> Temizle
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign) => {
                  const isUserCard = selectedCardIds.includes(campaign.card.id)

                  return (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      isUserCard={isUserCard}
                    />
                  )
                })
              ) : (
                /* Empty State (Standardized) */
                <div className="col-span-full py-32 text-center animate-fade-in relative overflow-hidden rounded-3xl bg-slate-50/50 border border-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-50/20 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="relative inline-block mb-10">
                      <div className="absolute inset-0 bg-rose-500 rounded-full blur-3xl opacity-10 scale-150 animate-pulse"></div>
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 mx-auto">
                        <Search className="h-10 w-10 text-slate-200" strokeWidth={2} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Sonuç Bulunamadı</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed text-[14px] mb-10 px-6 opacity-80">
                      Aradığın kriterlere uygun aktif bir kampanya bulamadık. Kelimeleri değiştirerek tekrar deneyebilirsin.
                    </p>

                    <button
                      onClick={() => {
                        setQuery('')
                        setActiveCategory(null)
                        setCampaigns([])
                      }}
                      className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all"
                    >
                      <RefreshCw size={14} /> Filtreleri Sıfırla
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer - KACF Style */}
      <Footer />

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
