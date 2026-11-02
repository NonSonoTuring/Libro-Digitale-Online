import { useEffect, useState, type CSSProperties } from "react";
import { Header } from "./components/layout/Header";
import { Home } from "./components/Home";
import { CourseIndex } from "./components/CourseIndex";
import { ChapterPage } from "./components/ChapterPage";
import { topics } from "./data/topics";

type Route = { view: "home" } | { view: "topic"; topicId: string } | { view: "chapter"; topicId: string; chapterId: string };
type Theme = "light" | "dark";

function parseRoute(): Route {
  const p = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (p[0] === "t" && p[1] && p[2] === "c" && p[3]) return { view: "chapter", topicId: p[1], chapterId: p[3] };
  if (p[0] === "t" && p[1]) return { view: "topic", topicId: p[1] };
  return { view: "home" };
}

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem("lectio:theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* localStorage può non essere disponibile */ }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [route, setRoute] = useState<Route>(parseRoute);
  const topic = route.view === "home" ? undefined : topics.find((t) => t.id === route.topicId);
  const chapter = route.view === "chapter" && topic ? topic.chapters.find((c) => c.id === route.chapterId) : undefined;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#211c15" : "#f4efe3");
    try { localStorage.setItem("lectio:theme", theme); } catch { /* ignora */ }
  }, [theme]);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const home = () => { window.location.hash = "/"; };
  const openTopic = (id: string) => { window.location.hash = `/t/${id}`; };
  const openChapter = (topicId: string, chapterId: string) => { window.location.hash = `/t/${topicId}/c/${chapterId}`; };
  const goCourses = () => {
    if (route.view === "home") document.getElementById("corsi")?.scrollIntoView({ behavior: "smooth" });
    else { home(); window.setTimeout(() => document.getElementById("corsi")?.scrollIntoView({ behavior: "smooth" }), 250); }
  };
  const accentStyle = (topic ? { "--accent": topic.accent[theme] } : {}) as CSSProperties;

  return (
    <div className="page-shell">
      <div className="sheet" style={accentStyle}>
        <Header theme={theme} topic={topic} chapter={chapter} onHome={home} onCourses={goCourses} onToggleTheme={() => setTheme((v) => v === "dark" ? "light" : "dark")} />
        <main>
          {route.view === "home" || !topic ? (
            <Home theme={theme} onOpenTopic={openTopic} onOpenChapter={openChapter} />
          ) : route.view === "topic" ? (
            <CourseIndex topic={topic} onHome={home} onOpenChapter={(id) => openChapter(topic.id, id)} />
          ) : chapter ? (
            <ChapterPage topic={topic} chapter={chapter} onIndex={() => openTopic(topic.id)} onOpenChapter={(id) => openChapter(topic.id, id)} />
          ) : (
            <Home theme={theme} onOpenTopic={openTopic} onOpenChapter={openChapter} />
          )}
        </main>
      </div>
    </div>
  );
}
