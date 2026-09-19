import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { escapeHtml } from '../../shared/escapeHtml.ts';

const ADMIN_EMAIL = 'klee0589@gmail.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    // Auth check: admin user or valid automation token
    const automationToken = Deno.env.get('AUTOMATION_TOKEN');
    const hasValidToken = !!(automationToken && payload.automation_token && payload.automation_token === automationToken);
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

    const { event, data: saleFromEvent } = payload;

    if (event?.type !== 'create' || !saleFromEvent) {
      return Response.json({ success: true, message: 'Skipped' });
    }

    // Fetch sale from DB to avoid trusting request-controlled data
    let sale;
    try {
      const salesData = await base44.asServiceRole.entities.YardSale.filter({ id: saleFromEvent.id });
      sale = salesData[0];
    } catch (e) {
      console.error('Failed to fetch sale:', e.message);
    }
    if (!sale) {
      return Response.json({ success: true, message: 'Sale not found' });
    }

    console.log(`New sale posted: ${sale.title} (${sale.id})`);

    const reviewUrl = `https://stooplify.com/YardSaleDetails?id=${sale.id}`;
    const categories = (sale.categories || (sale.category ? [sale.category] : [])).filter(Boolean);

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ADMIN_EMAIL,
      subject: `🏷️ New Sale Posted: ${sale.title}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF6F61 0%, #2E3A59 100%); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🏷️ New Sale Posted</h1>
          </div>
          <div style="padding: 24px; background: white;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 120px;">Title</td><td style="padding: 8px 0; color: #2E3A59; font-weight: bold;">${escapeHtml(sale.title)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Date</td><td style="padding: 8px 0; color: #2E3A59;">${escapeHtml(sale.date) || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0; color: #2E3A59;">${escapeHtml(sale.general_location)} ${escapeHtml(sale.city)}, ${escapeHtml(sale.state)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Status</td><td style="padding: 8px 0; color: #2E3A59;">${escapeHtml(sale.status)}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Posted by</td><td style="padding: 8px 0; color: #2E3A59;">${escapeHtml(sale.created_by) || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Categories</td><td style="padding: 8px 0; color: #2E3A59;">${escapeHtml(categories.join(', ')) || '—'}</td></tr>
            </table>
            ${sale.description ? `<p style="margin: 16px 0 0 0; color: #555;">${escapeHtml(sale.description)}</p>` : ''}
          </div>
          <div style="padding: 20px; background: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
            <a href="${reviewUrl}" style="display: inline-block; padding: 12px 28px; background: #14B8FF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Review Sale →
            </a>
          </div>
        </div>
      `,
    });

    console.log(`Admin notified of new sale: ${sale.title}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyAdminNewSale error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});