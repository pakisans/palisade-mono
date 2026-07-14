/**
 * Brendirani HTML šablon za email obaveštenja sa kontakt forme (Palisada).
 * Email-safe (tabele + inline stilovi), radi u Gmail/Outlook/Apple Mail.
 */

const BRAND = '#8FC640'
const DARK = '#0F1012'
const GRAY = '#54585B'
const LIGHT = '#f4f5f7'
const BORDER = '#e5e7eb'

const esc = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')

export type EmailRow = { label: string; value: unknown }

export function renderFormEmail(rows: EmailRow[], opts?: { customerName?: string; siteUrl?: string }): string {
  const siteUrl = opts?.siteUrl || 'https://palisada.rs'
  const year = new Date().getFullYear()

  const rowsHtml = rows
    .filter((r) => String(r.value ?? '').trim() !== '')
    .map(
      (r, i) => `
      <tr>
        <td style="padding:14px 20px;background:${i % 2 ? '#ffffff' : LIGHT};border-bottom:1px solid ${BORDER};font-size:12px;font-weight:700;color:${GRAY};text-transform:uppercase;letter-spacing:.4px;width:38%;vertical-align:top;">${esc(r.label)}</td>
        <td style="padding:14px 20px;background:${i % 2 ? '#ffffff' : LIGHT};border-bottom:1px solid ${BORDER};font-size:15px;color:${DARK};line-height:1.5;">${esc(r.value)}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="sr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${LIGHT};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT};padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,16,18,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:28px 32px;">
            <span style="font-size:22px;font-weight:800;letter-spacing:1px;color:#ffffff;">PALISADA<span style="color:${BRAND};">.</span></span>
            <div style="margin-top:6px;font-size:13px;color:#9aa0a6;">Novi upit sa sajta</div>
          </td>
        </tr>

        <!-- Accent bar -->
        <tr><td style="height:4px;background:${BRAND};font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Intro -->
        <tr>
          <td style="padding:28px 32px 8px;">
            <h1 style="margin:0 0 6px;font-size:20px;color:${DARK};font-weight:800;">Nov upit za ponudu${opts?.customerName ? ` — ${esc(opts.customerName)}` : ''}</h1>
            <p style="margin:0;font-size:14px;color:${GRAY};line-height:1.6;">Primljen je novi upit putem kontakt forme. Detalji su ispod:</p>
          </td>
        </tr>

        <!-- Data table -->
        <tr>
          <td style="padding:20px 32px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
              ${rowsHtml}
            </table>
          </td>
        </tr>

        <!-- CTA hint -->
        <tr>
          <td style="padding:8px 32px 28px;">
            <p style="margin:0;font-size:13px;color:${GRAY};line-height:1.6;">Odgovorite direktno na email klijenta ili ga pozovite na navedeni broj telefona.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${LIGHT};padding:20px 32px;border-top:1px solid ${BORDER};">
            <p style="margin:0;font-size:12px;color:#9aa0a6;line-height:1.6;">
              Automatska poruka sa <a href="${esc(siteUrl)}" style="color:${GRAY};text-decoration:underline;">${esc(siteUrl.replace(/^https?:\/\//, ''))}</a> &middot; &copy; ${year} Palisada
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
