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

interface EquationTerm {
  symbol: string;
  description: string;
}

interface DisplayProps {
  tex: string;
  note: string;
  terms: EquationTerm[];
}

/** Formula centrata, introdotta dal titolo e seguita dalla legenda dei termini. */
export function Eq({ tex, note, terms }: DisplayProps) {
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
    <figure className="display-equation">
      <figcaption className="display-equation__title">{note}</figcaption>
      <div className="display-equation__formula" dangerouslySetInnerHTML={{ __html: html }} />
      <dl className="display-equation__terms">
        {terms.map((term) => (
          <div className="display-equation__term" key={term.symbol}>
            <dt><M>{term.symbol}</M></dt>
            <dd>{term.description}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
