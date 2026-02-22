import React, { useEffect } from 'react';
import { GuideContent } from '../components/GuideContent';

export default function GuidesSeniors() {
  useEffect(() => {
    document.title = 'How Seniors Can Post Yard Sales, Garage Sales & Stoop Sales Online | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Simple guide for seniors to post yard sales, garage sales, and stoop sales online in NYC. No tech skills needed - list your yard sale, garage sale, or street sale in minutes in Brooklyn, Queens, or anywhere in New York.');
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'seniors post yard sale, elderly garage sale online, seniors stoop sale, easy yard sale listing, post garage sale for seniors, simple yard sale listing, seniors sell online NYC, easy garage sale posting';
      document.head.appendChild(keywords);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How Seniors Can Post a Yard Sale, Garage Sale or Stoop Sale Online",
      "description": "Simple steps for seniors to list yard sales, garage sales, and stoop sales online",
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