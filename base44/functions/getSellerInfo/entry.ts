import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require authentication
    let user;
    try {
      user = await base44.auth.me();
    } catch {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

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
    // Return only public display fields — email is already available via sale.created_by
    return Response.json({
      seller: {
        full_name: seller.full_name,
        email: seller.email,
      }
    });
  } catch (error) {
    console.error('Error fetching seller:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});