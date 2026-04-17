import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, id } = await req.json();

    if (!email && !id) {
      return Response.json({ error: 'email or id required' }, { status: 400 });
    }

    let sellers = [];
    if (email) {
      sellers = await base44.asServiceRole.entities.User.filter({ email });
    } else if (id) {
      sellers = await base44.asServiceRole.entities.User.filter({ id });
    }

    if (sellers.length === 0) {
      return Response.json({ seller: null });
    }

    const seller = sellers[0];
    return Response.json({
      seller: {
        email: seller.email,
        full_name: seller.full_name,
        id: seller.id,
        created_date: seller.created_date
      }
    });
  } catch (error) {
    console.error('Error fetching seller:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});