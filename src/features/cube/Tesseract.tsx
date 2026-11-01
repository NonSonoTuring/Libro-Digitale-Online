import { useEffect, useRef, useState } from "react";
import { Chip, Panel, Readout, Slider } from "@/components/ui";

type Plane = "xw" | "yw" | "zw" | "xy" | "yz" | "xz";
const PLANES: { k: Plane; label: string; rate: number; dim: 3 | 4 }[] = [
  { k: "xw", label: "XW", rate: 0.5, dim: 4 },
  { k: "yw", label: "YW", rate: 0.37, dim: 4 },
  { k: "zw", label: "ZW", rate: 0.42, dim: 4 },
  { k: "xy", label: "XY", rate: 0.33, dim: 3 },
  { k: "yz", label: "YZ", rate: 0.28, dim: 3 },
  { k: "xz", label: "XZ", rate: 0.3, dim: 3 },
];
const IDX: Record<Plane, [number, number]> = { xw: [0, 3], yw: [1, 3], zw: [2, 3], xy: [0, 1], yz: [1, 2], xz: [0, 2] };

const VERTS: number[][] = Array.from({ length: 16 }, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
const EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++)
  for (let j = i + 1; j < 16; j++) {
    const x = i ^ j;
    if (x && (x & (x - 1)) === 0) EDGES.push([i, j]);
  }

/** Ipercubo in rotazione: proiezione prospettica 4D → 3D → 2D. */
export function Tesseract() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<Record<Plane, boolean>>({ xw: true, yw: false, zw: false, xy: false, yz: true, xz: false });
  const [speed, setSpeed] = useState(1);
  const activeRef = useRef(active);
  const speedRef = useRef(speed);
  activeRef.current = active;
  speedRef.current = speed;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const angles: Record<Plane, number> = { xw: 0.3, yw: 0, zw: 0, xy: 0, yz: 0.4, xz: 0 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let colors = { accent: "#b5652a", ink: "#2b2824", ink3: "#8e877b", paper: "#f7f2e9" };
    let lastRead = 0;

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    layout();

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors = {
        accent: cs.getPropertyValue("--accent").trim() || colors.accent,
        ink: cs.getPropertyValue("--ink").trim() || colors.ink,
        ink3: cs.getPropertyValue("--ink-3").trim() || colors.ink3,
        paper: cs.getPropertyValue("--paper").trim() || colors.paper,
      };
    };

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now - lastRead > 600) {
        readColors();
        lastRead = now;
      }
      for (const p of PLANES) if (activeRef.current[p.k]) angles[p.k] += dt * p.rate * speedRef.current;

      // rotazioni nei piani attivi
      const pts = VERTS.map((v) => {
        const q = [...v];
        for (const p of PLANES) {
          const t = angles[p.k];
          if (!t) continue;
          const [a, b] = IDX[p.k];
          const c = Math.cos(t);
          const s = Math.sin(t);
          const qa = q[a] * c - q[b] * s;
          const qb = q[a] * s + q[b] * c;
          q[a] = qa;
          q[b] = qb;
        }
        return q;
      });

      // 4D → 3D (prospettiva lungo w), vista 3D inclinata, 3D → 2D
      const d4 = 2.8;
      const d3 = 7;
      const tiltX = -0.35;
      const tiltY = 0.45;
      const scale = Math.min(w, h) * 0.145;
      const proj = pts.map((q) => {
        const f = d4 / (d4 - q[3]);
        let x = q[0] * f;
        let y = q[1] * f;
        let z = q[2] * f;
        // rotazione di vista
        const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
        const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
        y = y1;
        z = z1;
        const x2 = x * Math.cos(tiltY) + z * Math.sin(tiltY);
        const z2 = -x * Math.sin(tiltY) + z * Math.cos(tiltY);
        x = x2;
        z = z2;
        const g = d3 / (d3 - z);
        return { X: w / 2 + x * g * scale, Y: h / 2 - y * g * scale, w: q[3], f };
      });

      ctx.clearRect(0, 0, w, h);
      const sorted = [...EDGES].sort((e1, e2) => proj[e1[0]].w + proj[e1[1]].w - (proj[e2[0]].w + proj[e2[1]].w));
      for (const [i, j] of sorted) {
        const a = proj[i];
        const b = proj[j];
        const depth = (a.w + b.w) / 2; // ∈ [−1, 1]
        const t = (depth + 1) / 2;
        ctx.beginPath();
        ctx.moveTo(a.X, a.Y);
        ctx.lineTo(b.X, b.Y);
        ctx.strokeStyle = t > 0.5 ? colors.accent : colors.ink;
        ctx.globalAlpha = 0.25 + 0.7 * t;
        ctx.lineWidth = 0.8 + 1.8 * t;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      proj.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.X, p.Y, 2 + 2.2 * p.f, 0, Math.PI * 2);
        ctx.fillStyle = p.w > 0 ? colors.accent : colors.ink;
        ctx.fill();
        ctx.strokeStyle = colors.paper;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div>
      <canvas ref={ref} className="block w-full" style={{ height: 400 }} />
      <Panel className="grid gap-x-6 gap-y-3 md:grid-cols-[1fr_auto] items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 mr-1">piani 4D</span>
          {PLANES.filter((p) => p.dim === 4).map((p) => (
            <Chip key={p.k} active={active[p.k]} onClick={() => setActive((a) => ({ ...a, [p.k]: !a[p.k] }))}>
              {p.label}
            </Chip>
          ))}
          <span className="mx-1 h-5 w-px bg-rule" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 mr-1">piani 3D</span>
          {PLANES.filter((p) => p.dim === 3).map((p) => (
            <Chip key={p.k} active={active[p.k]} onClick={() => setActive((a) => ({ ...a, [p.k]: !a[p.k] }))}>
              {p.label}
            </Chip>
          ))}
        </div>
        <div className="w-44">
          <Slider label="velocità" value={speed} min={0} max={3} step={0.1} onChange={setSpeed} format={(v) => `${v.toFixed(1)}×`} />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-6">
          <Readout label="vertici" value="16" />
          <Readout label="spigoli" value="32" />
          <Readout label="facce" value="24" />
          <Readout label="celle cubiche" value="8" />
          <Readout label="colore" value="w > 0 in accento · w < 0 in inchiostro" />
        </div>
      </Panel>
    </div>
  );
}
