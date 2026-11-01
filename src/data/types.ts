import type { ReactNode } from "react";

export type VisualStyle = "technical" | "solid" | "sketch";

export interface QuizItem {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface SectionDef {
  id: string;
  title: string;
  body: ReactNode;
}

export interface ChapterDef {
  id: string;
  title: string;
  subtitle: string;
  epigraph?: { text: string; author: string };
  minutes: number;
  sections: SectionDef[];
  takeaways: string[];
  quiz: QuizItem[];
}

export interface Topic {
  id: string;
  numeral: string;
  title: string;
  subtitle: string;
  discipline: string;
  level: string;
  hours: string;
  abstract: string;
  cover: string;
  accent: { light: string; dark: string };
  style: VisualStyle;
  styleLabel: string;
  keywords: string[];
  prerequisites: string[];
  references?: string[];
  chapters: ChapterDef[];
}
