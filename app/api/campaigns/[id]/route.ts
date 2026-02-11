import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params
        const id = parseInt(rawId, 10)

        if (isNaN(id)) {
            return NextResponse.json({ success: false, error: 'Invalid campaign ID' }, { status: 400 })
        }

        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                card: { include: { bank: true } },
                sector: true,
                brands: { include: { brand: true } },
            },
        })

        if (!campaign) {
            return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
        }

        // View count increment without await
        prisma.campaign.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        }).catch(err => console.error('Failed to increment view count', err))

        return NextResponse.json({ success: true, data: campaign })

    } catch (error: any) {
        console.error('Error fetching campaign:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
