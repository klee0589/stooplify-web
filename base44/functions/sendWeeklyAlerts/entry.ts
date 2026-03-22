import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This should be called by a scheduled automation (weekly on Friday mornings)
    console.log('🔔 Starting weekly alert job...');

    // Get all active alert preferences
    const allAlerts = await base44.asServiceRole.entities.AlertPreference.filter({ is_active: true });
    console.log(`Found ${allAlerts.length} active alerts`);

    // Get sales from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const allSales = await base44.asServiceRole.entities.YardSale.filter({ status: 'approved' });
    
    const recentSales = allSales.filter(sale => {
      const saleCreated = new Date(sale.created_date);
      return saleCreated >= sevenDaysAgo;
    });
    
    console.log(`Found ${recentSales.length} sales created in the last 7 days`);

    // Group alerts by user email
    const alertsByUser = {};
    allAlerts.forEach(alert => {
      if (!alertsByUser[alert.user_email]) {
        alertsByUser[alert.user_email] = [];
      }
      alertsByUser[alert.user_email].push(alert);
    });

    const emailsSent = [];

    // Process each user
    for (const [userEmail, userAlerts] of Object.entries(alertsByUser)) {
      // Find matching sales for this user
      const matchingSales = recentSales.filter(sale => {
        return userAlerts.some(alert => {
          if (alert.alert_type === 'neighborhood') {
            // Match if city contains the neighborhood name
            return sale.city?.toLowerCase().includes(alert.value.toLowerCase()) ||
                   sale.general_location?.toLowerCase().includes(alert.value.toLowerCase());
          } else if (alert.alert_type === 'category') {
            return sale.category === alert.value;
          }
          return false;
        });
      });

      // Only send email if there are matching sales
      if (matchingSales.length > 0) {
        const upcomingSales = matchingSales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= new Date(); // Only future sales
        });

        if (upcomingSales.length > 0) {
          // Generate email content
          const alertsList = userAlerts
            .map(a => `${a.alert_type === 'neighborhood' ? '📍' : '🏷️'} ${a.value}`)
            .join(', ');

          const salesList = upcomingSales.slice(0, 5).map(sale => {
            const saleDate = new Date(sale.date);
            const formattedDate = saleDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            
            return `
              <div style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                <h3 style="margin: 0 0 8px 0; color: #2E3A59;">${sale.title}</h3>
                <p style="margin: 0; color: #666;">
                  📅 ${formattedDate} at ${sale.start_time || '8:00 AM'}<br>
                  📍 ${sale.general_location || sale.city}
                </p>
                <a href="https://stooplify.com/YardSaleDetails?id=${sale.id}" 
                   style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: #14B8FF; color: white; text-decoration: none; border-radius: 6px;">
                  View Details
                </a>
              </div>
            `;
          }).join('');

          const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #14B8FF 0%, #2E3A59 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">🎉 Your Weekly Yard Sale Alert</h1>
              </div>
              
              <div style="padding: 30px; background: white;">
                <p style="font-size: 16px; color: #2E3A59;">
                  Hey! We found <strong>${upcomingSales.length} new yard sale${upcomingSales.length === 1 ? '' : 's'}</strong> 
                  matching your interests this week.
                </p>
                
                <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                  Your alerts: ${alertsList}
                </p>

                <div style="margin: 30px 0;">
                  ${salesList}
                </div>

                ${upcomingSales.length > 5 ? `
                  <p style="text-align: center; color: #666;">
                    ...and ${upcomingSales.length - 5} more! 
                    <a href="https://stooplify.com/YardSales" style="color: #14B8FF;">View all</a>
                  </p>
                ` : ''}

                <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; text-align: center;">
                  <p style="margin: 0 0 15px 0; color: #2E3A59;">
                    <strong>Don't want these emails?</strong>
                  </p>
                  <a href="https://stooplify.com/Profile" 
                     style="color: #14B8FF; text-decoration: none;">
                    Manage your alert preferences
                  </a>
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
              subject: `🎉 ${upcomingSales.length} new yard sale${upcomingSales.length === 1 ? '' : 's'} this week!`,
              body: emailBody,
            });

            emailsSent.push(userEmail);
            console.log(`✅ Sent alert to ${userEmail} with ${upcomingSales.length} sales`);
          } catch (emailError) {
            console.error(`❌ Failed to send email to ${userEmail}:`, emailError.message);
          }
        }
      }
    }

    console.log(`✅ Job complete. Sent ${emailsSent.length} emails.`);

    return Response.json({
      success: true,
      emailsSent: emailsSent.length,
      alertsProcessed: allAlerts.length,
      salesFound: recentSales.length,
    });

  } catch (error) {
    console.error('❌ Alert job failed:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});