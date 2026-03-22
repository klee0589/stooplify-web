import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const staticPages = [
    // Core — indexable pages only (noindex pages excluded)
    { url: 'https://stooplify.com', priority: '1.0', changefreq: 'daily' },
    { url: 'https://stooplify.com/yard-sales', priority: '0.9', changefreq: 'hourly' },
    { url: 'https://stooplify.com/add-yard-sale', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://stooplify.com/Legal', priority: '0.4', changefreq: 'monthly' },
    { url: 'https://stooplify.com/site-map', priority: '0.5', changefreq: 'weekly' },
    // Blog
    { url: 'https://stooplify.com/Blog', priority: '0.8', changefreq: 'daily' },
    // Guides hub + subpages
    { url: 'https://stooplify.com/guides', priority: '0.7', changefreq: 'weekly' },
    { url: 'https://stooplify.com/guides-advertise-yard-sale', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-find-yard-sales', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-permit-requirements-nyc', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-pricing-yard-sale-items', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-seniors-yard-sales', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/guides-best-time-yard-sale', priority: '0.7', changefreq: 'monthly' },
    // Knowledge Hub
    { url: 'https://stooplify.com/what-is-a-stoop-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/stoop-sale-vs-yard-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/how-to-host-a-stoop-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/best-time-for-yard-sales', priority: '0.8', changefreq: 'monthly' },
    // City landing pages
    { url: 'https://stooplify.com/stoop-sales-brooklyn', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-queens', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-manhattan', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-bronx', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-jersey-city', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/garage-sales-los-angeles', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/garage-sales-san-francisco', priority: '0.7', changefreq: 'daily' },
    // Weekend / high-intent search pages
    { url: 'https://stooplify.com/stoop-sales-nyc-this-weekend', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/brooklyn-stoop-sales-this-weekend', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/yard-sales-near-me-this-weekend', priority: '0.9', changefreq: 'daily' },
    // Neighborhood landing pages
    { url: 'https://stooplify.com/stoop-sales-williamsburg-brooklyn', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-park-slope-brooklyn', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-bushwick-brooklyn', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-bed-stuy-brooklyn', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-crown-heights-brooklyn', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-greenpoint-brooklyn', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-astoria-queens', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-upper-west-side-manhattan', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-harlem-manhattan', priority: '0.8', changefreq: 'daily' },
    // Date-based landing pages
    { url: 'https://stooplify.com/yard-sales-near-me-today', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/yard-sales-near-me-saturday', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/yard-sales-near-me-sunday', priority: '0.9', changefreq: 'daily' },
    { url: 'https://stooplify.com/stoop-sales-nyc-today', priority: '0.9', changefreq: 'daily' },
    // Category landing pages
    { url: 'https://stooplify.com/furniture-yard-sales', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/vintage-clothing-stoop-sales', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/book-sales', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/electronics-yard-sales', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/antique-yard-sales', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/toy-yard-sales', priority: '0.7', changefreq: 'daily' },
    // Static SEO article pages
    { url: 'https://stooplify.com/find-stoop-sales-near-you', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/how-to-price-items-stoop-sale', priority: '0.8', changefreq: 'monthly' },
    { url: 'https://stooplify.com/where-to-post-yard-sale-online', priority: '0.8', changefreq: 'monthly' },
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
    // Only include upcoming/today sales
    yardsales = yardsales.filter(s => s.date >= now);
  } catch (e) {
    console.error('Failed to fetch yard sales:', e.message);
  }

  const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const buildSaleSlug = (sale) => {
    const city = slugify(sale.city || sale.state || 'local');
    const hood = slugify((sale.general_location || '').split(',')[0]);
    const id = sale.id.slice(-8);
    return [city, hood, id].filter(Boolean).join('-');
  };

  const today = new Date().toISOString().split('T')[0];

  const staticEntries = staticPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  const saleEntries = yardsales.map(sale => {
    const slug = buildSaleSlug(sale);
    const lastmod = sale.updated_date
      ? new Date(sale.updated_date).toISOString().split('T')[0]
      : today;
    return `  <url>
    <loc>https://stooplify.com/sale/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
${saleEntries}
${blogEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});