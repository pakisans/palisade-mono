import { permanentRedirect } from "next/navigation";
import { getCategory } from "@/lib/payload";
import { CATEGORY_BASE, categoryPath } from "@/lib/routes";

// Legacy path `/kategorije/<slug>` → 308 permanent redirect to the canonical
// palisada.rs-style path `/kategorija/<parent?>/<slug>`.
export const dynamic = "force-dynamic";

export default async function LegacyCategoryRedirect({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug).catch(() => null);
  permanentRedirect(`${(category ? categoryPath(category) : `${CATEGORY_BASE}/${slug}`).replace(/\/+$/, '')}/`);
}
