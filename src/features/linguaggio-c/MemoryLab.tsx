import { useState } from "react";
import { Button, Readout } from "../../components/ui";

export function MemoryLab() {
  const [target, setTarget] = useState<"a" | "b">("a");
  const [values, setValues] = useState({ a: 12, b: 30 });
  const activeAddress = target === "a" ? "A-001" : "B-002";

  const increment = () => {
    setValues((current) => ({ ...current, [target]: current[target] + 1 }));
  };

  const reset = () => {
    setTarget("a");
    setValues({ a: 12, b: 30 });
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Memoria simulata</div>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">Due variabili, un puntatore</h3>
        </div>
        <span className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-accent">int *p</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(["a", "b"] as const).map((name) => (
          <div key={name} className={"rounded-md border p-3 transition-colors " + (target === name ? "border-accent bg-accent/10" : "border-rule bg-paper/70")}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold text-ink">int {name}</span>
              <span className="font-mono text-[10px] text-ink-3">{name === "a" ? "A-001" : "B-002"}</span>
            </div>
            <div className="mt-3 font-display text-3xl tabular-nums text-ink">{values[name]}</div>
            <div className="mt-1 text-xs text-ink-3">valore contenuto</div>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-accent/50 bg-accent/5 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Puntatore p</div>
            <div className="mt-1 font-mono text-lg text-ink">p = &amp;{target}</div>
            <div className="text-xs text-ink-2">p contiene {activeAddress}; *p vale {values[target]}</div>
          </div>
          <Readout label="Valore di *p" value={values[target]} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={increment}>*p = *p + 1</Button>
          <Button variant="ghost" onClick={() => setTarget((current) => current === "a" ? "b" : "a")}>Sposta p</Button>
          <Button variant="ghost" onClick={reset}>Azzera laboratorio</Button>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-ink-3">A-001 e B-002 sono etichette didattiche, non indirizzi reali. Spostare p cambia l'oggetto selezionato; incrementare *p modifica il valore nella cella selezionata.</p>
    </div>
  );
}