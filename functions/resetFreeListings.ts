import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { user_email } = await req.json();

    if (!user_email) {
      return Response.json({ error: 'user_email is required' }, { status: 400 });
    }

    // Get the target user
    const targetUsers = await base44.asServiceRole.entities.User.filter({ email: user_email });
    
    if (targetUsers.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = targetUsers[0];

    // Reset their free listings counter
    await base44.asServiceRole.entities.User.update(targetUser.id, {
      free_listings_used: 0
    });

    console.log(`Reset free listings for user: ${user_email}`);

    return Response.json({ 
      success: true, 
      message: `Free listings counter reset for ${user_email}`,
      previous_value: targetUser.free_listings_used || 0
    });
  } catch (error) {
    console.error('Error resetting free listings:', error);
    return Response.json({ 
      error: error.message || 'Failed to reset free listings' 
    }, { status: 500 });
  }
});