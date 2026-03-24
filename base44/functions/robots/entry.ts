Deno.serve(async () => {
  const robotsTxt = `User-agent: *
Allow: /

# Private / app pages — no SEO value
Disallow: /Messages
Disallow: /Favorites
Disallow: /MyYardSales
Disallow: /my-yard-sales
Disallow: /Profile
Disallow: /ChatSupport
Disallow: /AdminCommunityLocations
Disallow: /AdminSupabaseSync
Disallow: /AddYardSale
Disallow: /add-yard-sale
Disallow: /YardSaleDetails

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