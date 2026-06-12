// AUTO-GENERATED from docs/pathfinder-v5-reference.html by
// scripts/gen-v5-data.mjs. Archetypes, domain names, and the archetype x domain career DB.
// Italian is authored; en/he are empty until a copywriter fills them
// (tracked by src/data/v5-content.test.ts). Do not hand-edit Italian here —
// edit the prototype and regenerate. DO hand-edit en/he, then stop regenerating.

import type { Archetype, CareerPath, DomainId, Localized } from '@/lib/types';

export const ARCHETYPES: Archetype[] = [
  { id: "builder", icon: "🔨", name: { it: "Il Builder", en: '', he: '' }, sub: { it: "Sei costruito per creare qualcosa di tuo. Alta tolleranza al rischio, visione lunga, pensiero analitico. Non ti interessa il percorso sicuro — ti interessa l'impatto reale e l'ownership totale. Il tuo rischio principale è l'analysis paralysis.", en: '', he: '' } },
  { id: "specialist", icon: "🔬", name: { it: "Lo Specialist", en: '', he: '' }, sub: { it: "Vai in profondità dove gli altri restano in superficie. Il tuo valore è nell'expertise rara e nel pensiero analitico profondo. Costruisci ricchezza diventando il riferimento assoluto nel tuo campo — inarrivabile per tutti gli altri.", en: '', he: '' } },
  { id: "creator", icon: "🎨", name: { it: "Il Creator", en: '', he: '' }, sub: { it: "Hai bisogno di espressione e autonomia. Il tuo lavoro deve portare la tua firma — qualcosa di unico che non potrebbe venire da nessun altro. Le strutture rigide ti soffocano. L'originalità è il tuo asset principale.", en: '', he: '' } },
  { id: "connector", icon: "🤝", name: { it: "Il Connector", en: '', he: '' }, sub: { it: "Le tue relazioni sono il tuo prodotto più prezioso. Sei al meglio quando connetti persone, idee, e opportunità. Il tuo network si apprezza ogni anno come un asset finanziario. Costruisci attraverso gli altri, non da solo.", en: '', he: '' } },
];

export const DOMAIN_NAMES: Record<DomainId, Localized> = {
  FIN: { it: "Finanza & Mercati", en: '', he: '' },
  TEC: { it: "Tecnologia & Digitale", en: '', he: '' },
  ART: { it: "Arte & Estetica", en: '', he: '' },
  LUX: { it: "Lusso & Lifestyle", en: '', he: '' },
  NAT: { it: "Natura & Vita", en: '', he: '' },
  PEO: { it: "Persone & Impatto", en: '', he: '' },
  KNO: { it: "Conoscenza & Parola", en: '', he: '' },
  SPO: { it: "Sport & Performance", en: '', he: '' },
  FOO: { it: "Cibo & Ospitalità", en: '', he: '' },
  CRA: { it: "Costruzione & Artigianato", en: '', he: '' },
  MED: { it: "Intrattenimento & Media", en: '', he: '' },
  SPI: { it: "Spiritualità & Significato", en: '', he: '' },
};

// Domain id -> career-DB slug (the second half of each DB key).
export const DOMAIN_SLUG: Record<DomainId, string> = {
  FIN: "finance",
  TEC: "tech",
  ART: "art",
  LUX: "luxury",
  NAT: "nature",
  PEO: "people",
  KNO: "knowledge",
  SPO: "sport",
  FOO: "food",
  CRA: "craft",
  MED: "media",
  SPI: "spirit",
};

// Keyed `${archetypeId}_${domainSlug}` — 4 archetypes x 12 domains = 48 buckets.
export const CAREERS: Record<string, CareerPath[]> = {
  "builder_finance": [
    { name: { it: "Arbitraggista Crypto/DeFi", en: '', he: '' }, desc: { it: "Sfrutta inefficienze di prezzo tra exchange con strategie algoritmiche. Il tuo pensiero analitico e la tolleranza al rischio si combinano perfettamente.", en: '', he: '' }, firstStep: { it: "Studia il triangular arbitrage su Binance con $5K di capitale. Documenta ogni operazione.", en: '', he: '' } },
    { name: { it: "Fintech Startup Founder", en: '', he: '' }, desc: { it: "Costruisci l'infrastruttura finanziaria del futuro — pagamenti, lending, wealth management. Il settore fintech produce più unicorni di qualsiasi altro.", en: '', he: '' }, firstStep: { it: "Identifica un processo finanziario manuale e costoso in un segmento specifico. Quello è il prodotto.", en: '', he: '' } },
    { name: { it: "Real Estate Developer", en: '', he: '' }, desc: { it: "Acquisisci, trasformi e rivendi asset immobiliari con alta leva finanziaria. Business che scala con il capitale e il network.", en: '', he: '' }, firstStep: { it: "Prima operazione: un asset undervalued in una zona in sviluppo. Impara l'intero ciclo prima di scalare.", en: '', he: '' } },
    { name: { it: "Angel Investor / Micro-VC", en: '', he: '' }, desc: { it: "Investi in startup early stage. Il tuo valore non è solo il capitale — è la visione, l'analisi, e il network. La via più diretta verso la ricchezza composita.", en: '', he: '' }, firstStep: { it: "Tre investimenti nel tuo network personale. Il track record documentato è tutto.", en: '', he: '' } },
  ],
  "builder_tech": [
    { name: { it: "SaaS B2B Founder", en: '', he: '' }, desc: { it: "Prodotto software con revenue ricorrente per un verticale specifico. Il modello economico più scalabile esistente — costruisci una volta, vendi infinite volte.", en: '', he: '' }, firstStep: { it: "Identifica un processo manuale in un settore che conosci e automatizzalo in 30 giorni.", en: '', he: '' } },
    { name: { it: "AI Vertical Startup", en: '', he: '' }, desc: { it: "Strumenti AI per un'industria specifica. Non l'AI generica — la verticale dove hai accesso e comprensione profonda vale 10x di più.", en: '', he: '' }, firstStep: { it: "Scegli il settore dove hai il network. Prototipo funzionante in 30 giorni.", en: '', he: '' } },
    { name: { it: "Venture Builder", en: '', he: '' }, desc: { it: "Costruisci startup in serie con un team centrale e infrastruttura condivisa. Parallelismo invece di linearità.", en: '', he: '' }, firstStep: { it: "Prima startup con traction reale. Poi replica il playbook in verticali adiacenti.", en: '', he: '' } },
    { name: { it: "Developer Tools Company", en: '', he: '' }, desc: { it: "Strumenti per altri developer — chi lo fa bene acquisisce utenti esponenzialmente attraverso word of mouth tecnico.", en: '', he: '' }, firstStep: { it: "Risolvi un problema che hai tu stesso. La migliore ricerca di mercato è l'autocoscienza.", en: '', he: '' } },
  ],
  "builder_art": [
    { name: { it: "IP Licensing Business", en: '', he: '' }, desc: { it: "Crea personaggi, pattern, o stili e licenziali a brand globali. Un IP di successo genera royalties passive per decenni.", en: '', he: '' }, firstStep: { it: "Pubblica sistematicamente su una piattaforma per 12 mesi. La consistenza genera il catalogo.", en: '', he: '' } },
    { name: { it: "Platform per Creativi", en: '', he: '' }, desc: { it: "Marketplace o SaaS per i professionisti creativi del tuo settore. Conosci il problema dall'interno — vantaggio competitivo enorme.", en: '', he: '' }, firstStep: { it: "Identifica il tool mancante nel workflow di una categoria creativa. Quello è il prodotto.", en: '', he: '' } },
    { name: { it: "Brand Creativo Premium", en: '', he: '' }, desc: { it: "Agenzia di design o produzione con identità forte e clienti premium. Non volume — margine altissimo per progetto straordinario.", en: '', he: '' }, firstStep: { it: "Tre clienti top con lavoro eccellente valgono più di trenta mediocri.", en: '', he: '' } },
    { name: { it: "Brand di Prodotto Creativo", en: '', he: '' }, desc: { it: "Costruisci un brand di prodotti fisici con forte identità estetica. L'arte diventa business scalabile quando ha distribuzione.", en: '', he: '' }, firstStep: { it: "Valida il concept con 100 preordini prima di investire in produzione.", en: '', he: '' } },
  ],
  "builder_luxury": [
    { name: { it: "Luxury Resale Business", en: '', he: '' }, desc: { it: "Acquisisci orologi, borse, gioielli undervalued e rivendi a markup premium. Business di pura arbitraggio con margini del 30-100%.", en: '', he: '' }, firstStep: { it: "Specializzati in UNA categoria (es. solo Rolex vintage). L'expertise profonda batte la larghezza.", en: '', he: '' } },
    { name: { it: "Luxury Brand Proprietario", en: '', he: '' }, desc: { it: "Costruisci un brand di lusso autentico in una categoria non saturata. Il lusso si vende con storia e identità.", en: '', he: '' }, firstStep: { it: "Identifica una micro-nicchia del lusso non servita. Costruisci l'identità prima del prodotto.", en: '', he: '' } },
    { name: { it: "Platform Mercato Secondario", en: '', he: '' }, desc: { it: "Marketplace per la compravendita autenticata di beni di lusso. Chrono24 ha dimostrato il modello — esiste ancora spazio verticale.", en: '', he: '' }, firstStep: { it: "Inizia con una community verticale (es. solo AP). Scala orizzontalmente solo dopo la dominance.", en: '', he: '' } },
    { name: { it: "Luxury Experience Company", en: '', he: '' }, desc: { it: "Esperienze esclusive e irripetibili per HNWI. Il lusso si sposta dall'avere all'essere — le esperienze premium crescono del 12% annuo.", en: '', he: '' }, firstStep: { it: "Il primo evento gratis per 10 persone giuste crea i referral che costruiscono il business.", en: '', he: '' } },
  ],
  "builder_nature": [
    { name: { it: "AgriTech Startup", en: '', he: '' }, desc: { it: "Tecnologia per l'agricoltura — precision farming, vertical farming, food traceability. Settore enorme con poco tech.", en: '', he: '' }, firstStep: { it: "Identifica il collo di bottiglia più costoso nella filiera agricola. Quello è il prodotto.", en: '', he: '' } },
    { name: { it: "Premium Food Brand", en: '', he: '' }, desc: { it: "Brand di prodotti alimentari di alta qualità con filiera propria. Il consumer premium cresce ogni anno.", en: '', he: '' }, firstStep: { it: "Un prodotto singolo, un canale diretto, una storia autentica. Non scalare prima della perfezione.", en: '', he: '' } },
    { name: { it: "Sustainability Business", en: '', he: '' }, desc: { it: "Business che risolve un problema ambientale reale con profittabilità. Il mercato ESG vale $50 trilioni.", en: '', he: '' }, firstStep: { it: "Scegli un verticale (packaging, energia, acqua) dove il pain economico è misurabile.", en: '', he: '' } },
    { name: { it: "Eco-Tourism Premium", en: '', he: '' }, desc: { it: "Esperienze naturalistiche premium per viaggiatori high-end. Il turismo lento e autentico cresce.", en: '', he: '' }, firstStep: { it: "Un'esperienza unica documentata bene vale 1000 follower. Inizia dal format.", en: '', he: '' } },
  ],
  "builder_people": [
    { name: { it: "EdTech Startup", en: '', he: '' }, desc: { it: "Piattaforma educativa scalabile che risolve un gap di apprendimento reale. Pathfinder stesso è questo.", en: '', he: '' }, firstStep: { it: "Inizia con un corso live per validare la domanda prima di costruire la piattaforma.", en: '', he: '' } },
    { name: { it: "HR Tech / People Platform", en: '', he: '' }, desc: { it: "Strumenti per il mondo del lavoro, recruiting, orientamento, people analytics. Le PMI spendono fortune in HR manuale.", en: '', he: '' }, firstStep: { it: "Identifica il processo HR più manuale e costoso nelle PMI. Automatizzalo.", en: '', he: '' } },
    { name: { it: "Community Business", en: '', he: '' }, desc: { it: "Costruisci una community intorno a un bisogno specifico e monetizzala. Le community con alto NPS sono i business più difendibili.", en: '', he: '' }, firstStep: { it: "Inizia gratis — monetizza solo quando hai 1000 membri attivi e NPS sopra 70.", en: '', he: '' } },
    { name: { it: "Impact Business con Revenue", en: '', he: '' }, desc: { it: "Business che genera impatto sociale misurabile con modello economicamente sostenibile. L'impatto senza business model non scala.", en: '', he: '' }, firstStep: { it: "Definisci la metrica di impatto prima del modello. L'impatto misurabile attrae capitali.", en: '', he: '' } },
  ],
  "builder_knowledge": [
    { name: { it: "Media Company Verticale", en: '', he: '' }, desc: { it: "Testata autorevole in un settore — newsletter, podcast, eventi, prodotti. La distribuzione è l'asset.", en: '', he: '' }, firstStep: { it: "Scegli una nicchia specifica e pubblica per 6 mesi prima di pensare alla monetizzazione.", en: '', he: '' } },
    { name: { it: "Legal Tech Startup", en: '', he: '' }, desc: { it: "Automatizza processi legali ripetitivi. Il diritto è il settore più manuale — opportunità enorme.", en: '', he: '' }, firstStep: { it: "Identifica il documento legale più prodotto in volume e costruisci un tool per automatizzarlo.", en: '', he: '' } },
    { name: { it: "Research & Intelligence Firm", en: '', he: '' }, desc: { it: "Produce ricerca proprietaria ad alto valore e la vende a fondi e istituzioni. L'informazione rara ha prezzi altissimi.", en: '', he: '' }, firstStep: { it: "Pubblica un report gratuito di alta qualità e osserva chi lo legge e condivide.", en: '', he: '' } },
    { name: { it: "Online Education Business", en: '', he: '' }, desc: { it: "Corsi, programmi, certificazioni su un dominio di expertise profonda. Il mercato vale $300B.", en: '', he: '' }, firstStep: { it: "Crea un corso pilota live con 10 studenti paganti prima di produrre qualsiasi video.", en: '', he: '' } },
  ],
  "builder_sport": [
    { name: { it: "Sports Tech Startup", en: '', he: '' }, desc: { it: "Tecnologia per l'ottimizzazione della performance atletica. Wearables, analytics, mental performance.", en: '', he: '' }, firstStep: { it: "Identifica quale dato critico gli atleti non riescono a misurare facilmente. Quello è il prodotto.", en: '', he: '' } },
    { name: { it: "Sports Agency Imprenditoriale", en: '', he: '' }, desc: { it: "Non solo agente — venture builder per atleti. Gestisci carriera, brand, investimenti.", en: '', he: '' }, firstStep: { it: "Identifica un talento emergente nel tuo network e proponi un accordo di partnership totale.", en: '', he: '' } },
    { name: { it: "Sports Media Platform", en: '', he: '' }, desc: { it: "Media verticale per uno sport specifico. Gli sport di nicchia hanno fan fanatici e sponsor con budget.", en: '', he: '' }, firstStep: { it: "Inizia con contenuto organico su una piattaforma. Domina la community prima del prodotto.", en: '', he: '' } },
    { name: { it: "Training Concept Scalabile", en: '', he: '' }, desc: { it: "Sviluppa un format di training proprietario e scalalo con franchising. CrossFit ha dimostrato il modello.", en: '', he: '' }, firstStep: { it: "Il format deve essere provato con 50 clienti prima di pensare alla scalabilità.", en: '', he: '' } },
  ],
  "builder_food": [
    { name: { it: "Food Brand / CPG", en: '', he: '' }, desc: { it: "Brand di prodotti alimentari con distribuzione digitale e poi retail. Il DTC food ha margini enormi se il brand è forte.", en: '', he: '' }, firstStep: { it: "E-commerce diretto prima della GDO. Valida il brand con vendita diretta prima dei distributori.", en: '', he: '' } },
    { name: { it: "Restaurant Concept in Franchising", en: '', he: '' }, desc: { it: "Format di ristorazione con identità forte e sistema replicabile. Il franchising moltiplica il capitale di altri.", en: '', he: '' }, firstStep: { it: "L'unità 1 deve essere profittabile e replicabile prima di costruire il manuale franchisee.", en: '', he: '' } },
    { name: { it: "Food Tech / Ghost Kitchen", en: '', he: '' }, desc: { it: "Business di food delivery con brand multipli dalla stessa cucina. Costi fissi divisi, revenue moltiplicata.", en: '', he: '' }, firstStep: { it: "Un brand su una piattaforma. Ottimizza completamente prima di aggiungere brand.", en: '', he: '' } },
    { name: { it: "Hospitality Group", en: '', he: '' }, desc: { it: "Portfolio di esperienze food & hospitality premium. L'ecosistema locale crea moat che i competitor non replicano.", en: '', he: '' }, firstStep: { it: "Un concept eccellente vale più di tre mediocri. Perfezione prima di portfolio.", en: '', he: '' } },
  ],
  "builder_craft": [
    { name: { it: "Real Estate Development", en: '', he: '' }, desc: { it: "Acquisisci, trasformi e rivendi asset immobiliari. Business ad alta leva con ritorno composto.", en: '', he: '' }, firstStep: { it: "Prima operazione small scale per imparare la dinamica senza rischio catastrofico.", en: '', he: '' } },
    { name: { it: "Design-Build Firm Premium", en: '', he: '' }, desc: { it: "Agenzia che progetta e costruisce spazi premium end-to-end. Il controllo del processo permette margini impossibili.", en: '', he: '' }, firstStep: { it: "I primi tre clienti devono essere referral dal network personale.", en: '', he: '' } },
    { name: { it: "High-End Product Brand", en: '', he: '' }, desc: { it: "Brand di prodotti artigianali di altissima qualità. Hermès ha dimostrato che l'artigianato porta a valutazioni da miliardi.", en: '', he: '' }, firstStep: { it: "La storia e l'identità vengono prima del prodotto. Non il contrario.", en: '', he: '' } },
    { name: { it: "Manufacturing Startup", en: '', he: '' }, desc: { it: "Produci un prodotto fisico con processo innovativo o tecnologia proprietaria. L'hardware è difficile — quindi difendibile.", en: '', he: '' }, firstStep: { it: "Valida con preordini prima di investire in tooling e produzione.", en: '', he: '' } },
  ],
  "builder_media": [
    { name: { it: "Content / Media Company", en: '', he: '' }, desc: { it: "Costruisci un'azienda media verticale. La distribuzione è il business — il contenuto è il costo di acquisizione.", en: '', he: '' }, firstStep: { it: "Scegli UN formato e UNA piattaforma. Padroneggia prima di diversificare.", en: '', he: '' } },
    { name: { it: "Creator Economy Business", en: '', he: '' }, desc: { it: "Costruisci l'infrastruttura per altri creator — tools, agency, label. Chi serve i creator cresce con loro.", en: '', he: '' }, firstStep: { it: "Identifica il pain point numero uno dei creator nel tuo verticale. Quello è il prodotto.", en: '', he: '' } },
    { name: { it: "Entertainment Startup", en: '', he: '' }, desc: { it: "Piattaforma o studio di produzione di contenuti scalabile. Il contenuto di qualità trova sempre mercato.", en: '', he: '' }, firstStep: { it: "Il primo contenuto deve trovare audience organicamente prima di investire in distribuzione.", en: '', he: '' } },
    { name: { it: "Events & Experience Company", en: '', he: '' }, desc: { it: "Produci eventi e esperienze memorabili per un segmento specifico.", en: '', he: '' }, firstStep: { it: "Primo evento sold out, anche piccolo. Non scalare prima del sold out.", en: '', he: '' } },
  ],
  "builder_spirit": [
    { name: { it: "Wellness / Mindfulness Platform", en: '', he: '' }, desc: { it: "App o piattaforma per il benessere mentale con approccio scientifico. Calm vale $2B — il mercato è enorme.", en: '', he: '' }, firstStep: { it: "Identifica il segmento (leader, atleti, genitori) prima della feature.", en: '', he: '' } },
    { name: { it: "Coaching Business Scalabile", en: '', he: '' }, desc: { it: "Sistema di coaching che scala oltre il tuo tempo — corsi, community, certificazioni, metodologia proprietaria.", en: '', he: '' }, firstStep: { it: "Dieci clienti 1:1 prima di qualsiasi scalabilità. Il metodo nasce dai casi reali.", en: '', he: '' } },
    { name: { it: "Values-Based Brand", en: '', he: '' }, desc: { it: "Brand costruito intorno a valori autentici in un mercato dove i valori contano. Patagonia vale $3B con valori come prodotto.", en: '', he: '' }, firstStep: { it: "La coerenza tra valori e azioni è il prodotto. Non una feature marketing.", en: '', he: '' } },
    { name: { it: "Religious / Cultural Innovation", en: '', he: '' }, desc: { it: "Costruisci strutture moderne intorno a tradizioni culturali profonde. La tradizione con distribuzione moderna raggiunge chi non trovava accesso.", en: '', he: '' }, firstStep: { it: "Identifica il bisogno non servito nella tua comunità. Il gap è il prodotto.", en: '', he: '' } },
  ],
  "specialist_finance": [
    { name: { it: "Portfolio Manager / Fund Manager", en: '', he: '' }, desc: { it: "Gestisci asset per conto di istituzionali o HNWI. Il top 1% dei fund manager guadagna cifre incomprensibili.", en: '', he: '' }, firstStep: { it: "CFA Level 1 è il biglietto d'ingresso. Poi boutique di gestione, poi indipendenza.", en: '', he: '' } },
    { name: { it: "M&A / Corporate Finance Advisor", en: '', he: '' }, desc: { it: "Consulenza su fusioni, acquisizioni e finanza straordinaria. I deal sono enormi — le commissioni sono percentuali di miliardi.", en: '', he: '' }, firstStep: { it: "Esperienza in investment bank o boutique M&A. Poi indipendenza.", en: '', he: '' } },
    { name: { it: "Financial Analyst Indipendente", en: '', he: '' }, desc: { it: "Produce ricerca finanziaria proprietaria e la vende a hedge fund e family office. L'informazione rara ha prezzi altissimi.", en: '', he: '' }, firstStep: { it: "Pubblica analisi gratuita di alta qualità per 12 mesi. La reputazione precede il pagamento.", en: '', he: '' } },
    { name: { it: "Risk Manager / Attuario", en: '', he: '' }, desc: { it: "Quantifica e gestisce il rischio finanziario per banche, assicurazioni, fondi. Ruolo tecnico raro e ben retribuito.", en: '', he: '' }, firstStep: { it: "FRM o PRMIA certification + specializzazione in un tipo di rischio.", en: '', he: '' } },
  ],
  "specialist_tech": [
    { name: { it: "Principal Engineer / Architect", en: '', he: '' }, desc: { it: "Il massimo tecnico di un'organizzazione — decide come i sistemi vengono costruiti. Ruolo da top 1%.", en: '', he: '' }, firstStep: { it: "Specializzazione totale in un dominio (distributed systems, ML infra, security). Poi diventa il riferimento pubblico.", en: '', he: '' } },
    { name: { it: "AI/ML Researcher", en: '', he: '' }, desc: { it: "Ricerca e sviluppa nuovi algoritmi. Il ricercatore AI top guadagna più del CEO di molte aziende.", en: '', he: '' }, firstStep: { it: "Pubblicazioni su arxiv con impatto misurabile. La ricerca open source costruisce reputazione globale.", en: '', he: '' } },
    { name: { it: "Cybersecurity Expert", en: '', he: '' }, desc: { it: "Specialista in sicurezza informatica. La domanda supera l'offerta di 10x.", en: '', he: '' }, firstStep: { it: "OSCP certification + bug bounty programs per costruire il portfolio reale.", en: '', he: '' } },
    { name: { it: "CTO Fractional / Advisor", en: '', he: '' }, desc: { it: "CTO part-time per startup — alta tariffa giornaliera, massima flessibilità, impatto su più aziende.", en: '', he: '' }, firstStep: { it: "Costruisci la reputazione come technical advisor attraverso angel investing e advisory board.", en: '', he: '' } },
  ],
  "specialist_art": [
    { name: { it: "Creative Director Senior", en: '', he: '' }, desc: { it: "Guidi la visione creativa di brand globali. Il CD top è tra i professionisti più pagati della creatività.", en: '', he: '' }, firstStep: { it: "Portfolio è tutto — ogni progetto deve essere migliore del precedente.", en: '', he: '' } },
    { name: { it: "Specialista UX/Product Design", en: '', he: '' }, desc: { it: "Designer di prodotti digitali che risolvono problemi complessi. Il design system di un'azienda vale miliardi.", en: '', he: '' }, firstStep: { it: "Specializzati in un verticale (fintech, health, enterprise) dove il design è sottoserved.", en: '', he: '' } },
    { name: { it: "Critico / Curatore d'Arte", en: '', he: '' }, desc: { it: "Il tuo giudizio estetico è il prodotto. I curatori top determinano carriere e valutazioni di mercato.", en: '', he: '' }, firstStep: { it: "Pubblica sistematicamente e costruisci credibilità editoriale.", en: '', he: '' } },
    { name: { it: "Illustratore / Artista Premium", en: '', he: '' }, desc: { it: "Artista con clientela selezionata e tariffe da lusso. I migliori illustratori guadagnano come avvocati senior.", en: '', he: '' }, firstStep: { it: "Scegli cinque brand con cui vuoi lavorare e crea lavoro non commissionato per loro.", en: '', he: '' } },
  ],
  "specialist_luxury": [
    { name: { it: "Watch / Jewelry Expert & Valuator", en: '', he: '' }, desc: { it: "Il tuo giudizio autenticato vale denaro reale. Case d'asta, assicurazioni, collezionisti pagano per l'expertise rara.", en: '', he: '' }, firstStep: { it: "Diventa il riferimento editoriale in una sotto-categoria (es. Patek Philippe vintage).", en: '', he: '' } },
    { name: { it: "Luxury Brand Consultant", en: '', he: '' }, desc: { it: "Consulente per brand di lusso su posizionamento e identità. I brand ti pagano il tuo giudizio, non il tuo tempo.", en: '', he: '' }, firstStep: { it: "Un case study con un brand emergente è il portfolio. Poi i grandi vengono da te.", en: '', he: '' } },
    { name: { it: "Art & Collectible Asset Advisor", en: '', he: '' }, desc: { it: "Consigli HNWI su investimenti in arte e beni da collezione. L'asset class alternativa cresce ogni anno.", en: '', he: '' }, firstStep: { it: "L'accesso agli HNWI è la barriera. Family office e club di investimento sono la porta.", en: '', he: '' } },
    { name: { it: "Sommelier Master / Spirits Expert", en: '', he: '' }, desc: { it: "Specialista di vino o spirits premium — consulenza, valutazione, distribuzione, educazione.", en: '', he: '' }, firstStep: { it: "WSET Diploma + Court of Master Sommeliers.", en: '', he: '' } },
  ],
  "specialist_nature": [
    { name: { it: "Veterinario Specializzato", en: '', he: '' }, desc: { it: "Specializzazione in animali esotici, sport equestri, o piccoli animali premium. La specializzazione paga 3-5x il generalismo.", en: '', he: '' }, firstStep: { it: "Specializzazione post-laurea nel segmento ad alta domanda e bassa offerta.", en: '', he: '' } },
    { name: { it: "Environmental Consultant", en: '', he: '' }, desc: { it: "Aiuta aziende a navigare regolamentazione ambientale. La domanda ESG esplode.", en: '', he: '' }, firstStep: { it: "Combinazione di expertise legale-tecnica è rara e straordinariamente pagata.", en: '', he: '' } },
    { name: { it: "Food Safety & Quality Expert", en: '', he: '' }, desc: { it: "Specialista in sicurezza alimentare e qualità — richiesto da ogni brand food che scala.", en: '', he: '' }, firstStep: { it: "Certificazioni HACCP avanzate + esperienza in multinazionali food.", en: '', he: '' } },
    { name: { it: "AgriScience Researcher", en: '', he: '' }, desc: { it: "Ricerca applicata su nuove varietà, tecniche agricole, o sostenibilità della filiera.", en: '', he: '' }, firstStep: { it: "PhD + partnership con aziende agricole per ricerca applicata direttamente sul campo.", en: '', he: '' } },
  ],
  "specialist_people": [
    { name: { it: "Psicologo / Psicoterapeuta", en: '', he: '' }, desc: { it: "Clinico con specializzazione in un segmento specifico (trauma, performance, HNWI). Il segmento premium paga 5-10x.", en: '', he: '' }, firstStep: { it: "Specializzazione post-laurea + supervisione + i primi clienti nel segmento target.", en: '', he: '' } },
    { name: { it: "Executive Coach Certificato", en: '', he: '' }, desc: { it: "Coaching 1:1 per C-suite e leader senior. High ticket, clientela ristretta, impatto profondo.", en: '', he: '' }, firstStep: { it: "ICF Master Certified Coach + i primi clienti attraverso il network professionale.", en: '', he: '' } },
    { name: { it: "HR Director / CHRO", en: '', he: '' }, desc: { it: "Responsabile cultura e persone in organizzazioni in crescita. Il CHRO di uno scale-up è tra i ruoli più pagati.", en: '', he: '' }, firstStep: { it: "Expertise in people analytics + OKR + talent development. Poi startup in crescita rapida.", en: '', he: '' } },
    { name: { it: "Mediatore Professionale", en: '', he: '' }, desc: { it: "Mediazione familiare, aziendale, o internazionale. La scarsità di mediatori bravi crea prezzi altissimi.", en: '', he: '' }, firstStep: { it: "Certificazione riconosciuta + specializzazione in un tipo di conflitto specifico.", en: '', he: '' } },
  ],
  "specialist_knowledge": [
    { name: { it: "Avvocato Ultra-Specializzato", en: '', he: '' }, desc: { it: "Diritto tributario internazionale, M&A, IP, o crypto law. La specializzazione estrema crea tariffe impossibili per il generalista.", en: '', he: '' }, firstStep: { it: "Scegli la branca più tecnica e meno popolata del diritto. La rarità paga.", en: '', he: '' } },
    { name: { it: "Giornalista / Analyst di Riferimento", en: '', he: '' }, desc: { it: "Il reporter impossibile da ignorare su un settore specifico. Il tuo nome diventa l'asset.", en: '', he: '' }, firstStep: { it: "Specializzati su una beat e pubblica ogni giorno per un anno.", en: '', he: '' } },
    { name: { it: "Content Strategist Premium", en: '', he: '' }, desc: { it: "Ghost-writer e stratega di contenuto per CEO e thought leader. I top earner fatturano €500K+ all'anno.", en: '', he: '' }, firstStep: { it: "Proponi a tre leader che ammiri di scrivere per loro gratuitamente per 30 giorni.", en: '', he: '' } },
    { name: { it: "Ricercatore / Policy Advisor", en: '', he: '' }, desc: { it: "Ricerca che viene citata, policy che viene implementata. L'impatto intellettuale si converte in influenza e contratti.", en: '', he: '' }, firstStep: { it: "PhD + pubblicazioni ad alto impatto + trasferimento tecnologico o advisory governativo.", en: '', he: '' } },
  ],
  "specialist_sport": [
    { name: { it: "Performance Coach Professionista", en: '', he: '' }, desc: { it: "Allenatore di atleti pro in una disciplina specifica. I coach dei campioni guadagnano quanto i campioni.", en: '', he: '' }, firstStep: { it: "Certificazioni specifiche + lavoro con atleti emergenti. I campioni vengono dopo la track record.", en: '', he: '' } },
    { name: { it: "Sport Scientist", en: '', he: '' }, desc: { it: "Ricerca applicata sulla performance per squadre o atleti pro. Ruolo raro, domanda in crescita.", en: '', he: '' }, firstStep: { it: "PhD in exercise science + partnership con team per ricerca applicata.", en: '', he: '' } },
    { name: { it: "Fisioterapista Sportivo Senior", en: '', he: '' }, desc: { it: "Specialista nel recupero e prevenzione degli infortuni atletici. I top team pagano cifre enormi.", en: '', he: '' }, firstStep: { it: "Laurea + specializzazione sportiva + lavoro con squadre per costruire il portfolio.", en: '', he: '' } },
    { name: { it: "Analista Tattico / Scout", en: '', he: '' }, desc: { it: "Analisi tattica e scouting per club professionistici. Moneyball ha dimostrato il valore.", en: '', he: '' }, firstStep: { it: "Portfolio di analisi pubblicato online. I club cercano chi capisce i dati.", en: '', he: '' } },
  ],
  "specialist_food": [
    { name: { it: "Executive Chef di Riferimento", en: '', he: '' }, desc: { it: "Chef con un punto di vista culinario riconoscibile in un segmento specifico.", en: '', he: '' }, firstStep: { it: "Stage nei migliori ristoranti della specializzazione. Competenza tecnica prima, creatività dopo.", en: '', he: '' } },
    { name: { it: "Food Scientist / Product Developer", en: '', he: '' }, desc: { it: "Sviluppa nuovi prodotti alimentari per brand CPG o startup food. Ruolo tecnico raro.", en: '', he: '' }, firstStep: { it: "Laurea in scienze alimentari + R&D in un brand consolidato.", en: '', he: '' } },
    { name: { it: "Nutrizionista Premium", en: '', he: '' }, desc: { it: "Specializzazione in atleti, patologie specifiche, o segmento wellness luxury.", en: '', he: '' }, firstStep: { it: "Laurea + specializzazione + primi clienti attraverso referrals da centri premium.", en: '', he: '' } },
    { name: { it: "Sommelier / Beverage Director", en: '', he: '' }, desc: { it: "Curatore di esperienze beverage in strutture di lusso.", en: '', he: '' }, firstStep: { it: "WSET Diploma + Court of Master Sommeliers + fine dining.", en: '', he: '' } },
  ],
  "specialist_craft": [
    { name: { it: "Architetto Specializzato Premium", en: '', he: '' }, desc: { it: "Architettura di lusso residenziale o architettura sostenibile. Il top dell'architettura ha tariffe da arte.", en: '', he: '' }, firstStep: { it: "Un progetto straordinario fa la carriera. Rifiuta il mediocre.", en: '', he: '' } },
    { name: { it: "Maestro Artigiano di Lusso", en: '', he: '' }, desc: { it: "Artigiano di eccellenza — selleria, orologeria, ebanisteria. Il lusso autentico è globalmente ricercato.", en: '', he: '' }, firstStep: { it: "L'artigianato di lusso si vende a 10x se ha una storia autentica e documentata.", en: '', he: '' } },
    { name: { it: "Restauratore / Conservatore", en: '', he: '' }, desc: { it: "Restauro di opere d'arte, edifici storici, o beni di lusso. Ruolo raro, clientela HNWI.", en: '', he: '' }, firstStep: { it: "Specializzazione accademica + apprenticeship con un maestro riconosciuto.", en: '', he: '' } },
    { name: { it: "Structural Engineer Senior", en: '', he: '' }, desc: { it: "Ingegnere strutturista specializzato in grandi opere o restauro. I migliori sono chiamati in tutto il mondo.", en: '', he: '' }, firstStep: { it: "Laurea + specializzazione + esperienza internazionale.", en: '', he: '' } },
  ],
  "specialist_media": [
    { name: { it: "Regista / Director", en: '', he: '' }, desc: { it: "Regista con visione distintiva in un genere specifico. Un cortometraggio premiato apre più porte di 10 anni di lavoro anonimo.", en: '', he: '' }, firstStep: { it: "Punta in alto con il primo lavoro. La mediocrità non si ricorda.", en: '', he: '' } },
    { name: { it: "Music Producer", en: '', he: '' }, desc: { it: "Produttore con un suono riconoscibile. Un hit cambia tutto.", en: '', he: '' }, firstStep: { it: "Costruisci il suono, non le relazioni. Le relazioni seguono il suono.", en: '', he: '' } },
    { name: { it: "Copywriter / Creative Strategist Senior", en: '', he: '' }, desc: { it: "Lo stratega creativo che muove campagne e brand. I top earner fatturano €300-500K come freelance.", en: '', he: '' }, firstStep: { it: "I migliori copywriter si pagano 10x i mediocri. Investi nell'apprendimento prima della monetizzazione.", en: '', he: '' } },
    { name: { it: "Editor / Direttore Creativo", en: '', he: '' }, desc: { it: "Guida la direzione editoriale di pubblicazioni o produzioni. Il gusto come professione più alta.", en: '', he: '' }, firstStep: { it: "Costruisci un punto di vista forte e pubblicalo. Non aspettare l'incarico.", en: '', he: '' } },
  ],
  "specialist_spirit": [
    { name: { it: "Psicologo Clinico / Psichiatra", en: '', he: '' }, desc: { it: "Clinico di riferimento in un segmento specifico. Il segmento premium non ha abbastanza professionisti.", en: '', he: '' }, firstStep: { it: "Specializzazione + supervisione + costruzione della reputazione nel segmento target.", en: '', he: '' } },
    { name: { it: "Filosofo Applicato / Eticista", en: '', he: '' }, desc: { it: "Consulente di etica per aziende tech o istituzioni. Ruolo raro e crescente nell'era AI.", en: '', he: '' }, firstStep: { it: "PhD + pubblicazioni + advisory per aziende tech dove l'etica è urgente.", en: '', he: '' } },
    { name: { it: "Spiritual Director / Mentore", en: '', he: '' }, desc: { it: "Guida spirituale per individui in percorsi profondi. Alto valore, piccolo volume, impatto massimo.", en: '', he: '' }, firstStep: { it: "Anni di pratica personale prima di guidare altri. Non si salta questa fase.", en: '', he: '' } },
    { name: { it: "Ricercatore di Neuroscienze / Coscienza", en: '', he: '' }, desc: { it: "Ricerca sull'interfaccia mente-corpo-spiritualità. Campo emergente con applicazioni mediche.", en: '', he: '' }, firstStep: { it: "PhD in neuroscienze + specializzazione in meditazione o stati di coscienza.", en: '', he: '' } },
  ],
  "creator_finance": [
    { name: { it: "Financial Content Creator", en: '', he: '' }, desc: { it: "Educazione finanziaria su social media — da creator a business con corsi, affiliate, prodotti. Graham Stephan è il modello.", en: '', he: '' }, firstStep: { it: "Scegli UN formato e pubblica ogni giorno per 6 mesi. La consistenza batte il talento.", en: '', he: '' } },
    { name: { it: "Trader con Audience", en: '', he: '' }, desc: { it: "Trader che documenta il percorso pubblicamente. L'audience diventa un asset parallelo al trading.", en: '', he: '' }, firstStep: { it: "Documenta ogni trade con il ragionamento completo. La trasparenza è il prodotto.", en: '', he: '' } },
    { name: { it: "Investment Storyteller", en: '', he: '' }, desc: { it: "Racconta storie di investimento per fondi, startup, e aziende. Il contenuto finanziario che converte vale molto.", en: '', he: '' }, firstStep: { it: "Crea contenuto per tre fondi gratuitamente e costruisci il portfolio.", en: '', he: '' } },
    { name: { it: "Crypto Artist / Creator", en: '', he: '' }, desc: { it: "Artista nell'intersezione arte-finanza-blockchain. Se sei early e bravo, il potenziale è illimitato.", en: '', he: '' }, firstStep: { it: "Costruisci la community prima di vendere. Il drop funziona solo con audience calda.", en: '', he: '' } },
  ],
  "creator_tech": [
    { name: { it: "Developer Content Creator", en: '', he: '' }, desc: { it: "Tutorial, strumenti open source, blog tecnico — la reputazione apre porte infinite.", en: '', he: '' }, firstStep: { it: "Costruisci uno strumento open source che risolve il tuo problema. Pubblicalo.", en: '', he: '' } },
    { name: { it: "Game Developer Indipendente", en: '', he: '' }, desc: { it: "Sviluppa giochi con visione artistica unica. Il mercato indie premia l'originalità.", en: '', he: '' }, firstStep: { it: "Prototipo giocabile in 30 giorni. Pubblica gratis su itch.io. Feedback reale prima dell'investimento.", en: '', he: '' } },
    { name: { it: "No-Code Creator / Educator", en: '', he: '' }, desc: { it: "Costruisci prodotti digitali senza codice e insegna agli altri come farlo. Mercato in esplosione.", en: '', he: '' }, firstStep: { it: "Costruisci e vendi un template o micro-prodotto no-code. Poi insegna.", en: '', he: '' } },
    { name: { it: "Tech Reviewer / Analyst Creator", en: '', he: '' }, desc: { it: "Valuta prodotti tech per un'audience specifica. La credibilità tecnica + comunicazione = impero.", en: '', he: '' }, firstStep: { it: "Specializzati in UNA categoria e sii il migliore lì.", en: '', he: '' } },
  ],
  "creator_art": [
    { name: { it: "Artista / Illustratore Indipendente", en: '', he: '' }, desc: { it: "Arte come business — prints, commissioni, licensing, NFT, merchandise.", en: '', he: '' }, firstStep: { it: "Scegli una piattaforma. Pubblica ogni giorno per 90 giorni. Non fermarti.", en: '', he: '' } },
    { name: { it: "Fashion Designer / Creative", en: '', he: '' }, desc: { it: "Designer con punto di vista estetico forte. Il mercato premia l'identità.", en: '', he: '' }, firstStep: { it: "Dieci pezzi straordinari valgono più di cento mediocri.", en: '', he: '' } },
    { name: { it: "Musician / Music Artist", en: '', he: '' }, desc: { it: "Artista musicale con business model moderno. Il sync licensing (musica per film) è il revenue stream più stabile.", en: '', he: '' }, firstStep: { it: "Investi nel sync licensing prima dello streaming. I margini sono incomparabili.", en: '', he: '' } },
    { name: { it: "Photographer / Videographer Premium", en: '', he: '' }, desc: { it: "Specialista visuale per clienti premium. Le tariffe nella fotografia luxury sono senza tetto.", en: '', he: '' }, firstStep: { it: "Portfolio verso l'alto — ogni lavoro migliore del precedente.", en: '', he: '' } },
  ],
  "creator_luxury": [
    { name: { it: "Luxury Content Creator", en: '', he: '' }, desc: { it: "Creator di contenuto nel lusso — brand deals, travel, unboxing. I luxury creator guadagnano cifre da sogno.", en: '', he: '' }, firstStep: { it: "Scegli UNA categoria di lusso e sii il riferimento assoluto in quella nicchia.", en: '', he: '' } },
    { name: { it: "Jewelry / Watch Designer", en: '', he: '' }, desc: { it: "Designer di gioielleria o orologeria con identità forte. Il lusso paga il racconto.", en: '', he: '' }, firstStep: { it: "Il primo pezzo deve essere indimenticabile. Inizia con UN pezzo perfetto.", en: '', he: '' } },
    { name: { it: "Luxury Lifestyle Brand Personale", en: '', he: '' }, desc: { it: "Il tuo stile di vita come aspirazione autenticamente vissuta e monetizzata.", en: '', he: '' }, firstStep: { it: "Vivi il lusso autenticamente prima di parlarne. Il pubblico sente la falsità.", en: '', he: '' } },
    { name: { it: "Luxury Event Creator", en: '', he: '' }, desc: { it: "Ideazione e cura di esperienze esclusive per chi non si accontenta del normale.", en: '', he: '' }, firstStep: { it: "Il primo evento gratis per dieci persone giuste crea referral che costruiscono tutto.", en: '', he: '' } },
  ],
  "creator_nature": [
    { name: { it: "Nature Content Creator", en: '', he: '' }, desc: { it: "Fotografia naturalistica, documentari, educazione ambientale. National Geographic era un magazine — ora è un modello replicabile.", en: '', he: '' }, firstStep: { it: "Specializzazione geografica o tematica è più potente del generalismo.", en: '', he: '' } },
    { name: { it: "Plant / Garden Designer", en: '', he: '' }, desc: { it: "Designer di spazi verdi urbani o residenziali premium. La domanda di biofilia cresce.", en: '', he: '' }, firstStep: { it: "Fotografa ogni progetto come se fosse su Architectural Digest. Il portfolio visuale è il prodotto.", en: '', he: '' } },
    { name: { it: "Outdoor Adventure Creator", en: '', he: '' }, desc: { it: "Guide di esperienze in natura per alto-spending. L'avventura autentica documentata trova audience globale.", en: '', he: '' }, firstStep: { it: "Una singola esperienza straordinaria documentata può cambiare tutto istantaneamente.", en: '', he: '' } },
    { name: { it: "Sustainable Living Educator", en: '', he: '' }, desc: { it: "Creator di contenuto sulla vita sostenibile. Mercato in esplosione.", en: '', he: '' }, firstStep: { it: "Vivi le pratiche prima di insegnarle. L'autenticità è il prodotto.", en: '', he: '' } },
  ],
  "creator_people": [
    { name: { it: "Life / Career Coach Creator", en: '', he: '' }, desc: { it: "Coach con audience — corsi, community, 1:1 high ticket, speaking. La scalabilità è nel contenuto.", en: '', he: '' }, firstStep: { it: "Prima dieci clienti 1:1. Documenta i risultati. Poi scala con il contenuto.", en: '', he: '' } },
    { name: { it: "Educator / Teacher Online", en: '', he: '' }, desc: { it: "Insegna quello che sai meglio. Il mercato dell'education online vale $300B.", en: '', he: '' }, firstStep: { it: "Corso pilota live di 4 settimane. Valida la domanda prima di produrre qualsiasi video.", en: '', he: '' } },
    { name: { it: "Community Builder / Host", en: '', he: '' }, desc: { it: "Costruisci comunità intorno a valori condivisi e monetizza con membership ed eventi.", en: '', he: '' }, firstStep: { it: "La community gratuita deve essere eccellente prima di chiedere un pagamento.", en: '', he: '' } },
    { name: { it: "Social Impact Creator", en: '', he: '' }, desc: { it: "Costruisci una missione pubblica con revenue. Il pubblico finanzia l'impatto quando la storia è autentica.", en: '', he: '' }, firstStep: { it: "La missione deve essere chiara e vissuta prima del prodotto.", en: '', he: '' } },
  ],
  "creator_knowledge": [
    { name: { it: "Scrittore / Author", en: '', he: '' }, desc: { it: "Libri come piattaforma — non solo royalties ma speaker fee, corsi, consulting. Un libro straordinario apre porte per un decennio.", en: '', he: '' }, firstStep: { it: "Scrivi il libro che vuoi leggere tu. L'autenticità è il filtro migliore.", en: '', he: '' } },
    { name: { it: "Podcaster / Newsletter Author", en: '', he: '' }, desc: { it: "Media personale su una nicchia specifica — l'audience è l'asset che si apprezza nel tempo.", en: '', he: '' }, firstStep: { it: "Cento episodi prima di monetizzare. La community si costruisce lentamente ma dura per sempre.", en: '', he: '' } },
    { name: { it: "Filmmaker / Documentarista", en: '', he: '' }, desc: { it: "Racconta storie reali con un punto di vista forte. Il documentario è la forma narrativa più potente.", en: '', he: '' }, firstStep: { it: "Il primo documentario corto distribuito gratis costruisce credibilità impossibile da comprare.", en: '', he: '' } },
    { name: { it: "Investigative Reporter", en: '', he: '' }, desc: { it: "Reporting di impatto su temi complessi. La reputazione è l'unico asset.", en: '', he: '' }, firstStep: { it: "Uno scoop grande vale cinque anni di lavoro ordinario. Punta in alto ogni volta.", en: '', he: '' } },
  ],
  "creator_sport": [
    { name: { it: "Atleta Professionista", en: '', he: '' }, desc: { it: "La via più diretta — se hai talento e dedizione totale, il mercato premia l'eccellenza.", en: '', he: '' }, firstStep: { it: "Specializzazione assoluta in una disciplina. La versatilità è l'anti-pattern.", en: '', he: '' } },
    { name: { it: "Sports Content Creator", en: '', he: '' }, desc: { it: "Creator nel mondo dello sport — tutorial, analisi, lifestyle, behind-the-scenes.", en: '', he: '' }, firstStep: { it: "Scegli lo sport dove hai credibilità reale e documenta il percorso con onestà totale.", en: '', he: '' } },
    { name: { it: "Fitness / Wellness Creator", en: '', he: '' }, desc: { it: "Creator nel wellness — da social a corsi, app, prodotti, partnership brand.", en: '', he: '' }, firstStep: { it: "La tua trasformazione personale è il contenuto. Prima e dopo, documentati con onestà.", en: '', he: '' } },
    { name: { it: "Sport Apparel / Equipment Brand", en: '', he: '' }, desc: { it: "Brand di abbigliamento sportivo con community forte. Gymshark era una startup da garage.", en: '', he: '' }, firstStep: { it: "La community prima del prodotto. Diecimila follower prima del lancio.", en: '', he: '' } },
  ],
  "creator_food": [
    { name: { it: "Food Content Creator / Chef Online", en: '', he: '' }, desc: { it: "Creator di contenuto culinario. Ottolenghi, Nusret — il modello è provato.", en: '', he: '' }, firstStep: { it: "Un formato unico (cucina X con Y ingredienti) è più potente di una buona ricetta generica.", en: '', he: '' } },
    { name: { it: "Restaurant Concept Unico", en: '', he: '' }, desc: { it: "Non un ristorante — un'esperienza gastronomica con identità impossibile da replicare.", en: '', he: '' }, firstStep: { it: "L'identità viene prima del menu. Chi sei tu come chef è il prodotto principale.", en: '', he: '' } },
    { name: { it: "Food Brand Artigianale Premium", en: '', he: '' }, desc: { it: "Brand con storia autentica, artigianalità reale, distribuzione selettiva.", en: '', he: '' }, firstStep: { it: "Mercati locali e negozi premium prima dell'e-commerce. La reputazione locale apre i mercati nazionali.", en: '', he: '' } },
    { name: { it: "Culinary Educator", en: '', he: '' }, desc: { it: "Insegna l'arte e la scienza del cibo — scuola fisica, online, o ibrida.", en: '', he: '' }, firstStep: { it: "Dieci studenti paganti in un corso live prima di qualsiasi video.", en: '', he: '' } },
  ],
  "creator_craft": [
    { name: { it: "Maker / Artigiano Premium", en: '', he: '' }, desc: { it: "Crea prodotti fisici unici con altissima qualità e storytelling autentico.", en: '', he: '' }, firstStep: { it: "Il prezzo di un artigiano di lusso è 10x il costo. Non competere mai sul prezzo.", en: '', he: '' } },
    { name: { it: "Interior Designer con Identità", en: '', he: '' }, desc: { it: "Designer di interni con punto di vista estetico riconoscibile.", en: '', he: '' }, firstStep: { it: "Ogni progetto fotografato da un professionista. Il portfolio è il biglietto da visita.", en: '', he: '' } },
    { name: { it: "Custom / Restoration Specialist", en: '', he: '' }, desc: { it: "Restauro e personalizzazione di veicoli, orologi, o oggetti di lusso.", en: '', he: '' }, firstStep: { it: "Un progetto straordinario documentato può cambiare la carriera istantaneamente.", en: '', he: '' } },
    { name: { it: "Product Designer / Furniture", en: '', he: '' }, desc: { it: "Designer di mobili o prodotti con identità forte. La storia del pezzo vale quanto il pezzo nel lusso.", en: '', he: '' }, firstStep: { it: "Il processo è il prodotto — documenta ogni fase come se fosse arte.", en: '', he: '' } },
  ],
  "creator_media": [
    { name: { it: "YouTuber / Streamer", en: '', he: '' }, desc: { it: "Creator su piattaforme video — dal primo video alla media company. Il formato conta più del talento.", en: '', he: '' }, firstStep: { it: "La nicchia più stretta possibile prima dell'espansione. Profondità prima di larghezza.", en: '', he: '' } },
    { name: { it: "Regista / Filmmaker", en: '', he: '' }, desc: { it: "Racconta storie con la camera — da short form a lungometraggi.", en: '', he: '' }, firstStep: { it: "Un cortometraggio al mese per un anno. La quantità porta alla qualità.", en: '', he: '' } },
    { name: { it: "Attore / Performer", en: '', he: '' }, desc: { it: "Performer professionale — teatro, cinema, TV, o nuovi formati digitali.", en: '', he: '' }, firstStep: { it: "Il training non finisce mai. I migliori attori studiano per tutta la vita.", en: '', he: '' } },
    { name: { it: "Game Creator / Esports", en: '', he: '' }, desc: { it: "Maker di giochi o streamer nel gaming. Il mercato supera cinema e musica combinati.", en: '', he: '' }, firstStep: { it: "Un solo gioco, una sola piattaforma, perfezionati prima di diversificare.", en: '', he: '' } },
  ],
  "creator_spirit": [
    { name: { it: "Spiritual Content Creator", en: '', he: '' }, desc: { it: "Contenuto su crescita personale, spiritualità, meditazione. L'audience globale per questo è immensa.", en: '', he: '' }, firstStep: { it: "L'autenticità della pratica personale è il contenuto. Non fingere di essere dove non sei.", en: '', he: '' } },
    { name: { it: "Mindfulness / Meditation Teacher", en: '', he: '' }, desc: { it: "Insegnante con propria metodologia e brand. Il mercato corporate del mindfulness esplode.", en: '', he: '' }, firstStep: { it: "Cento ore di pratica per ogni ora di insegnamento. Il profondo viene prima del pubblico.", en: '', he: '' } },
    { name: { it: "Spiritual Author / Speaker", en: '', he: '' }, desc: { it: "Libro e palco come piattaforma per una visione del mondo. Eckhart Tolle — l'autenticità trasforma.", en: '', he: '' }, firstStep: { it: "Scrivi quello che hai vissuto profondamente, non quello che hai letto.", en: '', he: '' } },
    { name: { it: "Retreat / Transformational Experience", en: '', he: '' }, desc: { it: "Cura esperienze trasformative per persone in ricerca di significato profondo.", en: '', he: '' }, firstStep: { it: "Il primo retreat gratuito per dieci persone crea i testimonial che vendono tutti i successivi.", en: '', he: '' } },
  ],
  "connector_finance": [
    { name: { it: "Fundraiser / Capital Raiser", en: '', he: '' }, desc: { it: "Connetti investitori e opportunità — il tuo network è il prodotto. I migliori raccolgono $100M+ all'anno.", en: '', he: '' }, firstStep: { it: "Inizia con deal del tuo network personale. Il track record documentato è tutto.", en: '', he: '' } },
    { name: { it: "Private Banker / Wealth Manager", en: '', he: '' }, desc: { it: "Gestisci le relazioni con clienti HNWI. Il libro clienti si apprezza ogni anno.", en: '', he: '' }, firstStep: { it: "Il libro clienti si costruisce in decenni. Inizia presto, sii eccezionale.", en: '', he: '' } },
    { name: { it: "Investment Banking → Director", en: '', he: '' }, desc: { it: "Scala la gerarchia dell'investment banking. I managing director top guadagnano $3-5M all'anno.", en: '', he: '' }, firstStep: { it: "Top firm come analista. La rete che costruisci lì dura tutta la vita.", en: '', he: '' } },
    { name: { it: "Insurance Advisor Premium", en: '', he: '' }, desc: { it: "Consulente assicurativo per HNWI — fee-only, non commissionato. La fiducia genera referral.", en: '', he: '' }, firstStep: { it: "Il modello fee-only crea più fiducia e più referral del modello a commissione.", en: '', he: '' } },
  ],
  "connector_tech": [
    { name: { it: "Business Development Director", en: '', he: '' }, desc: { it: "Costruisci le relazioni che fanno crescere i business tech. Il BD eccellente è il CEO in incognito.", en: '', he: '' }, firstStep: { it: "Specializzazione in un tipo di partnership e diventa il riferimento.", en: '', he: '' } },
    { name: { it: "Venture Scout / Deal Connector", en: '', he: '' }, desc: { it: "Connetti startup con fondi VC. Il tuo dealflow esclusivo è l'asset principale.", en: '', he: '' }, firstStep: { it: "Sii il primo a identificare i migliori founder nel tuo network prima che diventino ovvi.", en: '', he: '' } },
    { name: { it: "Product Manager Senior", en: '', he: '' }, desc: { it: "L'intersezione tra business, tech, e utente. Il PM di un prodotto di successo ha leverage enorme.", en: '', he: '' }, firstStep: { it: "Inizia con un prodotto consumer di cui sei utente appassionato.", en: '', he: '' } },
    { name: { it: "Tech Evangelist / Developer Relations", en: '', he: '' }, desc: { it: "Rappresenti una piattaforma tech e costruisci la community. Credibilità tecnica + skills comunicative.", en: '', he: '' }, firstStep: { it: "Rarissima combinazione, straordinariamente pagata. Coltivale entrambe.", en: '', he: '' } },
  ],
  "connector_art": [
    { name: { it: "Art Dealer / Gallerista", en: '', he: '' }, desc: { it: "Connetti artisti e collezionisti. I top dealer costruiscono mercati.", en: '', he: '' }, firstStep: { it: "Inizia con artisti emergenti. I grandi collezionisti cercano chi scopre talenti.", en: '', he: '' } },
    { name: { it: "Talent Agent / Manager Creativo", en: '', he: '' }, desc: { it: "Rappresenta artisti, musicisti, designer. Il tuo giudizio sui talenti è il prodotto.", en: '', he: '' }, firstStep: { it: "Tre talenti in cui credi profondamente. Dedicati totalmente a loro prima di scalare.", en: '', he: '' } },
    { name: { it: "Creative Director / Brand Partner", en: '', he: '' }, desc: { it: "Partner creativo per brand che vogliono direzione artistica forte.", en: '', he: '' }, firstStep: { it: "Il network nei brand giusti vale più del portfolio. Investi nelle relazioni.", en: '', he: '' } },
    { name: { it: "Cultural Event Curator", en: '', he: '' }, desc: { it: "Cura esperienze culturali ed artistiche per brand e istituzioni.", en: '', he: '' }, firstStep: { it: "Il primo evento deve sorprendere radicalmente — non soddisfare le aspettative, superarle.", en: '', he: '' } },
  ],
  "connector_luxury": [
    { name: { it: "Luxury Real Estate Agent", en: '', he: '' }, desc: { it: "Agente immobiliare nel segmento ultra-premium. Le commissioni su asset da €10M+ sono life-changing.", en: '', he: '' }, firstStep: { it: "L'accesso agli HNWI precede i listing. Costruisci il network prima delle opportunità.", en: '', he: '' } },
    { name: { it: "Luxury Concierge / Lifestyle Manager", en: '', he: '' }, desc: { it: "Gestisci la vita e i desideri di clienti HNWI. Il tuo network è la tua moneta.", en: '', he: '' }, firstStep: { it: "Inizia con servizi ad hoc per persone benestanti del tuo network. La soddisfazione crea referral.", en: '', he: '' } },
    { name: { it: "Luxury Travel Designer", en: '', he: '' }, desc: { it: "Progetta viaggi su misura per HNWI. L'accesso alle esperienze inaccessibili è il prodotto.", en: '', he: '' }, firstStep: { it: "Il primo viaggio deve essere così straordinario che il cliente non può fare a meno di raccontarlo.", en: '', he: '' } },
    { name: { it: "Luxury Brand Ambassador / PR", en: '', he: '' }, desc: { it: "Costruisci l'immagine e le relazioni di brand di lusso nel mercato.", en: '', he: '' }, firstStep: { it: "Una relazione autentica con un brand giusto vale più di cento contratti mediocri.", en: '', he: '' } },
  ],
  "connector_nature": [
    { name: { it: "Sustainability Consultant", en: '', he: '' }, desc: { it: "Aiuta aziende ad implementare pratiche sostenibili. La domanda ESG è esplosa.", en: '', he: '' }, firstStep: { it: "Specializzazione in un settore specifico (moda, food, real estate) invece di fare tutto.", en: '', he: '' } },
    { name: { it: "Eco-Tourism Operator Premium", en: '', he: '' }, desc: { it: "Organizza esperienze naturalistiche premium per viaggiatori high-end.", en: '', he: '' }, firstStep: { it: "Una destinazione unica + esperienza irripetibile + distribuzione giusta = business solido.", en: '', he: '' } },
    { name: { it: "Community Supported Agriculture", en: '', he: '' }, desc: { it: "Connetti produttori locali con consumatori urbani. Il modello CSA crea stabilità per entrambe le parti.", en: '', he: '' }, firstStep: { it: "Inizia con 20 famiglie. Il modello di abbonamento crea stabilità economica prevedibile.", en: '', he: '' } },
    { name: { it: "Environmental NGO Director", en: '', he: '' }, desc: { it: "Guida un'organizzazione per la protezione di ecosistemi o specie. L'impatto si misura in secoli.", en: '', he: '' }, firstStep: { it: "Il fundraising è la skill più critica. Imparala prima di qualsiasi altra cosa.", en: '', he: '' } },
  ],
  "connector_people": [
    { name: { it: "Leadership Coach / Facilitatore", en: '', he: '' }, desc: { it: "Lavori con team e leader per migliorare cultura e performance. I top executive coach guadagnano $1M+.", en: '', he: '' }, firstStep: { it: "ICF certification + specializzazione in un tipo di organizzazione. Il segmento determina il prezzo.", en: '', he: '' } },
    { name: { it: "Executive Recruiter / Head Hunter", en: '', he: '' }, desc: { it: "Ricerca e selezione di talenti C-suite. Le commissioni sono percentuali di RAL su $500K+.", en: '', he: '' }, firstStep: { it: "Specializzazione assoluta in un settore. Il generalismo non paga.", en: '', he: '' } },
    { name: { it: "Community Director", en: '', he: '' }, desc: { it: "Costruisci e gestisci comunità per brand o in autonomia. Le community forti sono i business più difendibili.", en: '', he: '' }, firstStep: { it: "Costruisci prima la tua community personale. Poi le aziende vengono da te.", en: '', he: '' } },
    { name: { it: "HR Consultant / People Advisor", en: '', he: '' }, desc: { it: "Strategia HR per aziende in crescita. Startup in scaling hanno bisogno urgente di questo.", en: '', he: '' }, firstStep: { it: "Inizia con startup in fase di scaling rapido. Il bisogno è urgente e il budget c'è.", en: '', he: '' } },
  ],
  "connector_knowledge": [
    { name: { it: "Speaker Professionista", en: '', he: '' }, desc: { it: "Il tuo punto di vista a conferenze e aziende. I top speaker guadagnano $30-100K per keynote.", en: '', he: '' }, firstStep: { it: "Il primo speech gratuito all'evento giusto vale più di dieci speech pagati agli eventi sbagliati.", en: '', he: '' } },
    { name: { it: "Editore / Publisher", en: '', he: '' }, desc: { it: "Porta libri e idee al mondo. L'editore giusto crea carriere e determina il mercato delle idee.", en: '', he: '' }, firstStep: { it: "Inizia con una collana digitale su una nicchia specifica.", en: '', he: '' } },
    { name: { it: "Strategic Consultant / Advisor", en: '', he: '' }, desc: { it: "Consulenza su strategie e decisioni complesse. Si paga il tuo giudizio, non il tuo tempo.", en: '', he: '' }, firstStep: { it: "Posizionati come advisor invece che consulente. La distinzione cambia il modello economico.", en: '', he: '' } },
    { name: { it: "Policy Advisor / Think Tank", en: '', he: '' }, desc: { it: "Influenza decisioni pubbliche attraverso ricerca e relazioni.", en: '', he: '' }, firstStep: { it: "La reputazione accademica o giornalistica è il biglietto d'ingresso.", en: '', he: '' } },
  ],
  "connector_sport": [
    { name: { it: "Sports Agent / Player Representative", en: '', he: '' }, desc: { it: "Rappresenta atleti nelle negoziazioni contrattuali. I migliori agenti guadagnano quanto i campioni.", en: '', he: '' }, firstStep: { it: "I migliori agenti iniziano con atleti giovani e crescono con loro.", en: '', he: '' } },
    { name: { it: "Sports Marketing Director", en: '', he: '' }, desc: { it: "Gestisci partnership e sponsorship per atleti, club, o federazioni.", en: '', he: '' }, firstStep: { it: "Il network nei brand giusti precede il mandato. Le relazioni aprono le porte.", en: '', he: '' } },
    { name: { it: "Club Manager / Director", en: '', he: '' }, desc: { it: "Gestisci le operazioni di un club sportivo. Il management sportivo è industria da $600B globali.", en: '', he: '' }, firstStep: { it: "Inizia in un club amateur. Il management sportivo si impara sul campo.", en: '', he: '' } },
    { name: { it: "Sports Event Organizer", en: '', he: '' }, desc: { it: "Organizza competizioni, tornei, ed eventi sportivi.", en: '', he: '' }, firstStep: { it: "Il primo evento anche in perdita è il costo del know-how e del network.", en: '', he: '' } },
  ],
  "connector_food": [
    { name: { it: "Food & Beverage Distributor Premium", en: '', he: '' }, desc: { it: "Connetti produttori di qualità con il mercato. Distribuzione selettiva ad alto margine.", en: '', he: '' }, firstStep: { it: "Cinque produttori eccezionali e venti punti vendita premium. Reputazione prima di volume.", en: '', he: '' } },
    { name: { it: "Restaurant Group Manager", en: '', he: '' }, desc: { it: "Gestisci operazioni di un gruppo di ristorazione. L'ospitalità scalata è un business da miliardi.", en: '', he: '' }, firstStep: { it: "L'esperienza operativa in prima linea è imprescindibile.", en: '', he: '' } },
    { name: { it: "Food PR & Communication Director", en: '', he: '' }, desc: { it: "Costruisci reputazione e visibilità per chef, ristoranti, e brand food.", en: '', he: '' }, firstStep: { it: "Un lancio memorabile crea referral per i prossimi dieci clienti.", en: '', he: '' } },
    { name: { it: "Corporate Catering & Events", en: '', he: '' }, desc: { it: "Gestisci ristorazione collettiva per aziende. Contratti pluriennali garantiscono predictability.", en: '', he: '' }, firstStep: { it: "Il primo contratto corporate richiede referenze. Inizia con aziende del tuo network.", en: '', he: '' } },
  ],
  "connector_craft": [
    { name: { it: "Real Estate Agent Premium", en: '', he: '' }, desc: { it: "Intermediazione immobiliare nel segmento alto. Le commissioni su asset da €1M+ cambiano la vita.", en: '', he: '' }, firstStep: { it: "Meglio essere il miglior agente di una zona che mediocre ovunque.", en: '', he: '' } },
    { name: { it: "Supply Chain Director", en: '', he: '' }, desc: { it: "Ottimizza la catena di approvvigionamento. Ruolo silenzioso che vale milioni.", en: '', he: '' }, firstStep: { it: "Specializzazione in un settore (pharma, luxury, tech) è 3x più pagata del generalismo.", en: '', he: '' } },
    { name: { it: "Project Manager Senior / Construction", en: '', he: '' }, desc: { it: "Coordina progetti di costruzione complessi. I PM di grandi opere gestiscono budget enormi.", en: '', he: '' }, firstStep: { it: "PMP certification + specializzazione in un tipo di progetto (luxury residential, infrastructure).", en: '', he: '' } },
    { name: { it: "Procurement Director", en: '', he: '' }, desc: { it: "Gestisci gli acquisti strategici di un'organizzazione. Il tuo network con i fornitori è l'asset.", en: '', he: '' }, firstStep: { it: "La negoziazione è la skill core. Investici più che in qualsiasi altra competenza.", en: '', he: '' } },
  ],
  "connector_media": [
    { name: { it: "Talent Manager / Agent", en: '', he: '' }, desc: { it: "Rappresenta creator, attori, musicisti. Il tuo giudizio sui talenti è il prodotto.", en: '', he: '' }, firstStep: { it: "Tre talenti in cui credi profondamente prima di scalare il portfolio.", en: '', he: '' } },
    { name: { it: "Entertainment Lawyer", en: '', he: '' }, desc: { it: "Legale specializzato in contratti entertainment. Il punto di contatto tra talento e industria.", en: '', he: '' }, firstStep: { it: "Laurea + specializzazione IP/entertainment + network nell'industria.", en: '', he: '' } },
    { name: { it: "Media Sales Director", en: '', he: '' }, desc: { it: "Vendi spazi e partnership per media company o creator. Le relazioni con i brand giusti sono l'asset.", en: '', he: '' }, firstStep: { it: "Le relazioni costruite nel tempo sono l'unico asset che conta in questo ruolo.", en: '', he: '' } },
    { name: { it: "Festival / Event Director", en: '', he: '' }, desc: { it: "Cura e dirigi festival culturali, musicali, o di intrattenimento.", en: '', he: '' }, firstStep: { it: "Il network con artisti e brand è il prerequisito. Costruiscilo anni prima del festival.", en: '', he: '' } },
  ],
  "connector_spirit": [
    { name: { it: "Philanthropy Advisor", en: '', he: '' }, desc: { it: "Aiuta HNWI e fondazioni a massimizzare l'impatto delle donazioni. Ruolo raro, accesso esclusivo.", en: '', he: '' }, firstStep: { it: "La credibilità nel nonprofit è il biglietto d'ingresso. Costruiscila prima dell'advisory.", en: '', he: '' } },
    { name: { it: "Mindfulness Corporate Trainer", en: '', he: '' }, desc: { it: "Porta pratiche di wellbeing nelle aziende. La domanda è esplosa e non si è fermata.", en: '', he: '' }, firstStep: { it: "MBSR certification + specializzazione corporate + prime aziende attraverso il network.", en: '', he: '' } },
    { name: { it: "Religious Community Leader", en: '', he: '' }, desc: { it: "Guida una comunità di fede con impatto reale sulla vita delle persone.", en: '', he: '' }, firstStep: { it: "Il percorso formativo specifico alla tradizione + anni di pratica e studio.", en: '', he: '' } },
    { name: { it: "Interfaith / Cultural Mediator", en: '', he: '' }, desc: { it: "Media tra comunità culturali e religiose diverse. Ruolo raro e preziosissimo nel mondo globalizzato.", en: '', he: '' }, firstStep: { it: "La credibilità autentica in entrambe le tradizioni è il prerequisito imprescindibile.", en: '', he: '' } },
  ],
};
