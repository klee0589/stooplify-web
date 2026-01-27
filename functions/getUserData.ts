import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return user data
        return Response.json({ 
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            created_date: user.created_date
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});