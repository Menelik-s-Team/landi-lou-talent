type RateLimitEntry = { count: number; resetAt: number }

const store = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  limit: number
  windowMs: number
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  entry.count++
  const remaining = Math.max(0, limit - entry.count)
  return { allowed: entry.count <= limit, remaining }
}

export function getRateLimitKey(req: Request, prefix: string): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `${prefix}:${ip}`
}
