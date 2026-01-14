import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuidesPermit() {
  useEffect(() => {
    document.title = 'Do You Need a Permit for a Yard Sale in NYC? | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Do you need a permit to host a yard sale in New York City? Learn NYC yard sale rules and regulations for Brooklyn, Queens, and Manhattan.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "Do you need a permit for a yard sale in New York City?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most small, casual yard sales in NYC do not require a permit if you're not blocking sidewalks, creating noise issues, or selling as a recurring business."
        }
      }]
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="permit" 
          image="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}