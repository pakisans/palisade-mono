'use client'

import { useState, useMemo } from 'react'
import FormClient from '@/components/blocks/FormClient'
import { formatPrice } from '@/lib/utils'

// Build ordered variant types (with their options) from the product's variants.
function buildTypes(variants) {
  const typeMap = new Map() // typeId -> { id, label, name, options: Map(optId -> {id,label}) }
  for (const v of variants ?? []) {
    for (const o of v.options ?? []) {
      if (typeof o !== 'object') continue
      const vt = o.variantType
      if (!vt || typeof vt !== 'object') continue
      if (!typeMap.has(vt.id)) typeMap.set(vt.id, { id: vt.id, label: vt.label, name: vt.name, options: new Map() })
      typeMap.get(vt.id).options.set(o.id, { id: o.id, label: o.label })
    }
  }
  return [...typeMap.values()].map((t) => ({ ...t, options: [...t.options.values()] }))
}

function optionIdsOf(variant) {
  return (variant.options ?? []).map((o) => (typeof o === 'object' ? o.id : o))
}

export default function ProductInquiry({ product, variants = [], form, phone }) {
  const types = useMemo(() => buildTypes(variants), [variants])
  const hasVariants = !!product?.enableVariants && variants.length > 0 && types.length > 0

  const [sel, setSel] = useState({}) // typeId -> optionId

  const matched = useMemo(() => {
    if (!hasVariants) return null
    if (types.some((t) => !sel[t.id])) return null
    const want = types.map((t) => sel[t.id])
    return (
      variants.find((v) => {
        const ids = optionIdsOf(v)
        return want.every((id) => ids.includes(id))
      }) || null
    )
  }, [sel, hasVariants, types, variants])

  const allSelected = hasVariants ? types.every((t) => sel[t.id]) : true

  // Price: matched variant → its price; else cheapest variant; else product price.
  const variantPrices = variants.map((v) => v.price).filter((p) => p > 0)
  const minVariant = variantPrices.length ? Math.min(...variantPrices) : 0
  const price = matched?.price ?? (hasVariants ? minVariant : product?.price) ?? 0

  const selectedLabel = hasVariants
    ? types.filter((t) => sel[t.id]).map((t) => t.options.find((o) => o.id === sel[t.id])?.label).filter(Boolean).join(', ')
    : ''
  const prefill = `${product?.title ?? ''}${selectedLabel ? ` - ${selectedLabel}` : ''}`

  // Relativna putanja - backend je apsolutizuje preko NEXT_PUBLIC_SERVER_URL,
  // pa nema SSR/CSR mismatch-a od window.location.origin.
  const productUrl = product?.slug ? `/proizvodi/${product.slug}` : ''

  return (
    <div className="space-y-5">
      {/* Price */}
      <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
        {price > 0 ? (
          <>
            {hasVariants && !matched && (
              <span className="text-sm font-medium text-gray-400">od</span>
            )}
            <span className="text-3xl font-extrabold text-brand tracking-tight">{formatPrice(price)}</span>
            {hasVariants && !matched && (
              <span className="text-sm text-gray-400">- izaberite opcije</span>
            )}
          </>
        ) : (
          <span className="text-xl font-bold text-gray-400">Cena na upit</span>
        )}
      </div>

      {/* Variant selectors */}
      {hasVariants && (
        <div className="space-y-4">
          {types.map((type) => (
            <div key={type.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{type.label}</span>
                {sel[type.id] && (
                  <span className="text-xs font-semibold text-brand">
                    {type.options.find((o) => o.id === sel[type.id])?.label}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {type.options.map((opt) => {
                  const active = sel[type.id] === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSel((s) => ({ ...s, [type.id]: active ? undefined : opt.id }))}
                      aria-pressed={active}
                      className={
                        active
                          ? 'inline-flex items-center h-9 px-3.5 rounded-xl border-2 border-brand bg-brand/[0.06] text-sm font-semibold text-brand transition-colors'
                          : 'inline-flex items-center h-9 px-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand/45 hover:text-brand transition-colors'
                      }
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry form - uvek vidljiva; varijanta je opciona i samo prefill-uje upit */}
      {form && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-card p-6 md:p-7">
          {phone?.href && (
            <a
              href={phone.href}
              className="group mb-6 flex items-center gap-4 rounded-xl bg-brand px-5 py-4 text-white shadow-brand-sm hover:bg-brand-600 transition-colors"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider opacity-90">
                  Kliknite da biste pozvali
                </span>
                <span className="block text-xl md:text-2xl font-extrabold leading-tight">{phone.label}</span>
              </span>
              <svg
                className="w-6 h-6 flex-shrink-0 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          )}
          <p className="text-lg font-extrabold text-gray-950 mb-1">Zatražite ponudu</p>
          <p className="text-sm text-gray-500 mb-5">
            {hasVariants && !allSelected
              ? 'Opciono izaberite varijantu iznad - ili odmah pošaljite upit; javljamo se sa ponudom u roku od 24h.'
              : 'Pošaljite upit - javljamo se sa ponudom u roku od 24h.'}
          </p>
          <FormClient
            formId={form.id}
            fields={form.fields ?? []}
            submitLabel={form.submitButtonLabel || 'Pošalji upit'}
            confirmationType={form.confirmationType}
            confirmationMessage={form.confirmationMessage}
            prefill={prefill}
            meta={{ 'proizvod-url': productUrl }}
            askInstallation
            privacyNote="Vaši podaci su sigurni i koriste se isključivo za pripremu ponude."
          />
        </div>
      )}
    </div>
  )
}
