import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount, currency = 'RSD') {
  if (!amount || amount === 0) return 'Cena na upit'
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[šŠ]/g, 's').replace(/[čČćĆ]/g, 'c')
    .replace(/[žŽ]/g, 'z').replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str, len = 120) {
  if (!str || str.length <= len) return str
  return str.slice(0, len).replace(/\s+\S*$/, '') + '…'
}

export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function absoluteUrl(path) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://palisade.rs'
  return `${base}${path}`
}

export function formatDate(dateStr, locale = 'sr-RS') {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

/**
 * Resolves a Payload CMS link object into { href, label, newTab }.
 * Handles both 'custom' (direct URL) and 'reference' (relationship) link types.
 */
export function resolveLink(link) {
  if (!link) return { href: '#', label: '', newTab: false }

  const label  = link.label ?? ''
  const newTab = link.newTab ?? false

  if (link.type === 'reference' && link.reference?.value) {
    const { relationTo, value } = link.reference
    const slug = typeof value === 'object' ? value.slug : value
    const paths = {
      pages:             slug === 'home' ? '/' : `/${slug}`,
      products:          `/proizvodi/${slug}`,
      categories:        `/kategorije/${slug}`,
      posts:             `/blog/${slug}`,
      brands:            `/brendovi/${slug}`,
      'post-categories': `/blog?kategorija=${slug}`,
    }
    return { href: paths[relationTo] ?? '/', label, newTab }
  }

  return { href: link.url || '#', label, newTab }
}

/**
 * Extracts a single link item from Payload's link group array (hero.links[n].link).
 */
export function resolveHeroLink(linkItem) {
  if (!linkItem?.link) return null
  return {
    ...resolveLink(linkItem.link),
    appearance: linkItem.link.appearance ?? 'default',
  }
}
