import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, listingType } = await req.json();

    if (!priceId || !listingType) {
      return Response.json({ error: 'Missing priceId or listingType' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://stooplify-cba3c5d6.base44.app';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: listingType === 'subscription' ? 'subscription' : 'payment',
      success_url: `${origin}/AddYardSale?payment=success`,
      cancel_url: `${origin}/AddYardSale?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        listing_type: listingType,
      },
    });
    
    console.log('Created checkout session:', session.id);

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});