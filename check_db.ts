
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function checkData() {
    try {
        const campaign = await prisma.campaign.findFirst({
            include: {
                card: { include: { bank: true } },
                brands: { include: { brand: true } }
            }
        });

        if (campaign) {
            console.log('--- Campaign Data Keys ---');
            console.log(Object.keys(campaign));
            console.log('--- Sample Campaign ---');
            console.log(JSON.stringify(campaign, null, 2));
        } else {
            console.log('No campaigns found in database.');
        }
    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
