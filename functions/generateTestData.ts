import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const cities = [
      { city: 'Brooklyn', state: 'NY', locations: ['Near Bedford Ave & N 7th St', 'Near Prospect Park', 'Williamsburg Area'] },
      { city: 'Queens', state: 'NY', locations: ['Astoria', 'Flushing Area', 'Long Island City'] },
      { city: 'Manhattan', state: 'NY', locations: ['Upper West Side', 'East Village', 'Chelsea'] },
    ];

    const titles = [
      'Big Family Yard Sale', 'Moving Sale - Everything Must Go', 'Estate Sale', 
      'Multi-Family Garage Sale', 'Spring Cleaning Sale', 'Vintage Finds Sale',
      'Kids Toys & Clothes Sale', 'Furniture Sale', 'Book Lovers Sale',
      'Electronics & Tech Sale', 'Antique Treasures Sale', 'Home Decor Sale',
      'Sports Equipment Sale', 'Designer Clothes Sale', 'Collectibles Sale'
    ];

    const descriptions = [
      'Great items at amazing prices! Furniture, clothes, toys, and more.',
      'Downsizing and need to sell everything. High quality items, excellent condition.',
      'Lots of vintage and antique items. Don\'t miss out!',
      'Several families joining together for one big sale. Something for everyone!',
      'Kids clothes, toys, books, and baby items. All in great condition.',
      'Quality furniture and home decor. Some pieces are vintage!',
      'Electronics, gadgets, and tech accessories. All working perfectly.',
      'Designer and brand name clothing at fraction of retail prices.',
    ];

    const categories = ['general', 'furniture', 'clothing', 'electronics', 'toys', 'antiques', 'books', 'sports'];

    const sales = [];
    const now = new Date('2026-02-16T10:00:00');

    // Generate past sales (days -14 to -1)
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 14) + 1;
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() - daysAgo);
      
      const cityData = cities[Math.floor(Math.random() * cities.length)];
      const location = cityData.locations[Math.floor(Math.random() * cityData.locations.length)];
      
      sales.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: saleDate.toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '14:00',
        general_location: location,
        address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
        city: cityData.city,
        state: cityData.state,
        zip_code: '11201',
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -73.935242 + (Math.random() - 0.5) * 0.1,
        exact_latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        exact_longitude: -73.935242 + (Math.random() - 0.5) * 0.1,
        categories: [categories[Math.floor(Math.random() * categories.length)]],
        status: 'approved',
        views: Math.floor(Math.random() * 100),
        payment_cash: true,
        payment_card: Math.random() > 0.5,
        payment_digital: Math.random() > 0.5,
        cash_preferred: Math.random() > 0.7,
      });
    }

    // Generate current sales (today, happening now)
    for (let i = 0; i < 5; i++) {
      const cityData = cities[Math.floor(Math.random() * cities.length)];
      const location = cityData.locations[Math.floor(Math.random() * cityData.locations.length)];
      
      sales.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: '2026-02-16',
        start_time: '08:00',
        end_time: '16:00',
        general_location: location,
        address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
        city: cityData.city,
        state: cityData.state,
        zip_code: '11201',
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -73.935242 + (Math.random() - 0.5) * 0.1,
        exact_latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        exact_longitude: -73.935242 + (Math.random() - 0.5) * 0.1,
        categories: [categories[Math.floor(Math.random() * categories.length)]],
        status: 'approved',
        views: Math.floor(Math.random() * 50) + 20,
        payment_cash: true,
        payment_card: Math.random() > 0.5,
        payment_digital: Math.random() > 0.5,
        cash_preferred: Math.random() > 0.7,
      });
    }

    // Generate upcoming sales (days +1 to +30)
    for (let i = 0; i < 30; i++) {
      const daysAhead = Math.floor(Math.random() * 30) + 1;
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() + daysAhead);
      
      const cityData = cities[Math.floor(Math.random() * cities.length)];
      const location = cityData.locations[Math.floor(Math.random() * cityData.locations.length)];
      
      const startHour = Math.random() > 0.5 ? '08:00' : '09:00';
      const endHour = Math.random() > 0.5 ? '14:00' : '15:00';
      
      sales.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: saleDate.toISOString().split('T')[0],
        start_time: startHour,
        end_time: endHour,
        general_location: location,
        address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
        city: cityData.city,
        state: cityData.state,
        zip_code: '11201',
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -73.935242 + (Math.random() - 0.5) * 0.1,
        exact_latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        exact_longitude: -73.935242 + (Math.random() - 0.5) * 0.1,
        categories: [categories[Math.floor(Math.random() * categories.length)]],
        status: 'approved',
        views: Math.floor(Math.random() * 30),
        payment_cash: true,
        payment_card: Math.random() > 0.5,
        payment_digital: Math.random() > 0.5,
        cash_preferred: Math.random() > 0.7,
      });
    }

    // Create all sales
    const created = await base44.asServiceRole.entities.YardSale.bulkCreate(sales);

    return Response.json({ 
      success: true, 
      count: created.length,
      breakdown: {
        past: 15,
        current: 5,
        upcoming: 30
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});