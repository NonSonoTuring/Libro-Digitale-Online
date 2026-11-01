import { useEffect, useRef } from "react";

interface Props {
  layers?: number[];
  labels?: string[];
  height?: number;
  density?: number; // impulsi al secondo dallo strato di ingresso
}

interface Node {
  x: number;
  y: number;
  l: number;
  i: number;
  act: number;
}
interface Pulse {
  from: Node;
  to: Node;
  t: number;
  v: number;
}

/** Rete neurale "viva": impulsi che si propagano in avanti tra gli strati. */
export function NeuralNet({ layers = [4, 6, 6, 3], labels, height = 360, density = 5 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const key = layers.join("-");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: Node[][] = [];
    let pulses: Pulse[] = [];
    const weights = new Map<string, number>();
    let mouse: { x: number; y: number } | null = null;
    let raf = 0;
    let colors = { accent: "#3f6e77", ink: "#2b2824", ink3: "#8e877b", paper: "#f7f2e9" };
    let lastColorRead = 0;

    // pesi pseudo-casuali ma deterministici (per avere spessori stabili)
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let l = 0; l < layers.length - 1; l++)
      for (let i = 0; i < layers[l]; i++)
        for (let j = 0; j < layers[l + 1]; j++) weights.set(`${l}-${i}-${j}`, rand() * 2 - 1);

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors = {
        accent: cs.getPropertyValue("--accent").trim() || colors.accent,
        ink: cs.getPropertyValue("--ink").trim() || colors.ink,
        ink3: cs.getPropertyValue("--ink-3").trim() || colors.ink3,
        paper: cs.getPropertyValue("--paper").trim() || colors.paper,
      };
    };

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const padX = Math.min(90, w * 0.12);
      const L = layers.length;
      nodes = layers.map((n, l) => {
        const x = padX + (l * (w - 2 * padX)) / (L - 1);
        const spacing = Math.min(46, (h - 70) / Math.max(n - 1, 1));
        return Array.from({ length: n }, (_, i) => ({
          x,
          y: h / 2 - 6 + (i - (n - 1) / 2) * spacing,
          l,
          i,
          act: 0,
        }));
      });
      pulses = [];
    };

    const spawnFrom = (node: Node) => {
      const next = nodes[node.l + 1];
      if (!next) return;
      const count = 1 + (Math.random() < 0.5 ? 1 : 0);
      for (let k = 0; k < count; k++) {
        const to = next[Math.floor(Math.random() * next.length)];
        pulses.push({ from: node, to, t: 0, v: 0.9 + Math.random() * 0.6 });
      }
    };

    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    layout();
    readColors();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (mouse = null);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now - lastColorRead > 600) {
        readColors();
        lastColorRead = now;
      }

      // nuovi impulsi dallo strato di ingresso
      if (Math.random() < dt * density) {
        const input = nodes[0];
        const n = input[Math.floor(Math.random() * input.length)];
        n.act = 1;
        spawnFrom(n);
      }

      // avanzamento impulsi
      const alive: Pulse[] = [];
      for (const p of pulses) {
        p.t += dt * p.v * 1.2;
        if (p.t >= 1) {
          p.to.act = 1;
          if (Math.random() < 0.75) spawnFrom(p.to);
        } else alive.push(p);
      }
      pulses = alive.slice(-220);

      // nodo più vicino al cursore
      let hot: Node | null = null;
      if (mouse) {
        let best = 22 * 22;
        for (const col of nodes)
          for (const n of col) {
            const d = (n.x - mouse.x) ** 2 + (n.y - mouse.y) ** 2;
            if (d < best) {
              best = d;
              hot = n;
            }
          }
      }

      ctx.clearRect(0, 0, w, h);

      // connessioni
      for (let l = 0; l < nodes.length - 1; l++) {
        for (const a of nodes[l]) {
          for (const b of nodes[l + 1]) {
            const wt = weights.get(`${l}-${a.i}-${b.i}`) ?? 0;
            const related = hot && (hot === a || hot === b);
            const dim = hot && !related;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineWidth = related ? 1.6 : 0.4 + Math.abs(wt) * 1.3;
            ctx.strokeStyle = wt >= 0 ? colors.accent : colors.ink3;
            ctx.globalAlpha = related ? 0.9 : dim ? 0.04 : 0.1 + Math.abs(wt) * 0.12;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // impulsi
      for (const p of pulses) {
        const e = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
        const x = p.from.x + (p.to.x - p.from.x) * e;
        const y = p.from.y + (p.to.y - p.from.y) * e;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, colors.accent);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.paper;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodi
      for (const col of nodes) {
        for (const n of col) {
          n.act *= Math.exp(-dt * 2.6);
          const r = 9 + n.act * 3;
          if (n.act > 0.02) {
            const g = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, r + 16 * n.act);
            g.addColorStop(0, colors.accent);
            g.addColorStop(1, "transparent");
            ctx.globalAlpha = n.act * 0.55;
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 16 * n.act, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = colors.paper;
          ctx.fill();
          ctx.lineWidth = hot === n ? 2 : 1.2;
          ctx.strokeStyle = hot === n ? colors.accent : colors.ink;
          ctx.stroke();
          // riempimento proporzionale all'attivazione
          ctx.beginPath();
          ctx.arc(n.x, n.y, (r - 3) * Math.min(1, n.act * 1.4), 0, Math.PI * 2);
          ctx.fillStyle = colors.accent;
          ctx.fill();
        }
      }

      // etichette degli strati
      ctx.font = '500 10px "IBM Plex Mono", monospace';
      ctx.fillStyle = colors.ink3;
      ctx.textAlign = "center";
      nodes.forEach((col, l) => {
        const label = labels?.[l] ?? (l === 0 ? "input" : l === nodes.length - 1 ? "output" : `hidden ${l}`);
        ctx.fillText(label.toUpperCase(), col[0].x, h - 14);
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, density]);

  return <canvas ref={ref} className="block w-full cursor-crosshair" style={{ height }} />;
}
