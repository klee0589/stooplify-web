import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_ANON_KEY')
);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Check if this is an automation event or direct API call
    let action, saleId, saleData;
    
    if (body.event) {
      // Automation event format
      console.log('🤖 Automation triggered:', body.event.type);
      action = body.event.type; // 'create', 'update', or 'delete'
      saleId = body.event.entity_id;
      saleData = body.data;
    } else {
      // Direct API call format
      action = body.action;
      saleId = body.saleId;
      saleData = body.saleData;
    }

    console.log(`🔄 Supabase Sync - Action: ${action}, SaleID: ${saleId}`);

    switch (action) {
      case 'create': {
        // Create listing in Supabase
        const listing = {
          id: saleData.id,
          title: saleData.title,
          description: saleData.description,
          location_lat: saleData.latitude,
          location_lng: saleData.longitude,
          start_time: `${saleData.date}T${saleData.start_time || '08:00'}`,
          end_time: `${saleData.date}T${saleData.end_time || '14:00'}`,
          photos: saleData.photos || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user.id,
        };

        const { data, error } = await supabase
          .from('listings')
          .insert([listing])
          .select();

        if (error) {
          console.error('❌ Supabase create error:', error);
          return Response.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ Created in Supabase:', data);
        return Response.json({ success: true, data });
      }

      case 'update': {
        // Update listing in Supabase
        const updateData = {
          title: saleData.title,
          description: saleData.description,
          location_lat: saleData.latitude,
          location_lng: saleData.longitude,
          start_time: `${saleData.date}T${saleData.start_time || '08:00'}`,
          end_time: `${saleData.date}T${saleData.end_time || '14:00'}`,
          photos: saleData.photos || [],
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('listings')
          .update(updateData)
          .eq('id', saleId)
          .select();

        if (error) {
          console.error('❌ Supabase update error:', error);
          return Response.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ Updated in Supabase:', data);
        return Response.json({ success: true, data });
      }

      case 'delete': {
        // Delete listing from Supabase
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', saleId);

        if (error) {
          console.error('❌ Supabase delete error:', error);
          return Response.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ Deleted from Supabase:', saleId);
        return Response.json({ success: true });
      }

      case 'sync_all': {
        // Sync all Base44 sales to Supabase (no user_id for existing sales)
        const sales = await base44.asServiceRole.entities.YardSale.filter({ status: 'approved' });
        console.log(`📊 Syncing ${sales.length} sales to Supabase...`);

        const listings = sales.map(sale => ({
          id: sale.id,
          title: sale.title,
          description: sale.description,
          location_lat: sale.latitude,
          location_lng: sale.longitude,
          start_time: `${sale.date}T${sale.start_time || '08:00'}`,
          end_time: `${sale.date}T${sale.end_time || '14:00'}`,
          photos: sale.photos || [],
          created_at: sale.created_date || new Date().toISOString(),
          updated_at: sale.updated_date || new Date().toISOString(),
          user_id: null, // No user mapping for bulk sync
        }));

        const { data, error } = await supabase
          .from('listings')
          .upsert(listings, { onConflict: 'id' })
          .select();

        if (error) {
          console.error('❌ Supabase sync error:', error);
          return Response.json({ error: error.message }, { status: 500 });
        }

        console.log(`✅ Synced ${data.length} listings to Supabase`);
        return Response.json({ success: true, synced: data.length });
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Supabase sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});