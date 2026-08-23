/**
 * Single source of truth for every string on the site.
 *
 * Replaces the prototype's twin-`<span>` language trick (README, "Language toggle").
 * Every entry is a { pt, en } pair; the active language comes from the nav toggle.
 *
 * PROVENANCE — content here is drawn from two documents João supplied on 2026-08-22:
 *   - CV_joao_vitor_melo_2026.pdf
 *   - LinkedIn Profile.pdf
 * Anything not traceable to those documents is marked TODO and must be confirmed before launch.
 */

export type Lang = 'pt' | 'en';
export type T = Record<Lang, string>;

/** Shared destinations, so a URL is never written twice. */
export const links = {
  linkedin: 'https://www.linkedin.com/in/joaovmelo',
  behance: 'https://www.behance.net/joaovmelo',
  dribbble: 'https://dribbble.com/joaomeloux',
  steam: 'https://steamcommunity.com/id/hiyute/',
  email: 'joaovitormelo3105@gmail.com',
  phone: '+55 34 99637-5495',
  whatsapp: 'https://wa.me/5534996375495',
  cv: 'https://drive.google.com/file/d/18qRteB14vsWrBLrgc3R2b17SUTsGGNaX/view',
} as const;

/* ---------------------------------------------------------------- nav */

export const nav = {
  wordmark: 'JoãoV.Melo',
  langPt: 'Português (PT-BR)',
  langEn: 'English (EN-US)',
  cta: { pt: 'Entrar em contato', en: 'Get in touch' } satisfies T,
};

/* --------------------------------------------------------------- hero */

export const hero = {
  /**
   * "Senior" is correct and confirmed by João (2026-08-22): he works at Senior level on
   * projects, even though his CLT employment titles top out at Pleno. Settled — do not soften.
   */
  kicker: {
    pt: 'Senior Product Designer // CX Designer // AI Product Builder',
    en: 'Senior Product Designer // CX Designer // AI Product Builder',
  } satisfies T,

  /**
   * Hard-broken lines — the breaks are part of the design (README §2).
   *
   * Re-broken from three lines to two on 2026-08-22, per João's reference layout. This is what
   * pays for the wider spacing below: two lines at 80px cost 156.8px against the three-line
   * 235.2px, freeing 78.4px of the first-screen budget.
   */
  title: {
    pt: ['Design com foco em experiência,', 'produto e métricas'],
    en: ['Design focused on experience,', 'product and metrics'],
  } satisfies Record<Lang, string[]>,

  /**
   * Three hard-broken lines. Updated from the prototype: adds the global consultancy and names
   * the AI work, which is now central to his positioning.
   *
   * "9 anos" is counted from 2017 — João's official framing, settled. Do not recompute it from
   * the earliest CV entry (Silk & Arte, 2015), which he deliberately does not count.
   */
  paragraph: {
    pt: [
      'Olá! Sou o João. Product Designer com 9 anos em design, sendo 6 deles',
      'dedicados a produtos digitais. Passei por banking em escala, varejo de alto',
      'volume, consultoria global e startups — hoje com foco em craft, métricas e IA.',
    ],
    en: [
      'Hi! I’m João. A Product Designer with 9 years in design, 6 of them devoted',
      'to digital products. I’ve worked across banking at scale, high-volume retail,',
      'global consultancy and startups — now focused on craft, metrics and AI.',
    ],
  } satisfies Record<Lang, string[]>,

  cta: { pt: 'Entrar em contato', en: 'Get in touch' } satisfies T,
};

/* ------------------------------------------------------------- mascot */

export const mascot = {
  bubble: {
    pt: 'ACESSAR ÁREA SECRETA',
    en: 'ENTER THE SECRET AREA',
  } satisfies T,
  label: {
    pt: 'Acessar área secreta',
    en: 'Enter the secret area',
  } satisfies T,
};

/* ------------------------------------------------------------ marquee */

export const marquee = {
  pt: 'UI/UX · PRODUCT DESIGN · CX DESIGN · BRAND DESIGN · AI BUILDING · MÉTRICAS · DESIGN SYSTEMS ·',
  en: 'UI/UX · PRODUCT DESIGN · CX DESIGN · BRAND DESIGN · AI BUILDING · METRICS · DESIGN SYSTEMS ·',
} satisfies T;

/* -------------------------------------------------------------- cases */

export type Case = {
  slug: string;
  title: T;
  company: T;
  description: T;
  /** TODO: full-bleed photography — none exists yet (README "Open items" #1). */
  photo: string | null;
};

/**
 * PROPOSED. The prototype shipped four "Nome do case / Empresa" placeholders. These four are
 * drawn from the strongest, best-evidenced work in his CV and LinkedIn — but João has not yet
 * confirmed which projects he wants as the headline cases, and none of them have photography.
 * Every number below traces to a source document.
 */
export const cases: Case[] = [
  {
    slug: 'itau-cartoes-pj',
    title: {
      pt: 'Contestação de despesas em cartões PJ',
      en: 'Expense disputes for business cards',
    },
    company: { pt: 'Itaú Unibanco · via NTT DATA', en: 'Itaú Unibanco · via NTT DATA' },
    description: {
      pt: 'Redesenhei as jornadas resolutivas e de segurança de um novo produto lançado com a VISA. A contestação de despesas saiu do telefone para o app — e o volume de ligações na Central caiu 21%.',
      en: 'Redesigned the resolution and security journeys of a new product launched with VISA. Expense disputes moved from the call centre into the app — cutting call volume by 21%.',
    },
    photo: null,
  },
  {
    slug: 'reserva-ink-aparencia-de-loja',
    title: {
      pt: 'Aparência de loja para 60 mil lojistas',
      en: 'Storefront appearance for 60k sellers',
    },
    company: { pt: 'Reserva INK · AZZAS 2154', en: 'Reserva INK · AZZAS 2154' },
    description: {
      pt: 'A configuração da loja era a maior fonte de tickets do produto. Reduzi a fricção do onboarding e da personalização: +90% de CSAT e 87% menos reclamações.',
      en: 'Store setup was the product’s biggest source of support tickets. I cut friction in onboarding and customisation: +90% CSAT and 87% fewer complaints.',
    },
    photo: null,
  },
  {
    slug: 'reserva-ink-imagens-de-vitrine',
    title: {
      pt: 'Imagens de vitrine em dois cliques',
      en: 'Showcase images in two clicks',
    },
    company: { pt: 'Reserva INK · AZZAS 2154', en: 'Reserva INK · AZZAS 2154' },
    description: {
      pt: 'Reescrevi a ferramenta de personalização de vitrine para um fluxo de dois cliques — 95% mais rápido, 99% de satisfação e 60% menos tempo e custo de criação para 92% dos usuários.',
      en: 'Rebuilt the showcase customisation tool into a two-click flow — 95% faster, 99% satisfaction, and 60% less creation time and cost for 92% of users.',
    },
    photo: null,
  },
  {
    slug: 'bricker-amelie',
    title: {
      pt: 'Amelie, a IA que lê documentos de crédito',
      en: 'Amelie, the AI that reads credit documents',
    },
    company: { pt: 'Bricker', en: 'Bricker' },
    description: {
      pt: 'Numa startup early-stage de crédito imobiliário, ajudei a criar a Amelie: uma IA que lê e valida documentos para análise prévia, tirando a burocracia do caminho de quem busca financiamento.',
      en: 'At an early-stage mortgage startup, I helped build Amelie: an AI that reads and validates documents for pre-approval, taking the bureaucracy out of the path to a home loan.',
    },
    photo: null,
  },
];

/* ----------------------------------------------------------- carousel */

export type Project = {
  slug: string;
  name: T;
  company: T;
  /** TODO: 16:9 imagery — none exists yet (README "Open items" #2). */
  image: string | null;
};

/**
 * PROPOSED, same caveat as `cases`. Six secondary projects pulled from real work in the
 * documents. Confirm with João; replace or reorder freely.
 */
export const projects: Project[] = [
  {
    slug: 'ems-saude',
    name: { pt: 'Treinamento de propagandistas com IA', en: 'AI-driven rep training' },
    company: { pt: 'EMS Saúde', en: 'EMS Saúde' },
    image: null,
  },
  {
    slug: 'itau-investimentos',
    name: { pt: 'Ativos escriturais e investimentos', en: 'Book-entry assets and investments' },
    company: { pt: 'Itaú Unibanco', en: 'Itaú Unibanco' },
    image: null,
  },
  {
    slug: 'zema-emprestimo-pessoal',
    name: { pt: 'Fluxo de empréstimo pessoal', en: 'Personal loan flow' },
    company: { pt: 'ZEMA', en: 'ZEMA' },
    image: null,
  },
  {
    slug: 'zema-black-friday',
    name: { pt: 'Landing page de Black Friday', en: 'Black Friday landing page' },
    company: { pt: 'ZEMA', en: 'ZEMA' },
    image: null,
  },
  {
    slug: 'm1place-ecommerce',
    name: { pt: 'Redesign do e-commerce', en: 'E-commerce redesign' },
    company: { pt: 'M1Place', en: 'M1Place' },
    image: null,
  },
  {
    slug: 'canva-creator',
    name: { pt: 'Templates como Canva Creator', en: 'Templates as a Canva Creator' },
    company: { pt: 'Canva', en: 'Canva' },
    image: null,
  },
];

/* ------------------------------------------------------- case pages */

export type CaseMedia = {
  /** null until real artwork exists; falls back to the generated placeholder. */
  src: string | null;
  caption: T;
  /**
   * true = this frame would show a real employer interface. Keep it null until João has
   * confirmed, per case, what his NDA allows him to publish.
   */
  confidential?: boolean;
};

export type CaseSection = { title: T; body: T };
export type Outcome = { value: string; label: T; note: T };

/**
 * Case pages are structured on the 6s / 60s / 6min method João asked for — layered by reading
 * depth rather than by chronology, so a recruiter skimming for six seconds and a design lead
 * reading for six minutes both get a coherent story at their own altitude.
 *
 *   6s    title, impact, context      — what this is and what it moved
 *   60s   conflict, decision, evidence — the tension, the call, the proof
 *   6min  detail, what changed the game
 *
 * The 60s layer is the one that separates senior from mid. Anyone can list what they shipped;
 * naming the conflict and stating what was *given up* to resolve it is the part that shows
 * judgement. That is also why those fields cannot be written from a CV — see the note below.
 */
export type CaseDetail = {
  slug: string;
  year: string;
  role: T;
  duration: T;
  team: T;

  /** ---- 6 seconds ---- */
  impact: Outcome;
  context: T;

  /** ---- 60 seconds ---- */
  /** The tension at the heart of the case. Two forces that could not both win. */
  conflict: T | null;
  /** What was deliberately given up to resolve it. The absence of this is what reads as junior. */
  tradeoff: T | null;
  /** The call that was made. */
  decision: T | null;
  /** The proof it worked. */
  evidence: Outcome[];

  /** ---- 6 minutes ---- */
  /** The single hardest thing about the work. */
  challenge: T | null;
  detail: CaseSection[];
  /** What this changed beyond the immediate metric. */
  gameChanger: T | null;

  contribution: T[];
  gallery: CaseMedia[];
};

/**
 * PROVENANCE — every populated field traces to the CV or LinkedIn export supplied 2026-08-22.
 *
 * `conflict`, `tradeoff`, `decision`, `challenge` and `gameChanger` are deliberately `null` on
 * every case. A CV records outcomes; it does not record which two forces were in tension, what
 * was sacrificed to resolve them, or what the hardest part actually was. Those live only in
 * João's head, and inventing them would be fabricating the exact material that is supposed to
 * demonstrate his judgement — the worst possible thing to guess at in a portfolio.
 *
 * The page renders a visible prompt wherever one of these is null, so a half-written case can
 * never be mistaken for a finished one.
 */
export const caseDetails: Record<string, CaseDetail> = {
  'itau-cartoes-pj': {
    slug: 'itau-cartoes-pj',
    year: '2025 — 2026',
    role: { pt: 'CX Designer / Product Designer', en: 'CX Designer / Product Designer' },
    duration: { pt: '11 meses', en: '11 months' },
    team: { pt: 'Itaú Unibanco, via NTT DATA', en: 'Itaú Unibanco, via NTT DATA' },

    impact: {
      value: '−21%',
      label: { pt: 'VOLUME DE LIGAÇÕES', en: 'CALL VOLUME' },
      note: {
        pt: 'Na Central de Atendimento, em contestação de despesas.',
        en: 'At the call centre, on expense disputes.',
      },
    },
    context: {
      pt: 'Cinco jornadas críticas de cartões PJ no Itaú, num produto lançado com a VISA.',
      en: 'Five critical business-card journeys at Itaú, in a product launched with VISA.',
    },

    conflict: null,
    tradeoff: null,
    decision: null,
    evidence: [
      {
        value: '−21%',
        label: { pt: 'LIGAÇÕES NA CENTRAL', en: 'CALL CENTRE VOLUME' },
        note: { pt: 'Em contestação de despesas.', en: 'On expense disputes.' },
      },
      {
        value: '5',
        label: { pt: 'JORNADAS CRÍTICAS', en: 'CRITICAL JOURNEYS' },
        note: {
          pt: 'Do mapeamento ao handoff: contestar despesas, consultar senha, bloqueio temporário, segunda via e dados físicos do cartão.',
          en: 'Mapping through handoff: disputes, PIN retrieval, temporary block, replacement, and physical card data.',
        },
      },
    ],

    challenge: null,
    detail: [
      {
        title: { pt: 'Onde isso aconteceu', en: 'Where this happened' },
        body: {
          pt: 'O Itaú é um dos maiores bancos da América Latina, e o time de design é um dos maiores do continente. Atuei pela NTT DATA no time de cartões da comunidade PJ, durante o lançamento de um produto novo em parceria com a VISA.',
          en: 'Itaú is one of Latin America’s largest banks, with one of the continent’s largest design teams. I worked through NTT DATA on the business-card team, during the launch of a new product built with VISA.',
        },
      },
      {
        title: { pt: 'Como foi construído', en: 'How it was built' },
        body: {
          pt: 'Dentro do JIP, o Jeito Itaú de Produtar, e sobre o iDS, o design system do banco — o que manteve consistência com o resto do produto e baixou o custo de implementação. Descoberta com Double Diamond, Matriz CSD e Continuous Discovery; validação com protótipos em alta e baixa fidelidade e testes de usabilidade, junto ao time de research.',
          en: 'Inside JIP, Itaú’s product framework, and on iDS, the bank’s design system — which kept consistency with the rest of the product and lowered implementation cost. Discovery through Double Diamond, CSD matrix and Continuous Discovery; validation through low- and high-fidelity prototypes and usability testing alongside the research team.',
        },
      },
    ],
    gameChanger: null,

    contribution: [
      {
        pt: 'Mapeei a jornada do cliente e construí as cinco jornadas críticas de cartões PJ.',
        en: 'Mapped the customer journey and built the five critical business-card flows.',
      },
      {
        pt: 'Ajustei layouts contra restrições e impactos de front-end, junto ao time de tecnologia.',
        en: 'Adjusted layouts against front-end constraints and impacts, with the engineering team.',
      },
      {
        pt: 'Conduzi rotinas de Design Critique e entrevistas de UX com usuários e stakeholders.',
        en: 'Ran Design Critique routines and UX interviews with users and stakeholders.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: { pt: 'Jornada de contestação de despesas.', en: 'The expense dispute journey.' },
        confidential: true,
      },
    ],
  },

  'reserva-ink-aparencia-de-loja': {
    slug: 'reserva-ink-aparencia-de-loja',
    year: '2023 — 2024',
    role: { pt: 'Product Designer Pleno', en: 'Product Designer' },
    duration: { pt: '1 ano e 4 meses', en: '1 year 4 months' },
    team: { pt: 'Reserva INK · grupo AZZAS 2154', en: 'Reserva INK · AZZAS 2154 group' },

    impact: {
      value: '+90%',
      label: { pt: 'AUMENTO DE CSAT', en: 'CSAT INCREASE' },
      note: {
        pt: 'Na configuração de aparência de loja.',
        en: 'On store appearance configuration.',
      },
    },
    context: {
      pt: 'A configuração de loja era a maior fonte de tickets do produto. Virou o fluxo de maior CSAT.',
      en: 'Store setup was the product’s biggest source of tickets. It became its highest-CSAT flow.',
    },

    conflict: null,
    tradeoff: null,
    decision: null,
    evidence: [
      {
        value: '+90%',
        label: { pt: 'CSAT', en: 'CSAT' },
        note: { pt: 'Na configuração de aparência de loja.', en: 'On store appearance configuration.' },
      },
      {
        value: '−87%',
        label: { pt: 'TICKETS DE RECLAMAÇÃO', en: 'COMPLAINT TICKETS' },
        note: { pt: 'Nos fluxos de configuração de loja.', en: 'Across the store configuration flows.' },
      },
      {
        value: '60k+',
        label: { pt: 'LOJISTAS NA PLATAFORMA', en: 'SELLERS ON THE PLATFORM' },
        note: { pt: 'Base ativa impactada pela mudança.', en: 'The active base the change reached.' },
      },
    ],

    challenge: null,
    detail: [
      {
        title: { pt: 'Onde isso aconteceu', en: 'Where this happened' },
        body: {
          pt: 'A INK é a plataforma de print on demand da Reserva, parte do grupo AZZAS 2154, o maior grupo de vestuário da América Latina. Mais de 60 mil empreendedores usam a plataforma para montar e operar as próprias lojas.',
          en: 'INK is Reserva’s print-on-demand platform, part of AZZAS 2154 — Latin America’s largest apparel group. Over 60,000 entrepreneurs use it to build and run their own stores.',
        },
      },
      {
        title: { pt: 'A evidência veio do suporte', en: 'The evidence came from support' },
        body: {
          pt: 'Os tickets de reclamação foram a fonte primária: os motivos apontavam direto para os pontos de quebra do fluxo. Somados a entrevistas de UX com lojistas e testes de usabilidade, deram o mapa do que precisava mudar.',
          en: 'Complaint tickets were the primary source — the reasons pointed straight at where the flow broke. Combined with UX interviews and usability testing, they mapped what had to change.',
        },
      },
    ],
    gameChanger: null,

    contribution: [
      {
        pt: 'Reescrevi o fluxo de configuração de aparência, reduzindo a fricção do onboarding.',
        en: 'Rebuilt the appearance configuration flow, cutting onboarding friction.',
      },
      {
        pt: 'Elevei o nível de design da plataforma e reduzi o custo operacional de suporte.',
        en: 'Raised the platform’s design standard and lowered support cost.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: { pt: 'Fluxo de configuração de aparência.', en: 'The appearance configuration flow.' },
        confidential: true,
      },
    ],
  },

  'reserva-ink-imagens-de-vitrine': {
    slug: 'reserva-ink-imagens-de-vitrine',
    year: '2023 — 2024',
    role: { pt: 'Product Designer Pleno', en: 'Product Designer' },
    duration: { pt: '1 ano e 4 meses', en: '1 year 4 months' },
    team: { pt: 'Reserva INK · grupo AZZAS 2154', en: 'Reserva INK · AZZAS 2154 group' },

    impact: {
      value: '99%',
      label: { pt: 'SATISFAÇÃO', en: 'SATISFACTION' },
      note: {
        pt: 'Entre mais de 60 mil empreendedores ativos.',
        en: 'Across 60,000+ active sellers.',
      },
    },
    context: {
      pt: 'Criar uma imagem de vitrine passou a custar dois cliques em vez de uma tarde.',
      en: 'Producing a showcase image went from an afternoon’s work to two clicks.',
    },

    conflict: null,
    tradeoff: null,
    decision: null,
    evidence: [
      {
        value: '99%',
        label: { pt: 'SATISFAÇÃO', en: 'SATISFACTION' },
        note: { pt: 'Na ferramenta de personalização de vitrine.', en: 'On the showcase customisation tool.' },
      },
      {
        value: '95%',
        label: { pt: 'MAIS RÁPIDO', en: 'FASTER' },
        note: { pt: 'Que o processo anterior — o fluxo caiu para dois cliques.', en: 'Than the previous process — the flow dropped to two clicks.' },
      },
      {
        value: '−60%',
        label: { pt: 'TEMPO E CUSTO', en: 'TIME AND COST' },
        note: { pt: 'De criação de produto, para 92% dos usuários.', en: 'Of product creation, for 92% of users.' },
      },
    ],

    challenge: null,
    detail: [
      {
        title: { pt: 'Por que isso importava', en: 'Why it mattered' },
        body: {
          pt: 'Todo produto na INK precisa de imagem de vitrine para vender. Sem ela, o item existe no catálogo mas não converte — e a maioria dos lojistas não é designer. O custo de criar produto era, na prática, uma barreira de entrada no negócio.',
          en: 'Every INK product needs a showcase image to sell. Without one, an item exists in the catalogue but does not convert — and most sellers are not designers. The cost of creating a product was, in practice, a barrier to entry.',
        },
      },
      {
        title: { pt: 'Acessibilidade como requisito de negócio', en: 'Accessibility as a business requirement' },
        body: {
          pt: 'O alcance da mudança dependia de funcionar para quem não tem repertório visual. Isso colocou acessibilidade e facilidade de uso como requisito, não como refinamento — e é o que explica os 92% de cobertura.',
          en: 'The reach of the change depended on it working for people with no visual training. That made accessibility and ease of use a requirement rather than a polish item — and it is what explains the 92% coverage.',
        },
      },
    ],
    gameChanger: null,

    contribution: [
      {
        pt: 'Redesenhei a ferramenta de personalização de imagens de vitrine para um fluxo de dois cliques.',
        en: 'Redesigned the showcase image customisation tool into a two-click flow.',
      },
      {
        pt: 'Medi tempo e custo de criação antes e depois, para sustentar o resultado com dado.',
        en: 'Measured creation time and cost before and after, to back the result with data.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: { pt: 'Ferramenta de personalização de vitrine.', en: 'The showcase customisation tool.' },
        confidential: true,
      },
    ],
  },

  'bricker-amelie': {
    slug: 'bricker-amelie',
    year: '2024 — 2025',
    role: { pt: 'Product Designer', en: 'Product Designer' },
    duration: { pt: '4 meses', en: '4 months' },
    team: { pt: 'Bricker · startup early-stage', en: 'Bricker · early-stage startup' },

    impact: {
      value: 'IA',
      label: { pt: 'LEITURA DE DOCUMENTOS', en: 'DOCUMENT READING' },
      note: {
        pt: 'Validação automática para análise prévia de crédito imobiliário.',
        en: 'Automated validation for mortgage pre-approval.',
      },
    },
    context: {
      pt: 'Uma IA que lê e valida documentos de crédito imobiliário, para tirar a burocracia do caminho.',
      en: 'An AI that reads and validates mortgage documents, to take bureaucracy out of the path.',
    },

    conflict: null,
    tradeoff: null,
    decision: null,
    evidence: [
      {
        value: '1',
        label: { pt: 'DESIGN SYSTEM', en: 'DESIGN SYSTEM' },
        note: {
          pt: 'Criado do zero para a plataforma Corban Bricker.',
          en: 'Built from scratch for the Corban Bricker platform.',
        },
      },
      {
        value: '4',
        label: { pt: 'MESES', en: 'MONTHS' },
        note: {
          pt: 'De jornada mapeada, design system e IA em produção.',
          en: 'From journey mapping to a design system and AI in production.',
        },
      },
    ],

    challenge: null,
    detail: [
      {
        title: { pt: 'A tese', en: 'The thesis' },
        body: {
          pt: 'A Bricker é uma startup early-stage que aplica tecnologia ao financiamento imobiliário. A ideia é direta: no mundo Bricker, as máquinas fazem o trabalho chato. A análise prévia depende de ler e validar pilhas de documentos — lento, manual, propenso a erro, e a primeira coisa entre alguém e a casa que quer comprar.',
          en: 'Bricker is an early-stage startup applying technology to mortgage lending. The idea is blunt: at Bricker, machines do the boring work. Pre-approval depends on reading and validating stacks of documents — slow, manual, error-prone, and the first thing between someone and the home they want.',
        },
      },
      {
        title: { pt: 'Trabalhar sem fundação', en: 'Working without foundations' },
        body: {
          pt: 'Sem design system herdado e sem base de usuários instalada, o trabalho foi estabelecer fundações e validar rápido. Criei o Design System da Corban do zero e usei N8N para construir e manter os chatbots de IA.',
          en: 'With no inherited design system and no installed user base, the work was to lay foundations and validate fast. I built the Corban design system from scratch and used N8N to build and maintain the AI chatbots.',
        },
      },
    ],
    gameChanger: null,

    contribution: [
      {
        pt: 'Fiz parte do time responsável pela criação da Amelie, a IA de leitura e validação de documentos.',
        en: 'Part of the team behind Amelie, the document reading and validation AI.',
      },
      {
        pt: 'Mapeei a jornada do cliente e os requisitos de Crédito Imobiliário e Home Equity.',
        en: 'Mapped the customer journey and the mortgage and home equity requirements.',
      },
      {
        pt: 'Criei o Design System da plataforma Corban Bricker.',
        en: 'Built the Corban Bricker platform design system.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: { pt: 'Amelie, leitura e validação de documentos.', en: 'Amelie, reading and validating documents.' },
        confidential: true,
      },
    ],
  },
};

export const caseLabels = {
  /** The label that rises into place on panel hover (README §5). */
  hover: {
    pt: 'CLIQUE AQUI PARA VER O CASE COMPLETO',
    en: 'CLICK HERE TO SEE THE FULL CASE',
  } satisfies T,
};

export const carousel = {
  heading: { pt: 'Outros projetos selecionados', en: 'Other selected projects' } satisfies T,
  viewAll: { pt: 'ver todos os projetos', en: 'view all projects' } satisfies T,
};

/* ---------------------------------------------------------- sobre mim */

export const about = {
  folioLeft: { pt: 'Perfil', en: 'Profile' } satisfies T,
  folioRight: {
    pt: 'Made from Minas Gerais, Brazil',
    en: 'Made from Minas Gerais, Brazil',
  } satisfies T,

  heading: { pt: 'Sobre mim', en: 'About me' } satisfies T,

  paragraphs: {
    pt: [
      'Minha carreira teve início no branding, desenhando identidade e campanhas, e levei esse repertório visual para dentro de produto digital. Hoje combino Continuous Discovery com processos ágeis para criar soluções que equilibram experiência, viabilidade técnica e resultado de negócio — de MVPs a jornadas complexas em larga escala.',
      'Na minha trajetória passei por banking em escala, varejo de alto volume, consultoria global e startups early-stage e scale-up. Uso inteligência artificial para acelerar etapas do processo: síntese de pesquisa, geração de wireframes, testes de usabilidade e verificação de acessibilidade.',
    ],
    en: [
      'My career began in branding, designing identities and campaigns, and I carried that visual repertoire into digital product. Today I combine Continuous Discovery with agile process to build solutions that balance experience, technical feasibility and business outcome — from MVPs to complex journeys at scale.',
      'Along the way I’ve worked in banking at scale, high-volume retail, global consultancy, and both early-stage and scale-up startups. I use AI to accelerate parts of the process: research synthesis, wireframe generation, usability testing and accessibility checks.',
    ],
  } satisfies Record<Lang, string[]>,

  portraitCaption: {
    pt: 'Design, jogos digitais e tecnologia.',
    en: 'Design, digital games and technology.',
  } satisfies T,

  metadata: [
    {
      label: { pt: 'Foco', en: 'Focus' } satisfies T,
      value: {
        pt: 'Craft Design, UX/UI, AI Building, UX Research, Acessibilidade, Produto, métricas, Design System',
        en: 'Craft design, UX/UI, AI building, UX research, accessibility, product, metrics, design systems',
      } satisfies T,
    },
    {
      label: { pt: 'Ferramentas', en: 'Tools' } satisfies T,
      value: {
        pt: 'Figma, Miro, Notion, Photoshop, Illustrator, InDesign, ClickUp, Jira, Azure, Claude, GPT, Gemini',
        en: 'Figma, Miro, Notion, Photoshop, Illustrator, InDesign, ClickUp, Jira, Azure, Claude, GPT, Gemini',
      } satisfies T,
    },
    {
      label: { pt: 'Metodologias', en: 'Methods' } satisfies T,
      value: {
        pt: 'Design Thinking, Design Sprint, Design Critique, Design Ops, Continuous Discovery, Double Diamond, Matriz CSD, Scrum, Kanban',
        en: 'Design thinking, design sprints, design critique, design ops, continuous discovery, double diamond, CSD matrix, Scrum, Kanban',
      } satisfies T,
    },
    {
      label: { pt: 'Processo de handoff', en: 'Handoff process' } satisfies T,
      value: {
        pt: 'WCAG acessibilidade, testes A/B, usabilidade SUM, tagueamento, AI Agent friendly',
        en: 'WCAG accessibility, A/B testing, SUM usability, tagging, AI-agent friendly',
      } satisfies T,
    },
  ],

  resume: { pt: 'Currículo 2026', en: 'Resume 2026' } satisfies T,
  copyEmail: { pt: 'Copiado', en: 'Copied' } satisfies T,
};

/* ------------------------------------------------------------ metrics */

export type Metric = {
  label: T;
  value: string;
  note: T;
  /** false = not traceable to the CV or LinkedIn. Must not ship until João confirms. */
  verified: boolean;
};

export const metrics = {
  kicker: { pt: 'RESULTADOS EM DESTAQUE', en: 'SELECTED RESULTS' } satisfies T,
  subhead: {
    pt: 'Resultados significativos e comprovados durante a minha jornada como Product Designer ao longo dos anos.',
    en: 'Significant, proven results from my journey as a Product Designer over the years.',
  } satisfies T,

  items: [
    {
      label: { pt: 'AUMENTO DE CSAT', en: 'CSAT INCREASE' },
      value: '+90%',
      note: {
        pt: 'Após o redesenho da configuração de aparência de loja na Reserva INK.',
        en: 'After redesigning storefront appearance configuration at Reserva INK.',
      },
      verified: true,
    },
    {
      // Was "+34% LTV" — that figure appears in NEITHER the CV nor LinkedIn. Replaced with a
      // sourced number from the same project. See memory: portfolio-verified-metrics.
      label: { pt: 'QUEDA DE RECLAMAÇÕES', en: 'DROP IN COMPLAINTS' },
      value: '−87%',
      note: {
        pt: 'Menos tickets de reclamação nos fluxos de configuração de loja.',
        en: 'Fewer support tickets across store configuration flows.',
      },
      verified: true,
    },
    {
      // Was "86+ projetos entregues" — also unsourced. Replaced with the Itaú call-volume result.
      label: { pt: 'REDUÇÃO DE LIGAÇÕES', en: 'CALL VOLUME REDUCTION' },
      value: '−21%',
      note: {
        pt: 'Na Central de Atendimento de cartões PJ do Itaú, após redesenhar as jornadas de contestação.',
        en: 'At Itaú’s business-card call centre, after redesigning the dispute journeys.',
      },
      verified: true,
    },
    {
      label: { pt: 'ANOS DE DESIGN', en: 'YEARS IN DESIGN' },
      value: '9+',
      note: {
        pt: 'Sendo 6 dedicados a produtos digitais e times multidisciplinares.',
        en: 'Six of them devoted to digital products and cross-functional teams.',
      },
      verified: true,
    },
  ] satisfies Metric[],
};

/* ------------------------------------------------------------ history */

export const history = {
  heading: { pt: 'Minha história no design', en: 'My history in design' } satisfies T,
  intro: {
    pt: 'Comecei no branding, desenhando identidade e campanha, e levei esse repertório visual para dentro de produto digital.',
    en: 'I started in branding, designing identities and campaigns, and carried that visual repertoire into digital product.',
  } satisfies T,

  companies: [
    {
      name: 'Banco Itaú',
      description: {
        // Sharpened: his actual scope is cards then investments, not "crédito e atendimento".
        pt: 'Banking em escala — jornadas de cartões PJ lançadas com a VISA e, hoje, investimentos em ativos escriturais.',
        en: 'Banking at scale — business-card journeys launched with VISA and, currently, book-entry asset investments.',
      },
    },
    {
      name: 'NTT DATA',
      description: {
        pt: 'Consultoria global japonesa — design de produto em squads de clientes enterprise.',
        en: 'Japanese global consultancy — product design inside enterprise client squads.',
      },
    },
    {
      name: 'EMS Saúde',
      description: {
        // Confirmed by João (2026-08-22): delivered as a project via NTT DATA, not direct
        // employment. He considers it significant work and it stays in the history list.
        pt: 'Saúde e farmacêutica — plataforma de treinamento com consultas médicas simuladas por IA.',
        en: 'Health and pharma — a training platform with AI-simulated medical consultations.',
      },
    },
    {
      name: 'Bricker',
      description: {
        pt: 'Startup early-stage no mercado imobiliário — IA para leitura de documentos e otimização de processos.',
        en: 'Early-stage proptech startup — AI for document reading and process optimisation.',
      },
    },
    {
      name: 'Reserva INK',
      description: {
        pt: 'Moda e tecnologia — SaaS de print on demand para mais de 60 mil lojistas, no grupo AZZAS 2154.',
        en: 'Fashion and tech — print-on-demand SaaS for 60,000+ sellers, part of AZZAS 2154.',
      },
    },
    {
      name: 'Canva',
      description: {
        pt: 'Um dos 300 primeiros Canva Creators oficiais do Brasil, aprovado pelo time de Sydney.',
        en: 'One of Brazil’s first 300 official Canva Creators, approved by the Sydney team.',
      },
    },
    {
      name: 'ZEMA',
      description: {
        pt: 'O maior varejo e e-commerce de Minas Gerais — jornada de compra e empréstimo pessoal.',
        en: 'Minas Gerais’ largest retailer and e-commerce — purchase journey and personal lending.',
      },
    },
  ],
};

/* ------------------------------------------------------- footer/contact */

export const contact = {
  folioLeft: { pt: 'Contato', en: 'Contact' } satisfies T,
  folioRight: {
    pt: 'Made from Minas Gerais, Brazil',
    en: 'Made from Minas Gerais, Brazil',
  } satisfies T,

  heading: {
    pt: ['Vamos', 'conversar?'],
    en: ['Let’s', 'talk?'],
  } satisfies Record<Lang, string[]>,

  paragraph: {
    pt: 'Aberto a conversas sobre produto, design e IA — de oportunidades a trocas rápidas.',
    en: 'Open to conversations about product, design and AI — from opportunities to quick chats.',
  } satisfies T,

  channels: {
    email: { label: 'E-MAIL', value: links.email, href: `mailto:${links.email}` },
    whatsapp: { label: 'WHATSAPP', value: links.phone, href: links.whatsapp },
    linkedin: { label: 'LINKEDIN', value: '/in/joaovmelo', href: links.linkedin },
  },

  social: [
    { name: 'Behance', href: links.behance },
    { name: 'Dribbble', href: links.dribbble },
    { name: 'Steam', href: links.steam },
    { name: 'Currículo 2026', href: links.cv },
  ],

  cta: { pt: 'Entrar em contato', en: 'Get in touch' } satisfies T,
  credit: {
    pt: 'Criado e desenvolvido por João V. Melo',
    en: 'Designed and developed by João V. Melo',
  } satisfies T,
  copyright: '© 2026',
  backToTop: { pt: 'voltar ao topo', en: 'back to top' } satisfies T,
};

/* ------------------------------------------------------------ overlays */

export const menu = {
  headings: {
    menu: { pt: 'MENU', en: 'MENU' } satisfies T,
    contact: { pt: 'CONTATO', en: 'CONTACT' } satisfies T,
    social: { pt: 'REDES', en: 'SOCIAL' } satisfies T,
  },
  links: [
    { pt: 'Página inicial', en: 'Home' },
    { pt: 'Projetos', en: 'Projects' },
    { pt: 'Sobre mim', en: 'About me' },
    { pt: 'Contato', en: 'Contact' },
  ] satisfies T[],
};

export const modal = {
  heading: { pt: 'Vamos conversar?', en: 'Let’s talk?' } satisfies T,
  line: {
    pt: 'Escolha o canal que preferir — respondo rápido nos três.',
    en: 'Pick whichever channel you prefer — I reply quickly on all three.',
  } satisfies T,
  channels: {
    email: { pt: 'E-mail', en: 'E-mail' } satisfies T,
    whatsapp: { pt: 'WhatsApp', en: 'WhatsApp' } satisfies T,
    linkedin: { pt: 'LinkedIn', en: 'LinkedIn' } satisfies T,
  },
};
