import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.metadata.user_email;
      const listingType = session.metadata.listing_type;

      console.log('Payment completed for:', userEmail, 'Type:', listingType);

      // Get user
      const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
      if (users.length === 0) {
        console.error('User not found:', userEmail);
        return Response.json({ error: 'User not found' }, { status: 404 });
      }

      const user = users[0];

      if (listingType === 'subscription') {
        // Activate subscription for 30 days
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await base44.asServiceRole.entities.User.update(user.id, {
          subscription_active: true,
          subscription_end_date: endDate.toISOString(),
        });

        console.log('Subscription activated for user:', userEmail);
      } else {
        // Single listing - increment free_listings_used to allow one more listing
        await base44.asServiceRole.entities.User.update(user.id, {
          free_listings_used: (user.free_listings_used || 0) - 1,
        });

        console.log('Single listing credit added for user:', userEmail);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const session = await stripe.checkout.sessions.list({
        subscription: subscription.id,
        limit: 1,
      });

      if (session.data.length > 0) {
        const userEmail = session.data[0].metadata.user_email;
        const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });

        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_active: false,
          });

          console.log('Subscription cancelled for user:', userEmail);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});