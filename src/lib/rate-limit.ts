// Sliding-window failure rate limiter (PLAN.md section 4: rate-limit the
// auth/submit endpoints). Pure and clock-injectable so it is unit-testable.
//
// State is in-process. On Vercel Fluid Compute, instances are reused across
// requests, so this provides real protection for a single-admin login. A
// multi-instance-hardened version should back this with a shared store
// (Upstash/Redis or a DB table) — the interface stays the same.

export interface FailureLimiterOptions {
  maxFailures: number; // failures allowed within the window before blocking
  windowMs: number; // sliding window length
}

export class FailureRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly opts: FailureLimiterOptions) {}

  // Drop timestamps older than the window, returning the survivors.
  private fresh(key: string, now: number): number[] {
    const cutoff = now - this.opts.windowMs;
    const kept = (this.hits.get(key) ?? []).filter((t) => t > cutoff);
    if (kept.length > 0) this.hits.set(key, kept);
    else this.hits.delete(key);
    return kept;
  }

  /** Number of failures for `key` within the current window. */
  failureCount(key: string, now: number): number {
    return this.fresh(key, now).length;
  }

  /** True once failures have reached the limit (further attempts blocked). */
  isBlocked(key: string, now: number): boolean {
    return this.failureCount(key, now) >= this.opts.maxFailures;
  }

  /** Record one failed attempt. */
  recordFailure(key: string, now: number): void {
    const kept = this.fresh(key, now);
    kept.push(now);
    this.hits.set(key, kept);
  }

  /** Clear a key's history (call on a successful attempt). */
  reset(key: string): void {
    this.hits.delete(key);
  }

  /** Milliseconds until the oldest in-window failure expires (0 if not blocked). */
  retryAfterMs(key: string, now: number): number {
    if (!this.isBlocked(key, now)) return 0;
    const times = this.fresh(key, now);
    const oldest = Math.min(...times);
    return Math.max(0, oldest + this.opts.windowMs - now);
  }
}
