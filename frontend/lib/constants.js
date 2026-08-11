// Technical-only constants — NO editorial content.
// All business content (nav, contact, social, text) comes exclusively from Payload CMS.

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Palisada d.o.o.';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://palisada.rs';

// Indeksiranje: dok smo na privremenom/staging domenu — sve noindex,nofollow.
// Na produkciji (pravi domen) postaviti NEXT_PUBLIC_ALLOW_INDEXING=true.
export const INDEXABLE = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

// Google Search Console — HTML tag verifikacija za palisada.rs.
// Prenet sa starog WP sajta (Rank Math → google_verification). Javan podatak, ne menja se.
export const GOOGLE_SITE_VERIFICATION = 'dPK8ePLH0Q034fONkVIxEo1f3NlYFxJz0NMzZF9bxEg';

// GA4 — javan Measurement ID, ne menja se.
// Aktivan samo na pravom domenu (isti INDEXABLE flag kao robots), da staging
// i lokalni dev ne zagađuju property lažnim saobraćajem.
export const GA_MEASUREMENT_ID = 'G-PR0K5XC114';
export const ANALYTICS_ENABLED = INDEXABLE && !!GA_MEASUREMENT_ID;
