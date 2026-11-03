import { motion } from "framer-motion";
import type { Topic } from "../data/topics";

const detailCovers: Record<string, string> = {
  "reti-neurali": `${import.meta.env.BASE_URL}images/topic-covers/neural.jpg`,
  "il-cubo": `${import.meta.env.BASE_URL}images/topic-covers/cube.jpg`,
  "il-quadro": `${import.meta.env.BASE_URL}images/topic-covers/painting-anna-ruysch.jpg`,
  "neoclassicismo": `${import.meta.env.BASE_URL}images/topic-covers/neoclassic.jpg`,
  "linguaggio-c": `${import.meta.env.BASE_URL}images/topic-covers/linguaggio-c.svg`,
};

export function CourseIndex({ topic, onHome, onOpenChapter }: { topic: Topic; onHome: () => void; onOpenChapter: (id: string) => void }) {
  const cover = detailCovers[topic.id] ?? topic.cover;

  return (
    <div className="index-page topic-page book-container">
      <button className="back-link" onClick={onHome}>← Tutti i corsi</button>

      <div className="topic-layout">
        <aside className="topic-sidebar" aria-label={`Copertina del corso ${topic.title}`}>
          <div className={`topic-cover ${topic.style}`}>
            <img src={cover} alt={topic.id === "il-quadro" ? "Natura morta con pesche e uva di Anna Ruysch" : topic.id === "neoclassicismo" ? "Le Tre Grazie di Antonio Canova, immagine di copertina del corso" : `Copertina: ${topic.title}`} />
          </div>
        </aside>

        <div className="topic-main">
          <header className="topic-heading">
            <h1>{topic.title}</h1>
            <p className="topic-subtitle">{topic.subtitle}</p>
            <p className="topic-abstract">{topic.abstract}</p>
          </header>

          <section className="topic-chapters" aria-labelledby="topic-chapters-title">
            <div className="topic-section-label"><span>Indice</span><i /></div>
            <h2 id="topic-chapters-title">Capitoli</h2>
            <ol>
              {topic.chapters.map((chapter, index) => (
                <motion.li
                  key={chapter.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <button onClick={() => onOpenChapter(chapter.id)}>
                    <span className="topic-chapter-number">0{index + 1}</span>
                    <span className="topic-chapter-copy">
                      <strong>{chapter.title}</strong>
                      <small>{chapter.sections.join(" · ")}</small>
                    </span>
                    <span className="topic-chapter-minutes">{chapter.minutes} min <i aria-hidden="true">→</i></span>
                  </button>
                </motion.li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
