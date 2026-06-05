import Link from 'next/link'

export const metadata = { title: 'Stranica nije pronađena' }

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center">
      <div className="container-site">
        <div className="max-w-lg mx-auto text-center py-20">
          <p className="text-[120px] font-extrabold text-gray-100 leading-none select-none">404</p>
          <h1 className="font-extrabold text-2xl md:text-3xl text-gray-950 tracking-tight mt-2 mb-3">
            Stranica nije pronađena
          </h1>
          <p className="text-gray-500 mb-8 text-base leading-relaxed">
            Stranica koju tražite ne postoji ili je premještena. Provjerite URL ili se vratite na naslovu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center h-11 px-7 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-600 transition-colors shadow-brand-sm"
            >
              Naslovna strana
            </Link>
            <Link
              href="/proizvodi"
              className="inline-flex items-center h-11 px-7 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Pogledajte proizvode
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
