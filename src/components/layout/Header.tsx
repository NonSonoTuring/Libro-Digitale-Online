import { AnimatePresence, motion } from "framer-motion";
import type { Chapter, Topic } from "../../data/topics";

export function Header({ theme, topic, chapter, onHome, onCourses, onToggleTheme }: {
  theme: "light" | "dark"; topic?: Topic; chapter?: Chapter;
  onHome: () => void; onCourses: () => void; onToggleTheme: () => void;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={onHome} aria-label="Torna alla home">
          <span className="brand-name">Lectio</span><span className="brand-subtitle">quaderni interattivi</span>
        </button>
        <nav className="breadcrumbs" aria-label="Percorso">
          <AnimatePresence mode="wait">
            {topic && <motion.button key={topic.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onClick={onHome}>{topic.numeral} · {topic.title}</motion.button>}
            {chapter && <motion.span key={chapter.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}> / {chapter.title}</motion.span>}
          </AnimatePresence>
        </nav>
        <div className="header-actions">
          <button className="courses-button" onClick={onCourses}>Corsi</button>
          <button className="theme-button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"} title={theme === "dark" ? "Giorno" : "Notte"}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0, scale: .6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: .6 }} transition={{ duration: .3 }}>
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}
function SunIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>; }
function MoonIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>; }
