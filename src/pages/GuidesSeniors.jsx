import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuidesSeniors() {
  useEffect(() => {
    document.title = 'How Seniors Can Post a Yard Sale Online - Easy Guide | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Simple guide for seniors to post yard sales online in NYC. No tech skills needed - list your sale in minutes in Brooklyn, Queens, or anywhere in New York.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How Seniors Can Post a Yard Sale Online",
      "description": "Simple steps for seniors to list yard sales online",
      "step": [
        {"@type": "HowToStep", "text": "Gather your address or nearest intersection"},
        {"@type": "HowToStep", "text": "Choose your date and time"},
        {"@type": "HowToStep", "text": "Add a short description (optional)"},
        {"@type": "HowToStep", "text": "Upload photos (optional but helpful)"}
      ]
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="seniors" 
          image="https://images.unsplash.com/photo-1560264280-88b68371db39?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}