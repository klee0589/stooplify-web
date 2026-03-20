import { useEffect } from 'react';

export default function SEO({ 
  title = 'Stooplify - Find Local Yard Sales & Garage Sales Near You',
  description = 'Discover amazing yard sales, garage sales, and estate sales in your neighborhood. Buy and sell locally with Stooplify - the digital marketplace for local treasures.',
  keywords = 'yard sale, garage sale, estate sale, local sales, secondhand, thrift, buy local, sell items, neighborhood sales',
  image = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png',
  url = typeof window !== 'undefined' ? `https://stooplify.com${window.location.pathname}${window.location.search}` : 'https://stooplify.com',
  type = 'website',
  robots = 'index, follow',
  structuredData
}) {
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update or create meta tags
    const updateMeta = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    // Update link tags
    const updateLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };
    
    // Standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    updateMeta('author', 'Stooplify');
    
    // Canonical URL
    updateLink('canonical', url);
    
    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', type, true);
    if (url) updateMeta('og:url', url, true);
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@stooplify');
    updateMeta('twitter:creator', '@stooplify');
    
    // Structured Data
    if (structuredData) {
      let script = document.getElementById('structured-data');
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
    
    return () => {
      // Cleanup structured data on unmount
      const script = document.getElementById('structured-data');
      if (script) script.remove();
    };
  }, [title, description, keywords, image, url, type, structuredData]);
  
  return null;
}