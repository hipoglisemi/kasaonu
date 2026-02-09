// ════════════════════════════════════════
// DATABASE MODELS (Prisma'dan türetilmiş)
// ════════════════════════════════════════

import { Campaign, Card, Bank, Sector, Brand } from '@prisma/client'

// Relation'lı tipler
export type CampaignWithRelations = Campaign & {
    card: Card & { bank: Bank }
    sector: Sector | null
    brands: Array<{ brand: Brand }>
}

export type CardWithBank = Card & {
    bank: Bank
}

// ════════════════════════════════════════
// API RESPONSE TYPES
// ════════════════════════════════════════

export interface ApiResponse<T = any> {
    success: true
    data: T
    meta?: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
    }
}

export interface ApiError {
    success: false
    error: string
    code?: string
    details?: any
}

// ════════════════════════════════════════
// SEARCH & FILTER TYPES
// ════════════════════════════════════════

export interface SearchParams {
    query?: string
    category?: string
    bankId?: number
    cardId?: number
    minReward?: number
    rewardType?: 'cashback' | 'points' | 'discount' | 'installment'
    sortBy?: 'reward' | 'recent' | 'popular' | 'expiring'
    page?: number
    limit?: number
}

export interface CacheMetadata {
    key: string
    ttl: number
    timestamp: number
}

// ════════════════════════════════════════
// FRONTEND DISPLAY TYPES
// ════════════════════════════════════════

export interface CampaignCardProps {
    campaign: CampaignWithRelations
    isUserCard?: boolean
    showBadges?: boolean
    onClick?: () => void
}

export interface FilterState {
    category: string | null
    bankId: number | null
    minReward: number | null
    rewardType: string | null
}
