import { NextResponse } from 'next/server'
import { redis, getCached, setCache } from '@/lib/redis'

export async function GET() {
    try {
        // Test connection
        await redis.ping()

        // Test SET
        await setCache('test:key', { message: 'Hello Redis!' }, 60)

        // Test GET
        const cached = await getCached<{ message: string }>('test:key')

        return NextResponse.json({
            success: true,
            message: 'Redis bağlantısı başarılı!',
            testData: cached,
            redisInfo: {
                host: redis.options.host,
                port: redis.options.port,
                status: redis.status,
            },
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: String(error),
                message: 'Redis bağlantısı başarısız. Coolify\'da Redis kurulumunu kontrol edin.',
            },
            { status: 500 }
        )
    }
}
