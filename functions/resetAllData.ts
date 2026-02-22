import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    console.log('Reset function called');
    const user = await base44.auth.me();
    console.log('User:', user?.email);

    if (!user || user.role !== 'admin') {
      console.log('Unauthorized attempt by:', user?.email);
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const deleteCounts = { sales: 0, favorites: 0, attendances: 0, reviews: 0, messages: 0 };

    console.log('Starting deletion...');
    
    const allSales = await base44.asServiceRole.entities.YardSale.list();
    console.log('Found sales:', allSales.length);
    for (const sale of allSales) {
      try { 
        await base44.asServiceRole.entities.YardSale.delete(sale.id); 
        deleteCounts.sales++; 
      } catch (e) {
        console.error('Failed to delete sale:', e.message);
      }
    }

    const allFavorites = await base44.asServiceRole.entities.Favorite.list();
    console.log('Found favorites:', allFavorites.length);
    for (const fav of allFavorites) {
      try { 
        await base44.asServiceRole.entities.Favorite.delete(fav.id); 
        deleteCounts.favorites++; 
      } catch (e) {
        console.error('Failed to delete favorite:', e.message);
      }
    }

    const allAttendances = await base44.asServiceRole.entities.Attendance.list();
    console.log('Found attendances:', allAttendances.length);
    for (const att of allAttendances) {
      try { 
        await base44.asServiceRole.entities.Attendance.delete(att.id); 
        deleteCounts.attendances++; 
      } catch (e) {
        console.error('Failed to delete attendance:', e.message);
      }
    }

    const allReviews = await base44.asServiceRole.entities.YardSaleReview.list();
    console.log('Found reviews:', allReviews.length);
    for (const review of allReviews) {
      try { 
        await base44.asServiceRole.entities.YardSaleReview.delete(review.id); 
        deleteCounts.reviews++; 
      } catch (e) {
        console.error('Failed to delete review:', e.message);
      }
    }

    const allMessages = await base44.asServiceRole.entities.Message.list();
    console.log('Found messages:', allMessages.length);
    for (const msg of allMessages) {
      try { 
        await base44.asServiceRole.entities.Message.delete(msg.id); 
        deleteCounts.messages++; 
      } catch (e) {
        console.error('Failed to delete message:', e.message);
      }
    }

    console.log('Deletion complete:', deleteCounts);
    return Response.json({ success: true, deleted: deleteCounts });
  } catch (error) {
    console.error('Reset function error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});