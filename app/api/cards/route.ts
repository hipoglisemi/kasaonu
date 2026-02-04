import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const cards = await prisma.card.findMany({
            where: {
                isActive: true,
            },
            include: {
                bank: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [
                {
                    bank: {
                        name: 'asc',
                    },
                },
                {
                    name: 'asc',
                },
            ],
        })

        return NextResponse.json({ cards })
    } catch (error) {
        console.error('Cards fetch error:', error)
        return NextResponse.json(
            { error: 'Kartlar yüklenirken hata oluştu' },
            { status: 500 }
        )
    }
}
