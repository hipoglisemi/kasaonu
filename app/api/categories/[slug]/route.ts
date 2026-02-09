import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Missing category slug' }, { status: 400 })
        }

        const category = await prisma.sector.findUnique({
            where: { slug }
        })

        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
        }

        const skip = (page - 1) * limit

        const where: any = {
            sectorId: category.id,
            isActive: true,
            OR: [
                { endDate: null },
                { endDate: { gte: new Date() } },
            ],
        }

        const [campaigns, total] = await Promise.all([
            prisma.campaign.findMany({
                where,
                include: {
                    card: {
                        include: {
                            bank: true
                        }
                    },
                    sector: true,
                    brands: {
                        include: {
                            brand: true
                        }
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.campaign.count({ where }),
        ])

        return NextResponse.json({
            success: true,
            data: {
                category,
                campaigns,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        })

    } catch (error: any) {
        console.error('Error fetching category:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
