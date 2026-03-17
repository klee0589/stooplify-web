import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ADMIN_EMAIL = 'klee0589@gmail.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Called directly from frontend on first login
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`New user signed up: ${user.email}`);

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ADMIN_EMAIL,
      subject: `👤 New User Signed Up: ${user.full_name || user.email}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #14B8FF 0%, #2E3A59 100%); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">👤 New User Signed Up</h1>
          </div>
          <div style="padding: 24px; background: white; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; color: #2E3A59; font-weight: bold;">${user.full_name || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; color: #2E3A59;">${user.email}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Role</td><td style="padding: 8px 0; color: #2E3A59;">${user.role || 'user'}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Signed up</td><td style="padding: 8px 0; color: #2E3A59;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</td></tr>
            </table>
          </div>
        </div>
      `,
    });

    console.log(`Admin notified of new user: ${user.email}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyAdminNewUser error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});