import Redis from 'ioredis'

const globalForRedis = global as unknown as { redis: Redis }

export const redis =
    globalForRedis.redis ||
    new Redis({
        host: process.env.REDIS_HOST || '46.225.74.97',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        lazyConnect: true,
        retryStrategy: (times) => {
            // Reconnect after
            const delay = Math.min(times * 50, 2000)
            return delay
        },
        maxRetriesPerRequest: 3,
    })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Helper functions
export async function getCached<T>(key: string): Promise<T | null> {
    try {
        const cached = await redis.get(key)
        if (!cached) return null
        return JSON.parse(cached) as T
    } catch (error) {
        console.error('Redis GET error:', error)
        return null
    }
}

export async function setCache(
    key: string,
    value: any,
    ttlSeconds: number = 300
): Promise<void> {
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
        console.error('Redis SET error:', error)
    }
}

export async function deleteCache(key: string): Promise<void> {
    try {
        await redis.del(key)
    } catch (error) {
        console.error('Redis DEL error:', error)
    }
}

export async function clearCachePattern(pattern: string): Promise<void> {
    try {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) {
            await redis.del(...keys)
        }
    } catch (error) {
        console.error('Redis CLEAR error:', error)
    }
}
