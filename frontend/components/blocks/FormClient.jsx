'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import RichText from '@/components/ui/RichText'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/gtag'

// skini završnu '/' da ne nastane '//api/...' (redirect ruši CORS preflight na POST-u)
const PAYLOAD_URL = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/+$/, '')

// `prefill` dolazi ili iz prop-a (nekodiran) ili iz ?proizvod= (kodiran) -
// decodeURIComponent puca na golom '%' u nazivu proizvoda, pa ide kroz try.
const safeDecode = (v) => {
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

// ─── Field renderers ──────────────────────────────────────────────────────────

function FieldLabel({ field }) {
  if (!field.label) return null
  return (
    <label htmlFor={field.name} className="block text-sm font-semibold text-gray-800 mb-1.5">
      {field.label}
      {field.required && <span className="text-brand ml-0.5" aria-hidden="true">*</span>}
    </label>
  )
}

const inputCls =
  'w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all'

function Field({ field, value, onChange, error }) {
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${field.name}-error` : undefined,
  }

  switch (field.blockType) {
    case 'textarea':
      return (
        <textarea
          {...common}
          rows={5}
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={cn(inputCls, 'h-auto py-3 resize-y min-h-[120px]', error && 'border-red-300 focus:border-red-400 focus:ring-red-100')}
        />
      )
    case 'select':
      return (
        <select
          {...common}
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={cn(inputCls, error && 'border-red-300')}
        >
          <option value="">Izaberite...</option>
          {(field.options ?? []).map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            {...common}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand/30"
          />
          <span className="text-sm text-gray-600">{field.label}{field.required && <span className="text-brand ml-0.5">*</span>}</span>
        </label>
      )
    case 'number':
      return (
        <input
          {...common}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={cn(inputCls, error && 'border-red-300 focus:border-red-400 focus:ring-red-100')}
        />
      )
    case 'email':
      return (
        <input
          {...common}
          type="email"
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={cn(inputCls, error && 'border-red-300 focus:border-red-400 focus:ring-red-100')}
        />
      )
    case 'text':
    default:
      return (
        <input
          {...common}
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={cn(inputCls, error && 'border-red-300 focus:border-red-400 focus:ring-red-100')}
        />
      )
  }
}

const widthCls = {
  100: 'col-span-12',
  50:  'col-span-12 sm:col-span-6',
  33:  'col-span-12 sm:col-span-4',
}

// ─── Form ─────────────────────────────────────────────────────────────────────

// useSearchParams() forsira CSR bailout → mora u Suspense granicu da bi
// se stranica statički prerenderovala (Next.js zahtev). Wrapper ispod to radi.
export default function FormClient(props) {
  return (
    <Suspense fallback={null}>
      <FormInner {...props} />
    </Suspense>
  )
}

// Pitanje o montaži postoji samo na formi proizvoda (askInstallation).
// Form builder nema uslovna polja, pa se šalje kao meta red (vidi META_LABELS u backendu).
function InstallationQuestion({ montaza, lokacija, errors, onMontaza, onLokacija }) {
  const pill = (active) =>
    active
      ? 'inline-flex items-center justify-center h-10 min-w-[72px] px-4 rounded-xl border-2 border-brand bg-brand/[0.06] text-sm font-semibold text-brand transition-colors'
      : 'inline-flex items-center justify-center h-10 min-w-[72px] px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand/45 hover:text-brand transition-colors'

  return (
    <div className="mt-5 space-y-5">
      <div>
        <p id="montaza-label" className="block text-sm font-semibold text-gray-800 mb-1.5">
          Da li je potrebna montaža?
          <span className="text-brand ml-0.5" aria-hidden="true">*</span>
        </p>
        <div
          role="radiogroup"
          aria-labelledby="montaza-label"
          aria-invalid={errors.montaza ? 'true' : undefined}
          aria-describedby={errors.montaza ? 'montaza-error' : undefined}
          className="flex gap-2"
        >
          {[['da', 'Da'], ['ne', 'Ne']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              role="radio"
              aria-checked={montaza === val}
              onClick={() => onMontaza(val)}
              className={pill(montaza === val)}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.montaza && <p id="montaza-error" className="text-xs text-red-500 mt-1">{errors.montaza}</p>}
      </div>

      {montaza === 'da' && (
        <div>
          <label htmlFor="lokacija-montaze" className="block text-sm font-semibold text-gray-800 mb-1.5">
            Lokacija montaže
            <span className="text-brand ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="lokacija-montaze"
            name="lokacija-montaze"
            type="text"
            required
            placeholder="Grad / mesto ili adresa"
            value={lokacija}
            onChange={(e) => onLokacija(e.target.value)}
            aria-invalid={errors['lokacija-montaze'] ? 'true' : undefined}
            aria-describedby={errors['lokacija-montaze'] ? 'lokacija-montaze-error' : undefined}
            className={cn(inputCls, errors['lokacija-montaze'] && 'border-red-300 focus:border-red-400 focus:ring-red-100')}
          />
          {errors['lokacija-montaze'] && (
            <p id="lokacija-montaze-error" className="text-xs text-red-500 mt-1">{errors['lokacija-montaze']}</p>
          )}
        </div>
      )}
    </div>
  )
}

function FormInner({ formId, fields, submitLabel, confirmationType, confirmationMessage, prefill: prefillProp, meta, askInstallation = false }) {
  const searchParams = useSearchParams()
  const prefill      = prefillProp || searchParams.get('proizvod') // pre-fill (prop or ?proizvod=)

  const [values, setValues]   = useState({})
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')
  const [montaza, setMontaza]   = useState('') // '' | 'da' | 'ne'
  const [lokacija, setLokacija] = useState('')

  const handleMontaza = (val) => {
    setMontaza(val)
    if (val === 'ne') setLokacija('')
    setErrors((e) => ({ ...e, montaza: undefined, ...(val === 'ne' ? { 'lokacija-montaze': undefined } : {}) }))
  }

  const handleLokacija = (val) => {
    setLokacija(val)
    setErrors((e) => (e['lokacija-montaze'] ? { ...e, 'lokacija-montaze': undefined } : e))
  }

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }

  const validate = () => {
    const next = {}
    for (const field of fields) {
      if (field.required && field.blockType !== 'checkbox' && !values[field.name]?.toString().trim()) {
        next[field.name] = 'Ovo polje je obavezno.'
      }
      if (field.required && field.blockType === 'checkbox' && !values[field.name]) {
        next[field.name] = 'Obavezno.'
      }
      if (field.blockType === 'email' && values[field.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[field.name])) {
        next[field.name] = 'Unesite ispravnu email adresu.'
      }
    }
    if (askInstallation) {
      if (!montaza) next.montaza = 'Izaberite da ili ne.'
      if (montaza === 'da' && !lokacija.trim()) next['lokacija-montaze'] = 'Ovo polje je obavezno.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setStatus('submitting')

    const submissionData = Object.entries(values).map(([fieldName, value]) => ({
      field: fieldName,
      value: String(value),
    }))

    // Meta redovi - backend (beforeEmail) ih prepoznaje po nazivu i prikazuje
    // na vrhu emaila. Bez njih upit sa proizvoda izgleda isto kao sa /kontakt.
    const metaEntries = {
      ...(prefill ? { proizvod: safeDecode(prefill) } : {}),
      ...(askInstallation
        ? {
            montaza: montaza === 'da' ? 'Da' : 'Ne',
            ...(montaza === 'da' ? { 'lokacija-montaze': lokacija.trim() } : {}),
          }
        : {}),
      ...(meta ?? {}),
      'stranica-url': typeof window !== 'undefined' ? window.location.href : '',
    }
    for (const [field, value] of Object.entries(metaEntries)) {
      if (value == null || String(value).trim() === '') continue
      submissionData.push({ field, value: String(value) })
    }

    try {
      const res = await fetch(`${PAYLOAD_URL}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setStatus('success')
      // Jedina konverzija na sajtu. `prefill` nosi naziv proizvoda + varijantu
      // (ProductInquiry), pa GA4 daje razlaganje leadova po proizvodu.
      trackEvent('generate_lead', {
        form_id: formId,
        ...(prefill ? { item_name: safeDecode(prefill) } : {}),
      })
    } catch (err) {
      setStatus('error')
      setServerError('Došlo je do greške pri slanju. Pokušajte ponovo ili nas pozovite.')
    }
  }

  // ── Success state ──
  if (status === 'success') {
    return (
      <div className="text-center py-6" role="status">
        <div className="w-14 h-14 rounded-full bg-brand/[0.1] flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {confirmationType === 'message' && confirmationMessage ? (
          <RichText
            content={confirmationMessage}
            className="[&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-gray-950 [&_h2]:mb-2 [&_p]:text-gray-500 [&_p]:leading-relaxed"
          />
        ) : (
          <>
            <h3 className="text-xl font-extrabold text-gray-950 mb-2">Hvala na upitu!</h3>
            <p className="text-gray-500">Kontaktiraćemo vas u najkraćem roku.</p>
          </>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Prefill notice */}
      {prefill && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-brand/[0.06] border border-brand/15 text-sm text-gray-700">
          <span className="font-semibold">Upit za:</span> {safeDecode(prefill)}
        </div>
      )}

      <div className="grid grid-cols-12 gap-x-4 gap-y-5">
        {fields.map((field, i) => {
          // checkbox renders its own label
          if (field.blockType === 'checkbox') {
            return (
              <div key={i} className={widthCls[field.width] || 'col-span-12'}>
                <Field field={field} value={values[field.name]} onChange={handleChange} error={errors[field.name]} />
                {errors[field.name] && <p id={`${field.name}-error`} className="text-xs text-red-500 mt-1">{errors[field.name]}</p>}
              </div>
            )
          }
          return (
            <div key={i} className={widthCls[field.width] || 'col-span-12'}>
              <FieldLabel field={field} />
              <Field
                field={field}
                value={values[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
              />
              {errors[field.name] && (
                <p id={`${field.name}-error`} className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          )
        })}
      </div>

      {askInstallation && (
        <InstallationQuestion
          montaza={montaza}
          lokacija={lokacija}
          errors={errors}
          onMontaza={handleMontaza}
          onLokacija={handleLokacija}
        />
      )}

      {serverError && (
        <p className="text-sm text-red-500 mt-4" role="alert">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 w-full h-12 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-600 transition-colors shadow-brand-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Šalje se...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}
