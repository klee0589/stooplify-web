import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        console.log('Starting weekly blog post generation...');

        // Generate blog post content using AI
        const prompt = `You are a content writer for Stooplify, a yard sale marketplace app. 
Write a helpful, engaging blog post about yard sales, garage sales, or secondhand shopping.

Topics to consider:
- Yard sale tips and tricks
- How to price items
- Best times to host sales
- Decorating on a budget with secondhand finds
- Sustainable shopping benefits
- Local community building through yard sales
- Organizing a successful multi-family sale
- Negotiation tips for buyers
- Hidden gems to look for at yard sales

Requirements:
- 800-1200 words
- SEO-optimized with natural keyword usage
- Engaging and conversational tone
- Include practical tips and actionable advice
- Use markdown formatting with headers, lists, and emphasis
- Make it helpful for both buyers and sellers
- Also provide full Spanish translations of the title, excerpt, meta_description, and content

Return a JSON object with:
{
  "title": "Catchy, SEO-friendly title (60 chars max)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling summary in 150-160 characters",
  "content": "Full blog post content in markdown",
  "meta_description": "SEO meta description (150-160 chars)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "reading_time_minutes": 5,
  "title_es": "Spanish title",
  "excerpt_es": "Spanish excerpt",
  "content_es": "Full blog post content in Spanish markdown",
  "meta_description_es": "Spanish SEO meta description"
}`;

        const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    slug: { type: "string" },
                    excerpt: { type: "string" },
                    content: { type: "string" },
                    meta_description: { type: "string" },
                    meta_keywords: { 
                        type: "array",
                        items: { type: "string" }
                    },
                    tags: { 
                        type: "array",
                        items: { type: "string" }
                    },
                    reading_time_minutes: { type: "number" }
                },
                required: ["title", "slug", "excerpt", "content", "meta_description", "meta_keywords", "tags"]
            }
        });

        console.log('AI response received:', response);

        // Create the blog post
        const blogPost = await base44.asServiceRole.entities.BlogPost.create({
            title: response.title,
            slug: response.slug,
            author_name: "Stooplify Team",
            author_email: "daniel@stooplify.com",
            excerpt: response.excerpt,
            content: response.content,
            meta_description: response.meta_description,
            meta_keywords: response.meta_keywords,
            tags: response.tags,
            publish_date: new Date().toISOString(),
            status: "published",
            reading_time_minutes: response.reading_time_minutes || 5,
            view_count: 0,
            title_es: response.title_es || null,
            excerpt_es: response.excerpt_es || null,
            content_es: response.content_es || null,
            meta_description_es: response.meta_description_es || null
        });

        console.log('Blog post created successfully:', blogPost.id);

        return Response.json({ 
            success: true, 
            message: 'Weekly blog post generated successfully',
            post: {
                id: blogPost.id,
                title: blogPost.title,
                slug: blogPost.slug
            }
        });

    } catch (error) {
        console.error('Error generating blog post:', error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
});