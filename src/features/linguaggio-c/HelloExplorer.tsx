import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Panel, Readout } from "@/components/ui";

const LINES = [
  {
    code: "#include <stdio.h>",
    title: "Direttiva del preprocessore",
    body: "Prima della compilazione vera e propria, il preprocessore copia qui il contenuto dell'header stdio.h: così il compilatore conosce la dichiarazione di printf e di tutte le funzioni di input/output standard.",
  },
  {
    code: "int main(void)",
    title: "La funzione d'ingresso",
    body: "Dichiara main, il punto da cui il sistema operativo avvia il programma. Il tipo int è il codice di uscita restituito al sistema; void indica che la funzione non riceve argomenti dalla riga di comando.",
  },
  {
    code: "{",
    title: "Apre il blocco",
    body: "Una parentesi graffa apre un blocco: un gruppo di istruzioni che vivono insieme e possono dichiarare variabili locali. Ogni blocco ha la propria apertura e la propria chiusura.",
  },
  {
    code: '    printf("Ciao, mondo!\\n");',
    title: "Chiamata di funzione",
    body: "Chiama printf, dichiarata in stdio.h, che scrive sul flusso di output standard (il terminale). L'argomento è una stringa e la sequenza \\n sposta il cursore a capo. Il punto e virgola chiude l'istruzione.",
  },
  {
    code: "    return 0;",
    title: "Codice di uscita",
    body: "Termina main restituendo 0 al sistema operativo. Per convenzione 0 significa «tutto a posto»; un valore diverso segnala un'anomalia e si legge con echo $? nella shell.",
  },
  {
    code: "}",
    title: "Chiude il blocco",
    body: "Chiude il corpo di main: il flusso esce dalla funzione, il programma termina e il suo codice di uscita arriva al sistema operativo.",
  },
];

export function HelloExplorer() {
  const [selected, setSelected] = useState(3);
  const line = LINES[selected];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Listato annotato</div>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">Anatomia di ciao.c</h3>
        </div>
        <span className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-accent">ciao.c</span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1.15fr_1fr]">
        <ol className="overflow-hidden rounded-md border border-rule bg-paper/70">
          {LINES.map((l, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                className={
                  "flex w-full items-baseline gap-3 border-b border-rule/60 px-3 py-2 text-left font-mono text-[13px] transition-colors last:border-b-0 " +
                  (selected === i ? "bg-accent/10 text-ink" : "text-ink-2 hover:bg-accent/[0.06]")
                }
              >
                <span className={"w-5 shrink-0 text-right text-[10px] " + (selected === i ? "text-accent" : "text-ink-3")}>
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-all">{l.code}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="relative min-h-44 rounded-md border border-accent/50 bg-accent/5 p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                Riga {selected + 1} di {LINES.length}
              </div>
              <h4 className="mt-1 font-display text-lg font-semibold text-ink">{line.title}</h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{line.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Panel className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Readout label="Riga selezionata" value={`${selected + 1} / ${LINES.length}`} />
        <Readout label="File" value="ciao.c" />
        <p className="w-full text-xs leading-relaxed text-ink-3">
          Premi una riga del listato per leggerne il ruolo: dall'header al codice di uscita, ogni elemento ha un compito preciso.
        </p>
      </Panel>
    </div>
  );
}
