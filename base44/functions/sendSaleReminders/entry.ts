import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    console.log('🔔 Starting sale reminder job...');

    // Get tomorrow's date in YYYY-MM-DD format (ET timezone)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    console.log(`📅 Looking for sales on: ${tomorrowStr}`);

    // Get all approved sales happening tomorrow
    const tomorrowSales = await base44.asServiceRole.entities.YardSale.filter({
      status: 'approved',
      date: tomorrowStr
    });
    console.log(`Found ${tomorrowSales.length} sales tomorrow`);

    if (tomorrowSales.length === 0) {
      return Response.json({ success: true, emailsSent: 0, message: 'No sales tomorrow' });
    }

    const saleIds = tomorrowSales.map(s => s.id);

    // Get all favorites and attendances for these sales
    const [allFavorites, allAttendances] = await Promise.all([
      base44.asServiceRole.entities.Favorite.list(),
      base44.asServiceRole.entities.Attendance.list(),
    ]);

    const relevantFavorites = allFavorites.filter(f => saleIds.includes(f.yard_sale_id));
    const relevantAttendances = allAttendances.filter(a => saleIds.includes(a.yard_sale_id));

    // Build map: userEmail -> Set of sale IDs they care about
    const userSaleMap = {};

    for (const fav of relevantFavorites) {
      if (!userSaleMap[fav.user_email]) userSaleMap[fav.user_email] = new Set();
      userSaleMap[fav.user_email].add(fav.yard_sale_id);
    }
    for (const att of relevantAttendances) {
      if (!userSaleMap[att.user_email]) userSaleMap[att.user_email] = new Set();
      userSaleMap[att.user_email].add(att.yard_sale_id);
    }

    console.log(`Found ${Object.keys(userSaleMap).length} users to notify`);

    const salesById = Object.fromEntries(tomorrowSales.map(s => [s.id, s]));
    const emailsSent = [];

    for (const [userEmail, saleIdSet] of Object.entries(userSaleMap)) {
      const userSales = [...saleIdSet].map(id => salesById[id]).filter(Boolean);
      if (userSales.length === 0) continue;

      const saleCards = userSales.map(sale => {
        const saleUrl = `https://stooplify.com/YardSaleDetails?id=${sale.id}`;
        return `
          <div style="margin-bottom: 20px; padding: 18px; background: #f9f9f9; border-radius: 10px; border-left: 4px solid #FF6F61;">
            <h3 style="margin: 0 0 8px 0; color: #2E3A59; font-size: 16px;">${sale.title}</h3>
            <p style="margin: 0 0 4px 0; color: #555; font-size: 14px;">
              🕐 ${sale.start_time || '8:00 AM'} – ${sale.end_time || '2:00 PM'}
            </p>
            <p style="margin: 0 0 12px 0; color: #555; font-size: 14px;">
              📍 ${sale.general_location || sale.city + ', ' + sale.state}
            </p>
            <a href="${saleUrl}"
               style="display: inline-block; padding: 9px 18px; background: #FF6F61; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              View Sale Details →
            </a>
          </div>
        `;
      }).join('');

      const formattedDate = tomorrow.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
      });

      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
          <div style="background: linear-gradient(135deg, #FF6F61 0%, #F5A623 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🏷️ Your Sales Are Tomorrow!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">${formattedDate}</p>
          </div>

          <div style="padding: 30px; background: white;">
            <p style="font-size: 16px; color: #2E3A59; margin-top: 0;">
              Hey! Just a reminder — you have <strong>${userSales.length} yard sale${userSales.length === 1 ? '' : 's'}</strong> saved for tomorrow. Don't miss out!
            </p>

            ${saleCards}

            <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px; text-align: center;">
              <a href="https://stooplify.com/favorites"
                 style="color: #14B8FF; font-size: 14px; text-decoration: none;">
                View all your saved sales on Stooplify →
              </a>
            </div>
          </div>

          <div style="padding: 16px; text-align: center; background: #f9f9f9;">
            <p style="margin: 0; color: #999; font-size: 12px;">
              You're receiving this because you favorited or marked attendance for these sales.<br>
              <a href="https://stooplify.com/profile" style="color: #14B8FF;">Manage preferences</a>
            </p>
          </div>
        </div>
      `;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: userEmail,
          subject: `⏰ Reminder: ${userSales.length === 1 ? userSales[0].title : `${userSales.length} yard sales`} tomorrow!`,
          body: emailBody,
        });
        emailsSent.push(userEmail);
        console.log(`✅ Sent reminder to ${userEmail} for ${userSales.length} sale(s)`);
      } catch (err) {
        console.error(`❌ Failed to send to ${userEmail}:`, err.message);
      }
    }

    console.log(`✅ Done. Sent ${emailsSent.length} reminder emails.`);
    return Response.json({ success: true, emailsSent: emailsSent.length });

  } catch (error) {
    console.error('❌ Reminder job failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});