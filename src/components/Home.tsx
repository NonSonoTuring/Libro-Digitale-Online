import type { CSSProperties } from "react";
import { topics, type Topic } from "../data/topics";

export function Home({ theme, onOpenTopic }: {
  theme: "light" | "dark";
  onOpenTopic: (id: string) => void;
}) {
  const accent = (topic: Topic) => ({ "--course-accent": topic.accent[theme] }) as CSSProperties;
  const chapters = topics.flatMap((topic) => topic.chapters);
  const tickerItems = [...chapters, ...chapters];
  const chapterCount = chapters.length;
  const readingMinutes = chapters.reduce((total, chapter) => total + chapter.minutes, 0);
  const featuredTopics = topics.slice(0, 3);

  return (
    <div className="home-page w-full">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="book-container">
          <div className="home-hero-topline flex items-center justify-between border-b border-line py-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">Volume I / Edizione 2026</span>
            <span className="home-live-indicator">
              <i aria-hidden="true" />
              didattica interattiva · aggiornata
            </span>
          </div>

          <div className="home-hero-grid grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="home-hero-copy">
              <span className="home-kicker font-mono text-[10px] uppercase tracking-[0.22em] text-terra">Un libro per guardare più a lungo</span>
              <h1 id="home-title" className="display-title">Forma <em>e</em> Codice</h1>
              <p className="home-hero-subtitle font-serif text-[18px] leading-[1.6] text-ink-soft sm:text-[20px]">
                Quattro percorsi per capire come una cosa prende forma: <em>nella memoria</em> di una macchina,
                <em> nella geometria</em> di un solido, <em>nella luce</em> di un dipinto, <em>nella pietra</em>.
              </p>
              <p className="home-hero-description mt-4 max-w-[31rem] text-[13.5px] leading-relaxed text-muted">
                Reti neurali, geometria del cubo, lettura della pittura e Neoclassicismo. Con laboratori interattivi,
                modelli esplorabili e letture visive. Nessuna semplificazione da manuale per bambini.
              </p>

              <div className="home-hero-actions">
                <button type="button" className="home-primary-button" onClick={() => topics[0] && onOpenTopic(topics[0].id)}>
                  Entra nel volume <span aria-hidden="true">↗</span>
                </button>
                <a className="home-secondary-button" href="#corsi">Indice generale <span aria-hidden="true">↓</span></a>
              </div>

              <div className="home-statistics" aria-label="Statistiche del volume">
                <div><strong>{String(topics.length).padStart(2, "0")}</strong><span>Percorsi</span></div>
                <div><strong>{String(chapterCount).padStart(2, "0")}</strong><span>Capitoli</span></div>
                <div><strong>{String(readingMinutes).padStart(2, "0")}</strong><span>Minuti di lettura</span></div>
              </div>
            </div>

            <div className="home-hero-art" aria-hidden="true">
              <div className="home-art-orbit home-art-orbit-one" />
              <div className="home-art-orbit home-art-orbit-two" />
              {featuredTopics.map((topic, index) => (
                <div className={"home-art-card home-art-card-" + (index + 1)} key={topic.id} style={accent(topic)}>
                  <img src={topic.cover} alt="" />
                  <span>{topic.title}</span>
                </div>
              ))}
              <span className="home-art-caption">Appunti · figure · percorsi</span>
              <span className="home-art-index">I — IV</span>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker relative flex w-full overflow-hidden border-t border-line bg-surface/50 py-2.5" aria-label="Titoli dei capitoli">
        <div className="ticker-track" aria-hidden="true">
          {tickerItems.map((chapter, index) => (
            <span className="ticker-item" key={index}>
              <span>{chapter.title}</span><i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <section className="home-catalog border-t border-line bg-surface/40" id="corsi" aria-labelledby="catalog-title">
        <div className="book-container py-16 sm:py-20">
          <div className="home-catalog-heading">
            <div>
              <span className="home-kicker font-mono text-[10px] uppercase tracking-[0.22em] text-terra">Percorsi</span>
              <h2 id="catalog-title" className="display-title display-title-section">Scegli da dove entrare.</h2>
              <p className="mt-3 max-w-lg font-serif text-[15px] leading-relaxed text-muted">
                Passa il cursore su una copertina per leggere la scheda. Seleziona una scheda in qualsiasi punto per raggiungere l'indice dei capitoli.
              </p>
            </div>
            <span className="home-catalog-count">{String(topics.length).padStart(2, "0")} percorsi — SELEZIONE</span>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:gap-6 mt-10">
            {topics.map((topic, index) => (
              <article
                className="home-card group"
                key={topic.id}
                style={accent(topic)}
                role="link"
                tabIndex={0}
                aria-label={`Apri il percorso ${topic.title}`}
                onClick={() => onOpenTopic(topic.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onOpenTopic(topic.id);
                  }
                }}
              >
                <div className="home-card-image h-[240px] overflow-hidden relative sm:h-[260px]">
                  <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.055]"
                    src={topic.cover}
                    alt={"Copertina del percorso " + topic.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814]/85 via-[#1a1814]/20 to-transparent" />
                  <div className="home-card-badges">
                    <span>{topic.discipline}</span>
                    <i>{String(index + 1).padStart(2, "0")}</i>
                  </div>
                  <div className="home-card-heading">
                    <span>{topic.discipline.split("·")[0].trim()}</span>
                    <h3>{topic.title}</h3>
                    <p>{topic.subtitle}</p>
                  </div>

                  <div className="home-card-overlay absolute inset-0 flex flex-col justify-end bg-[#1a1814]/90 p-5 backdrop-blur-[2px] opacity-0 translate-y-4 pointer-events-none transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                    <span className="home-card-overlay-label" style={{ color: "var(--course-accent)" }}>Scheda del percorso</span>
                    <p>{topic.homeHoverDescription}</p>
                    <div className="home-card-keywords">
                      {topic.keywords.slice(0, 5).map((keyword) => <span key={keyword}>{keyword}</span>)}
                    </div>
                  </div>
                </div>

                <div className="home-card-lower p-5">
                  <p className="home-card-description">{topic.homeDescription}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
