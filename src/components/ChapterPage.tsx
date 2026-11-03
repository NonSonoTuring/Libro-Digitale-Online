import { useEffect, useState, type ComponentType } from "react";
import type { Chapter, Topic } from "../data/topics";
import chapterMeta from "../data/chapter-meta.json";
import { StyleContext } from "./ui";

type MdxModule = { default: ComponentType<any> };
const chapterSources = import.meta.glob<MdxModule>("../contenuti/argomenti/**/capitolo.mdx");

export function ChapterPage({ topic, chapter, onIndex, onOpenChapter }: {
  topic: Topic; chapter: Chapter; onIndex: () => void; onOpenChapter: (id: string) => void;
}) {
  const [Content, setContent] = useState<ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [components, setComponents] = useState<Record<string, ComponentType<any>> | null>(null);
  const [sectionLinks, setSectionLinks] = useState<{ id: string; title: string }[]>([]);
  const [activeSectionId, setActiveSectionId] = useState("");
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
    const componentLoader = topic.id === "reti-neurali" ? () => import("./content/neural") : topic.id === "il-cubo" ? () => import("./content/cube") : topic.id === "neoclassicismo" ? () => import("./content/neoclassic") : () => import("./content/painting");
    Promise.all([loader(), componentLoader()]).then(([module, componentModule]) => {
      if (!cancelled) {
        setContent(() => module.default);
        setComponents(componentModule.mdxComponents as Record<string, ComponentType<any>>);
      }
    }).catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, [topic.id, chapter.id]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".chapter-prose .book-section[id]"));
    const links = sections.map((section, sectionIndex) => ({
      id: section.id,
      title: chapter.sections[sectionIndex] ?? section.querySelector("h2")?.textContent ?? `Sezione ${sectionIndex + 1}`,
    }));
    setSectionLinks(links);
    if (!sections.length) {
      setActiveSectionId("");
      return;
    }

    setActiveSectionId(sections[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSectionId((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.1, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [Content, chapter.id]);

  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const jumpToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return <StyleContext.Provider value={topic.style}>
    <div className="chapter-page">
      <button className="back-link" onClick={onIndex}>← Indice del corso</button>
      <header className="chapter-heading">
        <nav className="chapter-breadcrumbs"><span>Corso {topic.numeral} · {topic.title}</span><i>/</i><span>Capitolo {index + 1} di {chapters.length}</span></nav>
        <div className="chapter-title-row"><span className="chapter-numeral">{index + 1}</span><div><h1>{chapter.title}</h1>{meta?.subtitle && <p className="chapter-subtitle">{meta.subtitle}</p>}</div></div>
        {meta?.epigraph && <blockquote className="chapter-epigraph"><p>«{meta.epigraph.text}»</p><cite>{meta.epigraph.author}</cite></blockquote>}
        <div className="chapter-meta"><span>{chapter.sections.length} sezioni</span><span>{chapter.minutes} min di lettura</span><span>{topic.styleLabel}</span></div>
      </header>
      <div className="chapter-body-grid">
        <div className="chapter-reading-column">
          <article className="chapter-prose prose-book" style={{ counterReset: `chapter ${index + 1} section 0` }}>
            {Content && components ? <Content components={components} /> : loadError ? <p>Non è stato possibile caricare questo capitolo.</p> : <p className="loading-chapter">Caricamento del capitolo…</p>}
          </article>
          <nav className="chapter-navigation">
            <button onClick={previous ? () => onOpenChapter(previous.id) : onIndex}><small>{previous ? "Capitolo precedente" : "Indice del corso"}</small><strong>← {previous?.title ?? topic.title}</strong></button>
            <button onClick={next ? () => onOpenChapter(next.id) : onIndex}><small>{next ? "Capitolo successivo" : "Fine del corso"}</small><strong>{next?.title ?? "Torna all'indice"} →</strong></button>
          </nav>
        </div>

        <aside className="chapter-toc" aria-label="Indice del capitolo e navigazione">
          <div className="chapter-toc-sticky">
            <section>
              <h2>In questo capitolo</h2>
              <ol className="chapter-toc-sections">
                {sectionLinks.map((section, sectionIndex) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={activeSectionId === section.id ? "is-active" : ""}
                      aria-current={activeSectionId === section.id ? "location" : undefined}
                      onClick={() => jumpToSection(section.id)}
                    >
                      <span>{index + 1}.{sectionIndex + 1}</span>{section.title}
                    </button>
                  </li>
                ))}
              </ol>
            </section>


          </div>
        </aside>
      </div>
    </div>
  </StyleContext.Provider>;
}
