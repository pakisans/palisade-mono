/**
 * Šalje test mail kroz ISTI email adapter koji koristi form-builder.
 * Provera transporta bez slanja stvarne forme.
 *
 * Usage:
 *   TO=neko@primer.rs pnpm test:email          # lokalno
 *   docker exec app1 node -e "..."             # na serveru vidi smtp-debug workflow
 *
 * Napomena: payload.sendEmail je namerno fire-and-forget (vidi payload.config.ts),
 * pa ovde ne dobijamo messageId direktno — ishod se ispisuje u payload logeru.
 * Zato skript čeka par sekundi pre izlaska da log stigne.
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const TO = process.env.TO || process.env.SMTP_USER || 'office@palisada.rs'

const run = async () => {
  const payload = await getPayload({ config })

  const smtpConfigured = Boolean(process.env.SMTP_HOST)
  console.log(
    `SMTP_HOST=${process.env.SMTP_HOST || '(nije postavljen — Payload koristi mock adapter)'} ` +
      `SMTP_PORT=${process.env.SMTP_PORT} SMTP_USER=${process.env.SMTP_USER} ` +
      `lozinka iz ${process.env.SMTP_PASS_B64 ? 'SMTP_PASS_B64' : 'SMTP_PASS'}`,
  )
  if (!smtpConfigured) {
    console.warn('⚠️  SMTP_HOST nije postavljen — mail NEĆE otići na pravi server.')
  }

  console.log(`→ Šaljem test mail na ${TO} ...`)
  await payload.sendEmail({
    to: TO,
    subject: 'Test mail — Palisada backend',
    html: '<p>Ako si primio ovaj mail, SMTP transport backenda radi.</p>',
  })

  // Slanje je u pozadini; sačekaj da se "SMTP poslato"/"SMTP slanje nije uspelo" ispiše.
  await new Promise((r) => setTimeout(r, 15000))
  console.log('Gotovo — pogledaj log liniju iznad (SMTP poslato / SMTP slanje nije uspelo).')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
