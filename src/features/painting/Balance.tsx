import { useState } from "react";
import { motion } from "framer-motion";
import { Chip, Panel, Readout, Slider } from "@/components/ui";

/** Bilancia del peso visivo: dimensione × distanza dal fulcro, con il contrasto come moltiplicatore. */
export function Balance() {
  const [ls, setLs] = useState(3);
  const [ld, setLd] = useState(0.5);
  const [rs, setRs] = useState(2);
  const [rd, setRd] = useState(0.8);
  const [lDark, setLDark] = useState(false);
  const [rDark, setRDark] = useState(true);

  const weight = (s: number, dark: boolean) => s * s * (dark ? 1.5 : 1);
  const tL = weight(ls, lDark) * ld;
  const tR = weight(rs, rDark) * rd;
  const max = Math.max(tL, tR, 1);
  const diff = (tR - tL) / max;
  const tilt = Math.max(-11, Math.min(11, diff * 14));
  const balanced = Math.abs(diff) < 0.08;

  const W = 600;
  const H = 300;
  const cx = 300;
  const cy = 190;
  const arm = 230;
  const rad = (s: number) => 8 + s * 6;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
        {/* fulcro */}
        <polygon points={`${cx},${cy} ${cx - 22},${cy + 60} ${cx + 22},${cy + 60}`} fill="var(--paper-3)" stroke="var(--ink)" strokeWidth={1.2} />
        <line x1={60} y1={cy + 60} x2={W - 60} y2={cy + 60} stroke="var(--ink)" strokeWidth={1.2} />
        {/* ombra a retino sotto il piano */}
        <pattern id="bal-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="var(--ink)" />
        </pattern>
        <rect x={60} y={cy + 62} width={W - 120} height={14} fill="url(#bal-dots)" opacity={0.35} />
        <motion.g animate={{ rotate: tilt }} transition={{ type: "spring", stiffness: 70, damping: 14 }} style={{ originX: `${cx}px`, originY: `${cy}px` }}>
          <line x1={cx - arm} y1={cy} x2={cx + arm} y2={cy} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
          {[-1, 1].map((side) => {
            const s = side < 0 ? ls : rs;
            const d = side < 0 ? ld : rd;
            const dark = side < 0 ? lDark : rDark;
            const x = cx + side * d * arm;
            const r = rad(s);
            return (
              <g key={side}>
                <line x1={x} y1={cy - 2} x2={x} y2={cy - 10} stroke="var(--ink)" />
                <motion.circle
                  animate={{ cx: x, r }}
                  cy={cy - 10 - r}
                  fill={dark ? "var(--ink)" : "var(--paper)"}
                  stroke="var(--ink)"
                  strokeWidth={1.4}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                />
                <text x={x} y={cy + 20} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--ink-3)">
                  d = {d.toFixed(2)}
                </text>
              </g>
            );
          })}
        </motion.g>
        <text x={cx} y={40} textAnchor="middle" fontSize="12" className="font-display" fontStyle="italic" fill={balanced ? "var(--accent)" : "var(--ink-2)"}>
          {balanced ? "equilibrio" : diff > 0 ? "il lato destro domina" : "il lato sinistro domina"}
        </text>
        <text x={cx} y={58} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--ink-3)">
          momento sinistro {tL.toFixed(1)} · momento destro {tR.toFixed(1)}
        </text>
      </svg>
      <Panel className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        <div className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">lato sinistro</div>
          <Slider label="dimensione" value={ls} min={1} max={5} step={0.1} onChange={setLs} format={(v) => v.toFixed(1)} />
          <Slider label="distanza dal fulcro" value={ld} min={0.1} max={1} step={0.01} onChange={setLd} />
          <Chip active={lDark} onClick={() => setLDark((v) => !v)}>
            alto contrasto di valore (×1,5)
          </Chip>
        </div>
        <div className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">lato destro</div>
          <Slider label="dimensione" value={rs} min={1} max={5} step={0.1} onChange={setRs} format={(v) => v.toFixed(1)} />
          <Slider label="distanza dal fulcro" value={rd} min={0.1} max={1} step={0.01} onChange={setRd} />
          <Chip active={rDark} onClick={() => setRDark((v) => !v)}>
            alto contrasto di valore (×1,5)
          </Chip>
        </div>
        <div className="md:col-span-2 flex gap-6">
          <Readout label="modello" value="peso = area × contrasto · momento = peso × distanza" />
        </div>
      </Panel>
    </div>
  );
}
