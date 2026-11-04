import { useMemo, useState } from "react";
import { Chip, Panel, Readout, Slider } from "@/components/ui";

type TKey = "char" | "_Bool" | "short" | "int" | "long" | "float" | "double";

interface TypeDef {
  name: string;
  size: number;
  min: number;
  max: number;
  step: number;
  def: number;
  range: string;
  note: string;
  write: (dv: DataView, off: number, v: number) => void;
  fmt: (v: number) => string;
}

const TYPES: Record<TKey, TypeDef> = {
  char: {
    name: "char",
    size: 1,
    min: -128,
    max: 127,
    step: 1,
    def: 67,
    range: "−128 … 127",
    note: "Un byte: contiene un carattere del set di esecuzione (tipicamente signed). 'C' vale 67.",
    write: (dv, o, v) => dv.setInt8(o, v),
    fmt: (v) => (v >= 32 && v <= 126 ? `${v}  ('${String.fromCharCode(v)}')` : `${v}`),
  },
  _Bool: {
    name: "_Bool",
    size: 1,
    min: 0,
    max: 1,
    step: 1,
    def: 1,
    range: "0 … 1",
    note: "Un byte per un valore booleano: 0 è falso, qualsiasi valore non zero viene letto come vero.",
    write: (dv, o, v) => dv.setUint8(o, v),
    fmt: (v) => (v === 1 ? "true (1)" : "false (0)"),
  },
  short: {
    name: "short",
    size: 2,
    min: -32768,
    max: 32767,
    step: 1,
    def: 0x1234,
    range: "−32 768 … 32 767",
    note: "Intero a 16 bit (tipicamente).",
    write: (dv, o, v) => dv.setInt16(o, v, true),
    fmt: String,
  },
  int: {
    name: "int",
    size: 4,
    min: -2147483648,
    max: 2147483647,
    step: 1,
    def: 0x12345678,
    range: "−2 147 483 648 … 2 147 483 647",
    note: "Intero a 32 bit (tipicamente): il tipo «naturale» per i numeri interi della macchina.",
    write: (dv, o, v) => dv.setInt32(o, v, true),
    fmt: String,
  },
  long: {
    name: "long",
    size: 8,
    min: -1e15,
    max: 1e15,
    step: 1,
    def: 1311768467463790320,
    range: "almeno 64 bit",
    note: "Su Linux x86-64 occupa 8 byte (0x123456789ABCDEF0 qui). I valori grandi richiedono l'aritmetica a 64 bit.",
    write: (dv, o, v) => dv.setBigInt64(o, BigInt(Math.trunc(v)), true),
    fmt: String,
  },
  float: {
    name: "float",
    size: 4,
    min: -100,
    max: 100,
    step: 0.01,
    def: 3.14,
    range: "≈ ±3,4·10^38 · 6–7 cifre",
    note: "Virgola mobile a precisione singola (IEEE 754, 32 bit).",
    write: (dv, o, v) => dv.setFloat32(o, v, true),
    fmt: (v) => v.toFixed(4),
  },
  double: {
    name: "double",
    size: 8,
    min: -1000,
    max: 1000,
    step: 0.001,
    def: 3.14159,
    range: "≈ ±1,8·10^308 · 15–16 cifre",
    note: "Virgola mobile a precisione doppia (IEEE 754, 64 bit): il tipo reale standard del C.",
    write: (dv, o, v) => dv.setFloat64(o, v, true),
    fmt: (v) => v.toFixed(5),
  },
};

const ORDER = Object.keys(TYPES) as TKey[];

export function TypeExplorer() {
  const [key, setKey] = useState<TKey>("int");
  const [value, setValue] = useState(TYPES.int.def);
  const t = TYPES[key];

  const bytes = useMemo(() => {
    const buf = new ArrayBuffer(t.size);
    const dv = new DataView(buf);
    t.write(dv, 0, value);
    return Array.from({ length: t.size }, (_, i) => dv.getUint8(i));
  }, [t, value]);

  const select = (k: TKey) => {
    setKey(k);
    setValue(TYPES[k].def);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">In memoria</div>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">Un valore, byte per byte</h3>
        </div>
        <span className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-accent">{t.name}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ORDER.map((k) => (
          <Chip key={k} active={k === key} onClick={() => select(k)}>
            {TYPES[k].name}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Celle di memoria (esadecimale)</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bytes.map((b, i) => (
              <div
                key={i}
                className="flex h-14 w-11 flex-col items-center justify-center rounded-md border border-rule bg-paper"
              >
                <span className="font-mono text-[13px] tabular-nums text-ink">{b.toString(16).padStart(2, "0")}</span>
                <span className="mt-0.5 font-mono text-[9px] text-ink-3">+{i}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-3">
            Ordine little-endian: il byte meno significativo occupa l'indirizzo più basso (tipico di x86-64).
          </p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Readout label="sizeof" value={`${t.size} byte`} />
            <Readout label="Valore" value={t.fmt(value)} />
            <Readout label="Intervallo" value={t.range} />
          </div>
          <Slider
            label={`Valore di tipo ${t.name}`}
            value={value}
            min={t.min}
            max={t.max}
            step={t.step}
            onChange={setValue}
            format={t.fmt}
          />
          <p className="text-[13px] leading-relaxed text-ink-2">{t.note}</p>
        </div>
      </div>

      <Panel className="mt-4">
        <p className="text-xs leading-relaxed text-ink-3">
          Le dimensioni e gli intervalli dipendono dall'implementazione: <strong>sizeof</strong> e gli header{" "}
          <strong>limits.h</strong> / <strong>float.h</strong> dicono i valori reali della macchina su cui compili.
        </p>
      </Panel>
    </div>
  );
}
