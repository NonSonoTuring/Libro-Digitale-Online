import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Chip, Panel, Readout, Slider } from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Percettrone                                                         */
/* ------------------------------------------------------------------ */
interface Pt {
  x: number;
  y: number;
  t: 0 | 1;
}
const mk = (arr: number[][], t: 0 | 1): Pt[] => arr.map(([x, y]) => ({ x, y, t }));
const LIN: Pt[] = [
  ...mk([[-0.8, -0.5], [-0.6, -0.8], [-0.4, -0.3], [-0.7, 0.1], [-0.3, -0.6], [-0.9, -0.1], [-0.5, 0.3], [-0.2, -0.9], [0.0, -0.5], [-0.35, -0.05]], 0),
  ...mk([[0.6, 0.5], [0.8, 0.2], [0.4, 0.8], [0.3, 0.35], [0.7, 0.75], [0.9, 0.5], [0.5, 0.1], [0.2, 0.7], [0.85, 0.85], [0.15, 0.45]], 1),
];
const XOR: Pt[] = [
  ...mk([[-0.7, -0.6], [-0.5, -0.75], [-0.6, -0.4], [-0.8, -0.8], [0.6, 0.6], [0.75, 0.45], [0.5, 0.8], [0.8, 0.75]], 0),
  ...mk([[-0.7, 0.6], [-0.5, 0.75], [-0.6, 0.4], [-0.85, 0.8], [0.6, -0.6], [0.75, -0.45], [0.5, -0.8], [0.85, -0.7]], 1),
];

const PW = 600;
const PH = 340;
const CX = 180;
const CY = 170;
const S = 150;
const ETA = 0.25;

export function Perceptron() {
  const [ds, setDs] = useState<"lin" | "xor">("lin");
  const [w1, setW1] = useState(0.3);
  const [w2, setW2] = useState(-0.5);
  const [b, setB] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [updates, setUpdates] = useState(0);
  const cursor = useRef(0);
  const prevAng = useRef(0);

  const data = ds === "lin" ? LIN : XOR;
  const predict = (p: Pt) => (w1 * p.x + w2 * p.y + b > 0 ? 1 : 0);
  const wrong = data.filter((p) => predict(p) !== p.t);

  const reset = (which = ds) => {
    setRunning(false);
    setW1(0.3);
    setW2(-0.5);
    setB(0.1);
    setUpdates(0);
    cursor.current = 0;
    setDs(which);
  };

  useEffect(() => {
    if (!running) return;
    if (wrong.length === 0 || updates >= 60) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => {
      // scorre i punti in ordine e aggiorna sul primo errore
      for (let k = 0; k < data.length; k++) {
        const p = data[(cursor.current + k) % data.length];
        const yhat = predict(p);
        if (yhat !== p.t) {
          const delta = ETA * (p.t - yhat);
          setW1((v) => v + delta * p.x);
          setW2((v) => v + delta * p.y);
          setB((v) => v + delta);
          setUpdates((u) => u + 1);
          cursor.current = (cursor.current + k + 1) % data.length;
          break;
        }
      }
    }, 420);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, w1, w2, b, updates, ds]);

  // geometria del confine
  const norm = Math.hypot(w1, w2);
  let transform = "";
  if (norm > 1e-6) {
    const k = -b / (norm * norm);
    const px = CX + w1 * k * S;
    const py = CY - w2 * k * S;
    let ang = (-Math.atan2(w2, w1) * 180) / Math.PI;
    while (ang - prevAng.current > 180) ang -= 360;
    while (ang - prevAng.current < -180) ang += 360;
    prevAng.current = ang;
    transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px) rotate(${ang.toFixed(2)}deg)`;
  }

  const converged = wrong.length === 0;
  const status =
    ds === "xor" && !running && updates >= 60
      ? "Nessuna convergenza: XOR non è linearmente separabile."
      : converged
        ? `Convergenza raggiunta dopo ${updates} aggiornamenti.`
        : running
          ? "Addestramento in corso…"
          : `${wrong.length} punti classificati male.`;

  return (
    <div>
      <svg viewBox={`0 0 ${PW} ${PH}`} className="w-full block">
        <defs>
          <clipPath id="pc-clip">
            <rect x={CX - S - 10} y={CY - S - 10} width={2 * S + 20} height={2 * S + 20} />
          </clipPath>
          <marker id="pc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
          </marker>
        </defs>
        {/* assi */}
        <rect x={CX - S - 10} y={CY - S - 10} width={2 * S + 20} height={2 * S + 20} fill="var(--paper)" stroke="var(--rule)" />
        <line x1={CX - S} x2={CX + S} y1={CY} y2={CY} stroke="var(--rule)" />
        <line x1={CX} x2={CX} y1={CY - S} y2={CY + S} stroke="var(--rule)" />
        <g clipPath="url(#pc-clip)">
          {norm > 1e-6 && (
            <g style={{ transform, transition: "transform 0.4s cubic-bezier(.22,1,.36,1)" }}>
              <rect x={0} y={-1000} width={2000} height={2000} fill="var(--accent)" opacity={0.1} />
              <line x1={0} x2={0} y1={-1000} y2={1000} stroke="var(--accent)" strokeWidth={2} />
              <line x1={0} x2={34} y1={0} y2={0} stroke="var(--accent)" strokeWidth={1.6} markerEnd="url(#pc-arrow)" />
              <text x={38} y={4} fontSize="10" className="font-mono" fill="var(--accent)">
                w
              </text>
            </g>
          )}
        </g>
        {/* punti */}
        {data.map((p, i) => {
          const px = CX + p.x * S;
          const py = CY - p.y * S;
          const bad = predict(p) !== p.t;
          return (
            <g key={`${ds}-${i}`}>
              {bad && <circle cx={px} cy={py} r={11} fill="none" stroke="#b4433a" strokeWidth={1.5} className="animate-breathe" />}
              {p.t === 0 ? (
                <circle cx={px} cy={py} r={5.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.6} />
              ) : (
                <rect x={px - 5.5} y={py - 5.5} width={11} height={11} fill="var(--accent)" stroke="var(--paper)" strokeWidth={1} />
              )}
            </g>
          );
        })}
        <g fontSize="10" className="font-mono" fill="var(--ink-3)">
          <text x={CX + S - 2} y={CY + 12} textAnchor="end">
            x₁
          </text>
          <text x={CX + 6} y={CY - S + 10}>
            x₂
          </text>
        </g>
        {/* pannello destro */}
        <g transform="translate(372, 28)" fontSize="12" fill="var(--ink-2)">
          <text className="font-display" fontSize="15" fill="var(--ink)" fontStyle="italic">
            Confine di decisione
          </text>
          <text y={26} className="font-mono" fontSize="11.5">
            {`${w1.toFixed(2)}·x₁ ${w2 < 0 ? "−" : "+"} ${Math.abs(w2).toFixed(2)}·x₂ ${b < 0 ? "−" : "+"} ${Math.abs(b).toFixed(2)} = 0`}
          </text>
          <g transform="translate(0, 58)">
            <circle cx={6} cy={0} r={5.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.6} />
            <text x={20} y={4}>
              classe 0 · t = 0
            </text>
            <rect x={0.5} y={18} width={11} height={11} fill="var(--accent)" />
            <text x={20} y={28}>
              classe 1 · t = 1
            </text>
            <circle cx={6} cy={48} r={9} fill="none" stroke="#b4433a" strokeWidth={1.5} />
            <text x={20} y={52}>
              errore di classificazione
            </text>
          </g>
          <g transform="translate(0, 140)" className="font-mono" fontSize="11">
            <text fill="var(--ink-3)">AGGIORNAMENTI</text>
            <text y={18} fontSize="22" fill="var(--ink)" className="font-display">
              {updates}
            </text>
            <text x={110} fill="var(--ink-3)">
              ERRORI
            </text>
            <text x={110} y={18} fontSize="22" fill={converged ? "var(--accent)" : "var(--ink)"} className="font-display">
              {wrong.length}
            </text>
          </g>
          <foreignObject x={0} y={190} width={210} height={90}>
            <p style={{ fontSize: 12, lineHeight: 1.45, color: "var(--ink-2)", fontFamily: "var(--font-body)" }}>{status}</p>
          </foreignObject>
        </g>
      </svg>
      <Panel className="grid gap-x-6 gap-y-3 md:grid-cols-[1fr_1fr_1fr_auto] items-end">
        <Slider label="peso w₁" value={w1} min={-2} max={2} onChange={(v) => { setRunning(false); setW1(v); }} />
        <Slider label="peso w₂" value={w2} min={-2} max={2} onChange={(v) => { setRunning(false); setW2(v); }} />
        <Slider label="bias b" value={b} min={-1.5} max={1.5} onChange={(v) => { setRunning(false); setB(v); }} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setRunning((r) => !r)} disabled={converged}>
            {running ? "Pausa" : "Allena"}
          </Button>
          <Button variant="ghost" onClick={() => reset()}>
            Azzera
          </Button>
        </div>
        <div className="md:col-span-4 flex items-center gap-2 pt-1">
          <span className="text-[12px] text-ink-3 font-mono uppercase tracking-wider mr-1">dati</span>
          <Chip active={ds === "lin"} onClick={() => reset("lin")}>
            separabili
          </Chip>
          <Chip active={ds === "xor"} onClick={() => reset("xor")}>
            XOR
          </Chip>
          <span className="ml-auto font-mono text-[11px] text-ink-3">η = {ETA} · regola w ← w + η (t − ŷ) x</span>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Discesa del gradiente                                               */
/* ------------------------------------------------------------------ */
const GW = 600;
const GH = 320;
const GP = { l: 44, r: 18, t: 18, b: 34 };
const XR: [number, number] = [-4, 4];
const YR: [number, number] = [0, 7.5];
const gx = (w: number) => GP.l + ((w - XR[0]) / (XR[1] - XR[0])) * (GW - GP.l - GP.r);
const gy = (v: number) => GH - GP.b - ((v - YR[0]) / (YR[1] - YR[0])) * (GH - GP.t - GP.b);

const LOSSES = {
  nonconvex: {
    name: "Non convessa",
    L: (w: number) => 0.05 * w ** 4 - 0.6 * w * w + 0.2 * w + 3,
    dL: (w: number) => 0.2 * w ** 3 - 1.2 * w + 0.2,
  },
  convex: {
    name: "Convessa",
    L: (w: number) => 0.25 * (w - 1) ** 2 + 0.6,
    dL: (w: number) => 0.5 * (w - 1),
  },
};

export function GradientDescent() {
  const [kind, setKind] = useState<keyof typeof LOSSES>("nonconvex");
  const [eta, setEta] = useState(0.15);
  const [w0, setW0] = useState(3.2);
  const [beta, setBeta] = useState(0);
  const [w, setW] = useState(3.2);
  const [v, setV] = useState(0);
  const [trail, setTrail] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const { L, dL } = LOSSES[kind];

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = XR[0] + ((XR[1] - XR[0]) * i) / 200;
      pts.push(`${i ? "L" : "M"}${gx(x).toFixed(1)},${gy(Math.min(YR[1] + 1, L(x))).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [L]);

  const reset = (nw0 = w0) => {
    setRunning(false);
    setW(nw0);
    setV(0);
    setTrail([]);
  };

  const diverged = Math.abs(w) >= 4.4;
  const grad = dL(w);
  const step = () => {
    if (diverged) return;
    const nv = beta * v + grad;
    const nw = Math.max(-4.5, Math.min(4.5, w - eta * nv));
    setV(nv);
    setTrail((t) => [...t.slice(-40), w]);
    setW(nw);
  };

  useEffect(() => {
    if (!running) return;
    if (diverged || trail.length >= 80 || (Math.abs(grad) < 1e-3 && beta === 0)) {
      setRunning(false);
      return;
    }
    const id = setTimeout(step, 420);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, w, v]);

  const yBall = Math.min(YR[1] + 0.3, L(w));
  const tangent = {
    x1: gx(w - 0.8),
    y1: gy(yBall - 0.8 * grad),
    x2: gx(w + 0.8),
    y2: gy(yBall + 0.8 * grad),
  };

  return (
    <div>
      <svg viewBox={`0 0 ${GW} ${GH}`} className="w-full block pt-2">
        <defs>
          <clipPath id="gd-clip">
            <rect x={GP.l} y={GP.t - 10} width={GW - GP.l - GP.r} height={GH - GP.t - GP.b + 10} />
          </clipPath>
          <marker id="gd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
          </marker>
        </defs>
        <g fontSize="10" className="font-mono" fill="var(--ink-3)">
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
            <g key={x}>
              <line x1={gx(x)} x2={gx(x)} y1={gy(YR[0])} y2={gy(YR[1])} stroke="var(--rule)" strokeWidth={x === 0 ? 1.2 : 0.6} />
              <text x={gx(x)} y={GH - GP.b + 14} textAnchor="middle">
                {x}
              </text>
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((y) => (
            <g key={y}>
              <line x1={gx(XR[0])} x2={gx(XR[1])} y1={gy(y)} y2={gy(y)} stroke="var(--rule)" strokeWidth={0.6} />
              <text x={GP.l - 8} y={gy(y) + 3} textAnchor="end">
                {y}
              </text>
            </g>
          ))}
          <text x={gx(4)} y={GH - GP.b + 28} textAnchor="end" fill="var(--ink-2)">
            parametro w
          </text>
          <text x={GP.l} y={GP.t - 6} fill="var(--ink-2)">
            L(w)
          </text>
        </g>
        <g clipPath="url(#gd-clip)">
          <motion.path d={curve} animate={{ d: curve }} transition={{ duration: 0.6 }} fill="none" stroke="var(--accent)" strokeWidth={2.4} />
          {trail.map((tw, i) => (
            <circle key={i} cx={gx(tw)} cy={gy(Math.min(YR[1] + 0.3, L(tw)))} r={3} fill="var(--ink)" opacity={0.15 + (0.6 * (i + 1)) / trail.length} />
          ))}
          {trail.length > 0 && (
            <polyline
              points={[...trail, w].map((tw) => `${gx(tw)},${gy(Math.min(YR[1] + 0.3, L(tw)))}`).join(" ")}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={1}
              opacity={0.35}
            />
          )}
          <line {...tangent} stroke="var(--ink-2)" strokeDasharray="4 4" strokeWidth={1.2} />
          {!diverged && Math.abs(grad) > 0.01 && (
            <line
              x1={gx(w)}
              y1={gy(yBall)}
              x2={gx(Math.max(-4, Math.min(4, w - eta * grad)))}
              y2={gy(yBall)}
              stroke="var(--ink)"
              strokeWidth={1.4}
              markerEnd="url(#gd-arrow)"
            />
          )}
          <motion.circle
            animate={{ cx: gx(w), cy: gy(yBall) }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            r={7}
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={2}
          />
          <motion.circle
            animate={{ cx: gx(w), cy: gy(yBall) }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            r={3}
            fill="var(--accent)"
          />
        </g>
        {diverged && (
          <text x={GW / 2} y={GP.t + 40} textAnchor="middle" fontSize="12" className="font-mono" fill="#b4433a">
            divergenza: il tasso di apprendimento è troppo grande
          </text>
        )}
      </svg>
      <Panel className="grid gap-x-6 gap-y-3 md:grid-cols-3">
        <Slider label="tasso di apprendimento η" value={eta} min={0.01} max={1.2} onChange={(x) => { setEta(x); }} />
        <Slider label="punto iniziale w₀" value={w0} min={-4} max={4} step={0.1} onChange={(x) => { setW0(x); reset(x); }} format={(x) => x.toFixed(1)} />
        <Slider label="momento β" value={beta} min={0} max={0.95} onChange={(x) => { setBeta(x); }} />
        <div className="flex gap-2 md:col-span-2 items-center flex-wrap">
          <Button onClick={step} disabled={diverged}>
            Un passo
          </Button>
          <Button variant="ghost" onClick={() => setRunning((r) => !r)} disabled={diverged}>
            {running ? "Pausa" : "Avvia"}
          </Button>
          <Button variant="ghost" onClick={() => reset()}>
            Azzera
          </Button>
          <span className="mx-2 h-5 w-px bg-rule" />
          {(Object.keys(LOSSES) as (keyof typeof LOSSES)[]).map((k) => (
            <Chip key={k} active={kind === k} onClick={() => { setKind(k); reset(); }}>
              {LOSSES[k].name}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Readout label="passo" value={trail.length} />
          <Readout label="w" value={w.toFixed(3)} />
          <Readout label="L(w)" value={L(w).toFixed(3)} />
          <Readout label="L′(w)" value={grad.toFixed(3)} />
        </div>
      </Panel>
    </div>
  );
}
