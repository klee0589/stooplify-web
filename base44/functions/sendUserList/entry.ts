import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Require admin auth
  let isAuthorized = false;
  try {
    const user = await base44.auth.me();
    isAuthorized = !!user && user.role === 'admin';
  } catch {}
  if (!isAuthorized) {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const users = await base44.asServiceRole.entities.User.list();

  const rows = users
    .map((u, i) => `${i + 1}. ${u.full_name || '(no name)'} — ${u.email} | Joined: ${new Date(u.created_date).toLocaleDateString()} | Verified: ${u.is_verified ? 'Yes' : 'No'}`)
    .join('\n');

  const body = `Stooplify User List (${users.length} users)\n\n${rows}`;

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: 'klee0589@gmail.com',
    subject: `Stooplify User List — ${users.length} users`,
    body,
    from_name: 'Stooplify Admin'
  });

  return Response.json({ success: true, count: users.length });
});