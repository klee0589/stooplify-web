import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    // Return only safe-to-expose public config values
    return Response.json({
      googleMapsApiKey: Deno.env.get("GOOGLE_MAPS_API_KEY") || ""
    });
  } catch (error) {
    console.error("getPublicConfig error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});