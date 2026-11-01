import katex from "katex";
import { useMemo } from "react";

interface InlineProps {
  children: string;
}

/** Formula in linea: <M>{"\\sigma(z)"}</M> */
export function M({ children }: InlineProps) {
  const html = useMemo(
    () =>
      katex.renderToString(children, {
        throwOnError: false,
        output: "html",
        displayMode: false,
        strict: "ignore",
      }),
    [children],
  );
  return <span className="whitespace-nowrap" dangerouslySetInnerHTML={{ __html: html }} />;
}

interface DisplayProps {
  tex: string;
  label?: string;
  note?: string;
}

/** Formula centrata con eventuale numerazione a margine. */
export function Eq({ tex, label, note }: DisplayProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        throwOnError: false,
        output: "html",
        displayMode: true,
        strict: "ignore",
      }),
    [tex],
  );
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="min-w-0 flex-1 py-2 px-4 rounded-md bg-paper-2/70 border border-rule/70">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {note && (
          <p className="mt-1 text-center font-mono text-[11px] uppercase tracking-wider text-ink-3">{note}</p>
        )}
      </div>
      {label && (
        <span className="shrink-0 font-mono text-xs text-ink-3 tabular-nums">({label})</span>
      )}
    </div>
  );
}
