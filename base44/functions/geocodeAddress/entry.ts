import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { address, city, state, zip_code } = await req.json();

    const queries = [
      `${address}, ${city}, ${state} ${zip_code}`,
      `${address}, ${city}, ${state}`,
      `${address}, ${zip_code}`,
      `${address}`
    ].filter(q => q.trim());

    for (const query of queries) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'Stooplify/1.0 (daniel@stooplify.com)' } }
      );

      if (!response.ok) continue;

      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lonOffset = (Math.random() - 0.5) * 0.02;

        return Response.json({
          success: true,
          exact_latitude: lat,
          exact_longitude: lon,
          latitude: lat + latOffset,
          longitude: lon + lonOffset,
          display_name: data[0].display_name
        });
      }

      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 300));
    }

    return Response.json({ success: false, error: 'Address not found' });
  } catch (error) {
    console.error('Geocode error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});