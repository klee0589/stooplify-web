import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  const base44 = createClientFromRequest(req);

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.metadata.user_email;
      // Derive listingType from the price, not from client-controlled metadata
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] });
      const priceId = fullSession.line_items?.data?.[0]?.price?.id;
      const PRICE_TO_LISTING_TYPE: Record<string, string> = {
        'price_1Sp0DuEBgBmaTVQE0iSg1m5n': 'subscription',
        'price_1Sp0DuEBgBmaTVQEKO1W2NrG': 'paid',
      };
      const listingType = priceId ? PRICE_TO_LISTING_TYPE[priceId] : undefined;
      if (!listingType) {
        console.log('⚠️ Unknown price in checkout, skipping:', priceId);
        return Response.json({ received: true });
      }

      console.log('Processing checkout for:', userEmail, 'Type:', listingType);

      const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
      
      if (users.length > 0) {
        const user = users[0];
        
        if (listingType === 'subscription') {
          await base44.asServiceRole.entities.User.update(user.id, {
            subscription_active: true,
            subscription_stripe_id: session.subscription,
          });
          console.log('Activated subscription for user:', userEmail);
        } else {
          // Single listing purchase — grant them an extra listing slot by clearing rate limit
          await base44.asServiceRole.entities.User.update(user.id, {
            free_listings_used: 0,
            last_listing_date: null,
          });
          console.log('Granted single listing for user:', userEmail);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      
      const users = await base44.asServiceRole.entities.User.filter({ 
        subscription_stripe_id: subscription.id 
      });
      
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, {
          subscription_active: false,
          subscription_stripe_id: null,
        });
        console.log('Deactivated subscription for user:', users[0].email);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});