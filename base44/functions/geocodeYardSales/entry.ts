import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function geocodeWithNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Stooplify/1.0 (daniel@stooplify.com)',
      'Accept': 'application/json'
    }
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('json')) {
    throw new Error(`Unexpected content-type: ${contentType}`);
  }

  const data = await response.json();
  return data;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const sales = await base44.asServiceRole.entities.YardSale.list();
    let geocodedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    const needsGeocode = sales.filter(s => !s.latitude || !s.longitude);
    console.log(`📍 ${needsGeocode.length} sales need geocoding (${sales.length - needsGeocode.length} already done)`);

    for (const sale of needsGeocode) {
      const addressParts = [sale.address, sale.city, sale.state, sale.zip_code].filter(Boolean);
      if (addressParts.length === 0) {
        console.log(`⚠️ Skipping "${sale.title}" - no address`);
        failedCount++;
        continue;
      }

      const query = addressParts.join(', ');
      console.log(`🌍 Geocoding: "${sale.title}" — ${query}`);

      try {
        // Wait before each request to respect Nominatim's 1 req/sec limit
        await new Promise(r => setTimeout(r, 1100));

        const results = await geocodeWithNominatim(query);

        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lng = parseFloat(results[0].lon);
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lngOffset = (Math.random() - 0.5) * 0.02;

          await base44.asServiceRole.entities.YardSale.update(sale.id, {
            exact_latitude: lat,
            exact_longitude: lng,
            latitude: lat + latOffset,
            longitude: lng + lngOffset,
          });

          console.log(`✅ "${sale.title}": ${lat}, ${lng}`);
          geocodedCount++;
        } else {
          // Try with just city/state/zip as fallback
          const fallbackQuery = [sale.city, sale.state, sale.zip_code].filter(Boolean).join(', ');
          if (fallbackQuery !== query) {
            await new Promise(r => setTimeout(r, 1100));
            const fallback = await geocodeWithNominatim(fallbackQuery);
            if (fallback && fallback.length > 0) {
              const lat = parseFloat(fallback[0].lat);
              const lng = parseFloat(fallback[0].lon);
              const latOffset = (Math.random() - 0.5) * 0.02;
              const lngOffset = (Math.random() - 0.5) * 0.02;
              await base44.asServiceRole.entities.YardSale.update(sale.id, {
                exact_latitude: lat,
                exact_longitude: lng,
                latitude: lat + latOffset,
                longitude: lng + lngOffset,
              });
              console.log(`✅ (fallback) "${sale.title}": ${lat}, ${lng}`);
              geocodedCount++;
            } else {
              console.log(`❌ No results for "${sale.title}"`);
              failedCount++;
            }
          } else {
            console.log(`❌ No results for "${sale.title}"`);
            failedCount++;
          }
        }
      } catch (err) {
        console.error(`❌ Error geocoding "${sale.title}":`, err.message);
        failedCount++;
      }
    }

    console.log(`📊 Done: ${geocodedCount} geocoded, ${failedCount} failed, ${skippedCount} skipped`);
    return Response.json({ success: true, geocoded: geocodedCount, failed: failedCount, skipped: skippedCount, total: sales.length });
  } catch (error) {
    console.error('Function error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});