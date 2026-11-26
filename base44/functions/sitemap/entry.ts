import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // IMPORTANT: every URL below must resolve to a real route in src/App.jsx or
  // src/pages.config.js. A sitemap full of 404s is a direct quality/spam signal
  // (and an AdSense policy problem), so only list pages that actually exist.
  const staticPages = [
    // Core
    { url: 'https://stooplify.com/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://stooplify.com/yard-sales', priority: '0.9', changefreq: 'hourly' },
    { url: 'https://stooplify.com/add-yard-sale', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://stooplify.com/pricing', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/calendar', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/legal', priority: '0.4', changefreq: 'monthly' },
    { url: 'https://stooplify.com/site-map', priority: '0.5', changefreq: 'weekly' },
    { url: 'https://stooplify.com/about', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://stooplify.com/contact', priority: '0.5', changefreq: 'monthly' },
    // Blog
    { url: 'https://stooplify.com/blog', priority: '0.8', changefreq: 'daily' },
    // Guides hub + subpages
    { url: 'https://stooplify.com/guides', priority: '0.7', changefreq: 'weekly' },
    { url: 'https://stooplify.com/guides-advertise-yard-sale', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-find-yard-sales', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-permit-requirements-nyc', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-pricing-yard-sale-items', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-seniors-yard-sales', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-best-time-yard-sale', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-post-free-stuff', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-selling-vs-giving', priority: '0.6', changefreq: 'monthly' },
    // Knowledge Hub
    { url: 'https://stooplify.com/what-is-a-stoop-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/stoop-sale-vs-yard-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/how-to-host-a-stoop-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/best-time-for-yard-sales', priority: '0.8', changefreq: 'monthly' },
    // Static SEO article pages
    { url: 'https://stooplify.com/find-stoop-sales-near-you', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/how-to-price-items-stoop-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/where-to-post-yard-sale-online', priority: '0.8', changefreq: 'monthly' },
  ];

  // Directory-style landing pages. These are only submitted while they actually
  // have live listings, because an empty directory page is exactly the "low value
  // content" signal AdSense rejects sites for. `states` / `places` define what
  // counts as a match against an upcoming sale's location.
  const landingPages = [
    { url: 'https://stooplify.com/stoop-sales-nyc', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['new york', 'nyc', 'brooklyn', 'queens', 'manhattan', 'bronx', 'staten island'] },
    { url: 'https://stooplify.com/stoop-sales-brooklyn', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['brooklyn'] },
    { url: 'https://stooplify.com/stoop-sales-queens', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['queens'] },
    { url: 'https://stooplify.com/stoop-sales-manhattan', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['manhattan', 'new york'] },
    { url: 'https://stooplify.com/stoop-sales-bronx', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['bronx'] },
    { url: 'https://stooplify.com/stoop-sales-jersey-city', priority: '0.7', changefreq: 'daily', states: ['NJ'], places: ['jersey city'] },
    { url: 'https://stooplify.com/garage-sales-nyc', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['new york', 'nyc', 'brooklyn', 'queens', 'manhattan', 'bronx', 'staten island'] },
    { url: 'https://stooplify.com/garage-sales-brooklyn', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['brooklyn'] },
    { url: 'https://stooplify.com/garage-sales-manhattan', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['manhattan', 'new york'] },
    { url: 'https://stooplify.com/garage-sales-queens', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['queens'] },
    { url: 'https://stooplify.com/garage-sales-bronx', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['bronx'] },
    // Weekend / high-intent pages
    { url: 'https://stooplify.com/yard-sales-near-me-this-weekend', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-nyc-this-weekend', priority: '0.9', changefreq: 'daily', states: ['NY'] },
    { url: 'https://stooplify.com/brooklyn-stoop-sales-this-weekend', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['brooklyn'] },
    // Neighborhood landing pages
    { url: 'https://stooplify.com/stoop-sales-williamsburg', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['williamsburg'] },
    { url: 'https://stooplify.com/stoop-sales-park-slope', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['park slope'] },
    { url: 'https://stooplify.com/stoop-sales-bushwick', priority: '0.7', changefreq: 'daily', states: ['NY'], places: ['bushwick'] },
    { url: 'https://stooplify.com/stoop-sales-bed-stuy', priority: '0.7', changefreq: 'daily', states: ['NY'], places: ['bed-stuy', 'bedford'] },
    { url: 'https://stooplify.com/stoop-sales-carroll-gardens', priority: '0.7', changefreq: 'daily', states: ['NY'], places: ['carroll gardens'] },
    { url: 'https://stooplify.com/stoop-sales-astoria', priority: '0.7', changefreq: 'daily', states: ['NY'], places: ['astoria'] },
    { url: 'https://stooplify.com/stoop-sales-harlem', priority: '0.7', changefreq: 'daily', states: ['NY'], places: ['harlem'] },
    { url: 'https://stooplify.com/stoop-sales-jersey-city', priority: '0.7', changefreq: 'daily', states: ['NJ'], places: ['jersey city'] },
    { url: 'https://stooplify.com/garage-sales-nyc', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['new york', 'nyc', 'brooklyn', 'queens', 'manhattan', 'bronx', 'staten island'] },
    { url: 'https://stooplify.com/garage-sales-brooklyn', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['brooklyn'] },
    { url: 'https://stooplify.com/garage-sales-manhattan', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['manhattan', 'new york'] },
    { url: 'https://stooplify.com/garage-sales-queens', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['queens'] },
    { url: 'https://stooplify.com/garage-sales-bronx', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['bronx'] },
    { url: 'https://stooplify.com/stoop-sales-nyc-this-weekend', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['new york', 'nyc', 'brooklyn', 'queens', 'manhattan', 'bronx', 'staten island'] },
    { url: 'https://stooplify.com/brooklyn-stoop-sales-this-weekend', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['brooklyn'] },
    { url: 'https://stooplify.com/free-stuff-nyc', priority: '0.9', changefreq: 'daily', states: ['NY'], places: ['new york', 'nyc', 'brooklyn', 'queens', 'manhattan', 'bronx', 'staten island'] },
    { url: 'https://stooplify.com/free-stuff-brooklyn', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['brooklyn'] },
    { url: 'https://stooplify.com/free-stuff-queens', priority: '0.8', changefreq: 'daily', states: ['NY'], places: ['queens'] },
    { url: 'https://stooplify.com/free-stuff-hoboken', priority: '0.7', changefreq: 'daily', states: ['NJ'], places: ['hoboken'] },
    // Nationwide pages — submitted only once there is at least one live sale.
    { url: 'https://stooplify.com/yard-sales-near-me-this-weekend', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/free-items', priority: '0.9', changefreq: 'daily' },
  ];

  let blogPosts = [];
  try {
    blogPosts = await base44.asServiceRole.entities.BlogPost.filter({ status: 'published' });
  } catch (e) {
    console.error('Failed to fetch blog posts:', e.message);
  }

  let yardsales = [];
  try {
    const now = new Date().toISOString().split('T')[0];
    yardsales = await base44.asServiceRole.entities.YardSale.filter({ status: 'approved' });
    // Only include upcoming/today sales with real content
    yardsales = yardsales.filter(s => s.date >= now && s.title && s.city);
  } catch (e) {
    console.error('Failed to fetch yard sales:', e.message);
  }

  const today = new Date().toISOString().split('T')[0];

  const toEntry = (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;

  // A landing page is only worth submitting while a live sale actually matches
  // it. Submitting empty directory pages is what triggers a low-value verdict.
  const landingWithInventory = landingPages.filter((page) => {
    if (!page.states && !page.places) return yardsales.length > 0;
    return yardsales.some((sale) => {
      if (page.states && !page.states.includes((sale.state || '').toUpperCase())) return false;
      if (!page.places) return true;
      const haystack = `${sale.city || ''} ${sale.general_location || ''} ${sale.zip_code || ''}`.toLowerCase();
      return page.places.some((place) => haystack.includes(place));
    });
  });

  const staticEntries = [...staticPages, ...landingWithInventory].map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  // Individual sale pages — only if they have a real detail route
  const saleEntries = yardsales.map(sale => {
    const lastmod = sale.updated_date
      ? new Date(sale.updated_date).toISOString().split('T')[0]
      : today;
    return `  <url>
    <loc>https://stooplify.com/YardSaleDetails?id=${sale.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  const blogEntries = blogPosts.map(post => {
    const lastmod = post.publish_date
      ? new Date(post.publish_date).toISOString().split('T')[0]
      : today;
    return `  <url>
    <loc>https://stooplify.com/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${saleEntries ? saleEntries + '\n' : ''}${blogEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});