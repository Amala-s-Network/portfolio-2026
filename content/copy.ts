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
 * PROPOSED. The prototype shipped four "Nome do case / Empresa" placeholders. These four are
 * drawn from the strongest, best-evidenced work in his CV and LinkedIn — but João has not yet
 * confirmed which projects he wants as the headline cases, and none of them have photography.
 * Every number below traces to a source document.
 */
export const cases: Case[] = [
  {
    slug: 'itau-cartoes-pj',
    categories: ['produtos'],
    /*
     * PLACEHOLDER, for the turn test only. This is a stock forest, not João's work — it is here
     * so the sheet lifts to reveal the same picture the fold has been showing all along, which
     * is the behaviour being tested. It must be replaced with the real case photography before
     * launch (README "Open items" #1).
     */
    photo: '/cases/floresta.webp',
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
    slug: 'reserva-ink-aparencia-de-loja',
    categories: ['produtos', 'interfaces'],
    title: {
      pt: 'Aparência de loja para 60 mil lojistas',
      en: 'Storefront appearance for 60k sellers',
    },
    company: { pt: 'Reserva INK · AZZAS 2154', en: 'Reserva INK · AZZAS 2154' },
    description: {
      pt: 'A configuração da loja era a maior fonte de tickets do produto inteiro. Mexi no onboarding e na personalização para tirar a fricção do caminho: o CSAT subiu 90% e as reclamações caíram 87%.',
      en: 'Setting up a store was the biggest source of support tickets in the whole product. I reworked onboarding and customisation to take the friction out: CSAT went up 90% and complaints dropped 87%.',
    },
    photo: null,
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
      pt: 'Reescrevi a ferramenta de personalização de vitrine para um fluxo de dois cliques. Ficou 95% mais rápida, com 99% de satisfação e 60% menos tempo e custo de criação para 92% dos lojistas.',
      en: 'I rebuilt the showcase customisation tool into a two-click flow. It came out 95% faster, with 99% satisfaction and 60% less creation time and cost for 92% of sellers.',
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
    slug: 'ems-saude',
    categories: ['produtos'],
    name: { pt: 'Treinamento de propagandistas com IA', en: 'AI-driven rep training' },
    company: { pt: 'EMS Saúde', en: 'EMS Saúde' },
    image: null,
  },
  {
    slug: 'itau-investimentos',
    categories: ['produtos'],
    name: { pt: 'Ativos escriturais e investimentos', en: 'Book-entry assets and investments' },
    company: { pt: 'Itaú Unibanco', en: 'Itaú Unibanco' },
    image: null,
  },
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
  points: { label: string; value: number }[];
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
      pt: 'Contestação de despesas era, fazia tempo, o principal motivo de ligação na Central de Atendimento do Itaú PJ. A gente reduziu esse volume em 21% sem escrever uma linha de código.',
      en: 'Expense disputes had long been the single biggest reason customers called Itaú’s business-banking centre. We cut that volume by 21% without writing a line of code.',
    },

    conflict: {
      pt: 'A pesquisa apontava para um produto: uma versão digital da contestação dentro do site PJ. Só que o banco tinha outras prioridades naquele ciclo. A orientação que veio da gerência foi reduzir o volume de ligações em formato de MVP, sem custo de desenvolvimento e sem envolver os times técnicos. Ou seja, a experiência que a gente queria construir ficou de um lado e o que dava para entregar ficou do outro.',
      en: 'The research pointed at a product: a digital version of the dispute flow inside the business banking site. The bank had other priorities that cycle, though. The brief that came down from management was to cut call volume as an MVP, with no development budget and no engineering teams involved. So the experience we wanted to build sat on one side and what we could actually ship sat on the other.',
    },
    tradeoff: {
      pt: 'Abri mão de entregar interface. O visioning da experiência digital foi desenhado e ficou guardado, sem nada implementado naquele momento. O que foi para produção nessa etapa foi informação, prazo e roteiro de atendimento.',
      en: 'I gave up shipping an interface. The visioning for the digital experience was designed and then put on the shelf, with nothing implemented at the time. What went live at that stage was information, deadlines and call scripts.',
    },
    decision: {
      pt: 'Fomos atrás dos 40%. O discovery mostrou que cerca de 40% de todas as ligações eram só para saber em que etapa a contestação estava e quanto tempo ainda faltava. Em vez de esperar pelo produto que resolveria tudo, a gente tratou a dúvida que respondia por quase metade do volume: deixar o prazo claro, acertar o canal de contato e dizer onde os documentos seriam pedidos e as atualizações enviadas.',
      en: 'We went after the 40%. Discovery showed that around 40% of all calls existed only to ask what stage a dispute was at and how long was left. Instead of waiting for the product that would fix everything, we tackled the question behind almost half the volume: make the deadline clear, get the contact channel right, and say where documents would be requested and updates sent.',
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
      /*
       * The 40% figure is deliberately NOT a fourth card here. These three are outcomes — what
       * changed because of the work. "40% of calls were only asking about status" is a finding,
       * the thing that made the decision possible, and it already carries the decision paragraph
       * above. Filing it as evidence would also leave a lone card stranded on a second row of a
       * three-column grid, for a number that is not proof of anything having worked.
       */
    ],

    /*
     * The five months behind the headline number, drawn rather than screenshotted.
     *
     * João sent this as a slide image. Rebuilding it from the figures is better on every axis
     * that matters: it stays sharp at any zoom, it takes the page's own colours instead of
     * importing another brand's, a screen reader gets a real table instead of nothing, and the
     * −21% is verifiable on screen (2395 → 1893 is −20.96%) rather than being a claim sitting
     * next to a picture of the same claim.
     */
    chart: {
      title: { pt: 'Chamadas de contestação por mês', en: 'Dispute calls per month' },
      note: {
        pt: 'Fonte: relatório de volume da Central de Atendimento, de agosto a dezembro de 2025.',
        en: 'Source: the call centre volume report, August to December 2025.',
      },
      points: [
        { label: '08/25', value: 2395 },
        { label: '09/25', value: 2366 },
        { label: '10/25', value: 2300 },
        { label: '11/25', value: 2232 },
        { label: '12/25', value: 1893 },
      ],
    },

    challenge: {
      pt: 'Mexer numa métrica de operação sem poder construir nada. Sem verba e sem time técnico, sobrou o que já existia: o roteiro do analista, o que ele fala sobre prazo e por qual canal o cliente é procurado depois. Achar dentro dessas restrições o ponto que respondia por 40% do volume levou 16 semanas de discovery.',
      en: 'Moving an operational metric with nothing to build. No budget and no engineering team left us with what was already there: the analyst’s script, what it says about deadlines, and which channel the customer gets contacted through afterwards. Finding the one point worth 40% of the volume inside those limits took 16 weeks of discovery.',
    },
    detail: [
      {
        title: { pt: 'O problema', en: 'The problem' },
        body: {
          pt: 'A vertente PJ do Itaú é antiga e boa parte dela ainda roda em Voxel. Quem depende desse sistema legado não recebe a experiência dos padrões atuais do banco, porque estudos de usabilidade, design, acessibilidade e o JIP nunca chegaram até ali. Nesse cenário, Contestação de Despesas era a área mais crítica em reclamações e em ligações, com custo mensal alto e sobrecarga constante para os analistas.',
          en: 'Itaú’s business-banking side is old, and a good part of it still runs on Voxel. Anyone who depends on that legacy system misses out on the bank’s current standards, because usability studies, design, accessibility and the JIP framework never reached it. In that setting, expense disputes were the most critical area for complaints and calls alike, with a high monthly cost and a constant load on the analysts.',
        },
      },
      {
        title: { pt: 'Onde isso aconteceu', en: 'Where this happened' },
        body: {
          pt: 'O Itaú é um dos maiores bancos da América Latina e tem um dos maiores times de design do continente. Atuei pela NTT DATA no time de cartões da comunidade PJ durante o lançamento de um produto novo em parceria com a VISA. Eram cinco jornadas críticas, e contestação era de longe a mais cara delas.',
          en: 'Itaú is one of Latin America’s largest banks, with one of the continent’s largest design teams. I worked through NTT DATA on the business-card team during the launch of a new product built with VISA. There were five critical journeys, and disputes was by far the most expensive of them.',
        },
      },
      {
        title: { pt: 'O discovery', en: 'Discovery' },
        body: {
          pt: 'Juntamos meu time, a Central de Atendimento, o time de contestação da PF e as outras áreas envolvidas. Foram 16 semanas de sessões de Lean Inception, revisão completa dos fluxos e da esteira de contestação, benchmarks com bancos tradicionais e digitais (PJ e PF), entrevistas com usuários e uma contestação real que eu mesmo abri e acompanhei até o fim. Também mapeamos o motor de fraudes, os prazos e os SLAs do processo.',
          en: 'We pulled together my team, the call centre, the retail-side dispute team and the other areas involved. Sixteen weeks of Lean Inception sessions, a full review of the flows and the dispute pipeline, benchmarks against traditional and digital banks (business and retail), user interviews, and a real dispute that I filed myself and followed to the end. We also mapped the fraud engine, the deadlines and the SLAs in the process.',
        },
      },
      {
        title: { pt: 'O visioning que ficou guardado', en: 'The visioning that was shelved' },
        body: {
          pt: 'Antes de tocar no roteiro, construímos um visioning de como a experiência ideal funcionaria no site PJ, dentro do JIP (o Jeito Itaú de Produtar) e sobre o iDS, o design system do banco. Ele nunca foi implementado e mesmo assim cumpriu o papel dele: orientou as decisões do MVP para que continuassem valendo quando o produto digital chegasse.',
          en: 'Before touching the script, we built a visioning of how the ideal experience would work on the business banking site, inside JIP (Itaú’s product framework) and on iDS, the bank’s design system. It was never implemented and it still did its job: it steered the MVP decisions so they would still hold when the digital product arrived.',
        },
      },
      {
        title: { pt: 'O que mudou na Central', en: 'What changed at the call centre' },
        body: {
          pt: 'Propusemos melhorias pontuais nos scripts que os analistas usam: deixar claro o prazo e a etapa da solicitação, dizer qual canal o banco usa para falar com o cliente e apontar onde os documentos são pedidos e as atualizações enviadas. São ajustes de conversa, sem uma tela nova em nenhum deles, e foram eles que derrubaram 21% do volume ao longo dos meses.',
          en: 'We proposed targeted changes to the scripts the analysts use: make the deadline and the stage of a request clear, say which channel the bank uses to reach the customer, and point out where documents get requested and updates sent. They are adjustments to a conversation, with no new screen anywhere in them, and they are what took 21% off the volume over the following months.',
        },
      },
    ],
    gameChanger: {
      pt: 'Depois do MVP, fiquei responsável por desenhar toda a nova experiência de Contestação de Despesas da BUPJ Itaú, com previsão de implementação em 2026. Ter derrubado as ligações só com roteiro virou o argumento que justificou construir o produto de verdade. Como é informação sensível, esse material não pode ser divulgado aqui. Se quiser saber mais, é só entrar em contato.',
      en: 'After the MVP I became responsible for designing the whole new expense-dispute experience for Itaú’s business unit, scheduled for 2026. Having brought the calls down with a script alone became the argument that justified building the real product. Since this is sensitive material it cannot be published here. If you want to know more, just get in touch.',
    },

    contribution: [
      {
        pt: 'Conduzi o discovery e o visioning, reunindo meu time, a Central de Atendimento e o time de contestação da PF.',
        en: 'Led discovery and visioning, bringing together my team, the call centre and the retail-side dispute team.',
      },
      {
        pt: 'Rodei sessões de Lean Inception, revisões de fluxo e entrevistas de UX, e abri uma contestação real para percorrer a esteira inteira.',
        en: 'Ran Lean Inception sessions, flow reviews and UX interviews, and filed a real dispute to walk the whole pipeline.',
      },
      {
        pt: 'Propus as mudanças de script e de comunicação de prazo que responderam pelos 21%.',
        en: 'Proposed the script and deadline-communication changes behind the 21%.',
      },
      {
        pt: 'Desenhei a nova experiência de contestação da BUPJ, prevista para 2026.',
        en: 'Designed the business unit’s new dispute experience, scheduled for 2026.',
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
      pt: 'A configuração de loja era a maior fonte de tickets do produto e acabou virando o fluxo com o melhor CSAT de todos.',
      en: 'Setting up a store was the product’s biggest source of tickets, and it ended up becoming the flow with the best CSAT of all.',
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
        note: { pt: 'O tamanho da base ativa que a mudança alcançou.', en: 'The size of the active base the change reached.' },
      },
    ],

    challenge: null,
    detail: [
      {
        title: { pt: 'Onde isso aconteceu', en: 'Where this happened' },
        body: {
          pt: 'A INK é a plataforma de print on demand da Reserva, parte do grupo AZZAS 2154, o maior grupo de vestuário da América Latina. Mais de 60 mil empreendedores usam a plataforma para montar e operar as próprias lojas.',
          en: 'INK is Reserva’s print-on-demand platform, part of AZZAS 2154, the largest apparel group in Latin America. Over 60,000 entrepreneurs use it to build and run their own stores.',
        },
      },
      {
        title: { pt: 'A evidência veio do suporte', en: 'The evidence came from support' },
        body: {
          pt: 'Os tickets de reclamação foram a fonte principal, porque os motivos apontavam direto para onde o fluxo quebrava. Junto com entrevistas de UX com lojistas e testes de usabilidade, eles deram o mapa do que precisava mudar.',
          en: 'Complaint tickets were the main source, because the reasons pointed straight at where the flow was breaking. Together with UX interviews with sellers and usability testing, they gave us the map of what had to change.',
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
    year: '2023-2024',
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
        note: { pt: 'Que o processo anterior. O fluxo inteiro caiu para dois cliques.', en: 'Than the previous process. The whole flow dropped to two clicks.' },
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
          pt: 'Todo produto na INK precisa de imagem de vitrine para vender. Sem ela, o item até existe no catálogo, mas não converte, e a maioria dos lojistas não é designer. O custo de criar um produto virou, na prática, uma barreira de entrada no negócio.',
          en: 'Every INK product needs a showcase image to sell. Without one an item does sit in the catalogue, but it does not convert, and most sellers are not designers. The cost of creating a product had become, in practice, a barrier to entry.',
        },
      },
      {
        title: { pt: 'Acessibilidade como requisito de negócio', en: 'Accessibility as a business requirement' },
        body: {
          pt: 'O alcance da mudança dependia de funcionar para quem não tem repertório visual. Por isso acessibilidade e facilidade de uso entraram como requisito desde o começo, e é isso que explica os 92% de cobertura.',
          en: 'The reach of the change depended on it working for people with no visual training. That is why accessibility and ease of use went in as a requirement from the start, and it is what explains the 92% coverage.',
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
        pt: 'Medi tempo e custo de criação antes e depois, para sustentar o resultado com dados.',
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
      label: { pt: 'AUMENTO DE CSAT', en: 'CSAT INCREASE' },
      value: '+90%',
      note: {
        pt: 'Depois que eu redesenhei a configuração de aparência de loja na Reserva INK.',
        en: 'After I redesigned the storefront appearance settings at Reserva INK.',
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
  layers: {
    sixty: { pt: 'EM 60 SEGUNDOS', en: 'IN 60 SECONDS' } satisfies T,
    sixtyShort: { pt: 'RESULTADOS', en: 'RESULTS' } satisfies T,
    sixMin: { pt: 'EM 6 MINUTOS', en: 'IN 6 MINUTES' } satisfies T,
  },

  headings: {
    conflict: { pt: 'O QUE COMPLICOU', en: 'WHAT MADE IT HARD' } satisfies T,
    tradeoff: { pt: 'O QUE ABRI MÃO', en: 'WHAT I GAVE UP' } satisfies T,
    decision: { pt: 'O QUE EU DECIDI', en: 'WHAT I DECIDED' } satisfies T,
    challenge: { pt: 'A parte mais difícil', en: 'The hardest part' } satisfies T,
    contribution: { pt: 'O que eu fiz', en: 'What I did' } satisfies T,
    gameChanger: { pt: 'O que isso destravou', en: 'What this unlocked' } satisfies T,
  },

  /** Column headers for the accessible table behind a case chart. */
  chart: {
    period: { pt: 'Mês', en: 'Month' } satisfies T,
    amount: { pt: 'Chamadas', en: 'Calls' } satisfies T,
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
