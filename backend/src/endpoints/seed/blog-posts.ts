import type { Media, PostCategory } from '@/payload-types'

import {
  bulletList,
  contentColumnsBlock,
  ctaBlock,
  faqBlock,
  heading,
  paragraph,
  quoteBlock,
  richText,
  spacerBlock,
  statsBlock,
} from './richText'

type BlogSeedArgs = {
  heroImage: Media
  images?: {
    aluminijum?: Media
    automatika?: Media
    ral?: Media
  }
  categories: {
    saveti: PostCategory
    vodici: PostCategory
    projekti: PostCategory
  }
}

export const createBlogPostsSeed = ({ heroImage, images, categories }: BlogSeedArgs): any[] => [
  {
    title: 'Aluminijumske vs. panelne ograde — koje su bolje za vaše imanje?',
    slug: 'aluminijumske-vs-panelne-ograde',
    excerpt:
      'Poredimo dve najpopularnije vrste ograda u Srbiji: aluminijumske i panelne. Koji materijal je bolji izbor za vaš prostor, budžet i stil?',
    featuredImage: images?.aluminijum || heroImage,
    publishedOn: new Date('2026-04-10T10:00:00.000Z').toISOString(),
    _status: 'published',
    categories: [categories.saveti.id],
    content: richText(
      heading('Ograda je dugoročna investicija', 'h2'),
      paragraph(
        'Kada birate ogradu za vaš dom ili poslovni prostor, ne razmišljate samo o ceni — razmišljate o trajnosti, održavanju, sigurnosti i izgledu. Dve opcije koje najčešće stoje jedne nasuprot druge su aluminijumske i panelne (2D/3D) ograde.',
      ),
      heading('Aluminijumske ograde', 'h3'),
      paragraph(
        'Aluminijum je lak, otporan na koroziju i ne zahteva farbanje niti posebno održavanje. Savršen je za elegantne, modernistički oblikovane fasade i vrtove. Dostupan u svim RAL bojama i profilima, može se prilagoditi gotovo svakom arhitektonskom stilu.',
      ),
      bulletList([
        'Trajnost 30+ godina bez korozije',
        'Nulto održavanje — nije potrebno farbanje',
        'Elegantni profili i bogat izbor dizajna',
        'Idealan za stambene objekte i komercijalne prostore',
      ]),
      heading('Panelne ograde (2D i 3D)', 'h3'),
      paragraph(
        'Panelne ograde su najisplativije rešenje za veće površine. Čelična mreža sa plastifikacijom obezbeđuje odličnu čvrstoću i otpornost na vremenske uticaje. Montaža je brza, a cena po tekućem metru je znatno niža od aluminijuma.',
      ),
      bulletList([
        'Niža cena po tekućem metru',
        'Brza montaža velikih površina',
        'Dostupne u svim RAL bojama',
        'Idealne za industrijske objekte, škole i sportske terene',
      ]),
    ),
    layout: [
      statsBlock('Brzo poređenje', [
        { value: 'Al', label: 'Aluminijum — premium estetika' },
        { value: '2D/3D', label: 'Panelne — isplativost za veće površine' },
        { value: 'RAL', label: 'Oba tipa dostupna u svim bojama' },
        { value: '10g+', label: 'Garancija na oba sistema' },
      ]),
      contentColumnsBlock([
        {
          size: 'half',
          texts: [
            heading('Kada izabrati aluminijum?', 'h3'),
            paragraph(
              'Stambeni objekat, vila ili poslovni prostor gde estetika igra ključnu ulogu. Pogotovo preporučujemo kada postoje specifični arhitektonski zahtevi ili kada se ograda kombinuje sa automatskom kapijom.',
            ),
          ],
        },
        {
          size: 'half',
          texts: [
            heading('Kada izabrati panelnu ogradu?', 'h3'),
            paragraph(
              'Industrijski objekti, skladišta, škole, sportski tereni i dvorišta gde je ekonomičnost prioritet. Odlična opcija i za vikend kuće i voćnjake gde je potrebna zaštita na velikoj dužini.',
            ),
          ],
        },
      ]),
      quoteBlock({
        text: 'Panelne ograde su najisplativije rešenje za industrijsku upotrebu, a aluminijumske su naš favorit za rezidencijalne projekte. Obe opcije pružaju odličnu dugoročnu vrednost.',
        author: 'Palisada d.o.o.',
        role: 'Tim za produkciju',
        rating: '5',
      }),
      ctaBlock({
        title: 'Niste sigurni koji tip ograda vam odgovara?',
        body: [
          'Dolazimo na merenje besplatno i dajemo stručnu preporuku na licu mesta. Kontaktirajte nas i razgovarajmo o vašem projektu.',
        ],
        links: [
          { label: 'Zatražite besplatno merenje', url: '/kontakt' },
          { appearance: 'outline', label: 'Pogledajte naš katalog', url: '/proizvodi' },
        ],
      }),
    ],
    meta: {
      title: 'Aluminijumske vs. panelne ograde — koje su bolje? | Palisade',
      description:
        'Detaljna analiza razlika između aluminijumskih i panelnih ograda. Pomažemo vam da izaberete pravo rešenje za vaš prostor i budžet.',
      image: images?.aluminijum || heroImage,
    },
  },

  {
    title: 'Automatizovane pešačke kapije — bezbednost i komfor na ulazu',
    slug: 'automatizovane-pesacke-kapije-vodic',
    excerpt:
      'Automatska pešačka kapija nije luksuz — to je praktično i bezbedno rešenje za svaki stambeni i poslovni objekat. Saznajte šta treba da znate pre kupovine.',
    featuredImage: images?.automatika || heroImage,
    publishedOn: new Date('2026-04-25T09:00:00.000Z').toISOString(),
    _status: 'published',
    categories: [categories.vodici.id],
    content: richText(
      heading('Zašto automatizovati pešačku kapiju?', 'h2'),
      paragraph(
        'Automatska pešačka kapija donosi udobnost svakodnevnom životu — više ne morate da izlazite po kiši ili hladnoći da biste otvorili ulaz. Uz odgovarajući sistem kontrole pristupa, povećavate i bezbednost objekta.',
      ),
      heading('Tipovi automatizacije', 'h3'),
      paragraph(
        'Postoje više sistema automatizacije za pešačke kapije. Najčešće koristimo motore sa šinom (klizne kapije), elektro-brave (dvorišne kapije) i hidraulične motore (teže dvokrilne kapije).',
      ),
      bulletList([
        'Daljinski upravljač — klasičan i pouzdan',
        'Tastaturu sa PIN kodom — za poslovne objekte',
        'Citač kartica ili čipova — za kontrolu pristupa',
        'Automatizacija putem aplikacije — moderne solucije',
        'Interfon sa kamerom — integracija sa video nadzorom',
      ]),
      heading('Šta utiče na cenu automatizacije?', 'h3'),
      paragraph(
        'Cena automatizacije zavisi od tipa kapije, težine i dimenzija, vrste motora, sistema kontrole pristupa i potrebe za dodatnim osiguračima i senzorom prisutnosti.',
      ),
    ),
    layout: [
      faqBlock('Česta pitanja o automatskim kapijama', [
        {
          question: 'Da li automatska kapija radi i pri nestanku struje?',
          answer: [
            'Da, svi naši sistemi imaju opciju ručnog otvaranja u slučaju nestanka struje. Preporučujemo i UPS baterijsko napajanje za kontinuiran rad.',
          ],
        },
        {
          question: 'Koliko traje montaža automatske kapije?',
          answer: [
            'Standardna montaža automatske pešačke kapije traje 4 do 8 sati, u zavisnosti od složenosti sistema i potrebnih radova na tlu.',
          ],
        },
        {
          question: 'Koja je garancija na motor i sistem?',
          answer: [
            'Dajemo garanciju od 2 do 5 godina na motor i elektroniku, u zavisnosti od proizvođača. Na kapiju i ogradu garancija iznosi minimum 10 godina.',
          ],
        },
        {
          question: 'Da li je potrebno godišnje servisiranje?',
          answer: [
            'Preporučujemo godišnji servisni pregled sistema za podmazivanje mehaničkih delova i kalibraciju senzora. Servis obavljamo u celoj Srbiji.',
          ],
        },
      ]),
      contentColumnsBlock([
        {
          size: 'oneThird',
          texts: [
            heading('Samonosive kapije', 'h3'),
            paragraph(
              'Ne zahtevaju šinu u tlu — idealne kada je podloga neravna ili kada imate ograničen prostor za iskop. Pogodne za izlaze i ulaze na strmijim terenima.',
            ),
          ],
        },
        {
          size: 'oneThird',
          texts: [
            heading('Klizne kapije', 'h3'),
            paragraph(
              'Klize duž šine i zahtevaju manje bočnog prostora od dvokrilnih kapija. Najčešći izbor za stambene objekte i garaže sa automatizacijom.',
            ),
          ],
        },
        {
          size: 'oneThird',
          texts: [
            heading('Dvokrilne kapije', 'h3'),
            paragraph(
              'Klasičan izgled koji odgovara tradicionalnijoj arhitekturi. Dostupne u širokom opsegu dimenzija i stilova, sa punom podrškom za automatizaciju.',
            ),
          ],
        },
      ]),
      spacerBlock('sm', true),
      ctaBlock({
        title: 'Planirate automatsku kapiju?',
        body: [
          'Kontaktirajte nas za besplatnu konsultaciju. Procenjujemo vaš prostor, preporučujemo sistem i sačinjavamo detaljan predračun bez obaveze.',
        ],
        links: [
          { label: 'Zatražite konsultaciju', url: '/kontakt' },
          { appearance: 'outline', label: 'Pogledajte kapije', url: '/kategorija/kapije' },
        ],
      }),
    ],
    meta: {
      title: 'Automatizovane pešačke kapije — vodič za kupovinu | Palisade',
      description:
        'Sve što trebate znati pre kupovine automatske pešačke kapije: tipovi motora, sistemi kontrole pristupa, cene i garancije.',
      image: images?.automatika || heroImage,
    },
  },

  {
    title: 'RAL boje za kapije i ograde — kompletni vodič za izbor boje',
    slug: 'ral-boje-za-kapije-i-ograde-vodic',
    excerpt:
      'RAL sistem obuhvata više od 200 standardizovanih boja. Kako izabrati pravu boju za kapiju ili ogradu koja će se savršeno uklopiti u vaš objekat?',
    featuredImage: images?.ral || heroImage,
    publishedOn: new Date('2026-05-08T08:30:00.000Z').toISOString(),
    _status: 'published',
    categories: [categories.saveti.id],
    content: richText(
      heading('Šta je RAL sistem i zašto je važan?', 'h2'),
      paragraph(
        'RAL je evropski standardizovani sistem kodiranja boja koji se koristi u industriji metalnih konstrukcija, automobilizmu i arhitekturi. Svaka boja ima jedinstveni četvorocifreni kod, što garantuje da ćete dobiti tačno onu nijansu koju ste odabrali — bez iznenađenja.',
      ),
      paragraph(
        'RAL sistem trenutno obuhvata više od 200 pažljivo definisanih boja, organizovanih u nekoliko kategorija: klasični spektar, efektni premazi i prirodni tonovi.',
      ),
      heading('Najpopularnije RAL boje za kapije i ograde', 'h3'),
      bulletList([
        'RAL 7016 — Antracit siva (najpopularnija za moderne fasade)',
        'RAL 9005 — Mat crna (elegantna i minimalistička)',
        'RAL 9016 — Bela (klasičan izbor za svetlije objekte)',
        'RAL 6005 — Tamno zelena (prirodna estetika za vikend kuće)',
        'RAL 8017 — Čokoladno smeđa (topao, zemaljski ton)',
        'RAL 1019 — Sivo-bež (neutralan i elegantna kombinacija)',
      ]),
      heading('Kako odabrati pravu boju?', 'h3'),
      paragraph(
        'Preporučujemo da boju kapije ili ograde uskladite sa bojom fasade, krova ili stolarije objekta. Ako ste u nedoumici, antracit siva (RAL 7016) je siguran izbor koji odgovara gotovo svakom stilu. Za konzultaciju, možete nam poslati fotografiju fasade i mi ćemo predložiti odgovarajuće opcije.',
      ),
    ),
    layout: [
      statsBlock('RAL sistem u brojevima', [
        { value: '200+', label: 'Standardizovanih boja' },
        { value: '4', label: 'Cifre jedinstvenog koda' },
        { value: 'EU', label: 'Evropski standard kvaliteta' },
        { value: '10g+', label: 'Trajnost plastifikacije' },
      ]),
      contentColumnsBlock([
        {
          size: 'half',
          texts: [
            heading('Sjajni vs. mat premaz', 'h3'),
            paragraph(
              'Sjajni premaz je vizuelno efektniji ali vidljivije pokazuje ogrebotine tokom vremena. Mat premaz je otporniji na mikrooštećenja i danas je daleko popularniji izbor za moderne fasade.',
            ),
          ],
        },
        {
          size: 'half',
          texts: [
            heading('Plastifikacija vs. prašinasto lakiranje', 'h3'),
            paragraph(
              'Plastifikacija (prah-lakiranje) je najotpornija i najtrajnija tehnika završne obrade metala. Boja se ulaže elektrostatički i peče na visokim temperaturama, dajući jednoličan sloj bez kapanja i otporan na UV zrake.',
            ),
          ],
        },
      ]),
      quoteBlock({
        text: 'Antracit siva RAL 7016 je naš apsolutni bestseler — odgovara modernom, minimalistički i klasičnom stilu arhitekture podjednako. Uvek je siguran izbor.',
        author: 'Palisada d.o.o.',
        role: 'Tim za produkciju i dizajn',
        rating: '5',
      }),
      ctaBlock({
        title: 'Niste sigurni koju boju izabrati?',
        body: [
          'Pošaljite nam fotografiju fasade ili opišite stil objekta — naš tim će vam predložiti 2-3 boje koje će se savršeno uklopiti.',
        ],
        links: [
          { label: 'Kontaktirajte nas', url: '/kontakt' },
          { appearance: 'outline', label: 'Pogledajte katalog', url: '/proizvodi' },
        ],
      }),
    ],
    meta: {
      title: 'RAL boje za kapije i ograde — vodič za izbor | Palisade',
      description:
        'Kompletni vodič kroz RAL sistem boja za kapije i ograde. Saznajte koje su najpopularnije nijanse i kako odabrati onu koja odgovara vašem objektu.',
      image: images?.ral || heroImage,
    },
  },
]
