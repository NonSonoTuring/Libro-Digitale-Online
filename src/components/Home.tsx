import type { CSSProperties } from "react";
import { topics, type Topic } from "../data/topics";

export function Home({ theme, onOpenTopic, onOpenChapter }: {
  theme: "light" | "dark";
  onOpenTopic: (id: string) => void;
  onOpenChapter: (topicId: string, chapterId: string) => void;
}) {
  const accent = (topic: Topic) => ({ "--course-accent": topic.accent[theme] }) as CSSProperties;
  const chapterTitles = topics.flatMap((topic) => topic.chapters.map((chapter) => chapter.title));
  const ticker = [...chapterTitles, ...chapterTitles];

  return (
    <div className="home-content codex-home">
      <section className="codex-hero" aria-labelledby="home-title">
        <div className="codex-hero-copy">
          <span className="eyebrow">Biblioteca interattiva · Edizione MMXXVI</span>
          <h1 id="home-title">Conoscere è un percorso.<br /><em>Esploralo.</em></h1>
          <p>
            Tre corsi per attraversare le reti neurali, la geometria del cubo e la lettura del quadro.
            Testi, immagini e strumenti interattivi trasformano ogni argomento in un’occasione per osservare,
            provare e capire.
          </p>
          <div className="codex-hero-rule" aria-hidden="true"><span /></div>
        </div>

        <div className="codex-cover-stack" aria-label="Copertine dei tre corsi">
          {topics.map((topic, index) => (
            <button
              key={topic.id}
              type="button"
              className={`codex-cover codex-cover-${index + 1}`}
              style={accent(topic)}
              onClick={() => onOpenTopic(topic.id)}
              aria-label={`Apri il corso: ${topic.title}`}
            >
              <img src={topic.cover} alt={`Copertina: ${topic.title}`} />
              <span>{topic.title}</span>
            </button>
          ))}
          <span className="codex-cover-seal" aria-hidden="true">CODEX</span>
        </div>
      </section>

      <div className="codex-ticker" aria-label="Argomenti dei corsi">
        <div className="codex-ticker-track" aria-hidden="true">
          {ticker.map((title, index) => (
            <span className="codex-ticker-item" key={`${title}-${index}`}>
              {title}<i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <section className="codex-catalog" id="corsi" aria-labelledby="catalog-title">
        <div className="codex-catalog-heading">
          <div>
            <span className="eyebrow">Indice</span>
            <h2 id="catalog-title">I corsi</h2>
          </div>
          <p>Passa su una scheda per esplorarne i contenuti; selezionala per aprire il corso.</p>
        </div>

        <div className="codex-card-grid">
          {topics.map((topic) => (
            <article
              className="codex-card"
              key={topic.id}
              style={accent(topic)}
              onClick={(event) => {
                if (!(event.target as HTMLElement).closest("button")) onOpenTopic(topic.id);
              }}
            >
              <button
                className="codex-card-image"
                type="button"
                onClick={() => onOpenTopic(topic.id)}
                aria-label={`Apri l'indice del corso ${topic.title}`}
              >
                <img src={topic.cover} alt={`Copertina del corso ${topic.title}`} loading="lazy" />
                <span className="codex-card-shade" />
                <span className="codex-card-discipline">{topic.discipline}</span>
                <span className="codex-card-number">{topic.numeral}</span>
              </button>

              <div className="codex-card-main">
                <button
                  className="codex-card-summary"
                  type="button"
                  onClick={() => onOpenTopic(topic.id)}
                  aria-label={`Apri l'indice del corso ${topic.title}`}
                >
                  <span className="codex-card-kicker">Corso {topic.numeral} · {topic.level}</span>
                  <span className="codex-card-title">{topic.title}</span>
                  <span className="codex-card-subtitle">{topic.subtitle}</span>
                  <span className="codex-card-description">{topic.abstract}</span>
                </button>

                <div className="codex-card-details">
                  <div className="codex-card-details-inner">
                    <span className="codex-card-program-label">Contenuti del corso</span>
                    <div className="codex-card-chapters">
                      {topic.chapters.map((chapter, chapterIndex) => (
                        <button
                          className="codex-card-chapter"
                          key={chapter.id}
                          type="button"
                          onClick={() => onOpenChapter(topic.id, chapter.id)}
                        >
                          <i>{String(chapterIndex + 1).padStart(2, "0")}</i><span>{chapter.title}</span><b aria-hidden="true">→</b>
                        </button>
                      ))}
                    </div>
                    <div className="codex-card-keywords">
                      {topic.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                    </div>
                  </div>
                </div>

                <div className="codex-card-footer">
                  <span>{topic.styleLabel}</span>
                  <button type="button" onClick={() => onOpenTopic(topic.id)}>
                    Apri l’indice <b aria-hidden="true">→</b>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
