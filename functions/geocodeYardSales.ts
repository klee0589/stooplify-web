import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Require admin authentication
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    // Fetch all yard sales
    const sales = await base44.asServiceRole.entities.YardSale.list();
    
    let geocodedCount = 0;
    let failedCount = 0;
    
    console.log(`📍 Starting geocoding for ${sales.length} yard sales`);
    
    for (const sale of sales) {
      // Skip if already has coordinates
      if (sale.latitude && sale.longitude) {
        console.log(`⏭️ Skipping ${sale.title} - already has coordinates`);
        continue;
      }
      
      // Build address
      const address = sale.address || sale.general_location;
      if (!address) {
        console.log(`⚠️ Skipping ${sale.title} - no address or location`);
        failedCount++;
        continue;
      }
      
      const query = `${address}, ${sale.city || ''}, ${sale.state || ''} ${sale.zip_code || ''}`;
      
      console.log(`🌍 Geocoding: ${sale.title} - ${query}`);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'Stooplify/1.0' } }
        );
        
        const geoData = await response.json();
        
        if (geoData.length > 0) {
          const exactLat = parseFloat(geoData[0].lat);
          const exactLon = parseFloat(geoData[0].lon);
          
          // Create approximate coordinates (offset by ~0.01 degrees for privacy)
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lonOffset = (Math.random() - 0.5) * 0.02;
          
          const coordinates = {
            exact_latitude: exactLat,
            exact_longitude: exactLon,
            latitude: exactLat + latOffset,
            longitude: exactLon + lonOffset,
          };
          
          console.log(`✅ Found coordinates for ${sale.title}: ${exactLat}, ${exactLon}`);
          
          // Update the sale
          await base44.asServiceRole.entities.YardSale.update(sale.id, coordinates);
          geocodedCount++;
        } else {
          console.log(`❌ No results for ${sale.title}`);
          failedCount++;
        }
        
        // Rate limit: wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Geocoding error for ${sale.title}:`, error.message);
        failedCount++;
      }
    }
    
    console.log(`📊 Geocoding complete: ${geocodedCount} successful, ${failedCount} failed`);
    
    return Response.json({
      success: true,
      geocoded: geocodedCount,
      failed: failedCount,
      total: sales.length
    });
  } catch (error) {
    console.error('Function error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});