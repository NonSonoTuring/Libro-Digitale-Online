import { useMemo, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Chip, Panel, Readout, Slider } from "@/components/ui";
import { M } from "@/lib/math";

/* ------------------------------------------------------------------ */
/*  Utilità di scala                                                    */
/* ------------------------------------------------------------------ */
const W = 600;
const H = 320;
const PAD = { l: 44, r: 18, t: 18, b: 34 };

function makeScales(xr: [number, number], yr: [number, number], w = W, h = H) {
  const sx = (x: number) => PAD.l + ((x - xr[0]) / (xr[1] - xr[0])) * (w - PAD.l - PAD.r);
  const sy = (y: number) => h - PAD.b - ((y - yr[0]) / (yr[1] - yr[0])) * (h - PAD.t - PAD.b);
  const ix = (px: number) => xr[0] + ((px - PAD.l) / (w - PAD.l - PAD.r)) * (xr[1] - xr[0]);
  return { sx, sy, ix };
}

function Grid({
  xr,
  yr,
  sx,
  sy,
  xStep = 1,
  yStep = 1,
  xLabel,
  yLabel,
  fmtX = (v: number) => String(v),
  fmtY = (v: number) => String(v),
}: {
  xr: [number, number];
  yr: [number, number];
  sx: (x: number) => number;
  sy: (y: number) => number;
  xStep?: number;
  yStep?: number;
  xLabel?: string;
  yLabel?: string;
  fmtX?: (v: number) => string;
  fmtY?: (v: number) => string;
}) {
  const xs: number[] = [];
  for (let x = Math.ceil(xr[0] / xStep) * xStep; x <= xr[1] + 1e-9; x += xStep) xs.push(+x.toFixed(6));
  const ys: number[] = [];
  for (let y = Math.ceil(yr[0] / yStep) * yStep; y <= yr[1] + 1e-9; y += yStep) ys.push(+y.toFixed(6));
  return (
    <g className="font-mono" fontSize="10" fill="var(--ink-3)">
      {xs.map((x) => (
        <g key={`x${x}`}>
          <line x1={sx(x)} x2={sx(x)} y1={sy(yr[0])} y2={sy(yr[1])} stroke="var(--rule)" strokeWidth={x === 0 ? 1.2 : 0.6} />
          <text x={sx(x)} y={H - PAD.b + 14} textAnchor="middle">
            {fmtX(x)}
          </text>
        </g>
      ))}
      {ys.map((y) => (
        <g key={`y${y}`}>
          <line x1={sx(xr[0])} x2={sx(xr[1])} y1={sy(y)} y2={sy(y)} stroke="var(--rule)" strokeWidth={y === 0 ? 1.2 : 0.6} />
          <text x={PAD.l - 8} y={sy(y) + 3} textAnchor="end">
            {fmtY(y)}
          </text>
        </g>
      ))}
      {xLabel && (
        <text x={sx(xr[1])} y={H - PAD.b + 28} textAnchor="end" fill="var(--ink-2)">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={PAD.l} y={PAD.t - 6} textAnchor="start" fill="var(--ink-2)">
          {yLabel}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Funzioni di attivazione                                             */
/* ------------------------------------------------------------------ */
function erf(x: number) {
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return s * y;
}
const Phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
const sig = (z: number) => 1 / (1 + Math.exp(-z));

const FUNCS = {
  sigmoid: {
    name: "Sigmoide",
    tex: "\\sigma(z)=\\dfrac{1}{1+e^{-z}}",
    f: sig,
    d: (z: number) => sig(z) * (1 - sig(z)),
    range: "(0, 1)",
    note: "Satura per |z| grande: il gradiente svanisce. L'uscita non è centrata in zero.",
  },
  tanh: {
    name: "Tangente iperbolica",
    tex: "\\tanh(z)=\\dfrac{e^{z}-e^{-z}}{e^{z}+e^{-z}}",
    f: Math.tanh,
    d: (z: number) => 1 - Math.tanh(z) ** 2,
    range: "(−1, 1)",
    note: "Centrata in zero, quindi preferibile alla sigmoide negli strati nascosti; satura comunque.",
  },
  relu: {
    name: "ReLU",
    tex: "\\mathrm{ReLU}(z)=\\max(0,\\,z)",
    f: (z: number) => Math.max(0, z),
    d: (z: number) => (z > 0 ? 1 : 0),
    range: "[0, +∞)",
    note: "Economica e non satura per z > 0; per z < 0 il gradiente è nullo (neuroni «morti»).",
  },
  leaky: {
    name: "Leaky ReLU",
    tex: "f(z)=\\max(0{,}1\\,z,\\;z)",
    f: (z: number) => (z > 0 ? z : 0.1 * z),
    d: (z: number) => (z > 0 ? 1 : 0.1),
    range: "(−∞, +∞)",
    note: "Una piccola pendenza negativa mantiene vivo il gradiente anche per z < 0.",
  },
  gelu: {
    name: "GELU",
    tex: "\\mathrm{GELU}(z)=z\\,\\Phi(z)",
    f: (z: number) => z * Phi(z),
    d: (z: number) => Phi(z) + z * phi(z),
    range: "≈ (−0,17, +∞)",
    note: "Liscia e non monotona; standard nei Transformer. Φ è la funzione di ripartizione normale.",
  },
  softplus: {
    name: "Softplus",
    tex: "f(z)=\\log\\left(1+e^{z}\\right)",
    f: (z: number) => Math.log1p(Math.exp(z)),
    d: sig,
    range: "(0, +∞)",
    note: "Versione liscia della ReLU: la sua derivata è esattamente la sigmoide.",
  },
} as const;
type FKey = keyof typeof FUNCS;

export function ActivationChart() {
  const [key, setKey] = useState<FKey>("sigmoid");
  const [showD, setShowD] = useState(true);
  const [hx, setHx] = useState<number | null>(null);
  const xr: [number, number] = [-4, 4];
  const yr: [number, number] = [-1.5, 3.5];
  const { sx, sy, ix } = makeScales(xr, yr);
  const fn = FUNCS[key];

  const paths = useMemo(() => {
    const N = 160;
    const pts: string[] = [];
    const dpts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const x = xr[0] + ((xr[1] - xr[0]) * i) / N;
      pts.push(`${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(Math.max(yr[0] - 1, Math.min(yr[1] + 1, fn.f(x)))).toFixed(1)}`);
      dpts.push(`${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(Math.max(yr[0] - 1, Math.min(yr[1] + 1, fn.d(x)))).toFixed(1)}`);
    }
    return { f: pts.join(" "), d: dpts.join(" ") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const x = Math.max(xr[0], Math.min(xr[1], ix(px)));
    setHx(x);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 px-5 pt-4">
        {(Object.keys(FUNCS) as FKey[]).map((k) => (
          <Chip key={k} active={k === key} onClick={() => setKey(k)}>
            {FUNCS[k].name}
          </Chip>
        ))}
        <span className="flex-1" />
        <Chip active={showD} onClick={() => setShowD((s) => !s)}>
          derivata f′
        </Chip>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block mt-2"
        onMouseMove={onMove}
        onMouseLeave={() => setHx(null)}
      >
        <defs>
          <clipPath id="act-clip">
            <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} />
          </clipPath>
        </defs>
        <Grid xr={xr} yr={yr} sx={sx} sy={sy} yStep={1} xLabel="z" yLabel="f(z)" />
        <g clipPath="url(#act-clip)">
          <motion.path
            d={paths.d}
            animate={{ d: paths.d, opacity: showD ? 1 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth={1.4}
            strokeDasharray="5 5"
          />
          <motion.path
            d={paths.f}
            animate={{ d: paths.f }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          {hx !== null && (
            <g>
              <line x1={sx(hx)} x2={sx(hx)} y1={PAD.t} y2={H - PAD.b} stroke="var(--ink-2)" strokeDasharray="2 4" />
              <circle cx={sx(hx)} cy={sy(fn.f(hx))} r={4.5} fill="var(--accent)" stroke="var(--paper)" strokeWidth={2} />
              {showD && <circle cx={sx(hx)} cy={sy(fn.d(hx))} r={3.5} fill="var(--ink-3)" stroke="var(--paper)" strokeWidth={2} />}
            </g>
          )}
        </g>
        <g fontSize="10" className="font-mono">
          <line x1={W - 170} x2={W - 150} y1={PAD.t + 8} y2={PAD.t + 8} stroke="var(--accent)" strokeWidth={2.4} />
          <text x={W - 144} y={PAD.t + 11} fill="var(--ink-2)">
            f(z)
          </text>
          <line x1={W - 100} x2={W - 80} y1={PAD.t + 8} y2={PAD.t + 8} stroke="var(--ink-3)" strokeWidth={1.4} strokeDasharray="5 5" />
          <text x={W - 74} y={PAD.t + 11} fill="var(--ink-2)">
            f′(z)
          </text>
        </g>
      </svg>
      <Panel className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="text-[15px]">
            <M>{fn.tex}</M>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{fn.note}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-1 sm:gap-2">
          <Readout label="codominio" value={fn.range} />
          <Readout label="z (cursore)" value={hx === null ? "—" : hx.toFixed(2)} />
          <Readout
            label="f(z) · f′(z)"
            value={hx === null ? "—" : `${fn.f(hx).toFixed(3)} · ${fn.d(hx).toFixed(3)}`}
          />
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Curve di apprendimento                                              */
/* ------------------------------------------------------------------ */
const trainLoss = (e: number) => 2.2 * Math.exp(-0.05 * e) + 0.1 + 0.03 * Math.sin(e * 1.7) * Math.exp(-0.02 * e);
const valLoss = (e: number) => 2.2 * Math.exp(-0.05 * e) + 0.18 + 0.00012 * e * e + 0.04 * Math.sin(e * 0.9 + 1) * Math.exp(-0.01 * e);
const E_STAR = 42;

export function LossCurves() {
  const [epoch, setEpoch] = useState(42);
  const xr: [number, number] = [0, 100];
  const yr: [number, number] = [0, 2.6];
  const { sx, sy } = makeScales(xr, yr);
  const paths = useMemo(() => {
    const t: string[] = [];
    const v: string[] = [];
    for (let e = 0; e <= 100; e++) {
      t.push(`${e ? "L" : "M"}${sx(e).toFixed(1)},${sy(trainLoss(e)).toFixed(1)}`);
      v.push(`${e ? "L" : "M"}${sx(e).toFixed(1)},${sy(valLoss(e)).toFixed(1)}`);
    }
    return { t: t.join(" "), v: v.join(" ") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regime = epoch < 18 ? "Sottoadattamento" : epoch <= 55 ? "Buon compromesso" : "Sovradattamento";
  const gap = valLoss(epoch) - trainLoss(epoch);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block pt-3">
        <rect
          x={sx(E_STAR)}
          y={PAD.t}
          width={sx(100) - sx(E_STAR)}
          height={H - PAD.t - PAD.b}
          fill="var(--accent)"
          opacity={0.06}
        />
        <Grid xr={xr} yr={yr} sx={sx} sy={sy} xStep={20} yStep={0.5} xLabel="epoche" yLabel="perdita" />
        <line x1={sx(E_STAR)} x2={sx(E_STAR)} y1={PAD.t} y2={H - PAD.b} stroke="var(--accent)" strokeDasharray="4 4" />
        <text x={sx(E_STAR) + 6} y={PAD.t + 14} fontSize="10" className="font-mono" fill="var(--accent)">
          arresto anticipato · e* = {E_STAR}
        </text>
        <text x={sx(72)} y={PAD.t + 14} fontSize="10" className="font-mono" fill="var(--ink-3)">
          sovradattamento →
        </text>
        <motion.path
          d={paths.v}
          fill="none"
          stroke="var(--ink-2)"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeOut" }}
        />
        <motion.path
          d={paths.t}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.4}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeOut" }}
        />
        <line x1={sx(epoch)} x2={sx(epoch)} y1={PAD.t} y2={H - PAD.b} stroke="var(--ink)" strokeWidth={1} />
        <circle cx={sx(epoch)} cy={sy(trainLoss(epoch))} r={4.5} fill="var(--accent)" stroke="var(--paper)" strokeWidth={2} />
        <circle cx={sx(epoch)} cy={sy(valLoss(epoch))} r={4.5} fill="var(--ink-2)" stroke="var(--paper)" strokeWidth={2} />
        <g fontSize="10" className="font-mono">
          <line x1={W - 230} x2={W - 210} y1={H - 10} y2={H - 10} stroke="var(--accent)" strokeWidth={2.4} />
          <text x={W - 204} y={H - 7} fill="var(--ink-2)">
            addestramento
          </text>
          <line x1={W - 110} x2={W - 90} y1={H - 10} y2={H - 10} stroke="var(--ink-2)" strokeWidth={2} strokeDasharray="6 4" />
          <text x={W - 84} y={H - 7} fill="var(--ink-2)">
            validazione
          </text>
        </g>
      </svg>
      <Panel className="grid gap-4 sm:grid-cols-[1.2fr_1fr] items-end">
        <Slider label="Epoca" value={epoch} min={0} max={100} step={1} onChange={setEpoch} format={(v) => String(v)} />
        <div className="grid grid-cols-3 gap-3">
          <Readout label="L train" value={trainLoss(epoch).toFixed(3)} />
          <Readout label="L val" value={valLoss(epoch).toFixed(3)} />
          <Readout label="divario" value={gap.toFixed(3)} />
        </div>
        <p className="sm:col-span-2 text-[13px] text-ink-2">
          Regime: <span className="font-semibold text-ink">{regime}</span>
          {regime === "Sovradattamento" &&
            " — la perdita di addestramento continua a scendere mentre quella di validazione risale: il modello memorizza il rumore."}
          {regime === "Sottoadattamento" && " — entrambe le perdite sono alte: il modello non ha ancora catturato la struttura dei dati."}
          {regime === "Buon compromesso" && " — il divario è piccolo e la perdita di validazione è vicina al suo minimo."}
        </p>
      </Panel>
    </div>
  );
}
