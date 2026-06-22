/**
 * Centralna definicija svih URL putanja.
 * Mjenjati SAMO ovdje — sve komponente čitaju odavde.
 *
 * Kategorije koriste putanju kao palisada.rs (SEO): `/kategorija/<slug>` za glavne i
 * `/kategorija/<parent>/<dete>` za podkategorije.
 */

export const CATEGORY_BASE = '/kategorija' // jednina — kao na palisada.rs

// Puna (ugnježdena) putanja kategorije. `byId` (mapa id→kategorija) je opciono,
// koristi se da se razreši roditelj kad je `parent` samo id.
export function categoryPath(category, byId = null) {
  if (!category) return CATEGORY_BASE
  if (typeof category === 'string') return `${CATEGORY_BASE}/${category}`
  const slug = category.slug
  const parent = category.parent
  let parentSlug = null
  if (parent && typeof parent === 'object') parentSlug = parent.slug
  else if (parent != null && byId && byId[parent]) parentSlug = byId[parent].slug
  return parentSlug ? `${CATEGORY_BASE}/${parentSlug}/${slug}` : `${CATEGORY_BASE}/${slug}`
}

// Ruta posta zavisi od kategorije: gotovi-projekti → /projekti, ostalo (saveti) → /saveti.
export function postPath(post) {
  if (!post?.slug) return '/saveti'
  const cats = (post.categories ?? [])
    .map((c) => (typeof c === 'object' ? c?.slug : null))
    .filter(Boolean)
  return cats.includes('gotovi-projekti') ? `/projekti/${post.slug}` : `/saveti/${post.slug}`
}

// Tip posta za grupisanje/badge u pretrazi.
export function postType(post) {
  const cats = (post?.categories ?? [])
    .map((c) => (typeof c === 'object' ? c?.slug : null))
    .filter(Boolean)
  return cats.includes('gotovi-projekti') ? 'projekat' : 'savet'
}

export const routes = {
  home:        '/',
  products:    '/proizvodi',
  blog:        '/blog',
  about:       '/o-nama',
  contact:     '/kontakt',
  privacy:     '/privatnost',
  terms:       '/uslovi',
  sitemap:     '/mapa-sajta',

  product:   (slug) => `/proizvodi/${slug}`,
  category:  (slug) => `${CATEGORY_BASE}/${slug}`,
  post:      (slug) => `/blog/${slug}`,
  brand:     (slug) => `/brendovi/${slug}`,
}
