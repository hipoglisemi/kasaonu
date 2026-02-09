import type { Metadata } from 'next'

export function generateSEO({
    title,
    description,
    path = '',
    image,
}: {
    title: string
    description: string
    path?: string
    image?: string
}): Metadata {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = `${siteUrl}${path}`
    const ogImage = image || `${siteUrl}/og-image.png`

    return {
        title: `${title} | KasaÖnü`,
        description,
        openGraph: {
            title: `${title} | KasaÖnü`,
            description,
            url,
            siteName: 'KasaÖnü',
            images: [{ url: ogImage }],
            locale: 'tr_TR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | KasaÖnü`,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: url,
        },
    }
}

export function generateCampaignLD(campaign: any) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: campaign.title,
        description: campaign.detailsText || campaign.rewardText,
        priceSpecification: {
            '@type': 'PriceSpecification',
            price: campaign.rewardValue || 0,
            priceCurrency: 'TRY',
        },
        validThrough: campaign.endDate,
    }
}
