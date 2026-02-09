import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    // Simple auth
    const authHeader = req.headers.get('authorization')
    const password = authHeader?.replace('Bearer ', '')

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const [
            totalCampaigns,
            activeCampaigns,
            totalSearches,
            topSearches,
            missingSearches,
        ] = await Promise.all([
            prisma.campaign.count(),
            prisma.campaign.count({ where: { isActive: true } }),
            prisma.searchLog.count(),
            prisma.searchLog.groupBy({
                by: ['query'],
                _count: { query: true },
                orderBy: { _count: { query: 'desc' } },
                take: 10,
            }),
            prisma.missingSearch.findMany({
                where: { isResolved: false },
                orderBy: { searchCount: 'desc' },
                take: 20,
            }),
        ])

        return NextResponse.json({
            totalCampaigns,
            activeCampaigns,
            totalSearches,
            topSearches: topSearches.map(s => ({
                query: s.query,
                count: s._count.query,
            })),
            missingSearches,
        })
    } catch (error) {
        console.error('Analytics error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}
