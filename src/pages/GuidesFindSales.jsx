import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuidesFindSales() {
  useEffect(() => {
    document.title = 'Where to Find Yard Sales Near Me This Weekend | Stooplify NYC';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find yard sales near you in NYC this weekend. Browse local sales in Brooklyn, Queens, Manhattan on a map. Discover estate sales and garage sales near me.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Where to Find Yard Sales Near You This Weekend",
      "description": "How to discover local yard sales happening near you",
      "image": "https://images.unsplash.com/photo-1524661135-423995f22d0b",
      "author": {"@type": "Organization", "name": "Stooplify"},
      "publisher": {"@type": "Organization", "name": "Stooplify"},
      "datePublished": "2026-01-14"
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="find" 
          image="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}