import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { sale_id } = await req.json();
    if (!sale_id) return Response.json({ error: 'Missing sale_id' }, { status: 400 });

    // Verify user owns this sale
    const sales = await base44.entities.YardSale.filter({ id: sale_id });
    if (!sales.length) return Response.json({ error: 'Sale not found' }, { status: 404 });
    if (sales[0].created_by !== user.email) {
      return Response.json({ error: 'Unauthorized: not your sale' }, { status: 403 });
    }

    // Generate HMAC-SHA256 signed token valid for 24 hours
    const expires_at = Date.now() + 24 * 60 * 60 * 1000;
    const secret = Deno.env.get('QR_TOKEN_SECRET');
    const message = `${sale_id}|${expires_at}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const token = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    const payload = JSON.stringify({ sale_id, token, expires_at });
    console.log(`QR token generated for sale ${sale_id} by ${user.email}, expires: ${new Date(expires_at).toISOString()}`);
    return Response.json({ payload });
  } catch (error) {
    console.error('generateQRToken error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});