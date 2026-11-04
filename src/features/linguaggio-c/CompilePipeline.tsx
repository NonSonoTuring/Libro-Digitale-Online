import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Panel, Readout } from "@/components/ui";

const STEPS = [
  {
    file: "ciao.c",
    phase: "Sorgente",
    cmd: "(il file che scrivi tu)",
    desc: "Testo leggibile, fatto di direttive, dichiarazioni e istruzioni. Non è ancora eseguibile: la macchina non lo capisce.",
    preview: ["#include <stdio.h>", "", "int main(void)", "{", '    printf("Ciao, mondo!\\n");', "    return 0;", "}"],
  },
  {
    file: "ciao.i",
    phase: "Preprocessore",
    cmd: "gcc -E ciao.c -o ciao.i",
    desc: "Le direttive vengono elaborate: #include viene sostituito con il contenuto degli header. Il file cresce enormemente (migliaia di righe da stdio.h) e resta testo C.",
    preview: [
      '# 1 "ciao.c"',
      '# 1 "<built-in>"',
      '…',
      "extern int printf (const char *__restrict __format, ...);",
      "extern int scanf (const char *__restrict __format, ...);",
      "… altre dichiarazioni di stdio.h …",
      "",
      "int main(void)",
      "{",
      '    printf("Ciao, mondo!\\n");',
      "    return 0;",
      "}",
    ],
  },
  {
    file: "ciao.s",
    phase: "Compilatore",
    cmd: "gcc -S ciao.c -o ciao.s",
    desc: "Il C viene tradotto in assembly per l'architettura della macchina (qui x86-64): istruzioni a basso livello, ma ancora leggibili come testo.",
    preview: [
      '    .file   "ciao.c"',
      "    .text",
      "    .section    .rodata",
      ".LC0:",
      '    .string "Ciao, mondo!"',
      "    .text",
      "    .globl  main",
      "    .type   main, @function",
      "main:",
      "    pushq   %rbp",
      "    movq    %rsp, %rbp",
      "    leaq    .LC0(%rip), %rax",
      "    movq    %rax, %rdi",
      "    call    printf",
      "    movl    $0, %eax",
      "    popq    %rbp",
      "    ret",
    ],
  },
  {
    file: "ciao.o",
    phase: "Assemblatore",
    cmd: "gcc -c ciao.c -o ciao.o",
    desc: "L'assembly diventa codice macchina binario, impacchettato in un file oggetto (formato ELF): non è più leggibile come testo, ma non è ancora eseguibile.",
    preview: [
      "ELF 64-bit LSB relocatable, x86-64, version 1 (SYSV)",
      "",
      "SYMBOL TABLE:",
      "0000000000000000 T main",
      "0000000000000000 U printf",
      "… sezioni .text .rodata …",
    ],
  },
  {
    file: "ciao",
    phase: "Linker",
    cmd: "gcc ciao.c -o ciao",
    desc: "Il linker unisce il codice oggetto con le librerie del sistema (printf vive nella libc) e produce l'eseguibile. Con un solo comando gcc esegue tutti e quattro i passaggi.",
    preview: ["$ ./ciao", "Ciao, mondo!", "$ echo $?", "0"],
  },
];

export function CompilePipeline() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Toolchain</div>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">Dal sorgente all'eseguibile</h3>
        </div>
        <span className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-accent">{s.phase}</span>
      </div>

      <ol className="mt-4 flex flex-wrap items-center gap-y-2">
        {STEPS.map((st, i) => (
          <li key={st.file} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-pressed={step === i}
              className={
                "rounded-full border px-3 py-1 font-mono text-[12px] transition-all duration-200 " +
                (step === i
                  ? "border-accent bg-accent text-paper"
                  : "border-rule bg-paper text-ink-2 hover:border-accent hover:text-accent")
              }
            >
              <span className="mr-1.5 text-[10px] opacity-70">{i + 1}</span>
              {st.file}
            </button>
            {i < STEPS.length - 1 && <span className="mx-1.5 text-ink-3">→</span>}
          </li>
        ))}
      </ol>

      <div className="mt-4 overflow-hidden rounded-md border border-rule bg-paper/70">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-4 py-2.5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              Fase {step + 1} di {STEPS.length} — {s.phase}
            </div>
            <div className="mt-0.5 font-mono text-[13px] text-ink">{s.cmd}</div>
          </div>
          <span className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-accent">{s.file}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-4"
          >
            <p className="text-[13.5px] leading-relaxed text-ink-2">{s.desc}</p>
            <pre className="mt-3 max-h-64 overflow-auto rounded-md border border-rule/70 bg-paper p-3 font-mono text-[11.5px] leading-relaxed text-ink-2">
              {s.preview.join("\n")}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>

      <Panel className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="ghost" onClick={() => setStep((v) => Math.max(0, v - 1))} disabled={step === 0}>
          ← Indietro
        </Button>
        <Button onClick={() => setStep((v) => Math.min(STEPS.length - 1, v + 1))} disabled={step === STEPS.length - 1}>
          Avanti →
        </Button>
        <Button variant="ghost" onClick={() => setStep(0)}>
          Ricomincia
        </Button>
        <span className="flex-1" />
        <Readout label="Fase" value={`${step + 1} / ${STEPS.length}`} />
      </Panel>
    </div>
  );
}
