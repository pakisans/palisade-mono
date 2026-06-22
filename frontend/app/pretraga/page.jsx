import Link from 'next/link'
import { searchContent } from '@/lib/payload'
import { postType } from '@/lib/routes'
import ProductCard from '@/components/products/ProductCard'
import AdviceCardClassic from '@/components/advice/AdviceCardClassic'
import ProjectCardClassic from '@/components/projects/ProjectCardClassic'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const q = (Array.isArray(sp?.q) ? sp.q[0] : sp?.q || '').trim()
  return {
    title: q ? `Pretraga: ${q}` : 'Pretraga',
    description: 'Pretraga proizvoda, saveta i projekata.',
    robots: { index: false, follow: false }, // search stranice se ne indeksiraju
    alternates: { canonical: '/pretraga/' },
  }
}

function plural(n) {
  if (n === 1) return 'rezultat'
  if (n >= 2 && n <= 4) return 'rezultata'
  return 'rezultata'
}

function Section({ title, count, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-baseline gap-2 mb-5">
        <h2 className="text-xl font-extrabold text-gray-950 tracking-tight">{title}</h2>
        <span className="text-sm font-medium text-gray-400">{count}</span>
      </div>
      {children}
    </section>
  )
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams
  const term = (Array.isArray(sp?.q) ? sp.q[0] : sp?.q || '').trim()

  const { products, posts } =
    term.length >= 2 ? await searchContent(term, { limit: 24 }) : { products: [], posts: [] }
  const saveti = posts.filter((p) => postType(p) === 'savet')
  const projekti = posts.filter((p) => postType(p) === 'projekat')
  const total = products.length + posts.length

  return (
    <div className="container-site section-y-sm">
      {/* Naslov + pretraga */}
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">Pretraga</h1>

        <form method="GET" action="/pretraga/" role="search" className="relative mt-5">
          <label htmlFor="q" className="sr-only">Pretraži</label>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 4a6 6 0 100 12A6 6 0 008 4zM18 18l-4-4" />
          </svg>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={term}
            placeholder="Pretraži proizvode, savete, projekte…"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
          />
        </form>

        {term ? (
          <p className="mt-3 text-sm text-gray-500">
            {total} {plural(total)} za „<span className="font-semibold text-gray-800">{term}</span>"
          </p>
        ) : (
          <p className="mt-3 text-sm text-gray-400">Unesite pojam (najmanje 2 slova).</p>
        )}
      </div>

      {term.length >= 2 && total === 0 && (
        <div className="py-16 text-center">
          <p className="font-semibold text-gray-700">Nema rezultata za „{term}".</p>
          <p className="mt-1 text-sm text-gray-400">
            Probajte drugi pojam ili pregledajte{' '}
            <Link href="/proizvodi" className="font-semibold text-brand hover:text-brand-700">sve proizvode</Link>.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <Section title="Proizvodi" count={products.length}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </Section>
      )}

      {saveti.length > 0 && (
        <Section title="Saveti" count={saveti.length}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saveti.map((p) => <AdviceCardClassic key={p.id} post={p} />)}
          </div>
        </Section>
      )}

      {projekti.length > 0 && (
        <Section title="Projekti" count={projekti.length}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projekti.map((p) => <ProjectCardClassic key={p.id} project={p} />)}
          </div>
        </Section>
      )}
    </div>
  )
}
