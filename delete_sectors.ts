
import 'dotenv/config'
import { prisma } from './lib/prisma'

async function deleteSpecificSectors() {
    const ids = [1, 2];
    try {
        console.log('Unlinking and deleting sectors...');

        for (const id of ids) {
            // 1. Unlink brands
            const brandUpdate = await prisma.brand.updateMany({
                where: { sectorId: id },
                data: { sectorId: 18 } // Set to "Diğer" (ID 18) instead of NULL to avoid schema errors if NULL is blocked
            });
            console.log(`Unlinked ${brandUpdate.count} brands from Sector ${id}.`);

            // 2. Unlink campaigns
            const campaignUpdate = await prisma.campaign.updateMany({
                where: { sectorId: id },
                data: { sectorId: null }
            });
            console.log(`Unlinked ${campaignUpdate.count} campaigns from Sector ${id}.`);

            // 3. Delete sector
            const deleted = await prisma.sector.delete({
                where: { id }
            });
            console.log(`Successfully deleted sector: [${deleted.id}] ${deleted.name}`);
        }

    } catch (e) {
        console.error('Error during deletion:', e);
    } finally {
        await prisma.$disconnect();
    }
}

deleteSpecificSectors();
