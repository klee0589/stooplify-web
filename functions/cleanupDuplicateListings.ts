import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('🧹 Starting cleanup of duplicate listings...');

    // Get all yard sales
    const allSales = await base44.asServiceRole.entities.YardSale.list('-updated_date', 1000);
    
    console.log(`📊 Found ${allSales.length} total listings`);

    // Group by supabase_id
    const grouped = {};
    for (const sale of allSales) {
      if (sale.supabase_id) {
        if (!grouped[sale.supabase_id]) {
          grouped[sale.supabase_id] = [];
        }
        grouped[sale.supabase_id].push(sale);
      }
    }

    // Find duplicates and keep only the most recent one
    const toDelete = [];
    for (const [supabaseId, sales] of Object.entries(grouped)) {
      if (sales.length > 1) {
        console.log(`🔍 Found ${sales.length} duplicates for supabase_id: ${supabaseId}`);
        
        // Sort by updated_date descending (most recent first)
        sales.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
        
        // Keep the first one, delete the rest
        const toKeep = sales[0];
        const duplicates = sales.slice(1);
        
        console.log(`✅ Keeping: ${toKeep.id}`);
        console.log(`🗑️ Deleting ${duplicates.length} duplicates`);
        
        toDelete.push(...duplicates);
      }
    }

    // Delete duplicates
    let deleted = 0;
    for (const sale of toDelete) {
      try {
        await base44.asServiceRole.entities.YardSale.delete(sale.id);
        deleted++;
        console.log(`✅ Deleted duplicate: ${sale.id}`);
      } catch (err) {
        console.error(`❌ Error deleting ${sale.id}:`, err);
      }
    }

    console.log(`🎉 Cleanup complete! Deleted ${deleted} duplicate listings`);

    return Response.json({
      success: true,
      totalListings: allSales.length,
      duplicatesFound: toDelete.length,
      duplicatesDeleted: deleted,
      uniqueListings: allSales.length - deleted
    });
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});