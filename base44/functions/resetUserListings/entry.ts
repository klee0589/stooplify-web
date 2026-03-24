import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { userEmail } = await req.json();

        // Get the user
        const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
        
        if (users.length === 0) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const targetUser = users[0];

        // Reset their free listings and subscription
        await base44.asServiceRole.entities.User.update(targetUser.id, {
            free_listings_used: 0,
            subscription_active: false
        });

        console.log(`✅ Reset user ${userEmail}: free_listings_used=0, subscription_active=false`);

        return Response.json({ 
            success: true, 
            message: `User ${userEmail} has been reset`,
            free_listings_used: 0,
            subscription_active: false
        });

    } catch (error) {
        console.error('❌ Reset error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});