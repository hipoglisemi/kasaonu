import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const cards = await prisma.card.findMany({
            where: {
                isActive: true,
            },
            include: {
                bank: {
                    select: {
                        name: true,
                        logoUrl: true,
                        slug: true,
                    },
                },
            },
            orderBy: [
                { bank: { name: 'asc' } },
                { name: 'asc' },
            ],
        })

        return NextResponse.json({ success: true, data: cards })
    } catch (error: any) {
        console.error('Cards fetch error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
