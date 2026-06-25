import Image from 'next/image'

// Jedinstveni placeholder kad slika fali — brand-mark logo na neutralnoj podlozi.
// `dark` za kartice sa belim tekstom preko slike (tamna podloga).
// `markClassName` za veličinu/vidljivost znaka (npr. veći u malim thumb-ovima).
export default function ImageFallback({
  dark = false,
  className = '',
  markClassName = 'w-1/3 max-w-[96px] opacity-25',
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${dark ? 'bg-gray-900' : 'bg-gray-100'} ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/brand-mark.png"
        alt=""
        width={160}
        height={157}
        className={`h-auto ${markClassName} ${dark ? 'brightness-150' : ''}`}
      />
    </div>
  )
}
