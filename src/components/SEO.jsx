import { useEffect, useRef } from 'react';

const DEFAULT_IMAGE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/283ee8687_logo_v2.png';

export default function SEO({ 
  title = 'Find Yard Sales & Stoop Sales Near You | Stooplify',
  description = 'Discover yard sales, stoop sales, and garage sales near you in NYC and beyond. List your own sale for free.',
  keywords = 'yard sale, stoop sale, garage sale, nyc, brooklyn',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  robots = 'index, follow',
  canonical,
  structuredData,
  breadcrumbs,
  noindex = false,
}) {
  const scriptRefs = useRef([]);

  useEffect(() => {
    const finalUrl = canonical || url || (typeof window !== 'undefined' ? `https://stooplify.com${window.location.pathname}` : 'https://stooplify.com');
    const finalRobots = noindex ? 'noindex, nofollow' : robots;

    // Title
    document.title = title;

    // Helper to set/create meta tag
    const setMeta = (attr, value, content) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to set/create link tag
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', finalRobots);
    setMeta('name', 'author', 'Stooplify');

    // Canonical
    setLink('canonical', finalUrl);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', finalUrl);
    setMeta('property', 'og:site_name', 'Stooplify');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image || DEFAULT_IMAGE);
    setMeta('name', 'twitter:site', '@stooplify');
    setMeta('name', 'twitter:creator', '@stooplify');

    // Clean up previously injected structured data scripts
    scriptRefs.current.forEach(s => s.remove());
    scriptRefs.current = [];

    const addScript = (data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      scriptRefs.current.push(script);
    };

    // Structured data (array or single object)
    if (structuredData) {
      const items = Array.isArray(structuredData) ? structuredData : [structuredData];
      items.forEach(addScript);
    }

    // Breadcrumbs schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      addScript({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": crumb.name,
          "item": crumb.url,
        }))
      });
    }

    return () => {
      scriptRefs.current.forEach(s => s.remove());
      scriptRefs.current = [];
    };
  }, [title, description, keywords, image, url, canonical, type, robots, noindex, structuredData, breadcrumbs]);

  return null;
}