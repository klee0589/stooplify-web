import { useEffect } from 'react';

/**
 * Monitor and log unused JavaScript/CSS to identify optimization opportunities
 */
export default function ChunkLoadMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Log resource timing after page load
    const logResourceTiming = () => {
      const resources = performance.getEntries();
      const jsResources = resources.filter(r => 
        r.name.endsWith('.js') && r.transferSize > 0
      );
      
      const totalJs = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      
      if (jsResources.length > 0 && totalJs > 500000) { // > 500KB
        console.warn(`⚠️ Total JS size: ${(totalJs / 1024).toFixed(0)}KB - consider code-splitting`);
      }
    };

    // Run after page fully loads
    window.addEventListener('load', logResourceTiming);
    return () => window.removeEventListener('load', logResourceTiming);
  }, []);

  return null;
}