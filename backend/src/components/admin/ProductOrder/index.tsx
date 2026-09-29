'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, FieldLabel, useConfig, useDocumentInfo, useField } from '@payloadcms/ui'
import type { RelationshipFieldClientProps } from 'payload'

type Row = {
  id: number
  title: string
  status?: string
  thumb?: string | null
  createdAt: string
}

type ProductDoc = {
  id: number
  title?: string
  _status?: string
  createdAt: string
  gallery?: { image?: number | { thumbnailURL?: string | null; url?: string | null } }[] | null
}

const toId = (v: unknown): number | null => {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && 'id' in v) return Number((v as { id: number }).id)
  if (typeof v === 'string' && v) return Number(v)
  return null
}

const byNewest = (a: Row, b: Row) => b.createdAt.localeCompare(a.createdAt)

// Spoji sačuvani redosled sa trenutnim proizvodima kategorije:
// sačuvani (i dalje u kategoriji) idu prvi, novi se dodaju na kraj od najnovijeg,
// a proizvodi koji više nisu u kategoriji ispadaju.
const mergeOrder = (savedIds: number[], rows: Row[]): Row[] => {
  const byId = new Map(rows.map((r) => [r.id, r]))
  const ordered = savedIds.map((id) => byId.get(id)).filter((r): r is Row => Boolean(r))
  const seen = new Set(ordered.map((r) => r.id))
  const rest = rows.filter((r) => !seen.has(r.id)).sort(byNewest)
  return [...ordered, ...rest]
}

export function ProductOrder(props: RelationshipFieldClientProps) {
  const { field, path: pathProp } = props
  const path = pathProp ?? field.name
  const { value, setValue } = useField<(number | { id: number })[] | null>({ path })
  const { id: categoryId } = useDocumentInfo()
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const initialValue = useRef(value)

  const load = useCallback(async () => {
    if (!categoryId) return
    setError(null)
    try {
      const base = `${serverURL ?? ''}${api}`
      const childrenRes = await fetch(
        `${base}/categories?where[parent][equals]=${categoryId}&depth=0&pagination=false&select[id]=true`,
        { credentials: 'include' },
      )
      const children = childrenRes.ok ? ((await childrenRes.json()).docs as { id: number }[]) : []
      // Parent prikazuje celu granu (kao frontend), child samo svoje proizvode.
      const ids = [categoryId, ...children.map((c) => c.id)].join(',')

      const productsRes = await fetch(
        `${base}/products?where[categories][in]=${ids}&depth=1&pagination=false&draft=true` +
          `&select[title]=true&select[_status]=true&select[createdAt]=true&select[gallery]=true`,
        { credentials: 'include' },
      )
      if (!productsRes.ok) throw new Error(`HTTP ${productsRes.status}`)
      const docs = (await productsRes.json()).docs as ProductDoc[]

      const fetched: Row[] = docs.map((d) => {
        const img = d.gallery?.[0]?.image
        return {
          id: d.id,
          title: d.title || `#${d.id}`,
          status: d._status,
          thumb: img && typeof img === 'object' ? img.thumbnailURL || img.url : null,
          createdAt: d.createdAt,
        }
      })

      const savedIds = (initialValue.current ?? []).map(toId).filter((v): v is number => v !== null)
      setRows(mergeOrder(savedIds, fetched))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri učitavanju')
    }
  }, [api, categoryId, serverURL])

  useEffect(() => {
    void load()
  }, [load])

  const commit = (next: Row[]) => {
    setRows(next)
    setValue(next.map((r) => r.id))
  }

  const move = (from: number, to: number) => {
    if (!rows || from === to) return
    const next = [...rows]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    commit(next)
  }

  const reset = () => {
    if (!rows) return
    setRows([...rows].sort(byNewest))
    setValue([])
  }

  const isCustom = Array.isArray(value) && value.length > 0

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <FieldLabel label={field.label || 'Redosled proizvoda'} path={path} />
      <p style={{ color: 'var(--theme-elevation-500)', margin: '0 0 calc(var(--base) / 2)' }}>
        Prevuci proizvode da podesiš redosled na stranici kategorije, pa sačuvaj. Novi proizvodi se
        automatski dodaju na kraj.
        {isCustom ? '' : ' Trenutno: podrazumevani redosled (najnoviji prvi).'}
      </p>

      {!categoryId && <p>Sačuvaj kategoriju pa podesi redosled.</p>}
      {error && <p style={{ color: 'var(--theme-error-500)' }}>Greška: {error}</p>}
      {categoryId && !rows && !error && <p>Učitavanje proizvoda...</p>}
      {rows && rows.length === 0 && <p>Nema proizvoda u ovoj kategoriji.</p>}

      {rows && rows.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Button buttonStyle="secondary" size="small" onClick={reset} disabled={!isCustom}>
              Reset (najnoviji prvi)
            </Button>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rows.map((row, i) => (
              <li
                key={row.id}
                draggable
                onDragStart={(e) => {
                  setDragIndex(i)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (overIndex !== i) setOverIndex(i)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragIndex !== null) move(dragIndex, i)
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                onDragEnd={() => {
                  setDragIndex(null)
                  setOverIndex(null)
                }}
                style={{
                  alignItems: 'center',
                  background: 'var(--theme-elevation-50)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderTop:
                    overIndex === i && dragIndex !== null && dragIndex > i
                      ? '2px solid var(--theme-success-500)'
                      : undefined,
                  borderBottom:
                    overIndex === i && dragIndex !== null && dragIndex < i
                      ? '2px solid var(--theme-success-500)'
                      : undefined,
                  borderRadius: 4,
                  cursor: 'grab',
                  display: 'flex',
                  gap: 12,
                  marginBottom: 4,
                  opacity: dragIndex === i ? 0.4 : 1,
                  padding: '6px 10px',
                }}
              >
                <span aria-hidden style={{ color: 'var(--theme-elevation-400)', userSelect: 'none' }}>
                  ⋮⋮
                </span>
                <span style={{ color: 'var(--theme-elevation-500)', minWidth: 28, textAlign: 'right' }}>
                  {i + 1}.
                </span>
                {row.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.thumb}
                    alt=""
                    width={40}
                    height={40}
                    style={{ borderRadius: 3, objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ background: 'var(--theme-elevation-150)', borderRadius: 3, height: 40, width: 40 }} />
                )}
                <span style={{ flex: 1 }}>
                  {row.title}
                  {row.status === 'draft' && (
                    <span style={{ color: 'var(--theme-warning-500)', fontSize: 12, marginLeft: 8 }}>
                      draft
                    </span>
                  )}
                </span>
                <Button
                  buttonStyle="subtle"
                  size="small"
                  margin={false}
                  disabled={i === 0}
                  onClick={() => move(i, 0)}
                  tooltip="Na vrh"
                >
                  ↑↑
                </Button>
                <Button
                  buttonStyle="subtle"
                  size="small"
                  margin={false}
                  disabled={i === rows.length - 1}
                  onClick={() => move(i, rows.length - 1)}
                  tooltip="Na dno"
                >
                  ↓↓
                </Button>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
