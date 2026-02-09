import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    const password = authHeader?.replace('Bearer ', '')

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { campaignId, isActive } = await req.json()

        const campaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: { isActive },
        })

        // Clear cache
        const { redis } = await import('@/lib/redis')
        const keys = await redis.keys('search:*')
        if (keys.length > 0) {
            await redis.del(...keys)
        }

        return NextResponse.json({ success: true, campaign })
    } catch (error) {
        console.error('Campaign update error:', error)
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
    }
}
