import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This function returns only public seller info, but still requires the caller to be authenticated
    const caller = await base44.auth.me();
    if (!caller) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const { email } = await req.json();
    
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }
    
    // Use service role to fetch user data
    const sellers = await base44.asServiceRole.entities.User.filter({ email });
    
    if (sellers.length === 0) {
      return Response.json({ seller: null });
    }
    
    // Return only safe public data
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