import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden' }, { status: 403 });
        }

        const posts = await base44.asServiceRole.entities.BlogPost.list('-publish_date', 100);
        const missing = posts.filter(p => !p.content_es || !p.title_es).slice(0, 5); // Process 5 at a time to avoid timeout

        console.log(`Found ${missing.length} posts needing Spanish translation`);

        const results = [];

        for (const post of missing) {
            console.log(`Translating: ${post.title}`);
            try {
                const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
                    prompt: `Translate the following blog post content into Spanish. Return a JSON object with the Spanish translations only.

Title: ${post.title}
Excerpt: ${post.excerpt}
Content: ${post.content}
Meta Description: ${post.meta_description}

Return JSON:
{
  "title_es": "Spanish title",
  "excerpt_es": "Spanish excerpt (150-160 chars)",
  "content_es": "Full Spanish content in markdown",
  "meta_description_es": "Spanish meta description (150-160 chars)"
}

Keep all markdown formatting intact. Make the Spanish natural and fluent, not a word-for-word translation.`,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            title_es: { type: "string" },
                            excerpt_es: { type: "string" },
                            content_es: { type: "string" },
                            meta_description_es: { type: "string" }
                        },
                        required: ["title_es", "excerpt_es", "content_es", "meta_description_es"]
                    }
                });

                await base44.asServiceRole.entities.BlogPost.update(post.id, {
                    title_es: response.title_es,
                    excerpt_es: response.excerpt_es,
                    content_es: response.content_es,
                    meta_description_es: response.meta_description_es
                });

                console.log(`Done: ${post.title}`);
                results.push({ id: post.id, title: post.title, status: 'success' });
            } catch (err) {
                console.error(`Failed for ${post.title}:`, err.message);
                results.push({ id: post.id, title: post.title, status: 'error', error: err.message });
            }
        }

        return Response.json({ success: true, translated: results.length, results });
    } catch (error) {
        console.error('Backfill error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
});