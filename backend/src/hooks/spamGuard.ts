import { APIError, type CollectionBeforeValidateHook } from 'payload'
import { checkRole } from '@/access/utilities'

/**
 * Antispam zaštita za `form-submissions` (javni create).
 *
 * Frontend (FormClient) šalje dva tehnička reda u `submissionData`:
 *  - `_hp`      honeypot polje, čovek ga ne vidi pa mora biti prazno
 *  - `_elapsed` ms od prikaza forme do slanja
 * Oba se ovde uklanjaju pre snimanja, pa ne idu ni u bazu ni u email.
 *
 * Bacanje greške u beforeValidate sprečava snimanje i slanje emaila (afterChange).
 */

const MIN_ELAPSED_MS = 3000
const TECH_FIELDS = new Set(['_hp', '_elapsed'])

type Entry = { field: string; value: unknown }

const str = (v: unknown) => String(v ?? '').trim()

/** Jedan dugačak token sa nasumičnim velikim/malim slovima, npr. "bTOrRwIBbpErULlWKpfGSeq". */
export const looksLikeGibberish = (value: unknown): boolean => {
  const v = str(value)
  if (v.length < 10 || /\s/.test(v) || !/^[A-Za-z]+$/.test(v)) return false
  const switches = (v.match(/[a-z][A-Z]/g) || []).length
  return switches >= 3
}

/** Gmail "dot trick": t.e.z.o.p.i.d@gmail.com */
const tooManyDots = (email: unknown): boolean => {
  const local = str(email).split('@')[0] || ''
  return (local.match(/\./g) || []).length >= 4
}

export const spamGuard: CollectionBeforeValidateHook = async ({ data, req, operation }) => {
  if (operation !== 'create' || !data) return data
  if (req.user && checkRole(['admin'], req.user as any)) return data

  const all: Entry[] = Array.isArray(data.submissionData) ? data.submissionData : []
  const get = (name: string) => all.find((s) => s?.field === name)?.value
  const entries = all.filter((s) => s && !TECH_FIELDS.has(s.field))

  const reject = (reason: string) => {
    const ip = req.headers?.get?.('x-forwarded-for') || req.headers?.get?.('x-real-ip') || 'unknown'
    req.payload.logger.warn(`spamGuard: odbijen upit (${reason}) ip=${ip}`)
    throw new APIError('Upit nije poslat.', 400)
  }

  if (!entries.length) reject('prazan submissionData')
  if (str(get('_hp'))) reject('honeypot')

  const elapsed = Number(get('_elapsed'))
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) reject(`elapsed=${get('_elapsed') ?? 'nema'}`)

  // Obavezna polja iz definicije forme (form builder ih ne proverava na serveru).
  const formId = typeof data.form === 'object' ? data.form?.id : data.form
  if (!formId) reject('nema forme')
  let form: any
  try {
    form = await req.payload.findByID({ collection: 'forms', id: formId, depth: 0, overrideAccess: true, req })
  } catch {
    reject('nepostojeća forma')
  }
  for (const f of form?.fields || []) {
    if (!f?.name || !f.required) continue
    const value = entries.find((s) => s.field === f.name)?.value
    if (f.blockType === 'checkbox' ? !value || value === 'false' : !str(value)) reject(`fali polje ${f.name}`)
  }

  const nameEntry = entries.find((s) => /ime|name/i.test(s.field))
  if (nameEntry && looksLikeGibberish(nameEntry.value)) reject('gibberish ime')
  if (looksLikeGibberish(get('detalji'))) reject('gibberish poruka')

  const emailEntry = entries.find((s) => /e-?mail/i.test(s.field))
  if (emailEntry && tooManyDots(emailEntry.value)) reject('email dot trick')

  return { ...data, submissionData: entries }
}
