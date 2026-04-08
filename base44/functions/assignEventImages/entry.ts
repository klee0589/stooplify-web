import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Curated Unsplash images by theme
const IMAGES = {
  collectibles: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  comics: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
  vinyl_records: 'https://images.unsplash.com/photo-1601019946742-89dfecff2e18?w=800&q=80',
  jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  antiques: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  vintage_clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  estate_sale: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  auction: 'https://images.unsplash.com/photo-1596887665082-9b24edd20478?w=800&q=80',
  barn_sale: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  patio_furniture: 'https://images.unsplash.com/photo-1558618047-3c8c76ca3e0f?w=800&q=80',
  art: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
  yard_sale: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80',
  coins: 'https://images.unsplash.com/photo-1621777946820-b75bd1b4d9ef?w=800&q=80',
  sports_cards: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80',
  luxury_fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  flea_market: 'https://images.unsplash.com/photo-1518611507436-f9221403cca2?w=800&q=80',
};

function pickImage(title, description, categories) {
  const text = `${title} ${description}`.toLowerCase();
  const cats = (categories || []).join(' ').toLowerCase();

  if (text.includes('comic') || text.includes('betty boop')) return IMAGES.comics;
  if (text.includes('record') || text.includes('vinyl')) return IMAGES.vinyl_records;
  if (text.includes('coin') || text.includes('dollar') || text.includes('currency')) return IMAGES.coins;
  if (text.includes('sports card')) return IMAGES.sports_cards;
  if (text.includes('jewelry') || text.includes('jewellery')) return IMAGES.jewelry;
  if (text.includes('luxury') && (text.includes('fashion') || text.includes('cloth'))) return IMAGES.luxury_fashion;
  if (text.includes('vintage') && (text.includes('cloth') || text.includes('jacket'))) return IMAGES.vintage_clothing;
  if (text.includes('patio') || text.includes('warehouse')) return IMAGES.patio_furniture;
  if (text.includes('barn')) return IMAGES.barn_sale;
  if (text.includes('art') || text.includes('artwork') || text.includes('penthouse')) return IMAGES.art;
  if (text.includes('flea market') || text.includes('craft')) return IMAGES.flea_market;
  if (text.includes('auction')) return IMAGES.auction;
  if (text.includes('antique') || cats.includes('antique')) return IMAGES.antiques;
  if (text.includes('hoarder') || text.includes('memorabilia') || text.includes('collectib')) return IMAGES.collectibles;
  if (cats.includes('furniture') || text.includes('furniture')) return IMAGES.furniture;
  if (cats.includes('sports') || text.includes('memorabilia')) return IMAGES.sports;
  if (cats.includes('books') || text.includes('book')) return IMAGES.books;
  if (cats.includes('clothing') || text.includes('clothing')) return IMAGES.vintage_clothing;
  if (text.includes('estate')) return IMAGES.estate_sale;
  return IMAGES.yard_sale;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const sales = await base44.asServiceRole.entities.YardSale.list();
    let updatedCount = 0;
    let skippedCount = 0;

    for (const sale of sales) {
      // Skip if already has real photos (non-empty array)
      if (sale.photos && sale.photos.length > 0) {
        // Check if it's a stock/placeholder image from garagesalefinder
        const hasStockOnly = sale.photos.every(p => 
          p.includes('sale_default') || p.includes('garagesalefinder')
        );
        if (!hasStockOnly) {
          skippedCount++;
          continue;
        }
      }

      const image = pickImage(sale.title || '', sale.description || '', sale.categories || []);
      await base44.asServiceRole.entities.YardSale.update(sale.id, { photos: [image] });
      console.log(`✅ Set image for "${sale.title}": ${image}`);
      updatedCount++;
    }

    return Response.json({ success: true, updated: updatedCount, skipped: skippedCount });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});