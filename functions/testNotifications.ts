import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const results = {
            email: null,
            sms: null
        };

        // Test Email
        if (user.notification_enabled !== false && user.notification_email !== false) {
            try {
                await base44.integrations.Core.SendEmail({
                    to: user.email,
                    subject: '🎉 Test Notification - Stooplify',
                    body: `
                        <h2>Test Email Notification</h2>
                        <p>Hi ${user.full_name || 'there'}!</p>
                        <p>This is a test email from Stooplify. If you're receiving this, your email notifications are working perfectly!</p>
                        <p>You can manage your notification preferences in your profile settings.</p>
                        <br>
                        <p>Happy treasure hunting!</p>
                        <p>- The Stooplify Team</p>
                    `
                });
                results.email = { status: 'success', message: 'Test email sent successfully' };
            } catch (error) {
                results.email = { status: 'error', message: error.message };
            }
        } else {
            results.email = { status: 'skipped', message: 'Email notifications are disabled' };
        }

        // Test SMS
        if (user.notification_enabled !== false && user.notification_sms && user.phone) {
            results.sms = { 
                status: 'info', 
                message: 'SMS service not yet configured. Would need Twilio or similar service setup.' 
            };
        } else if (!user.phone) {
            results.sms = { status: 'skipped', message: 'No phone number set' };
        } else {
            results.sms = { status: 'skipped', message: 'SMS notifications are disabled' };
        }

        return Response.json({
            success: true,
            results,
            message: 'Test notifications completed'
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});