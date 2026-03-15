import { useEffect, useRef } from 'react';

export default function AdSense({ className = '' }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ad already initialized
    }
  }, []);

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9420381871665480"
        data-ad-slot="3271974942"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}