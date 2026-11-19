import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Address lookup for new listings. Anywhere in the United States is accepted.
const NOMINATIM_HEADERS = { 'User-Agent': 'Stooplify/1.0 (daniel@stooplify.com)' };

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { address, city, state, zip_code } = await req.json();

    const queries = [
      [address, city, state, zip_code].filter(Boolean).join(', '),
      [address, city, state].filter(Boolean).join(', '),
      [address, zip_code].filter(Boolean).join(', '),
      [city, state, zip_code].filter(Boolean).join(', '),
      address,
    ].filter((q) => q && q.trim());

    for (const query of queries) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}` +
        `&format=jsonv2&addressdetails=1&countrycodes=us&limit=1`,
        { headers: NOMINATIM_HEADERS }
      );

      if (!response.ok) continue;

      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const addr = data[0].address || {};

        // Small offset so the public pin doesn't reveal the exact house
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lonOffset = (Math.random() - 0.5) * 0.02;

        return Response.json({
          success: true,
          exact_latitude: lat,
          exact_longitude: lon,
          latitude: lat + latOffset,
          longitude: lon + lonOffset,
          display_name: data[0].display_name,
          city: addr.city || addr.town || addr.village || addr.hamlet || city || '',
          state: addr.state || state || '',
        });
      }

      // Small delay to respect rate limits
      await new Promise((r) => setTimeout(r, 300));
    }

    return Response.json({
      success: false,
      error: 'We could not find that address in the United States. Please check the street, city, and ZIP.',
    });
  } catch (error) {
    console.error('Geocode error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});