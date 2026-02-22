import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuidesPermit() {
  useEffect(() => {
    document.title = 'Do You Need a Permit for Yard Sales, Garage Sales & Stoop Sales in NYC? | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Do you need a permit to host a yard sale, garage sale, or stoop sale in New York City? Learn NYC regulations and rules for yard sales, garage sales, street sales in Brooklyn, Queens, and Manhattan.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'yard sale permit NYC, garage sale permit New York, stoop sale legal, street sale permit, NYC yard sale rules, Brooklyn garage sale regulations, Queens stoop sale laws, do I need permit for yard sale, garage sale permit requirements';
      document.head.appendChild(keywords);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you need a permit for a yard sale in New York City?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most small, casual yard sales in NYC do not require a permit if you're not blocking sidewalks, creating noise issues, or selling as a recurring business."
          }
        },
        {
          "@type": "Question",
          "name": "Do garage sales and stoop sales require permits in NYC?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Like yard sales, most residential garage sales and stoop sales in NYC do not require permits as long as they are occasional, non-commercial, and don't obstruct public areas."
          }
        }
      ]
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