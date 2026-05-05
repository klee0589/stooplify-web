Deno.serve(async () => {
  const robotsTxt = `User-agent: *
Allow: /

# Private / no-SEO-value pages
Disallow: /messages
Disallow: /Messages
Disallow: /favorites
Disallow: /Favorites
Disallow: /my-yard-sales
Disallow: /MyYardSales
Disallow: /profile
Disallow: /Profile
Disallow: /ChatSupport
Disallow: /AdminCommunityLocations
Disallow: /AdminAnalytics
Disallow: /admin-analytics
Disallow: /AddYardSale

# Query-string pages that shouldn't be indexed
Disallow: /*?edit=
Disallow: /*?payment=

# Sitemap
Sitemap: https://stooplify.com/api/functions/sitemap
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});