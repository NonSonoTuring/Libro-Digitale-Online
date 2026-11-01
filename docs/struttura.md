# Struttura del progetto

```text
progetto/
├── README.md                              ─── Spiega il progetto e come avviarlo
├── AGENTS.md                              ─── Contiene le istruzioni per l'IA
├── package.json                           ─── Elenca dipendenze e comandi
├── vite.config.ts                         ─── Configura Vite e MDX
├── index.html                             ─── Template HTML usato durante la build
│
├── docs/
│   ├── struttura.md                       ─── Documenta l'organizzazione del progetto
│   ├── contenuti.md                       ─── Spiega come scrivere i capitoli
│   ├── stile.md                           ─── Documenta stili e temi
│   └── interattivita.md                   ─── Spiega grafici e animazioni
│
├── public/
│   ├── favicon.svg                        ─── Contiene l'icona del sito
│   └── downloads/                         ─── Contiene file scaricabili
│
├── scripts/
│   └── prerender.ts                       ─── Genera l'HTML statico per ogni pagina
│
├── src/
│   ├── entry-server.tsx                   ─── Prepara le pagine HTML durante la build
│   ├── entry-client.tsx                   ─── Avvia le interazioni nel browser
│   │
│   ├── contenuti/
│   │   └── argomenti/
│   │       └── Argomento1/
│   │           ├── argomento.ts           ─── Contiene titolo e dati dell'argomento
│   │           ├── assets-condivisi/      ─── Risorse statiche condivise tra capitoli
│   │           └── capitoli/
│   │               ├── Capitolo1/
│   │               │   ├── capitolo.mdx  ─── Contiene testo e sezioni
│   │               │   └── assets/       ─── Risorse statiche usate solo qui
│   │               └── Capitolo2/
│   │                   ├── capitolo.mdx  ─── Contiene testo e sezioni
│   │                   └── assets/       ─── Risorse statiche usate solo qui
│   │
│   ├── components/
│   │   ├── layout/                         ─── Header, footer e struttura comune
│   │   └── contenuti/                      ─── Figure, formule, quiz e riquadri
│   │
│   ├── features/
│   │   └── Argomento1/                    ─── Codice dei componenti interattivi
│   │       ├── DiagrammaInterattivo.tsx
│   │       └── GraficoInterattivo.tsx
│   │
│   ├── runtime/
│   │   └── carica-interazioni.tsx         ─── Carica le interazioni nelle pagine che le usano
│   │
│   └── styles/
│       ├── tokens.css                     ─── Definisce colori, font e spaziature
│       ├── themes.css                     ─── Definisce tema chiaro e scuro
│       └── base.css                       ─── Definisce gli stili generali
│
└── dist/                                   ─── Contiene il sito generato, non i sorgenti
    ├── index.html                          ─── HTML della home
    └── argomenti/
        └── Argomento1/
            ├── index.html                  ─── HTML dell'indice dell'argomento
            └── Capitolo1/
                └── index.html              ─── HTML generato dal capitolo MDX
```

`capitolo.mdx` viene trasformato in HTML durante la build; i componenti interattivi vengono caricati separatamente nelle pagine che li utilizzano. `dist/` è il risultato generato, mentre `src/` contiene i file da modificare.
