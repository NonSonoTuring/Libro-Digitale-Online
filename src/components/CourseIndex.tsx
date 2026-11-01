import { motion } from "framer-motion";
import type { Topic } from "../data/topics";

export function CourseIndex({ topic, onHome, onOpenChapter }: { topic: Topic; onHome: () => void; onOpenChapter: (id: string) => void }) {
  return <div className="index-page">
    <button className="back-link" onClick={onHome}>← Tutti i corsi</button>
    <div className={`index-cover ${topic.style}`}><img src={topic.cover} alt={`Copertina: ${topic.title}`} /><div><span>Corso {topic.numeral}</span><h1>{topic.title}</h1><p>{topic.subtitle}</p></div></div>
    <section className="index-description"><span className="eyebrow">{topic.discipline}</span><p>{topic.abstract}</p><div className="index-facts"><span><small>Livello</small>{topic.level}</span><span><small>Durata</small>{topic.hours}</span><span><small>Capitoli</small>{topic.chapters.length}</span></div>
      <div className="prerequisites"><h2>Prerequisiti</h2><ul>{topic.prerequisites.map((p)=><li key={p}>{p}</li>)}</ul></div>
    </section>
    <section className="index-chapters"><span className="eyebrow">Indice</span><h2>Capitoli</h2><ol>{topic.chapters.map((c,i)=><motion.li key={c.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}><button onClick={()=>onOpenChapter(c.id)}><span className="index-number">0{i+1}</span><span><strong>{c.title}</strong><small>{c.sections.join(" · ")}</small></span><span className="index-minutes">{c.minutes} min →</span></button></motion.li>)}</ol></section>
    <section className="index-references"><span className="eyebrow">Letture</span><h2>Riferimenti</h2><ol>{topic.references.map((reference) => <li key={reference}>{reference}</li>)}</ol></section>
  </div>;
}
