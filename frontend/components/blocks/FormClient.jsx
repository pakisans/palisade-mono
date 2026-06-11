'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import RichText from '@/components/ui/RichText'
import { cn } from '@/lib/utils'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'

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

function Field({ field, value, onChange, error, defaultValue }) {
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
          defaultValue={defaultValue}
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

export default function FormClient({ formId, fields, submitLabel, confirmationType, confirmationMessage, prefill: prefillProp }) {
  const searchParams = useSearchParams()
  const prefill      = prefillProp || searchParams.get('proizvod') // pre-fill (prop or ?proizvod=)

  const [values, setValues]   = useState({})
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')

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
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setStatus('submitting')

    // Merge prefill into the message-type field if present
    const submissionData = Object.entries(values).map(([fieldName, value]) => ({
      field: fieldName,
      value: String(value),
    }))

    try {
      const res = await fetch(`${PAYLOAD_URL}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formId, submissionData }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setStatus('success')
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
          <span className="font-semibold">Upit za:</span> {decodeURIComponent(prefill)}
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
                defaultValue={field.blockType === 'textarea' && prefill ? decodeURIComponent(prefill) : undefined}
              />
              {errors[field.name] && (
                <p id={`${field.name}-error`} className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          )
        })}
      </div>

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
