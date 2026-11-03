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

## File e cartelle principali

### `src/`
Contiene i file sorgente da modificare: contenuti, componenti, stili e codice dell'applicazione. Durante la build, questi file vengono trasformati nei file finali del sito.

### `src/contenuti/argomenti/Argomento1/argomento.ts`
Contiene le informazioni generali dell'argomento, come titolo, descrizione e ordine dei capitoli. Il sito usa questi dati per creare l'indice e la navigazione.

### `src/contenuti/argomenti/Argomento1/capitoli/Capitolo1/capitolo.mdx`
Contiene il testo del capitolo. Le sezioni si scrivono come titoli Markdown, per esempio `## Sezione`; nel testo si possono anche richiamare componenti interattivi.

### `src/contenuti/argomenti/Argomento1/assets-condivisi/`
Qui vanno le risorse statiche usate in più capitoli dello stesso argomento. Ad esempio, una copertina o uno schema SVG riutilizzato in più punti. Una risorsa condivisa si salva una volta sola e viene richiamata dai capitoli che la usano.

### `src/contenuti/argomenti/Argomento1/capitoli/Capitolo1/assets/`
In `assets/` vanno le risorse statiche usate solo da quel capitolo: immagini PNG, JPG o WebP, SVG statici, schemi non interattivi, audio e video. Se una risorsa serve a più capitoli, va invece in `assets-condivisi/`.

### `src/features/Argomento1/`
Qui vanno i componenti React con codice e logica interattiva: diagrammi che reagiscono ai clic, grafici modificabili con cursori o pulsanti, visualizzazioni che cambiano in base ai dati e animazioni controllate dall'utente. Il file `.mdx` richiama il componente nel punto in cui deve apparire; il componente non va messo in `assets/`.

### `src/components/layout/` e `src/components/contenuti/`
`layout/` contiene gli elementi comuni delle pagine, come testata e piè di pagina. `contenuti/` contiene elementi didattici riutilizzabili, come figure con didascalia, formule, quiz e riquadri esplicativi.

### `src/entry-server.tsx`, `src/entry-client.tsx` e `scripts/prerender.ts`
Durante la build, `scripts/prerender.ts` prepara le pagine da generare e `entry-server.tsx` produce il loro HTML. `entry-client.tsx` avvia nel browser il codice necessario alle interazioni.

### `src/styles/`
Contiene gli stili condivisi. `tokens.css` raccoglie i valori grafici, `themes.css` gestisce tema chiaro e scuro, mentre `base.css` definisce gli stili generali.

### `public/`
Contiene file statici serviti con un indirizzo fisso, come favicon e file scaricabili. Le immagini specifiche dei capitoli si tengono invece accanto al capitolo, in `assets/`.

### `dist/`
Contiene il sito generato dalla build, con le pagine HTML finali e le risorse compilate. Non è una cartella da modificare a mano: si rigenera a partire dai file sorgente.


## Composizione della Home e contenitore editoriale

- `src/App.tsx` monta l'applicazione su un wrapper radice a piena larghezza e conserva tema e routing.
- `src/components/layout/Header.tsx` usa `.book-container` per allineare la testata alla colonna editoriale.
- Il percorso **Linguaggio C** è registrato come `linguaggio-c` in `src/data/topics.ts`; i capitoli sono file MDX separati sotto `src/contenuti/argomenti/linguaggio-c/capitoli/` e i componenti didattici dedicati sono registrati in `src/components/content/linguaggio-c.tsx`.
- `src/components/Home.tsx` compone hero, ticker a tutta larghezza e griglia dei percorsi. Non contiene un catalogo parallelo: legge `src/data/topics.ts` e calcola statistiche e voci del ticker dai capitoli registrati.
- `.book-container` è definito in `src/styles/home.css`: larghezza 100%, larghezza massima 1280 px, margini laterali automatici e padding fluido. È applicato ai contenuti interni, non ai divisori o alle strisce che devono attraversare l'intero viewport.
- Gli stili editoriali della Home e delle schede si trovano in `src/styles/home.css`; le varianti cromatiche terra e i token di superficie restano centralizzati in `src/styles/tokens.css`, `src/styles/themes.css` e `src/styles/book.css`.
