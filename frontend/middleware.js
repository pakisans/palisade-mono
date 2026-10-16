import { NextResponse } from "next/server";

// Runtime redirekcije iz Payload kolekcije `redirects` (uređuju se u adminu).
// Lista se drži u memoriji i osvežava najviše jednom u TTL periodu, pa izmena
// u adminu stiže na sajt u roku od ~1 min, bez rebuild-a.

const PAYLOAD_URL = (
  process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001"
).replace(/\/+$/, "");

const TTL_MS = 60 * 1000;

let cache = { map: null, fetchedAt: 0 };
let inflight = null;

const normalize = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

async function loadRedirects() {
  const res = await fetch(
    `${PAYLOAD_URL}/api/redirects?limit=0&depth=0&pagination=false`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const map = new Map();
  for (const r of data?.docs || []) {
    if (r?.from && r?.to) map.set(normalize(r.from), { to: r.to, type: r.type });
  }
  return map;
}

async function getRedirects() {
  const fresh = cache.map && Date.now() - cache.fetchedAt < TTL_MS;
  if (fresh) return cache.map;

  if (!inflight) {
    inflight = loadRedirects()
      .then((map) => {
        cache = { map, fetchedAt: Date.now() };
      })
      .catch((err) => {
        // Fail open: zadrži poslednju listu (ili nijednu) i probaj ponovo posle TTL-a.
        console.error("[redirects] fetch failed:", err.message);
        cache = { map: cache.map || new Map(), fetchedAt: Date.now() };
      })
      .finally(() => {
        inflight = null;
      });
  }
  await inflight;
  return cache.map;
}

export async function middleware(request) {
  const map = await getRedirects();
  if (!map.size) return NextResponse.next();

  let pathname = request.nextUrl.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // neispravan encoding, koristi sirovu putanju
  }

  const hit = map.get(normalize(pathname));
  if (!hit) return NextResponse.next();

  const status = hit.type === "302" ? 302 : 301;
  return NextResponse.redirect(new URL(hit.to, request.url), status);
}

export const config = {
  // Samo stranice: preskoči _next, api i fajlove sa ekstenzijom (slike, sitemap.xml...).
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"],
};
