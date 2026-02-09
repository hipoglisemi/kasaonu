import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ════════════════════════════════════════
// TAILWIND CLASS MERGER
// ════════════════════════════════════════

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ════════════════════════════════════════
// DATE FORMATTING
// ════════════════════════════════════════

export function formatDate(date: Date | string | null): string {
    if (!date) return 'Süresiz'

    const d = typeof date === 'string' ? new Date(date) : date

    return d.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function formatDateShort(date: Date | string | null): string {
    if (!date) return 'Süresiz'

    const d = typeof date === 'string' ? new Date(date) : date

    return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
    })
}

export function isExpiringSoon(date: Date | string | null, days: number = 15): boolean {
    if (!date) return false

    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffTime = d.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 && diffDays <= days
}

export function isNew(date: Date | string, days: number = 7): boolean {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffTime = now.getTime() - d.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays <= days
}

// ════════════════════════════════════════
// REWARD VALUE FORMATTING
// ════════════════════════════════════════

export function formatRewardValue(
    value: number | null,
    type: string | null
): string {
    if (!value) return ''

    switch (type) {
        case 'cashback':
            return `${value.toLocaleString('tr-TR')} TL`
        case 'points':
            return `${value.toLocaleString('tr-TR')} Puan`
        case 'discount':
            return `%${value}`
        case 'installment':
            return `${value} Taksit`
        default:
            return `${value.toLocaleString('tr-TR')}`
    }
}

// ════════════════════════════════════════
// TEXT UTILITIES
// ════════════════════════════════════════

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
}

// ════════════════════════════════════════
// CAMPAIGN BADGES
// ════════════════════════════════════════

export interface Badge {
    text: string
    color: 'blue' | 'rose' | 'orange' | 'emerald' | 'purple'
    icon?: string
}

export function getCampaignBadges(campaign: {
    createdAt: Date | string
    endDate: Date | string | null
    viewCount: number
    rewardValue: number | null
}): Badge[] {
    const badges: Badge[] = []

    // Yeni kampanya
    if (isNew(campaign.createdAt, 7)) {
        badges.push({ text: 'Yeni', color: 'blue' })
    }

    // Popüler
    if (campaign.viewCount > 1000) {
        badges.push({ text: 'Popüler', color: 'rose' })
    }

    // Yakında bitiyor
    if (isExpiringSoon(campaign.endDate, 15)) {
        badges.push({ text: 'Son 15 Gün', color: 'orange' })
    }

    // Yüksek kazanç
    if (campaign.rewardValue && campaign.rewardValue > 500) {
        badges.push({ text: 'Yüksek Kazanç', color: 'emerald' })
    }

    return badges
}

// ════════════════════════════════════════
// API FETCH HELPER
// ════════════════════════════════════════

export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    const data = await response.json()

    if (!data.success) {
        throw new Error(data.error || 'API request failed')
    }

    return data.data as T
}
