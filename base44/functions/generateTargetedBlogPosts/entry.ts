import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TARGETED_POSTS = [
  {
    title: "What Is a Stoop Sale? The NYC Tradition Explained",
    slug: "what-is-a-stoop-sale-nyc-tradition-explained",
    tags: ["stoop sale", "nyc", "guide"],
    metaDescription: "What is a stoop sale? Learn the NYC tradition, how it differs from yard sales, and how to find one near you this weekend.",
    subheadings: ["What Does 'Stoop Sale' Mean?", "Stoop Sale vs. Yard Sale: What's the Difference?", "Where to Find Stoop Sales in NYC This Weekend"],
    keywords: "stoop sale meaning, what is a stoop sale, stoop sale NYC"
  },
  {
    title: "How to Price Yard Sale Items: The Only Guide You Need",
    slug: "how-to-price-yard-sale-items-complete-guide",
    tags: ["pricing", "yard sale", "tips"],
    metaDescription: "Not sure what to charge? Our simple pricing guide helps you price yard sale items fast — and actually sell them.",
    subheadings: ["The 10–30% Rule (Start Here)", "Category-by-Category Price Cheat Sheet", "How to Handle Hagglers Without Losing Money"],
    keywords: "how to price yard sale items, pricing yard sale items, yard sale pricing guide"
  },
  {
    title: "Stoop Sale vs. Yard Sale: What's the Real Difference?",
    slug: "stoop-sale-vs-yard-sale-real-difference",
    tags: ["stoop sale", "yard sale", "nyc"],
    metaDescription: "Stoop sale or yard sale — what's the difference? We break down the NYC origins, key distinctions, and how to host either one.",
    subheadings: ["The NYC Origin of Stoop Sales", "Key Differences in Setup & Location", "Which One Should You Host?"],
    keywords: "stoop sale vs yard sale, stoop sale, yard sale difference"
  },
  {
    title: "How to Host a Stoop Sale in NYC: A Step-by-Step Guide",
    slug: "how-to-host-a-stoop-sale-nyc-step-by-step",
    tags: ["stoop sale", "nyc", "how to", "guide"],
    metaDescription: "Ready to host your first stoop sale? Here's exactly how to set up, price items, and attract buyers in NYC.",
    subheadings: ["Do You Need a Permit in NYC?", "Setting Up Your Stoop for Maximum Foot Traffic", "How to Promote Your Sale Online for Free"],
    keywords: "how to host a stoop sale, stoop sale NYC, host a stoop sale"
  },
  {
    title: "Best Weekends for Stoop Sales in Brooklyn (2026 Guide)",
    slug: "best-weekends-stoop-sales-brooklyn-2026",
    tags: ["brooklyn", "stoop sale", "weekend", "2026"],
    metaDescription: "Find the best weekends for Brooklyn stoop sales in 2026 — plus tips on which neighborhoods have the most sales.",
    subheadings: ["Spring Is Prime Season — Here's Why", "Best Brooklyn Neighborhoods for Stoop Sales", "How to Find Sales Near You This Weekend"],
    keywords: "brooklyn stoop sales, stoop sales brooklyn, stoop sale weekend brooklyn"
  },
  {
    title: "25 Things That Always Sell at Yard Sales (And 5 That Never Do)",
    slug: "things-that-always-sell-at-yard-sales",
    tags: ["yard sale", "selling tips", "what sells"],
    metaDescription: "Some items fly off the table — others just sit there. Here's what actually sells at yard sales, based on real seller data.",
    subheadings: ["The 25 Best-Selling Yard Sale Items", "Items You'll Never Sell (Don't Bother)", "Pro Tips to Move More Inventory Fast"],
    keywords: "what sells at yard sales, best items for yard sale, yard sale selling tips"
  },
  {
    title: "Yard Sale Pricing Psychology: How to Make Buyers Say Yes",
    slug: "yard-sale-pricing-psychology-make-buyers-say-yes",
    tags: ["pricing", "psychology", "yard sale tips"],
    metaDescription: "The way you price — and display — yard sale items changes everything. Use these psychology-backed tricks to sell more.",
    subheadings: ["Why $1 Tables Work So Well", "Charm Pricing vs. Round Numbers", "How Bundling Doubles Your Sales"],
    keywords: "yard sale pricing tips, pricing yard sale items, how to price items at a yard sale"
  }
];

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const results = [];

    for (const post of TARGETED_POSTS) {
      // Check if slug already exists
      const existing = await base44.asServiceRole.entities.BlogPost.filter({ slug: post.slug });
      if (existing.length > 0) {
        console.log(`- Skipped (exists): ${post.title}`);
        results.push({ slug: post.slug, skipped: true });
        continue;
      }

      const prompt = `Write a comprehensive, SEO-optimized blog post for Stooplify.com — a platform for finding and listing yard sales and stoop sales in NYC and across the US.

Title: "${post.title}"
Target keywords: ${post.keywords}
Required subheadings (use these exact H2s): ${post.subheadings.map(s => `"${s}"`).join(', ')}

Requirements:
- Write in a friendly, practical, conversational tone
- 800–1100 words total
- Start with a compelling intro paragraph (no heading)
- Use the required H2 subheadings (## in markdown)
- Include specific NYC neighborhood examples where relevant (Brooklyn, Queens, Bronx, Manhattan)
- Add practical, actionable tips with bullet points or numbered lists
- Include a natural mention of Stooplify.com as the best place to find or list stoop/yard sales
- End with a short CTA encouraging readers to browse or list on Stooplify
- Format in clean markdown

Also provide:
- excerpt: A 1–2 sentence summary (used as blog card preview)
- readingTime: estimated reading time in minutes (number)`;

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            content: { type: "string" },
            excerpt: { type: "string" },
            readingTime: { type: "number" }
          }
        }
      });

      const featuredImages = [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        "https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=800",
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800",
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800"
      ];
      const imageIndex = TARGETED_POSTS.indexOf(post) % featuredImages.length;

      await base44.asServiceRole.entities.BlogPost.create({
        title: post.title,
        slug: post.slug,
        content: result.content,
        excerpt: result.excerpt,
        meta_description: post.metaDescription,
        meta_keywords: post.keywords.split(', '),
        tags: post.tags,
        featured_image_url: featuredImages[imageIndex],
        publish_date: new Date().toISOString(),
        status: "published",
        reading_time_minutes: result.readingTime || 5,
        author_name: "Stooplify Team",
        view_count: 0
      });

      console.log(`- Created: ${post.title}`);
      results.push({ title: post.title, slug: post.slug, created: true });
    }

    return Response.json({ success: true, total: TARGETED_POSTS.length, results });
  } catch (error) {
    console.error('generateTargetedBlogPosts error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});