/**
 * 인메모리 토큰 버킷 레이트리밋. 단일 인스턴스 배포 기준 동작하며,
 * 다중 인스턴스로 스케일아웃 시 Redis 등 공유 스토어로 교체가 필요하다.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(req: Request, key: string, limit: number, windowMs: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}
