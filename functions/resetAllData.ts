import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();

    if (!user || user.email !== 'klee0589@gmail.com') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const deleteCounts = { sales: 0, favorites: 0, attendances: 0, reviews: 0, messages: 0 };

    const allSales = await base44.asServiceRole.entities.YardSale.list();
    for (const sale of allSales) {
      try { await base44.asServiceRole.entities.YardSale.delete(sale.id); deleteCounts.sales++; } catch (e) {}
    }

    const allFavorites = await base44.asServiceRole.entities.Favorite.list();
    for (const fav of allFavorites) {
      try { await base44.asServiceRole.entities.Favorite.delete(fav.id); deleteCounts.favorites++; } catch (e) {}
    }

    const allAttendances = await base44.asServiceRole.entities.Attendance.list();
    for (const att of allAttendances) {
      try { await base44.asServiceRole.entities.Attendance.delete(att.id); deleteCounts.attendances++; } catch (e) {}
    }

    const allReviews = await base44.asServiceRole.entities.YardSaleReview.list();
    for (const review of allReviews) {
      try { await base44.asServiceRole.entities.YardSaleReview.delete(review.id); deleteCounts.reviews++; } catch (e) {}
    }

    const allMessages = await base44.asServiceRole.entities.Message.list();
    for (const msg of allMessages) {
      try { await base44.asServiceRole.entities.Message.delete(msg.id); deleteCounts.messages++; } catch (e) {}
    }

    return Response.json({ success: true, deleted: deleteCounts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});