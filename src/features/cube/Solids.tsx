import { useState } from "react";
import { motion } from "framer-motion";
import { Chip, Panel, Readout } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Proiezione isometrica                                               */
/* ------------------------------------------------------------------ */
type V3 = [number, number, number];
const iso = ([x, y, z]: V3, s: number, cx: number, cy: number): [number, number] => [
  cx + (x - z) * 0.866 * s,
  cy + (x + z) * 0.5 * s - y * s,
];

const CUBE_V: V3[] = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE_V.push([x, y, z]);
const CUBE_E: [number, number][] = [];
for (let i = 0; i < 8; i++)
  for (let j = i + 1; j < 8; j++) {
    const d = CUBE_V[i].filter((c, k) => c !== CUBE_V[j][k]).length;
    if (d === 1) CUBE_E.push([i, j]);
  }
const OCTA_V: V3[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const OCTA_E: [number, number][] = [];
for (let i = 0; i < 6; i++)
  for (let j = i + 1; j < 6; j++) {
    const dot = OCTA_V[i][0] * OCTA_V[j][0] + OCTA_V[i][1] * OCTA_V[j][1] + OCTA_V[i][2] * OCTA_V[j][2];
    if (dot === 0) OCTA_E.push([i, j]);
  }

/* ------------------------------------------------------------------ */
/*  Dualità cubo–ottaedro                                               */
/* ------------------------------------------------------------------ */
export function IsoDual() {
  const [showOcta, setShowOcta] = useState(true);
  const [showCube, setShowCube] = useState(true);
  const s = 78;
  const cx = 200;
  const cy = 170;
  return (
    <div>
      <svg viewBox="0 0 400 330" className="w-full block max-w-md mx-auto">
        {showCube &&
          CUBE_E.map(([i, j], k) => {
            const a = iso(CUBE_V[i], s, cx, cy);
            const b = iso(CUBE_V[j], s, cx, cy);
            return <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink)" strokeWidth={1.4} opacity={0.8} />;
          })}
        {showCube &&
          CUBE_V.map((v, k) => {
            const p = iso(v, s, cx, cy);
            return <circle key={k} cx={p[0]} cy={p[1]} r={3.2} fill="var(--ink)" />;
          })}
        {showOcta &&
          OCTA_E.map(([i, j], k) => {
            const a = iso(OCTA_V[i], s, cx, cy);
            const b = iso(OCTA_V[j], s, cx, cy);
            return (
              <motion.line
                key={k}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke="var(--accent)"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: k * 0.05 }}
              />
            );
          })}
        {showOcta &&
          OCTA_V.map((v, k) => {
            const p = iso(v, s, cx, cy);
            return <circle key={k} cx={p[0]} cy={p[1]} r={4.5} fill="var(--accent)" stroke="var(--paper)" strokeWidth={1.5} />;
          })}
        <g fontSize="10" className="font-mono" fill="var(--ink-3)">
          <text x={16} y={310}>
            cubo: V=8 E=12 F=6
          </text>
          <text x={384} y={310} textAnchor="end" fill="var(--accent)">
            ottaedro: V=6 E=12 F=8
          </text>
        </g>
      </svg>
      <Panel className="flex flex-wrap items-center gap-2">
        <Chip active={showCube} onClick={() => setShowCube((v) => !v)}>
          cubo
        </Chip>
        <Chip active={showOcta} onClick={() => setShowOcta((v) => !v)}>
          ottaedro duale
        </Chip>
        <span className="ml-auto text-[12.5px] text-ink-2">i vertici dell'ottaedro sono i centri delle facce del cubo</span>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Assi di simmetria                                                   */
/* ------------------------------------------------------------------ */
const AXIS_SETS = {
  face: { label: "facce", n: 3, angle: "90°, 180°, 270°", dirs: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V3[], ext: 1.6 },
  vertex: { label: "vertici", n: 4, angle: "120°, 240°", dirs: [[1, 1, 1], [1, 1, -1], [1, -1, 1], [-1, 1, 1]] as V3[], ext: 1.35 },
  edge: { label: "spigoli", n: 6, angle: "180°", dirs: [[1, 1, 0], [1, -1, 0], [1, 0, 1], [1, 0, -1], [0, 1, 1], [0, 1, -1]] as V3[], ext: 1.5 },
};
type AxisSet = keyof typeof AXIS_SETS;

export function SymmetryAxes() {
  const [set, setSet] = useState<AxisSet>("face");
  const s = 74;
  const cx = 200;
  const cy = 165;
  const A = AXIS_SETS[set];
  const rotations = set === "face" ? 3 * 3 : set === "vertex" ? 4 * 2 : 6;
  return (
    <div>
      <svg viewBox="0 0 400 330" className="w-full block max-w-md mx-auto">
        {CUBE_E.map(([i, j], k) => {
          const a = iso(CUBE_V[i], s, cx, cy);
          const b = iso(CUBE_V[j], s, cx, cy);
          return <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink)" strokeWidth={1.2} opacity={0.6} />;
        })}
        {A.dirs.map((d, k) => {
          const p = iso([d[0] * A.ext, d[1] * A.ext, d[2] * A.ext], s, cx, cy);
          const q = iso([-d[0] * A.ext, -d[1] * A.ext, -d[2] * A.ext], s, cx, cy);
          return (
            <motion.g key={`${set}-${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: k * 0.08 }}>
              <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 4" />
              <circle cx={p[0]} cy={p[1]} r={4} fill="var(--accent)" />
              <circle cx={q[0]} cy={q[1]} r={4} fill="var(--accent)" />
            </motion.g>
          );
        })}
        <text x={200} y={316} textAnchor="middle" fontSize="11" className="font-mono" fill="var(--ink-3)">
          {A.n} assi per i {A.label} · rotazioni di {A.angle}
        </text>
      </svg>
      <Panel className="flex flex-wrap items-center gap-2">
        {(Object.keys(AXIS_SETS) as AxisSet[]).map((k) => (
          <Chip key={k} active={set === k} onClick={() => setSet(k)}>
            assi per i {AXIS_SETS[k].label} ({AXIS_SETS[k].n})
          </Chip>
        ))}
        <div className="ml-auto flex gap-5">
          <Readout label="rotazioni non banali" value={rotations} />
          <Readout label="totale gruppo" value="1 + 9 + 8 + 6 = 24" />
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gli undici sviluppi                                                 */
/* ------------------------------------------------------------------ */
const NETS: { f: string; cells: [number, number][] }[] = [
  { f: "1-4-1", cells: [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [0, 2]] },
  { f: "1-4-1", cells: [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [1, 2]] },
  { f: "1-4-1", cells: [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [2, 2]] },
  { f: "1-4-1", cells: [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [3, 2]] },
  { f: "1-4-1", cells: [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]] },
  { f: "1-4-1", cells: [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]] },
  { f: "2-3-1", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]] },
  { f: "2-3-1", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]] },
  { f: "2-3-1", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]] },
  { f: "2-2-2", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]] },
  { f: "3-3", cells: [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]] },
];
const FAMILIES = ["1-4-1", "2-3-1", "2-2-2", "3-3"];

export function CubeNets() {
  const [fam, setFam] = useState<string | null>(null);
  const c = 16;
  const cw = 5 * c + 20;
  const ch = 3 * c + 30;
  const cols = 6;
  return (
    <div>
      <svg viewBox={`0 0 ${cols * cw} ${2 * ch}`} className="w-full block p-3">
        {NETS.map((net, i) => {
          const ox = (i % cols) * cw + 10;
          const oy = Math.floor(i / cols) * ch + 8;
          const dim = fam !== null && fam !== net.f;
          return (
            <motion.g
              key={i}
              animate={{ opacity: dim ? 0.2 : 1 }}
              onMouseEnter={() => setFam(net.f)}
              onMouseLeave={() => setFam(null)}
              style={{ cursor: "pointer" }}
            >
              {net.cells.map(([x, y], k) => (
                <rect
                  key={k}
                  x={ox + x * c}
                  y={oy + y * c}
                  width={c}
                  height={c}
                  fill={k === 0 ? "var(--accent)" : "color-mix(in oklab, var(--accent) 25%, var(--paper))"}
                  stroke="var(--ink)"
                  strokeWidth={0.8}
                />
              ))}
              <text x={ox} y={oy + 3 * c + 14} fontSize="8" className="font-mono" fill="var(--ink-3)">
                {i + 1} · {net.f}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <Panel className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 mr-1">famiglie</span>
        {FAMILIES.map((f) => (
          <Chip key={f} active={fam === f} onClick={() => setFam(fam === f ? null : f)}>
            {f} · {NETS.filter((n) => n.f === f).length}
          </Chip>
        ))}
        <span className="ml-auto text-[12.5px] text-ink-2">11 sviluppi distinti, a meno di rotazioni e riflessioni</span>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Angoli al vertice: perché solo cinque solidi                        */
/* ------------------------------------------------------------------ */
function polyAt(n: number, L: number, start: number): string {
  let x = 0;
  let y = 0;
  let dir = start;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    x += L * Math.cos((dir * Math.PI) / 180);
    y += L * Math.sin((dir * Math.PI) / 180);
    dir += 360 / n;
  }
  return pts.join(" ");
}

const CASES = [
  { n: 3, k: 3, solid: "tetraedro" },
  { n: 3, k: 4, solid: "ottaedro" },
  { n: 3, k: 5, solid: "icosaedro" },
  { n: 4, k: 3, solid: "cubo" },
  { n: 5, k: 3, solid: "dodecaedro" },
  { n: 3, k: 6, solid: "impossibile: piano" },
];

export function VertexAngles() {
  return (
    <svg viewBox="0 0 660 190" className="w-full block p-2">
      {CASES.map((c, i) => {
        const alpha = 180 - 360 / c.n;
        const sum = alpha * c.k;
        const L = c.n === 5 ? 26 : c.n === 4 ? 30 : 32;
        const ox = 55 + i * 110;
        const oy = 92;
        return (
          <g key={i} transform={`translate(${ox}, ${oy})`}>
            {Array.from({ length: c.k }, (_, j) => (
              <polygon
                key={j}
                points={polyAt(c.n, L, j * alpha)}
                fill="color-mix(in oklab, var(--accent) 22%, var(--paper))"
                stroke="var(--ink)"
                strokeWidth={0.9}
              />
            ))}
            {sum < 360 && (
              <path
                d={`M ${(L * 0.55 * Math.cos((sum * Math.PI) / 180)).toFixed(2)} ${(L * 0.55 * Math.sin((sum * Math.PI) / 180)).toFixed(2)} A ${L * 0.55} ${L * 0.55} 0 ${360 - sum > 180 ? 1 : 0} 1 ${L * 0.55} 0`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}
            <circle r={2.4} fill="var(--ink)" />
            <text y={64} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--ink)">
              {c.k} × {alpha}° = {sum}°
            </text>
            <text y={78} textAnchor="middle" fontSize="10" fill={sum < 360 ? "var(--accent)" : "var(--ink-3)"} className="font-mono">
              {c.solid}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagrammi di Schlegel: ombra del cubo e del tesseratto              */
/* ------------------------------------------------------------------ */
export function Schlegel() {
  const outer = 120;
  const inner = 52;
  const sq = (half: number, cx: number, cy: number) => [
    [cx - half, cy - half],
    [cx + half, cy - half],
    [cx + half, cy + half],
    [cx - half, cy + half],
  ];
  const o = sq(outer / 2, 150, 160);
  const n = sq(inner / 2, 150, 160);
  const s1 = 52;
  const s2 = 24;
  const cx2 = 470;
  const cy2 = 160;
  return (
    <svg viewBox="0 0 640 320" className="w-full block">
      {/* quadrato nel quadrato */}
      <g>
        <polygon points={o.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
        <polygon points={n.map((p) => p.join(",")).join(" ")} fill="color-mix(in oklab, var(--accent) 20%, transparent)" stroke="var(--accent)" strokeWidth={1.5} />
        {o.map((p, i) => (
          <line key={i} x1={p[0]} y1={p[1]} x2={n[i][0]} y2={n[i][1]} stroke="var(--ink-2)" strokeWidth={1} />
        ))}
        <text x={150} y={262} textAnchor="middle" fontSize="11" className="font-mono" fill="var(--ink-2)">
          cubo visto da una faccia
        </text>
        <text x={150} y={278} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--ink-3)">
          6 facce: 1 esterna, 1 interna, 4 trapezi
        </text>
      </g>
      {/* cubo nel cubo */}
      <g>
        {CUBE_E.map(([i, j], k) => {
          const a = iso(CUBE_V[i], s1, cx2, cy2);
          const b = iso(CUBE_V[j], s1, cx2, cy2);
          return <line key={`o${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink)" strokeWidth={1.5} />;
        })}
        {CUBE_E.map(([i, j], k) => {
          const a = iso(CUBE_V[i], s2, cx2, cy2);
          const b = iso(CUBE_V[j], s2, cx2, cy2);
          return <line key={`i${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--accent)" strokeWidth={1.5} />;
        })}
        {CUBE_V.map((v, k) => {
          const a = iso(v, s1, cx2, cy2);
          const b = iso(v, s2, cx2, cy2);
          return <line key={`c${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink-2)" strokeWidth={1} />;
        })}
        <text x={cx2} y={262} textAnchor="middle" fontSize="11" className="font-mono" fill="var(--ink-2)">
          tesseratto visto da una cella
        </text>
        <text x={cx2} y={278} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--ink-3)">
          8 celle: 1 esterna, 1 interna, 6 tronchi di piramide
        </text>
      </g>
      <line x1={320} y1={50} x2={320} y2={280} stroke="var(--rule)" />
    </svg>
  );
}
