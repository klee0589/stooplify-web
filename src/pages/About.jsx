import React from 'react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4">
      <SEO
        title="About Stooplify | Local Yard Sale & Stoop Sale Finder"
        description="Learn about Stooplify, the app that helps you find and list yard sales, stoop sales, and garage sales in NYC and beyond."
        canonical="https://stooplify.com/about"
      />
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl font-bold text-[#2E3A59] dark:text-white mb-6"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          About Stooplify
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed">
          <p>
            Stooplify is a community-driven platform built to make finding and listing local yard sales, stoop sales, and garage sales easier than ever before. Whether you're a seasoned treasure hunter or a first-time seller looking to clear out some space, Stooplify connects neighbors in a simple, trustworthy way.
          </p>

          <p>
            Our platform is designed for everyday people in New York City and surrounding areas who want to participate in the vibrant sidewalk sale culture that makes urban neighborhoods feel alive. From Brooklyn brownstone stoops to Queens driveways, Stooplify puts local sales on the map — literally.
          </p>

          <p>
            For buyers, Stooplify offers an interactive map, calendar view, category filters, and smart neighborhood alerts so you never miss a sale nearby. You can save favorites, mark your attendance, message sellers directly, and even earn credits for verified visits.
          </p>

          <p>
            For sellers, listing a sale takes just minutes. Upload photos, set your date and location, and let our AI generate a description from your images. Your first listing is completely free. We also offer paid options for power sellers who want more visibility and unlimited listings.
          </p>

          <p>
            Stooplify was founded by Daniel, who grew up in Queens and Brooklyn and has always loved the hunt for hidden gems at local stoop sales. He built Stooplify to solve a simple problem: great local sales were invisible unless you happened to walk by at exactly the right time. Now, with Stooplify, those sales are easy to find and easy to list — no spam, no sketchy listings, just real people and real neighborhoods.
          </p>

          <p>
            We are continuously expanding to new cities and adding features based on community feedback. If you have ideas, questions, or just want to say hello, we'd love to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}