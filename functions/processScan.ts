import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'You must be logged in to scan a QR code.' }, { status: 401 });

    const { yard_sale_id, qr_payload, latitude, longitude } = await req.json();
    if (!yard_sale_id) return Response.json({ error: 'Missing yard_sale_id' }, { status: 400 });

    // --- Validate signed QR token ---
    if (!qr_payload) return Response.json({ error: 'Invalid QR code. No token found.' }, { status: 400 });

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(qr_payload);
    } catch {
      return Response.json({ error: 'Invalid QR code format.' }, { status: 400 });
    }

    const { sale_id: token_sale_id, token, expires_at } = parsedPayload;

    // Verify the QR belongs to the right sale
    if (token_sale_id !== yard_sale_id) {
      return Response.json({ error: 'QR code does not match this sale.' }, { status: 400 });
    }

    // Check expiry (24 hours)
    if (!expires_at || Date.now() > expires_at) {
      return Response.json({ error: 'QR code has expired. Ask the seller to refresh it.' }, { status: 400 });
    }

    // Verify HMAC signature
    const secret = Deno.env.get('QR_TOKEN_SECRET');
    const message = `${token_sale_id}|${expires_at}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const expectedToken = Array.from(new Uint8Array(expectedSigBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    if (token !== expectedToken) {
      console.warn(`Invalid token for sale ${yard_sale_id} by ${user.email}`);
      return Response.json({ error: 'Invalid QR code. Security check failed.' }, { status: 400 });
    }

    // Fetch the yard sale
    const sales = await base44.asServiceRole.entities.YardSale.filter({ id: yard_sale_id });
    if (!sales.length) return Response.json({ error: 'Yard sale not found.' }, { status: 404 });
    const sale = sales[0];

    // Prevent sellers from scanning their own QR code
    if (sale.created_by === user.email) {
      return Response.json({ error: 'You cannot scan your own yard sale QR code.' }, { status: 400 });
    }

    // One scan per buyer per yard sale
    const existingScans = await base44.asServiceRole.entities.VerifiedScan.filter({
      yard_sale_id, scanner_user_email: user.email
    });
    if (existingScans.length > 0) {
      return Response.json({ error: 'You have already scanned this yard sale.', already_scanned: true }, { status: 400 });
    }

    // Max 3 scan rewards per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allTodayScans = await base44.asServiceRole.entities.VerifiedScan.filter({ scanner_user_email: user.email });
    const todayScans = allTodayScans.filter(s => new Date(s.created_date) >= today);
    if (todayScans.length >= 3) {
      return Response.json({
        error: 'You have reached the maximum of 3 scan rewards per day. Come back tomorrow!',
        daily_limit_reached: true
      }, { status: 400 });
    }

    // Geo-validation: buyer must be within 0.5 miles
    let isGeoValid = false;
    if (latitude && longitude && (sale.exact_latitude || sale.latitude) && (sale.exact_longitude || sale.longitude)) {
      const saleLat = sale.exact_latitude || sale.latitude;
      const saleLon = sale.exact_longitude || sale.longitude;
      const R = 3958.8;
      const dLat = (saleLat - latitude) * Math.PI / 180;
      const dLon = (saleLon - longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(latitude * Math.PI / 180) * Math.cos(saleLat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      isGeoValid = distance <= 0.5;
      console.log(`Geo distance: ${distance.toFixed(2)} miles, valid: ${isGeoValid}`);
    }

    const creditsToAward = isGeoValid ? 10 : 0;

    // Record the scan
    const scan = await base44.asServiceRole.entities.VerifiedScan.create({
      yard_sale_id, scanner_user_email: user.email, seller_user_email: sale.created_by,
      scan_date: new Date().toISOString(), latitude: latitude || null, longitude: longitude || null,
      is_geo_valid: isGeoValid, credits_awarded: creditsToAward
    });

    // Award credits to buyer if geo-valid
    if (creditsToAward > 0) {
      const buyers = await base44.asServiceRole.entities.User.filter({ email: user.email });
      const buyer = buyers[0];
      const newBalance = (buyer?.credits_balance || 0) + creditsToAward;
      await base44.asServiceRole.entities.User.update(buyer.id, { credits_balance: newBalance });
      await base44.asServiceRole.entities.CreditTransaction.create({
        user_email: user.email, amount: creditsToAward, type: 'scan_reward',
        related_scan_id: scan.id, description: `Scanned QR code at "${sale.title}"`
      });
      const memberStatus = newBalance >= 500 ? 'elite' : newBalance >= 250 ? 'gold' : newBalance >= 100 ? 'silver' : newBalance >= 50 ? 'bronze' : 'standard';
      if (memberStatus !== (buyer?.member_status || 'standard')) {
        await base44.asServiceRole.entities.User.update(buyer.id, { member_status: memberStatus });
      }
    }

    // Update seller stats
    const sellers = await base44.asServiceRole.entities.User.filter({ email: sale.created_by });
    if (sellers.length > 0) {
      const seller = sellers[0];
      const allSellerScans = await base44.asServiceRole.entities.VerifiedScan.filter({ seller_user_email: sale.created_by, is_geo_valid: true });
      const uniqueScanCount = allSellerScans.length;
      const sellerSales = await base44.asServiceRole.entities.YardSale.filter({ created_by: sale.created_by, status: 'approved' });
      const totalSalesHosted = sellerSales.length;
      const saleIds = sellerSales.map(s => s.id);
      const allReviews = await base44.asServiceRole.entities.YardSaleReview.list();
      const sellerReviews = allReviews.filter(r => saleIds.includes(r.yard_sale_id));
      const positiveReviews = sellerReviews.filter(r => r.rating >= 4);
      const avgRating = sellerReviews.length > 0 ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length : 0;
      const firstSaleDate = seller.seller_first_sale_date ? new Date(seller.seller_first_sale_date)
        : sellerSales.length > 0 ? new Date(Math.min(...sellerSales.map(s => new Date(s.created_date)))) : null;
      const daysActive = firstSaleDate ? Math.floor((Date.now() - firstSaleDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      const reports = await base44.asServiceRole.entities.Report.filter({ yard_sale_id: sale.id });
      const hasFraudReports = reports.some(r => r.reason === 'suspicious_listing');
      let newSellerStatus = 'none';
      if (uniqueScanCount >= 25 && totalSalesHosted >= 10 && avgRating >= 4.5 && daysActive >= 60) newSellerStatus = 'community_favorite';
      else if (uniqueScanCount >= 10 && totalSalesHosted >= 3 && positiveReviews.length >= 3 && daysActive >= 30) newSellerStatus = 'trusted';
      else if (uniqueScanCount >= 3 && totalSalesHosted >= 1 && !hasFraudReports) newSellerStatus = 'verified';
      await base44.asServiceRole.entities.User.update(seller.id, {
        total_scans_received: uniqueScanCount, total_sales_hosted: totalSalesHosted, seller_status: newSellerStatus,
        ...(firstSaleDate && !seller.seller_first_sale_date ? { seller_first_sale_date: firstSaleDate.toISOString() } : {})
      });
    }

    return Response.json({
      success: true, is_geo_valid: isGeoValid, credits_awarded: creditsToAward, scan_id: scan.id,
      message: isGeoValid ? `🎉 Scan verified! You earned ${creditsToAward} Stooplify credits.` : `📍 Scan recorded, but you must be within 0.5 miles to earn credits.`
    });

  } catch (error) {
    console.error('processScan error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});