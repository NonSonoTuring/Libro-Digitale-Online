import { useEffect, useRef, useState, type CSSProperties } from "react";
import { animate } from "framer-motion";
import { Button, Chip, Panel, Readout } from "@/components/ui";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/*  Algebra delle matrici (column-major, come matrix3d di CSS)          */
/* ------------------------------------------------------------------ */
type Mat = number[];
const I: Mat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

function mul(A: Mat, B: Mat): Mat {
  const C = new Array(16).fill(0);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += A[i + 4 * k] * B[k + 4 * j];
      C[i + 4 * j] = s;
    }
  return C;
}

/** Rotazione di Rodrigues attorno all'asse (ax, ay, az) di `deg` gradi. */
function rot(ax: number, ay: number, az: number, deg: number): Mat {
  const n = Math.hypot(ax, ay, az) || 1;
  const x = ax / n;
  const y = ay / n;
  const z = az / n;
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const C = 1 - c;
  return [
    c + x * x * C, y * x * C + z * s, z * x * C - y * s, 0,
    x * y * C - z * s, c + y * y * C, z * y * C + x * s, 0,
    x * z * C + y * s, y * z * C - x * s, c + z * z * C, 0,
    0, 0, 0, 1,
  ];
}

const css = (m: Mat) => `matrix3d(${m.map((v) => +v.toFixed(6)).join(",")})`;

/** Rotazione che porta l'asse y (0,1,0) sulla direzione u. */
function alignY(ax: number, ay: number, az: number): Mat {
  const n = Math.hypot(ax, ay, az) || 1;
  const u = [ax / n, ay / n, az / n];
  if (u[1] > 0.9999) return I;
  if (u[1] < -0.9999) return rot(1, 0, 0, 180);
  const angle = (Math.acos(u[1]) * 180) / Math.PI;
  return rot(u[2], 0, -u[0], angle);
}

/* ------------------------------------------------------------------ */
/*  Geometria del cubo                                                  */
/* ------------------------------------------------------------------ */
const FACES = [
  { n: "I", t: "translateZ(var(--h))", a: 0.22 },
  { n: "VI", t: "rotateY(180deg) translateZ(var(--h))", a: 0.1 },
  { n: "II", t: "rotateY(90deg) translateZ(var(--h))", a: 0.16 },
  { n: "V", t: "rotateY(-90deg) translateZ(var(--h))", a: 0.14 },
  { n: "III", t: "rotateX(90deg) translateZ(var(--h))", a: 0.28 },
  { n: "IV", t: "rotateX(-90deg) translateZ(var(--h))", a: 0.08 },
];
const SIGNS = [-1, 1];
const EDGES: string[] = [];
for (const a of SIGNS)
  for (const b of SIGNS) {
    EDGES.push(`translate3d(calc(${a} * var(--h)), 0, calc(${b} * var(--h)))`);
    EDGES.push(`translate3d(0, calc(${a} * var(--h)), calc(${b} * var(--h))) rotateZ(90deg)`);
    EDGES.push(`translate3d(calc(${a} * var(--h)), calc(${b} * var(--h)), 0) rotateX(90deg)`);
  }
const VERTS: string[] = [];
for (const a of SIGNS)
  for (const b of SIGNS)
    for (const c of SIGNS) VERTS.push(`translate3d(calc(${a} * var(--h)), calc(${b} * var(--h)), calc(${c} * var(--h)))`);

const AXES = {
  face: { u: [0, 1, 0] as const, angle: 90, label: "asse di faccia · 90°", desc: "passa per i centri di due facce opposte (3 assi)" },
  vertex: { u: [1, 1, 1] as const, angle: 120, label: "asse di vertice · 120°", desc: "passa per due vertici opposti, una diagonale spaziale (4 assi)" },
  edge: { u: [1, 1, 0] as const, angle: 180, label: "asse di spigolo · 180°", desc: "passa per i punti medi di due spigoli opposti (6 assi)" },
};
type AxisKey = keyof typeof AXES;
type Highlight = "none" | "vertices" | "edges" | "faces";

interface Props {
  mode?: "anatomy" | "symmetry";
  size?: number;
}

export function Cube3D({ mode = "anatomy", size = 170 }: Props) {
  const viewRef = useRef<HTMLDivElement>(null);
  const rot3 = useRef({ rx: -22, ry: 32 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const idle = useRef(true);
  const idleTimer = useRef<number | null>(null);

  const [hl, setHl] = useState<Highlight>("none");
  const [M, setM] = useState<Mat>(I);
  const [theta, setTheta] = useState(0);
  const [axis, setAxis] = useState<AxisKey>("face");
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);

  // rotazione di vista: trascinamento + rotazione lenta a riposo
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (idle.current && !drag.current) rot3.current.ry += mode === "anatomy" ? 0.25 : 0.08;
      if (viewRef.current)
        viewRef.current.style.transform = `rotateX(${rot3.current.rx}deg) rotateY(${rot3.current.ry}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    idle.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    rot3.current.ry += dx * 0.45;
    rot3.current.rx = Math.max(-85, Math.min(85, rot3.current.rx - dy * 0.45));
  };
  const onUp = () => {
    drag.current = null;
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => (idle.current = true), 3500);
  };

  const turn = (k: AxisKey) => {
    if (busy) return;
    setAxis(k);
    setBusy(true);
    const { u, angle } = AXES[k];
    animate(0, angle, {
      duration: 1.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setTheta(v),
      onComplete: () => {
        setM((m) => mul(m, rot(u[0], u[1], u[2], angle)));
        setTheta(0);
        setBusy(false);
        setCount((c) => c + 1);
      },
    });
  };

  const u = AXES[axis].u;
  const bodyT = mode === "symmetry" ? css(mul(M, rot(u[0], u[1], u[2], theta))) : "none";
  const axisT = css(mul(M, alignY(u[0], u[1], u[2])));

  const faceAlpha = (base: number) => (hl === "faces" ? 0.45 : hl === "none" ? base : 0.05);
  const vars = { "--h": `${size / 2}px`, "--s": `${size}px` } as CSSProperties;

  return (
    <div>
      <div
        className="relative mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
        style={{ height: size * 2.1, perspective: 1100, ...vars }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* ombra a terra */}
        <div
          className="absolute left-1/2 top-1/2 rounded-[50%] bg-ink/15 blur-xl"
          style={{ width: size * 1.4, height: size * 0.5, transform: `translate(-50%, ${size * 0.75}px)` }}
        />
        <div
          ref={viewRef}
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
        >
          {/* asse di rotazione (modalità simmetria) */}
          {mode === "symmetry" && (
            <div className="absolute left-0 top-0" style={{ transformStyle: "preserve-3d", transform: axisT }}>
              <div
                className="absolute bg-accent"
                style={{
                  width: 2,
                  height: size * 2.4,
                  left: -1,
                  top: -size * 1.2,
                  boxShadow: "0 0 10px var(--accent)",
                }}
              />
              <div
                className="absolute rounded-full border-2 border-accent bg-paper"
                style={{ width: 12, height: 12, left: -6, top: -size * 1.2 - 6 }}
              />
              <div
                className="absolute rounded-full border-2 border-accent bg-paper"
                style={{ width: 12, height: 12, left: -6, top: size * 1.2 - 6 }}
              />
            </div>
          )}

          {/* corpo del cubo */}
          <div className="absolute left-0 top-0" style={{ transformStyle: "preserve-3d", transform: bodyT }}>
            {FACES.map((f) => (
              <div
                key={f.n}
                className="absolute flex items-center justify-center border border-ink/70 transition-colors duration-500"
                style={{
                  width: size,
                  height: size,
                  left: -size / 2,
                  top: -size / 2,
                  transform: f.t,
                  background: `color-mix(in oklab, var(--accent) ${Math.round(faceAlpha(f.a) * 100)}%, var(--paper-2))`,
                  backfaceVisibility: "visible",
                }}
              >
                <span className="font-display text-ink/40 select-none" style={{ fontSize: size * 0.28 }}>
                  {f.n}
                </span>
              </div>
            ))}
            {EDGES.map((t, i) => (
              <div
                key={i}
                className={cn("absolute transition-all duration-500", hl === "edges" ? "bg-accent" : "bg-ink/70")}
                style={{
                  width: hl === "edges" ? 4 : 1.5,
                  height: size,
                  left: hl === "edges" ? -2 : -0.75,
                  top: -size / 2,
                  transform: t,
                  boxShadow: hl === "edges" ? "0 0 8px var(--accent)" : "none",
                }}
              />
            ))}
            {VERTS.map((t, i) => (
              <div
                key={i}
                className={cn(
                  "absolute rounded-full transition-all duration-500",
                  hl === "vertices" ? "bg-accent" : "bg-ink",
                )}
                style={{
                  width: hl === "vertices" ? 14 : 7,
                  height: hl === "vertices" ? 14 : 7,
                  left: hl === "vertices" ? -7 : -3.5,
                  top: hl === "vertices" ? -7 : -3.5,
                  transform: t,
                  boxShadow: hl === "vertices" ? "0 0 0 4px color-mix(in oklab, var(--accent) 30%, transparent)" : "none",
                }}
              />
            ))}
          </div>
        </div>
        <span className="absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-wider text-ink-3">
          trascina per ruotare
        </span>
      </div>

      {mode === "anatomy" ? (
        <Panel className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 mr-2">evidenzia</span>
          <Chip active={hl === "vertices"} onClick={() => setHl(hl === "vertices" ? "none" : "vertices")}>
            vertici · V = 8
          </Chip>
          <Chip active={hl === "edges"} onClick={() => setHl(hl === "edges" ? "none" : "edges")}>
            spigoli · E = 12
          </Chip>
          <Chip active={hl === "faces"} onClick={() => setHl(hl === "faces" ? "none" : "faces")}>
            facce · F = 6
          </Chip>
          <span className="ml-auto font-mono text-[12px] text-accent">V − E + F = 8 − 12 + 6 = 2</span>
        </Panel>
      ) : (
        <Panel className="grid gap-3 md:grid-cols-[1fr_auto] items-center">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(AXES) as AxisKey[]).map((k) => (
              <Button key={k} variant={axis === k ? "primary" : "ghost"} onClick={() => turn(k)} disabled={busy}>
                {AXES[k].label}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                setM(I);
                setCount(0);
              }}
              disabled={busy}
            >
              Azzera
            </Button>
          </div>
          <div className="flex gap-5">
            <Readout label="rotazioni" value={count} />
            <Readout label="asse attivo" value={AXES[axis].desc} />
          </div>
        </Panel>
      )}
    </div>
  );
}
