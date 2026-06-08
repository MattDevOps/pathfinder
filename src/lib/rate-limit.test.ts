import { describe, it, expect } from 'vitest';
import { FailureRateLimiter } from './rate-limit';

const opts = { maxFailures: 3, windowMs: 1000 };

describe('FailureRateLimiter', () => {
  it('blocks once failures reach the limit', () => {
    const rl = new FailureRateLimiter(opts);
    expect(rl.isBlocked('ip', 0)).toBe(false);
    rl.recordFailure('ip', 0);
    rl.recordFailure('ip', 10);
    expect(rl.isBlocked('ip', 20)).toBe(false); // 2 < 3
    rl.recordFailure('ip', 30);
    expect(rl.isBlocked('ip', 40)).toBe(true); // 3 >= 3
  });

  it('expires failures outside the sliding window', () => {
    const rl = new FailureRateLimiter(opts);
    rl.recordFailure('ip', 0);
    rl.recordFailure('ip', 100);
    rl.recordFailure('ip', 200);
    expect(rl.isBlocked('ip', 250)).toBe(true);
    // Window is 1000ms; at t=1101 the first two (0,100) have expired -> only 200 remains.
    expect(rl.failureCount('ip', 1101)).toBe(1);
    expect(rl.isBlocked('ip', 1101)).toBe(false);
  });

  it('reset clears the history', () => {
    const rl = new FailureRateLimiter(opts);
    rl.recordFailure('ip', 0);
    rl.recordFailure('ip', 0);
    rl.recordFailure('ip', 0);
    expect(rl.isBlocked('ip', 0)).toBe(true);
    rl.reset('ip');
    expect(rl.isBlocked('ip', 0)).toBe(false);
  });

  it('tracks keys independently', () => {
    const rl = new FailureRateLimiter(opts);
    rl.recordFailure('a', 0);
    rl.recordFailure('a', 0);
    rl.recordFailure('a', 0);
    expect(rl.isBlocked('a', 0)).toBe(true);
    expect(rl.isBlocked('b', 0)).toBe(false);
  });

  it('reports time until the block lifts', () => {
    const rl = new FailureRateLimiter(opts);
    rl.recordFailure('ip', 0);
    rl.recordFailure('ip', 0);
    rl.recordFailure('ip', 0);
    // Oldest failure at t=0 expires at t=1000; at t=400 that's 600ms away.
    expect(rl.retryAfterMs('ip', 400)).toBe(600);
    expect(rl.retryAfterMs('other', 400)).toBe(0);
  });
});
