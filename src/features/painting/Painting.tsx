import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Chip, Panel, Readout, Slider } from "@/components/ui";
import paintingSrc from "@/assets/images/painting.jpg";

export { paintingSrc };

/* ------------------------------------------------------------------ */
/*  Spirale aurea                                                       */
/* ------------------------------------------------------------------ */
const PHI = (1 + Math.sqrt(5)) / 2;
function spiralPath(x: number, y: number, w: number, h: number, n = 9): string {
  let d = "";
  let dir = 0; // 0 sinistra, 1 alto, 2 destra, 3 basso (quadrato tagliato da quel lato)
  for (let i = 0; i < n; i++) {
    let s: number;
    let arc = "";
    if (dir === 0) {
      s = h;
      arc = `M${x},${y + s} A${s},${s} 0 0 1 ${x + s},${y}`;
      x += s;
      w -= s;
    } else if (dir === 1) {
      s = w;
      arc = `M${x},${y} A${s},${s} 0 0 1 ${x + s},${y + s}`;
      y += s;
      h -= s;
    } else if (dir === 2) {
      s = h;
      arc = `M${x + w},${y} A${s},${s} 0 0 1 ${x + w - s},${y + s}`;
      w -= s;
    } else {
      s = w;
      arc = `M${x + w},${y + h} A${s},${s} 0 0 1 ${x},${y + h - s}`;
      h -= s;
    }
    d += arc + " ";
    dir = (dir + 1) % 4;
  }
  return d;
}
const GOLD_H = 300 / PHI;
const SPIRAL = spiralPath(0, (200 - GOLD_H) / 2, 300, GOLD_H);
const FLIPS = ["scale(1,1)", "scale(-1,1) translate(-300,0)", "scale(1,-1) translate(0,-200)", "scale(-1,-1) translate(-300,-200)"];

const EYE_PATH = "M 15 24 C 40 40, 60 50, 75 80 S 110 120, 141 110 S 210 90, 240 100 S 262 130, 255 160";

const LIGHT_LABELS = [
  { x: 66, y: 64, t: "lume", dx: 18, dy: -14 },
  { x: 80, y: 118, t: "mezzotono", dx: -46, dy: 22 },
  { x: 160, y: 92, t: "terminatore", dx: 14, dy: -16 },
  { x: 100, y: 97, t: "riflesso", dx: 10, dy: 18 },
  { x: 150, y: 136, t: "ombra portata", dx: 16, dy: 18 },
];
const WEIGHTS = [
  { x: 15, y: 24, r: 11, t: "finestra" },
  { x: 72, y: 80, r: 26, t: "brocca" },
  { x: 141, y: 110, r: 24, t: "pere · fuoco" },
  { x: 240, y: 100, r: 21, t: "pane" },
  { x: 255, y: 160, r: 19, t: "panno blu" },
];

type Grid = "thirds" | "golden" | "spiral" | "armature";
type Analysis = "light" | "path" | "weights";
type Filter = "original" | "gray" | "five" | "two";
type Group = "value" | "grid" | "analysis";

interface Props {
  groups?: Group[];
  initialGrid?: Grid[];
  initialAnalysis?: Analysis[];
  initialFilter?: Filter;
}

export function Painting({ groups = ["value", "grid", "analysis"], initialGrid = [], initialAnalysis = [], initialFilter = "original" }: Props) {
  const [grid, setGrid] = useState<Set<Grid>>(new Set(initialGrid));
  const [an, setAn] = useState<Set<Analysis>>(new Set(initialAnalysis));
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [flip, setFlip] = useState(1);

  const toggle = <T,>(set: Set<T>, v: T, setter: (s: Set<T>) => void) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    setter(n);
  };

  const filterCss = filter === "original" ? "none" : filter === "gray" ? "grayscale(1) contrast(1.05)" : `url(#f-${filter})`;
  const lbl = { fill: "#f7f2e9", stroke: "rgba(20,15,10,.75)", strokeWidth: 3, paintOrder: "stroke" as const, fontSize: 7.5 };

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden">
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id="f-five">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0.08 0.3 0.52 0.74 0.95" />
                <feFuncG type="discrete" tableValues="0.08 0.3 0.52 0.74 0.95" />
                <feFuncB type="discrete" tableValues="0.08 0.3 0.52 0.74 0.95" />
              </feComponentTransfer>
            </filter>
            <filter id="f-two">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0.1 0.92" />
                <feFuncG type="discrete" tableValues="0.1 0.92" />
                <feFuncB type="discrete" tableValues="0.1 0.92" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <img
          src={paintingSrc}
          alt="Natura morta con brocca, pere, pane e panno blu"
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500"
          style={{ filter: filterCss }}
        />
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <marker id="pt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#f2d98a" />
            </marker>
          </defs>
          {grid.has("thirds") && (
            <g stroke="#f7f2e9" strokeWidth={0.6} opacity={0.85}>
              <line x1={100} y1={0} x2={100} y2={200} />
              <line x1={200} y1={0} x2={200} y2={200} />
              <line x1={0} y1={66.7} x2={300} y2={66.7} />
              <line x1={0} y1={133.3} x2={300} y2={133.3} />
              {[100, 200].flatMap((x) => [66.7, 133.3].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill="#f7f2e9" stroke="none" />))}
            </g>
          )}
          {grid.has("golden") && (
            <g stroke="#f2d98a" strokeWidth={0.6} strokeDasharray="3 2" opacity={0.95}>
              <line x1={114.6} y1={0} x2={114.6} y2={200} />
              <line x1={185.4} y1={0} x2={185.4} y2={200} />
              <line x1={0} y1={76.4} x2={300} y2={76.4} />
              <line x1={0} y1={123.6} x2={300} y2={123.6} />
              <text x={116} y={8} {...lbl} stroke="none" fill="#f2d98a">
                0,382
              </text>
              <text x={187} y={8} {...lbl} stroke="none" fill="#f2d98a">
                0,618
              </text>
            </g>
          )}
          {grid.has("spiral") && (
            <motion.path
              key={flip}
              d={SPIRAL}
              transform={FLIPS[flip]}
              fill="none"
              stroke="#f2d98a"
              strokeWidth={0.9}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
          )}
          {grid.has("armature") && (
            <g stroke="#f7f2e9" strokeWidth={0.5} opacity={0.8}>
              <line x1={0} y1={0} x2={300} y2={200} />
              <line x1={0} y1={200} x2={300} y2={0} />
              <line x1={300} y1={0} x2={207.7} y2={138.5} />
              <line x1={0} y1={200} x2={92.3} y2={61.5} />
              <line x1={0} y1={0} x2={92.3} y2={138.5} />
              <line x1={300} y1={200} x2={207.7} y2={61.5} />
              {[[92.3, 61.5], [207.7, 61.5], [92.3, 138.5], [207.7, 138.5]].map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r={2.4} fill="#f7f2e9" stroke="none" />
              ))}
            </g>
          )}
          {an.has("light") && (
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1={-4}
                  y1={14 + i * 26}
                  x2={-4 + 62}
                  y2={14 + i * 26 + 34}
                  stroke="#f2d98a"
                  strokeWidth={0.8}
                  className="animate-dash"
                  markerEnd="url(#pt-arrow)"
                />
              ))}
              <circle cx={14} cy={10} r={4} fill="none" stroke="#f2d98a" strokeWidth={0.8} />
              <circle cx={14} cy={10} r={1.6} fill="#f2d98a" />
              {LIGHT_LABELS.map((l) => (
                <g key={l.t}>
                  <circle cx={l.x} cy={l.y} r={1.8} fill="#f2d98a" />
                  <line x1={l.x} y1={l.y} x2={l.x + l.dx} y2={l.y + l.dy} stroke="#f2d98a" strokeWidth={0.5} />
                  <text x={l.x + l.dx + (l.dx < 0 ? -2 : 2)} y={l.y + l.dy + 2.5} textAnchor={l.dx < 0 ? "end" : "start"} {...lbl}>
                    {l.t}
                  </text>
                </g>
              ))}
            </g>
          )}
          {an.has("path") && (
            <g>
              <motion.path
                d={EYE_PATH}
                fill="none"
                stroke="#f7f2e9"
                strokeWidth={0.9}
                strokeDasharray="2 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
              <motion.circle
                r={3.2}
                fill="#f2d98a"
                stroke="#2b2824"
                strokeWidth={0.8}
                style={{ offsetPath: `path("${EYE_PATH}")` }}
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
              />
              {[[15, 24, "1"], [75, 80, "2"], [141, 110, "3"], [240, 100, "4"], [255, 160, "5"]].map(([x, y, n]) => (
                <g key={n}>
                  <circle cx={+x} cy={+y} r={5} fill="#2b2824" opacity={0.75} />
                  <text x={+x} y={+y + 2.4} textAnchor="middle" fontSize={6} fill="#f7f2e9" fontFamily="var(--font-mono)">
                    {n}
                  </text>
                </g>
              ))}
            </g>
          )}
          {an.has("weights") && (
            <g>
              <line x1={150} y1={0} x2={150} y2={200} stroke="#f7f2e9" strokeWidth={0.5} strokeDasharray="2 2" />
              <polygon points="150,196 146,200 154,200" fill="#f7f2e9" />
              {WEIGHTS.map((w, i) => (
                <motion.g key={w.t} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1, type: "spring" }} style={{ originX: `${w.x}px`, originY: `${w.y}px` }}>
                  <circle cx={w.x} cy={w.y} r={w.r} fill="#f2d98a" opacity={0.28} stroke="#f2d98a" strokeWidth={0.6} />
                  <text x={w.x} y={w.y + w.r + 8} textAnchor="middle" {...lbl}>
                    {w.t}
                  </text>
                </motion.g>
              ))}
              <text x={75} y={12} textAnchor="middle" {...lbl}>
                sinistra: massa grande, poco contrasto
              </text>
              <text x={225} y={12} textAnchor="middle" {...lbl}>
                destra: meno massa, colore saturo
              </text>
            </g>
          )}
        </svg>
      </div>
      <Panel className="flex flex-col gap-2.5">
        {groups.includes("value") && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 font-mono text-[11px] uppercase tracking-wider text-ink-3">valori</span>
            {(["original", "gray", "five", "two"] as Filter[]).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f === "original" ? "originale" : f === "gray" ? "scala di grigi" : f === "five" ? "5 valori" : "notan (2 valori)"}
              </Chip>
            ))}
          </div>
        )}
        {groups.includes("grid") && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 font-mono text-[11px] uppercase tracking-wider text-ink-3">griglie</span>
            <Chip active={grid.has("thirds")} onClick={() => toggle(grid, "thirds", setGrid)}>
              terzi
            </Chip>
            <Chip active={grid.has("golden")} onClick={() => toggle(grid, "golden", setGrid)}>
              sezione aurea
            </Chip>
            <Chip active={grid.has("spiral")} onClick={() => toggle(grid, "spiral", setGrid)}>
              spirale
            </Chip>
            {grid.has("spiral") && (
              <Chip onClick={() => setFlip((f) => (f + 1) % 4)}>↻ specchia</Chip>
            )}
            <Chip active={grid.has("armature")} onClick={() => toggle(grid, "armature", setGrid)}>
              armatura
            </Chip>
          </div>
        )}
        {groups.includes("analysis") && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 font-mono text-[11px] uppercase tracking-wider text-ink-3">analisi</span>
            <Chip active={an.has("light")} onClick={() => toggle(an, "light", setAn)}>
              luce e ombre
            </Chip>
            <Chip active={an.has("path")} onClick={() => toggle(an, "path", setAn)}>
              percorso dello sguardo
            </Chip>
            <Chip active={an.has("weights")} onClick={() => toggle(an, "weights", setAn)}>
              pesi visivi
            </Chip>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Retinatura dell'immagine                                            */
/* ------------------------------------------------------------------ */
export function HalftoneImage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const data = useRef<ImageData | null>(null);
  const [ready, setReady] = useState(false);
  const [freq, setFreq] = useState(72);
  const [angle, setAngle] = useState(45);
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.src = paintingSrc;
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = 600;
      off.height = 400;
      const c = off.getContext("2d");
      if (!c) return;
      c.drawImage(img, 0, 0, 600, 400);
      data.current = c.getImageData(0, 0, 600, 400);
      setReady(true);
    };
    const mo = new MutationObserver(() => setThemeTick((t) => t + 1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const px = data.current;
    if (!canvas || !px || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 600 * dpr;
    canvas.height = 400 * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(canvas);
    const ink = cs.getPropertyValue("--ink").trim() || "#2b2824";
    const paper = cs.getPropertyValue("--paper-2").trim() || "#efe8db";
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = ink;
    const g = 600 / freq;
    const th = (angle * Math.PI) / 180;
    const c = Math.cos(th);
    const s = Math.sin(th);
    const lum = (x: number, y: number) => {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const xx = Math.round(x) + dx;
          const yy = Math.round(y) + dy;
          if (xx < 0 || yy < 0 || xx >= 600 || yy >= 400) continue;
          const i = (yy * 600 + xx) * 4;
          sum += 0.2126 * px.data[i] + 0.7152 * px.data[i + 1] + 0.0722 * px.data[i + 2];
          n++;
        }
      return n ? sum / n / 255 : 1;
    };
    for (let u = -520; u <= 520; u += g)
      for (let v = -520; v <= 520; v += g) {
        const x = 300 + u * c - v * s;
        const y = 200 + u * s + v * c;
        if (x < -g || y < -g || x > 600 + g || y > 400 + g) continue;
        const l = lum(Math.min(599, Math.max(0, x)), Math.min(399, Math.max(0, y)));
        const r = (g / 2) * 1.12 * Math.sqrt(1 - l);
        if (r < 0.2) continue;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
  }, [ready, freq, angle, themeTick]);

  return (
    <div>
      <canvas ref={ref} className="block w-full aspect-[3/2]" />
      <Panel className="grid gap-x-6 gap-y-3 md:grid-cols-[1fr_1fr_auto] items-end">
        <Slider label="frequenza del retino (punti per riga)" value={freq} min={24} max={130} step={1} onChange={setFreq} format={(v) => `${v}`} />
        <Slider label="angolo del retino" value={angle} min={0} max={90} step={1} onChange={setAngle} format={(v) => `${v}°`} />
        <Readout label="principio" value="punti più grandi dove il valore è più scuro" />
      </Panel>
    </div>
  );
}
