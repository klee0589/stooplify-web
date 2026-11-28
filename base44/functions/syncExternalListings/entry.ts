import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Local pages run every time: this is where most of the traffic is.
const LOCAL_SOURCES = [
  { url: 'https://www.estatesales.net/NY/New-York', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/NJ/Jersey-City', source: 'estatesales.net' },
  { url: 'https://classifieds.silive.com/silive/category/garage-sale-estate-sale-auctions/garage-yard-estate-sales', source: 'silive.com' },
  { url: 'https://yardsaletreasuremap.com/US/New-York/New-York-City.html', source: 'yardsaletreasuremap.com' },
];

// The site covers the whole country, so each run also sweeps a rotating slice of
// metros. Six at a time keeps the run inside the function timeout while still
// covering every region within a few days.
const NATIONAL_SOURCES = [
  { url: 'https://www.estatesales.net/CA/Los-Angeles', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/CA/San-Francisco', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/TX/Houston', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/TX/Dallas', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/FL/Miami', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/FL/Tampa', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/IL/Chicago', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/PA/Philadelphia', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/MA/Boston', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/GA/Atlanta', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/AZ/Phoenix', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/WA/Seattle', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/CO/Denver', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/MI/Detroit', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/NC/Charlotte', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/OH/Columbus', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/TN/Nashville', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/DC/Washington', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/MD/Baltimore', source: 'estatesales.net' },
  { url: 'https://www.estatesales.net/MN/Minneapolis', source: 'estatesales.net' },
];

const NATIONAL_PER_RUN = 6;
const rotationStart = Math.floor(Date.now() / 86400000) % NATIONAL_SOURCES.length;
const rotatingSources = Array.from({ length: NATIONAL_PER_RUN }, (_, i) =>
  NATIONAL_SOURCES[(rotationStart + i) % NATIONAL_SOURCES.length]
);
const SOURCES = [...LOCAL_SOURCES, ...rotatingSources];

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
          photos: { type: "array", items: { type: "string" } },
          photo_indices: { type: "array", items: { type: "number" } }
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

// Scraped pages carry real listing photos in their markup. Pull them out before
// stripping tags so every imported listing can show a real image.
const IMAGE_SKIP = /logo|icon|sprite|favicon|placeholder|avatar|tutorial|app-route|badge|\.svg|thumb|150x150/i;

function extractImages(html: string): string[] {
  const found: string[] = [];
  const push = (raw: string) => {
    if (!raw) return;
    let url = raw.trim().replace(/&amp;/g, '&');
    if (url.startsWith('//')) url = 'https:' + url;
    if (!/^https?:\/\//i.test(url)) return;
    if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url)) return;
    if (IMAGE_SKIP.test(url)) return;
    if (!found.includes(url)) found.push(url);
  };
  // <img> tags in document order, which is the order the sale cards appear in
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    push(m[0].match(/\bsrc=["']([^"']+)["']/i)?.[1] || '');
  }
  // Some sources keep photos in inline styles or embedded data
  for (const m of html.matchAll(/https?:\/\/[^"'\s)\\]+\.(?:jpe?g|png|webp)(?:\?[^"'\s)\\]*)?/gi)) {
    push(m[0]);
  }
  return found.slice(0, 60);
}

// Turn the IMAGE numbers the model picked into real photo URLs.
function pickPhotos(listing: any): string[] {
  const images: string[] = listing._images || [];
  const out: string[] = [];
  for (const idx of listing.photo_indices || []) {
    const url = images[Number(idx)];
    if (url && !out.includes(url)) out.push(url);
  }
  for (const url of listing.photos || []) {
    if (typeof url === 'string' && /^https?:\/\//.test(url) && !out.includes(url)) out.push(url);
  }
  return out.slice(0, 5);
}

// Scraped dates arrive in mixed formats; the site compares ISO strings.
function normalizeDate(raw: string): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  return null;
}

// These sources usually print "November 27" with no year, so the extraction
// guesses a year and lands in the past. Roll the month/day forward instead.
function resolveUpcomingDate(raw: string): string | null {
  const iso = normalizeDate(raw);
  if (!iso) return null;
  const today = new Date().toISOString().split('T')[0];
  if (iso >= today) return iso;
  const monthDay = iso.slice(5);
  const year = new Date().getFullYear();
  // Reject anything more than 90 days out: a sale a year away is stale source
  // data, not an upcoming event.
  const horizon = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  for (const y of [year, year + 1]) {
    const candidate = `${y}-${monthDay}`;
    if (candidate >= today && candidate <= horizon) return candidate;
  }
  return null;
}

// Most imported sales share a city, so caching the lookups keeps a batch well
// inside the function timeout and lets more listings land per run.
const geocodeCache = new Map<string, { lat: number, lng: number } | null>();

async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
  const key = address.toLowerCase().trim();
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;
  let result: {lat: number, lng: number} | null = null;
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
      result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.log('Geocode failed for:', address, e.message);
  }
  geocodeCache.set(key, result);
  return result;
}

// Nominatim allows one request per second; cached lookups don't need the wait.
async function geocodeThrottled(query: string) {
  if (!geocodeCache.has(query.toLowerCase().trim())) {
    await new Promise(r => setTimeout(r, 1100));
  }
  return await geocodeAddress(query);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth check: admin user or valid automation token
    const body = await req.json().catch(() => ({}));
    const automationToken = Deno.env.get('AUTOMATION_TOKEN');
    const hasValidToken = !!(automationToken && body.automation_token && body.automation_token === automationToken);
    if (!hasValidToken) {
      let isAuthorized = false;
      try {
        const user = await base44.auth.me();
        isAuthorized = !!user && user.role === 'admin';
      } catch {}
      if (!isAuthorized) {
        return Response.json({ error: 'Unauthorized' }, { status: 403 });
      }
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
        const images = extractImages(html);
        console.log(`  Found ${images.length} candidate photos on ${source.source}`);
        const text = stripHtml(html).substring(0, 20000);

        if (text.length < 100) {
          console.log(`  ${source.source} — not enough content`);
          continue;
        }

        console.log(`  Parsing ${source.source} with LLM...`);
        const llmResp = await b44.integrations.Core.InvokeLLM({
          prompt: `You are a data extraction tool. Extract ALL yard sale, garage sale, and estate sale listings from this webpage content. For each listing, extract: title, description (what items are for sale), date (convert to YYYY-MM-DD, if a date range use the first date), start_time, end_time, general_location (neighborhood or cross streets), address (full street address if available), city, state (2-letter code), zip_code, categories (pick from: general, furniture, clothing, electronics, toys, antiques, books, sports, multi-family), and photo_indices (the IMAGE numbers below that belong to that listing, best photo first, at most 3). The IMAGE list is in page order, matching the order the sales appear, so assign each sale its own photos. Only include real listings that have at least a title AND a city AND a state. Skip navigation menus, ads, or non-listing content.${images.length ? `\n\nAVAILABLE IMAGES:\n${images.map((u, i) => `IMAGE ${i}: ${u}`).join('\n')}` : ''}\n\nWebpage content:\n\n${text}`,
          response_json_schema: LISTING_SCHEMA,
        });

        if (llmResp?.listings?.length > 0) {
          console.log(`  Found ${llmResp.listings.length} listings from ${source.source}`);
          allListings.push(...llmResp.listings.map((l: any) => ({ ...l, source: source.source, _images: images })));
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

    const today = new Date().toISOString().split('T')[0];
    // Several source pages overlap, so the same sale can arrive twice in one run.
    const seenKeys = new Set<string>();
    const newListings = allListings.filter((l: any) => {
      const title = (l.title || '').trim();
      const city = (l.city || '').trim();
      const state = (l.state || '').trim();
      const date = resolveUpcomingDate(l.date);
      // Online-only auctions are not local sales and read as junk listings.
      if (/online|shipping only/i.test(title)) {
        console.log(`  skip online-only: ${title}`);
        return false;
      }
      if (!title || !date || !city || !state) {
        console.log(`  skip incomplete: ${JSON.stringify({ title, date: l.date, city, state })}`);
        return false;
      }
      if (date < today) {
        console.log(`  skip past date: ${date} — ${title}`);
        return false;
      }
      const key = `${title.toLowerCase()}|${date}|${city.toLowerCase()}`;
      if (existingKeys.has(key) || seenKeys.has(key)) {
        console.log(`  skip duplicate: ${key}`);
        return false;
      }
      seenKeys.add(key);
      l.date = date;
      return true;
    });

    console.log(`${newListings.length} new listings after dedup (${allListings.length - newListings.length} duplicates skipped)`);

    // --- Backfill: a listing imported before photos were captured still needs them ---
    const existingByKey = new Map(
      existing.map((s: any) => [`${(s.title || '').toLowerCase().trim()}|${s.date}|${(s.city || '').toLowerCase().trim()}`, s])
    );
    const photoUpdates: any[] = [];
    const photoUpdateIds = new Set<string>();
    for (const l of allListings) {
      const date = resolveUpcomingDate(l.date);
      if (!date) continue;
      const key = `${(l.title || '').toLowerCase().trim()}|${date}|${(l.city || '').toLowerCase().trim()}`;
      const record: any = existingByKey.get(key);
      if (!record || photoUpdateIds.has(record.id)) continue;
      const photos = pickPhotos(l);
      if (photos.length > 0 && !(record.photos || []).length) {
        photoUpdateIds.add(record.id);
        photoUpdates.push({ id: record.id, photos });
      }
    }
    if (photoUpdates.length > 0) {
      await b44.entities.YardSale.bulkUpdate(photoUpdates);
      console.log(`Added photos to ${photoUpdates.length} existing listings`);
    }

    if (newListings.length === 0) {
      return Response.json({ found: allListings.length, new: 0, skipped: allListings.length });
    }

    // --- Phase 4: Geocode and prepare records ---
    // Nominatim allows one request per second, so a large batch would time out.
    // The daily workflow keeps running, so a capped batch still fills the site.
    const MAX_PER_RUN = 40;
    const prepared = [];
    for (const listing of newListings.slice(0, MAX_PER_RUN)) {
      let lat: number | null = null;
      let lng: number | null = null;

      const geoQuery = listing.address
        ? `${listing.address}, ${listing.city}, ${listing.state}`
        : `${listing.general_location || listing.city}, ${listing.city}, ${listing.state}`;

      const coords = await geocodeThrottled(geoQuery);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      } else {
        // Fall back to city/state only
        const fallback = await geocodeThrottled(`${listing.city}, ${listing.state}`);
        if (fallback) {
          lat = fallback.lat;
          lng = fallback.lng;
        }
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
        photos: pickPhotos(listing),
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