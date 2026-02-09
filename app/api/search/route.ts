import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached, setCache } from '@/lib/redis'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get('query') || ''

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ success: true, data: [] })
        }

        const searchTerm = query.toLowerCase().trim()
        const cacheKey = `search:${searchTerm}`

        // Check Redis cache first
        const cached = await getCached<any[]>(cacheKey)
        if (cached) {
            console.log(`✅ Cache HIT for: ${searchTerm}`)
            return NextResponse.json({ success: true, data: cached, fromCache: true })
        }

        console.log(`❌ Cache MISS for: ${searchTerm}`)

        // Full-text search: Marka, kampanya adı veya sektörde ara
        const campaigns = await prisma.campaign.findMany({
            where: {
                isActive: true,
                OR: [
                    {
                        // Kampanya başlığında ara
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        // Sektör adında ara
                        sector: {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        // İlişkili marka adında ara
                        brands: {
                            some: {
                                brand: {
                                    name: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                card: {
                    include: {
                        bank: true,
                    },
                },
                sector: true,
                brands: {
                    include: {
                        brand: true,
                    },
                },
            },
            orderBy: {
                rewardValue: 'desc',
            },
            take: 20,
        })

        // Cache the results for 5 minutes (300 seconds)
        await setCache(cacheKey, campaigns, 300)

        // Log the search (analytics için)
        await prisma.searchLog.create({
            data: {
                query: searchTerm,
                resultCount: campaigns.length,
            },
        })

        // Eğer sonuç yoksa missing_searches'e ekle
        if (campaigns.length === 0) {
            await prisma.missingSearch.upsert({
                where: { query: searchTerm },
                create: {
                    query: searchTerm,
                    searchCount: 1,
                },
                update: {
                    searchCount: { increment: 1 },
                    lastSearchedAt: new Date(),
                },
            })
        }

        return NextResponse.json({ success: true, data: campaigns, fromCache: false })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { success: false, error: 'Arama sırasında hata oluştu' },
            { status: 500 }
        )
    }
}
