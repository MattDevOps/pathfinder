'use client';

import { useState } from 'react';

// Copy-the-current-URL share button. Uses the native share sheet when
// available (mobile), otherwise the clipboard with a transient "copied" state.
export default function ShareButton({
  label,
  copiedLabel,
}: {
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user dismissed the share sheet, or clipboard denied — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="rounded-full border border-foreground/20 px-6 py-2.5 font-medium transition hover:bg-foreground/5"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
