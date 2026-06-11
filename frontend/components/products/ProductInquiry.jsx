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

export default function ProductInquiry({ product, variants = [], form }) {
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
  const prefill = `${product?.title ?? ''}${selectedLabel ? ` — ${selectedLabel}` : ''}`

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
              <span className="text-sm text-gray-400">— izaberite opcije</span>
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

      {/* Inquiry form — only after a variation is selected (or for simple products) */}
      {allSelected && form ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-card p-6 md:p-7">
          <p className="text-lg font-extrabold text-gray-950 mb-1">Zatražite ponudu</p>
          <p className="text-sm text-gray-500 mb-5">
            {hasVariants
              ? 'Pošaljite upit za izabranu varijantu — javljamo se sa ponudom u roku od 24h.'
              : 'Pošaljite upit za ovaj proizvod — javljamo se sa ponudom u roku od 24h.'}
          </p>
          <FormClient
            formId={form.id}
            fields={form.fields ?? []}
            submitLabel={form.submitButtonLabel || 'Pošalji upit'}
            confirmationType={form.confirmationType}
            confirmationMessage={form.confirmationMessage}
            prefill={prefill}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-6 text-center">
          <p className="text-sm font-semibold text-gray-600">
            Izaberite {types.filter((t) => !sel[t.id]).map((t) => t.label.toLowerCase()).join(', ')} da biste zatražili ponudu.
          </p>
        </div>
      )}
    </div>
  )
}
