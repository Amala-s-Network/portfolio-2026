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
    pt: ['Design com foco em', 'experiência, produto e', 'métricas'],
    en: ['Design focused on', 'experience, product and', 'metrics'],
  } satisfies Record<Lang, string[]>,

  /**
   * Three hard-broken lines. Updated from the prototype: adds the global consultancy and names
   * the AI work, which is now central to his positioning.
   *
   * "9 anos" is counted from 2017 — João's official framing, settled. Do not recompute it from
   * the earliest CV entry (Silk & Arte, 2015), which he deliberately does not count.
   */
  /*
   * Lengthened to match the column beside it. Two columns of visibly different depth read as one
   * paragraph and one leftover — the newspaper structure only holds when both are full.
   *
   * What was added is more biography, not more argument: the second column already carries the
   * thesis, and repeating it here would make the pair say one thing twice. Everything stated is
   * João's own — the seniority, where he works in the process, and the drawing that predates the
   * screens.
   */
  paragraph: {
    pt: [
      'Oi! Eu sou o João. Trabalho com design há 9 anos, sendo 6 deles em produtos',
      'digitais. Já passei por grandes bancos, varejo de alto volume, consultoria',
      'global e startups. Hoje meu foco está em craft, métricas e IA. Atuo em',
      'nível senior e acompanho o projeto do começo ao fim, sempre perto dos',
      'times de produto e engenharia, usando IA para acelerar pesquisa e protótipo.',
    ],
    en: [
      'Hi! I’m João. I have worked in design for 9 years, 6 of them on digital',
      'products. I have been through big banks, high-volume retail, a global',
      'consultancy and startups. These days my focus is craft, metrics and AI.',
      'I work at senior level and stay with a project from start to finish,',
      'always close to the product and engineering teams, using AI to speed up',
      'research and prototyping.',
    ],
  } satisfies Record<Lang, string[]>,

  /**
   * The SECOND column of the deck.
   *
   * The prototype printed the same paragraph twice because it was placeholder. João's intent is
   * a newspaper: two columns that carry different weight, not one text set twice.
   *
   * So this one is not more biography — the first column already is that. In a newspaper the
   * lede says who and what, and the column beside it says why you should keep reading. This is
   * the thesis: it names the method the case pages are built on (conflict → trade-off →
   * decision → evidence) so the claim and the proof are made in the same breath.
   */
  paragraphB: {
    pt: [
      'Gosto de mostrar o processo inteiro, com as partes difíceis junto. Todo',
      'projeto aqui teve uma escolha complicada no meio do caminho: um prazo',
      'curto, uma regra do sistema que não cabia no caso real, ou o negócio',
      'pedindo uma coisa diferente do que as pessoas faziam. Nas páginas a',
      'seguir eu conto o que decidi, o que ficou de fora e no que deu.',
    ],
    en: [
      'I like showing the whole process, difficult parts included. Every project',
      'here had a hard call somewhere along the way: a short deadline, a system',
      'rule that did not fit the real case, or the business asking for one thing',
      'while people were doing something else entirely. On the pages that follow',
      'I say what I decided, what got left out, and how it turned out. The',
      'numbers are all there to check.',
    ],
  } satisfies Record<Lang, string[]>,

  cta: { pt: 'Entrar em contato', en: 'Get in touch' } satisfies T,
};

/* ---------------------------------------------------------- services */

/**
 * What João offers, in his own list.
 *
 * The four are HIS, and the order is his. The descriptions are mine and are the part to argue
 * with — they say what each one actually involves, because a service named and not explained is
 * a price list, and the reader deciding whether to write is trying to work out what working with
 * him is like.
 *
 * Item three arrived as a bundle — research, benchmarking, market practice, usability interviews,
 * planning — and is kept as one offer rather than split into five. Split, it would outweigh the
 * other three and read as the main thing he does; together it is what it is, which is discovery.
 */
export const services = {
  kicker: { pt: 'Serviços', en: 'Services' } satisfies T,
  heading: { pt: 'O que eu posso entregar', en: 'What I can deliver' } satisfies T,
  intro: {
    pt: 'Trabalho por projeto, sozinho ou junto com o time que já está lá. O escopo depende do que está faltando. Às vezes é o produto inteiro, às vezes é só aquela pergunta que ninguém teve tempo de fazer.',
    en: 'I work by project, on my own or alongside the team that is already there. The scope depends on what is missing. Sometimes it is the whole product, sometimes it is just the question nobody has had time to ask.',
  } satisfies T,

  items: [
    {
      title: { pt: 'Produto de ponta a ponta', en: 'Product, end to end' } satisfies T,
      body: {
        pt: 'Da pesquisa até o desenvolvimento: descoberta, escopo, fluxos, interface, design system e acompanhamento até a coisa entrar no ar. Fico perto de produto e engenharia o tempo todo, porque uma boa decisão que se perde no caminho até o código acaba não valendo de muita coisa.',
        en: 'From research through to development: discovery, scoping, flows, interface, design system, and sticking around until it goes live. I stay close to product and engineering the whole way, because a good decision that gets lost on the way to the code ends up not counting for much.',
      } satisfies T,
    },
    {
      title: { pt: 'Landing pages de alta conversão', en: 'High-conversion landing pages' } satisfies T,
      body: {
        pt: 'Uma página construída em volta de uma ação só. A hierarquia segue o que a pessoa precisa ler primeiro para conseguir decidir. Texto, layout e ritmo eu trato como uma coisa só, porque numa landing page eles trabalham juntos.',
        en: 'A page built around a single action. The hierarchy follows what someone needs to read first in order to decide. I treat copy, layout and pacing as one thing, because on a landing page they work together.',
      } satisfies T,
    },
    {
      title: { pt: 'Pesquisa e direcionamento', en: 'Research and direction' } satisfies T,
      body: {
        pt: 'Benchmarking, leitura de práticas de mercado, apoio nas entrevistas de usabilidade e planejamento do que vem depois. A ideia é dar ao time evidência para decidir, inclusive quando a evidência aponta que o melhor é não construir.',
        en: 'Benchmarking, reading market practice, support on usability interviews, and planning what comes next. The idea is to give the team evidence to decide with, including when that evidence points at not building the thing.',
      } satisfies T,
    },
    {
      title: { pt: 'Mentoria', en: 'Mentoring' } satisfies T,
      body: {
        pt: 'Para quem está começando agora ou chegando de outra área. Converso sobre por que uma decisão se sustenta, como defender um trabalho na frente do time, como entender um problema antes de abrir o Figma e como encarar o primeiro handoff sem susto.',
        en: 'For people just starting out or coming from another field. We talk about why a decision holds up, how to defend your work in front of the team, how to understand a problem before opening Figma, and how to face a first handoff without panicking.',
      } satisfies T,
    },
  ],
};

/* ------------------------------------------------------- the craft gate */

/**
 * The door to the other side of the site.
 *
 * ⚠️ ATTRIBUTION IS NOT DECORATION HERE. NieR: Automata's interface is Square Enix's, designed
 * under Yoko Taro's direction, and this borrows its visual language openly. The credit line is
 * not fine print at the bottom of a page nobody reaches — it is inside the gate itself, on the
 * screen where the borrowing is announced, because that is the only place it is guaranteed to be
 * read. It also states plainly that the page is personal and non-commercial, which is the claim
 * the whole thing rests on.
 *
 * The gate exists because the two halves of this site want different things from a reader. The
 * portfolio is an argument for hiring him; the craft side is work made for its own sake, with
 * invented briefs. Walking from one into the other without a word would read as the site losing
 * its mind, so the door says which room is which and lets the reader decline.
 */
export const craftGate = {
  trigger: { pt: 'Desbloquear criatividade', en: 'Unlock creativity' } satisfies T,

  system: { pt: 'SISTEMA', en: 'SYSTEM' } satisfies T,
  heading: { pt: 'ALTERAR AMBIENTE?', en: 'CHANGE ENVIRONMENT?' } satisfies T,

  body: {
    pt: [
      'Daqui você vai para uma experiência separada, dedicada a craft design. É trabalho autoral, com briefings inventados e peças que eu fiz por gosto, sem contrato no meio.',
      'Se você veio pelos cases de produto, com clientes reais e números verificados, é melhor continuar por aqui mesmo.',
    ],
    en: [
      'From here you go to a separate experience, dedicated to craft design. It is self-directed work, with invented briefs and pieces I made because I wanted to, no contract involved.',
      'If you came for the product cases, with real clients and verified numbers, you are better off staying right here.',
    ],
  } satisfies Record<Lang, string[]>,

  confirm: { pt: 'PROSSEGUIR', en: 'PROCEED' } satisfies T,
  cancel: { pt: 'PERMANECER', en: 'REMAIN' } satisfies T,

  /* Rendered inside the gate, not tucked into a footer. */
  credit: {
    pt: 'A linguagem visual desta tela é uma homenagem a NieR: Automata, © Square Enix, com direção de Yoko Taro. Todos os direitos são deles. Esta é uma página pessoal, sem fins lucrativos e sem nenhum vínculo com a Square Enix.',
    en: 'The visual language of this screen is a tribute to NieR: Automata, © Square Enix, directed by Yoko Taro. All rights are theirs. This is a personal, non-commercial page with no affiliation to Square Enix.',
  } satisfies T,

  hint: { pt: 'Esc para permanecer', en: 'Esc to remain' } satisfies T,
};

/* -------------------------------------------------------- the craft page */

/**
 * The craft side, built as a start menu.
 *
 * The three categories and their meanings are João's. The bottom bar carries a line per option
 * because that is how the reference works — the menu never explains itself in the list, it
 * explains the ARMED row down in the status bar, one sentence at a time. Writing the
 * descriptions into the rows instead would have been the easy port and the wrong one: it turns
 * a menu into a page of paragraphs.
 */
export const craftPage = {
  title: { pt: 'CRAFT', en: 'CRAFT' } satisfies T,
  system: { pt: 'AMBIENTE ALTERADO', en: 'ENVIRONMENT CHANGED' } satisfies T,

  options: [
    {
      id: 'jogos',
      label: { pt: 'Interfaces de jogos', en: 'Game interfaces' } satisfies T,
      hint: {
        pt: 'Projetos autorais de interface para jogos.',
        en: 'Self-directed interface work for games.',
      } satisfies T,
    },
    {
      id: 'diversas',
      label: { pt: 'Interfaces diversas', en: 'Other interfaces' } satisfies T,
      hint: {
        pt: 'Filmes, projetos que não foram para a frente e trabalhos que eu nunca mostrei.',
        en: 'Films, projects that never went anywhere, and work I have never shown.',
      } satisfies T,
    },
    {
      id: 'tudo',
      label: { pt: 'Explorar', en: 'Explore' } satisfies T,
      hint: {
        pt: 'Exibe todas as opções, sem filtro.',
        en: 'Shows everything, unfiltered.',
      } satisfies T,
    },
    /*
     * The fourth is not a category, and it is the only row that DOES something rather than
     * filtering something. It sits last for that reason — a menu should not open with its joke.
     */
    {
      id: 'salvar',
      label: { pt: 'Salve o mundo', en: 'Save the world' } satisfies T,
      hint: {
        pt: 'Salve o mundo da ameaça alienígena.',
        en: 'Save the world from the alien threat.',
      } satisfies T,
    },
  ],

  /* The right-hand panel while a category has nothing in it yet. */
  empty: {
    pt: 'Nenhum projeto catalogado nesta categoria ainda.',
    en: 'No projects catalogued in this category yet.',
  } satisfies T,

  keys: {
    select: { pt: 'Selecionar', en: 'Select' } satisfies T,
    confirm: { pt: 'Confirmar', en: 'Confirm' } satisfies T,
    back: { pt: 'Voltar', en: 'Back' } satisfies T,
  },

  backLabel: { pt: 'VOLTAR AO PORTFÓLIO', en: 'BACK TO THE PORTFOLIO' } satisfies T,
};

/**
 * The hacking minigame — the credits shooter, as a nod to Yoko Taro.
 *
 * ⚠️ Same attribution as everything else on this side: the idea is NieR: Automata's, and the
 * credit sits on the screen rather than in a footer. This is a personal, non-commercial page.
 *
 * The instructions are two lines and no more. The reference teaches its shooter by handing you a
 * ship that already fires and letting you discover the rest, and a wall of rules in front of a
 * thirty-second game is a longer read than the game is a play.
 */
export const hacking = {
  title: { pt: 'SALVE O MUNDO', en: 'SAVE THE WORLD' } satisfies T,
  system: { pt: 'PROTOCOLO DE DEFESA', en: 'DEFENCE PROTOCOL' } satisfies T,

  instructions: {
    pt: [
      'Use os direcionais para mover e o mouse para controlar a mira.',
      'Salve o mundo da ameaça alienígena.',
    ],
    en: [
      'Use the arrow keys to move and the mouse to aim.',
      'Save the world from the alien threat.',
    ],
  } satisfies Record<Lang, string[]>,

  start: { pt: 'INICIAR', en: 'START' } satisfies T,
  retry: { pt: 'TENTAR NOVAMENTE', en: 'TRY AGAIN' } satisfies T,
  quit: { pt: 'SAIR', en: 'QUIT' } satisfies T,

  score: { pt: 'PONTOS', en: 'SCORE' } satisfies T,
  wave: { pt: 'ONDA', en: 'WAVE' } satisfies T,

  over: { pt: 'NAVE DESTRUÍDA', en: 'SHIP DESTROYED' } satisfies T,
  /* Shown once, under the game-over line — the reference never lets a loss be only a loss. */
  overNote: {
    pt: 'O mundo segue ameaçado. Isso costuma acontecer.',
    en: 'The world remains under threat. This tends to happen.',
  } satisfies T,

  legend: {
    red: { pt: 'Três disparos para destruir.', en: 'Three shots to destroy.' } satisfies T,
    black: {
      pt: 'Atravessa os disparos. Desvie.',
      en: 'Passes through your fire. Evade.',
    } satisfies T,
  },
};

/* ------------------------------------------------------------- story */

/**
 * The story behind the portrait.
 *
 * ⚠️ DRAFT. João asked for a starting point to edit, not finished copy. The FACTS are his and
 * come from the editorial spread he sent — Araxá, the age, nine years, taking machines apart as
 * a child, being the family's tech support, the branding courses with Marcelo Kimura and Lucas
 * Rosa. The voice is my proposal and is the part to argue with.
 *
 * It is informal on purpose. The rest of this site is a case for hiring him; this is the one
 * place that is allowed to just be him, which is why the games page is not bent back round into
 * a professional point at the end. "Games taught me systems design" would be the safe move and
 * the wrong one — the reader can draw that line themselves, and the page is more convincing for
 * not drawing it for them.
 */
export const story = {
  open: {
    pt: ['Quem sou eu, de verdade?', 'Clique aqui'],
    en: ['Who am I, really?', 'Click here'],
  } satisfies Record<Lang, string[]>,

  close: { pt: 'Fechar', en: 'Close' } satisfies T,
  next: { pt: 'Próxima página', en: 'Next page' } satisfies T,
  previous: { pt: 'Página anterior', en: 'Previous page' } satisfies T,

  pages: {
    pt: [
      {
        folio: 'Página 01 · Origem',
        title: 'Quem sou eu? Depende do último filme que assisti.',
        lead: 'Obviamente é piada. Ou talvez nem tanto.',
        body: [
          'Sou o João, tenho 26 anos e nasci em Araxá, no interior de Minas. Trabalho com design há nove anos e sou apaixonado por arte, tanto no digital quanto no editorial. O fato de tudo isso aqui parecer um jornal provavelmente já entregou essa parte.',
          'Sou autodidata. Desde criança eu desmontava video-game e computador só para ver o que tinha dentro, e acabei virando o suporte técnico oficial da família inteira. Hardware, software, dava tudo na mesma. Crescer no interior nos anos 2000 gostando de tecnologia foi um exercício de aprender sozinho quase tudo que eu sei hoje.',
          'Minha primeira especialização foi em branding, com cursos de gente como Marcelo Kimura e Lucas Rosa. Foi ali que eu entendi que esse trabalho é sobre decidir, e que deixar bonito vem depois. O resto do caminho, do banco ao varejo, foi aprender a decidir com gente olhando e dinheiro em jogo.',
        ],
        aside: 'Essa foto foi tirada uma porção de vezes. Sou péssimo tirando foto, e isso fica bem evidente.',
      },
      {
        folio: 'Página 02 · Obsessões',
        title: 'Jogo desde antes de saber que aquilo era design.',
        lead: 'Metal Gear e NieR viraram repertório sem eu perceber.',
        body: [
          'Metal Gear me ensinou que um sistema pode ter opinião. O Kojima nunca separou a mecânica do que ele queria dizer: o jogo faz você sentir a coisa em vez de te contar sobre ela. Quando eu penso numa jornada, é isso que eu fico perseguindo, que a forma diga a mesma coisa que o texto.',
          'NieR: Automata fez o contrário e me marcou do mesmo jeito. Ele usa a própria estrutura do jogo como argumento e pede que você jogue de novo, agora sabendo o que sabe. É a coisa mais próxima de pesquisa qualitativa que eu já vi virar entretenimento.',
          'Não vou fingir que isso tudo é metodologia. Eu jogo porque gosto, e desmonto o que jogo pelo mesmo motivo que desmontava o video-game do meu quarto: para ver como foi feito. Se depois isso volta para o trabalho, ótimo, mas nunca foi o plano.',
        ],
        aside: 'Franquias que eu revisito sempre: Metal Gear, NieR, Persona, Silent Hill, Dark Souls.',
      },
    ],
    en: [
      {
        folio: 'Page 01 · Origin',
        title: 'Who am I? Depends on the last film I watched.',
        lead: 'Obviously a joke. Or maybe not entirely.',
        body: [
          'I’m João, 26, born in Araxá, in the Brazilian countryside. I have worked in design for nine years and I love art, digital and editorial alike. The fact that all of this looks like a newspaper has probably given that away already.',
          'I’m self-taught. As a kid I took consoles and computers apart just to see what was inside, and ended up as the official tech support for my whole family. Hardware, software, it was all the same to me. Growing up in a small town in the 2000s and liking technology meant learning almost everything I know on my own.',
          'My first specialisation was branding, through courses with people like Marcelo Kimura and Lucas Rosa. That is where I understood the job is about deciding, and that making it look good comes after. The rest of the way, from banking to retail, was learning to decide with people watching and money on the table.',
        ],
        aside: 'This photo was taken a great many times. I am terrible at having my picture taken, and it shows.',
      },
      {
        folio: 'Page 02 · Obsessions',
        title: 'I was playing long before I knew any of it was design.',
        lead: 'Metal Gear and NieR became repertoire without me noticing.',
        body: [
          'Metal Gear taught me that a system can hold an opinion. Kojima never separated the mechanics from what he wanted to say: the game makes you feel the thing instead of telling you about it. When I think about a journey, that is what I keep chasing, the form saying the same thing as the words.',
          'NieR: Automata did the opposite and marked me just as much. It uses the structure of the game itself as its argument, and asks you to play again now that you know what you know. It is the closest thing to qualitative research I have ever seen become entertainment.',
          'I won’t pretend any of this is methodology. I play because I enjoy it, and I take apart what I play for the same reason I took apart the console in my bedroom: to see how it was made. If it comes back into the work later, great, but that was never the plan.',
        ],
        aside: 'Franchises I keep going back to: Metal Gear, NieR, Persona, Silent Hill, Dark Souls.',
      },
    ],
  },
};

/* --------------------------------------------------------- page fold */

export const pageFold = {
  /*
   * The visible label and the accessible name are the SAME string, deliberately.
   *
   * "Vire a página" is the better line — it is what the dog-ear is drawn as, and it belongs to
   * the newspaper this whole page is built on. It is not used, because a control has one job
   * before it has a voice: someone arriving on a portfolio needs to know that corner leads to
   * the work, and the fold itself already carries the metaphor without the words repeating it.
   *
   * WCAG 2.5.3 also wants the accessible name to contain the visible text, so splitting them —
   * "Vire a página" on screen, "Ir para os cases" to a screen reader — would break voice control
   * for anyone saying what they can see.
   */
  label: { pt: 'Ler os cases', en: 'Read the cases' } satisfies T,
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

/**
 * The four filters on /projetos.
 *
 * ⚠️ The assignment below is MINE, inferred from each project's own description — João has not
 * confirmed it. It is the kind of thing that looks authoritative on a portfolio and is wrong
 * only the author can tell: "Interfaces" versus "Produtos digitais" is a judgement about what
 * the work actually was, not about what it looked like. Worth a pass before launch.
 *
 * "handoff" currently has no work assigned to it. The tab still renders, and says so, rather
 * than being quietly dropped — João named these four categories deliberately.
 */
export type Category = 'produtos' | 'interfaces' | 'branding' | 'handoff';

export type Case = {
  slug: string;
  categories: Category[];
  title: T;
  company: T;
  description: T;
  /** TODO: full-bleed photography — none exists yet (README "Open items" #1). */
  photo: string | null;
};

/**
 * The four headline cases, in the order João set on 2026-08-25:
 * Aparência de Loja, Contestação de Despesas, EMS, Escrituração.
 *
 * The two after them (Imagens de Vitrine and Bricker) keep their pages and their place in the
 * projects index. They are out of the home page's four, not out of the site.
 */
export const cases: Case[] = [
  {
    slug: 'reserva-ink-aparencia-de-loja',
    categories: ['produtos', 'interfaces'],
    /*
     * The forest moved here with the running order.
     *
     * It is still a stock placeholder rather than João's work, and it has to be the FIRST case's
     * photograph specifically: the home page's fixed underlay uses the same file, and the first
     * panel pins its picture over that underlay so the sheet lifts off one continuous image. Give
     * the first case a different photo and the two stop matching mid-turn.
     */
    photo: '/cases/floresta.webp',
    title: {
      pt: 'Aparência de loja para 60 mil lojistas',
      en: 'Storefront appearance for 60k sellers',
    },
    company: { pt: 'Reserva INK · AZZAS 2154', en: 'Reserva INK · AZZAS 2154' },
    description: {
      pt: 'Configurar a loja era a maior fonte de tickets do produto, a ponto de ter lojista com tema de Natal no Dia dos Namorados. Reescrevi o fluxo: os tickets caíram 87% e a satisfação chegou a 90%.',
      en: 'Setting up a store was the product’s biggest source of tickets, to the point of sellers still running a Christmas theme on Valentine’s Day. I rewrote the flow: tickets fell 87% and satisfaction reached 90%.',
    },
  },
  {
    slug: 'itau-cartoes-pj',
    categories: ['produtos'],
    photo: null,
    title: {
      pt: 'Contestação de despesas em cartões PJ',
      en: 'Expense disputes for business cards',
    },
    company: { pt: 'Itaú Unibanco · via NTT DATA', en: 'Itaú Unibanco · via NTT DATA' },
    /*
     * Corrected against the narrative João sent. This line used to say the dispute flow "moved
     * from the phone into the app" — it did not. There was no development budget: what shipped
     * was information and call scripts, and the digital product is scheduled for 2026. Claiming
     * an interface that does not exist is the one kind of error a portfolio cannot afford.
     */
    description: {
      pt: 'Contestação era o principal motivo de ligação na Central do Itaú PJ. Sem verba de desenvolvimento, a gente foi atrás dos 40% de chamadas que só perguntavam "em que etapa está?". O volume caiu 21%.',
      en: 'Disputes were the single biggest reason people called Itaú’s business centre. With no development budget, we went after the 40% of calls that only asked "what stage is it at?". Volume fell 21%.',
    },
  },
  {
    slug: 'ems-simulador-visitas',
    categories: ['produtos', 'interfaces'],
    photo: null,
    title: {
      pt: 'Simulador de visitas médicas com IA',
      en: 'AI simulator for medical sales visits',
    },
    company: { pt: 'EMS Saúde · via NTT DATA', en: 'EMS Saúde · via NTT DATA' },
    description: {
      pt: 'Um propagandista aprende apanhando na frente do médico. Criamos personas sintéticas a partir de pesquisa de campo, para que ele possa treinar a conversa difícil antes que ela custe caro.',
      en: 'A pharma rep learns by getting it wrong in front of a doctor. We built synthetic personas out of field research, so they can practise the hard conversation before it gets expensive.',
    },
  },
  {
    /*
     * ⚠️ SCAFFOLD. João asked for this fourth slot in the running order and said the case is
     * still to be produced. Everything below traces to his CV; the narrative fields are null on
     * purpose, so the page tells him what to write instead of pretending to be finished.
     */
    slug: 'itau-escrituracao',
    categories: ['produtos'],
    photo: null,
    title: {
      pt: 'Escrituração de ativos e investimentos',
      en: 'Book-entry assets and investments',
    },
    company: { pt: 'Itaú Unibanco · via NTT DATA', en: 'Itaú Unibanco · via NTT DATA' },
    description: {
      pt: 'O trabalho que estou fazendo agora: as jornadas de ativos escriturais e investimentos dentro do Itaú. O case completo vem quando o projeto permitir.',
      en: 'What I am working on right now: the book-entry asset and investment journeys inside Itaú. The full case comes when the project allows it.',
    },
  },
  {
    /*
     * Placed after the featured four on purpose: João set that running order and did not say
     * where this one goes. It has a page and a place in the index; one word moves it up.
     */
    slug: 'itau-cartao-adicional',
    categories: ['produtos', 'interfaces'],
    photo: null,
    title: {
      pt: 'Cartão adicional de volta ao atendimento',
      en: 'Additional cards, back where people are served',
    },
    company: { pt: 'Itaú Unibanco · via NTT DATA', en: 'Itaú Unibanco · via NTT DATA' },
    description: {
      pt: 'A migração deixou a contratação só no app, e quem mais contrata tem mais de 40 anos e queria resolver com o gerente. Uma jornada só, rodando nos dois sistemas dos canais assistidos.',
      en: 'The migration left applications in the app alone, and the people who apply most are over 40 and wanted to sort it out with their manager. One journey, running in both assisted-channel systems.',
    },
  },
  {
    slug: 'reserva-ink-imagens-de-vitrine',
    categories: ['interfaces', 'produtos'],
    title: {
      pt: 'Imagens de vitrine em dois cliques',
      en: 'Showcase images in two clicks',
    },
    company: { pt: 'Reserva INK · AZZAS 2154', en: 'Reserva INK · AZZAS 2154' },
    description: {
      pt: 'Para montar a vitrine, o lojista tinha que sair da plataforma e se virar no Canva ou no Photoshop. Trouxe isso para dentro do produto: 92% dos usuários adotaram e quase 99% dos retornos foram positivos.',
      en: 'To build a storefront image, sellers had to leave the platform and fend for themselves in Canva or Photoshop. I brought it inside the product: 92% of users adopted it and nearly 99% of the feedback was positive.',
    },
    photo: null,
  },
  {
    slug: 'bricker-amelie',
    categories: ['produtos'],
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

/**
 * The four the home page argues with. The rest keep their pages and their place in the index.
 */
export const featuredCases = cases.slice(0, 4);

/* ----------------------------------------------------------- carousel */

export type Project = {
  slug: string;
  categories: Category[];
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
    slug: 'zema-emprestimo-pessoal',
    categories: ['produtos', 'interfaces'],
    name: { pt: 'Fluxo de empréstimo pessoal', en: 'Personal loan flow' },
    company: { pt: 'ZEMA', en: 'ZEMA' },
    image: null,
  },
  {
    slug: 'zema-black-friday',
    categories: ['interfaces', 'branding'],
    name: { pt: 'Landing page de Black Friday', en: 'Black Friday landing page' },
    company: { pt: 'ZEMA', en: 'ZEMA' },
    image: null,
  },
  {
    slug: 'm1place-ecommerce',
    categories: ['interfaces', 'produtos'],
    name: { pt: 'Redesign do e-commerce', en: 'E-commerce redesign' },
    company: { pt: 'M1Place', en: 'M1Place' },
    image: null,
  },
  {
    slug: 'canva-creator',
    categories: ['branding'],
    name: { pt: 'Templates como Canva Creator', en: 'Templates as a Canva Creator' },
    company: { pt: 'Canva', en: 'Canva' },
    image: null,
  },
];

/* ------------------------------------------------------- case pages */

export type CaseMedia = {
  /**
   * How this figure moves, if it does.
   *
   *   still    a photograph or screen (the default)
   *   video    an mp4/webm, played muted and looped
   *   frames   a sequence of stills played as a flipbook
   *
   * "frames" exists because a GIF cannot be paused, carries no alpha worth having, and weighs
   * several times what the same frames weigh as WebP. Given the raw frames or a screen recording
   * this renders better than a GIF would and can be stopped, which prefers-reduced-motion and
   * WCAG 2.2.2 both require of anything that moves for more than five seconds.
   */
  kind?: 'still' | 'video' | 'frames';
  /** For kind: 'video' — the still shown before it plays, and under reduced motion. */
  poster?: string;
  /** For kind: 'frames' — the stills, in order. */
  frames?: string[];
  /** Milliseconds per frame. Defaults to 400. */
  frameMs?: number;
  /** null until real artwork exists; falls back to the generated placeholder. */
  src: string | null;
  caption: T;
  /**
   * true = this frame would show a real employer interface. Keep it null until João has
   * confirmed, per case, what his NDA allows him to publish.
   */
  confidential?: boolean;
};

export type CaseSection = {
  title: T;
  body: T;
  /**
   * An optional breakdown, drawn as a band across the page after the prose.
   *
   * This exists for diagramação: eight paragraphs of grey in a row is where a reader gives up,
   * and some of what a case has to say is genuinely a list of four things rather than a
   * paragraph pretending to be one. Items with a body render as numbered cards; items without
   * one render as a compact ruled list, which is the right shape for a set of principles.
   */
  points?: { title: T; body?: T }[];
};
export type Outcome = { value: string; label: T; note: T };

/**
 * A measured series, drawn on the page rather than pasted in as a picture of a chart.
 *
 * The distinction matters more than it sounds. A screenshot of a slide arrives carrying another
 * company's typography and palette, goes soft on a retina screen, and says nothing at all to a
 * screen reader. Held as numbers, the same series takes this site's ink, stays sharp, renders a
 * real table for assistive tech — and, not least, lets the headline percentage be checked
 * against the bars sitting under it instead of asserted beside them.
 */
export type CaseChart = {
  title: T;
  /** Where the figures came from. A chart without a provenance line is decoration. */
  note: T;
  /** What the values are, for the readout under the plot: "chamadas por mês". */
  unit: T;
  /**
   * Printed instead of the fall computed from the first and last bars.
   *
   * Only for series whose bars are summaries of something wider. INK's tickets were measured as
   * two ranges (70–80 a week down to 8–9), so the bars are midpoints and computing from them
   * would put 89% on screen next to João's 87%. Where the bars ARE the figures, leave this out
   * and let the chart do the division, which is the whole reason it exists.
   */
  delta?: string;
  points: {
    /**
     * The SHORT form: the axis label below about 720px, and the fallback when `full` is
     * missing. Left untranslated because "08/25" is the same in both languages.
     */
    label: string;
    /**
     * The written-out form: the axis label at normal widths, the readout, and what a bar
     * announces. A month has a name, and a chart with room for it has no reason to make the
     * reader decode a number.
     */
    full?: T;
    value: number;
  }[];
};

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
  /** Optional: the series behind the headline number, when one was measured over time. */
  chart?: CaseChart;

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
  /*
   * PROVENANCE — João's written narrative (2026-08-24) plus the deck he presented in January
   * 2026, "[ITAÚ] RECURSOS - Contestação de DESPESAS", 23 slides.
   *
   * Two things the deck settles that the prose did not: the pair of metrics the work was
   * actually judged on (Contact Rate and NPS), and what happened next (Cronos, the new PJ cards
   * platform, launching 2026).
   *
   * RESOLVED 2026-08-25. His prose said "Voxel" and slide 3 said "VQ"; João confirms the system
   * is VQ, and that it is what expense disputes run on. The copy names it.
   */
  'itau-cartoes-pj': {
    slug: 'itau-cartoes-pj',
    year: '2025-2026',
    role: { pt: 'CX Designer / Product Designer', en: 'CX Designer / Product Designer' },
    duration: { pt: '11 meses', en: '11 months' },
    team: { pt: 'Itaú Unibanco, via NTT DATA', en: 'Itaú Unibanco, via NTT DATA' },

    impact: {
      value: '−21%',
      label: { pt: 'VOLUME DE LIGAÇÕES', en: 'CALL VOLUME' },
      note: {
        pt: 'Em contestação de despesas, que caiu do 1º para o 6º lugar no ranking de motivos de ligação da Central.',
        en: 'On expense disputes, which fell from 1st to 6th in the call centre’s ranking of call reasons.',
      },
    },
    context: {
      pt: 'Contestação de despesas era, fazia tempo, o principal motivo de ligação na Central de Atendimento do Itaú PJ. A gente reduziu esse volume em 21% sem escrever uma linha de código, e o NPS da squad subiu junto.',
      en: 'Expense disputes had long been the single biggest reason customers called Itaú’s business-banking centre. We cut that volume by 21% without writing a line of code, and the squad’s NPS went up with it.',
    },

    conflict: {
      pt: 'A pesquisa apontava para um produto: uma versão digital da contestação, dentro da nova plataforma de cartões PJ. Só que o banco tinha outras prioridades naquele ciclo. A orientação que veio da gerência foi reduzir o volume de ligações por quick-wins, sem custo de desenvolvimento e sem envolver os times técnicos. Ou seja, a experiência que a gente queria construir ficou de um lado e o que dava para entregar ficou do outro.',
      en: 'The research pointed at a product: a digital version of the dispute flow, inside the new business-cards platform. The bank had other priorities that cycle, though. The brief that came down from management was to cut call volume through quick wins, with no development budget and no engineering teams involved. So the experience we wanted to build sat on one side and what we could actually ship sat on the other.',
    },
    tradeoff: {
      pt: 'Abri mão de entregar interface. A jornada digital foi desenhada e ficou guardada para 2026, sem nada implementado naquele momento. O que foi para produção nessa etapa foi informação, prazo e roteiro de atendimento.',
      en: 'I gave up shipping an interface. The digital journey was designed and set aside for 2026, with nothing implemented at the time. What went live at that stage was information, deadlines and call scripts.',
    },
    decision: {
      pt: 'Fomos atrás dos 40%. Ouvindo ligações junto com o time da Central, descobrimos que cerca de 40% das chamadas eram só para saber em que etapa a contestação estava e qual o prazo da próxima. Em vez de esperar pelo produto que resolveria tudo, a gente tratou a dúvida que respondia por quase metade do volume: deixar o SLA claro, acertar o canal de contato e dizer onde os documentos seriam pedidos e as atualizações enviadas.',
      en: 'We went after the 40%. Listening to calls alongside the call centre team, we found that around 40% of them existed only to ask what stage a dispute was at and when the next one would come. Instead of waiting for the product that would fix everything, we tackled the question behind almost half the volume: make the SLA clear, get the contact channel right, and say where documents would be requested and updates sent.',
    },
    evidence: [
      {
        value: '−21%',
        label: { pt: 'LIGAÇÕES NA CENTRAL', en: 'CALL CENTRE VOLUME' },
        note: {
          pt: 'Entre agosto e dezembro de 2025, de 2.395 para 1.893 chamadas por mês.',
          en: 'Between August and December 2025, from 2,395 to 1,893 calls a month.',
        },
      },
      {
        /*
         * Monthly, confirmed by João 2026-08-25. The deck's sentence reads as a total for the
         * August-to-December window and his prose says "por mês"; he settled it. Left here
         * because the ambiguity is in the source document and will be asked again otherwise.
         */
        value: 'R$ 7,2 mil',
        label: { pt: 'ECONOMIA MENSAL', en: 'MONTHLY SAVING' },
        note: {
          pt: 'Em custo operacional, mantendo o mesmo custo médio por atendimento.',
          en: 'In operating cost, at the same average cost per call.',
        },
      },
      {
        value: '1º → 6º',
        label: { pt: 'RANKING DE MOTIVOS', en: 'RANKING OF CALL REASONS' },
        note: {
          pt: 'Posição da contestação entre os motivos de ligação na Central.',
          en: 'Where disputes sat among the reasons people called.',
        },
      },
      {
        value: '+3',
        label: { pt: 'JORNADAS OTIMIZADAS', en: 'JOURNEYS OPTIMISED' },
        note: {
          pt: 'Bloqueio temporário, segunda via e consulta de senha, que somaram ao NPS global do produto no primeiro ano de Cartões PJ.',
          en: 'Temporary block, card replacement and PIN retrieval, which added to the product’s global NPS in the first year of business cards.',
        },
      },
    ],

    /*
     * The five months behind the headline number, drawn rather than screenshotted.
     *
     * João sent this as a slide image. Rebuilding it from the figures is better on every axis
     * that matters: it stays sharp at any zoom, it takes the page's own colours instead of
     * importing another brand's, and the −21% is verifiable on screen (2395 → 1893 is −20.96%)
     * rather than being a claim sitting next to a picture of the same claim.
     */
    chart: {
      title: { pt: 'Chamadas de contestação por mês', en: 'Dispute calls per month' },
      note: {
        pt: 'Fonte: relatório de volume da Central de Atendimento, de agosto a dezembro de 2025.',
        en: 'Source: the call centre volume report, August to December 2025.',
      },
      unit: { pt: 'chamadas no mês', en: 'calls that month' },
      points: [
        { label: '08/25', full: { pt: 'Agosto / 2025', en: 'August / 2025' }, value: 2395 },
        { label: '09/25', full: { pt: 'Setembro / 2025', en: 'September / 2025' }, value: 2366 },
        { label: '10/25', full: { pt: 'Outubro / 2025', en: 'October / 2025' }, value: 2300 },
        { label: '11/25', full: { pt: 'Novembro / 2025', en: 'November / 2025' }, value: 2232 },
        { label: '12/25', full: { pt: 'Dezembro / 2025', en: 'December / 2025' }, value: 1893 },
      ],
    },

    challenge: {
      pt: 'Mexer numa métrica de operação sem poder construir nada. Sem verba e sem time técnico, sobrou o que já existia: o roteiro do analista, o que ele fala sobre prazo e por qual canal o cliente é procurado depois. Achar dentro dessas restrições o ponto que respondia por 40% do volume levou 16 semanas de discovery.',
      en: 'Moving an operational metric with nothing to build. No budget and no engineering team left us with what was already there: the analyst’s script, what it says about deadlines, and which channel the customer gets contacted through afterwards. Finding the one point worth 40% of the volume inside those limits took 16 weeks of discovery.',
    },
    detail: [
      {
        title: { pt: 'O cenário', en: 'The setting' },
        body: {
          pt: 'O Itaú é um dos maiores bancos da América Latina e tem um dos maiores times de design do continente. Atuei pela NTT DATA no time de cartões da comunidade PJ durante o lançamento de um produto novo em parceria com a VISA. Eram cinco jornadas críticas, e contestação era de longe a mais cara delas.\n\nContestar uma despesa no cartão PJ dependia quase inteiramente da Central de Atendimento. Prazo, status e responsabilidade não eram claros para ninguém, e a conversa acontecia espalhada por vários canais diferentes. O tema vivia no topo dos acionamentos, com volume oscilando entre 2,5 mil e 3,7 mil por mês nos dois anos anteriores, puxando para baixo as duas métricas pelas quais a squad responde.\n\nTudo isso rodava no VQ, o sistema legado do banco, onde estudos de usabilidade, design, acessibilidade e o JIP nunca chegaram. O plano combinado era resolver o máximo possível por quick-wins dentro dele, antes de digitalizar a jornada para a plataforma nova.',
          en: 'Itaú is one of Latin America’s largest banks, with one of the continent’s largest design teams. I worked through NTT DATA on the business-card team during the launch of a new product built with VISA. There were five critical journeys, and disputes was by far the most expensive of them.\n\nDisputing a charge on a business card depended almost entirely on the call centre. Deadlines, status and responsibility were unclear to everyone involved, and the conversation was scattered across several different channels. The subject sat permanently at the top of the contact drivers, running between 2,500 and 3,700 a month over the previous two years, dragging down both of the metrics the squad answers for.\n\nAll of it ran on VQ, the bank’s legacy system, where usability studies, design, accessibility and the JIP framework never arrived. The agreed plan was to fix as much as possible inside it through quick wins, before digitising the journey onto the new platform.',
        },
        points: [
          {
            title: { pt: 'Contact Rate', en: 'Contact rate' },
            body: {
              pt: 'Quanto o cliente precisa ligar. Cada ligação custa dinheiro em tempo de atendente.',
              en: 'How often a customer has to call. Every call costs money in agent time.',
            },
          },
          {
            title: { pt: 'NPS', en: 'NPS' },
            body: {
              pt: 'O quanto ele fica satisfeito com o serviço, o que mexe na relação dele com o banco inteiro.',
              en: 'How satisfied they are with the service, which affects their relationship with the whole bank.',
            },
          },
        ],
      },
      {
        title: { pt: 'O discovery', en: 'Discovery' },
        body: {
          pt: 'Juntamos meu time, a Central de Atendimento, o time de contestação da PF, Operações, PRC e as coordenações responsáveis. Foram 16 semanas de sessões de Lean Inception, Matriz CSD, revisão completa dos fluxos e da esteira, entrevistas com usuários e uma contestação real que eu mesmo abri e acompanhei até o fim. Também mapeamos o motor de fraudes, os prazos e os SLAs do processo.\n\nA descoberta que orientou tudo veio de sentar com o time da Central e ouvir ligação: cerca de 40% delas eram sobre andamento. Em que etapa está e quanto falta para a próxima. Nada além disso.\n\nEm paralelo, fiz benchmarking com 11 players, testando ou pesquisando como a contestação funciona dentro dos aplicativos e sites. Concorrentes diretos e indiretos, bancos tradicionais e digitais, PF e PJ. Os cenários que mais aparecem são sempre os mesmos: perda do cartão, cartão clonado, compra feita por engano e compra cancelada. O resultado foi desconfortável e útil, porque todos os players usam a mesma lógica, pela fatura e/ou direto pela central e pelo SAC. Ninguém tinha resolvido isso, o que tirou da mesa a ideia de copiar alguém.\n\nAcompanhei também, todo dia, as reclamações sobre contestação de compras no Reclame Aqui. São mais de 2 mil por dia, com média de 48 horas para a empresa responder. Não é um problema do Itaú, é um problema do setor, e ler aquilo diariamente foi o que deu textura aos cenários que a gente estava tratando como categoria.',
          en: 'We pulled together my team, the call centre, the retail-side dispute team, operations, risk and the responsible coordinators. Sixteen weeks of Lean Inception sessions, a CSD matrix, a full review of the flows and the pipeline, user interviews, and a real dispute that I filed myself and followed to the end. We also mapped the fraud engine, the deadlines and the SLAs in the process.\n\nThe finding that steered everything came from sitting with the call centre team and listening to calls: around 40% of them were about progress. What stage is it at, and how long until the next one. Nothing beyond that.\n\nAlongside that I benchmarked 11 players, testing or researching how disputes work inside their apps and sites. Direct and indirect competitors, traditional and digital banks, retail and business. The recurring scenarios are always the same: a lost card, a cloned card, a purchase made by mistake, and a cancelled purchase. The result was uncomfortable and useful, because every player uses the same logic, through the statement and/or straight to the call centre and customer service. Nobody had solved this, which took copying someone off the table.\n\nI also followed the complaints about purchase disputes on Reclame Aqui every day. There are over 2,000 a day, with companies taking an average of 48 hours to reply. This is not an Itaú problem, it is an industry problem, and reading it daily is what gave texture to scenarios we had been treating as categories.',
        },
      },
      {
        title: { pt: 'O que a gente mudou', en: 'What we changed' },
        body: {
          pt: 'No fluxo que existia havia gente demais envolvida e a comunicação saía por canais diferentes a cada etapa, que é exatamente a receita para o cliente não saber onde está. No modelo que desenhamos, a meta era unificar: menos pessoas no processo, mais clareza na comunicação e transparência sobre por onde ela acontece. Esse trabalho foi feito perto de todos os stakeholders responsáveis, validando diretrizes, mitigando risco e apertando a governança do processo inteiro.\n\nDepois disso fui atrás das inconsistências nos roteiros da Central: prazos e SLAs que não batiam entre uma etapa e outra, falta de clareza sobre em qual canal a conversa continua, onde o documento é pedido e por onde a atualização chega. São ajustes de conversa, sem uma tela nova em nenhum deles, e foram eles que derrubaram 21% do volume ao longo dos meses. Os dados dessa análise são confidenciais do cliente e não podem ser mostrados aqui.',
          en: 'The flow that existed had too many people in it, and the communication came out through a different channel at each step, which is precisely the recipe for a customer not knowing where they stand. In the model we designed, the goal was to unify: fewer people in the process, more clarity in the communication, and transparency about where it happens. That work was done close to every responsible stakeholder, validating guidelines, mitigating risk and tightening governance across the whole process.\n\nAfter that I went after the inconsistencies in the call centre scripts: deadlines and SLAs that did not match from one step to the next, no clarity about which channel the conversation continues in, where a document gets requested, and how an update arrives. They are adjustments to a conversation, with no new screen anywhere in them, and they are what took 21% off the volume over the following months. The data behind that analysis is confidential to the client and cannot be shown here.',
        },
      },
    ],
    gameChanger: {
      pt: 'Depois dos quick-wins, fiquei responsável por criar a versão digitalizada da jornada para o Cronos, a nova plataforma de cartões PJ do Itaú, com lançamento previsto para 2026. Ela segue as mesmas diretrizes e boas práticas da PF, com as peculiaridades que o cliente PJ exige.\n\nO desenho ataca de frente o que o discovery encontrou. Tem tracking da contestação, com resumo do andamento, porque andamento era o assunto de 40% das ligações. Tem envio de arquivo dentro do fluxo, para a solicitação parar de morrer por falta de documento. E já no MVP o portador consegue acompanhar tudo pelo App Empresas.\n\nTer derrubado as ligações só com roteiro virou o argumento que justificou construir o produto de verdade.',
      en: 'After the quick wins, I became responsible for creating the digitised version of the journey for Cronos, Itaú’s new business-cards platform, due to launch in 2026. It follows the same guidelines and good practice as the retail side, with the particularities the business customer demands.\n\nThe design goes straight at what discovery found. It has dispute tracking, with a summary of progress, because progress was the subject of 40% of the calls. It has file upload inside the flow, so a request stops dying for want of a document. And in the MVP itself the cardholder can follow all of it through the business app.\n\nHaving brought the calls down with a script alone became the argument that justified building the real product.',
    },

    contribution: [
      {
        pt: 'Conduzi o discovery e a definição da jornada de ponta a ponta, reunindo Cartões PJ, Central de Atendimento, produto PF e Operações.',
        en: 'Led discovery and defined the journey end to end, bringing together business cards, the call centre, the retail product and operations.',
      },
      {
        pt: 'Rodei benchmarking com 11 players, Matriz CSD, entrevistas e análise de fluxos, e abri uma contestação real para percorrer a esteira inteira.',
        en: 'Ran benchmarking against 11 players, a CSD matrix, interviews and flow analysis, and filed a real dispute to walk the whole pipeline.',
      },
      {
        pt: 'Analisei os roteiros da Central e propus as correções de prazo, SLA e canal que responderam pelos 21%.',
        en: 'Analysed the call centre scripts and proposed the deadline, SLA and channel fixes behind the 21%.',
      },
      {
        pt: 'Desenhei a contestação digitalizada para o Cronos, a nova plataforma de cartões PJ, prevista para 2026.',
        en: 'Designed the digitised dispute journey for Cronos, the new business-cards platform, due in 2026.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: {
          pt: 'Acompanhamento da contestação: etapa, prazo e canal. Era exatamente essa a dúvida por trás de 40% das ligações.',
          en: 'Dispute tracking: stage, deadline and channel. This was exactly the question behind 40% of the calls.',
        },
        confidential: true,
      },
    ],
  },

  'reserva-ink-aparencia-de-loja': {
    slug: 'reserva-ink-aparencia-de-loja',
    year: '2023-2024',
    role: { pt: 'Product Designer Pleno', en: 'Product Designer' },
    /* The project, not the tenure. He was at INK for a year and four months; this took four weeks. */
    duration: { pt: '4 semanas', en: '4 weeks' },
    team: { pt: 'Reserva INK · grupo AZZAS 2154', en: 'Reserva INK · AZZAS 2154 group' },

    /*
     * ⚠️ CORRECTED 2026-08-25. This said "+90% de CSAT", which read as a 90% increase. João's
     * own write-up is clearer: CSAT went up 40%, landing at a 90% satisfaction average among the
     * users interviewed on the new version. A 90% rise and a 90% level are very different claims,
     * and the wrong one was the flattering one. The metrics section carried the same error.
     */
    impact: {
      value: '−87%',
      label: { pt: 'TICKETS DE RECLAMAÇÃO', en: 'COMPLAINT TICKETS' },
      note: {
        pt: 'De 70 a 80 por semana para cerca de 8 a 9, o que dá uma economia estimada de R$ 3 mil por mês.',
        en: 'From 70 to 80 a week down to around 8 or 9, an estimated saving of R$3,000 a month.',
      },
    },
    context: {
      pt: 'Configurar a aparência da loja era a maior fonte de reclamação do produto. Teve lojista que passou o Dia dos Namorados com o tema de Natal no ar porque não conseguia trocar.',
      en: 'Setting up a store’s appearance was the product’s biggest source of complaints. Some sellers spent Valentine’s Day with a Christmas theme still live, because they could not work out how to change it.',
    },

    conflict: {
      pt: 'A INK nasceu como startup early stage, chamada Touts, e cresceu rápido. Para ganhar tração, boa parte das funcionalidades foi construída em formato de MVP, e a Aparência de Loja foi uma delas. O problema é que ela não era um canto qualquer do produto: era onde o lojista define cor, fonte, banner e tudo que comunica quem ele é. A velocidade que fez a plataforma existir foi a mesma que deixou a área mais estratégica dela confusa.',
      en: 'INK started life as an early-stage startup called Touts, and it grew fast. To gain traction, a good part of the product was built as an MVP, and Store Appearance was one of those parts. The trouble is that it was not just any corner of the product: it is where a seller sets colour, typeface, banner and everything that says who they are. The speed that made the platform exist is the same speed that left its most strategic area confusing.',
    },
    tradeoff: {
      pt: 'Abri mão de reconstruir a ferramenta inteira. Dava para argumentar por uma refatoração completa, e teria sido a resposta bonita, mas eram 4 semanas e mais de 60 mil lojistas já usando aquilo todo dia. Trabalhei dentro da estrutura que existia e concentrei o esforço na clareza do fluxo, na previsibilidade do resultado e no controle que faltava.',
      en: 'I gave up rebuilding the whole tool. There was a case to be made for a full refactor, and it would have been the pretty answer, but we had four weeks and more than 60,000 sellers already using it every day. I worked inside the structure that was there and put the effort into clarity of flow, predictability of the result, and the control that was missing.',
    },
    decision: {
      pt: 'Deixei o suporte escolher o que arrumar primeiro. Os tickets de reclamação diziam, com nome e sobrenome, onde o fluxo quebrava, então a fila de prioridade veio deles e não da minha opinião sobre o que estava feio. Depois de meses de discovery, a proposta nova ficou em cima de três coisas: clareza, agilidade e controle.',
      en: 'I let support decide what to fix first. The complaint tickets said, in plain words, where the flow was breaking, so the priority queue came from them rather than from my opinion about what looked bad. After months of discovery, the new proposal stood on three things: clarity, speed and control.',
    },
    evidence: [
      {
        value: '−87%',
        label: { pt: 'TICKETS DE RECLAMAÇÃO', en: 'COMPLAINT TICKETS' },
        note: {
          pt: 'De 70 a 80 por semana para 8 a 9, cerca de R$ 3 mil por mês em custo de suporte.',
          en: 'From 70 to 80 a week to 8 or 9, roughly R$3,000 a month in support cost.',
        },
      },
      {
        value: '+40%',
        label: { pt: 'AUMENTO DE CSAT', en: 'CSAT INCREASE' },
        note: {
          pt: 'Chegando a 90% de satisfação média entre os lojistas entrevistados na versão nova.',
          en: 'Reaching a 90% satisfaction average among the sellers interviewed on the new version.',
        },
      },
      {
        value: '−75%',
        label: { pt: 'TEMPO DE CONFIGURAÇÃO', en: 'SETUP TIME' },
        note: {
          pt: 'Tempo que voltou para campanha e venda, o que puxou retenção, receita e LTV para cima.',
          en: 'Time that went back into campaigns and selling, which pulled retention, revenue and LTV up.',
        },
      },
    ],

    chart: {
      title: { pt: 'Tickets de reclamação por semana', en: 'Complaint tickets per week' },
      /*
       * The bars are the midpoints of two ranges João measured, so the delta is stated rather
       * than computed from them: 70–80 down to 8–9 is his 87%, and a chart that arrived at 89%
       * on its own would be quietly arguing with the number printed beside it.
       */
      delta: '−87%',
      note: {
        pt: 'Média antes e depois do redesenho. O intervalo medido foi de 70 a 80 tickets por semana antes, e de 8 a 9 depois.',
        en: 'Average before and after the redesign. The measured range was 70 to 80 tickets a week before, and 8 to 9 after.',
      },
      unit: { pt: 'tickets por semana', en: 'tickets a week' },
      points: [
        { label: 'antes', full: { pt: 'Antes do redesenho', en: 'Before the redesign' }, value: 75 },
        { label: 'depois', full: { pt: 'Depois do redesenho', en: 'After the redesign' }, value: 9 },
      ],
    },

    challenge: {
      pt: 'Mexer numa peça que já estava embaixo dos pés de 60 mil pessoas. Qualquer mudança na Aparência de Loja aparece na vitrine de alguém no mesmo dia, então não existia a opção de quebrar e consertar depois. E o prazo era de 4 semanas, o que tirou da mesa qualquer solução que dependesse de reconstruir a base.',
      en: 'Changing a piece that was already under 60,000 people’s feet. Any change to Store Appearance shows up in somebody’s storefront the same day, so breaking it and fixing it later was never an option. And the deadline was four weeks, which took every rebuild-the-foundations answer off the table.',
    },
    detail: [
      {
        title: { pt: 'Onde isso aconteceu', en: 'Where this happened' },
        body: {
          pt: 'A INK é a plataforma de print on demand da Reserva, parte do grupo AZZAS 2154, o maior grupo de vestuário da América Latina. Mais de 60 mil empreendedores usam a plataforma para montar e operar as próprias lojas.',
          en: 'INK is Reserva’s print-on-demand platform, part of AZZAS 2154, the largest apparel group in Latin America. Over 60,000 entrepreneurs use it to build and run their own stores.',
        },
      },
      {
        title: { pt: 'O que a ferramenta deveria ser', en: 'What the tool was meant to be' },
        body: {
          pt: 'Desde o começo, a Aparência de Loja foi pensada como a base da identidade de cada lojista dentro da plataforma. Era por ali que o criador definia cores, fontes, banners e os elementos visuais que dizem quem ele é e como quer ser percebido. Com o crescimento do produto e a complexidade que foi se acumulando, essa experiência foi ficando confusa e passou a gerar frustração, erro e retrabalho.',
          en: 'From the start, Store Appearance was meant to be the foundation of each seller’s identity inside the platform. It was where a creator set the colours, typefaces, banners and visual elements that say who they are and how they want to be seen. As the product grew and complexity piled up, that experience got muddier and started producing frustration, mistakes and rework.',
        },
      },
      {
        title: { pt: 'A evidência veio do suporte', en: 'The evidence came from support' },
        body: {
          pt: 'Os tickets de reclamação foram a fonte principal, porque os motivos apontavam direto para onde o fluxo quebrava. Junto com entrevistas de UX com lojistas e testes de usabilidade, eles deram o mapa do que precisava mudar. Foram meses de discovery antes de qualquer tela nova.',
          en: 'Complaint tickets were the main source, because the reasons pointed straight at where the flow was breaking. Together with UX interviews with sellers and usability testing, they gave us the map of what had to change. It was months of discovery before any new screen existed.',
        },
      },
      {
        title: { pt: 'O que a mudança destravou', en: 'What the change freed up' },
        body: {
          pt: 'O tempo médio de configuração caiu mais de 75%. Isso devolveu horas para o lojista, que passou a gastá-las em campanha e venda em vez de brigar com o painel. Retenção e receita subiram junto, e foi por aí que o LTV cresceu, tanto para o lojista quanto para a própria INK.',
          en: 'Average setup time fell by more than 75%. That handed hours back to the seller, who started spending them on campaigns and selling instead of fighting the panel. Retention and revenue rose with it, and that is how LTV grew, both for the seller and for INK itself.',
        },
      },
      {
        title: { pt: 'Como foi construído', en: 'How it was built' },
        body: {
          pt: 'Quatro semanas de projeto, em Figma, Miro e FigJam, num modelo POD/SaaS. Discovery, proposta de interface, validação com lojistas e handoff, sem parar a operação em nenhum momento.',
          en: 'A four-week project, in Figma, Miro and FigJam, on a POD/SaaS model. Discovery, interface proposal, validation with sellers and handoff, without stopping the operation at any point.',
        },
      },
    ],
    gameChanger: {
      pt: 'A Aparência de Loja deixou de ser uma configuração técnica que o lojista adiava e voltou a ser o que sempre deveria ter sido: o lugar onde a marca dele ganha forma. Fortalecer isso melhorou a experiência de compra da ponta e apoiou o crescimento dos negócios dentro da plataforma, e é por isso que um trabalho de quatro semanas mexeu em LTV.',
      en: 'Store Appearance stopped being a technical setting sellers put off and went back to being what it always should have been: the place where their brand takes shape. Strengthening that improved the shopping experience at the other end and supported the growth of the businesses on the platform, which is why four weeks of work moved LTV.',
    },

    contribution: [
      {
        pt: 'Reescrevi o fluxo de configuração de aparência em cima de clareza, agilidade e controle.',
        en: 'Rewrote the appearance configuration flow around clarity, speed and control.',
      },
      {
        pt: 'Usei os tickets de suporte como fonte primária de pesquisa, junto com entrevistas de UX e testes de usabilidade.',
        en: 'Used support tickets as the primary research source, alongside UX interviews and usability testing.',
      },
      {
        pt: 'Elevei o nível de design da plataforma e reduzi o custo operacional de suporte.',
        en: 'Raised the platform’s design standard and lowered its support cost.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: {
          pt: 'Fluxo de configuração de aparência da loja.',
          en: 'The store appearance configuration flow.',
        },
        confidential: true,
      },
    ],
  },

  'reserva-ink-imagens-de-vitrine': {
    slug: 'reserva-ink-imagens-de-vitrine',
    year: '2023-2024',
    role: { pt: 'Product Designer Pleno', en: 'Product Designer' },
    duration: { pt: '4 semanas', en: '4 weeks' },
    team: { pt: 'Reserva INK · grupo AZZAS 2154', en: 'Reserva INK · AZZAS 2154 group' },

    impact: {
      value: '92%',
      label: { pt: 'DOS USUÁRIOS ADOTARAM', en: 'OF USERS ADOPTED IT' },
      note: {
        pt: 'Numa base de mais de 60 mil lojistas, com quase 99% de retornos positivos.',
        en: 'Across a base of more than 60,000 sellers, with nearly 99% positive feedback.',
      },
    },
    context: {
      pt: 'Para montar a imagem de vitrine, o lojista tinha que sair da plataforma e se virar no Canva, no Place-it ou no Photoshop. Trouxe esse momento para dentro do produto.',
      en: 'To put together a storefront image, sellers had to leave the platform and fend for themselves in Canva, Place-it or Photoshop. I brought that moment inside the product.',
    },

    conflict: {
      pt: 'A imagem de vitrine decide se o produto vende. Ela é o que forma a percepção de valor e o que empurra a decisão de compra, e mesmo assim esse momento acontecia fora da plataforma. Quem já sabia usar ferramenta de design se virava bem; quem não sabia, e era a maioria, ficava travado num passo que era obrigatório para vender qualquer coisa.',
      en: 'The storefront image decides whether a product sells. It is what shapes the sense of value and what pushes the decision to buy, and yet that moment happened outside the platform. Sellers who already knew design tools got by fine; the ones who did not, and that was most of them, got stuck on a step that was mandatory to sell anything at all.',
    },
    tradeoff: {
      pt: 'Abri mão de fazer um editor. Um editor completo, com camadas e liberdade total, resolveria mais casos e teria sido a peça mais impressionante de mostrar. Também levaria meses e devolveria para o lojista exatamente o problema que ele já tinha no Photoshop. Entreguei um caminho estreito com mockups prontos, fundo e elementos, e mais nada.',
      en: 'I gave up building an editor. A full editor, with layers and total freedom, would have covered more cases and been the more impressive thing to show. It would also have taken months and handed the seller back exactly the problem they already had in Photoshop. I shipped a narrow path with ready-made mockups, backgrounds and elements, and nothing else.',
    },
    decision: {
      pt: 'Otimizei para quem nunca abriu uma ferramenta de design. O alcance da mudança dependia de funcionar para quem não tem repertório visual, então acessibilidade e facilidade de uso entraram como requisito desde o começo. É isso que explica os 92% de adoção: a ferramenta não pediu nada que o lojista já não soubesse fazer.',
      en: 'I optimised for people who have never opened a design tool. The reach of the change depended on it working for people with no visual training, so accessibility and ease of use went in as requirements from the start. That is what explains the 92% adoption: the tool never asked the seller for anything they did not already know how to do.',
    },
    evidence: [
      {
        value: '92%',
        label: { pt: 'DE ADOÇÃO', en: 'ADOPTION' },
        note: {
          pt: 'Dos usuários da plataforma passaram a usar a ferramenta nativa.',
          en: 'Of platform users moved onto the native tool.',
        },
      },
      {
        value: '99%',
        label: { pt: 'DE RETORNOS POSITIVOS', en: 'POSITIVE FEEDBACK' },
        note: {
          pt: 'Medido por NPS e por pesquisa qualitativa depois do lançamento.',
          en: 'Measured through NPS and qualitative research after launch.',
        },
      },
      {
        value: '15 min → 2 cliques',
        label: { pt: 'TEMPO DE CRIAÇÃO', en: 'CREATION TIME' },
        note: {
          pt: 'O que levava de 10 a 15 minutos em ferramenta externa virou alguns cliques dentro do produto.',
          en: 'What took 10 to 15 minutes in an external tool became a few clicks inside the product.',
        },
      },
    ],

    challenge: {
      pt: 'Fazer uma ferramenta de imagem para gente que não é designer, sem transformar isso num editor. Toda decisão foi sobre o que tirar: cada controle a mais dava poder para uma minoria e assustava a maioria, e a maioria era exatamente quem eu precisava atender.',
      en: 'Building an image tool for people who are not designers, without turning it into an editor. Every decision was about what to remove: each extra control gave power to a minority and scared off the majority, and the majority was exactly who I needed to serve.',
    },
    detail: [
      {
        title: { pt: 'Por que isso importava', en: 'Why it mattered' },
        body: {
          pt: 'Todo produto na INK precisa de imagem de vitrine para vender. Sem ela, o item até existe no catálogo, mas não converte, e a maioria dos lojistas não é designer. O custo de criar um produto virou, na prática, uma barreira de entrada no negócio.',
          en: 'Every INK product needs a showcase image to sell. Without one an item does sit in the catalogue, but it does not convert, and most sellers are not designers. The cost of creating a product had become, in practice, a barrier to entry.',
        },
      },
      {
        title: { pt: 'O que estava quebrado', en: 'What was broken' },
        body: {
          pt: 'O processo acontecia em Canva, Place-it ou Photoshop, fora do produto. Isso fragmentava a experiência, alongava o tempo de criação e deixava as lojas visualmente inconsistentes entre si. Muita gente esbarrava na parte técnica, o que virava fricção no fluxo de trabalho e mais acionamento de suporte sobre mockup.',
          en: 'The process happened in Canva, Place-it or Photoshop, outside the product. That fragmented the experience, stretched creation time and left stores visually inconsistent with one another. Plenty of people hit the technical wall, which turned into friction in the workflow and more support requests about mockups.',
        },
      },
      {
        title: { pt: 'O que foi construído', en: 'What was built' },
        body: {
          pt: 'Uma ferramenta nativa de criação de imagens de vitrine, dentro da própria plataforma. O lojista escolhe um mockup pronto, personaliza o fundo e aplica elementos visuais, sem sair do produto em nenhum momento. A adoção foi rápida e ampla.',
          en: 'A native storefront image tool, inside the platform itself. The seller picks a ready-made mockup, customises the background and applies visual elements, without leaving the product at any point. Adoption was fast and broad.',
        },
      },
      {
        title: { pt: 'Como foi construído', en: 'How it was built' },
        body: {
          pt: 'Quatro semanas, em Figma, Miro e Photoshop, num modelo POD/SaaS. Benchmark, definição do caminho mínimo, protótipo, validação com lojistas e handoff.',
          en: 'Four weeks, in Figma, Miro and Photoshop, on a POD/SaaS model. Benchmarking, defining the minimum path, prototype, validation with sellers and handoff.',
        },
      },
    ],
    gameChanger: {
      pt: 'A criação da imagem deixou de ser um recurso à parte e virou parte do fluxo de criar e vender. Isso mudou quem consegue montar uma loja profissional na plataforma: deixou de ser só quem já tinha repertório de design e passou a incluir quem estava começando. Para uma plataforma que vive de quantos lojistas conseguem vender, essa é a métrica que importa.',
      en: 'Making the image stopped being a separate feature and became part of the flow of creating and selling. That changed who can put together a professional store on the platform: it went from only the people who already had design skills to including the ones just starting out. For a platform that lives on how many sellers manage to sell, that is the metric that counts.',
    },

    contribution: [
      {
        pt: 'Desenhei a ferramenta nativa de criação de imagens de vitrine, do benchmark ao handoff.',
        en: 'Designed the native storefront image tool, from benchmarking through to handoff.',
      },
      {
        pt: 'Defini o caminho mínimo, com mockups prontos, fundo e elementos, e cortei o resto.',
        en: 'Defined the minimum path, with ready-made mockups, backgrounds and elements, and cut the rest.',
      },
      {
        pt: 'Medi tempo e custo de criação antes e depois, para sustentar o resultado com dados.',
        en: 'Measured creation time and cost before and after, to back the result with data.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: {
          pt: 'Ferramenta nativa de criação de imagens de vitrine.',
          en: 'The native storefront image tool.',
        },
        confidential: true,
      },
    ],
  },

  'bricker-amelie': {
    slug: 'bricker-amelie',
    year: '2024-2025',
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
          pt: 'A Bricker é uma startup early-stage que aplica tecnologia ao financiamento imobiliário. A ideia é bem direta: no mundo Bricker, as máquinas fazem o trabalho chato. A análise prévia depende de ler e validar pilhas de documentos, um processo lento, manual e cheio de erro, que ainda por cima é a primeira coisa entre a pessoa e a casa que ela quer comprar.',
          en: 'Bricker is an early-stage startup applying technology to mortgage lending. The idea is pretty blunt: at Bricker, machines do the boring work. Pre-approval depends on reading and validating stacks of documents, a slow and manual process full of errors, which also happens to be the first thing standing between someone and the home they want.',
        },
      },
      {
        title: { pt: 'Trabalhar sem fundação', en: 'Working without foundations' },
        body: {
          pt: 'Não havia design system herdado nem base de usuários instalada, então o trabalho ali foi montar as fundações e validar rápido. Criei o Design System da Corban do zero e usei N8N para construir e manter os chatbots de IA.',
          en: 'There was no inherited design system and no installed user base, so the work there was to lay the foundations and validate fast. I built the Corban design system from scratch and used N8N to build and maintain the AI chatbots.',
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

  /*
   * PROVENANCE — written from the deck João supplied on 2026-08-25,
   * "[SEMANA DA IA] SLIDES - Assistente de Visitas médicas", 24 slides.
   *
   * The deck's own results slide is headed "Resultados esperados", so there are no measured
   * outcomes yet and none are invented here. The one hard fact it does carry is that the
   * navigable prototype was approved at the first presentation with no structural changes, and
   * that is what the headline number says.
   */
  'ems-simulador-visitas': {
    slug: 'ems-simulador-visitas',
    year: '2025',
    role: { pt: 'Product Designer', en: 'Product Designer' },
    duration: { pt: '5 etapas, do campo ao protótipo', en: '5 stages, from field to prototype' },
    team: {
      pt: 'EMS Saúde · time Tech e Digital Experience da NTT DATA',
      en: 'EMS Saúde · NTT DATA Tech and Digital Experience team',
    },

    impact: {
      value: '0',
      label: { pt: 'AJUSTES DE ESTRUTURA', en: 'STRUCTURAL CHANGES' },
      note: {
        pt: 'O protótipo navegável foi aprovado já na primeira apresentação, sem mexer na estrutura.',
        en: 'The navigable prototype was approved at the first presentation, with the structure untouched.',
      },
    },
    context: {
      pt: 'Um propagandista aprende apanhando na frente do médico. Criamos personas sintéticas a partir de pesquisa de campo, para ele treinar a conversa difícil antes que ela custe caro.',
      en: 'A pharma rep learns by getting it wrong in front of a doctor. We built synthetic personas out of field research, so they could practise the hard conversation before it got expensive.',
    },

    conflict: {
      pt: 'A primeira versão da simulação tinha o problema clássico de IA conversacional: as personas eram genéricas, as conversas saíam artificiais e não havia critério nenhum para dizer se o treino tinha funcionado. Dava para melhorar o prompt e fingir que resolveu. Só que o buraco não estava no texto, estava embaixo dele: faltava base comportamental.',
      en: 'The first version of the simulation had the classic conversational-AI problem: the personas were generic, the conversations came out artificial, and there was no criterion at all for saying whether the training had worked. We could have polished the prompt and pretended that fixed it. But the hole was not in the writing, it was underneath it: there was no behavioural base.',
    },
    tradeoff: {
      pt: 'Abri mão de começar pela interface. O caminho rápido era desenhar as telas do chat, que era o que todo mundo conseguia visualizar, e deixar o conteúdo para depois. Passamos as primeiras semanas em campo e em análise qualitativa, sem nada bonito para mostrar, porque uma tela de chat impecável em cima de uma persona genérica continua sendo uma persona genérica.',
      en: 'I gave up starting with the interface. The fast route was to draw the chat screens, which was the part everyone could picture, and leave the content for later. We spent the first weeks in the field and in qualitative analysis with nothing pretty to show, because a flawless chat screen on top of a generic persona is still a generic persona.',
    },
    decision: {
      pt: 'Construímos as personas a partir do que os propagandistas contaram, não do que o marketing imaginava. Elas descrevem formas reais de comportamento médico: nível de abertura ao diálogo, exigência técnica, tolerância à abordagem comercial e critério de decisão. Não são perfis de público-alvo, são perfis de comportamento, e é isso que dá à simulação alguém para ser.',
      en: 'We built the personas out of what the reps told us, rather than what marketing imagined. They describe real forms of medical behaviour: how open someone is to a conversation, how technically demanding they are, how much of a commercial pitch they will tolerate, and what they decide on. They are behaviour profiles rather than audience profiles, and that is what gives the simulation somebody to be.',
    },
    evidence: [
      {
        value: '0',
        label: { pt: 'AJUSTES DE ESTRUTURA', en: 'STRUCTURAL CHANGES' },
        note: {
          pt: 'O protótipo navegável passou na primeira apresentação para o time da EMS.',
          en: 'The navigable prototype passed at the first presentation to the EMS team.',
        },
      },
      {
        value: '9',
        label: { pt: 'FRENTES DE UX', en: 'UX WORKSTREAMS' },
        note: {
          pt: 'Da consolidação da pesquisa ao copywriting da interface, passando por objeções, personas e cenários.',
          en: 'From consolidating the research to writing the interface, by way of objections, personas and scenarios.',
        },
      },
      {
        value: '4',
        label: { pt: 'EIXOS POR PERSONA', en: 'AXES PER PERSONA' },
        note: {
          pt: 'Características profissionais, aspectos comportamentais, postura na visita e padrões de reação.',
          en: 'Professional traits, behavioural aspects, posture during the visit, and reaction patterns.',
        },
      },
    ],

    challenge: {
      pt: 'Transformar relato de campo em regra de comportamento. Um propagandista sabe perfeitamente quando o médico começou a perder o interesse, mas não sabe descrever isso como um critério. Tirar a estrutura de dentro da história contada, sem achatar a história, foi a parte que deu trabalho de verdade.',
      en: 'Turning field stories into rules of behaviour. A rep knows exactly when a doctor started losing interest, but cannot describe that as a criterion. Pulling the structure out of the story without flattening the story was the part that took real work.',
    },
    detail: [
      {
        title: { pt: 'O desafio', en: 'The brief' },
        body: {
          pt: 'Criar uma experiência de simulação com IA capaz de reproduzir interações médicas reais, gerar aprendizado prático e simular comportamento clínico autêntico. O trabalho foi feito para a EMS Saúde, conduzido pelo time de Tech e Digital Experience da NTT DATA.',
          en: 'Build an AI simulation able to reproduce real medical interactions, produce practical learning and simulate authentic clinical behaviour. The work was done for EMS Saúde, led by NTT DATA’s Tech and Digital Experience team.',
        },
      },
      {
        title: { pt: 'A pesquisa com propagandistas', en: 'Research with the reps' },
        body: {
          pt: 'Investigamos como a visita médica acontece na prática: a dinâmica real da conversa, os momentos em que o médico resiste, as perguntas que sempre aparecem e o que faz uma abordagem ser aceita ou recusada. A análise qualitativa depois organizou esses relatos em três dimensões, e foi dali que saíram os padrões.',
          en: 'We looked at how a medical visit actually goes: the real rhythm of the conversation, the moments a doctor pushes back, the questions that always come up, and what makes an approach land or fail. The qualitative analysis then organised those accounts along three dimensions, and that is where the patterns came from.',
        },
      },
      {
        title: { pt: 'As personas sintéticas', en: 'The synthetic personas' },
        body: {
          pt: 'Cada persona reúne características profissionais, aspectos comportamentais, postura durante a visita e padrões de reação. Juntos, esses quatro eixos definem nível de abertura ao diálogo, exigência técnica, tolerância à abordagem comercial e critérios de decisão. Um workshop com o time detalhou os perfis, discutiu situações reais de visita e validou as objeções levantadas.',
          en: 'Each persona brings together professional traits, behavioural aspects, posture during the visit and reaction patterns. Together those four axes set how open the doctor is to conversation, how technically demanding they are, how much commercial framing they will take, and what they decide on. A workshop with the team fleshed out the profiles, worked through real visit situations and validated the objections we had gathered.',
        },
      },
      {
        title: { pt: 'Como a plataforma foi construída', en: 'How the platform was built' },
        body: {
          pt: 'Benchmark em aplicações de saúde no Mobbin, no brandbook da EMS, em referências de chat e fluxo conversacional no Dribbble e em outros players do segmento. Antes de desenhar: mapeamento do user journey com base no refinamento técnico, antecipação de casos de uso, telas de erro, estado vazio e feedback, e o fluxo completo da simulação. Tablet como dispositivo principal, e mobile first para facilitar o desenvolvimento.',
          en: 'Benchmarking against health apps on Mobbin, the EMS brandbook, chat and conversational-flow references on Dribbble, and other players in the sector. Before drawing anything: mapping the user journey off the technical refinement, anticipating use cases, error screens, empty states and feedback, and the full simulation flow. Tablet as the primary device, and mobile first to make development easier.',
        },
      },
      {
        title: { pt: 'Meu papel dentro do time', en: 'My part inside the team' },
        body: {
          pt: 'O time reunia UX writing, product design, quatro project leaders e direção de design. Eu peguei a ponte entre a pesquisa e o produto: consolidar o que veio do campo, virar isso em perfis e cenários, e desenhar a experiência que os usa.',
          en: 'The team brought together UX writing, product design, four project leaders and design direction. I took the bridge between the research and the product: consolidating what came out of the field, turning it into profiles and scenarios, and designing the experience that uses them.',
        },
      },
    ],
    gameChanger: {
      pt: 'A base comportamental é o que fica. Ela vale para qualquer simulação que a EMS quiser montar depois, com outro produto ou outra especialidade, porque descreve como o médico se comporta e não o que aquele remédio faz. O simulador é o primeiro uso dela, e provavelmente não vai ser o último.',
      en: 'The behavioural base is the part that lasts. It works for any simulation EMS wants to build later, with a different product or a different speciality, because it describes how a doctor behaves rather than what one drug does. The simulator is the first use of it, and probably not the last.',
    },

    contribution: [
      {
        pt: 'Consolidei e analisei a pesquisa de campo com propagandistas, identificando os padrões de interação médica.',
        en: 'Consolidated and analysed the field research with reps, identifying the patterns in medical interaction.',
      },
      {
        pt: 'Mapeei objeções e reações e construí os perfis médicos, as personas sintéticas que sustentam a simulação.',
        en: 'Mapped objections and reactions and built the medical profiles, the synthetic personas the simulation rests on.',
      },
      {
        pt: 'Organizei o conteúdo clínico, defini a linguagem médica e criei os cenários de simulação.',
        en: 'Organised the clinical content, defined the medical language and created the simulation scenarios.',
      },
      {
        pt: 'Desenhei a plataforma, do benchmark ao protótipo em alta fidelidade, e escrevi o copy da interface.',
        en: 'Designed the platform, from benchmarking to the high-fidelity prototype, and wrote the interface copy.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: {
          pt: 'A simulação de visita médica, com a persona sintética do outro lado da conversa.',
          en: 'The medical visit simulation, with the synthetic persona on the other side of the conversation.',
        },
        confidential: true,
      },
    ],
  },

  /*
   * ⚠️ SCAFFOLD, 2026-08-25. João asked for this fourth slot and said the case is still to be
   * produced. Everything present traces to his CV; every narrative field is null on purpose, so
   * the page prompts him for what to write rather than reading as a finished case. The `impact`
   * block carries no metric because there is no measured outcome yet, and inventing one on a
   * project that is still running would be the worst possible place to guess.
   */
  'itau-escrituracao': {
    slug: 'itau-escrituracao',
    year: '2026',
    role: { pt: 'Product Designer', en: 'Product Designer' },
    duration: { pt: 'Em andamento', en: 'In progress' },
    team: { pt: 'Itaú Unibanco, via NTT DATA', en: 'Itaú Unibanco, via NTT DATA' },

    impact: {
      value: '2026',
      label: { pt: 'EM ANDAMENTO', en: 'IN PROGRESS' },
      note: {
        pt: 'O case completo entra assim que o projeto permitir publicar.',
        en: 'The full case goes up as soon as the project allows it to be published.',
      },
    },
    context: {
      pt: 'As jornadas de ativos escriturais e investimentos dentro do Itaú. É o que estou fazendo agora, e por enquanto é o que dá para contar.',
      en: 'The book-entry asset and investment journeys inside Itaú. It is what I am working on right now, and for the moment it is as much as I can say.',
    },

    conflict: null,
    tradeoff: null,
    decision: null,
    evidence: [],

    challenge: null,
    detail: [],
    gameChanger: null,

    contribution: [],
    gallery: [],
  },

  /*
   * PROVENANCE — written from the narrative João sent on 2026-08-25.
   *
   * ⚠️ TWO THINGS TO CHECK.
   *
   * `tradeoff` is my reading, not his words. His text says the solution had to work in two
   * different systems and that "apesar das particularidades de cada canal, a lógica de
   * contratação deveria ser a mesma" — which IS a trade-off, and the one that shows judgement,
   * so it is written out rather than left null. If the sacrifice was actually something else,
   * it is one paragraph to replace.
   *
   * No outcome metric was supplied. The headline number says what the solution is rather than
   * what it moved, because inventing a conversion figure on a journey about restoring a sales
   * channel would be inventing exactly the thing the case is meant to prove.
   */
  'itau-cartao-adicional': {
    slug: 'itau-cartao-adicional',
    year: '2025-2026',
    role: { pt: 'Product Designer', en: 'Product Designer' },
    duration: { pt: 'Discovery e definição da jornada', en: 'Discovery and journey definition' },
    team: { pt: 'Itaú Unibanco, via NTT DATA', en: 'Itaú Unibanco, via NTT DATA' },

    impact: {
      value: '2',
      label: { pt: 'CANAIS ASSISTIDOS', en: 'ASSISTED CHANNELS' },
      note: {
        pt: 'Agência e central de atendimento, dois sistemas diferentes, com a mesma lógica de contratação nos dois.',
        en: 'Branch and call centre, two different systems, running the same contracting logic in both.',
      },
    },
    context: {
      pt: 'A migração para a nova arquitetura tirou a contratação de cartão adicional dos canais assistidos e deixou tudo no aplicativo. Quem mais contrata esse produto tem mais de 40 anos e esperava resolver na conversa com o gerente.',
      en: 'Migrating to the new architecture took additional-card applications out of the assisted channels and left them in the app alone. The people who most often apply are over 40, and they expected to sort it out in the conversation with their manager.',
    },

    conflict: {
      pt: 'O cartão adicional deixa o titular dividir parte do limite com outra pessoa, um filho, o cônjuge, um familiar. Quem pede é o próprio titular, e ao olhar o perfil de quem contrata encontramos uma predominância clara de clientes acima dos 40 anos, acostumados a fazer isso com apoio de um gerente de agência ou de um operador da central, esperando concluir tudo durante o atendimento.\n\nCom a jornada só no aplicativo, o cliente começava o processo em um canal e tinha que terminar sozinho em outro. Gerente e operador perdiam a capacidade de finalizar uma solicitação que antes resolviam ali mesmo. A ruptura acontecia antes da conclusão, e justamente nos canais responsáveis pela maior parte das vendas de cartão adicional.',
      en: 'An additional card lets the main holder share part of their limit with someone else: a child, a partner, a relative. The holder makes the request, and looking at who actually applies we found a clear majority of customers over 40, used to doing this with help from a branch manager or a call centre operator, expecting to finish it during that conversation.\n\nWith the journey living only in the app, the customer started the process in one channel and had to finish it alone in another. Managers and operators lost the ability to complete a request they used to resolve on the spot. The break happened before completion, and in exactly the channels responsible for most additional-card sales.',
    },
    tradeoff: {
      pt: 'Abri mão de otimizar cada canal para o que ele tem de particular. A solução precisava rodar em dois sistemas diferentes, um usado pelos operadores da central e outro pelos gerentes de agência, e a tentação era desenhar duas jornadas sob medida. Uma lógica de contratação só, reaproveitável nas duas plataformas, custa alguma elegância em cada uma delas e paga isso com regra de produto aplicada do mesmo jeito nos dois lugares.',
      en: 'I gave up optimising each channel for what makes it particular. The solution had to run in two different systems, one used by call centre operators and another by branch managers, and the temptation was to design two bespoke journeys. A single contracting logic, reusable across both platforms, costs some elegance in each one and pays for it with the product rules being applied the same way in both places.',
    },
    decision: {
      pt: 'O sistema decide, o atendente não interpreta. A jornada envolvia regras de elegibilidade, integrações e cenários que precisavam funcionar de forma coordenada, e a escolha foi fazer o sistema apresentar apenas os caminhos possíveis para cada cliente em vez de pedir que gerente ou operador lesse critério e decidisse.\n\nIsso tornou o momento da validação uma decisão de design, não de engenharia. Validar tarde deixaria o cliente avançar com uma opção que não estava disponível para ele, então definimos em que ponto da jornada a elegibilidade é checada e quais opções de cartão podem aparecer a partir do retorno da API.',
      en: 'The system decides; the person serving the customer does not interpret. The journey involved eligibility rules, integrations and scenarios that had to work in a coordinated way, and the call was to have the system show only the routes available to each customer rather than asking a manager or operator to read criteria and decide.\n\nThat made the moment of validation a design decision rather than an engineering one. Validating late would let a customer advance with an option that was not available to them, so we defined at which point in the journey eligibility gets checked and which card options can appear off the back of the API response.',
    },
    evidence: [],

    challenge: {
      pt: 'À primeira vista, o projeto parecia ser só a reconstrução de uma funcionalidade na arquitetura nova. Conforme o discovery avançou, ficou claro que o desafio ia além de levar a contratação de volta aos canais assistidos: era coordenar regras de elegibilidade, integrações e cenários que precisavam funcionar juntos, em dois sistemas diferentes, sem transferir nenhuma dessa complexidade para quem está atendendo o cliente.',
      en: 'At first glance the project looked like rebuilding a feature on the new architecture. As discovery went on it became clear the challenge went beyond bringing applications back to the assisted channels: it was coordinating eligibility rules, integrations and scenarios that had to work together, across two different systems, without handing any of that complexity to the person serving the customer.',
    },
    detail: [
      {
        title: { pt: 'Onde a jornada quebrava', en: 'Where the journey broke' },
        body: {
          pt: 'Durante a migração para a nova arquitetura, a contratação de cartão adicional deixou de estar disponível nos principais canais assistidos e ficou acessível apenas pelo aplicativo. Na prática, isso criou quatro problemas encadeados.',
          en: 'During the migration to the new architecture, additional-card applications stopped being available in the main assisted channels and remained reachable only through the app. In practice that created four problems, one leading into the next.',
        },
        points: [
          {
            title: { pt: 'Exclusivo no app', en: 'App only' },
            body: {
              pt: 'A contratação do cartão adicional não estava disponível nos canais assistidos.',
              en: 'Applying for an additional card was not available in the assisted channels.',
            },
          },
          {
            title: { pt: 'Mudança de canal', en: 'Switching channel' },
            body: {
              pt: 'O cliente começava o processo no atendimento e precisava terminá-lo sozinho no aplicativo.',
              en: 'The customer started the process in a conversation and had to finish it alone in the app.',
            },
          },
          {
            title: { pt: 'Perda de autonomia', en: 'Loss of autonomy' },
            body: {
              pt: 'Gerentes e operadores não conseguiam finalizar a contratação no canal em que o cliente buscou atendimento.',
              en: 'Managers and operators could not complete an application in the channel where the customer came for help.',
            },
          },
          {
            title: { pt: 'Impacto no negócio', en: 'Business impact' },
            body: {
              pt: 'A mudança de canal criava um ponto de ruptura antes da conclusão, nos canais que mais vendem cartão adicional.',
              en: 'Switching channel created a breaking point before completion, in the channels that sell the most additional cards.',
            },
          },
        ],
      },
      {
        title: { pt: 'O desafio', en: 'The challenge' },
        body: {
          pt: 'A jornada envolvia diferentes regras de elegibilidade, integrações e cenários que precisavam funcionar de forma coordenada. O sistema deveria lidar com essas regras e apresentar apenas os caminhos possíveis para cada cliente, evitando que gerentes e operadores tivessem que interpretar critério ou tomar decisão que dava para automatizar.\n\nHavia ainda um segundo desafio: a solução precisava funcionar em dois sistemas diferentes, um usado pelos operadores das centrais e outro pelos gerentes de agência. Apesar das particularidades de cada canal, a lógica de contratação deveria ser a mesma, garantindo que as regras do produto fossem aplicadas de forma consistente.\n\nA partir desse entendimento, definimos os princípios que passaram a orientar as decisões de design ao longo do projeto.',
          en: 'The journey involved different eligibility rules, integrations and scenarios that had to work in a coordinated way. The system was meant to handle those rules and present only the routes available to each customer, so managers and operators never had to interpret criteria or make a decision that could be automated.\n\nThere was a second challenge: the solution had to work in two different systems, one used by call centre operators and another by branch managers. Despite what makes each channel particular, the contracting logic had to be the same, so the product rules would be applied consistently.\n\nOut of that understanding we set the principles that steered the design decisions through the rest of the project.',
        },
        points: [
          { title: { pt: 'Concluir toda a jornada no mesmo canal', en: 'Finish the whole journey in one channel' } },
          { title: { pt: 'Criar uma solução reutilizável entre plataformas', en: 'Build a solution reusable across platforms' } },
          { title: { pt: 'Garantir consistência entre os canais', en: 'Keep the channels consistent with each other' } },
          { title: { pt: 'Respeitar as regras de elegibilidade', en: 'Respect the eligibility rules' } },
          { title: { pt: 'Simplificar a experiência de quem atende', en: 'Simplify the experience of the person serving' } },
        ],
      },
      {
        title: { pt: 'O discovery', en: 'Discovery' },
        body: {
          pt: 'O primeiro passo foi entender como a contratação funcionava antes da migração. Analisei a jornada no sistema legado e no aplicativo, além das regras de negócio, critérios de elegibilidade e integrações que precisavam ser considerados na arquitetura nova.\n\nNo caminho, encontrei duas coisas que mudaram o projeto. Algumas regras tinham interpretações diferentes entre as áreas envolvidas, e parte dos cenários previstos ainda não era suportada pelas novas APIs. A elegibilidade foi o exemplo mais claro: precisávamos definir em que momento da jornada o cliente é validado e quais opções de cartão podem ser apresentadas a partir do retorno da API. Isso impacta o fluxo inteiro, porque uma validação tardia deixaria o cliente avançar com uma opção que não estava disponível para contratação.\n\nOrganizei esse conhecimento em fluxos, mapas de elegibilidade e diagramas, que viraram a base das discussões com produto, engenharia, arquitetura, operações e jurídico. Foi a partir desse alinhamento que conseguimos definir quais decisões seriam assumidas pelo sistema e estruturar a jornada considerando tanto as regras do produto quanto as limitações técnicas que existiam.',
          en: 'The first step was understanding how applications worked before the migration. I went through the journey in the legacy system and in the app, along with the business rules, eligibility criteria and integrations that had to be accounted for on the new architecture.\n\nAlong the way I found two things that changed the project. Some rules were being read differently by different areas, and part of the expected scenarios was not yet supported by the new APIs. Eligibility was the clearest example: we had to decide at which point in the journey the customer gets validated and which card options can be shown off the back of the API response. That shapes the entire flow, because validating late would let a customer advance with an option that was not available to them.\n\nI organised all of it into flows, eligibility maps and diagrams, which became the basis for the discussions with product, engineering, architecture, operations and legal. It was out of that alignment that we could decide which calls the system would take on, and structure the journey around both the product rules and the technical limits that existed.',
        },
      },
    ],
    gameChanger: null,

    contribution: [
      {
        pt: 'Analisei a jornada no sistema legado e no aplicativo, junto com regras de negócio, elegibilidade e integrações.',
        en: 'Went through the journey in the legacy system and the app, alongside the business rules, eligibility and integrations.',
      },
      {
        pt: 'Organizei fluxos, mapas de elegibilidade e diagramas que viraram a base das discussões com produto, engenharia, arquitetura, operações e jurídico.',
        en: 'Organised flows, eligibility maps and diagrams that became the basis for discussion with product, engineering, architecture, operations and legal.',
      },
      {
        pt: 'Defini os princípios de design da jornada e quais decisões passariam a ser assumidas pelo sistema.',
        en: 'Set the journey’s design principles and which decisions the system would take on.',
      },
      {
        pt: 'Estruturei uma jornada só, reaproveitável nos dois sistemas dos canais assistidos.',
        en: 'Structured a single journey, reusable across both assisted-channel systems.',
      },
    ],
    gallery: [
      {
        src: null,
        caption: {
          pt: 'A contratação de cartão adicional dentro do canal assistido, com as opções filtradas pela elegibilidade do cliente.',
          en: 'The additional-card application inside the assisted channel, with options filtered by the customer’s eligibility.',
        },
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
      'Minha carreira começou no branding, desenhando identidade e campanha, e eu fui levando esse repertório visual para dentro do produto digital. Hoje combino Continuous Discovery com processos ágeis para chegar em soluções que equilibram experiência, viabilidade técnica e resultado de negócio, desde MVPs até jornadas complexas em larga escala.',
      'Ao longo do caminho passei por grandes bancos, varejo de alto volume, consultoria global e startups, tanto early-stage quanto scale-up. Uso inteligência artificial para acelerar etapas do processo, como síntese de pesquisa, geração de wireframes, testes de usabilidade e verificação de acessibilidade.',
    ],
    en: [
      'My career started in branding, designing identities and campaigns, and I carried that visual repertoire with me into digital product. These days I combine Continuous Discovery with agile process to reach solutions that balance experience, technical feasibility and business outcome, from MVPs through to complex journeys at scale.',
      'Along the way I have worked in big banks, high-volume retail, a global consultancy, and startups both early-stage and scale-up. I use AI to speed up parts of the process, things like research synthesis, wireframe generation, usability testing and accessibility checks.',
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
    pt: 'Alguns números que eu ajudei a mover ao longo desses anos trabalhando como Product Designer.',
    en: 'A few numbers I helped move over these years working as a Product Designer.',
  } satisfies T,

  items: [
    {
      /*
       * ⚠️ CORRECTED 2026-08-25. This read "+90%", which says CSAT rose by ninety per cent.
       * João's own write-up says it rose by 40%, landing AT a 90% satisfaction average. The
       * level and the increase are different claims and the wrong one was the flattering one.
       */
      label: { pt: 'AUMENTO DE CSAT', en: 'CSAT INCREASE' },
      value: '+40%',
      note: {
        pt: 'Chegando a 90% de satisfação na configuração de aparência de loja da Reserva INK.',
        en: 'Reaching 90% satisfaction on Reserva INK’s storefront appearance settings.',
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
        pt: 'Na Central de Atendimento de cartões PJ do Itaú, depois de mexer na jornada de contestação.',
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
    pt: 'Comecei no branding, desenhando identidade e campanha, e fui levando esse repertório visual comigo para dentro do produto digital.',
    en: 'I started out in branding, designing identities and campaigns, and carried that visual repertoire with me into digital product.',
  } satisfies T,

  companies: [
    {
      name: 'Banco Itaú',
      description: {
        // Sharpened: his actual scope is cards then investments, not "crédito e atendimento".
        pt: 'Banco em escala. Jornadas de cartões PJ lançadas com a VISA e, hoje, investimentos em ativos escriturais.',
        en: 'Banking at scale. Business-card journeys launched with VISA and, right now, book-entry asset investments.',
      },
    },
    {
      name: 'NTT DATA',
      description: {
        pt: 'Consultoria global japonesa. Design de produto dentro de squads de clientes enterprise.',
        en: 'Japanese global consultancy. Product design inside enterprise client squads.',
      },
    },
    {
      name: 'EMS Saúde',
      description: {
        // Confirmed by João (2026-08-22): delivered as a project via NTT DATA, not direct
        // employment. He considers it significant work and it stays in the history list.
        pt: 'Saúde e farmacêutica. Plataforma de treinamento com consultas médicas simuladas por IA.',
        en: 'Health and pharma. A training platform with AI-simulated medical consultations.',
      },
    },
    {
      name: 'Bricker',
      description: {
        pt: 'Startup early-stage no mercado imobiliário. IA para leitura de documentos e otimização de processos.',
        en: 'Early-stage proptech startup. AI for document reading and process optimisation.',
      },
    },
    {
      name: 'Reserva INK',
      description: {
        pt: 'Moda e tecnologia. SaaS de print on demand para mais de 60 mil lojistas, dentro do grupo AZZAS 2154.',
        en: 'Fashion and tech. Print-on-demand SaaS for over 60,000 sellers, part of the AZZAS 2154 group.',
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
        pt: 'O maior varejo e e-commerce de Minas Gerais. Jornada de compra e empréstimo pessoal.',
        en: 'The largest retailer and e-commerce in Minas Gerais. Purchase journey and personal lending.',
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
    pt: 'Estou sempre aberto para conversar sobre produto, design e IA. Pode ser uma oportunidade de trabalho ou só um papo rápido.',
    en: 'I am always up for a conversation about product, design and AI. It can be a job opportunity or just a quick chat.',
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

/* -------------------------------------------------------- projects page */

export const projectsPage = {
  heading: { pt: 'Projetos selecionados', en: 'Selected projects' } satisfies T,
  subheading: {
    pt: 'Escolha o tipo de projeto',
    en: 'Choose a kind of project',
  } satisfies T,

  /** Order matters — this is the order the tabs render in. */
  tabs: [
    { id: 'todos', label: { pt: 'Todos', en: 'All' } satisfies T },
    { id: 'produtos', label: { pt: 'Produtos digitais', en: 'Digital products' } satisfies T },
    { id: 'interfaces', label: { pt: 'Interfaces', en: 'Interfaces' } satisfies T },
    { id: 'branding', label: { pt: 'Branding', en: 'Branding' } satisfies T },
    { id: 'handoff', label: { pt: 'Processos de handoff', en: 'Handoff processes' } satisfies T },
  ] as const,

  /*
   * Shown when a filter matches nothing. "handoff" has no work assigned to it yet, and an empty
   * grid with no explanation reads as a page that failed to load.
   */
  empty: {
    pt: 'Nada por aqui ainda. Os projetos desta categoria ainda estão sendo escritos.',
    en: 'Nothing here yet. The projects in this category are still being written.',
  } satisfies T,

  readCase: { pt: 'Ler o case', en: 'Read the case' } satisfies T,
  back: { pt: 'Voltar ao início', en: 'Back to the start' } satisfies T,

  pagination: {
    previous: { pt: 'Página anterior', en: 'Previous page' } satisfies T,
    next: { pt: 'Próxima página', en: 'Next page' } satisfies T,
    /** Rendered as "Página 1 de 2" — the numbers are filled in at runtime. */
    page: { pt: 'Página', en: 'Page' } satisfies T,
    of: { pt: 'de', en: 'of' } satisfies T,
  },
};


/* ------------------------------------------------------------ case page */

export const casePage = {
  /*
   * A case is reached FROM the projects index, so that is where "back" goes — not to the home
   * page. Sending it home discards the filter and the page the reader had got to and makes them
   * find their way to the list again, which is the opposite of what the control promises.
   */
  back: { pt: 'Voltar aos projetos', en: 'Back to projects' } satisfies T,
  /* Shown when the reader arrived from the one-pager rather than from the projects index. */
  backHome: { pt: 'Voltar para o início', en: 'Back to the start' } satisfies T,
  backLong: { pt: 'Voltar para o início', en: 'Back to the start' } satisfies T,

  /*
   * The section headings, which used to be hard-coded in Portuguese inside the component. That
   * made them the only strings on the site the language toggle could not reach: an English
   * reader got the whole case in English under headings in Portuguese.
   */
  /*
   * The 6s / 60s / 6min method still shapes this page: what the reader meets first, what the
   * argument is, and what the detail is. João's note is that it must stop announcing itself.
   * A band headed "EM 60 SEGUNDOS" tells the reader about the author's process at the moment
   * they were about to start reading about the work, and the structure does its job whether or
   * not it is labelled.
   *
   * What replaces it is furniture for the reader instead of for the author: how long this is.
   */
  readingTime: { pt: 'min de leitura', en: 'min read' } satisfies T,

  /* Controls on a case's moving figures. */
  media: {
    play: { pt: 'Reproduzir', en: 'Play' } satisfies T,
    pause: { pt: 'Pausar', en: 'Pause' } satisfies T,
  },

  headings: {
    conflict: { pt: 'O PROBLEMA', en: 'THE PROBLEM' } satisfies T,
    tradeoff: { pt: 'O QUE ABRI MÃO', en: 'WHAT I GAVE UP' } satisfies T,
    decision: { pt: 'O QUE EU DECIDI', en: 'WHAT I DECIDED' } satisfies T,
    challenge: { pt: 'A parte mais difícil', en: 'The hardest part' } satisfies T,
    contribution: { pt: 'O que eu fiz', en: 'What I did' } satisfies T,
    gameChanger: { pt: 'O que isso destravou', en: 'What this unlocked' } satisfies T,
  },

  /** The topic index that rides alongside the long read. */
  toc: {
    label: { pt: 'Neste case', en: 'In this case' } satisfies T,
    top: { pt: 'Voltar ao topo', en: 'Back to the top' } satisfies T,
  },

  /** The chart's own furniture: the readout line, and what a bar announces. */
  chart: {
    start: { pt: 'ponto de partida', en: 'starting point' } satisfies T,
    below: { pt: 'abaixo do início', en: 'below the start' } satisfies T,
    above: { pt: 'acima do início', en: 'above the start' } satisfies T,
    hint: {
      pt: 'Passe o mouse ou use as setas para percorrer.',
      en: 'Hover, or use the arrow keys to step through.',
    } satisfies T,
  },

  /** Appended to a gallery caption when the artwork is still waiting on an NDA review. */
  ndaPending: {
    pt: 'imagem pendente de avaliação de NDA',
    en: 'image pending NDA review',
  } satisfies T,
};

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
    pt: 'Escolha o canal que você preferir. Eu respondo rápido nos três.',
    en: 'Pick whichever channel you prefer. I reply quickly on all three.',
  } satisfies T,
  channels: {
    email: { pt: 'E-mail', en: 'E-mail' } satisfies T,
    whatsapp: { pt: 'WhatsApp', en: 'WhatsApp' } satisfies T,
    linkedin: { pt: 'LinkedIn', en: 'LinkedIn' } satisfies T,
  },
};
