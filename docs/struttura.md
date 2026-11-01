# Struttura del progetto

```text
src/
├── contenuti/
│   └── argomenti/
│       └── Argomento1/
│           ├── assets-condivisi/              ─── Risorse statiche usate in più capitoli
│           │   ├── copertina.webp
│           │   └── schema-comune.svg
│           └── capitoli/
│               ├── Capitolo1/
│               │   ├── capitolo.mdx           ─── Testo e sezioni del capitolo
│               │   └── assets/                ─── Risorse statiche usate solo qui
│               │       ├── immagine.png
│               │       ├── schema.svg
│               │       ├── audio.mp3
│               │       └── video.mp4
│               ├── Capitolo2/
│               │   ├── capitolo.mdx           ─── Testo e sezioni del capitolo
│               │   └── assets/                ─── Risorse statiche usate solo qui
│               └── Capitolo3/
│                   ├── capitolo.mdx           ─── Testo e sezioni del capitolo
│                   └── assets/                ─── Risorse statiche usate solo qui
│
└── features/
    └── Argomento1/                            ─── Interazioni specifiche dell'argomento
        ├── DiagrammaInterattivo.tsx            ─── Diagramma controllato dall'utente
        └── GraficoInterattivo.tsx              ─── Grafico con controlli o dati dinamici
```

In `assets/` vanno le risorse statiche: immagini PNG, JPG o WebP, SVG statici, schemi non interattivi, audio e video. Se una risorsa è usata da più capitoli, va in `assets-condivisi/`; se serve a un solo capitolo, va nella cartella `assets/` di quel capitolo.

In `features/Argomento1/` vanno invece i componenti con codice: diagrammi che reagiscono ai clic, grafici modificabili con cursori o pulsanti, visualizzazioni che cambiano in base ai dati e animazioni controllate dall'utente. Il file `.mdx` richiama questi componenti nel punto in cui devono comparire.
