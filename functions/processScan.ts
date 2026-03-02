import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'You must be logged in to scan a QR code.' }, { status: 401 });
    }

    const { yard_sale_id, latitude, longitude } = await req.json();

    if (!yard_sale_id) {
      return Response.json({ error: 'Missing yard_sale_id' }, { status: 400 });
    }

    // Fetch the yard sale
    const sales = await base44.asServiceRole.entities.YardSale.filter({ id: yard_sale_id });
    if (!sales.length) {
      return Response.json({ error: 'Yard sale not found.' }, { status: 404 });
    }
    const sale = sales[0];

    // Prevent sellers from scanning their own QR code
    if (sale.created_by === user.email) {
      return Response.json({ error: 'You cannot scan your own yard sale QR code.' }, { status: 400 });
    }

    // --- Anti-farming: one scan per buyer per yard sale ---
    const existingScans = await base44.asServiceRole.entities.VerifiedScan.filter({
      yard_sale_id,
      scanner_user_email: user.email
    });
    if (existingScans.length > 0) {
      return Response.json({ error: 'You have already scanned this yard sale.', already_scanned: true }, { status: 400 });
    }

    // --- Anti-farming: max 3 scan rewards per day ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allTodayScans = await base44.asServiceRole.entities.VerifiedScan.filter({
      scanner_user_email: user.email
    });
    const todayScans = allTodayScans.filter(s => {
      const scanDate = new Date(s.created_date);
      return scanDate >= today;
    });
    if (todayScans.length >= 3) {
      return Response.json({ 
        error: 'You have reached the maximum of 3 scan rewards per day. Come back tomorrow!',
        daily_limit_reached: true
      }, { status: 400 });
    }

    // --- Geo-validation: buyer must be within 0.5 miles ---
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

    // Credits are only awarded for geo-valid scans
    const creditsToAward = isGeoValid ? 10 : 0;

    // --- Record the scan ---
    const scan = await base44.asServiceRole.entities.VerifiedScan.create({
      yard_sale_id,
      scanner_user_email: user.email,
      seller_user_email: sale.created_by,
      scan_date: new Date().toISOString(),
      latitude: latitude || null,
      longitude: longitude || null,
      is_geo_valid: isGeoValid,
      credits_awarded: creditsToAward
    });

    // --- Award credits to buyer (if geo-valid) ---
    if (creditsToAward > 0) {
      // Get current buyer data
      const buyers = await base44.asServiceRole.entities.User.filter({ email: user.email });
      const buyer = buyers[0];
      const currentCredits = buyer?.credits_balance || 0;
      const newBalance = currentCredits + creditsToAward;

      // Update buyer credits balance
      await base44.asServiceRole.entities.User.update(buyer.id, {
        credits_balance: newBalance
      });

      // Log credit transaction
      await base44.asServiceRole.entities.CreditTransaction.create({
        user_email: user.email,
        amount: creditsToAward,
        type: 'scan_reward',
        related_scan_id: scan.id,
        description: `Scanned QR code at "${sale.title}"`
      });

      // Update member status based on new balance + activity
      const memberStatus = newBalance >= 500 ? 'elite'
        : newBalance >= 250 ? 'gold'
        : newBalance >= 100 ? 'silver'
        : newBalance >= 50 ? 'bronze'
        : 'standard';

      if (memberStatus !== (buyer?.member_status || 'standard')) {
        await base44.asServiceRole.entities.User.update(buyer.id, { member_status: memberStatus });
      }
    }

    // --- Update seller stats ---
    const sellers = await base44.asServiceRole.entities.User.filter({ email: sale.created_by });
    if (sellers.length > 0) {
      const seller = sellers[0];

      // Count all geo-valid scans for this seller
      const allSellerScans = await base44.asServiceRole.entities.VerifiedScan.filter({
        seller_user_email: sale.created_by,
        is_geo_valid: true
      });
      const uniqueScanCount = allSellerScans.length;

      // Count total sales hosted
      const sellerSales = await base44.asServiceRole.entities.YardSale.filter({
        created_by: sale.created_by,
        status: 'approved'
      });
      const totalSalesHosted = sellerSales.length;

      // Count positive reviews (4+ stars) across all sales
      const saleIds = sellerSales.map(s => s.id);
      const allReviews = await base44.asServiceRole.entities.YardSaleReview.list();
      const sellerReviews = allReviews.filter(r => saleIds.includes(r.yard_sale_id));
      const positiveReviews = sellerReviews.filter(r => r.rating >= 4);
      const avgRating = sellerReviews.length > 0
        ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length
        : 0;

      // Days active (since first sale)
      const firstSaleDate = seller.seller_first_sale_date
        ? new Date(seller.seller_first_sale_date)
        : sellerSales.length > 0 ? new Date(Math.min(...sellerSales.map(s => new Date(s.created_date)))) : null;
      const daysActive = firstSaleDate
        ? Math.floor((Date.now() - firstSaleDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Has any fraud reports
      const reports = await base44.asServiceRole.entities.Report.filter({ yard_sale_id: sale.id });
      const hasFraudReports = reports.some(r => r.reason === 'suspicious_listing');

      // Determine seller status
      let newSellerStatus = 'none';
      if (uniqueScanCount >= 25 && totalSalesHosted >= 10 && avgRating >= 4.5 && daysActive >= 60) {
        newSellerStatus = 'community_favorite';
      } else if (uniqueScanCount >= 10 && totalSalesHosted >= 3 && positiveReviews.length >= 3 && daysActive >= 30) {
        newSellerStatus = 'trusted';
      } else if (uniqueScanCount >= 3 && totalSalesHosted >= 1 && !hasFraudReports) {
        newSellerStatus = 'verified';
      }

      await base44.asServiceRole.entities.User.update(seller.id, {
        total_scans_received: uniqueScanCount,
        total_sales_hosted: totalSalesHosted,
        seller_status: newSellerStatus,
        ...(firstSaleDate && !seller.seller_first_sale_date ? { seller_first_sale_date: firstSaleDate.toISOString() } : {})
      });

      console.log(`Seller ${sale.created_by} status updated to: ${newSellerStatus}`);
    }

    return Response.json({
      success: true,
      is_geo_valid: isGeoValid,
      credits_awarded: creditsToAward,
      scan_id: scan.id,
      message: isGeoValid
        ? `🎉 Scan verified! You earned ${creditsToAward} Stooplify credits.`
        : `📍 Scan recorded, but you must be within 0.5 miles to earn credits.`
    });

  } catch (error) {
    console.error('processScan error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});