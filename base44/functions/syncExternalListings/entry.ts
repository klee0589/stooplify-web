import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SOURCES = [
  { url: 'https://www.estatesales.net/NY/New-York', source: 'estatesales.net' },
  { url: 'https://www.yardshoppers.com/yard-sales/new-york-ny', source: 'yardshoppers.com' },
  { url: 'https://classifieds.silive.com/silive/category/garage-sale-estate-sale-auctions/garage-yard-estate-sales', source: 'silive.com' },
  { url: 'https://yardsaletreasuremap.com/US/New-York/New-York-City.html', source: 'yardsaletreasuremap.com' },
];

const LISTING_SCHEMA = {
  type: "object",
  properties: {
    listings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          date: { type: "string", description: "YYYY-MM-DD format" },
          start_time: { type: "string", description: "HH:MM format or human readable" },
          end_time: { type: "string" },
          general_location: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          zip_code: { type: "string" },
          categories: { type: "array", items: { type: "string" } },
          photos: { type: "array", items: { type: "string" } }
        }
      }
    }
  }
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Stooplify/1.0 (daniel@stooplify.com)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });
    const data = await resp.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.log('Geocode failed for:', address, e.message);
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin-only or service-role triggered (scheduled automations run as service role)
    let isAdmin = false;
    try {
      const user = await base44.auth.me();
      isAdmin = user?.role === 'admin';
    } catch (e) {
      // No user context — likely a scheduled automation, allow service-role execution
    }

    const b44 = base44.asServiceRole;
    const allListings: any[] = [];

    // --- Phase 1: Fetch directly-scrapeable sources ---
    for (const source of SOURCES) {
      try {
        console.log(`Fetching ${source.source}...`);
        const resp = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
          },
          signal: AbortSignal.timeout(15000),
        });
        if (!resp.ok) {
          console.log(`  ${source.source} returned ${resp.status}`);
          continue;
        }
        const html = await resp.text();
        const text = stripHtml(html).substring(0, 20000);

        if (text.length < 100) {
          console.log(`  ${source.source} — not enough content`);
          continue;
        }

        console.log(`  Parsing ${source.source} with LLM...`);
        const llmResp = await b44.integrations.Core.InvokeLLM({
          prompt: `You are a data extraction tool. Extract ALL yard sale, garage sale, and estate sale listings from this webpage content. For each listing, extract: title, description (what items are for sale), date (convert to YYYY-MM-DD, if a date range use the first date), start_time, end_time, general_location (neighborhood or cross streets), address (full street address if available), city, state (2-letter code), zip_code, categories (pick from: general, furniture, clothing, electronics, toys, antiques, books, sports, multi-family), and photos (array of image URLs found on the page for that listing). Only include real listings that have at least a title AND a city AND a state. Skip navigation menus, ads, or non-listing content. Webpage content:\n\n${text}`,
          response_json_schema: LISTING_SCHEMA,
        });

        if (llmResp?.listings?.length > 0) {
          console.log(`  Found ${llmResp.listings.length} listings from ${source.source}`);
          allListings.push(...llmResp.listings.map((l: any) => ({ ...l, source: source.source })));
        } else {
          console.log(`  No listings parsed from ${source.source}`);
        }
      } catch (e) {
        console.log(`  Error fetching ${source.source}: ${e.message}`);
      }
    }

    // --- Phase 2: Craigslist via web search (Craigslist blocks direct scraping) ---
    try {
      console.log('Searching web for Craigslist NYC garage sales...');
      const craigslistResp = await b44.integrations.Core.InvokeLLM({
        prompt: "Search the web for current garage sales and yard sales listed on Craigslist in New York City and Brooklyn (craigslist.org). Find actual recent listings with titles, dates, and locations. For each listing extract: title, description, date (YYYY-MM-DD), start_time, end_time, general_location, address, city, state (2-letter), zip_code, categories (from: general, furniture, clothing, electronics, toys, antiques, books, sports, multi-family), and photos. Only include real listings with at least a title, city, and state.",
        add_context_from_internet: true,
        model: "gemini_3_flash",
        response_json_schema: LISTING_SCHEMA,
      });

      if (craigslistResp?.listings?.length > 0) {
        console.log(`Found ${craigslistResp.listings.length} listings from Craigslist web search`);
        allListings.push(...craigslistResp.listings.map((l: any) => ({ ...l, source: 'craigslist' })));
      }
    } catch (e) {
      console.log(`Craigslist web search failed: ${e.message}`);
    }

    if (allListings.length === 0) {
      return Response.json({ message: 'No listings found from any source', found: 0, new: 0, skipped: 0 });
    }

    // --- Phase 3: Dedupe against existing listings ---
    console.log(`Total raw listings found: ${allListings.length}. Checking for duplicates...`);
    const existing = await b44.entities.YardSale.list('-created_date', 500);
    const existingKeys = new Set(
      existing.map((s: any) => `${(s.title || '').toLowerCase().trim()}|${s.date}|${(s.city || '').toLowerCase().trim()}`)
    );

    const newListings = allListings.filter((l: any) => {
      const title = (l.title || '').trim();
      const date = l.date;
      const city = (l.city || '').trim();
      const state = (l.state || '').trim();
      const photos = (l.photos || []).filter((p: string) => p && p.startsWith('http'));
      if (!title || !date || !city || !state) return false;
      if (photos.length === 0) return false;
      if (!listing.address || !listing.address.trim()) return false;
      const key = `${title.toLowerCase()}|${date}|${city.toLowerCase()}`;
      return !existingKeys.has(key);
    });

    console.log(`${newListings.length} new listings after dedup (${allListings.length - newListings.length} duplicates skipped)`);

    if (newListings.length === 0) {
      return Response.json({ found: allListings.length, new: 0, skipped: allListings.length });
    }

    // --- Phase 4: Geocode and prepare records ---
    const prepared = [];
    for (const listing of newListings) {
      let lat: number | null = null;
      let lng: number | null = null;

      const geoQuery = listing.address
        ? `${listing.address}, ${listing.city}, ${listing.state}`
        : `${listing.general_location || listing.city}, ${listing.city}, ${listing.state}`;

      // Nominatim requires 1 req/sec rate limiting
      await new Promise(r => setTimeout(r, 1100));
      const coords = await geocodeAddress(geoQuery);
      if (!coords) {
        // Fallback to city/state only
        await new Promise(r => setTimeout(r, 1100));
        const fallback = await geocodeAddress(`${listing.city}, ${listing.state}`);
        if (fallback) {
          lat = fallback.lat;
          lng = fallback.lng;
        }
      } else {
        lat = coords.lat;
        lng = coords.lng;
      }

      prepared.push({
        title: listing.title,
        description: listing.description || '',
        date: listing.date,
        start_time: listing.start_time || '09:00',
        end_time: listing.end_time || '17:00',
        general_location: listing.general_location || `${listing.city}, ${listing.state}`,
        address: listing.address || '',
        city: listing.city,
        state: listing.state,
        zip_code: listing.zip_code || '',
        latitude: lat,
        longitude: lng,
        categories: listing.categories || ['general'],
        photos: listing.photos || [],
        status: 'approved',
        listing_type: 'free',
        payment_cash: true,
        source: listing.source || 'imported',
        is_imported: true,
      });
    }

    // --- Phase 5: Bulk create ---
    const created = await b44.entities.YardSale.bulkCreate(prepared);
    console.log(`Successfully imported ${prepared.length} listings`);

    return Response.json({
      found: allListings.length,
      new: prepared.length,
      skipped: allListings.length - prepared.length,
      sources: newListings.reduce((acc: any, l: any) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('syncExternalListings error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});