'use client';

import { useEffect, useRef } from 'react';
import { capture, type EventName } from '@/lib/analytics';

// Fires a single analytics event on mount. Lets server components (landing,
// results) record a funnel step by rendering a tiny client island. The ref
// guard prevents a double-count under dev StrictMode's double effect invoke.
export default function TrackEvent({
  event,
  props,
}: {
  event: EventName;
  props?: Record<string, unknown>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    capture(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
