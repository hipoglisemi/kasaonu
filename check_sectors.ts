
import 'dotenv/config'
import { prisma } from './lib/prisma'

async function checkSectors() {
    try {
        const sectors = await prisma.sector.findMany({
            include: {
                _count: {
                    select: { campaigns: true, brands: true }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });

        console.log('--- SECTORS STATUS ---');
        sectors.forEach(s => {
            console.log(`[ID: ${s.id}] ${s.name} (${s.slug}) - Campaigns: ${s._count.campaigns}, Brands: ${s._count.brands}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSectors();
