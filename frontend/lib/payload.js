const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'

async function fetchAPI(path, { revalidate = 3600, tags = [], ...options } = {}) {
  const url = `${PAYLOAD_URL}/api/${path}`
  try {
    const res = await fetch(url, {
      ...options,
      next: { revalidate, tags },
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    if (!res.ok) {
      console.error(`[Payload] ${res.status} ${url}`)
      return null
    }
    return res.json()
  } catch (err) {
    console.error(`[Payload] fetch failed: ${url}`, err.message)
    return null
  }
}

// ─── Globals ──────────────────────────────────────────────────────────────────

export async function getHeader() {
  return fetchAPI('globals/header?depth=2', { revalidate: 86400, tags: ['header'] })
}

export async function getFooter() {
  return fetchAPI('globals/footer?depth=2', { revalidate: 86400, tags: ['footer'] })
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts({ page = 1, limit = 12, category, search, sort = '-createdAt' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    depth: '2',
    sort,
    'where[_status][equals]': 'published',
  })
  if (category) params.set('where[categories.slug][equals]', category)
  if (search)   params.set('where[or][0][title][like]', search)
  return fetchAPI(`products?${params}`, { revalidate: 1800, tags: ['products'] })
}

export async function getProduct(slug) {
  const data = await fetchAPI(
    `products?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 1800, tags: ['products', `product-${slug}`] },
  )
  return data?.docs?.[0] ?? null
}

export async function getFeaturedProducts(limit = 8) {
  return fetchAPI(
    `products?where[_status][equals]=published&sort=-createdAt&depth=2&limit=${limit}`,
    { revalidate: 3600, tags: ['products'] },
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  return fetchAPI('categories?limit=100&depth=2&sort=title', {
    revalidate: 86400,
    tags: ['categories'],
  })
}

export async function getCategory(slug) {
  const data = await fetchAPI(
    `categories?where[slug][equals]=${encodeURIComponent(slug)}&depth=3&limit=1`,
    { revalidate: 86400, tags: ['categories', `category-${slug}`] },
  )
  return data?.docs?.[0] ?? null
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPage(slug) {
  const data = await fetchAPI(
    `pages?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 3600, tags: ['pages', `page-${slug}`] },
  )
  return data?.docs?.[0] ?? null
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getPosts({ page = 1, limit = 9, category, sort = '-publishedOn' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    depth: '1',
    sort,
    'where[_status][equals]': 'published',
  })
  if (category) params.set('where[categories.slug][equals]', category)
  return fetchAPI(`posts?${params}`, { revalidate: 3600, tags: ['posts'] })
}

export async function getPost(slug) {
  const data = await fetchAPI(
    `posts?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 3600, tags: ['posts', `post-${slug}`] },
  )
  return data?.docs?.[0] ?? null
}

export async function getPostCategories() {
  return fetchAPI('post-categories?limit=50&sort=title', {
    revalidate: 86400,
    tags: ['post-categories'],
  })
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export async function getForm(id) {
  return fetchAPI(`forms/${id}?depth=1`, { revalidate: 86400, tags: ['forms'] })
}

export async function getAllPageSlugs() {
  const data = await fetchAPI('pages?where[_status][equals]=published&limit=100&select[slug]=true&depth=0', {
    revalidate: 86400,
    tags: ['pages'],
  })
  return (data?.docs ?? []).map(p => p.slug).filter(Boolean)
}

export async function submitForm(formId, data) {
  return fetchAPI(`form-submissions`, {
    method: 'POST',
    revalidate: 0,
    body: JSON.stringify({ form: formId, submissionData: data }),
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMediaURL(media) {
  if (!media) return null
  if (typeof media === 'string') return `${PAYLOAD_URL}${media}`
  if (media.url) return media.url.startsWith('http') ? media.url : `${PAYLOAD_URL}${media.url}`
  return null
}

export function buildSrcURL(url) {
  if (!url) return null
  return url.startsWith('http') ? url : `${PAYLOAD_URL}${url}`
}
