import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        console.log('Starting blog post batch generation (3 posts)...');

        // Get existing posts to avoid duplicates
        const recentPosts = await base44.asServiceRole.entities.BlogPost.list('-publish_date', 50);
        const existingSlugs = recentPosts.map(p => p.slug);

        // Get today's date and context for seasonal/holiday relevance
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const prompt = `You are a content writer for Stooplify, a yard sale and stoop sale marketplace app focused on NYC (especially Brooklyn, Queens, Bronx, Manhattan) but also other US cities.

Today's date is: ${dateStr}

Generate 3 DISTINCT, unique blog posts about yard sales, garage sales, stoop sales, or secondhand shopping.

IMPORTANT CONTEXT TO CONSIDER:
- Today's date and upcoming holidays, events, or seasonal weather
- If it's near spring: spring cleaning, warmer weather yard sales starting up
- If it's near summer: peak yard sale season, outdoor tips
- If it's near fall: end-of-season sales, back-to-school items
- If it's near winter/holidays: gift shopping at yard sales, holiday decor, year-end
- Upcoming holidays like St. Patrick's Day, Easter, Mother's Day, Memorial Day, July 4th, Labor Day, Halloween, Thanksgiving, Christmas — tie in relevant content when within 4-6 weeks
- Current season weather tips (e.g. rain-proofing items, heat tips, cold weather setup)

ALREADY PUBLISHED slugs (DO NOT duplicate these topics): ${existingSlugs.join(', ')}

Return a JSON object with a "posts" array containing exactly 3 blog post objects. Each post must be on a completely DIFFERENT topic/angle.

Each post object should have:
{
  "title": "Catchy, SEO-friendly title (60 chars max)",
  "slug": "url-friendly-slug-unique",
  "excerpt": "Compelling summary in 150-160 characters",
  "content": "Full blog post content in markdown (800-1200 words, with headers, lists, tips)",
  "meta_description": "SEO meta description (150-160 chars)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "reading_time_minutes": 5,
  "image_prompt": "A detailed, specific image generation prompt for a photo that perfectly illustrates this specific post's topic (be very specific about items, setting, season, mood)",
  "title_es": "Spanish title",
  "excerpt_es": "Spanish excerpt",
  "content_es": "Full blog post content in Spanish markdown",
  "meta_description_es": "Spanish SEO meta description"
}

Make posts varied - e.g. one for buyers, one for sellers, one seasonal/holiday-themed.`;

        const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: prompt,
            model: "gemini_3_flash",
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    posts: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                slug: { type: "string" },
                                excerpt: { type: "string" },
                                content: { type: "string" },
                                meta_description: { type: "string" },
                                meta_keywords: { type: "array", items: { type: "string" } },
                                tags: { type: "array", items: { type: "string" } },
                                reading_time_minutes: { type: "number" },
                                image_prompt: { type: "string" },
                                title_es: { type: "string" },
                                excerpt_es: { type: "string" },
                                content_es: { type: "string" },
                                meta_description_es: { type: "string" }
                            },
                            required: ["title", "slug", "excerpt", "content", "meta_description", "meta_keywords", "tags", "image_prompt"]
                        }
                    }
                },
                required: ["posts"]
            }
        });

        console.log('AI response received, posts count:', response?.posts?.length);

        if (!response || !response.posts || response.posts.length === 0) {
            throw new Error('LLM returned an empty or invalid response');
        }

        const createdPosts = [];

        for (const postData of response.posts) {
            if (!postData.title || !postData.slug) {
                console.warn('Skipping invalid post data:', postData);
                continue;
            }

            console.log(`Generating image for: ${postData.title}`);

            // Generate a relevant image using the AI-crafted prompt
            let featured_image_url = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80';
            try {
                const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
                    prompt: postData.image_prompt
                });
                featured_image_url = imageResult.url;
                console.log('Image generated for:', postData.slug);
            } catch (imgError) {
                console.error('Image generation failed for', postData.slug, ':', imgError.message);
            }

            // Create the blog post
            const blogPost = await base44.asServiceRole.entities.BlogPost.create({
                title: postData.title,
                slug: postData.slug,
                author_name: "Stooplify Team",
                author_email: "daniel@stooplify.com",
                excerpt: postData.excerpt,
                content: postData.content,
                meta_description: postData.meta_description,
                meta_keywords: postData.meta_keywords,
                tags: postData.tags,
                publish_date: new Date().toISOString(),
                status: "published",
                reading_time_minutes: postData.reading_time_minutes || 5,
                featured_image_url: featured_image_url,
                view_count: 0,
                title_es: postData.title_es || null,
                excerpt_es: postData.excerpt_es || null,
                content_es: postData.content_es || null,
                meta_description_es: postData.meta_description_es || null
            });

            console.log('Blog post created:', blogPost.id, blogPost.title);
            createdPosts.push({ id: blogPost.id, title: blogPost.title, slug: blogPost.slug });
        }

        return Response.json({ 
            success: true, 
            message: `${createdPosts.length} blog posts generated successfully`,
            posts: createdPosts
        });

    } catch (error) {
        console.error('Error generating blog posts:', error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
});