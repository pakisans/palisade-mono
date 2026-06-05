/**
 * Category content & SEO enrichment data.
 *
 * Source of truth = live CMS categories. NO new categories/products are created.
 * This file only PROVIDES content; `enrichCategories()` fills EMPTY fields only.
 *
 * Field mapping (Categories collection):
 *   seo:         { title, description }       ← SEO
 *   description: string (textarea)            ← H1 intro paragraph
 *   image:       upload (auto-mapped from first product if empty)
 *   content:     flexibleContent blocks       ← long-form + FAQ + CTA
 */

import type { Payload } from 'payload'

// ─── Lexical helpers ───────────────────────────────────────────────────────────

const txt = (text: string) => ({ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 })
const p   = (text: string) => ({ type: 'paragraph', children: [txt(text)], direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })
const h   = (text: string, tag: 'h2' | 'h3' = 'h2') => ({ type: 'heading', tag, children: [txt(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const ul  = (items: string[]) => ({
  type: 'list', listType: 'bullet', start: 1, tag: 'ul', direction: 'ltr', format: '', indent: 0, version: 1,
  children: items.map((t, i) => ({ type: 'listitem', value: i + 1, children: [txt(t)], direction: 'ltr', format: '', indent: 0, version: 1 })),
})
const root = (...children: any[]) => ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } })

// ─── Block builders ──────────────────────────────────────────────────────────

const contentBlock = (...nodes: any[]) => ({
  blockType: 'content',
  columns: [{ size: 'full', richText: root(...nodes) }],
})

const faqBlock = (heading: string, items: { q: string; a: string }[]) => ({
  blockType: 'faq',
  heading,
  items: items.map(({ q, a }) => ({ question: q, answer: root(p(a)) })),
})

const ctaBlock = (title: string, body: string, links: { label: string; url: string; appearance?: 'default' | 'outline' }[]) => ({
  blockType: 'cta',
  richText: root(h(title), p(body)),
  links: links.map((l) => ({ link: { type: 'custom', appearance: l.appearance || 'default', label: l.label, url: l.url } })),
})

// ─── Reusable CTA presets ──────────────────────────────────────────────────────

const QUOTE_CTA = ctaBlock(
  'Zatražite besplatnu ponudu',
  'Dolazimo na merenje bez naknade i šaljemo detaljnu ponudu u roku od 24 sata. Pokrivamo Beograd i celu Srbiju.',
  [{ label: 'Zatražite ponudu', url: '/kontakt' }, { label: 'Svi proizvodi', url: '/proizvodi', appearance: 'outline' }],
)

type CatContent = {
  seoTitle: string
  seoDescription: string
  intro: string
  blocks?: any[]
}

// ─── Content map (keyed by slug) ─────────────────────────────────────────────────

export const CATEGORY_CONTENT: Record<string, CatContent> = {

  // ═══ PARENT: KAPIJE ═══
  kapije: {
    seoTitle: 'Kapije po meri — pešačke, dvokrilne, klizne i samonosive | Palisade',
    seoDescription: 'Izrada i montaža svih vrsta kapija u Beogradu i Srbiji: pešačke, dvokrilne, klizne i samonosive. Sve dimenzije, sve RAL boje, sa automatizacijom. Besplatno merenje.',
    intro: 'Projektujemo i izrađujemo kapije po meri — od pešačkih i dvokrilnih do kliznih i samonosivih. Svaka kapija je prilagođena vašem prostoru, sa opcijom automatizacije i kontrole pristupa.',
    blocks: [
      contentBlock(
        h('Kapije za svaki tip objekta'),
        p('Kapija je prvi utisak vašeg objekta i ključni element bezbednosti. U Palisade-u izrađujemo kapije od cinkovanog čelika i aluminijuma, plastificirane u boji po RAL paleti, prilagođene stambenim, poslovnim i industrijskim objektima.'),
        h('Koju vrstu kapije izabrati?', 'h3'),
        ul([
          'Pešačke kapije — za ulaz pešaka, samostalno ili uz veću kapiju',
          'Dvokrilne kapije — klasičan izgled, otvaranje na dve strane',
          'Klizne kapije — štede prostor, idealne uz automatizaciju',
          'Samonosive kapije — bez šine u tlu, za neravne podloge',
        ]),
        p('Sve kapije se mogu automatizovati i povezati sa sistemima kontrole pristupa (daljinski, tastatura, čitač kartica, interfon).'),
      ),
      faqBlock('Česta pitanja o kapijama', [
        { q: 'Koliko traje izrada kapije po meri?', a: 'Standardni rok izrade je 7 do 30 radnih dana, u zavisnosti od tipa, dimenzija i automatizacije. Tačan rok dobijate uz ponudu.' },
        { q: 'Da li se sve kapije mogu automatizovati?', a: 'Da. Klizne, samonosive i dvokrilne kapije podržavaju automatizaciju. Preporučujemo motor prema težini i dimenzijama kapije.' },
        { q: 'U kojim bojama izrađujete kapije?', a: 'U svim bojama iz RAL palete. Najtraženije su antracit siva RAL7016, crna RAL9005 i bela RAL9016.' },
        { q: 'Da li dolazite na merenje?', a: 'Da, merenje i konsultacija su besplatni i bez obaveze, na celoj teritoriji Srbije.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'pesacke-kapije': {
    seoTitle: 'Pešačke kapije po meri — izrada i montaža | Palisade',
    seoDescription: 'Pešačke kapije za dvorišta, stambene i poslovne objekte. Izrada po meri u svim RAL bojama, sa elektro-bravom i interfonom. Besplatno merenje u Srbiji.',
    intro: 'Pešačke kapije za siguran i elegantan ulaz — izrađene po meri, sa opcijom elektro-brave, interfona i kontrole pristupa.',
    blocks: [
      contentBlock(
        h('Pešačke kapije izrađene po meri'),
        p('Pešačka kapija je svakodnevni ulaz u vaš prostor, pa mora biti pouzdana, bezbedna i lepa. Izrađujemo ih od cinkovanog čelika i aluminijuma, sa punim ili delimičnim ispunama, usklađene sa ogradom i većom kapijom.'),
        ul([
          'Dimenzije i ispuna po meri',
          'Elektro-brava, interfon i čitač kartica na zahtev',
          'Sve RAL boje sa trajnom plastifikacijom',
          'Usklađivanje sa dvokrilnom ili kliznom kapijom',
        ]),
      ),
      faqBlock('Česta pitanja — pešačke kapije', [
        { q: 'Da li pešačka kapija može imati šifrator ili interfon?', a: 'Da. Ugrađujemo elektro-bravu sa šifratorom, interfonom ili čitačem kartica radi kontrole pristupa.' },
        { q: 'Koja je standardna širina pešačke kapije?', a: 'Najčešće 1000–1200 mm, ali izrađujemo po meri prema vašem otvoru.' },
        { q: 'Može li se uskladiti sa postojećom ogradom?', a: 'Da, kapiju prilagođavamo dizajnu i boji postojeće ili nove ograde.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'dvokrilne-kapije': {
    seoTitle: 'Dvokrilne kapije — izrada i montaža po meri | Palisade',
    seoDescription: 'Dvokrilne kapije za dvorišta i poslovne objekte. Klasičan izgled, čvrsta konstrukcija, automatizacija i sve RAL boje. Besplatno merenje i ponuda u Srbiji.',
    intro: 'Dvokrilne kapije sa klasičnim otvaranjem na dve strane — pouzdane, čvrste i dostupne sa automatizacijom.',
    blocks: [
      contentBlock(
        h('Dvokrilne kapije za dvorišta i objekte'),
        p('Dvokrilna kapija je klasično rešenje koje se otvara na dve strane i odgovara tradicionalnijoj arhitekturi. Izrađuje se od čeličnih ili aluminijumskih profila, sa hidrauličnim ili elektromehaničkim motorom za automatizaciju.'),
        ul([
          'Otvaranje ka unutra ili ka spolja',
          'Automatizacija hidrauličnim ili elektro-motorom',
          'Puna ili delimična ispuna po izboru',
          'Antikorozivna zaštita i RAL plastifikacija',
        ]),
      ),
      faqBlock('Česta pitanja — dvokrilne kapije', [
        { q: 'Koliko prostora zahteva dvokrilna kapija?', a: 'Potreban je slobodan luk za otvaranje krila. Ako je prostor ograničen, preporučujemo kliznu ili samonosivu kapiju.' },
        { q: 'Da li je moguća automatizacija?', a: 'Da, ugrađujemo motore prikladne težini krila, sa daljinskim i sigurnosnim senzorima.' },
        { q: 'Koja je maksimalna širina?', a: 'Zavisi od konstrukcije; za veće otvore delimo na šira krila ili predlažemo klizni sistem.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'klizne-kapije': {
    seoTitle: 'Klizne kapije sa automatizacijom — po meri | Palisade',
    seoDescription: 'Klizne kapije koje štede prostor — sa automatizacijom, daljinskim i senzorima. Izrada po meri za stambene i industrijske objekte. Montaža u celoj Srbiji.',
    intro: 'Klizne kapije klize duž šine i štede bočni prostor — idealne uz automatizaciju za svakodnevnu upotrebu.',
    blocks: [
      contentBlock(
        h('Klizne kapije koje štede prostor'),
        p('Klizna kapija se pomera bočno duž vođice i ne zahteva prostor za otvaranje krila. Najčešći je izbor za stambene objekte i industrijska dvorišta gde se kapija koristi više puta dnevno i gde je automatizacija prioritet.'),
        ul([
          'Ušteda prostora — nema luka otvaranja',
          'Idealna za automatizaciju i česću upotrebu',
          'Motori za klizne sisteme sa daljinskim i senzorima',
          'Vođice i nosači prilagođeni težini kapije',
        ]),
      ),
      faqBlock('Česta pitanja — klizne kapije', [
        { q: 'Da li klizna kapija zahteva šinu u tlu?', a: 'Klasične klizne kapije koriste vođicu u tlu. Ako podloga to ne dozvoljava, predlažemo samonosivu kapiju bez šine.' },
        { q: 'Koji motor je potreban?', a: 'Motor biramo prema težini i dužini kapije; nudimo proverene motore za klizne i samonosive sisteme.' },
        { q: 'Radi li kapija pri nestanku struje?', a: 'Da, svi sistemi imaju ručno otključavanje, a opciono i baterijsko napajanje.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'samonosive-kapije': {
    seoTitle: 'Samonosive kapije — bez šine u tlu | Palisade',
    seoDescription: 'Samonosive klizne kapije bez šine u tlu — idealne za neravne i strmije podloge. Izrada po meri sa automatizacijom. Besplatno merenje u Srbiji.',
    intro: 'Samonosive kapije ne zahtevaju šinu u tlu — savršene kada je podloga neravna ili kada nije moguć iskop za vođicu.',
    blocks: [
      contentBlock(
        h('Samonosive kapije bez šine u tlu'),
        p('Samonosiva kapija „lebdi“ na konzolnoj konstrukciji i ne dodiruje tlo, pa nema šine koju bi sneg, led ili nečistoća blokirali. Idealna je za neravne i strmije terene i za ulaze gde iskop nije moguć.'),
        ul([
          'Bez šine — nema blokade snegom i nečistoćom',
          'Za neravne i strmije podloge',
          'Automatizacija sa daljinskim upravljanjem',
          'Duži vek trajanja mehanizma',
        ]),
      ),
      faqBlock('Česta pitanja — samonosive kapije', [
        { q: 'Po čemu se razlikuje od klizne kapije?', a: 'Samonosiva nema vođicu u tlu — nosi je konzola sa strane, pa radi i kada je podloga neravna ili pod snegom.' },
        { q: 'Koliko prostora treba sa strane?', a: 'Potreban je bočni prostor približno jednak širini otvora za „protivteg“ konstrukcije.' },
        { q: 'Da li je skuplja od klizne?', a: 'Obično jeste zbog jače konstrukcije, ali nudi bezbrižan rad bez održavanja šine.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'jednokrilne-kapije': {
    seoTitle: 'Jednokrilne kapije po meri | Palisade',
    seoDescription: 'Jednokrilne kapije za uže ulaze i prolaze — izrada po meri, automatizacija i sve RAL boje. Besplatno merenje i ponuda u Srbiji.',
    intro: 'Jednokrilne kapije za uže ulaze — jednostavne, pouzdane i dostupne sa automatizacijom.',
    blocks: [
      contentBlock(
        h('Jednokrilne kapije'),
        p('Jednokrilna kapija otvara se kao jedno krilo i pogodna je za uže ulaze, prolaze i mesta gde dvokrilno rešenje nije potrebno. Izrađujemo je po meri, sa opcijom automatizacije i elektro-brave.'),
      ),
      QUOTE_CTA,
    ],
  },

  // ═══ PARENT: OGRADE ═══
  ograde: {
    seoTitle: 'Ograde po meri — panelne, aluminijumske i dekorativne | Palisade',
    seoDescription: 'Izrada i montaža ograda u Beogradu i Srbiji: 2D/3D panelne, aluminijumske i dekorativne ograde. Sve visine i RAL boje, antikorozivna zaštita. Besplatno merenje.',
    intro: 'Izrađujemo ograde za stambene, poslovne i industrijske objekte — od ekonomičnih panelnih do premium aluminijumskih i dekorativnih ograda.',
    blocks: [
      contentBlock(
        h('Ograde za svaki objekat i budžet'),
        p('Ograda definiše granicu, bezbednost i izgled vašeg prostora. Nudimo panelne ograde (2D i 3D) kao najisplativije rešenje za veće površine, aluminijumske ograde kao premium opciju bez održavanja, i dekorativne ograde za poseban estetski pečat.'),
        h('Tipovi ograda', 'h3'),
        ul([
          '3D panelne ograde — najprodavanije, za kuće i industriju',
          '2D panelne ograde — pojačana čvrstoća za visoku sigurnost',
          'Aluminijumske ograde — bez korozije, nulto održavanje',
          'Dekorativne ograde — naglašen dizajn i estetika',
        ]),
        p('Sve ograde su od cinkovanog čelika ili aluminijuma, plastificirane u RAL bojama, sa dugogodišnjom garancijom na antikorozivnu zaštitu.'),
      ),
      faqBlock('Česta pitanja o ogradama', [
        { q: 'Koja ograda je najisplativija za veliku dužinu?', a: 'Panelne ograde (2D/3D) imaju najnižu cenu po dužnom metru i brzu montažu — idealne za veće površine, dvorišta, sportske terene i industriju.' },
        { q: 'Koja ograda ne zahteva održavanje?', a: 'Aluminijumske ograde — ne korodiraju i ne treba ih farbati. Plastifikacija po RAL paleti traje godinama.' },
        { q: 'Da li se ograda može uskladiti sa kapijom?', a: 'Da, ogradu i kapiju izrađujemo u istom dizajnu i boji radi jedinstvenog izgleda.' },
        { q: 'U kojim visinama se izrađuju ograde?', a: 'Standardno od 830 do 2030 mm i više, a po zahtevu klijenta i druge visine.' },
      ]),
      QUOTE_CTA,
    ],
  },

  '3d-panelne-ograde': {
    seoTitle: '3D panelne ograde EUROFENCE — izrada i montaža | Palisade',
    seoDescription: 'Najprodavanija 3D panelna ograda EUROFENCE za kuće, dvorišta i industriju. Sve visine (830–2030 mm), debljina žice 4/5 mm, sve RAL boje. Montaža u Srbiji.',
    intro: 'EUROFENCE 3D panelna ograda — naša najprodavanija ograda za stambene i industrijske objekte, sa karakterističnim 3D pojačanjima za dodatnu čvrstoću.',
    blocks: [
      contentBlock(
        h('3D panelne ograde EUROFENCE'),
        p('3D panelna ograda ima horizontalna pojačanja („3D pregibe“) koja joj daju izuzetnu krutost uz malu težinu. Izrađena je od cinkovanog čelika i plastificirana poliesterom po RAL paleti.'),
        ul([
          'Standardne visine: 830, 1030, 1230, 1530, 1730, 2030 mm',
          'Debljina žice 4 mm ili 5 mm, okca 50×200 mm',
          'Stubovi 50×50 do 100×40 mm, usadni ili sa anker pločom',
          'Standardne boje: antracit RAL7016 i zelena RAL6005',
        ]),
        p('Na ogradu se mogu postaviti PVC trake ili veštačka trava za potpunu privatnost, kao i betonski elementi, bodljikava žica ili NATO žilet trake za pojačanu sigurnost.'),
      ),
      faqBlock('Česta pitanja — 3D panelne ograde', [
        { q: 'Koja debljina žice je bolja?', a: '5 mm daje veću čvrstoću i preporučuje se za industrijske objekte; 4 mm je ekonomično rešenje za stambenu upotrebu.' },
        { q: 'Mogu li dobiti neprovidnu ogradu?', a: 'Da, ubacivanjem PVC traka ili veštačke trave u panel dobijate efekat neprovidne ograde i punu privatnost.' },
        { q: 'Kako se montiraju stubovi?', a: 'Stubovi mogu biti usadni (betoniraju se u tlo) ili sa anker pločom (ankerišu na beton), zavisno od podloge i visine.' },
      ]),
      QUOTE_CTA,
    ],
  },

  '2d-panelne-ograde': {
    seoTitle: '2D panelne ograde DOUBLEFENCE — visoka sigurnost | Palisade',
    seoDescription: '2D panelna ograda DOUBLEFENCE sa duplom horizontalnom žicom za objekte koji zahtevaju visok nivo sigurnosti. Žica 6/5/6 i 8/6/8 mm, sve RAL boje. Montaža u Srbiji.',
    intro: 'DOUBLEFENCE 2D panelna ograda sa duplom horizontalnom žicom — naš najčvršći panelni sistem za poslovne i industrijske objekte.',
    blocks: [
      contentBlock(
        h('2D panelne ograde DOUBLEFENCE'),
        p('DOUBLEFENCE 2D ograda ima dve horizontalne žice oko jedne vertikalne, što joj daje izuzetnu otpornost na dinamička opterećenja. Namenjena je objektima kojima je potreban viši stepen zaštite.'),
        ul([
          'Žica 6/5/6 mm ili 8/6/8 mm (horizontala/vertikala/horizontala)',
          'Visine: 1230, 1430, 1630, 1830, 2030 mm',
          'Okca 50×200 mm, dužina panela 2500 mm',
          'Najčešće stubovi 60×40 mm sa INOX spojnicom',
        ]),
      ),
      faqBlock('Česta pitanja — 2D panelne ograde', [
        { q: 'Po čemu je 2D bolja od 3D ograde?', a: 'Dupla horizontalna žica daje veću čvrstoću i otpornost, pa je 2D pogodnija za visoku sigurnost i industrijske objekte.' },
        { q: 'Koja debljina žice za maksimalnu sigurnost?', a: 'Verzija 8/6/8 mm pruža najveću čvrstoću i preporučuje se za objekte sa najvišim sigurnosnim zahtevima.' },
        { q: 'Može li se kombinovati sa kontrolom pristupa?', a: 'Da, ogradu povezujemo sa kapijama i sistemima kontrole pristupa vozila i ljudi.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'panelne-ograde': {
    seoTitle: 'Panelne ograde — 2D i 3D paneli po meri | Palisade',
    seoDescription: 'Panelne ograde za dvorišta, sportske terene i industriju. 2D i 3D paneli, sve visine i RAL boje, brza montaža i niska cena po metru. Besplatno merenje u Srbiji.',
    intro: 'Panelne ograde su najisplativije rešenje za veće površine — brza montaža, čvrsta konstrukcija i niska cena po dužnom metru.',
    blocks: [
      contentBlock(
        h('Panelne ograde za veće površine'),
        p('Panelne ograde se isporučuju u gotovim panelima koji se brzo montiraju na stubove, što ih čini idealnim za dvorišta, škole, sportske terene i industrijske komplekse. Dostupne su u 2D i 3D varijanti.'),
      ),
      QUOTE_CTA,
    ],
  },

  'aluminijumske-ograde': {
    seoTitle: 'Aluminijumske ograde po meri — bez korozije | Palisade',
    seoDescription: 'Premium aluminijumske ograde bez korozije i bez održavanja. Moderni profili, sve RAL boje, dugotrajna plastifikacija. Izrada po meri i montaža u Srbiji.',
    intro: 'Aluminijumske ograde su premium izbor — lagane, otporne na koroziju i bez potrebe za farbanjem ili održavanjem.',
    blocks: [
      contentBlock(
        h('Aluminijumske ograde — premium i bez održavanja'),
        p('Aluminijum je lak, ne korodira i ne zahteva farbanje, pa aluminijumska ograda zadržava izgled godinama uz nulto održavanje. Savršena je za moderne fasade, vile i poslovne prostore, i lako se kombinuje sa automatskom kapijom.'),
        ul([
          'Trajnost 30+ godina bez korozije',
          'Nulto održavanje — bez farbanja',
          'Moderni profili i bogat izbor dizajna',
          'Sve RAL boje sa trajnom plastifikacijom',
        ]),
      ),
      faqBlock('Česta pitanja — aluminijumske ograde', [
        { q: 'Da li aluminijumska ograda zahteva održavanje?', a: 'Ne. Aluminijum ne korodira i ne treba ga farbati — dovoljno je povremeno čišćenje.' },
        { q: 'Da li je skuplja od panelne?', a: 'Inicijalno jeste, ali zbog trajnosti i nultog održavanja isplati se dugoročno, posebno za stambene objekte.' },
        { q: 'Može li se uskladiti sa kapijom?', a: 'Da, izrađujemo aluminijumske ograde i kapije u istom dizajnu i boji.' },
      ]),
      QUOTE_CTA,
    ],
  },

  'dekorativne-ograde': {
    seoTitle: 'Dekorativne ograde — dizajn po meri | Palisade',
    seoDescription: 'Dekorativne ograde sa naglašenim dizajnom za stambene i poslovne objekte. Izrada po meri, sve RAL boje, usklađivanje sa kapijom. Besplatno merenje u Srbiji.',
    intro: 'Dekorativne ograde naglašavaju estetiku objekta — izrađene po meri, sa posebnom pažnjom na dizajn i detalje.',
    blocks: [
      contentBlock(
        h('Dekorativne ograde'),
        p('Kada ograda treba da bude više od granice, dekorativne ograde donose poseban estetski pečat. Izrađujemo ih po meri, usklađene sa arhitekturom objekta i dizajnom kapije.'),
      ),
      QUOTE_CTA,
    ],
  },
}

// ─── Accessory / B2B categories — SEO + intro + CTA (catalog buckets) ───────────

const accessory = (title: string, seoTitle: string, seoDescription: string, intro: string): CatContent => ({
  seoTitle, seoDescription, intro,
  blocks: [ctaBlock(`${title} — zatražite ponudu`, 'Pomažemo u izboru odgovarajuće opreme za vaš projekat. Pošaljite upit i savetujemo vas oko kompatibilnosti i dostupnosti.', [{ label: 'Zatražite ponudu', url: '/kontakt' }, { label: 'Svi proizvodi', url: '/proizvodi', appearance: 'outline' }])],
})

Object.assign(CATEGORY_CONTENT, {
  'automatizacija-kapija': accessory('Automatizacija kapija',
    'Automatizacija kapija — motori i daljinsko upravljanje | Palisade',
    'Automatizacija kapija: motori za klizne, samonosive i krilne kapije, daljinski, senzori i baterijsko napajanje. Ugradnja i podrška u celoj Srbiji.',
    'Sve za automatizaciju kapija — pouzdani motori, daljinski upravljači i sigurnosni senzori za klizne, samonosive i krilne kapije.'),
  'motori-za-krilne-kapije': accessory('Motori za krilne kapije',
    'Motori za krilne (dvokrilne) kapije | Palisade',
    'Elektromehanički i hidraulični motori za krilne kapije, sa daljinskim i sigurnosnim senzorima. Izbor prema težini krila. Ugradnja u Srbiji.',
    'Motori za automatizaciju krilnih kapija — birani prema težini i dimenzijama krila, sa daljinskim upravljanjem.'),
  'motori-za-klizne-i-samonosive-kapije': accessory('Motori za klizne i samonosive kapije',
    'Motori za klizne i samonosive kapije | Palisade',
    'Pouzdani motori za klizne i samonosive kapije sa daljinskim, senzorima i opcijom baterijskog napajanja. Ugradnja i servis u Srbiji.',
    'Motori za klizne i samonosive kapije — za svakodnevnu upotrebu, sa daljinskim i sigurnosnim senzorima.'),
  'kontrola-pristupa': accessory('Kontrola pristupa',
    'Kontrola pristupa — sistemi za vozila i ljude | Palisade',
    'Sistemi kontrole pristupa: rampe, čitači kartica, šifratori, interfoni i kontrola pristupa vozila i ljudi. Projektovanje i ugradnja u Srbiji.',
    'Sistemi kontrole pristupa za vozila i ljude — od šifratora i čitača kartica do rampi i interfona.'),
  'kontrola-pristupa-vozila': accessory('Kontrola pristupa vozila',
    'Kontrola pristupa vozila — rampe i barijere | Palisade',
    'Kontrola pristupa vozila: automatske rampe, barijere i čitači za parkinge i poslovne objekte. Projektovanje, ugradnja i servis u Srbiji.',
    'Kontrola pristupa vozila — automatske rampe i barijere za parkinge, dvorišta i poslovne objekte.'),
  'kontrola-pristupa-ljudi': accessory('Kontrola pristupa ljudi',
    'Kontrola pristupa ljudi — čitači i šifratori | Palisade',
    'Kontrola pristupa ljudi: čitači kartica, šifratori, interfoni i elektro-brave za kapije i ulaze. Ugradnja u celoj Srbiji.',
    'Kontrola pristupa ljudi — čitači kartica, šifratori i interfoni za bezbedan ulaz.'),
  'visoka-sigurnost': accessory('Visoka sigurnost',
    'Ograde i sistemi visoke sigurnosti | Palisade',
    'Rešenja visoke sigurnosti: pojačane ograde, NATO žilet trake, bodljikava žica i kontrola pristupa za objekte sa najvišim zahtevima. Ugradnja u Srbiji.',
    'Rešenja za objekte sa najvišim sigurnosnim zahtevima — pojačane ograde, žilet trake i kontrola pristupa.'),
  'oprema-i-dodaci': accessory('Oprema i dodaci',
    'Oprema i dodaci za kapije i ograde | Palisade',
    'Oprema i dodaci za kapije i ograde: brave, šarke, spojnice, motori i pribor renomiranih proizvođača (Locinox, DEL PONTI, HI MOTIONS). Dostava u Srbiji.',
    'Kompletna oprema i dodaci za kapije i ograde — brave, šarke, spojnice i pribor proverenih proizvođača.'),
  'locinox-dodaci': accessory('Locinox dodaci',
    'Locinox dodaci — brave, šarke i pribor | Palisade',
    'Locinox oprema za kapije: brave, šarke, reze i pribor vrhunskog kvaliteta. Originalni Locinox proizvodi sa dostavom u Srbiji.',
    'Locinox oprema za kapije — brave, šarke i reze vrhunskog kvaliteta, originalni proizvodi.'),
  'oprema-za-krilne-kapije': accessory('Oprema za krilne kapije',
    'Oprema za krilne kapije — šarke, brave, motori | Palisade',
    'Oprema za krilne (dvokrilne) kapije: šarke, brave, elektro-brave i motori. Sve za pouzdan rad i automatizaciju krilnih kapija. Dostava u Srbiji.',
    'Oprema za krilne kapije — šarke, brave i motori za pouzdan rad i automatizaciju.'),
  'oprema-za-samonosive-kapije': accessory('Oprema za samonosive kapije',
    'Oprema za samonosive kapije — vođice i nosači | Palisade',
    'Oprema za samonosive kapije: konzolne vođice, nosači, kolica i pribor. Sve za pouzdan rad samonosivog sistema. Dostava i ugradnja u Srbiji.',
    'Oprema za samonosive kapije — konzolne vođice, nosači i kolica za pouzdan rad bez šine.'),
  'dodaci-za-ograde': accessory('Dodaci za ograde',
    'Dodaci za ograde — stubovi, spojnice, trake | Palisade',
    'Dodaci za panelne i druge ograde: stubovi, INOX spojnice, PVC trake, kape i pribor za montažu. Dostava u celoj Srbiji.',
    'Dodaci za ograde — stubovi, INOX spojnice, PVC trake i pribor za montažu.'),
  'del-ponti-dodaci': accessory('DEL PONTI dodaci',
    'DEL PONTI dodaci i oprema | Palisade',
    'DEL PONTI oprema i dodaci za kapije i ograde — kvalitetni proizvodi sa dostavom u Srbiji. Savetovanje oko izbora i kompatibilnosti.',
    'DEL PONTI oprema i dodaci za kapije i ograde — proveren kvalitet i dostupnost.'),
  'hi-motions-oprema': accessory('HI MOTIONS oprema',
    'HI MOTIONS oprema za automatizaciju | Palisade',
    'HI MOTIONS oprema za automatizaciju kapija — motori i pribor pouzdanog kvaliteta. Ugradnja i podrška u celoj Srbiji.',
    'HI MOTIONS oprema za automatizaciju kapija — motori i pribor pouzdanog kvaliteta.'),
})

export const ENRICH_PRODUCT_FIXES: Record<string, { seoTitle?: string; seoDescription?: string }> = {
  'locinox-slimstone-2-sifarnik': {
    seoTitle: 'Locinox SlimStone 2 — šifrator za kontrolu pristupa | Palisade',
    seoDescription: 'Locinox SlimStone 2 šifrator za kontrolu pristupa na kapijama. Pouzdano i elegantno rešenje za bezkontaktni ulaz. Dostava i ugradnja u Srbiji.',
  },
}
