import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const sales = await base44.asServiceRole.entities.YardSale.list();

    // Group by title
    const byTitle = {};
    for (const sale of sales) {
      const key = sale.title?.trim().toLowerCase();
      if (!key) continue;
      if (!byTitle[key]) byTitle[key] = [];
      byTitle[key].push(sale);
    }

    const toDelete = [];
    for (const [title, group] of Object.entries(byTitle)) {
      if (group.length <= 1) continue;
      // Sort by created_date descending — keep newest, delete the rest
      group.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      const [keep, ...dupes] = group;
      console.log(`Keeping "${keep.title}" (${keep.id}), deleting ${dupes.length} duplicate(s)`);
      toDelete.push(...dupes.map(d => d.id));
    }

    for (const id of toDelete) {
      await base44.asServiceRole.entities.YardSale.delete(id);
      console.log(`Deleted: ${id}`);
    }

    return Response.json({ success: true, deleted: toDelete.length, ids: toDelete });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});