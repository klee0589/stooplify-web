import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TOPICS = [
  { title: "Spring 2026 Stoop Sale Season: What to Expect in NYC", tags: ["Trends", "NYC", "Spring"], city: "NYC", youtube: null },
  { title: "How Inflation Is Changing What People Sell at Yard Sales in 2026", tags: ["Trends", "Economy"], city: "NYC", youtube: "dQw4w9WgXcQ" },
  { title: "The Resale Revolution: Why More Gen Z Are Hitting Stoop Sales", tags: ["Trends", "Gen Z"], city: "NYC", youtube: null },
  { title: "Thrift Flipping 101: How to Turn Yard Sale Finds into Cash", tags: ["Reselling", "Tips"], city: "Brooklyn", youtube: "gRZBnKElHVY" },
  { title: "Best Thrift Stores Near Stoop Sales in Williamsburg", tags: ["Williamsburg", "Shopping"], city: "Brooklyn", youtube: null },
  { title: "How to Spot Fake Vintage at NYC Stoop Sales", tags: ["Vintage", "Tips", "Buyers"], city: "NYC", youtube: null },
  { title: "The 5 Most Valuable Items You'll Find at a Brooklyn Stoop Sale", tags: ["Brooklyn", "Buyers", "Vintage"], city: "Brooklyn", youtube: null },
  { title: "Earth Day 2026: How Stoop Sales Help the Planet", tags: ["Sustainability", "Earth Day"], city: "NYC", youtube: "TcMBFSGVi1c" },
  { title: "Moving to NYC? Why You Should Furnish Your Apartment at Stoop Sales", tags: ["Moving", "NYC", "Buyers"], city: "Manhattan", youtube: null },
  { title: "How to Use Stooplify to Plan Your Weekend Treasure Hunt", tags: ["How-To", "App Guide"], city: "NYC", youtube: null },
  { title: "Park Slope vs. Bushwick Stoop Sales: Which Borough Has Better Deals?", tags: ["Brooklyn", "Neighborhood Guide"], city: "Brooklyn", youtube: null },
  { title: "The Rise of Vintage Sneaker Hunting at NYC Stoop Sales", tags: ["Sneakers", "Vintage", "NYC"], city: "NYC", youtube: "1cFkFtGsW8I" },
  { title: "What to Do With Leftover Items After Your Stoop Sale", tags: ["Sellers", "Tips"], city: "NYC", youtube: null },
  { title: "How Instagram Is Driving Traffic to NYC Stoop Sales in 2026", tags: ["Social Media", "Marketing", "Trends"], city: "NYC", youtube: null },
  { title: "Harlem Stoop Sales: A Guide to the Hidden Gems Uptown", tags: ["Harlem", "Manhattan", "Neighborhood Guide"], city: "Manhattan", youtube: null },
  { title: "The Ultimate Stoop Sale Packing List for Buyers", tags: ["Buyers", "Tips"], city: "NYC", youtube: null },
  { title: "Vintage Record Hunting at NYC Stoop Sales: A Vinyl Lover's Guide", tags: ["Vinyl", "Music", "Vintage"], city: "NYC", youtube: "sBvpwfI4lPs" },
  { title: "How to Price Furniture at a Stoop Sale Without Underselling", tags: ["Sellers", "Pricing", "Furniture"], city: "Brooklyn", youtube: null },
  { title: "The Bronx Stoop Sale Scene: An Underrated Treasure Trove", tags: ["Bronx", "Neighborhood Guide"], city: "Bronx", youtube: null },
  { title: "Negotiating at Stoop Sales: Scripts That Actually Work", tags: ["Buyers", "Negotiation"], city: "NYC", youtube: null },
  { title: "What Not to Buy at a Yard Sale (And What to Always Grab)", tags: ["Buyers", "Tips"], city: "NYC", youtube: "vR47VbWtbT0" },
  { title: "Jersey City's Stoop Sale Renaissance: A 2026 Guide", tags: ["Jersey City", "Neighborhood Guide"], city: "Jersey City", youtube: null },
  { title: "How to Safely Sell Electronics at a Stoop Sale", tags: ["Electronics", "Sellers", "Tips"], city: "NYC", youtube: null },
  { title: "Decluttering Before a Cross-Country Move: The NYC Stoop Sale Method", tags: ["Moving", "Decluttering", "Sellers"], city: "NYC", youtube: null },
  { title: "The Best Spring Weekends for Stoop Sales in 2026", tags: ["Calendar", "Spring", "Tips"], city: "NYC", youtube: null },
  { title: "Stoop Sale Safety Tips: Protecting Yourself as a Seller", tags: ["Safety", "Sellers"], city: "NYC", youtube: null },
  { title: "Mid-Century Modern at Stoop Sales: How to Identify and Value Pieces", tags: ["Vintage", "Furniture", "Design"], city: "Brooklyn", youtube: "JjT-NSwOIns" },
  { title: "How Stoop Sales Are Fighting Loneliness in NYC", tags: ["Community", "Mental Health", "NYC"], city: "NYC", youtube: null },
  { title: "Baby Gear on a Budget: Finding Safe Secondhand Items at Stoop Sales", tags: ["Parenting", "Baby", "Buyers"], city: "NYC", youtube: null },
  { title: "Stoop Sales as a Side Hustle: Can You Make Real Money?", tags: ["Side Hustle", "Sellers", "Finance"], city: "NYC", youtube: null },
  { title: "How Thrift Influencers Are Changing the Stoop Sale Game in 2026", tags: ["Influencers", "Social Media", "Trends"], city: "NYC", youtube: "PnTD1kjM4W4" },
  { title: "NYC Permit Rules for Stoop Sales: Updated 2026 Guide", tags: ["Legal", "Permits", "NYC"], city: "NYC", youtube: null },
  { title: "The Psychology of Bargain Hunting: Why We Love Yard Sales", tags: ["Psychology", "Shopping"], city: "NYC", youtube: null },
  { title: "How to Make Your Stoop Sale Go Viral on TikTok", tags: ["TikTok", "Social Media", "Sellers"], city: "NYC", youtube: null },
  { title: "Staten Island's Best-Kept Stoop Sale Secret Neighborhoods", tags: ["Staten Island", "Neighborhood Guide"], city: "Staten Island", youtube: null },
  { title: "Antiques vs. Junk: Learning to Tell the Difference at Stoop Sales", tags: ["Antiques", "Vintage", "Buyers"], city: "NYC", youtube: "k7AGnTvfX9k" },
  { title: "Hosting a Multi-Family Stoop Sale on Your Block: A Step-by-Step Guide", tags: ["Multi-Family", "Sellers", "Community"], city: "Brooklyn", youtube: null },
  { title: "What to Do With Unsold Stoop Sale Items: Donate, Trash, or Resell?", tags: ["Sellers", "Decluttering", "Tips"], city: "NYC", youtube: null },
  { title: "The Eco-Friendly Home: How Stoop Sales Reduce Your Carbon Footprint", tags: ["Sustainability", "Eco-Friendly"], city: "NYC", youtube: null },
  { title: "Top 10 Most Surprising Finds at NYC Stoop Sales This Year", tags: ["NYC", "Finds", "Buyers"], city: "NYC", youtube: null },
  { title: "Selling Artwork at a Stoop Sale: Tips for Artists and Collectors", tags: ["Art", "Sellers", "Collectors"], city: "NYC", youtube: null },
  { title: "Recession Shopping: Why Stoop Sales Are Booming in 2026", tags: ["Economy", "Trends", "Buyers"], city: "NYC", youtube: null },
  { title: "How to Photograph Your Stoop Sale Items for Maximum Sales", tags: ["Photography", "Sellers", "Tips"], city: "NYC", youtube: "VsNGYY3ARYE" },
  { title: "The Best Times to Walk Your Block for Free Furniture in NYC", tags: ["Free Stuff", "NYC", "Buyers"], city: "NYC", youtube: null },
  { title: "Vintage Clothing at Stoop Sales: Building a Wardrobe for Under $50", tags: ["Fashion", "Vintage", "Budget"], city: "Brooklyn", youtube: null },
  { title: "How to Use Venmo and Cash App at Stoop Sales in 2026", tags: ["Payments", "Digital", "Sellers"], city: "NYC", youtube: null },
  { title: "NYC's Biggest Stoop Sale Weekends to Mark on Your 2026 Calendar", tags: ["Calendar", "Events", "NYC"], city: "NYC", youtube: null },
  { title: "From Chaos to Cash: Organizing Your Home Before a Stoop Sale", tags: ["Organizing", "Sellers", "Decluttering"], city: "NYC", youtube: "ihRfX9SdMd0" },
  { title: "Selling Books at a Stoop Sale: What's Worth Keeping and What Will Sell", tags: ["Books", "Sellers", "Collectibles"], city: "NYC", youtube: null },
  { title: "A Day in the Life of a Professional Stoop Sale Flipper in NYC", tags: ["Reselling", "NYC", "Side Hustle"], city: "NYC", youtube: null },
];

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const batchIndex = body.batchIndex ?? 0;
    const batchSize = 5;
    const batch = TOPICS.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

    if (batch.length === 0) {
      return Response.json({ success: true, message: 'All batches done', batchIndex });
    }

    const results = [];

    for (const topic of batch) {
      const slug = generateSlug(topic.title);

      // Check if slug already exists
      const existing = await base44.asServiceRole.entities.BlogPost.filter({ slug });
      if (existing.length > 0) {
        results.push({ slug, skipped: true });
        continue;
      }

      const youtubeEmbed = topic.youtube
        ? `\n\n<div class="video-embed">\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${topic.youtube}" frameborder="0" allowfullscreen></iframe>\n</div>\n\n`
        : '';

      const prompt = `You are a content writer for Stooplify.com — a platform for finding and listing yard sales, stoop sales, and garage sales in NYC and nearby cities.

Write a complete, SEO-optimized blog post for the following topic:
Title: "${topic.title}"
City/Focus: ${topic.city}
Tags: ${topic.tags.join(', ')}
Today's Date: March 2026

Requirements:
- Write in a conversational, helpful, slightly witty tone
- Length: 600-900 words
- Use markdown formatting with ## subheadings, bullet lists, and bold text
- Make it genuinely useful and specific — not generic fluff
- Reference current trends, spring 2026 context, NYC culture, and real neighborhoods where relevant
- Include at least 3-4 actionable tips
- End with a CTA to visit Stooplify.com to list or find yard sales
${topic.youtube ? `- The post has a YouTube video embed — reference it naturally in the content (e.g., "Watch the video below for more tips")` : ''}

Also provide:
- excerpt: 1-2 sentence engaging summary (160 chars max)
- meta_description: 150-160 char SEO description
- reading_time_minutes: estimated number (integer)

Respond ONLY in this JSON format:
{
  "content": "full markdown content here",
  "excerpt": "...",
  "meta_description": "...",
  "reading_time_minutes": 6
}`;

      const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            content: { type: "string" },
            excerpt: { type: "string" },
            meta_description: { type: "string" },
            reading_time_minutes: { type: "number" }
          }
        }
      });

      let content = aiResponse.content || '';
      if (topic.youtube && youtubeEmbed) {
        // Insert video after first major section
        const insertAfter = content.indexOf('\n\n## ');
        const secondSection = content.indexOf('\n\n## ', insertAfter + 5);
        if (secondSection > -1) {
          content = content.slice(0, secondSection) + youtubeEmbed + content.slice(secondSection);
        } else {
          content = content + youtubeEmbed;
        }
      }

      // Use an Unsplash image based on category
      const imageMap = {
        'Brooklyn': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=630&fit=crop',
        'Manhattan': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1200&h=630&fit=crop',
        'Queens': 'https://images.unsplash.com/photo-1593435117079-4e0b1e4e76b4?w=1200&h=630&fit=crop',
        'Bronx': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=630&fit=crop',
        'Staten Island': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&h=630&fit=crop',
        'Jersey City': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&h=630&fit=crop',
        'NYC': 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=1200&h=630&fit=crop',
      };

      const featuredImage = imageMap[topic.city] || imageMap['NYC'];

      await base44.asServiceRole.entities.BlogPost.create({
        title: topic.title,
        slug,
        content,
        excerpt: aiResponse.excerpt || topic.title,
        meta_description: aiResponse.meta_description || aiResponse.excerpt || topic.title,
        meta_keywords: topic.tags,
        tags: topic.tags,
        author_name: 'Stooplify Team',
        author_email: 'daniel@stooplify.com',
        publish_date: new Date().toISOString(),
        status: 'published',
        reading_time_minutes: aiResponse.reading_time_minutes || 6,
        featured_image_url: featuredImage,
        view_count: 0
      });

      results.push({ title: topic.title, slug, created: true });
      console.log(`Created: ${topic.title}`);
    }

    return Response.json({
      success: true,
      batchIndex,
      totalBatches: Math.ceil(TOPICS.length / batchSize),
      results
    });

  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});