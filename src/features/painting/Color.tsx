import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Chip, Panel, Readout, Slider } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Cerchio cromatico                                                   */
/* ------------------------------------------------------------------ */
const HUE_NAMES: Record<number, string> = {
  0: "rosso",
  30: "arancio",
  60: "giallo",
  90: "giallo-verde",
  120: "verde",
  150: "verde-acqua",
  180: "ciano",
  210: "azzurro",
  240: "blu",
  270: "viola",
  300: "magenta",
  330: "carminio",
};
const hueName = (h: number) => HUE_NAMES[((Math.round(h / 30) * 30) % 360 + 360) % 360];

const SCHEMES = {
  comp: { name: "Complementare", offsets: [0, 180] },
  split: { name: "Complementari divisi", offsets: [0, 150, 210] },
  triad: { name: "Triade", offsets: [0, 120, 240] },
  analog: { name: "Analoghi", offsets: [-30, 0, 30] },
  tetrad: { name: "Tetrade", offsets: [0, 90, 180, 270] },
} as const;
type Scheme = keyof typeof SCHEMES;

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [200 + r * Math.cos(a), 200 + r * Math.sin(a)];
};
function wedge(r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = polar(r1, a0);
  const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1);
  const [x3, y3] = polar(r0, a0);
  return `M${x0},${y0} A${r1},${r1} 0 0 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 0 0 ${x3},${y3} Z`;
}

export function ColorWheel() {
  const [hue, setHue] = useState(30);
  const [scheme, setScheme] = useState<Scheme>("comp");
  const hues = SCHEMES[scheme].offsets.map((o) => ((hue + o) % 360 + 360) % 360);
  const rings = [
    { r0: 128, r1: 170, l: 50, s: 70 },
    { r0: 90, r1: 126, l: 70, s: 60 },
    { r0: 56, r1: 88, l: 32, s: 55 },
  ];
  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-4 items-center">
      <svg viewBox="0 0 400 400" className="w-full block max-w-sm mx-auto">
        {rings.map((ring, ri) =>
          Array.from({ length: 24 }, (_, i) => {
            const h = i * 15;
            const sel = hues.includes(h);
            return (
              <path
                key={`${ri}-${i}`}
                d={wedge(ring.r0, ring.r1, h - 7.5 + 0.4, h + 7.5 - 0.4)}
                fill={`hsl(${h} ${ring.s}% ${ring.l}%)`}
                stroke={sel ? "var(--ink)" : "none"}
                strokeWidth={sel ? 1.5 : 0}
                opacity={sel || ri > 0 ? 1 : 0.92}
                onClick={() => setHue(h)}
                style={{ cursor: "pointer" }}
              />
            );
          }),
        )}
        {/* divisione caldi / freddi */}
        <line {...(() => { const a = polar(178, 90); const b = polar(178, 270); return { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }; })()} stroke="var(--ink-3)" strokeDasharray="4 4" />
        <text {...(() => { const p = polar(188, 0); return { x: p[0] + 40, y: p[1] + 4 }; })()} fontSize="10" className="font-mono" fill="var(--ink-3)">
          caldi
        </text>
        <text {...(() => { const p = polar(188, 180); return { x: p[0] - 40, y: p[1] + 4 }; })()} fontSize="10" className="font-mono" fill="var(--ink-3)" textAnchor="end">
          freddi
        </text>
        {/* poligono dello schema */}
        <motion.polygon
          animate={{ points: hues.map((h) => polar(149, h).join(",")).join(" ") }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.5}
          strokeDasharray={hues.length === 2 ? "0" : "0"}
        />
        {hues.map((h, i) => {
          const [x, y] = polar(149, h);
          return (
            <motion.circle key={i} animate={{ cx: x, cy: y }} transition={{ type: "spring", stiffness: 120, damping: 18 }} r={i === 0 ? 9 : 6.5} fill={`hsl(${h} 70% 50%)`} stroke="var(--paper)" strokeWidth={2.5} />
          );
        })}
        <text x={200} y={196} textAnchor="middle" fontSize="12" className="font-display" fill="var(--ink-2)" fontStyle="italic">
          {hueName(hue)}
        </text>
        <text x={200} y={212} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--ink-3)">
          {hue}°
        </text>
      </svg>
      <div className="px-5 py-5 md:pr-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(SCHEMES) as Scheme[]).map((k) => (
            <Chip key={k} active={scheme === k} onClick={() => setScheme(k)}>
              {SCHEMES[k].name}
            </Chip>
          ))}
        </div>
        <Slider label="tinta di partenza" value={hue} min={0} max={345} step={15} onChange={setHue} format={(v) => `${v}°`} />
        <div className="mt-4 flex gap-2">
          {hues.map((h, i) => (
            <motion.div key={i} layout className="flex-1 rounded-md overflow-hidden border border-rule">
              <div className="h-14" style={{ background: `hsl(${h} 70% 50%)` }} />
              <div className="h-5" style={{ background: `linear-gradient(90deg, hsl(${h} 60% 70%), hsl(${h} 55% 32%))` }} />
              <div className="px-2 py-1.5 bg-paper">
                <div className="font-mono text-[10px] text-ink-3">{h}°</div>
                <div className="text-[12px] text-ink">{hueName(h)}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
          Fai clic su uno spicchio per cambiare la tinta dominante; il poligono mostra le relazioni dello schema scelto. Anello esterno: tinta pura; mediano: tinte schiarite; interno: tinte scurite.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Le tre dimensioni del colore                                        */
/* ------------------------------------------------------------------ */
function hslToHex(h: number, s: number, l: number) {
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return "#" + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

export function ColorLab() {
  const [h, setH] = useState(35);
  const [s, setS] = useState(62);
  const [l, setL] = useState(48);
  const color = `hsl(${h}, ${s}%, ${l}%)`;
  const strip = (css: string) => <div className="h-4 rounded-sm border border-rule" style={{ background: css }} />;
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-5 p-5">
      <div>
        <motion.div animate={{ backgroundColor: color }} className="aspect-square rounded-md border border-rule shadow-inner" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Readout label="hsl" value={`${h}, ${s}%, ${l}%`} />
          <Readout label="hex" value={hslToHex(h, s, l)} />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Slider label={<span><strong>Tinta</strong> (hue) — la «famiglia» del colore</span>} value={h} min={0} max={360} step={1} onChange={setH} format={(v) => `${v}°`} />
          <div className="mt-1.5">{strip(`linear-gradient(90deg, ${[0, 60, 120, 180, 240, 300, 360].map((x) => `hsl(${x} ${s}% ${l}%)`).join(",")})`)}</div>
        </div>
        <div>
          <Slider label={<span><strong>Saturazione</strong> (croma) — purezza, distanza dal grigio</span>} value={s} min={0} max={100} step={1} onChange={setS} format={(v) => `${v}%`} />
          <div className="mt-1.5">{strip(`linear-gradient(90deg, hsl(${h} 0% ${l}%), hsl(${h} 100% ${l}%))`)}</div>
        </div>
        <div>
          <Slider label={<span><strong>Luminosità</strong> (valore) — quanta luce riflette</span>} value={l} min={0} max={100} step={1} onChange={setL} format={(v) => `${v}%`} />
          <div className="mt-1.5">{strip(`linear-gradient(90deg, hsl(${h} ${s}% 0%), hsl(${h} ${s}% 50%), hsl(${h} ${s}% 100%))`)}</div>
        </div>
        <p className="text-[12.5px] text-ink-2 leading-relaxed">
          Nel sistema di Munsell le tre dimensioni si chiamano <em>hue</em>, <em>value</em> e <em>chroma</em>; il pittore le governa separatamente: un colore può cambiare valore senza cambiare tinta, e viceversa.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contrasto simultaneo                                                */
/* ------------------------------------------------------------------ */
const PRESETS = {
  value: { name: "valore", left: "#1f1c19", right: "#e9e2d4", sample: "#8a8278", note: "Lo stesso grigio sembra più chiaro su fondo scuro e più scuro su fondo chiaro." },
  hue: { name: "tinta", left: "hsl(215, 55%, 42%)", right: "hsl(28, 70%, 50%)", sample: "hsl(0, 0%, 55%)", note: "Un grigio neutro vira verso il complementare dello sfondo: appare caldo sul blu, freddo sull'arancio." },
  chroma: { name: "saturazione", left: "hsl(30, 90%, 55%)", right: "hsl(30, 12%, 55%)", sample: "hsl(30, 40%, 55%)", note: "Accanto a un colore molto saturo lo stesso campione sembra spento; accanto a uno grigio sembra vivo." },
};
type Preset = keyof typeof PRESETS;

export function SimultaneousContrast() {
  const [p, setP] = useState<Preset>("hue");
  const [reveal, setReveal] = useState(false);
  const P = PRESETS[p];
  return (
    <div>
      <div className="relative grid grid-cols-2 h-64">
        <motion.div animate={{ backgroundColor: P.left }} className="flex items-center justify-center">
          <motion.div animate={{ backgroundColor: P.sample }} className="h-20 w-20 rounded-sm" />
        </motion.div>
        <motion.div animate={{ backgroundColor: P.right }} className="flex items-center justify-center">
          <motion.div animate={{ backgroundColor: P.sample }} className="h-20 w-20 rounded-sm" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ scaleX: reveal ? 1 : 0, backgroundColor: P.sample }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-1/2 h-20 -translate-y-1/2 -translate-x-1/2 origin-center"
          style={{ width: "calc(50% + 80px)" }}
        />
      </div>
      <Panel className="flex flex-wrap items-center gap-2">
        {(Object.keys(PRESETS) as Preset[]).map((k) => (
          <Chip key={k} active={p === k} onClick={() => { setP(k); setReveal(false); }}>
            contrasto di {PRESETS[k].name}
          </Chip>
        ))}
        <Button variant="ghost" className="ml-auto" onClick={() => setReveal((r) => !r)}>
          {reveal ? "Nascondi" : "Rivela: sono identici"}
        </Button>
        <p className="w-full text-[12.5px] text-ink-2 leading-relaxed">{P.note}</p>
      </Panel>
    </div>
  );
}
