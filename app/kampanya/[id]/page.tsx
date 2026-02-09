import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CampaignDetailClient } from '@/components/CampaignDetailClient'

export const dynamic = 'force-dynamic'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // 1. Fetch main campaign
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
            card: { include: { bank: true } },
            sector: true,
            brands: { include: { brand: true } },
        },
    })

    if (!campaign) notFound()

    // 2. Fetch similar campaigns (Hybrid feature)
    const similarCampaigns = await prisma.campaign.findMany({
        where: {
            id: { not: id },
            isActive: true,
            OR: [
                { sectorId: campaign.sectorId },
                { card: { bankId: campaign.card.bankId } }
            ]
        },
        include: {
            card: { include: { bank: true } },
            sector: true,
        },
        orderBy: [
            { createdAt: 'desc' }
        ],
        take: 4
    })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-32 md:pb-20 px-6 lg:px-20">
                <CampaignDetailClient
                    campaign={campaign}
                    similarCampaigns={similarCampaigns}
                />
            </main>

            <Footer />
        </div>
    )
}
