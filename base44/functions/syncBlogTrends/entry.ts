import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const SITE = 'sc-domain:stooplify.com';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');
    const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: day(30), endDate: day(2), dimensions: ['page'], rowLimit: 1000,
        dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'contains', expression: '/blog/' }] }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Search Console error', data);
      return Response.json({ error: data.error?.message || 'Search Console request failed' }, { status: 502 });
    }

    const stats = {};
    for (const row of data.rows || []) {
      const slug = new URL(row.keys[0]).pathname.split('/blog/')[1]?.replace(/\/$/, '');
      if (!slug) continue;
      const s = stats[slug] || (stats[slug] = { clicks: 0, impressions: 0 });
      s.clicks += row.clicks;
      s.impressions += row.impressions;
    }

    const posts = await base44.asServiceRole.entities.BlogPost.filter(
      { $or: [{ slug: { $in: Object.keys(stats) } }, { trend_score: { $gt: 0 } }] }, '-publish_date', 1000
    );
    const updates = posts.map((p) => {
      const s = stats[p.slug] || { clicks: 0, impressions: 0 };
      return { id: p.id, search_clicks: s.clicks, search_impressions: s.impressions, trend_score: s.clicks * 10 + s.impressions / 10 };
    });
    for (let i = 0; i < updates.length; i += 500) {
      await base44.asServiceRole.entities.BlogPost.bulkUpdate(updates.slice(i, i + 500));
    }

    const top = [...updates].sort((a, b) => b.trend_score - a.trend_score).slice(0, 5)
      .map((u) => ({ slug: posts.find((p) => p.id === u.id)?.slug, clicks: u.search_clicks }));
    return Response.json({ updated: updates.length, top });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}