import type { Field } from 'payload'

/**
 * Virtuelne kolone za listu `form-submissions` - izvučene iz `submissionData`,
 * da se upit vidi bez otvaranja. Nema kolone u bazi (bez migracije),
 * vrednost se računa u afterRead. U edit prikazu su skrivene (tamo je ionako cela tabela).
 */

type Entry = { field?: string; value?: unknown }

const clean = (v: unknown) => String(v ?? '').trim()

export const valueOf = (data: unknown, key: string | RegExp): string => {
  const rows: Entry[] = Array.isArray(data) ? data : []
  const hit = rows.find((r) => (typeof key === 'string' ? r?.field === key : key.test(r?.field || '')))
  return clean(hit?.value)
}

const preview = (
  name: string,
  label: string,
  compute: (rows: unknown) => string,
  truncate = false,
): Field => ({
  name,
  label,
  type: 'text',
  virtual: true,
  admin: {
    readOnly: true,
    // Samo kolona u listi; u formi za izmenu se ne prikazuje.
    condition: () => false,
    ...(truncate ? { components: { Cell: '@/components/admin/TruncateCell#TruncateCell' } } : {}),
  },
  hooks: {
    afterRead: [({ siblingData }) => compute(siblingData?.submissionData) || null],
  },
})

export const previewFields: Field[] = [
  preview('pregledIme', 'Ime i prezime', (d) => valueOf(d, 'ime-prezime') || valueOf(d, /ime|name/i)),
  preview('pregledTelefon', 'Telefon', (d) => valueOf(d, 'telefon')),
  preview('pregledEmail', 'Email', (d) => valueOf(d, 'email')),
  preview(
    'pregledProizvod',
    'Proizvod',
    (d) => valueOf(d, 'proizvod') || (valueOf(d, 'stranica-url').includes('/kontakt') ? 'Kontakt' : ''),
    true,
  ),
  preview('pregledMontaza', 'Montaža', (d) => {
    const montaza = valueOf(d, 'montaza')
    const lokacija = valueOf(d, 'lokacija-montaze')
    return montaza && lokacija ? `${montaza} - ${lokacija}` : montaza
  }),
  preview('pregledUpit', 'Upit', (d) => valueOf(d, 'detalji'), true),
]
