import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const campaigns = await prisma.campaign.findMany({
        where: { isActive: true },
        select: { id: true, slug: true, updatedAt: true },
    })

    const sectors = await prisma.sector.findMany({
        select: { slug: true },
    })

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/kampanyalar`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...campaigns.map((c) => ({
            url: `${baseUrl}/kampanya/${c.slug}-${c.id}`,
            lastModified: c.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
        ...sectors.map((s) => ({
            url: `${baseUrl}/kategori/${s.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        })),
        {
            url: `${baseUrl}/hakkimizda`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/iletisim`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ]
}
