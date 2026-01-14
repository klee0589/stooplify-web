import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    console.log('🟢 Checkout function started');
    
    const base44 = createClientFromRequest(req);
    console.log('🟢 Base44 client created');
    
    const user = await base44.auth.me();
    console.log('🟢 User authenticated:', user?.email);

    if (!user) {
      console.log('🔴 No user found');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, listingType } = await req.json();
    console.log('🟢 Request parsed:', { priceId, listingType });

    if (!priceId || !listingType) {
      console.log('🔴 Missing params');
      return Response.json({ error: 'Missing priceId or listingType' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://stooplify-cba3c5d6.base44.app';
    const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;
    console.log('🟢 Origin:', baseUrl);
    
    console.log('🟢 Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: listingType === 'subscription' ? 'subscription' : 'payment',
      success_url: `${baseUrl}/AddYardSale?payment=success`,
      cancel_url: `${baseUrl}/AddYardSale?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        listing_type: listingType,
      },
    });
    
    console.log('🟢 Stripe session created:', session.id);
    console.log('🟢 Session URL:', session.url);

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('🔴 Checkout error:', error);
    console.error('🔴 Error message:', error?.message);
    console.error('🔴 Error stack:', error?.stack);
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
});