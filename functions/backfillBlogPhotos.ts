import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const allPosts = await base44.asServiceRole.entities.BlogPost.list();
    const missingPhoto = allPosts.filter(p => !p.featured_image_url);

    console.log(`Found ${missingPhoto.length} posts without photos`);

    const results = [];

    for (const post of missingPhoto) {
      try {
        console.log(`Generating image for: ${post.title}`);

        const prompt = `A vibrant, colorful lifestyle photograph for a blog article titled "${post.title}". 
The image should be warm, inviting, and related to yard sales, garage sales, stoop sales, secondhand shopping, or community treasure hunting. 
Style: bright natural daylight, real photography aesthetic, no text or overlays, wide 16:9 composition.
Context hint: ${post.excerpt ? post.excerpt.slice(0, 200) : ''}`;

        const { url } = await base44.asServiceRole.integrations.Core.GenerateImage({ prompt });

        await base44.asServiceRole.entities.BlogPost.update(post.id, { featured_image_url: url });

        results.push({ id: post.id, title: post.title, url, status: 'success' });
        console.log(`✓ Updated: ${post.title}`);

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error(`✗ Failed for "${post.title}": ${err.message}`);
        results.push({ id: post.id, title: post.title, status: 'error', error: err.message });
      }
    }

    return Response.json({
      total_missing: missingPhoto.length,
      updated: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results
    });

  } catch (error) {
    console.error('backfillBlogPhotos error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});