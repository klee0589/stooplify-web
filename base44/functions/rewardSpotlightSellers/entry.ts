import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { escapeHtml } from '../../shared/escapeHtml.ts';

const APP_URL = 'https://stooplify.com';
const MAX_SPOTLIGHT = 6;
const MAX_FIRST_TIME = 2;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    // Auth check: admin user or valid automation token
    const automationToken = Deno.env.get('AUTOMATION_TOKEN');
    const hasValidToken = !!(automationToken && body.automation_token && body.automation_token === automationToken);
    if (!hasValidToken) {
      let isAuthorized = false;
      try {
        const user = await base44.auth.me();
        isAuthorized = !!user && user.role === 'admin';
      } catch {}
      if (!isAuthorized) {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Unfeature all currently featured sales (reset for the new week)
    const currentlyFeatured = await base44.asServiceRole.entities.YardSale.filter({ is_featured: true });
    if (currentlyFeatured.length > 0) {
      await base44.asServiceRole.entities.YardSale.bulkUpdate(
        currentlyFeatured.map((s) => ({ id: s.id, is_featured: false }))
      );
    }

    // 2. Get all approved sales
    const allSales = await base44.asServiceRole.entities.YardSale.filter({ status: 'approved' }, '-date', 200);

    // 3. Filter to upcoming sales with at least 1 photo
    const upcomingSales = allSales.filter((s) => {
      if (!s.date) return false;
      return s.date >= todayStr && (s.photos || []).length >= 1;
    });

    if (upcomingSales.length === 0) {
      return Response.json({ success: true, message: 'No qualifying sales', spotlighted: 0 });
    }

    // 4. Count listings per seller (across ALL sales, not just upcoming)
    const sellerPostCount = {};
    allSales.forEach((s) => {
      if (s.created_by) sellerPostCount[s.created_by] = (sellerPostCount[s.created_by] || 0) + 1;
    });

    // 5. Score each sale — first-time sellers get a guaranteed boost as a reward
    const scored = upcomingSales.map((sale) => {
      const photoCount = (sale.photos || []).length;
      const views = sale.views || 0;
      const postHistory = sellerPostCount[sale.created_by] || 1;
      const isFirstTimeSeller = postHistory === 1;

      const photoScore = photoCount === 1 ? 5 : photoCount === 2 ? 12 : 20;
      const viewScore = Math.min(views / 2, 30);
      const historyScore = Math.min((postHistory - 1) * 5, 15);
      const firstTimeBonus = isFirstTimeSeller ? 25 : 0;

      return {
        ...sale,
        _score: photoScore + viewScore + historyScore + firstTimeBonus,
        _isFirstTime: isFirstTimeSeller,
      };
    });

    // 6. Select spotlight sellers: guarantee up to 2 spots for first-time sellers,
    //    fill remaining with highest-scoring listings from repeat sellers
    const firstTimeSellers = scored.filter((s) => s._isFirstTime).sort((a, b) => b._score - a._score);
    const repeatSellers = scored.filter((s) => !s._isFirstTime).sort((a, b) => b._score - a._score);

    const firstTimeSlots = Math.min(firstTimeSellers.length, MAX_FIRST_TIME);
    const selected = [
      ...firstTimeSellers.slice(0, firstTimeSlots),
      ...repeatSellers.slice(0, MAX_SPOTLIGHT - firstTimeSlots),
    ].slice(0, MAX_SPOTLIGHT);

    if (selected.length === 0) {
      return Response.json({ success: true, message: 'No qualifying sales', spotlighted: 0 });
    }

    // 7. Mark selected sales as featured
    await base44.asServiceRole.entities.YardSale.bulkUpdate(
      selected.map((s) => ({ id: s.id, is_featured: true }))
    );

    // 8. Email each spotlighted seller
    const emailResults = [];
    for (const sale of selected) {
      try {
        const sellerName = (sale.created_by || 'there').split('@')[0];
        const saleUrl = `${APP_URL}/YardSaleDetails?id=${sale.id}`;
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: sale.created_by,
          template_name: 'SellerSpotlight',
          variables: {
            first_name: escapeHtml(sellerName),
            sale_title: escapeHtml(sale.title),
            sale_url: saleUrl,
          },
        });
        emailResults.push({ email: sale.created_by, sent: true });
      } catch (e) {
        console.error(`Failed to email ${sale.created_by}:`, e.message);
        emailResults.push({ email: sale.created_by, sent: false, error: e.message });
      }
    }

    console.log(`Spotlight: ${selected.length} sellers featured (${selected.filter((s) => s._isFirstTime).length} first-time)`);

    return Response.json({
      success: true,
      spotlighted: selected.length,
      first_time_sellers: selected.filter((s) => s._isFirstTime).length,
      emails: emailResults,
    });
  } catch (error) {
    console.error('rewardSpotlightSellers error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});