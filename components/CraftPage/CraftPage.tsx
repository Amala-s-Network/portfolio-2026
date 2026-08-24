'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { craftGate } from '@/content/copy';
import styles from './CraftPage.module.css';

/**
 * The other side, in the other identity.
 *
 * A shell, and it says so rather than pretending. João's fictional briefs — the Riot Games piece
 * and whatever follows it — go in the grid below; until they do, an empty page dressed up as a
 * finished one would be the same lie the portfolio spent all week removing from itself.
 *
 * It carries its own way back, because there is no shared navigation here on purpose: this is a
 * different room, and a nav bar from the other room would undo the whole crossing.
 */
export function CraftPage() {
  const { lang, t } = useLanguage();

  const copy = {
    system: { pt: 'AMBIENTE ALTERADO', en: 'ENVIRONMENT CHANGED' },
    heading: { pt: 'CRAFT', en: 'CRAFT' },
    lead: {
      pt: 'Trabalho autoral. Briefings inventados, clientes que não existem, peças feitas porque eu quis fazer.',
      en: 'Self-directed work. Invented briefs, clients that do not exist, pieces made because I wanted to make them.',
    },
    pending: {
      pt: 'Os projetos ainda estão sendo montados. Esta página existe como estrutura — quando as peças entrarem, elas entram aqui.',
      en: 'The projects are still being assembled. This page exists as the structure — when the pieces arrive, they arrive here.',
    },
    back: { pt: 'VOLTAR AO PORTFÓLIO', en: 'BACK TO THE PORTFOLIO' },
  } as const;

  return (
    <main className={styles.page}>
      <div className={styles.dots} aria-hidden="true" />

      <header className={styles.head}>
        <span className={styles.system}>{copy.system[lang]}</span>
        <h1 className={styles.heading}>{copy.heading[lang]}</h1>
        <p className={styles.lead}>{copy.lead[lang]}</p>
      </header>

      <section className={styles.slot}>
        <p className={styles.pending}>{copy.pending[lang]}</p>
      </section>

      <footer className={styles.foot}>
        <Link className={styles.back} href="/">
          <span className={styles.mark} aria-hidden="true" />
          {copy.back[lang]}
        </Link>

        {/* Same credit as the gate: on the screen that does the borrowing. */}
        <p className={styles.credit}>{t(craftGate.credit)}</p>
      </footer>

      <div className={styles.dots} aria-hidden="true" />
    </main>
  );
}
