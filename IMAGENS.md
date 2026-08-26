# Onde colocar as imagens

Cada case tem uma pasta própria em `public/cases/<slug>/`. As pastas já existem, é só soltar os
arquivos dentro e me avisar — a ligação com a página é feita em `content/copy.ts` e eu faço.

Os slugs, na ordem em que aparecem no site:

| # | Slug | Case |
|---|------|------|
| 1 | `reserva-ink-aparencia-de-loja` | Aparência de loja |
| 2 | `itau-cartoes-pj` | Contestação de despesas |
| 3 | `ems-simulador-visitas` | Simulador de visitas médicas |
| 4 | `itau-escrituracao` | Escrituração de ativos |
| 5 | `itau-cartao-adicional` | Cartão adicional |
| 6 | `reserva-ink-imagens-de-vitrine` | Imagens de vitrine |
| 7 | `bricker-amelie` | Amelie |

---

## 1. A foto do case

A imagem grande que aparece atrás do painel na home e que a folha levanta para revelar.

```
public/cases/<slug>.webp
```

- **Formato:** WebP. Se só tiver JPG, pode mandar o JPG que eu converto.
- **Proporção:** paisagem, 3:2. O corte é `cover`, então o centro é o que sobrevive.
- **Tamanho:** 1800 × 1200 no mínimo. Acima de 2400px de largura não ganha nada.
- **Peso:** até uns 400 KB por arquivo.

> **Atenção no case 1.** A foto do primeiro case é a mesma imagem fixa que fica atrás da tela
> inicial, então ela precisa existir também em JPG (`<slug>.jpg`) e eu preciso trocar a referência
> em `app/page.module.css` junto. Se você trocar só o WebP, a virada da folha quebra no meio do
> movimento. Me avisa quando for essa.

## 2. As figuras dentro do case

As imagens que aparecem no corpo do case, abaixo do texto.

```
public/cases/<slug>/01.webp
public/cases/<slug>/02.webp
```

- **Proporção:** 16:9. O quadro corta em `cover`, então o que estiver nas bordas some.
- **Tamanho:** 1920 × 1080 serve bem.
- **Peso:** até uns 400 KB cada.
- Numera na ordem em que devem aparecer. Cada uma leva uma legenda, que você me passa junto (ou
  eu escrevo e você corrige).

## 3. GIF, protótipo ou tela em movimento

Três formas, da melhor para a pior:

**a) Sequência de frames** — melhor qualidade e o mais leve.

```
public/cases/<slug>/frames/01.webp
public/cases/<slug>/frames/02.webp
...
```

Mesma proporção 16:9, todos do mesmo tamanho, na ordem. De 8 a 30 quadros funciona bem. Eu ligo
a velocidade (padrão: 400 ms por quadro).

**b) Gravação de tela** — melhor peso para algo longo.

```
public/cases/<slug>/demo.mp4
public/cases/<slug>/demo-poster.webp   (o primeiro quadro, opcional)
```

MP4 (H.264) ou WebM, sem áudio, 16:9. Toca em loop e sem som.

**c) GIF** — se for o que você tem, manda que eu converto.

```
public/cases/<slug>/demo.gif
```

Converto para MP4 ou para frames. GIF não pausa, achata para 256 cores e pesa várias vezes o que
os mesmos quadros pesam em WebP — e a WCAG 2.2.2 pede um jeito de parar qualquer coisa que se
mexa por mais de cinco segundos, que o GIF não tem como oferecer.

Qualquer uma das três ganha um botão de pausa na própria figura, e nenhuma começa a se mexer
sozinha para quem tem `prefers-reduced-motion` ligado no sistema.

---

## O que ainda é placeholder

- A floresta em `public/cases/floresta.webp` é imagem de banco, não é trabalho seu. Ela está ali
  só para a virada da folha ter o que revelar, e **não pode ir para o ar**.
- Os SVGs em `public/placeholders/cases/` são gerados por código. Somem sozinhos assim que o
  arquivo real do case existir.
- A tela do celular do Itaú que você mandou no chat nunca virou arquivo. Imagem colada em conversa
  não vira arquivo no repositório — precisa passar por aqui.

## Antes de mandar

Vale conferir o que pode ser publicado: as telas do Itaú e da EMS são interface real de cliente.
Hoje as legendas dessas figuras saem marcadas como pendentes de avaliação de NDA, e é você quem
tira essa marca.

---

# As pranchas dentro do case

Cada folha de capítulo do case agora tem uma **prancha**: um quadro de imagem ao lado do texto,
com fio, granulado e legenda. Enquanto o arquivo real não existe, ela aparece como um quadro
tracejado com marca de registro no canto — lê como imagem ainda não impressa, que é o que é.

Em desenvolvimento, cada prancha mostra embaixo a **orientação da foto**: o que precisa estar no
quadro, em detalhe suficiente para alguém ir lá e tirar. Isso não vai para o ar.

## Onde os arquivos entram

```
public/cases/<slug>/prancha-01.webp
public/cases/<slug>/prancha-02.webp
public/cases/<slug>/prancha-03.webp
```

Depois é uma linha em `content/copy.ts`, no `plate` da seção: troca `src: null` pelo caminho.
Me avisa que eu ligo.

## Proporções

A prancha aceita `4:3` (padrão), `16:9`, `3:4` e `1:1`. O corte é `cover` e a altura tem teto,
então:

- **Tela de produto inteira** → `4:3`, e deixe respiro nas bordas, porque o corte come as pontas.
- **Fluxo, board de Miro, tela larga** → `16:9`.
- **Celular, tela vertical** → `3:4`.
- **Detalhe de componente** → `1:1`.

## O que funciona bem numa prancha

Pensando em quem lê: um recrutador passa por essas folhas rápido, e a imagem é o que segura o
olho. Vale mais uma imagem que **mostra o problema** do que uma que mostra a interface bonita.

- **Antes e depois** na mesma moldura. Duas capturas do mesmo enquadramento, uma na folha do
  problema e outra na folha da solução, é a coisa mais forte que um case pode ter.
- **Artefato de processo**: árvore de oportunidades, matriz de priorização, mapa de fluxo,
  wireframe. Mostra como você pensa, não só o que você entregou.
- **A tela em uso**, com dado plausível dentro. Tela vazia não conta história.
- **O quadro branco / o Miro bagunçado**. Recrutador reconhece trabalho real.

Evite: mockup de celular flutuando em fundo colorido sem contexto, e captura com dado de cliente
legível. Se tiver dado sensível, desfoque antes de mandar.
