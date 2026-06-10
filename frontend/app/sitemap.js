import {
  getProducts,
  getCategories,
  getPosts,
  getAdvicePosts,
} from '@/lib/payload';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://palisade.rs';

export default async function sitemap() {
  const staticRoutes = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/o-nama`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/proizvodi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/saveti`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE}/saveti`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const [productsData, categoriesData, postsData, adviceData] =
    await Promise.all([
      getProducts({ limit: 200 }).catch(() => null),
      getCategories().catch(() => null),
      getPosts({ limit: 100 }).catch(() => null),
      getAdvicePosts({ limit: 100 }).catch(() => null),
    ]);

  const productRoutes = (productsData?.docs ?? []).map((p) => ({
    url: `${BASE}/proizvodi/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryRoutes = (categoriesData?.docs ?? []).map((c) => ({
    url: `${BASE}/kategorije/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postRoutes = (postsData?.docs ?? []).map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const adviceRoutes = (adviceData?.docs ?? []).map((post) => ({
    url: `${BASE}/saveti/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...postRoutes,
    ...adviceRoutes,
  ];
}
