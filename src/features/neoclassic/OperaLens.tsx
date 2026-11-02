import { useState } from "react";

type OperaKey = "amore" | "grazie" | "monumento" | "paolina" | "orazi" | "marat" | "marte";
type Lens = "composizione" | "gesto" | "significato";

const lenses: { id: Lens; label: string; description: string }[] = [
  { id: "composizione", label: "Composizione", description: "Segui l'asse e le masse: la forma guida lo sguardo prima ancora del racconto." },
  { id: "gesto", label: "Gesto", description: "Osserva mani, inclinazioni e direzioni: il movimento è concentrato in pochi gesti leggibili." },
  { id: "significato", label: "Significato", description: "La scena trasforma un mito, un evento o un ritratto in un'immagine di valore universale." },
];

const titles: Record<OperaKey, string> = {
  amore: "Amore e Psiche", grazie: "Le Tre Grazie", monumento: "Monumento a Maria Cristina", paolina: "Paolina Borghese",
  orazi: "Il giuramento degli Orazi", marat: "La morte di Marat", marte: "Marte disarmato",
};

function Figure({ x, y, scale = 1, tilt = 0 }: { x: number; y: number; scale?: number; tilt?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="0" cy="-36" r="11" fill="var(--paper-2)" />
    <path d="M0 -24 C-8 -8 -12 7 -10 25 M-7 -12 C-23 -3 -27 7 -32 14 M-6 -8 C10 -13 20 -20 27 -31 M-10 24 L-22 49 M-10 24 L8 48" />
  </g>;
}

function Scene({ work, lens }: { work: OperaKey; lens: Lens }) {
  const accent = "var(--accent)";
  return <svg viewBox="0 0 640 300" role="img" aria-label={`Schema interpretativo di ${titles[work]}`} className="block w-full" style={{ color: "var(--ink)" }}>
    <path d="M54 248V112a266 266 0 0 1 532 0v136" fill="none" stroke="var(--rule)" strokeWidth="2" />
    <line x1="42" y1="250" x2="598" y2="250" stroke="var(--rule)" strokeWidth="2" />
    {work === "amore" && <g>
      <Figure x={270} y={191} scale={1.13} tilt={-18} /><Figure x={356} y={183} scale={1.08} tilt={17} />
      <path d="M261 173 C281 124 326 127 357 164 C337 144 305 143 291 167 M278 212 C316 240 357 229 378 202" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      <circle cx="319" cy="174" r="63" fill="none" stroke="var(--rule)" strokeDasharray="4 7" />
    </g>}
    {work === "grazie" && <g>
      <Figure x={260} y={199} scale={1.08} tilt={-11} /><Figure x={322} y={191} scale={1.12} /><Figure x={384} y={199} scale={1.08} tilt={11} />
      <path d="M260 188 C279 219 301 228 322 204 C343 228 367 219 384 188" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    </g>}
    {work === "monumento" && <g>
      <path d="M320 58 L444 242 H196 Z" fill="var(--paper-3)" stroke="currentColor" strokeWidth="3" />
      <path d="M220 242 C255 198 278 183 320 181 C362 183 386 199 420 242" fill="none" stroke={accent} strokeWidth="5" />
      <circle cx="320" cy="110" r="22" fill="var(--paper-2)" stroke="currentColor" strokeWidth="3" />
      <path d="M320 133v43m-1-23-34 24m35-24 33 23m-33 0-25 44m26-44 27 45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M230 242l-33 0m246 0 33 0" stroke={accent} strokeWidth="5" />
    </g>}
    {work === "paolina" && <g>
      <path d="M166 211 C214 190 259 192 298 202 C341 213 399 205 466 177" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <circle cx="466" cy="166" r="19" fill="var(--paper-2)" stroke="currentColor" strokeWidth="4" />
      <path d="M214 196 C231 155 276 143 311 173 M293 204 C320 160 365 153 395 185 M253 202l-28 36m99-34 27 37m57-55 28 43" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      <circle cx="251" cy="153" r="13" fill="var(--paper-3)" stroke="currentColor" strokeWidth="3" />
    </g>}
    {work === "orazi" && <g>
      {[205, 260, 315].map((x, i) => <Figure key={x} x={x} y={208} scale={0.88} tilt={-4 + i * 4} />)}
      <path d="M192 159l86-55 84 55m-84-55v-17m-65 74 65-13 65 13" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <Figure x={431} y={211} scale={0.92} tilt={24} /><Figure x={484} y={220} scale={0.82} tilt={30} />
      <path d="M397 165 C438 145 476 166 516 210" fill="none" stroke="var(--rule)" strokeWidth="4" />
    </g>}
    {work === "marat" && <g>
      <path d="M154 192h334v57H154z" fill="var(--paper-3)" stroke="currentColor" strokeWidth="3" />
      <path d="M196 190 C238 163 324 166 373 187 L421 206" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
      <circle cx="188" cy="177" r="18" fill="var(--paper-2)" stroke="currentColor" strokeWidth="4" />
      <path d="M371 185l61-43m-3 4 30 24m-207 61 25 20" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M432 128l18-17 12 23-18 17z" fill="var(--paper-2)" stroke="currentColor" strokeWidth="2" />
    </g>}
    {work === "marte" && <g>
      <Figure x={323} y={209} scale={1.08} /><Figure x={243} y={207} scale={0.9} tilt={-20} /><Figure x={417} y={208} scale={0.88} tilt={17} />
      <circle cx="322" cy="133" r="37" fill="none" stroke={accent} strokeWidth="4" />
      <path d="M241 165 Q322 87 415 165 M244 167l-35-35m207 34 35-35" fill="none" stroke="var(--rule)" strokeWidth="4" strokeLinecap="round" />
      <path d="M297 208l-20 40m51-39 27 38" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    </g>}
    {lens === "composizione" && <path d="M138 229 Q316 54 505 224" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="7 7" opacity="0.9" />}
    {lens === "gesto" && <g fill="var(--paper)" stroke={accent} strokeWidth="3"><circle cx="320" cy="166" r="39" /><circle cx="278" cy="115" r="10" /><circle cx="366" cy="119" r="10" /></g>}
    {lens === "significato" && <g fill="none" stroke={accent} strokeWidth="3"><circle cx="320" cy="164" r="79" strokeDasharray="2 8" /><path d="M306 164h28m-14-14v28" /></g>}
    <text x="320" y="281" textAnchor="middle" fill="var(--ink-3)" fontSize="11" letterSpacing="2" fontFamily="var(--font-mono)">SCHEMA DIDATTICO · NON È UNA RIPRODUZIONE</text>
  </svg>;
}

export function OperaLens({ work }: { work: OperaKey }) {
  const [lens, setLens] = useState<Lens>("composizione");
  const activeLens = lenses.find((item) => item.id === lens)!;
  return <div className="opera-lens">
    <div className="opera-lens-heading">
      <span className="eyebrow">Atelier dello sguardo</span>
      <strong>{titles[work]}</strong>
    </div>
    <div className="opera-lens-controls" role="group" aria-label={`Lenti di lettura per ${titles[work]}`}>
      {lenses.map((item) => <button key={item.id} type="button" aria-pressed={lens === item.id} onClick={() => setLens(item.id)}>{item.label}</button>)}
    </div>
    <Scene work={work} lens={lens} />
    <p className="opera-lens-note" aria-live="polite"><strong>{activeLens.label}.</strong> {activeLens.description}</p>
  </div>;
}
