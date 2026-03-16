import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const CITIES = [
  { name: 'Brooklyn', slug: 'brooklyn', cityPage: '/stoop-sales-brooklyn' },
  { name: 'Queens', slug: 'queens', cityPage: '/stoop-sales-queens' },
  { name: 'Manhattan', slug: 'manhattan', cityPage: '/stoop-sales-manhattan' },
  { name: 'Los Angeles', slug: 'los-angeles', cityPage: '/garage-sales-los-angeles' },
  { name: 'San Francisco', slug: 'san-francisco', cityPage: '/garage-sales-san-francisco' },
  { name: 'Jersey City', slug: 'jersey-city', cityPage: '/stoop-sales-jersey-city' },
];

// Rotate city based on day of week for variety
function getCityForToday() {
  const dayIndex = new Date().getDay();
  return CITIES[dayIndex % CITIES.length];
}

const TOPIC_TEMPLATES = (city) => [
  {
    topic: `yard sales this weekend in ${city.name}`,
    promptExtra: `Focus on practical tips for finding sales this weekend in ${city.name}. Mention local neighborhoods. Include a section on using Stooplify to browse the map. Link to ${city.cityPage} and /yard-sales.`,
    tags: ['yard sales', city.name.toLowerCase(), 'this weekend', 'local sales'],
  },
  {
    topic: `best neighborhoods for yard sales in ${city.name}`,
    promptExtra: `Describe 4-5 neighborhoods in ${city.name} known for great yard sales or stoop sales. Include what makes each one unique for thrift hunters. Link to ${city.cityPage}.`,
    tags: ['yard sales', city.name.toLowerCase(), 'neighborhoods', 'thrifting'],
  },
  {
    topic: 'how to price items for a yard sale',
    promptExtra: 'Give a complete pricing guide with specific price ranges by category (clothing, furniture, electronics, books, toys, etc.). Include tips for haggling and end-of-day discounting.',
    tags: ['yard sale tips', 'pricing', 'how to', 'selling'],
  },
];

async function generatePost(base44, topicData, city) {
  const prompt = `Write a comprehensive, SEO-optimized blog post for Stooplify (a yard sale discovery platform) about: "${topicData.topic}".

Requirements:
- Length: 700–900 words
- Use markdown with ## H2 headers and ### H3 subheaders
- Tone: helpful, friendly, local insider knowledge
- Naturally mention Stooplify 2-3 times as the best tool to find/post yard sales
- Include these internal markdown links naturally in the text:
  * [Find Yard Sales Near You](/guides-find-yard-sales)
  * [List Your Sale Free](/add-yard-sale)
  * At least one city link: ${city.cityPage}
  * ${topicData.promptExtra}
- End with a CTA paragraph encouraging readers to browse or post on Stooplify

Return a JSON object with these exact fields:
- title: string (compelling SEO title, ~60 chars)
- slug: string (URL-friendly, lowercase, hyphens, no special chars)
- excerpt: string (compelling 140-155 char summary)
- content: string (full markdown content)
- meta_description: string (150-160 chars, includes primary keyword)
- meta_keywords: array of 5-8 keyword strings
- reading_time_minutes: number`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        slug: { type: 'string' },
        excerpt: { type: 'string' },
        content: { type: 'string' },
        meta_description: { type: 'string' },
        meta_keywords: { type: 'array', items: { type: 'string' } },
        reading_time_minutes: { type: 'number' },
      },
      required: ['title', 'slug', 'excerpt', 'content', 'meta_description'],
    },
  });

  return result;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`[generateDailyBlogPosts] Running for date: ${today}`);

    // Check how many posts we've generated today
    const allPosts = await base44.asServiceRole.entities.BlogPost.filter({ status: 'published' }, '-publish_date', 50);
    const todaysPosts = allPosts.filter(p => p.publish_date && p.publish_date.startsWith(today));

    if (todaysPosts.length >= 3) {
      console.log(`[generateDailyBlogPosts] Already generated ${todaysPosts.length} posts today. Skipping.`);
      return Response.json({ message: 'Already generated 3 posts today', count: todaysPosts.length });
    }

    const city = getCityForToday();
    const topics = TOPIC_TEMPLATES(city);
    const remaining = 3 - todaysPosts.length;
    const topicsToGenerate = topics.slice(0, remaining);

    console.log(`[generateDailyBlogPosts] Generating ${topicsToGenerate.length} post(s) for city: ${city.name}`);

    const generated = [];

    for (const topicData of topicsToGenerate) {
      try {
        console.log(`[generateDailyBlogPosts] Generating post for topic: ${topicData.topic}`);
        const postData = await generatePost(base44, topicData, city);

        if (!postData || !postData.slug) {
          console.error('[generateDailyBlogPosts] LLM returned invalid data');
          continue;
        }

        // Ensure slug is clean
        let slug = postData.slug
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        // Check for duplicate slug
        const existing = await base44.asServiceRole.entities.BlogPost.filter({ slug });
        if (existing.length > 0) {
          const suffix = Date.now().toString(36).slice(-4);
          slug = `${slug}-${suffix}`;
          console.log(`[generateDailyBlogPosts] Slug collision, using: ${slug}`);
        }

        // Generate a featured image
        let featuredImageUrl = '';
        try {
          const imageResult = await base44.asServiceRole.integrations.Core.GenerateImage({
            prompt: `A vibrant, realistic street photography photo of a neighborhood yard sale or stoop sale scene for a blog post titled "${postData.title}". Show colorful items laid out on tables or stoops, people browsing, sunny day, urban neighborhood feel. No text overlays.`,
          });
          featuredImageUrl = imageResult?.url || '';
          console.log(`[generateDailyBlogPosts] Generated image for: "${postData.title}"`);
        } catch (imgErr) {
          console.error(`[generateDailyBlogPosts] Image generation failed:`, imgErr.message);
        }

        const post = await base44.asServiceRole.entities.BlogPost.create({
          title: postData.title,
          slug,
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          meta_description: postData.meta_description || '',
          meta_keywords: postData.meta_keywords || topicData.tags,
          tags: topicData.tags,
          reading_time_minutes: postData.reading_time_minutes || 5,
          status: 'published',
          publish_date: new Date().toISOString(),
          author_name: 'Stooplify Team',
          featured_image_url: featuredImageUrl,
          title_es: postData.title_es || '',
          excerpt_es: postData.excerpt_es || '',
          content_es: postData.content_es || '',
          meta_description_es: postData.meta_description_es || '',
        });

        console.log(`[generateDailyBlogPosts] Created post: "${postData.title}" (${slug})`);
        generated.push({ title: postData.title, slug });
      } catch (err) {
        console.error(`[generateDailyBlogPosts] Failed to generate post for "${topicData.topic}":`, err.message);
      }
    }

    return Response.json({
      success: true,
      city: city.name,
      generated: generated.length,
      posts: generated,
    });
  } catch (error) {
    console.error('[generateDailyBlogPosts] Fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});