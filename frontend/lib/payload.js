const PAYLOAD_URL = (
  process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001"
).replace(/\/+$/, ""); // skini završnu '/' da ne nastane '//api/...'

async function fetchAPI(
  path,
  { revalidate = 3600, tags = [], ...options } = {},
) {
  const url = `${PAYLOAD_URL}/api/${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      next: { revalidate, tags },
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) {
      console.error(`[Payload] ${res.status} ${url}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`[Payload] fetch failed: ${url}`, err.message);
    return null;
  }
}

// ─── Globals ──────────────────────────────────────────────────────────────────

export async function getHeader() {
  return fetchAPI("globals/header?depth=2", {
    revalidate: 86400,
    tags: ["header"],
  });
}

export async function getClients() {
  return fetchAPI("globals/clients?depth=1", {
    revalidate: 86400,
    tags: ["clients"],
  });
}

export async function getFooter() {
  return fetchAPI("globals/footer?depth=2", {
    revalidate: 86400,
    tags: ["footer"],
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts({
  page = 1,
  limit = 12,
  category,
  categories,
  search,
  sort = "-createdAt",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    depth: "2",
    sort,
    "where[_status][equals]": "published",
  });
  // `categories` (niz slug-ova) → svi proizvodi iz grane (parent + deca); inače jedan `category`.
  if (categories?.length) params.set("where[categories.slug][in]", categories.join(","));
  else if (category) params.set("where[categories.slug][equals]", category);
  if (search) params.set("where[or][0][title][like]", search);
  return fetchAPI(`products?${params}`, {
    revalidate: 1800,
    tags: ["products"],
  });
}

export async function getProduct(slug) {
  const data = await fetchAPI(
    `products?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 1800, tags: ["products", `product-${slug}`] },
  );
  return data?.docs?.[0] ?? null;
}

export async function getProductVariants(productId) {
  if (!productId) return [];
  const data = await fetchAPI(
    `variants?where[product][equals]=${productId}&where[_status][equals]=published&depth=2&limit=300`,
    { revalidate: 1800, tags: ["variants", `product-variants-${productId}`] },
  );
  return data?.docs ?? [];
}

// The single inquiry form ("Forma za ponudu") used across product/contact pages.
export async function getInquiryForm() {
  const data = await fetchAPI(`forms?limit=1&depth=1`, {
    revalidate: 86400,
    tags: ["forms"],
  });
  return data?.docs?.[0] ?? null;
}

export async function getFeaturedProducts(limit = 8) {
  return fetchAPI(
    `products?where[_status][equals]=published&sort=-createdAt&depth=2&limit=${limit}`,
    { revalidate: 3600, tags: ["products"] },
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  return fetchAPI("categories?limit=100&depth=2&sort=title", {
    revalidate: 86400,
    tags: ["categories"],
  });
}

export async function getCategory(slug) {
  const data = await fetchAPI(
    `categories?where[slug][equals]=${encodeURIComponent(slug)}&depth=3&limit=1`,
    { revalidate: 86400, tags: ["categories", `category-${slug}`] },
  );
  return data?.docs?.[0] ?? null;
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPage(slug) {
  const data = await fetchAPI(
    `pages?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 3600, tags: ["pages", `page-${slug}`] },
  );
  return data?.docs?.[0] ?? null;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getPosts({
  page = 1,
  limit = 9,
  category,
  sort = "-publishedOn",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    depth: "1",
    sort,
    "where[_status][equals]": "published",
  });
  if (category) params.set("where[categories.slug][equals]", category);
  return fetchAPI(`posts?${params}`, { revalidate: 3600, tags: ["posts"] });
}

export async function getPost(slug) {
  const data = await fetchAPI(
    `posts?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 3600, tags: ["posts", `post-${slug}`] },
  );
  return data?.docs?.[0] ?? null;
}

export async function getPostCategories() {
  return fetchAPI("post-categories?limit=50&sort=title", {
    revalidate: 86400,
    tags: ["post-categories"],
  });
}

// ─── Projekti (postovi u "gotovi-projekti" kategoriji) ──────────────────────────

const PROJECTS_CAT = "gotovi-projekti";

export async function getProjects({ page = 1, limit = 24 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    depth: "2",
    sort: "-publishedOn",
    "where[_status][equals]": "published",
    "where[categories.slug][equals]": PROJECTS_CAT,
  });
  return fetchAPI(`posts?${params}`, {
    revalidate: 3600,
    tags: ["posts", "projects"],
  });
}

export async function getProject(slug) {
  const data = await fetchAPI(
    `posts?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&depth=3&limit=1`,
    { revalidate: 3600, tags: ["posts", "projects", `project-${slug}`] },
  );
  return data?.docs?.[0] ?? null;
}

// Previous/next project relative to `slug`, in the same order as the /projekti
// listing (-publishedOn). Fetches a lean field set for all projects once.
export async function getAdjacentProjects(slug) {
  const params = new URLSearchParams({
    depth: "1",
    limit: "1000",
    sort: "-publishedOn",
    "where[_status][equals]": "published",
    "where[categories.slug][equals]": PROJECTS_CAT,
    "select[title]": "true",
    "select[slug]": "true",
    "select[excerpt]": "true",
    "select[featuredImage]": "true",
    "select[categories]": "true",
  });
  const data = await fetchAPI(`posts?${params}`, {
    revalidate: 3600,
    tags: ["posts", "projects"],
  });
  const docs = data?.docs ?? [];
  const i = docs.findIndex((d) => d.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: docs[i - 1] ?? null, next: docs[i + 1] ?? null };
}

// ─── Saveti (postovi u "saveti" kategoriji) ───────────────────────────────────

const ADVICE_CAT = "saveti";

export async function getAdvicePosts({ page = 1, limit = 9 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    depth: "2",
    sort: "-publishedOn",
    "where[_status][equals]": "published",
    "where[categories.slug][equals]": ADVICE_CAT,
  });
  return fetchAPI(`posts?${params}`, {
    revalidate: 3600,
    tags: ["posts", "saveti"],
  });
}

export async function getAdvicePost(slug) {
  const params = new URLSearchParams({
    depth: "3",
    limit: "1",
    "where[slug][equals]": slug,
    "where[_status][equals]": "published",
    "where[categories.slug][equals]": ADVICE_CAT,
  });
  const data = await fetchAPI(`posts?${params}`, {
    revalidate: 3600,
    tags: ["posts", "saveti", `saveti-${slug}`],
  });
  return data?.docs?.[0] ?? null;
}

export async function getAdjacentAdvicePosts(slug) {
  const params = new URLSearchParams({
    depth: "1",
    limit: "1000",
    sort: "-publishedOn",
    "where[_status][equals]": "published",
    "where[categories.slug][equals]": ADVICE_CAT,
    "select[title]": "true",
    "select[slug]": "true",
    "select[excerpt]": "true",
    "select[featuredImage]": "true",
    "select[categories]": "true",
  });
  const data = await fetchAPI(`posts?${params}`, {
    revalidate: 3600,
    tags: ["posts", "saveti"],
  });
  const docs = data?.docs ?? [];
  const i = docs.findIndex((d) => d.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: docs[i - 1] ?? null, next: docs[i + 1] ?? null };
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export async function getForm(id) {
  return fetchAPI(`forms/${id}?depth=1`, {
    revalidate: 86400,
    tags: ["forms"],
  });
}

export async function getAllPageSlugs() {
  const data = await fetchAPI(
    "pages?where[_status][equals]=published&limit=100&select[slug]=true&depth=0",
    {
      revalidate: 86400,
      tags: ["pages"],
    },
  );
  return (data?.docs ?? []).map((p) => p.slug).filter(Boolean);
}

export async function submitForm(formId, data) {
  return fetchAPI(`form-submissions`, {
    method: "POST",
    revalidate: 0,
    body: JSON.stringify({ form: formId, submissionData: data }),
  });
}

// ─── Search ───────────────────────────────────────────────────────────────────

// Jedinstvena pretraga nad proizvodima i postovima (saveti + gotovi-projekti).
// Vraća sirove docs; rutu posta rešava postPath() iz lib/routes.js.
export async function searchContent(query, { limit = 6 } = {}) {
  const q = (query ?? "").trim();
  if (q.length < 2) return { products: [], posts: [] };
  const enc = encodeURIComponent(q);

  const [productsRes, postsRes] = await Promise.all([
    fetchAPI(
      `products?where[_status][equals]=published&where[or][0][title][like]=${enc}&where[or][1][slug][like]=${enc}&depth=1&limit=${limit}&sort=-createdAt`,
      { revalidate: 120, tags: ["products", "search"] },
    ),
    fetchAPI(
      `posts?where[_status][equals]=published&where[or][0][title][like]=${enc}&where[or][1][excerpt][like]=${enc}&depth=1&limit=${limit}&sort=-createdAt`,
      { revalidate: 120, tags: ["posts", "search"] },
    ),
  ]);

  return {
    products: productsRes?.docs ?? [],
    posts: postsRes?.docs ?? [],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getMediaURL(media) {
  if (!media) return null;
  if (typeof media === "string") return `${PAYLOAD_URL}${media}`;
  if (media.url)
    return media.url.startsWith("http")
      ? media.url
      : `${PAYLOAD_URL}${media.url}`;
  return null;
}

export function buildSrcURL(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${PAYLOAD_URL}${url}`;
}
