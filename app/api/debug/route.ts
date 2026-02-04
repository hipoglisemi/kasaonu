import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

type CampaignWithRelations = Prisma.CampaignGetPayload<{
    include: {
        card: {
            include: {
                bank: true
            }
        }
        sector: true
        brands: {
            include: {
                brand: true
            }
        }
    }
}>

export async function GET() {
    try {
        const campaigns: CampaignWithRelations[] = await prisma.campaign.findMany({
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
        })

        const stats = {
            totalCampaigns: campaigns.length,
            activeCampaigns: campaigns.filter((c: CampaignWithRelations) => c.isActive).length,
            campaigns: campaigns.map((c: CampaignWithRelations) => ({
                id: c.id,
                title: c.title,
                isActive: c.isActive,
                card: c.card.name,
                bank: c.card.bank.name,
                sector: c.sector?.name,
                brands: c.brands.map((b: typeof c.brands[0]) => b.brand.name),
            })),
        }

        return NextResponse.json(stats)
    } catch (error) {
        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        )
    }
}
