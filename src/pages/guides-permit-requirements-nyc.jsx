import React from 'react';
import { GuideContent } from '../components/GuideContent';
import SEO from '../components/SEO';

export default function GuidePermitRequirementsNYC() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <SEO
        title="Do You Need a Permit for a Yard Sale in NYC? | Stooplify"
        description="Do you need a permit to host a yard sale, garage sale, or stoop sale in New York City? Learn NYC regulations for yard sales in Brooklyn, Queens, and Manhattan."
        keywords="yard sale permit NYC, garage sale permit New York, stoop sale legal, NYC yard sale rules, do I need permit for yard sale"
        url="https://stooplify.com/guides-permit-requirements-nyc"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {"@type": "Question", "name": "Do you need a permit for a yard sale in New York City?", "acceptedAnswer": {"@type": "Answer", "text": "Most small, casual yard sales in NYC do not require a permit if you're not blocking sidewalks, creating noise issues, or selling as a recurring business."}},
            {"@type": "Question", "name": "Do garage sales and stoop sales require permits in NYC?", "acceptedAnswer": {"@type": "Answer", "text": "Like yard sales, most residential garage sales and stoop sales in NYC do not require permits as long as they are occasional, non-commercial, and don't obstruct public areas."}}
          ]
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GuideContent 
          guide="permit" 
          image="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&h=400&fit=crop"
        />
      </div>
    </div>
  );
}