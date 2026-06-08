// Sliding-window rate limiter (PLAN.md section 4: rate-limit the auth/submit
// endpoints). Pure and clock-injectable so it is unit-testable. Generic over
// what an "event" means: the admin login records failed attempts; the quiz
// submit records every submission.
//
// State is in-process. On Vercel Fluid Compute, instances are reused across
// requests, so this provides real protection. A multi-instance-hardened
// version should back this with a shared store (Upstash/Redis or a DB table) —
// the interface stays the same.

export interface RateLimitOptions {
  maxEvents: number; // events allowed within the window before blocking
  windowMs: number; // sliding window length
}

export class SlidingWindowRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly opts: RateLimitOptions) {}

  // Drop timestamps older than the window, returning the survivors.
  private fresh(key: string, now: number): number[] {
    const cutoff = now - this.opts.windowMs;
    const kept = (this.hits.get(key) ?? []).filter((t) => t > cutoff);
    if (kept.length > 0) this.hits.set(key, kept);
    else this.hits.delete(key);
    return kept;
  }

  /** Number of events for `key` within the current window. */
  count(key: string, now: number): number {
    return this.fresh(key, now).length;
  }

  /** True once events have reached the limit (further attempts blocked). */
  isBlocked(key: string, now: number): boolean {
    return this.count(key, now) >= this.opts.maxEvents;
  }

  /** Record one event. */
  record(key: string, now: number): void {
    const kept = this.fresh(key, now);
    kept.push(now);
    this.hits.set(key, kept);
  }

  /** Clear a key's history (e.g. on a successful login). */
  reset(key: string): void {
    this.hits.delete(key);
  }

  /** Milliseconds until the oldest in-window event expires (0 if not blocked). */
  retryAfterMs(key: string, now: number): number {
    if (!this.isBlocked(key, now)) return 0;
    const times = this.fresh(key, now);
    const oldest = Math.min(...times);
    return Math.max(0, oldest + this.opts.windowMs - now);
  }
}
