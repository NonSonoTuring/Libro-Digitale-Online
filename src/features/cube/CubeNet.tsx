import { useState, type CSSProperties, type ReactNode } from "react";
import { animate } from "framer-motion";
import { Button, Panel, Slider } from "@/components/ui";

const S = 78;

function Face({ n }: { n: ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center border border-ink/80"
      style={{
        background: "color-mix(in oklab, var(--accent) 24%, var(--paper-2))",
        backfaceVisibility: "visible",
      }}
    >
      <span className="font-display text-2xl text-ink/60">{n}</span>
    </div>
  );
}

const hinge: CSSProperties = { position: "absolute", width: S, height: S, transformStyle: "preserve-3d" };

/** Sviluppo piano (a croce) che si ripiega in un cubo. Le facce opposte sommano a 7. */
export function CubeNet() {
  const [fold, setFold] = useState(0);
  const [spin, setSpin] = useState(-32);
  const [tilt, setTilt] = useState(58);

  const toggle = () => {
    const to = fold > 0.5 ? 0 : 1;
    animate(fold, to, { duration: 1.8, ease: [0.65, 0, 0.35, 1], onUpdate: setFold });
  };

  const a = 90 * fold;
  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: 400, perspective: 1300 }}>
        {/* piano d'appoggio */}
        <div
          className="absolute left-1/2 top-1/2 border border-rule"
          style={{
            width: S * 5,
            height: S * 5,
            transform: `translate(-50%, -50%) rotateX(${tilt}deg) rotateZ(${spin}deg) translateY(${S * 0.5}px)`,
            background:
              "repeating-linear-gradient(0deg, transparent 0 77px, color-mix(in oklab, var(--rule) 70%, transparent) 77px 78px), repeating-linear-gradient(90deg, transparent 0 77px, color-mix(in oklab, var(--rule) 70%, transparent) 77px 78px)",
            marginTop: 30,
          }}
        />
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: S,
            height: S,
            marginTop: 30,
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateX(${tilt}deg) rotateZ(${spin}deg)`,
          }}
        >
          {/* base */}
          <div style={{ ...hinge, left: 0, top: 0 }}>
            <Face n="1" />
            {/* nord → trascina con sé la faccia superiore */}
            <div style={{ ...hinge, left: 0, top: -S, transformOrigin: "50% 100%", transform: `rotateX(${-a}deg)` }}>
              <Face n="2" />
              <div style={{ ...hinge, left: 0, top: -S, transformOrigin: "50% 100%", transform: `rotateX(${-a}deg)` }}>
                <Face n="6" />
              </div>
            </div>
            {/* sud */}
            <div style={{ ...hinge, left: 0, top: S, transformOrigin: "50% 0%", transform: `rotateX(${a}deg)` }}>
              <Face n="5" />
            </div>
            {/* ovest */}
            <div style={{ ...hinge, left: -S, top: 0, transformOrigin: "100% 50%", transform: `rotateY(${a}deg)` }}>
              <Face n="3" />
            </div>
            {/* est */}
            <div style={{ ...hinge, left: S, top: 0, transformOrigin: "0% 50%", transform: `rotateY(${-a}deg)` }}>
              <Face n="4" />
            </div>
          </div>
        </div>
      </div>
      <Panel className="grid gap-x-6 gap-y-3 md:grid-cols-[auto_1fr_1fr_1fr] items-end">
        <Button onClick={toggle}>{fold > 0.5 ? "Apri lo sviluppo" : "Ripiega il cubo"}</Button>
        <Slider label="piegatura" value={fold} min={0} max={1} onChange={setFold} format={(v) => `${Math.round(v * 90)}°`} />
        <Slider label="rotazione del piano" value={spin} min={-180} max={180} step={1} onChange={setSpin} format={(v) => `${v}°`} />
        <Slider label="inclinazione" value={tilt} min={20} max={80} step={1} onChange={setTilt} format={(v) => `${v}°`} />
      </Panel>
    </div>
  );
}
