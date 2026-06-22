import {
  getProducts,
  getCategories,
  getProjects,
  getAdvicePosts,
} from '@/lib/payload';
import { categoryPath } from '@/lib/routes';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://palisada.rs';

export default async function sitemap() {
  const now = new Date();
  const staticRoutes = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    {
      url: `${BASE}/proizvodi`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/projekti`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/saveti`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE}/o-nama`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/kontakt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/politika-privatnosti`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE}/pravila-o-kolacicima`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const [productsData, categoriesData, projectsData, adviceData] =
    await Promise.all([
      getProducts({ limit: 500 }).catch(() => null),
      getCategories().catch(() => null),
      getProjects({ limit: 500 }).catch(() => null),
      getAdvicePosts({ limit: 200 }).catch(() => null),
    ]);

  const productRoutes = (productsData?.docs ?? []).map((p) => ({
    url: `${BASE}/proizvodi/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const catsById = Object.fromEntries(
    (categoriesData?.docs ?? []).map((c) => [c.id, c]),
  );
  const categoryRoutes = (categoriesData?.docs ?? []).map((c) => ({
    url: `${BASE}${categoryPath(c, catsById)}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const projectRoutes = (projectsData?.docs ?? []).map((p) => ({
    url: `${BASE}/projekti/${p.slug}`,
    lastModified: new Date(p.updatedAt),
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
    ...projectRoutes,
    ...adviceRoutes,
  ].map((r) => ({
    ...r,
    // trailingSlash:true → svaki URL u sitemap-u sa završnom kosom crtom (izbegava 308 pri craw-u)
    url: r.url.endsWith('/') ? r.url : `${r.url}/`,
  }));
}
