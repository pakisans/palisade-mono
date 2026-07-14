/**
 * Postavlja primaoca/pošiljaoca email-obaveštenja SVIH formi na office@palisada.rs.
 * (Form-builder šalje ove mailove kad se forma pošalje.)
 *
 * Seed menja samo sveže baze; ovo ažurira POSTOJEĆI form doc (lokalno i prod).
 * IDEMPOTENTNO — može se pokrenuti više puta.
 *
 * Usage:
 *   pnpm fix:form-recipient                 # DRY-RUN
 *   DRY_RUN=false pnpm fix:form-recipient   # upis
 *   RECIPIENT=neko@drugo.rs DRY_RUN=false pnpm fix:form-recipient
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const DRY_RUN = process.env.DRY_RUN !== 'false'
// Primalac (kome stižu upiti) — može se override-ovati RECIPIENT env-om (npr. za test).
const TO = process.env.RECIPIENT || 'office@palisada.rs'
// Pošiljalac MORA biti SMTP nalog (prodaja@) — Hostinger odbija ako se From ne poklapa.
const FROM = process.env.SENDER || `"Palisada" <${process.env.SMTP_USER || 'office@palisada.rs'}>`

// Lexical poruka koja UKLJUČUJE sve podatke iz upita ({{*:table}} = HTML tabela).
const txt = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})
const par = (...c: any[]) => ({
  type: 'paragraph',
  children: c,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})
const MESSAGE = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      par(txt('Novi upit za ponudu je primljen putem kontakt forme na sajtu:')),
      par(txt('{{*:table}}')),
    ],
  },
}

const run = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'forms', limit: 100, depth: 0 })
  console.log(`Formi: ${docs.length} | primalac (To) → ${TO} | pošiljalac (From) → ${FROM}`)

  let changed = 0
  for (const form of docs as any[]) {
    const emails = Array.isArray(form.emails) ? form.emails : []
    if (!emails.length) {
      console.log(`  – "${form.title}" nema emails blok, preskačem`)
      continue
    }

    const next = emails.map((e: any) => ({ ...e, emailTo: TO, emailFrom: FROM, message: MESSAGE }))

    console.log(
      `  ${DRY_RUN ? '[dry-run] ' : ''}✎ "${form.title}": primalac → ${TO}, poruka + {{*:table}}`,
    )
    if (!DRY_RUN) {
      await payload.update({ collection: 'forms', id: form.id, data: { emails: next } as any })
    }
    changed++
  }

  console.log(
    `\n${DRY_RUN ? '🔎 DRY-RUN — ništa nije upisano.' : '✅ Upis završen.'} Izmenjeno formi: ${changed}`,
  )
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
