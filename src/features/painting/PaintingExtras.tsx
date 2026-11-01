export function ValueScale() {
  return (
    <div className="my-6">
      <div className="grid grid-cols-9 overflow-hidden rounded-md border border-rule">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="group relative aspect-[4/5]" style={{ background: `hsl(0 0% ${8 + i * 10.5}%)` }}>
            <span className="absolute bottom-1 left-0 right-0 text-center font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: i < 5 ? "#f0eae0" : "#1a1816" }}>
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-ink-3">
        <span>nero · valore 1</span>
        <span>mezzi toni</span>
        <span>bianco · valore 9</span>
      </div>
    </div>
  );
}

const PALETTES = [
  { name: "Tavolozza di Zorn", note: "Anders Zorn, fine Ottocento", colors: [["#e9e2d4", "bianco"], ["#c9a24a", "ocra gialla"], ["#b73a2a", "vermiglione"], ["#1d1b19", "nero avorio"]] },
  { name: "Terre di Velázquez", note: "bodegones, 1618–1623", colors: [["#e5dccb", "bianco di piombo"], ["#b5894a", "ocra"], ["#6b4a2b", "terra d'ombra"], ["#8a3b2a", "terra rossa"], ["#2a2622", "nero"]] },
  { name: "La nostra natura morta", note: "ocre e terre, un solo accento", colors: [["#d8b66a", "ocra chiara"], ["#9a6a2e", "siena bruciata"], ["#4a3220", "ombra bruciata"], ["#1d1612", "bruno scuro"], ["#2a4a9a", "oltremare"]] },
];

export function Palettes() {
  return (
    <div className="my-7 grid gap-4 sm:grid-cols-3">
      {PALETTES.map((p) => (
        <div key={p.name} className="rounded-md border border-rule bg-paper p-4 halftone-shadow">
          <div className="font-display font-semibold">{p.name}</div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-ink-3">{p.note}</div>
          <div className="mt-3 flex gap-1.5">
            {p.colors.map(([c]) => (
              <div key={c} className="h-10 flex-1 rounded-sm border border-ink/10" style={{ background: c }} />
            ))}
          </div>
          <ul className="plain-list mt-2 space-y-0.5 text-[12px] text-ink-2">
            {p.colors.map(([c, n]) => (
              <li key={c} className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                {n}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
