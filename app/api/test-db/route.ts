import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const count = await prisma.bank.count()

        return NextResponse.json({
            success: true,
            message: 'Database bağlantısı başarılı!',
            bankCount: count
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: String(error)
            },
            { status: 500 }
        )
    }
}
