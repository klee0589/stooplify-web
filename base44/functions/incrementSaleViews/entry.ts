import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Public endpoint: anonymous visitors count as views too. Only touches the `views`
// field of an approved sale, so the elevation is narrowly scoped.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { saleId } = await req.json();
    if (!saleId || typeof saleId !== 'string') {
      return Response.json({ error: 'saleId is required' }, { status: 400 });
    }

    const sale = await base44.asServiceRole.entities.YardSale.get(saleId);
    if (!sale || sale.status !== 'approved') {
      return Response.json({ error: 'Sale not found' }, { status: 404 });
    }

    const views = (sale.views || 0) + 1;
    await base44.asServiceRole.entities.YardSale.update(saleId, { views });
    return Response.json({ views });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}