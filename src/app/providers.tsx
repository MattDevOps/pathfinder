'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

// Initializes client-side analytics once on mount. Kept as a tiny client
// boundary so the locale layout can stay a server component.
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
