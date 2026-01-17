import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
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
          user_id: null,
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
        // Sync all Base44 sales to Supabase
        try {
          const sales = await base44.asServiceRole.entities.YardSale.filter({ status: 'approved' });
          console.log(`📊 Found ${sales.length} sales to sync`);

          const listings = sales
            .filter(sale => sale.latitude && sale.longitude) // Only sync sales with coordinates
            .map(sale => {
              const listing = {
                id: sale.id,
                title: sale.title || 'Untitled Sale',
                description: sale.description || '',
                location_lat: parseFloat(sale.latitude),
                location_lng: parseFloat(sale.longitude),
                start_time: `${sale.date}T${sale.start_time || '08:00'}:00`,
                end_time: `${sale.date}T${sale.end_time || '14:00'}:00`,
                photos: Array.isArray(sale.photos) ? sale.photos : [],
                created_at: sale.created_date || new Date().toISOString(),
                updated_at: sale.updated_date || new Date().toISOString(),
              };
              return listing;
            });

          console.log(`📤 Upserting ${listings.length} listings to Supabase...`);
          console.log('Sample listing:', JSON.stringify(listings[0], null, 2));

          // Try inserting one at a time to find the problematic record
          let successCount = 0;
          let failedRecords = [];

          // Test with just the first listing
          const testListing = listings[0];
          console.log('🧪 Testing with first listing:', JSON.stringify(testListing, null, 2));
          
          // Try simple insert first
          const { data: insertData, error: insertError } = await supabase
            .from('listings')
            .insert([testListing])
            .select();

          if (insertError) {
            console.error('❌ Insert test failed:', insertError);
            console.error('Error string:', String(insertError));
            console.error('Error type:', typeof insertError);
            
            // Try to get more info
            try {
              console.error('Error JSON:', JSON.stringify(insertError, Object.getOwnPropertyNames(insertError)));
            } catch (e) {
              console.error('Could not stringify error');
            }
            
            return Response.json({ 
              error: 'Insert test failed', 
              insertError: String(insertError),
              errorKeys: Object.keys(insertError),
              errorProps: Object.getOwnPropertyNames(insertError)
            }, { status: 500 });
          }

          console.log('✅ Insert test succeeded!', insertData);

          for (const listing of listings) {
            const { data, error } = await supabase
              .from('listings')
              .upsert([listing], { onConflict: 'id' })
              .select();

            if (error) {
              console.error(`❌ Failed to upsert ${listing.id}:`, JSON.stringify(error, null, 2));
              failedRecords.push({ 
                id: listing.id, 
                error: error.message || error.code || 'Unknown error',
                details: error.details,
                hint: error.hint
              });
            } else {
              successCount++;
            }
          }

          console.log(`✅ Successfully synced ${successCount}/${listings.length} listings`);
          
          if (failedRecords.length > 0) {
            console.error('Failed records:', failedRecords);
            return Response.json({ 
              success: true, 
              synced: successCount,
              failed: failedRecords.length,
              errors: failedRecords
            }, { status: 200 });
          }

          console.log(`✅ Synced ${data?.length || 0} listings to Supabase`);
          return Response.json({ success: true, synced: data?.length || 0 });
        } catch (err) {
          console.error('❌ Sync exception:', err);
          return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
        }
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Supabase sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});