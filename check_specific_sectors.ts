
import 'dotenv/config'
import { prisma } from './lib/prisma'

async function checkAndClean() {
    const ids = [1, 2];
    try {
        for (const id of ids) {
            const sector = await prisma.sector.findUnique({
                where: { id },
                include: {
                    _count: { select: { campaigns: true, brands: true } }
                }
            });

            if (sector) {
                console.log(`Found Sector: [${sector.id}] ${sector.name} - Campaigns: ${sector._count.campaigns}, Brands: ${sector._count.brands}`);
            } else {
                console.log(`Sector ID ${id} not found.`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndClean();
