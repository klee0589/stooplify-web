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

    // Delete all yard sales
    const allSales = await base44.asServiceRole.entities.YardSale.list();
    console.log(`Deleting ${allSales.length} yard sales...`);
    
    for (const sale of allSales) {
      await base44.asServiceRole.entities.YardSale.delete(sale.id);
    }

    // Delete all favorites
    const allFavorites = await base44.asServiceRole.entities.Favorite.list();
    console.log(`Deleting ${allFavorites.length} favorites...`);
    
    for (const fav of allFavorites) {
      await base44.asServiceRole.entities.Favorite.delete(fav.id);
    }

    // Delete all attendances
    const allAttendances = await base44.asServiceRole.entities.Attendance.list();
    console.log(`Deleting ${allAttendances.length} attendances...`);
    
    for (const att of allAttendances) {
      await base44.asServiceRole.entities.Attendance.delete(att.id);
    }

    // Delete all reviews
    const allReviews = await base44.asServiceRole.entities.YardSaleReview.list();
    console.log(`Deleting ${allReviews.length} reviews...`);
    
    for (const review of allReviews) {
      await base44.asServiceRole.entities.YardSaleReview.delete(review.id);
    }

    // Delete all messages
    const allMessages = await base44.asServiceRole.entities.Message.list();
    console.log(`Deleting ${allMessages.length} messages...`);
    
    for (const message of allMessages) {
      await base44.asServiceRole.entities.Message.delete(message.id);
    }

    // Reset all users' free_listings_used to 0
    const allUsers = await base44.asServiceRole.entities.User.list();
    console.log(`Resetting free_listings_used for ${allUsers.length} users...`);
    
    for (const u of allUsers) {
      if (u.free_listings_used > 0) {
        await base44.asServiceRole.entities.User.update(u.id, { free_listings_used: 0 });
      }
    }

    console.log('✅ All test data removed and free listings reset');

    return Response.json({
      success: true,
      deleted: {
        sales: allSales.length,
        favorites: allFavorites.length,
        attendances: allAttendances.length,
        reviews: allReviews.length,
        messages: allMessages.length,
        usersReset: allUsers.filter(u => u.free_listings_used > 0).length
      }
    });
  } catch (error) {
    console.error('Error resetting data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});