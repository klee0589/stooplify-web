import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    
    const { event, data: saleFromEvent } = payload;
    
    // Only process new sales
    if (event.type !== 'create' || !saleFromEvent) {
      return Response.json({ success: true, message: 'Skipped - not a create event' });
    }

    // Fetch the latest sale data from database to avoid race conditions
    console.log(`🔄 Fetching latest data for sale ID: ${saleFromEvent.id}`);
    let sale;
    try {
      const salesData = await base44.asServiceRole.entities.YardSale.filter({ id: saleFromEvent.id });
      sale = salesData[0];
      if (!sale) {
        console.log('⚠️ Sale not found in database yet');
        return Response.json({ success: true, message: 'Sale not yet indexed' });
      }
      console.log(`✓ Sale fetched: status=${sale.status}, categories=${JSON.stringify(sale.categories)}`);
    } catch (fetchError) {
      console.error(`❌ Failed to fetch sale: ${fetchError.message}`);
      return Response.json({ success: true, message: 'Could not fetch sale data' });
    }

    // Only proceed if approved
    if (sale.status !== 'approved') {
      console.log(`⏭️ Skipped - sale status is '${sale.status}' (not approved)`);
      return Response.json({ success: true, message: 'Skipped - not approved yet' });
    }

    console.log(`📧 New sale created: ${sale.title} (${sale.id})`);

    // Get all active alert preferences
    const allAlerts = await base44.asServiceRole.entities.AlertPreference.filter({ is_active: true });
    console.log(`Found ${allAlerts.length} active alerts`);

    // Only send for upcoming sales (not past sales)
    const saleDate = new Date(sale.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight today
    if (saleDate < today) {
      console.log('Skipping - sale date is in the past');
      return Response.json({ success: true, message: 'Skipped - past sale' });
    }

    const emailsSent = [];
    const saleCategories = sale.categories || (sale.category ? [sale.category] : []);
    console.log(`🏷️ Sale Categories: [${saleCategories.join(', ')}]`);

    // Find matching users
    const matchingUsers = new Set();
    allAlerts.forEach(alert => {
      console.log(`🔍 Processing alert ID:${alert.id} | Email:${alert.user_email} | Type:${alert.alert_type} | Value:${alert.value}`);
      let matches = false;
      
      if (alert.alert_type === 'distance') {
        if (!alert.latitude || !alert.longitude || !sale.latitude || !sale.longitude) {
          console.warn(`⚠️ Skipping distance alert for ${alert.user_email} - missing coordinates (alert: ${alert.latitude},${alert.longitude} | sale: ${sale.latitude},${sale.longitude})`);
          return;
        }

        // Haversine formula to calculate distance between two points on a sphere
        const toRadians = (deg) => deg * (Math.PI / 180);
        const R = 6371; // Radius of Earth in kilometers

        const lat1 = toRadians(alert.latitude);
        const lon1 = toRadians(alert.longitude);
        const lat2 = toRadians(sale.latitude);
        const lon2 = toRadians(sale.longitude);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        const distanceMiles = distanceKm * 0.621371; // Convert to miles

        matches = distanceMiles <= parseFloat(alert.value);
        
        if (matches) {
          console.log(`✓ Distance MATCH for ${alert.user_email}: ${distanceMiles.toFixed(2)}mi <= ${alert.value}mi`);
        } else {
          console.log(`✗ Distance NO MATCH for ${alert.user_email}: ${distanceMiles.toFixed(2)}mi > ${alert.value}mi`);
        }
      } else if (alert.alert_type === 'category') {
        matches = saleCategories.includes(alert.value);
        
        if (matches) {
          console.log(`✓ Category MATCH for ${alert.user_email}: '${alert.value}' found in [${saleCategories.join(', ')}]`);
        } else {
          console.log(`✗ Category NO MATCH for ${alert.user_email}: '${alert.value}' NOT in [${saleCategories.join(', ')}]`);
        }
      }
      
      if (matches) {
        console.log(`  → Adding ${alert.user_email} to matching users`);
        matchingUsers.add(alert.user_email);
      }
    });

    console.log(`Found ${matchingUsers.size} total matching users`);

    // Send emails to matching users
    for (const userEmail of matchingUsers) {
      const formattedDate = saleDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });

      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #14B8FF 0%, #2E3A59 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 New Yard Sale Alert!</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 16px; color: #2E3A59; margin-bottom: 20px;">
              A new yard sale matching your preferences was just posted!
            </p>
            
            <div style="padding: 20px; background: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 15px 0; color: #2E3A59;">${sale.title}</h2>
              <p style="margin: 5px 0; color: #666;">
                📅 ${formattedDate} at ${sale.start_time || '8:00 AM'}
              </p>
              <p style="margin: 5px 0; color: #666;">
                📍 ${sale.general_location || sale.city}
              </p>
              ${sale.description ? `<p style="margin: 15px 0 0 0; color: #666;">${sale.description}</p>` : ''}
            </div>

            <div style="text-align: center;">
              <a href="https://stooplify.com/YardSaleDetails?id=${sale.id}" 
                 style="display: inline-block; padding: 15px 30px; background: #14B8FF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                View Sale Details
              </a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <a href="https://stooplify.com/Profile" style="color: #14B8FF; text-decoration: none;">
                  Manage your alert preferences
                </a>
              </p>
            </div>
          </div>

          <div style="padding: 20px; text-align: center; background: #f9f9f9; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              Stooplify - Your neighborhood's best yard sales
            </p>
          </div>
        </div>
      `;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: userEmail,
          subject: `🎉 New Yard Sale: ${sale.title}`,
          body: emailBody,
        });
        
        emailsSent.push(userEmail);
        console.log(`✅ Successfully sent alert email to ${userEmail}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${userEmail}: ${emailError.message}`, emailError.stack);
      }
    }

    console.log(`✅ Completed - Sent ${emailsSent.length} instant alerts`);

    return Response.json({
      success: true,
      emailsSent: emailsSent.length,
      recipients: emailsSent,
    });

  } catch (error) {
    console.error('❌ Instant alert failed:', error.message, error.stack);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});