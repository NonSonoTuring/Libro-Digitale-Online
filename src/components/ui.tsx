import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { QuizItem, VisualStyle } from "@/data/types";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/*  Contesto di stile visivo                                            */
/* ------------------------------------------------------------------ */
export const StyleContext = createContext<VisualStyle>("technical");
export const useVisualStyle = () => useContext(StyleContext);

/* ------------------------------------------------------------------ */
/*  Etichette                                                           */
/* ------------------------------------------------------------------ */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[11px] uppercase tracking-[0.18em] text-accent", className)}>
      {children}
    </span>
  );
}

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-accent", className)} aria-hidden>
      <span className="h-px flex-1 bg-rule" />
      <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
        <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="currentColor" opacity="0.9" />
      </svg>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Figura — cornice bianca uniforme, senza ombre                       */
/* ------------------------------------------------------------------ */
interface FigureProps {
  n: string;
  caption: ReactNode;
  children: ReactNode;
  bleed?: boolean;
  className?: string;
}

export function Figure({ n, caption, children, className }: FigureProps) {
  const style = useVisualStyle();
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("my-9", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-sm border-2 border-white",
          style === "technical" ? "grid-paper" : "bg-paper-2",
        )}
      >
        <div className="relative overflow-hidden rounded-[inherit]">{children}</div>
      </div>
      <figcaption className="mt-3 flex gap-3 text-[13.5px] leading-relaxed text-ink-2">
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-accent pt-[3px]">
          Fig. {n}
        </span>
        <span>{caption}</span>
      </figcaption>
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Blocchi didattici                                                   */
/* ------------------------------------------------------------------ */
function Block({
  label,
  title,
  children,
  tone = "accent",
}: {
  label: string;
  title?: ReactNode;
  children: ReactNode;
  tone?: "accent" | "neutral";
}) {
  return (
    <aside
      className={cn(
        "my-7 rounded-r-md border-l-2 pl-5 pr-5 py-4",
        tone === "accent" ? "border-accent bg-accent/[0.06]" : "border-ink-3 bg-paper-2/80",
      )}
    >
      <div className="flex items-baseline gap-3 mb-1.5">
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.18em]",
            tone === "accent" ? "text-accent" : "text-ink-3",
          )}
        >
          {label}
        </span>
        {title && <span className="font-display font-semibold text-[1.05rem]">{title}</span>}
      </div>
      <div className="prose-book text-[0.98rem] leading-relaxed [&>p]:mb-2">{children}</div>
    </aside>
  );
}

export const Definition = ({ term, children }: { term: ReactNode; children: ReactNode }) => (
  <Block label="Definizione" title={term}>
    {children}
  </Block>
);

export const Theorem = ({ name, children }: { name: ReactNode; children: ReactNode }) => (
  <Block label="Teorema" title={name}>
    <div className="italic">{children}</div>
  </Block>
);

export const Note = ({ title, children }: { title?: ReactNode; children: ReactNode }) => (
  <Block label="Nota" title={title} tone="neutral">
    {children}
  </Block>
);

export const History = ({ title, children }: { title?: ReactNode; children: ReactNode }) => (
  <Block label="Cenni storici" title={title} tone="neutral">
    {children}
  </Block>
);

export const Example = ({ title, children }: { title?: ReactNode; children: ReactNode }) => (
  <Block label="Esempio" title={title}>
    {children}
  </Block>
);

/* Termine di glossario con tooltip */
export function Term({ def, children }: { def: string; children: ReactNode }) {
  return (
    <span className="relative group inline-block">
      <span className="underline decoration-dotted decoration-accent underline-offset-4 cursor-help">
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 w-64 -translate-x-1/2 rounded-md border border-rule bg-paper px-3 py-2 text-[13px] leading-snug text-ink-2 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 font-body not-italic"
      >
        <span className="block font-mono text-[10px] uppercase tracking-wider text-accent mb-1">Glossario</span>
        {def}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabella                                                             */
/* ------------------------------------------------------------------ */
export function DataTable({
  head,
  rows,
  caption,
  highlightRow,
  numeric = true,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  caption?: ReactNode;
  highlightRow?: number;
  numeric?: boolean;
}) {
  return (
    <div className="my-7 overflow-x-auto">
      <table className="w-full text-[0.95rem] border-collapse">
        <thead>
          <tr className="border-b-2 border-ink/70">
            {head.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "py-2 pr-4 text-left font-display font-semibold text-[0.95rem]",
                  numeric && i > 0 && "text-right",
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-rule transition-colors hover:bg-accent/[0.06]",
                highlightRow === i && "bg-accent/10",
              )}
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={cn(
                    "py-2 pr-4 align-top",
                    numeric && j > 0 && "text-right font-mono text-[0.85rem] tabular-nums",
                    !numeric && "text-[0.9rem] leading-relaxed text-ink-2 first:text-ink first:font-medium",
                  )}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <p className="mt-2 text-[13px] text-ink-3">{caption}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Controlli interattivi                                               */
/* ------------------------------------------------------------------ */
export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format = (v: number) => v.toFixed(2),
}: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1.5">
        <span className="text-[13px] text-ink-2">{label}</span>
        <span className="font-mono text-[12px] text-accent tabular-nums">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[12.5px] font-mono tracking-wide transition-all duration-200",
        active
          ? "border-accent bg-accent text-paper shadow-[0_6px_16px_-8px_var(--accent)]"
          : "border-rule bg-paper text-ink-2 hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Button({
  onClick,
  children,
  variant = "primary",
  className,
  disabled,
}: {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 disabled:opacity-40",
        variant === "primary"
          ? "bg-ink text-paper hover:bg-accent"
          : "border border-rule text-ink-2 hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-rule/80 bg-paper/70 backdrop-blur px-5 py-4", className)}>{children}</div>
  );
}

export function Readout({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">{label}</span>
      <span className="font-mono text-[13px] tabular-nums text-ink">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sintesi e verifica                                                  */
/* ------------------------------------------------------------------ */
export function Takeaways({ items }: { items: string[] }) {
  return (
    <section className="mt-14 rounded-md border border-rule bg-paper-2/70 p-6 md:p-8">
      <Eyebrow>In sintesi</Eyebrow>
      <h3 className="mt-1 font-display text-2xl font-semibold">Che cosa portare con sé</h3>
      <ul className="mt-5 space-y-3">
        {items.map((t, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex gap-3 text-[0.98rem] leading-relaxed"
          >
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
            <span>{t}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function Quiz({ items }: { items: QuizItem[] }) {
  return (
    <section className="mt-10">
      <Eyebrow>Verifica</Eyebrow>
      <h3 className="mt-1 font-display text-2xl font-semibold">Mettiti alla prova</h3>
      <div className="mt-5 space-y-5">
        {items.map((q, i) => (
          <QuizCard key={i} item={q} index={i + 1} />
        ))}
      </div>
    </section>
  );
}

function QuizCard({ item, index }: { item: QuizItem; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === item.answer;
  return (
    <div className="rounded-md border border-rule bg-paper p-5">
      <p className="font-body text-[1.02rem] leading-relaxed">
        <span className="font-mono text-xs text-accent mr-2">Q{index}</span>
        {item.question}
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {item.options.map((opt, j) => {
          const isPicked = picked === j;
          const isAnswer = picked !== null && j === item.answer;
          return (
            <button
              key={j}
              type="button"
              onClick={() => setPicked(j)}
              className={cn(
                "text-left rounded-md border px-3.5 py-2.5 text-[14px] transition-all duration-200",
                picked === null && "border-rule hover:border-accent hover:bg-accent/[0.06]",
                isAnswer && "border-emerald-700/60 bg-emerald-700/10 text-ink",
                isPicked && !correct && "border-red-700/50 bg-red-700/10",
                picked !== null && !isAnswer && !isPicked && "border-rule opacity-60",
              )}
            >
              <span className="font-mono text-[11px] text-ink-3 mr-2">{String.fromCharCode(65 + j)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {picked !== null && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 text-[14px] leading-relaxed text-ink-2 overflow-hidden"
          >
            <span className={cn("font-mono text-[11px] uppercase tracking-wider mr-2", correct ? "text-emerald-700" : "text-red-700")}>
              {correct ? "Esatto" : "Non proprio"}
            </span>
            {item.explanation}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
