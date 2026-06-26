'use client';

import { useEffect } from 'react';

/**
 * Feuert das Meta-Pixel "Lead"-Conversion-Event beim Mount.
 * Wird auf /danke gerendert (Form-Submit erfolgreich → SPA-Navigation hierher).
 * fbq existiert erst, wenn MetaPixel geladen + Pixel-ID gesetzt ist — sonst No-op.
 */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function LeadEvent() {
  useEffect(() => {
    window.fbq?.('track', 'Lead');
  }, []);

  return null;
}
