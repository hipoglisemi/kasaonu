import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const query = searchParams.get('query') || ''
        const sortBy = searchParams.get('sortBy') || 'newest'

        const skip = (page - 1) * limit
        const take = limit

        // Build OrderBy
        let orderBy: any = { createdAt: 'desc' }
        if (sortBy === 'popular') {
            orderBy = { viewCount: 'desc' }
        }

        const where: any = {
            isActive: true,
            OR: [
                { endDate: null },
                { endDate: { gte: new Date() } },
            ],
        }

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { detailsText: { contains: query, mode: 'insensitive' } },
            ]
        }

        const [campaigns, total] = await Promise.all([
            prisma.campaign.findMany({
                where,
                include: {
                    card: {
                        include: {
                            bank: true
                        }
                    },
                    sector: true,
                    brands: {
                        include: {
                            brand: true
                        }
                    },
                },
                orderBy,
                skip,
                take,
            }),
            prisma.campaign.count({ where }),
        ])

        return NextResponse.json({
            success: true,
            data: campaigns,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error: any) {
        console.error('API Error (Campaigns):', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
