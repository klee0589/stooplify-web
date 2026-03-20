import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, PlusCircle, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { format, parseISO } from 'date-fns';
import { createPageUrl } from '@/utils';

const boroughIntros = {
  Brooklyn: {
    how: "Brooklyn stoop sales are a cherished NYC tradition where neighbors set up right on their stoops or sidewalks to sell furniture, vintage clothing, books, toys, and more. Unlike indoor garage sales, stoop sales are part of the neighborhood street life — casual, friendly, and full of surprises.",
    when: "Most Brooklyn stoop sales happen on Saturday and Sunday mornings between 8am and 2pm, especially from late spring through early fall. The busiest weekends are when the weather is warm and dry. Some sellers also list midweek sales.",
    tips: "Arrive early for the best picks. Bring small bills and a payment app like Venmo or CashApp. Check Stooplify Friday night or Saturday morning to plan your route through Williamsburg, Park Slope, Bushwick, or Crown Heights.",
  },
  Queens: {
    how: "Queens yard sales and stoop sales reflect the borough's diverse communities — you'll find everything from antiques and electronics to culturally unique items, clothing, and furniture. Sales happen in front yards, driveways, and on sidewalks across the borough.",
    when: "Queens sales are most common on weekend mornings from April through October, typically starting at 8 or 9am. Jackson Heights, Astoria, and Flushing tend to have active sale seasons on Saturdays.",
    tips: "Use Stooplify's map to spot clusters of sales in the same neighborhood. Bring a reusable bag and small change. Don't be afraid to make reasonable offers — most sellers are happy to negotiate.",
  },
  Manhattan: {
    how: "Manhattan stoop sales are compact but treasure-packed. With limited outdoor space, sellers are creative — setting up on building stoops, in courtyards, or on the sidewalk outside their buildings. You'll often find high-quality items from apartment cleanouts.",
    when: "Manhattan sales peak on weekend mornings, April through November. The Upper West Side, Harlem, and Washington Heights are especially active. Sales often run from 9am to 1pm.",
    tips: "Follow neighborhood Facebook groups and Stooplify for last-minute listings. Bring a tote bag and MetroCard — the best finds often require a short subway hop between neighborhoods.",
  },
  Bronx: {
    how: "The Bronx has a strong community tradition of outdoor sales, from sidewalk stoop sales to multi-family garage sales in driveways. Items range from furniture and electronics to clothing, collectibles, and household goods.",
    when: "Bronx yard sales typically run on Saturday and Sunday mornings from April through September. Riverdale, Fordham, and Pelham Bay neighborhoods tend to be the most active.",
    tips: "Check Stooplify on Friday evening to plan your Saturday route. Bring cash — many Bronx sellers prefer it. Arrive between 8 and 10am for the freshest selection.",
  },
  'Jersey City': {
    how: "Jersey City has a growing yard sale and stoop sale scene, fueled by a mix of longtime residents and newer arrivals. Sales range from apartment cleanouts in the Heights to brownstone stoop sales in Downtown and the Village.",
    when: "Jersey City sales peak on weekends from May through October. The Heights, Downtown, and Bergen-Lafayette neighborhoods see the most activity, typically from 9am to 2pm on Saturdays.",
    tips: "Take the PATH train or bike — parking can be tricky. Stooplify lists sales in real-time so you can plan your route from Hoboken to Greenville. Bring cash and a bag.",
  },
};

export default function CityLandingPage({ config }) {
  const navigate = useNavigate();
  const { city, state, title, metaTitle, metaDescription, keywords, h1, intro, neighborhoods, canonicalUrl } = config;
  const boroughInfo = boroughIntros[city] || null;

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['cityLandingSales', city, state],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 500);
      const now = new Date();
      console.log(`Filtering for ${city}, ${state}. Total approved sales: ${allSales.length}`);
      if (allSales.length > 0) {
        console.log('Sample sale:', { state: allSales[0].state, city: allSales[0].city, general_location: allSales[0].general_location });
      }
      // Map cities to zip code ranges
      const zipRanges = {
        'Brooklyn': [[11200, 11260]],
        'Manhattan': [[10001, 10282]],
        'Queens': [[11300, 11440], [11500, 11700]],
        'Bronx': [[10451, 10475]],
        'Staten Island': [[10300, 10320]]
      };

      const cityZipRanges = zipRanges[city] || [];
      
      const filtered = allSales.filter((sale) => {
        const cityMatch = sale.city?.toLowerCase().includes(city.toLowerCase());
        const generalLocationMatch = sale.general_location?.toLowerCase().includes(city.toLowerCase());
        const neighborhoodMatch = (neighborhoods || []).some((n) =>
          sale.general_location?.toLowerCase().includes(n.toLowerCase())
        );
        
        // Check if zip code matches the city
        let zipMatch = false;
        if (sale.zip_code) {
          const zip = parseInt(sale.zip_code);
          zipMatch = cityZipRanges.some(([min, max]) => zip >= min && zip <= max);
        }
        
        const matchesLocation = cityMatch || generalLocationMatch || neighborhoodMatch || zipMatch;
        const saleDate = new Date(sale.date);
        saleDate.setHours(23, 59, 59); // End of day
        const isUpcoming = saleDate >= now;
        return matchesLocation && isUpcoming;
      });
      console.log(`Matched sales: ${filtered.length}`);
      return filtered;
    }
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": metaTitle,
    "description": metaDescription,
    "url": canonicalUrl,
    "about": {
      "@type": "Thing",
      "name": `Stoop Sales in ${city}`
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={keywords}
        url={canonicalUrl}
        structuredData={structuredData} />


      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a2842] to-[#14B8FF] text-white pt-32 md:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" /> {city}, {state}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {h1}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">{intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(createPageUrl('YardSales'))} className="bg-white text-[#1a2842] hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
                Browse All Sales
              </Button>
              <Button onClick={() => navigate(createPageUrl('AddYardSale'))} variant="outline" className="bg-slate-50 text-slate-950 px-8 py-6 text-lg font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground h-9 border-white hover:bg-white/10">
                <PlusCircle className="w-5 h-5 mr-2" /> List Your Sale Free
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Live Listings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Upcoming {title} — Live Listings
          </h2>
          {isLoading ?
          <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14B8FF] border-t-transparent" />
            </div> :
          sales.length === 0 ?
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No upcoming sales listed right now</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Be the first to list a sale in {city}!</p>
              <Button onClick={() => navigate(createPageUrl('AddYardSale'))} className="bg-[#14B8FF] text-white">
                List Your Sale Free
              </Button>
            </div> :

          <div className="grid md:grid-cols-2 gap-4">
              {sales.map((sale, i) =>
            <motion.div key={sale.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
              className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-[#14B8FF] hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#14B8FF] transition-colors line-clamp-2">{sale.title}</h3>
                      <ArrowRight className="w-4 h-4 text-[#14B8FF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5 ml-2" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(parseISO(sale.date), 'MMM d')}</span>
                      {sale.start_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sale.start_time}</span>}
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{sale.general_location}</span>
                    </div>
                    {sale.categories && sale.categories.length > 0 &&
                <div className="flex gap-1 mt-auto">
                        {sale.categories.slice(0, 3).map((c) =>
                  <Badge key={c} className="bg-[#14B8FF]/10 text-[#14B8FF] text-xs">{c}</Badge>
                  )}
                      </div>
                }
                  </Link>
                </motion.div>
            )}
            </div>
          }
          <div className="mt-6 text-center">
            <Link to={createPageUrl('YardSales')} className="inline-flex items-center gap-2 text-[#14B8FF] font-medium hover:underline">
              View all sales on the map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Neighborhoods */}
        {neighborhoods && neighborhoods.length > 0 &&
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Popular {city} Neighborhoods for Stoop & Yard Sales
            </h2>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((n) =>
            <span key={n} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {n}
                </span>
            )}
            </div>
          </section>
        }

        {/* Borough-specific SEO intro — rich crawlable content */}
        {boroughInfo && (
          <section className="mb-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <BookOpen className="w-6 h-6 text-[#14B8FF]" />
              About Stoop Sales in {city}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">🏠 How They Work</h3>
                <p>{boroughInfo.how}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">📅 When to Go</h3>
                <p>{boroughInfo.when}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">💡 Tips for Finding Them</h3>
                <p>{boroughInfo.tips}</p>
              </div>
            </div>
          </section>
        )}

        {/* SEO content block */}
        <section className="prose prose-lg max-w-none dark:prose-invert mb-16">
          <h2>About {title}</h2>
          <p>
            {city} has a vibrant culture of neighborhood sales, stoop sales, and garage sales. Residents regularly sell
            furniture, clothing, electronics, antiques, and everyday household items at prices far below retail.
            Stooplify makes it easy to discover all upcoming {title.toLowerCase()} in one place — whether you're a
            buyer hunting for hidden gems or a seller looking to clear out and make some cash.
          </p>
          <p>
            Every listing on Stooplify includes a location, date, time, and categories so you can plan your
            treasure-hunting route. Sellers can <Link to={createPageUrl('AddYardSale')} className="text-[#14B8FF]">list a sale for free</Link> in under 5 minutes.
            Listings also include a shareable flyer, QR code, and attendance tracking.
          </p>
          <h3>Tips for Buyers in {city}</h3>
          <ul>
            <li>Check Stooplify Saturday morning early — the best deals go fast</li>
            <li>Bring cash and a backup digital payment (Venmo/CashApp)</li>
            <li>Enable smart alerts to get notified of new sales in your neighborhood</li>
            <li>Use the map view to plan an efficient route between multiple sales</li>
          </ul>
          <h3>Tips for Sellers in {city}</h3>
          <ul>
            <li>List 3–5 days early with photos to build interest before sale day</li>
            <li>Price items clearly — use round numbers like $1, $5, $10, $20</li>
            <li>Accept multiple payment methods to maximize completed sales</li>
            <li><Link to={createPageUrl('AddYardSale')} className="text-[#14B8FF]">Create your free listing on Stooplify</Link> to reach local buyers</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#14B8FF] to-[#0da3e6] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to sell in {city}?
          </h3>
          <p className="text-white/90 mb-6">List your sale for free and reach thousands of local buyers</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(createPageUrl('AddYardSale'))} className="bg-white text-slate-900 px-4 py-2 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 hover:bg-gray-100">
              List Your Sale Free
            </Button>
            <Button onClick={() => navigate(createPageUrl('YardSales'))} variant="outline" className="bg-slate-50 text-slate-950 px-4 py-2 text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground h-9 border-white hover:bg-white/10">
              Browse Nearby Sales
            </Button>
          </div>
        </div>
      </div>
    </div>);

}