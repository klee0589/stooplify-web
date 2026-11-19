// Public city / ZIP lookup for the browse page — no login required.
// Resolves "Austin, TX" or "11217" to coordinates so the map can jump there.
const NOMINATIM_HEADERS = { 'User-Agent': 'Stooplify/1.0 (daniel@stooplify.com)' };

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body?.q || '').trim();
    if (query.length < 2) {
      return Response.json({ success: false, results: [] });
    }

    const url =
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}` +
      `&format=jsonv2&addressdetails=1&countrycodes=us&limit=5`;

    const response = await fetch(url, { headers: NOMINATIM_HEADERS });
    if (!response.ok) {
      console.error('Nominatim lookup failed', response.status);
      return Response.json({ success: false, results: [] });
    }

    const data = await response.json();
    const results = (Array.isArray(data) ? data : [])
      .map((row) => {
        const a = row.address || {};
        const city = a.city || a.town || a.village || a.hamlet || a.suburb || a.county || '';
        const state = a.state || '';
        const label = [city || row.name, state].filter(Boolean).join(', ') || row.display_name;
        return {
          label,
          city,
          state,
          zip: a.postcode || '',
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lon),
        };
      })
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));

    return Response.json({ success: true, results });
  } catch (error) {
    console.error('geocodeCity error:', error);
    return Response.json({ success: false, results: [], error: error.message }, { status: 500 });
  }
});