import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow specific admin email
    if (user.email !== 'klee0589@gmail.com') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const previousValue = user.free_listings_used || 0;
    
    await base44.auth.updateMe({
      free_listings_used: 0
    });

    console.log(`Reset free listings for user: ${user.email}`);

    return Response.json({ 
      success: true, 
      message: `Free listings counter reset`,
      previous_value: previousValue
    });
  } catch (error) {
    console.error('Error resetting free listings:', error);
    return Response.json({ 
      error: error.message || 'Failed to reset free listings' 
    }, { status: 500 });
  }
});