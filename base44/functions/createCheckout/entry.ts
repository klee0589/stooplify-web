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

    const { priceId, returnToPhotos } = await req.json();

    if (!priceId) {
      console.log('🔴 Missing priceId');
      return Response.json({ error: 'Missing priceId' }, { status: 400 });
    }

    // Server-side price validation — derive listingType from the priceId, never trust client input
    const PRICE_TO_LISTING_TYPE: Record<string, string> = {
      'price_1Sp0DuEBgBmaTVQE0iSg1m5n': 'subscription',
      'price_1Sp0DuEBgBmaTVQEKO1W2NrG': 'paid',
    };
    const listingType = PRICE_TO_LISTING_TYPE[priceId];
    if (!listingType) {
      console.log('🔴 Invalid priceId');
      return Response.json({ error: 'Invalid price' }, { status: 400 });
    }
    console.log('🟢 Request parsed:', { priceId, listingType, returnToPhotos });

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
      success_url: returnToPhotos
        ? `${baseUrl}/add-yard-sale?payment=success&step=3&type=${listingType}&session_id={CHECKOUT_SESSION_ID}`
        : `${baseUrl}/Profile?payment=success&type=${listingType}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/add-yard-sale?payment=cancelled&step=3`,
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