import React from 'react';
import { GuideContent } from '../components/GuideContent';
import SEO from '../components/SEO';

export default function GuidesSeniorsYardSales() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO
        title="How Seniors Can Post a Yard Sale Online — Simple Guide | Stooplify"
        description="Simple guide for seniors to post yard sales, garage sales, and stoop sales online in NYC. No tech skills needed — list your sale in minutes."
        keywords="seniors post yard sale, elderly garage sale online, seniors stoop sale, easy yard sale listing, seniors sell online NYC"
        url="https://stooplify.com/guides-seniors-yard-sales"
        structuredData={{
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
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="seniors" 
          image="https://images.unsplash.com/photo-1560264280-88b68371db39?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}