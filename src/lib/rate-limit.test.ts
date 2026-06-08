import { describe, it, expect } from 'vitest';
import { SlidingWindowRateLimiter } from './rate-limit';

const opts = { maxEvents: 3, windowMs: 1000 };

describe('SlidingWindowRateLimiter', () => {
  it('blocks once events reach the limit', () => {
    const rl = new SlidingWindowRateLimiter(opts);
    expect(rl.isBlocked('ip', 0)).toBe(false);
    rl.record('ip', 0);
    rl.record('ip', 10);
    expect(rl.isBlocked('ip', 20)).toBe(false); // 2 < 3
    rl.record('ip', 30);
    expect(rl.isBlocked('ip', 40)).toBe(true); // 3 >= 3
  });

  it('expires events outside the sliding window', () => {
    const rl = new SlidingWindowRateLimiter(opts);
    rl.record('ip', 0);
    rl.record('ip', 100);
    rl.record('ip', 200);
    expect(rl.isBlocked('ip', 250)).toBe(true);
    // Window is 1000ms; at t=1101 the first two (0,100) have expired -> only 200 remains.
    expect(rl.count('ip', 1101)).toBe(1);
    expect(rl.isBlocked('ip', 1101)).toBe(false);
  });

  it('reset clears the history', () => {
    const rl = new SlidingWindowRateLimiter(opts);
    rl.record('ip', 0);
    rl.record('ip', 0);
    rl.record('ip', 0);
    expect(rl.isBlocked('ip', 0)).toBe(true);
    rl.reset('ip');
    expect(rl.isBlocked('ip', 0)).toBe(false);
  });

  it('tracks keys independently', () => {
    const rl = new SlidingWindowRateLimiter(opts);
    rl.record('a', 0);
    rl.record('a', 0);
    rl.record('a', 0);
    expect(rl.isBlocked('a', 0)).toBe(true);
    expect(rl.isBlocked('b', 0)).toBe(false);
  });

  it('reports time until the block lifts', () => {
    const rl = new SlidingWindowRateLimiter(opts);
    rl.record('ip', 0);
    rl.record('ip', 0);
    rl.record('ip', 0);
    // Oldest event at t=0 expires at t=1000; at t=400 that's 600ms away.
    expect(rl.retryAfterMs('ip', 400)).toBe(600);
    expect(rl.retryAfterMs('other', 400)).toBe(0);
  });
});
