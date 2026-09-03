'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import { CaseMark } from '@/components/CaseMark/CaseMark';
import { useLanguage } from '@/lib/language';
import { componentsPage as copy, playground } from '@/content/copy';
import styles from './ComponentsPage.module.css';

/**
 * The site's own parts, off the page.
 *
 * Every specimen here is the REAL component imported from where the site uses it — not a copy
 * pasted in to look right. That is the only version of this page worth having: one built from
 * lookalikes drifts from the site within a week and then lies about it.
 */
export function ComponentsPage() {
  const { t } = useLanguage();
  const [pressed, setPressed] = useState(0);

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <Link className={styles.back} href="/playground">
          <span aria-hidden="true">&#8672;</span> {t(playground.label)}
        </Link>
        <h1 className={styles.title}>{t(copy.title)}</h1>
        <p className={styles.intro}>{t(copy.intro)}</p>
      </header>

      <Bench name="Button" note="Button/Button.tsx">
        <Row label="filled">
          <Button onClick={() => setPressed((n) => n + 1)}>Entrar em contato</Button>
          <Button arrow="down" onClick={() => setPressed((n) => n + 1)}>
            Baixar
          </Button>
          <Button arrow="none" onClick={() => setPressed((n) => n + 1)}>
            Sem seta
          </Button>
        </Row>
        <Row label="outline">
          <Button variant="outline" onClick={() => setPressed((n) => n + 1)}>
            Ver projetos
          </Button>
          <Button variant="outline" arrow="up" onClick={() => setPressed((n) => n + 1)}>
            Voltar ao topo
          </Button>
        </Row>
        <Row label="small">
          <Button small onClick={() => setPressed((n) => n + 1)}>
            Pequeno
          </Button>
          <Button small variant="outline" onClick={() => setPressed((n) => n + 1)}>
            Pequeno
          </Button>
        </Row>
        <p className={styles.readout} aria-live="polite">
          {pressed} {pressed === 1 ? 'clique' : 'cliques'}
        </p>
      </Bench>

      <Bench name="CaseMark" note="CaseMark/CaseMark.tsx">
        <div className={styles.marks}>
          <CaseMark spec={{ kind: 'share', value: 87, caption: { pt: 'share · 87', en: 'share · 87' } }} />
          <CaseMark spec={{ kind: 'converge', from: 5, caption: { pt: 'converge · 5', en: 'converge · 5' } }} />
          <CaseMark spec={{ kind: 'split', caption: { pt: 'split', en: 'split' } }} />
          <CaseMark spec={{ kind: 'steps', from: 6, to: 4, caption: { pt: 'steps · 4/6', en: 'steps · 4/6' } }} />
        </div>
      </Bench>

      <Bench name="Ruled aside" note="CasePage.module.css · .note">
        <div className={styles.note}>
          <p className={styles.noteLabel}>Como medimos</p>
          <p className={styles.noteBody}>
            A caixa com fio é a forma que um case usa para o que é verdade mas não é o argumento.
            Rótulo pequeno, um filete, e o texto embaixo.
          </p>
        </div>
      </Bench>

      <Bench name="Point cards" note="CasePage.module.css · .cards">
        <ul className={styles.cards}>
          {['Clareza', 'Agilidade', 'Controle'].map((title, i) => (
            <li key={title} className={styles.point}>
              <span className={styles.pointNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.pointTitle}>{title}</span>
              <span className={styles.pointBody}>
                Itens com corpo viram cartões numerados; sem corpo, viram lista com fio.
              </span>
            </li>
          ))}
        </ul>
      </Bench>

      <Bench name="Tokens" note="app/globals.css">
        <ul className={styles.tokens}>
          {[
            ['--ink', 'var(--ink)'],
            ['--paper', 'var(--paper)'],
            ['--accent', 'var(--accent)'],
            ['--hairline', 'var(--hairline)'],
            ['--muted-light', 'var(--muted-light)'],
          ].map(([name, value]) => (
            <li key={name} className={styles.token}>
              <span className={styles.swatch} style={{ background: value }} aria-hidden="true" />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </Bench>
    </div>
  );
}

function Bench({ name, note, children }: { name: string; note: string; children: React.ReactNode }) {
  return (
    <section className={styles.bench}>
      <div className={styles.benchHead}>
        <h2 className={styles.benchName}>{name}</h2>
        <code className={styles.benchNote}>{note}</code>
      </div>
      <div className={styles.benchBody}>{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowItems}>{children}</div>
    </div>
  );
}
