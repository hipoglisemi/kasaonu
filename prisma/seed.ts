import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
    console.log('🌱 Seed başlıyor...')

    // 18 Master Sektörler
    const sectorsData = [
        { name: 'Market & Gıda', slug: 'market-gida', iconName: 'ShoppingCart', sortOrder: 1 },
        { name: 'Akaryakıt', slug: 'akaryakit', iconName: 'Fuel', sortOrder: 2 },
        { name: 'Giyim & Aksesuar', slug: 'giyim-aksesuar', iconName: 'Shirt', sortOrder: 3 },
        { name: 'Restoran & Kafe', slug: 'restoran-kafe', iconName: 'Utensils', sortOrder: 4 },
        { name: 'Elektronik', slug: 'elektronik', iconName: 'Laptop', sortOrder: 5 },
        { name: 'Mobilya & Dekorasyon', slug: 'mobilya-dekorasyon', iconName: 'Home', sortOrder: 6 },
        { name: 'Kozmetik & Sağlık', slug: 'kozmetik-saglik', iconName: 'Heart', sortOrder: 7 },
        { name: 'E-Ticaret', slug: 'e-ticaret', iconName: 'Package', sortOrder: 8 },
        { name: 'Ulaşım', slug: 'ulasim', iconName: 'Bus', sortOrder: 9 },
        { name: 'Dijital Platform', slug: 'dijital-platform', iconName: 'Gamepad2', sortOrder: 10 },
        { name: 'Kültür & Sanat', slug: 'kultur-sanat', iconName: 'Palette', sortOrder: 11 },
        { name: 'Eğitim', slug: 'egitim', iconName: 'GraduationCap', sortOrder: 12 },
        { name: 'Sigorta', slug: 'sigorta', iconName: 'Shield', sortOrder: 13 },
        { name: 'Otomotiv', slug: 'otomotiv', iconName: 'Car', sortOrder: 14 },
        { name: 'Vergi & Kamu', slug: 'vergi-kamu', iconName: 'Landmark', sortOrder: 15 },
        { name: 'Turizm & Konaklama', slug: 'turizm-konaklama', iconName: 'Plane', sortOrder: 16 },
        { name: 'Kuyum, Optik ve Saat', slug: 'kuyum-optik-saat', iconName: 'Watch', sortOrder: 17 },
        { name: 'Diğer', slug: 'diger', iconName: 'MoreHorizontal', sortOrder: 18 },
    ];

    const sectors: Record<string, any> = {};
    for (const s of sectorsData) {
        sectors[s.slug] = await prisma.sector.upsert({
            where: { slug: s.slug },
            update: { name: s.name, iconName: s.iconName, sortOrder: s.sortOrder },
            create: s,
        });
    }

    const marketSector = sectors['market-gida'];
    const fashionSector = sectors['giyim-aksesuar'];
    const fuelSector = sectors['akaryakit'];

    // Bankalar
    const garanti = await prisma.bank.upsert({
        where: { slug: 'garanti' },
        update: { name: 'Garanti BBVA', logoUrl: 'https://www.garantibbva.com.tr/content/dam/garanti/logos/garanti-logo.svg' },
        create: {
            name: 'Garanti BBVA',
            slug: 'garanti',
            logoUrl: 'https://www.garantibbva.com.tr/content/dam/garanti/logos/garanti-logo.svg',
        },
    })

    const isbank = await prisma.bank.upsert({
        where: { slug: 'isbank' },
        update: { name: 'İş Bankası', logoUrl: 'https://www.isbank.com.tr/TR/hakkimizda/PublishingImages/isbank-logo.svg' },
        create: {
            name: 'İş Bankası',
            slug: 'isbank',
            logoUrl: 'https://www.isbank.com.tr/TR/hakkimizda/PublishingImages/isbank-logo.svg',
        },
    })

    const yapikredi = await prisma.bank.upsert({
        where: { slug: 'yapikredi' },
        update: { name: 'Yapı Kredi', logoUrl: 'https://www.yapikredi.com.tr/resources/images/yk-logo.svg' },
        create: {
            name: 'Yapı Kredi',
            slug: 'yapikredi',
            logoUrl: 'https://www.yapikredi.com.tr/resources/images/yk-logo.svg',
        },
    })

    // Kartlar
    const bonusCard = await prisma.card.upsert({
        where: { slug: 'bonus-card' },
        update: { name: 'Bonus Card', bankId: garanti.id, logoUrl: '/logos/cards/garantibbvabonus.png' },
        create: {
            name: 'Bonus Card',
            slug: 'bonus-card',
            cardType: 'credit',
            bankId: garanti.id,
            annualFee: 0,
            applicationUrl: 'https://www.garantibbva.com.tr/kredi-karti/bonus-card',
            logoUrl: '/logos/cards/garantibbvabonus.png',
        },
    })

    const maximumCard = await prisma.card.upsert({
        where: { slug: 'maximum-card' },
        update: { name: 'Maximum Card', bankId: isbank.id, logoUrl: '/logos/cards/isbankasimaximum.png' },
        create: {
            name: 'Maximum Card',
            slug: 'maximum-card',
            cardType: 'credit',
            bankId: isbank.id,
            annualFee: 0,
            applicationUrl: 'https://www.isbank.com.tr/maximum-card',
            logoUrl: '/logos/cards/isbankasimaximum.png',
        },
    })

    const worldCard = await prisma.card.upsert({
        where: { slug: 'world-card' },
        update: { name: 'World Card', bankId: yapikredi.id, logoUrl: '/logos/cards/yapikrediworld.png' },
        create: {
            name: 'World Card',
            slug: 'world-card',
            cardType: 'credit',
            bankId: yapikredi.id,
            annualFee: 750,
            applicationUrl: 'https://www.yapikredi.com.tr/world-card',
            logoUrl: '/logos/cards/yapikrediworld.png',
        },
    })

    // Markalar (Slug based upsert would be better if slug existed, using name for now or just creating if not found)
    const upsertBrand = async (name: string, data: any) => {
        const existing = await prisma.brand.findFirst({ where: { name } });
        if (existing) {
            return await prisma.brand.update({ where: { id: existing.id }, data });
        }
        return await prisma.brand.create({ data: { name, ...data } });
    };

    const migros = await upsertBrand('Migros', {
        sectorId: marketSector.id,
        aliases: ['migros', '5m', 'migros jet', 'macrocenter'],
        logoUrl: 'https://www.migros.com.tr/assets/images/logo.svg',
    })

    const carrefoursa = await upsertBrand('CarrefourSA', {
        sectorId: marketSector.id,
        aliases: ['carrefoursa', 'carrefour'],
    })

    const zara = await upsertBrand('Zara', {
        sectorId: fashionSector.id,
        aliases: ['zara'],
    })

    const lcwaikiki = await upsertBrand('LC Waikiki', {
        sectorId: fashionSector.id,
        aliases: ['lcwaikiki', 'lc waikiki', 'waikiki'],
    })

    const shell = await upsertBrand('Shell', {
        sectorId: fuelSector.id,
        aliases: ['shell'],
    })

    const opet = await upsertBrand('Opet', {
        sectorId: fuelSector.id,
        aliases: ['opet'],
    })

    // Kampanyalar (Using title for simple matching)
    const upsertCampaign = async (title: string, data: any) => {
        const existing = await prisma.campaign.findFirst({ where: { title } });
        if (existing) {
            return await prisma.campaign.update({ where: { id: existing.id }, data });
        }
        return await prisma.campaign.create({ data: { title, ...data } });
    };

    await upsertCampaign('Migros\'ta %10 Bonus Puan', {
        cardId: bonusCard.id,
        sectorId: marketSector.id,
        rewardText: '100 TL ve üzeri alışverişlerde 1000 Bonus Puan',
        rewardValue: 100,
        rewardType: 'points',
        detailsText: 'Kampanya tüm Migros mağazalarında geçerlidir.',
        conditionsText: 'Minimum 100 TL harcama şartı vardır.',
        endDate: new Date('2025-12-31'),
        trackingUrl: 'https://www.garantibbva.com.tr/bonus-migros?utm_source=kasaonu',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    })

    await upsertCampaign('Migros\'ta 50 TL MaxiPuan', {
        cardId: maximumCard.id,
        sectorId: marketSector.id,
        rewardText: '250 TL ve üzeri alışverişlerde 50 TL MaxiPuan',
        rewardValue: 50,
        rewardType: 'cashback',
        detailsText: 'Kampanya sadece Cumartesi-Pazar geçerlidir.',
        conditionsText: 'Minimum 250 TL harcama yapılmalıdır.',
        endDate: new Date('2025-06-30'),
        imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    })

    await upsertCampaign('Zara\'da %15 İndirim', {
        cardId: worldCard.id,
        sectorId: fashionSector.id,
        rewardText: 'Tüm alışverişlerde %15 indirim',
        rewardValue: 150,
        rewardType: 'discount',
        detailsText: 'Kampanya online ve mağaza alışverişlerinde geçerlidir.',
        endDate: new Date('2025-03-31'),
    })

    await upsertCampaign('Shell\'de 30 Litre Yakıta 500 Bonus Puan', {
        cardId: bonusCard.id,
        sectorId: fuelSector.id,
        rewardText: '30 litre ve üzeri yakıt alımlarında 500 Bonus Puan',
        rewardValue: 50,
        rewardType: 'points',
        detailsText: 'Kampanya tüm Shell istasyonlarında geçerlidir.',
        endDate: new Date('2025-08-31'),
    })

    await upsertCampaign('CarrefourSA\'da World Ayrıcalığı', {
        cardId: worldCard.id,
        sectorId: marketSector.id,
        rewardText: '200 TL ve üzeri alışverişlerde 40 TL World Puan',
        rewardValue: 40,
        rewardType: 'cashback',
        detailsText: 'Kampanya sadece CarrefourSA Hypermarket\'lerde geçerlidir.',
        conditionsText: 'Minimum 200 TL harcama gereklidir.',
        endDate: new Date('2025-12-31'),
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
