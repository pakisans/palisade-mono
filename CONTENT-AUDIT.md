# Palisade — Content & SEO Audit

> Izvor istine: **live Payload CMS** (`http://localhost:3001`).
> Referentni sajt korišćen samo kao inspiracija za strukturu: `https://kapije-ograde.rs`.
> **Nije** kreirana nijedna nova kategorija ni proizvod. Sve dole koristi postojeće zapise.

---

## 0. Inventar postojećeg CMS-a

| Tip | Količina | Stanje |
|-----|----------|--------|
| Kategorije | **26** | gotovo sve bez `seo`, `description`, `image`, `content` |
| Proizvodi | **77** | opisi ✓, galerije ✓, meta ✓ — samo **2** rupe |
| Stranice | **3** (`home`, `kontakt`, `o-nama`) | OK |

### Kategorije (26) — hijerarhija
```
Kapije (kapije)
├── Pešačke kapije (pesacke-kapije)
├── Dvokrilne kapije (dvokrilne-kapije)
├── Klizne kapije (klizne-kapije)
├── Samonosive kapije (samonosive-kapije)
└── Jednokrilne kapije (jednokrilne-kapije)
Ograde (ograde)
├── 3D panelne ograde (3d-panelne-ograde)
├── 2D panelne ograde (2d-panelne-ograde)
├── Panelne ograde (panelne-ograde)
├── Aluminijumske ograde (aluminijumske-ograde)
└── Dekorativne ograde (dekorativne-ograde)
Automatizacija kapija (automatizacija-kapija)
├── Motori za krilne kapije (motori-za-krilne-kapije)
└── Motori za klizne i samonosive kapije (motori-za-klizne-i-samonosive-kapije)
Kontrola pristupa (kontrola-pristupa)
├── Kontrola pristupa vozila (kontrola-pristupa-vozila)
└── Kontrola pristupa ljudi (kontrola-pristupa-ljudi)
Visoka sigurnost (visoka-sigurnost)
Oprema i dodaci (oprema-i-dodaci)
├── Locinox dodaci (locinox-dodaci)
├── Oprema za krilne kapije (oprema-za-krilne-kapije)
├── Oprema za samonosive kapije (oprema-za-samonosive-kapije)
├── Dodaci za ograde (dodaci-za-ograde)
├── DEL PONTI dodaci (del-ponti-dodaci)
└── HI MOTIONS oprema (hi-motions-oprema)
```

---

## 1. Missing Pages Report

| Stranica | Referentni sajt | Naš CMS | Akcija |
|----------|:---:|:---:|--------|
| Naslovna (`home`) | ✓ | ✓ | — |
| O nama (`o-nama`) | ✓ | ✓ | — |
| Kontakt (`kontakt`) | ✓ | ✓ | — |
| Saveti / Blog (`/blog`) | ✓ `/saveti` | ✓ (3 posta) | — |
| **Projekti (`projekti`)** | ✓ `/projekti` | ✗ | **KREIRATI** — showcase galerija realizovanih projekata |
| **Politika privatnosti (`privatnost`)** | — | ✗ (link u footeru → 404) | **KREIRATI** — pravna stranica |
| **Uslovi korišćenja (`uslovi`)** | — | ✗ (link u footeru → 404) | **KREIRATI** — pravna stranica |

> Footer već linkuje `/privatnost` i `/uslovi` ali stranice ne postoje → 404. Catch-all `[slug]` ruta će ih servirati čim postoje u CMS-u.

---

## 2. Missing Sections Report

### Kategorije (svih 26) — nedostaje kompletan landing sadržaj
Svaka kategorija ima polja `description`, `image`, `content` (flexibleContent), `seo` — **sva prazna**. Potrebno po kategoriji:

| Sekcija | Polje u CMS-u | Status |
|---------|---------------|:---:|
| Intro tekst (H1 + uvod) | `description` | ✗ |
| Long-form sadržaj | `content` → `content` blok | ✗ |
| FAQ | `content` → `faq` blok | ✗ |
| CTA | `content` → `cta` blok | ✗ |
| Hero slika | `image` | ✗ (predlog mapiranja u §5) |

### Naslovna — opciono proširenje (postoji, ali bez ovih)
- `projekti` showcase traka (link ka novoj Projekti stranici)
- Logo traka klijenata (LIDL, Coca-Cola, Frikom, Idea — pomenuti u `o-nama`)

---

## 3. Missing SEO Report

### ⚠️ BUG — frontend čita pogrešno polje
- Kategorije čuvaju SEO u **`seo`** grupi (`seo.title`, `seo.description`, `seo.image`).
- Frontend `app/kategorije/[slug]/page.jsx` čita `category.meta?.title` → **uvek prazno**, pada na fallback.
- **Fix primijenjen** u ovom radu: čita `category.seo` (sa `meta` fallbackom).

### SEO pokrivenost
| Tip | Ima SEO | Nedostaje |
|-----|:---:|:---:|
| Kategorije | 0 / 26 | **26** |
| Proizvodi | 76 / 77 | 1 (`locinox-slimstone-2-sifarnik`) |
| Stranice | 3 / 3 | 0 (+ 3 nove stranice treba SEO) |

→ Kompletni SEO naslovi/opisi za svih 26 kategorija u `category-content.ts`.

---

## 4. Missing FAQ Report

Nijedna kategorija nema FAQ. Referentni sajt ima FAQ na kategorijama kapija/ograda.
Generisan FAQ (3–5 pitanja) za **9 kupcu-okrenutih** kategorija:
`kapije`, `ograde`, `pesacke-kapije`, `dvokrilne-kapije`, `klizne-kapije`, `samonosive-kapije`, `3d-panelne-ograde`, `2d-panelne-ograde`, `aluminijumske-ograde`.

B2B/dodatne kategorije (oprema, dodaci, automatizacija, kontrola pristupa) dobijaju SEO + intro + CTA (bez FAQ — katalog-buckets).

---

## 5. Missing Image Mapping Report

> Koriste se samo slike relevantne za postojeće kategorije. Slike se preuzimaju iz galerija **postojećih proizvoda** te kategorije (već u CMS-u) — nije potreban uvoz sa referentnog sajta.

| Kategorija | Hero slika — izvor (postojeći proizvod u CMS-u) |
|------------|--------------------------------------------------|
| `3d-panelne-ograde` | prva slika proizvoda *Panelna ograda EUROFENCE 3D* |
| `2d-panelne-ograde` | prva slika *Panelna ograda DOUBLEFENCE 2D* |
| `panelne-ograde` | *Panelna ograda EUROFENCE 3D* (deli sa 3D) |
| `aluminijumske-ograde` | *Aluminijumska Pešačka kapija* galerija |
| `pesacke-kapije` | *Pešačka kapija LIGHT* / *STANDARD* |
| `dvokrilne-kapije` | *Dvokrilna kapija* proizvod |
| `klizne-kapije` | *Klizna kapija* proizvod |
| `samonosive-kapije` | *Samonosiva kapija* proizvod |
| `jednokrilne-kapije` | *Jednokrilna kapija* proizvod |
| `kapije` (parent) | montažna foto — *Pešačka kapija LIGHT* |
| `ograde` (parent) | *Panelna ograda EUROFENCE 3D* |
| Oprema/dodaci/automatizacija/kontrola | prva slika prvog proizvoda u toj kategoriji |

**Strategija mapiranja (automatska):** enrichment skripta za svaku kategoriju bez slike postavlja `image` = prva slika prvog objavljenog proizvoda u toj kategoriji. Tako se ne uvozi ništa novo — reuse postojećih medija.

---

## 6 & 7. Seed additions + JSON

- TS seed: `backend/src/endpoints/seed/category-content.ts`
- Runner: `backend/src/scripts/enrich-content.ts` (`pnpm enrich:content`)
- JSON export: `backend/src/endpoints/seed/category-content.json`

Skripta je **idempotentna** i **non-destruktivna**: popunjava samo prazna polja, ne dira proizvode, relacije ni postojeće stranice.

---

## Quality Check

### Kategorije
| Provjera | Pokriveno |
|----------|-----------|
| Landing ruta (`/kategorije/[slug]`) | ✓ sve 26 (dinamička ruta) |
| SEO (`seo.title` + `seo.description`) | ✓ sve 26 |
| FAQ | ✓ 9 kupcu-okrenutih (ostale: katalog buckets) |
| CTA | ✓ sve 26 |
| Slika | ✓ auto-mapiranje iz proizvoda |
| Long-form | ✓ 9 glavnih; intro za ostale |

### Proizvodi
| Provjera | Pokriveno |
|----------|-----------|
| Opis | ✓ 77/77 |
| SEO | 76/77 → **fix**: `locinox-slimstone-2-sifarnik` dobija meta |
| Slike | 76/77 → `sigurnosna-inox-spojnica-za-panelnu-ogradu` bez slike (nema izvora u WC exportu — flag za ručni upload) |
| CTA | ✓ na svakoj product stranici (frontend) |
| Interni linkovi | ✓ breadcrumb + kategorija + srodni (frontend) |
