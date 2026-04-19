import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// NYC borough bounding boxes (lat/lon)
const NYC_BOUNDS = {
  south: 40.477399,
  north: 40.917577,
  west: -74.259090,
  east: -73.700272,
};

// NYC ZIP code ranges by borough
const NYC_ZIP_RANGES = [
  [10001, 10282], // Manhattan
  [10301, 10314], // Staten Island
  [10451, 10475], // Bronx
  [11200, 11260], // Brooklyn
  [11300, 11440], // Queens
  [11500, 11700], // Queens (southeast)
];

function isInNYCBounds(lat, lon) {
  return (
    lat >= NYC_BOUNDS.south &&
    lat <= NYC_BOUNDS.north &&
    lon >= NYC_BOUNDS.west &&
    lon <= NYC_BOUNDS.east
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { address, city, state, zip_code } = await req.json();

    // Quick pre-check: if state is explicitly not NY, block immediately
    if (state && state.toUpperCase() !== 'NY' && state.toUpperCase() !== 'NJ') {
      return Response.json({
        success: false,
        outside_nyc: true,
        error: 'Stooplify is currently live in New York City only'
      });
    }

    // Check zip code against NYC ranges (fast pre-check)
    if (zip_code) {
      const zip = parseInt(zip_code);
      const isNYCZip = NYC_ZIP_RANGES.some(([min, max]) => zip >= min && zip <= max);
      // NJ zip codes start from ~07000–08999
      const isNJZip = zip >= 7000 && zip <= 8999;
      if (!isNYCZip && !isNJZip && !isNaN(zip)) {
        return Response.json({
          success: false,
          outside_nyc: true,
          error: 'Stooplify is currently live in New York City only'
        });
      }
    }

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

        // Check if coordinates fall within NYC bounds
        if (!isInNYCBounds(lat, lon)) {
          console.log(`Address outside NYC bounds: ${lat}, ${lon} — query: ${query}`);
          return Response.json({
            success: false,
            outside_nyc: true,
            error: 'Stooplify is currently live in New York City only'
          });
        }

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