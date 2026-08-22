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
    email: { label: 'E-MAIL', value: 'joaovitormelo3105@gmail.com', href: 'mailto:joaovitormelo3105@gmail.com' },
    whatsapp: { label: 'WHATSAPP', value: '+55 34 99637-5495', href: 'https://wa.me/5534996375495' },
    linkedin: { label: 'LINKEDIN', value: '/in/joaovmelo', href: 'https://www.linkedin.com/in/joaovmelo' },
  },

  social: [
    { name: 'Behance', href: 'https://www.behance.net/joaovmelo' },
    { name: 'Dribbble', href: 'https://dribbble.com/joaomeloux' },
    { name: 'Steam', href: 'https://steamcommunity.com/id/hiyute/' },
    /** TODO: the Google Drive URL for the CV — still the only missing link. */
    { name: 'Currículo 2026', href: '#' },
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
