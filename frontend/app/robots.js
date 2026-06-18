import { INDEXABLE } from '@/lib/constants';

export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://palisada.rs';

  // Staging/privremeni domen → blokiraj cео sajt i ne objavljuj sitemap.
  if (!INDEXABLE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
