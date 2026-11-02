import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Eq, M } from "../../lib/math";
import { DataTable, Definition, Example, Figure, History, Note, Quiz, Takeaways, Term, Theorem } from "../ui";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function revealBlock(Component: ComponentType<any>): ComponentType<any> {
  return function RevealedBlock(props: any) {
    return <motion.div {...reveal}><Component {...props} /></motion.div>;
  };
}

function RevealSection(props: any) {
  return <motion.section {...reveal} {...props} />;
}

function RevealHeading(props: any) {
  return <motion.h2 {...reveal} {...props} />;
}

function RevealParagraph(props: any) {
  return <motion.p {...reveal} {...props} />;
}

function RevealList(props: any) {
  return <motion.ul {...reveal} {...props} />;
}

function RevealOrderedList(props: any) {
  return <motion.ol {...reveal} {...props} />;
}

function RevealQuote(props: any) {
  return <motion.blockquote {...reveal} {...props} />;
}

export const commonComponents = {
  M, Term, Figure,
  Eq: revealBlock(Eq),
  DataTable: revealBlock(DataTable),
  Definition: revealBlock(Definition),
  Example: revealBlock(Example),
  History: revealBlock(History),
  Note: revealBlock(Note),
  Quiz: revealBlock(Quiz),
  Takeaways: revealBlock(Takeaways),
  Theorem: revealBlock(Theorem),
  section: RevealSection,
  h2: RevealHeading,
  p: RevealParagraph,
  ul: RevealList,
  ol: RevealOrderedList,
  blockquote: RevealQuote,
} satisfies Record<string, ComponentType<any>>;
