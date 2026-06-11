import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'
import ScrollReveal from '@/components/ui/ScrollReveal'

// Fallback client names (text chips) when no logo images are provided from the CMS.
// Mirrors the reference site "Preko 700 firmi ogradila je PALISADA".
const FALLBACK_CLIENTS = [
  'LIDL', 'Roda', 'IDEA', 'Frikom', 'Coca-Cola', 'Telekom',
  'Delhaize', 'Metro', 'Nelt', 'Knjaz Miloš', 'Štark', 'Univerexport',
]

function LogoItem({ logo }) {
  // String logos render as text chips; only object logos resolve to an image URL.
  const isObject = logo && typeof logo === 'object'
  const url = isObject ? getMediaURL(logo.image || logo) : null
  const alt = (isObject && (logo.alt || logo.name)) || 'Klijent'
  if (url) {
    return (
      <div className="flex-shrink-0 flex items-center justify-center h-12 w-36 px-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
        <Image src={url} alt={alt} width={144} height={48} className="max-h-12 w-auto object-contain" />
      </div>
    )
  }
  return (
    <span className="flex-shrink-0 flex items-center justify-center h-12 px-6 text-lg font-extrabold tracking-tight text-gray-300 select-none">
      {typeof logo === 'string' ? logo : alt}
    </span>
  )
}

export default function ClientLogos({ logos, title = 'Preko 700 firmi ogradila je PALISADA' }) {
  const items = logos?.length ? logos : FALLBACK_CLIENTS
  // Duplicate the row so the marquee loops seamlessly (-50% translate).
  const loop = [...items, ...items]

  return (
    <section className="section-y-sm bg-white border-y border-gray-100" aria-labelledby="clients-heading">
      <div className="container-site">
        <ScrollReveal className="text-center mb-10">
          <span className="eyebrow justify-center mb-3">Poverenje</span>
          <h2 id="clients-heading" className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight mt-3">
            {title}
          </h2>
        </ScrollReveal>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden mask-fade-x" aria-hidden="true">
        <div className="flex w-max items-center gap-4 animate-marquee hover:[animation-play-state:paused]">
          {loop.map((logo, i) => (
            <LogoItem key={i} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  )
}
