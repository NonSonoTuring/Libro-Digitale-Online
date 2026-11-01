import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { topics, type Topic } from "../data/topics";
import { Frontispiece } from "./Frontispiece";

export function Home({ theme, onOpenTopic, onOpenChapter }: { theme: "light" | "dark"; onOpenTopic: (id: string) => void; onOpenChapter: (topicId: string, chapterId: string) => void }) {
  const [active, setActive] = useState(0);
  const topic = topics[active];
  const accent = (i: number) => ({ "--accent": topics[i].accent[theme] }) as CSSProperties;
  return <div className="home-content">
    <section className="hero">
      <div className="hero-copy">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}><span className="eyebrow">Quaderni interattivi di studio · Edizione MMXXVI</span></motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1, ease: [.22, 1, .36, 1] }}>Un libro che si lascia <em>toccare</em>.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .25 }}>Tre corsi monografici di livello universitario — le <strong>reti neurali</strong>, la geometria del <strong>cubo</strong>, la teoria del <strong>quadro</strong> — in cui ogni figura è un esperimento: grafici da interrogare, modelli da ruotare, dipinti da sezionare.</motion.p>
      </div>
      <div className="hero-art"><Frontispiece /></div>
    </section>

    <section className="courses" id="corsi">
      <div className="courses-heading"><div><span className="eyebrow">Indice</span><h2>I corsi</h2></div><p>Passa il cursore su un corso per vederne la copertina e il programma; aprilo per consultare l'indice dei capitoli.</p></div>
      <div className="course-grid">
        <ol className="course-list">
          {topics.map((t, i) => <li key={t.id} style={accent(i)}>
            <button type="button" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => { setActive(i); onOpenTopic(t.id); }} className={`course-choice ${i === active ? "is-active" : ""}`}>
              <span className="active-bar" />
              <span className="course-numeral">{t.numeral}</span>
              <span className="course-choice-text"><span className="course-choice-title">{t.title}</span><span className="course-choice-subtitle">{t.subtitle}</span><span className="course-meta-line">{t.discipline}<i>·</i>{t.chapters.length} capitoli<i>·</i>{t.hours}</span></span>
              <span className="course-arrow">→</span>
            </button>
          </li>)}
        </ol>

        <div className="course-preview" style={accent(active)}>
          <AnimatePresence mode="wait">
            <motion.div key={topic.id} className="preview-inner" initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }}>
              <div className={`cover-frame ${topic.style}`}>
                <div className="cover-image-wrap"><motion.img src={topic.cover} alt={`Copertina del corso ${topic.title}`} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [.22, 1, .36, 1] }} /><div className="cover-gradient"/><span className="cover-numeral">{topic.numeral}</span><span className="cover-level">{topic.level}</span></div>
              </div>
              <div className="preview-info">
                <span className="eyebrow">Corso {topic.numeral} · {topic.discipline}</span>
                <h3>{topic.title}</h3><p className="preview-subtitle">{topic.subtitle}</p>
                <p className="preview-abstract">{topic.abstract}</p>
                <div className="preview-metadata"><Meta label="Durata" value={topic.hours}/><Meta label="Capitoli" value={`${topic.chapters.length} · ${topic.chapters.reduce((n,c)=>n+c.sections.length,0)} sezioni`}/><Meta label="Stile visivo" value={topic.styleLabel}/></div>
                <ol className="chapter-list">{topic.chapters.map((c, i) => <li key={c.id}><button type="button" onClick={() => onOpenChapter(topic.id, c.id)}><span className="chapter-number">0{i+1}</span><span className="chapter-title">{c.title}</span><span className="chapter-minutes">{c.minutes} min</span></button></li>)}</ol>
                <div className="keyword-list">{topic.keywords.map((k) => <span key={k}>{k}</span>)}</div>
                <button className="open-index" type="button" onClick={() => onOpenTopic(topic.id)}>Apri l'indice del corso <span>→</span></button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  </div>;
}
function Meta({label,value}:{label:string;value:string}) { return <div><span>{label}</span><strong>{value}</strong></div>; }
