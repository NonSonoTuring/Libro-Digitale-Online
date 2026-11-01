import { motion } from "framer-motion";

const C = 240;
const PHI = (1 + Math.sqrt(5)) / 2;
function spiral(): string {
  const b = Math.log(PHI) / (Math.PI / 2), a = 3.4, pts: string[] = [];
  for (let i = 0; i <= 260; i++) {
    const t = (i / 260) * Math.PI * 4, r = a * Math.exp(b * t);
    const x = C - 40 + r * Math.cos(t + Math.PI), y = C + 20 + r * Math.sin(t + Math.PI);
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}
const SPIRAL = spiral();
const NET = { cols: [[-30, 0, 30], [-45, -15, 15, 45], [-15, 15]], x0: 318, dx: 48, y0: 150 };
const ISO = (x: number, y: number, z: number, s = 30, cx = 126, cy = 352): [number, number] => [cx + (x - z) * 0.866 * s, cy + (x + z) * 0.5 * s - y * s];
const CUBE_PTS: [number, number, number][] = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE_PTS.push([x, y, z]);
const draw = (delay: number, duration = 1.6) => ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { pathLength: { delay, duration, ease: "easeInOut" as const }, opacity: { delay, duration: .3 } } });

export function Frontispiece() {
  return <div className="animate-float"><svg viewBox="0 0 480 500" className="frontispiece-svg" role="img" aria-label="Spirale aurea, rete neurale e cubo: i tre corsi">
    <g className="animate-spin-slow" style={{ transformOrigin: `${C}px ${C}px` }}>
      <motion.circle cx={C} cy={C} r={222} fill="none" stroke="var(--rule)" strokeWidth={1} strokeDasharray="2 6" {...draw(.1, 2)} />
      {Array.from({ length: 72 }, (_, i) => { const a = (i * 5 * Math.PI) / 180, long = i % 6 === 0, r1 = long ? 198 : 204; return <line key={i} x1={C + r1 * Math.cos(a)} y1={C + r1 * Math.sin(a)} x2={C + 212 * Math.cos(a)} y2={C + 212 * Math.sin(a)} stroke={long ? "var(--ink-2)" : "var(--ink-3)"} strokeWidth={long ? 1.2 : .7} />; })}
    </g>
    <motion.circle cx={C} cy={C} r={184} fill="none" stroke="var(--ink)" strokeWidth={.8} {...draw(.3, 2.2)} />
    <motion.circle cx={C} cy={C} r={178} fill="none" stroke="var(--rule)" strokeWidth={.6} {...draw(.4, 2.2)} />
    <motion.line x1={C - 8} y1={C} x2={C + 8} y2={C} stroke="var(--ink-3)" strokeWidth={.8} {...draw(.8, .6)} />
    <motion.line x1={C} y1={C - 8} x2={C} y2={C + 8} stroke="var(--ink-3)" strokeWidth={.8} {...draw(.8, .6)} />
    <motion.path d={SPIRAL} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" {...draw(.9, 2.8)} />
    {NET.cols.slice(0, -1).map((col, ci) => col.map((ya, i) => NET.cols[ci + 1].map((yb, j) => <motion.line key={`${ci}-${i}-${j}`} x1={NET.x0 + ci * NET.dx} y1={NET.y0 + ya} x2={NET.x0 + (ci + 1) * NET.dx} y2={NET.y0 + yb} stroke="var(--ink-3)" strokeWidth={.6} {...draw(1.6 + ci * .3 + i * .05, .8)} />)))}
    {NET.cols.map((col, ci) => col.map((y, i) => <motion.circle key={`n${ci}-${i}`} cx={NET.x0 + ci * NET.dx} cy={NET.y0 + y} r={4.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5 + ci * .3 + i * .06, type: "spring", stiffness: 200, damping: 14 }} style={{ originX: `${NET.x0 + ci * NET.dx}px`, originY: `${NET.y0 + y}px` }} />))}
    <motion.circle cx={NET.x0 + NET.dx} cy={NET.y0 - 15} r={4.5} fill="var(--accent)" className="animate-breathe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }} />
    {CUBE_PTS.map((p, i) => CUBE_PTS.slice(i + 1).map((q, j) => { if (p.filter((c, k) => c !== q[k]).length !== 1) return null; const a = ISO(...p), b = ISO(...q); return <motion.line key={`c${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink)" strokeWidth={1} {...draw(2.2 + i * .05, .7)} />; }))}
    <motion.polygon points={[ISO(-1, 1, -1), ISO(1, 1, -1), ISO(1, 1, 1), ISO(-1, 1, 1)].map((p) => p.join(",")).join(" ")} fill="var(--accent)" initial={{ opacity: 0 }} animate={{ opacity: .18 }} transition={{ delay: 3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 1 }} fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="15" fill="var(--ink-2)"><text x={NET.x0 + NET.dx} y={NET.y0 + 78} textAnchor="middle">I</text><text x={126} y={410} textAnchor="middle">II</text><text x={C - 40} y={C + 118} textAnchor="middle">III</text></motion.g>
    <motion.text x={C} y={C + 250} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="var(--ink-3)" letterSpacing="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4, duration: 1 }}>LEGERE · TANGERE · INTELLEGERE</motion.text>
  </svg></div>;
}
