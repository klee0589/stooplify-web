import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    if (user.email !== 'klee0589@gmail.com') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const deleteCounts = {
      sales: 0,
      favorites: 0,
      attendances: 0,
      reviews: 0,
      messages: 0
    };

    // Delete all yard sales
    try {
      const allSales = await base44.asServiceRole.entities.YardSale.list();
      console.log(`Deleting ${allSales.length} yard sales...`);
      await Promise.all(allSales.map(sale => 
        base44.asServiceRole.entities.YardSale.delete(sale.id).catch(e => console.error('Delete sale error:', e))
      ));
      deleteCounts.sales = allSales.length;
    } catch (e) {
      console.error('Error deleting sales:', e);
    }

    // Delete all favorites
    try {
      const allFavorites = await base44.asServiceRole.entities.Favorite.list();
      console.log(`Deleting ${allFavorites.length} favorites...`);
      await Promise.all(allFavorites.map(fav => 
        base44.asServiceRole.entities.Favorite.delete(fav.id).catch(e => console.error('Delete favorite error:', e))
      ));
      deleteCounts.favorites = allFavorites.length;
    } catch (e) {
      console.error('Error deleting favorites:', e);
    }

    // Delete all attendances
    try {
      const allAttendances = await base44.asServiceRole.entities.Attendance.list();
      console.log(`Deleting ${allAttendances.length} attendances...`);
      await Promise.all(allAttendances.map(att => 
        base44.asServiceRole.entities.Attendance.delete(att.id).catch(e => console.error('Delete attendance error:', e))
      ));
      deleteCounts.attendances = allAttendances.length;
    } catch (e) {
      console.error('Error deleting attendances:', e);
    }

    // Delete all reviews
    try {
      const allReviews = await base44.asServiceRole.entities.YardSaleReview.list();
      console.log(`Deleting ${allReviews.length} reviews...`);
      await Promise.all(allReviews.map(review => 
        base44.asServiceRole.entities.YardSaleReview.delete(review.id).catch(e => console.error('Delete review error:', e))
      ));
      deleteCounts.reviews = allReviews.length;
    } catch (e) {
      console.error('Error deleting reviews:', e);
    }

    // Delete all messages
    try {
      const allMessages = await base44.asServiceRole.entities.Message.list();
      console.log(`Deleting ${allMessages.length} messages...`);
      await Promise.all(allMessages.map(message => 
        base44.asServiceRole.entities.Message.delete(message.id).catch(e => console.error('Delete message error:', e))
      ));
      deleteCounts.messages = allMessages.length;
    } catch (e) {
      console.error('Error deleting messages:', e);
    }

    console.log('✅ All test data removed');

    return Response.json({
      success: true,
      deleted: deleteCounts,
      note: 'Users can reset their own free_listings_used via the profile menu'
    });
  } catch (error) {
    console.error('Error resetting data:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});