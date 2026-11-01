import { useMemo, useState } from "react";
import { Chip, Panel, Readout, Slider } from "@/components/ui";

/** Sfera ombreggiata con un retino di punti: la legge del coseno di Lambert resa a puntini. */
export function HalftoneSphere() {
  const [az, setAz] = useState(135); // azimut della luce, gradi (0 = destra, 90 = alto)
  const [el, setEl] = useState(35); // elevazione (quanto la luce viene "da davanti")
  const [labels, setLabels] = useState(true);
  const [bounce, setBounce] = useState(true);

  const W = 420;
  const H = 360;
  const cx = 210;
  const cy = 160;
  const R = 108;
  const g = 9;

  const L = useMemo(() => {
    const a = (az * Math.PI) / 180;
    const e = (el * Math.PI) / 180;
    return [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)];
  }, [az, el]);

  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    for (let y = cy - R; y <= cy + R; y += g)
      for (let x = cx - R; x <= cx + R; x += g) {
        const nx = (x - cx) / R;
        const ny = -(y - cy) / R;
        const d2 = nx * nx + ny * ny;
        if (d2 > 1) continue;
        const nz = Math.sqrt(1 - d2);
        let v = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
        v = 0.07 + 0.93 * v;
        if (bounce) v += 0.16 * Math.max(0, -ny) * (1 - Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]));
        v = Math.min(1, v);
        const r = (g / 2) * 1.08 * Math.sqrt(1 - v);
        if (r > 0.25) out.push({ x, y, r });
      }
    return out;
  }, [L, bounce]);

  // ombra portata: ellisse sul piano, dal lato opposto alla luce
  const shadow = useMemo(() => {
    const sx = cx - L[0] * R * 0.9;
    const sy = cy + R * 0.92;
    const rx = R * 1.0;
    const ry = R * 0.26 + (1 - Math.abs(L[2])) * 6;
    const out: { x: number; y: number; r: number }[] = [];
    for (let y = sy - ry; y <= sy + ry; y += g)
      for (let x = sx - rx; x <= sx + rx; x += g) {
        const u = (x - sx) / rx;
        const w = (y - sy) / ry;
        const d = Math.sqrt(u * u + w * w);
        if (d > 1) continue;
        // sotto la sfera l'ombra non si vede
        const under = Math.hypot(x - cx, y - cy) < R - 2;
        if (under) continue;
        const soft = Math.min(1, (1 - d) * 3); // penombra ai bordi
        const r = (g / 2) * 0.95 * soft;
        if (r > 0.3) out.push({ x, y, r });
      }
    return { out, sx, sy, rx, ry };
  }, [L]);

  const lightPos = { x: cx + L[0] * (R + 46), y: cy - L[1] * (R + 46) };
  const lbl = [
    { t: "lume", x: cx + L[0] * R * 0.5, y: cy - L[1] * R * 0.5 },
    { t: "mezzotono", x: cx - L[1] * R * 0.1, y: cy - L[0] * R * 0.1 },
    { t: "terminatore", x: cx - L[0] * R * 0.78, y: cy + L[1] * R * 0.78 },
    { t: "riflesso", x: cx - L[0] * R * 0.55, y: cy + R * 0.86 },
    { t: "ombra portata", x: shadow.sx, y: shadow.sy + shadow.ry + 14 },
  ];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
        <line x1={20} y1={cy + R * 0.92} x2={W - 20} y2={cy + R * 0.92} stroke="var(--rule)" />
        <g fill="var(--ink)">
          {shadow.out.map((d, i) => (
            <circle key={`s${i}`} cx={d.x} cy={d.y} r={d.r} opacity={0.8} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={R} fill="var(--paper)" stroke="var(--ink)" strokeWidth={0.8} opacity={0.9} />
        <g fill="var(--ink)">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} />
          ))}
        </g>
        {/* sorgente */}
        <g transform={`translate(${lightPos.x}, ${lightPos.y})`}>
          <circle r={9} fill="none" stroke="var(--accent)" strokeWidth={1.2} className="animate-breathe" />
          <circle r={4} fill="var(--accent)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={12 * Math.cos((a * Math.PI) / 180)}
              y1={12 * Math.sin((a * Math.PI) / 180)}
              x2={16 * Math.cos((a * Math.PI) / 180)}
              y2={16 * Math.sin((a * Math.PI) / 180)}
              stroke="var(--accent)"
              strokeWidth={1}
            />
          ))}
        </g>
        <line x1={lightPos.x} y1={lightPos.y} x2={cx + L[0] * R} y2={cy - L[1] * R} stroke="var(--accent)" strokeWidth={0.8} strokeDasharray="3 3" />
        {labels &&
          lbl.map((l) => (
            <g key={l.t}>
              <circle cx={l.x} cy={l.y} r={2} fill="var(--accent)" />
              <text x={l.x + 6} y={l.y + 3} fontSize="9.5" fill="var(--accent)" className="font-mono" style={{ paintOrder: "stroke", stroke: "var(--paper)", strokeWidth: 3 }}>
                {l.t}
              </text>
            </g>
          ))}
      </svg>
      <Panel className="grid gap-x-6 gap-y-3 md:grid-cols-[1fr_1fr_auto] items-end">
        <Slider label="direzione della luce (azimut)" value={az} min={0} max={360} step={1} onChange={setAz} format={(v) => `${v}°`} />
        <Slider label="frontalità (elevazione)" value={el} min={0} max={85} step={1} onChange={setEl} format={(v) => `${v}°`} />
        <div className="flex gap-2">
          <Chip active={labels} onClick={() => setLabels((v) => !v)}>
            etichette
          </Chip>
          <Chip active={bounce} onClick={() => setBounce((v) => !v)}>
            luce riflessa
          </Chip>
        </div>
        <div className="md:col-span-3 flex flex-wrap gap-6">
          <Readout label="legge di Lambert" value="I = I₀ · max(0, n · l)" />
          <Readout label="raggio del punto" value="r ∝ √(1 − valore)" />
          <Readout label="punti" value={dots.length + shadow.out.length} />
        </div>
      </Panel>
    </div>
  );
}
