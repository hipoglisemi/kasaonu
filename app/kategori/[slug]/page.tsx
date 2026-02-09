import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CampaignCard } from '@/components/CampaignCard'
import { EmptyState } from '@/components/EmptyState'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { generateSEO } from '@/lib/seo'

import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const sector = await prisma.sector.findUnique({
        where: { slug }
    })

    if (!sector) return {}

    return generateSEO({
        title: `${sector.name} Kampanyaları`,
        description: `${sector.name} kategorisindeki en avantajlı kredi kartı kampanyalarını keşfedin.`,
        path: `/kategori/${slug}`,
    })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const sector = await prisma.sector.findUnique({
        where: { slug },
        include: {
            campaigns: {
                where: { isActive: true },
                include: {
                    card: { include: { bank: true } },
                    brands: { include: { brand: true } },
                    sector: true
                },
                orderBy: { rewardValue: 'desc' }
            }
        }
    })

    if (!sector) notFound()

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <Breadcrumbs items={[
                    { label: 'Kategoriler', href: '/kampanyalar' },
                    { label: sector.name },
                ]} />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {sector.name} Kampanyaları
                    </h1>
                    <p className="text-xl text-gray-600">
                        {sector.campaigns.length} kampanya bulundu
                    </p>
                </div>

                {sector.campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sector.campaigns.map((campaign: any) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="Bu kategoride henüz kampanya bulunmuyor." />
                )}
            </main>
            <Footer />
        </>
    )
}
