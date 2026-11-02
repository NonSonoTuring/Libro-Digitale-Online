import { useEffect, useState, type ComponentType } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Chapter, Topic } from "../data/topics";
import chapterMeta from "../data/chapter-meta.json";
import { StyleContext } from "./ui";

type MdxModule = { default: ComponentType<any> };
const chapterSources = import.meta.glob<MdxModule>("../contenuti/argomenti/**/capitolo.mdx");
const EASE = [0.22, 1, 0.36, 1] as const;

export function ChapterPage({ topic, chapter, onIndex, onOpenChapter }: {
  topic: Topic; chapter: Chapter; onIndex: () => void; onOpenChapter: (id: string) => void;
}) {
  const [Content, setContent] = useState<ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [components, setComponents] = useState<Record<string, ComponentType<any>> | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const chapters = topic.chapters;
  const index = chapters.findIndex((item) => item.id === chapter.id);
  const meta = (chapterMeta as Record<string, Record<string, { subtitle: string; epigraph: { text: string; author: string } | null }>>)[topic.id]?.[chapter.id];

  useEffect(() => {
    let cancelled = false;
    setContent(null);
    setComponents(null);
    setLoadError(false);
    const suffix = `/argomenti/${topic.id}/capitoli/${chapter.id}/capitolo.mdx`;
    const key = Object.keys(chapterSources).find((source) => source.endsWith(suffix));
    const loader = key ? chapterSources[key] : undefined;
    if (!loader) { setLoadError(true); return; }
    const componentLoader = topic.id === "reti-neurali" ? () => import("./content/neural") : topic.id === "il-cubo" ? () => import("./content/cube") : () => import("./content/painting");
    Promise.all([loader(), componentLoader()]).then(([module, componentModule]) => {
      if (!cancelled) {
        setContent(() => module.default);
        setComponents(componentModule.mdxComponents as Record<string, ComponentType<any>>);
      }
    }).catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, [topic.id, chapter.id]);

  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  return <StyleContext.Provider value={topic.style}>
    <motion.div className="reading-progress" style={{ scaleX: progress }} />
    <div className="chapter-page">
      <button className="back-link" onClick={onIndex}>← Indice del corso</button>
      <header className="chapter-heading">
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="chapter-breadcrumbs"><span>Corso {topic.numeral} · {topic.title}</span><i>/</i><span>Capitolo {index + 1} di {chapters.length}</span></motion.nav>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.06 }} className="chapter-title-row"><span className="chapter-numeral">{index + 1}</span><div><h1>{chapter.title}</h1>{meta?.subtitle && <p className="chapter-subtitle">{meta.subtitle}</p>}</div></motion.div>
        {meta?.epigraph && <motion.blockquote initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.16 }} className="chapter-epigraph"><p>«{meta.epigraph.text}»</p><cite>{meta.epigraph.author}</cite></motion.blockquote>}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="chapter-meta"><span>{chapter.sections.length} sezioni</span><span>{chapter.minutes} min di lettura</span><span>{topic.styleLabel}</span></motion.div>
      </header>
      <article className="chapter-prose prose-book" style={{ counterReset: `chapter ${index + 1} section 0` }}>
        {Content && components ? <Content components={components} /> : loadError ? <p>Non è stato possibile caricare questo capitolo.</p> : <p className="loading-chapter">Caricamento del capitolo…</p>}
      </article>
      <nav className="chapter-navigation">
        <button onClick={previous ? () => onOpenChapter(previous.id) : onIndex}><small>{previous ? "Capitolo precedente" : "Indice del corso"}</small><strong>← {previous?.title ?? topic.title}</strong></button>
        <button onClick={next ? () => onOpenChapter(next.id) : onIndex}><small>{next ? "Capitolo successivo" : "Fine del corso"}</small><strong>{next?.title ?? "Torna all'indice"} →</strong></button>
      </nav>
    </div>
  </StyleContext.Provider>;
}
