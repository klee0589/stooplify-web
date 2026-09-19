import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        // Auth check: admin user or valid automation token
        const body = await req.json().catch(() => ({}));
        const automationToken = Deno.env.get('AUTOMATION_TOKEN');
        const hasValidToken = !!(automationToken && body.automation_token && body.automation_token === automationToken);
        if (!hasValidToken) {
          let isAuthorized = false;
          try {
            const user = await base44.auth.me();
            isAuthorized = !!user && user.role === 'admin';
          } catch {}
          if (!isAuthorized) {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
          }
        }

        console.log('Starting weekly social post generation...');

        // Get Facebook connection
        const { accessToken } = await base44.asServiceRole.connectors.getConnection("facebook_pages");

        // List managed Pages and get the first one's Page access token
        const pagesRes = await fetch(
            `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
        );
        const pagesData = await pagesRes.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            throw new Error('No Facebook Pages found for this account');
        }

        const page = pagesData.data[0];
        const pageToken = page.access_token;
        const pageId = page.id;
        const pageName = page.name;
        console.log(`Publishing to Facebook Page: ${pageName} (${pageId})`);

        // Alternate content type by ISO week number (even = featured sale, odd = tip)
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
        let contentType = weekNumber % 2 === 0 ? 'featured_sale' : 'tip';
        console.log(`Week ${weekNumber} → content type: ${contentType}`);

        let caption = '';
        let imageUrl = null;
        let link = '';

        if (contentType === 'featured_sale') {
            // Fetch upcoming approved yard sales
            const today = new Date().toISOString().split('T')[0];
            const sales = await base44.asServiceRole.entities.YardSale.filter(
                { status: 'approved', date: { $gte: today } },
                '-views',
                20
            );

            // Prefer sales with photos
            const sale = sales.find(s => s.photos && s.photos.length > 0) || sales[0];

            if (sale) {
                imageUrl = sale.photos && sale.photos.length > 0 ? sale.photos[0] : null;
                link = 'https://stooplify-cba3c5d6.base44.app/yard-sales';

                const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
                    prompt: `Write an engaging Facebook post promoting this yard sale for Stooplify, a yard sale discovery app. Keep it under 280 characters. Use 1-2 relevant emojis. End with a call to action to find more sales on Stooplify.

Sale title: ${sale.title}
Location: ${sale.city}, ${sale.state}
Date: ${sale.date}
${sale.start_time ? `Time: ${sale.start_time}` : ''}
Description: ${(sale.description || 'Great items available!').substring(0, 200)}`,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            caption: { type: "string" }
                        },
                        required: ["caption"]
                    }
                });
                caption = llmRes.caption;
            } else {
                console.log('No upcoming sales found, falling back to tip');
                contentType = 'tip';
            }
        }

        if (contentType === 'tip') {
            // Fetch published blog posts
            const posts = await base44.asServiceRole.entities.BlogPost.filter(
                { status: 'published' },
                '-publish_date',
                10
            );

            const post = posts[0];
            if (post) {
                imageUrl = post.featured_image_url || null;
                link = `https://stooplify-cba3c5d6.base44.app/blog`;

                const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
                    prompt: `Write an engaging Facebook post sharing a yard sale tip from this blog post for Stooplify. Keep it under 280 characters. Use 1-2 relevant emojis. End with a call to action.

Blog title: ${post.title}
Excerpt: ${post.excerpt || ''}`,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            caption: { type: "string" }
                        },
                        required: ["caption"]
                    }
                });
                caption = llmRes.caption;
            }
        }

        if (!caption) {
            return Response.json({
                success: false,
                error: 'No content available to post'
            }, { status: 400 });
        }

        // Generate an image if none available
        if (!imageUrl) {
            console.log('No existing image, generating one...');
            try {
                const imgRes = await base44.asServiceRole.integrations.Core.GenerateImage({
                    prompt: contentType === 'featured_sale'
                        ? 'A vibrant yard sale scene on a sunny Brooklyn stoop, assorted vintage items and furniture on display, warm inviting atmosphere, flat lay photography style'
                        : 'A clean modern illustration about yard sale tips, price tags, moving boxes, and a checklist, bright flat design with blue and orange accents'
                });
                imageUrl = imgRes.url;
            } catch (imgError) {
                console.error('Image generation failed:', imgError.message);
            }
        }

        // Build the full message with link
        const fullMessage = link ? `${caption}\n\n${link}` : caption;

        // Publish to Facebook Page
        let publishRes;
        if (imageUrl) {
            // Post with photo
            const photoRes = await fetch(`https://graph.facebook.com/v25.0/${pageId}/photos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    url: imageUrl,
                    caption: fullMessage,
                    access_token: pageToken,
                    published: 'true'
                })
            });
            publishRes = await photoRes.json();
        } else {
            // Text-only post
            const feedRes = await fetch(`https://graph.facebook.com/v25.0/${pageId}/feed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    message: fullMessage,
                    access_token: pageToken
                })
            });
            publishRes = await feedRes.json();
        }

        if (publishRes.error) {
            throw new Error(`Facebook API error: ${publishRes.error.message}`);
        }

        console.log('Post published successfully:', publishRes.id || publishRes.post_id);

        return Response.json({
            success: true,
            page: pageName,
            contentType,
            postId: publishRes.id || publishRes.post_id,
            caption,
            hadImage: !!imageUrl
        });

    } catch (error) {
        console.error('Error publishing social post:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
});