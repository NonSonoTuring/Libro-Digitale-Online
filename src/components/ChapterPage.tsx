import type { Chapter, Topic } from "../data/topics";
export function ChapterPage({ topic, chapter, onIndex }: { topic: Topic; chapter: Chapter; onIndex: () => void }) {
  return <div className="chapter-placeholder"><button className="back-link" onClick={onIndex}>← Indice del corso</button><span className="eyebrow">Corso {topic.numeral} · {topic.title}</span><h1>{chapter.title}</h1><p>La struttura del capitolo è pronta; i contenuti verranno aggiunti in seguito.</p><ol>{chapter.sections.map((s,i)=><li key={s}><span>0{i+1}</span>{s}</li>)}</ol></div>;
}
