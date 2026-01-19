import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

console.log('🔧 Supabase config check:', { 
  hasUrl: !!supabaseUrl, 
  urlPreview: supabaseUrl?.substring(0, 30),
  hasKey: !!supabaseKey 
});

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This can be called without auth for syncing
    const { since } = await req.json();
    
    console.log('🔄 Pulling updates from Supabase since:', since);

    // Get all listings updated since timestamp
    let query = supabase.from('listings').select('*');
    
    if (since) {
      query = query.gt('updated_at', since);
    }

    const { data: listings, error } = await query;

    if (error) {
      console.error('❌ Supabase pull error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log(`📥 Found ${listings.length} listings to sync`);

    // Convert Supabase listings to Base44 YardSale format
    const updates = [];
    for (const listing of listings) {
      try {
        const saleData = {
          title: listing.title,
          description: listing.description,
          latitude: listing.location_lat,
          longitude: listing.location_lng,
          general_location: listing.general_location || `${listing.city || 'Unknown'}, ${listing.state || 'Unknown'}`,
          city: listing.city || 'Unknown',
          state: listing.state || 'Unknown',
          date: listing.start_time?.split('T')[0],
          start_time: listing.start_time?.split('T')[1]?.substring(0, 5) || '08:00',
          end_time: listing.end_time?.split('T')[1]?.substring(0, 5) || '14:00',
          photos: listing.photos || [],
          status: 'approved',
          updated_date: listing.updated_at,
          supabase_id: listing.id,
        };

        // Check if sale exists in Base44 by supabase_id
        const existingSales = await base44.asServiceRole.entities.YardSale.filter({ supabase_id: listing.id });

        if (existingSales.length > 0) {
          // Update existing
          await base44.asServiceRole.entities.YardSale.update(existingSales[0].id, saleData);
          console.log('✅ Updated:', listing.id);
          updates.push({ action: 'updated', id: listing.id });
        } else {
          // Create new
          await base44.asServiceRole.entities.YardSale.create(saleData);
          console.log('✅ Created:', listing.id);
          updates.push({ action: 'created', id: listing.id });
        }
      } catch (err) {
        console.error('❌ Error processing listing:', listing.id, err);
        updates.push({ action: 'error', id: listing.id, error: err.message });
      }
    }

    return Response.json({ 
      success: true, 
      processed: listings.length,
      updates 
    });
  } catch (error) {
    console.error('❌ Pull updates error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});