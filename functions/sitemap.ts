import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const staticPages = [
    { url: 'https://stooplify.com', priority: '1.0', changefreq: 'daily' },
    { url: 'https://stooplify.com/YardSales', priority: '0.9', changefreq: 'hourly' },
    { url: 'https://stooplify.com/AddYardSale', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://stooplify.com/Blog', priority: '0.8', changefreq: 'daily' },
    { url: 'https://stooplify.com/Guides', priority: '0.7', changefreq: 'weekly' },
    { url: 'https://stooplify.com/GuidesAdvertise', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/GuidesFindSales', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/GuidesPermit', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/GuidesPricing', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/GuidesSeniors', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/GuidesTimings', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://stooplify.com/Calendar', priority: '0.7', changefreq: 'daily' },
    { url: 'https://stooplify.com/Pricing', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://stooplify.com/Legal', priority: '0.4', changefreq: 'monthly' },
  ];

  let blogPosts = [];
  try {
    blogPosts = await base44.asServiceRole.entities.BlogPost.filter({ status: 'published' });
  } catch (e) {
    console.error('Failed to fetch blog posts:', e.message);
  }

  const today = new Date().toISOString().split('T')[0];

  const staticEntries = staticPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  const blogEntries = blogPosts.map(post => {
    const lastmod = post.updated_date
      ? new Date(post.updated_date).toISOString().split('T')[0]
      : (post.publish_date ? new Date(post.publish_date).toISOString().split('T')[0] : today);
    return `  <url>
    <loc>https://stooplify.com/BlogPost?slug=${encodeURIComponent(post.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
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