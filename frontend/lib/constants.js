// Technical-only constants — NO editorial content.
// All business content (nav, contact, social, text) comes exclusively from Payload CMS.

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Palisada d.o.o.';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://palisada.rs';

// Indeksiranje: dok smo na privremenom/staging domenu — sve noindex,nofollow.
// Na produkciji (pravi domen) postaviti NEXT_PUBLIC_ALLOW_INDEXING=true.
export const INDEXABLE = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
