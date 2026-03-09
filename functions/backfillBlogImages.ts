import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all published posts without a featured image
    const allPosts = await base44.asServiceRole.entities.BlogPost.filter({ status: 'published' }, '-publish_date', 100);
    const postsWithoutImages = allPosts.filter(p => !p.featured_image_url);

    console.log(`[backfillBlogImages] Found ${postsWithoutImages.length} posts without images`);

    const results = [];

    for (const post of postsWithoutImages) {
      try {
        console.log(`[backfillBlogImages] Generating image for: "${post.title}"`);
        const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
          prompt: `A vibrant, realistic street photography photo of a neighborhood yard sale or stoop sale scene for a blog post titled "${post.title}". Show colorful items laid out on tables or stoops, people browsing, sunny day, urban neighborhood feel. No text overlays.`,
        });

        const imageUrl = imageResult?.url || '';
        if (imageUrl) {
          await base44.asServiceRole.entities.BlogPost.update(post.id, { featured_image_url: imageUrl });
          console.log(`[backfillBlogImages] Updated post: "${post.title}"`);
          results.push({ title: post.title, imageUrl });
        }
      } catch (err) {
        console.error(`[backfillBlogImages] Failed for "${post.title}":`, err.message);
      }
    }

    return Response.json({ success: true, updated: results.length, posts: results });
  } catch (error) {
    console.error('[backfillBlogImages] Fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});