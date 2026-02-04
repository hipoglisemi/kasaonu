import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Seed başlıyor...')

    // Sektörler
    const marketSector = await prisma.sector.create({
        data: {
            name: 'Market',
            slug: 'market',
            iconName: 'ShoppingCart',
            sortOrder: 1,
        },
    })

    const fashionSector = await prisma.sector.create({
        data: {
            name: 'Giyim',
            slug: 'giyim',
            iconName: 'ShoppingBag',
            sortOrder: 2,
        },
    })

    const fuelSector = await prisma.sector.create({
        data: {
            name: 'Akaryakıt',
            slug: 'akaryakit',
            iconName: 'Fuel',
            sortOrder: 3,
        },
    })

    // Bankalar
    const garanti = await prisma.bank.create({
        data: {
            name: 'Garanti BBVA',
            slug: 'garanti',
            logoUrl: 'https://www.garantibbva.com.tr/content/dam/garanti/logos/garanti-logo.svg',
        },
    })

    const isbank = await prisma.bank.create({
        data: {
            name: 'İş Bankası',
            slug: 'isbank',
            logoUrl: 'https://www.isbank.com.tr/TR/hakkimizda/PublishingImages/isbank-logo.svg',
        },
    })

    const yapikredi = await prisma.bank.create({
        data: {
            name: 'Yapı Kredi',
            slug: 'yapikredi',
            logoUrl: 'https://www.yapikredi.com.tr/resources/images/yk-logo.svg',
        },
    })

    // Kartlar
    const bonusCard = await prisma.card.create({
        data: {
            name: 'Bonus Card',
            slug: 'bonus-card',
            cardType: 'credit',
            bankId: garanti.id,
            annualFee: 0,
            applicationUrl: 'https://www.garantibbva.com.tr/kredi-karti/bonus-card',
        },
    })

    const maximumCard = await prisma.card.create({
        data: {
            name: 'Maximum Card',
            slug: 'maximum-card',
            cardType: 'credit',
            bankId: isbank.id,
            annualFee: 0,
            applicationUrl: 'https://www.isbank.com.tr/maximum-card',
        },
    })

    const worldCard = await prisma.card.create({
        data: {
            name: 'World Card',
            slug: 'world-card',
            cardType: 'credit',
            bankId: yapikredi.id,
            annualFee: 750,
            applicationUrl: 'https://www.yapikredi.com.tr/world-card',
        },
    })

    // Markalar
    const migros = await prisma.brand.create({
        data: {
            name: 'Migros',
            sectorId: marketSector.id,
            aliases: ['migros', '5m', 'migros jet', 'macrocenter'],
            logoUrl: 'https://www.migros.com.tr/assets/images/logo.svg',
        },
    })

    const carrefoursa = await prisma.brand.create({
        data: {
            name: 'CarrefourSA',
            sectorId: marketSector.id,
            aliases: ['carrefoursa', 'carrefour'],
        },
    })

    const zara = await prisma.brand.create({
        data: {
            name: 'Zara',
            sectorId: fashionSector.id,
            aliases: ['zara'],
        },
    })

    const lcwaikiki = await prisma.brand.create({
        data: {
            name: 'LC Waikiki',
            sectorId: fashionSector.id,
            aliases: ['lcwaikiki', 'lc waikiki', 'waikiki'],
        },
    })

    const shell = await prisma.brand.create({
        data: {
            name: 'Shell',
            sectorId: fuelSector.id,
            aliases: ['shell'],
        },
    })

    const opet = await prisma.brand.create({
        data: {
            name: 'Opet',
            sectorId: fuelSector.id,
            aliases: ['opet'],
        },
    })

    // Kampanyalar
    const campaign1 = await prisma.campaign.create({
        data: {
            cardId: bonusCard.id,
            sectorId: marketSector.id,
            title: 'Migros\'ta %10 Bonus Puan',
            rewardText: '100 TL ve üzeri alışverişlerde 1000 Bonus Puan',
            rewardValue: 100,
            rewardType: 'points',
            detailsText: 'Kampanya tüm Migros mağazalarında geçerlidir.',
            conditionsText: 'Minimum 100 TL harcama şartı vardır.',
            endDate: new Date('2025-12-31'),
            trackingUrl: 'https://www.garantibbva.com.tr/bonus-migros?utm_source=kasaonu',
            brands: {
                create: {
                    brandId: migros.id,
                },
            },
        },
    })

    const campaign2 = await prisma.campaign.create({
        data: {
            cardId: maximumCard.id,
            sectorId: marketSector.id,
            title: 'Migros\'ta 50 TL MaxiPuan',
            rewardText: '250 TL ve üzeri alışverişlerde 50 TL MaxiPuan',
            rewardValue: 50,
            rewardType: 'cashback',
            detailsText: 'Kampanya sadece Cumartesi-Pazar geçerlidir.',
            conditionsText: 'Minimum 250 TL harcama yapılmalıdır.',
            endDate: new Date('2025-06-30'),
            brands: {
                create: {
                    brandId: migros.id,
                },
            },
        },
    })

    const campaign3 = await prisma.campaign.create({
        data: {
            cardId: worldCard.id,
            sectorId: fashionSector.id,
            title: 'Zara\'da %15 İndirim',
            rewardText: 'Tüm alışverişlerde %15 indirim',
            rewardValue: 150,
            rewardType: 'discount',
            detailsText: 'Kampanya online ve mağaza alışverişlerinde geçerlidir.',
            endDate: new Date('2025-03-31'),
            brands: {
                create: {
                    brandId: zara.id,
                },
            },
        },
    })

    const campaign4 = await prisma.campaign.create({
        data: {
            cardId: bonusCard.id,
            sectorId: fuelSector.id,
            title: 'Shell\'de 30 Litre Yakıta 500 Bonus Puan',
            rewardText: '30 litre ve üzeri yakıt alımlarında 500 Bonus Puan',
            rewardValue: 50,
            rewardType: 'points',
            detailsText: 'Kampanya tüm Shell istasyonlarında geçerlidir.',
            endDate: new Date('2025-08-31'),
            brands: {
                create: {
                    brandId: shell.id,
                },
            },
        },
    })

    const campaign5 = await prisma.campaign.create({
        data: {
            cardId: worldCard.id,
            sectorId: marketSector.id,
            title: 'CarrefourSA\'da World Ayrıcalığı',
            rewardText: '200 TL ve üzeri alışverişlerde 40 TL World Puan',
            rewardValue: 40,
            rewardType: 'cashback',
            detailsText: 'Kampanya sadece CarrefourSA Hypermarket\'lerde geçerlidir.',
            conditionsText: 'Minimum 200 TL harcama gereklidir.',
            endDate: new Date('2025-12-31'),
            brands: {
                create: [
                    { brandId: carrefoursa.id },
                ],
            },
        },
    })

    console.log('✅ Seed tamamlandı!')
    console.log(`- ${await prisma.sector.count()} sektör`)
    console.log(`- ${await prisma.bank.count()} banka`)
    console.log(`- ${await prisma.card.count()} kart`)
    console.log(`- ${await prisma.brand.count()} marka`)
    console.log(`- ${await prisma.campaign.count()} kampanya`)
}

main()
    .catch((e) => {
        console.error('❌ Seed hatası:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
