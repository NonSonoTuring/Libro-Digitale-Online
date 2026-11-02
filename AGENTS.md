# AGENTS.md — Guida per l'IA

Questo file istruisce l'LLM su come orientarsi nel progetto, capire dove si trova il codice responsabile di una funzione e intervenire senza rompere le parti collegate. È una guida pratica all'architettura e alle procedure di lavoro, non un catalogo dei contenuti presenti.

**Prima di iniziare qualsiasi attività, leggi per intero tutti i file dentro `docs/` e poi questo `AGENTS.md`.** Durante il lavoro verifica sempre i percorsi e i collegamenti nel codice: gli esempi della documentazione possono non riflettere più l'implementazione.

# 1. Il progetto

Libro Digitale Online è una piattaforma web per creare e consultare percorsi didattici digitali. Ogni percorso organizza materiali di studio in capitoli e sezioni, combinando testo, immagini, formule, elementi didattici e strumenti interattivi.

Il progetto unisce una parte editoriale — che presenta e spiega i concetti — a una parte applicativa — che permette di esplorarli attraverso visualizzazioni e interazioni. L'obiettivo è rendere lo studio chiaro, approfondito e partecipativo.

I contenuti possono cambiare liberamente: non considerare mai fissi gli argomenti, i capitoli, le immagini o i componenti disponibili. Le loro definizioni si trovano nei rispettivi file sorgente.

# 2. Mappa del progetto

La struttura da conoscere è questa. I nomi tra parentesi angolari indicano cartelle o file variabili, da verificare nel repository.

```text
/
├── AGENTS.md
├── README.md
├── docs/
│   ├── contenuti.md
│   ├── struttura.md
│   ├── interattivita.md
│   └── stile.md
├── public/
│   ├── images/
│   └── downloads/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── assets/
│   │   └── images/
│   ├── contenuti/
│   │   └── argomenti/
│   │       └── <argomento>/
│   │           ├── assets-condivisi/
│   │           └── capitoli/
│   │               └── <capitolo>/
│   │                   ├── capitolo.mdx
│   │                   └── assets/
│   ├── components/
│   │   ├── Home.tsx
│   │   ├── CourseIndex.tsx
│   │   ├── ChapterPage.tsx
│   │   ├── ui.tsx
│   │   ├── content/
│   │   └── layout/
│   ├── data/
│   │   ├── topics.ts
│   │   ├── chapter-meta.json
│   │   └── types.ts
│   ├── features/
│   │   └── <area>/
│   ├── lib/
│   ├── runtime/
│   ├── styles/
│   └── utils/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── .github/
    └── workflows/
```

## Responsabilità delle aree

- **`src/main.tsx`** avvia l'applicazione e importa gli stili globali.
- **`src/App.tsx`** compone l'applicazione e gestisce navigazione e stato globale.
- **`src/data/`** contiene le definizioni strutturate dei percorsi, i metadati e i tipi dei dati.
- **`src/contenuti/`** contiene i testi dei capitoli in MDX e le risorse che appartengono ai contenuti.
- **`src/components/`** contiene pagine, layout, interfaccia e componenti condivisi.
- **`src/components/content/`** collega i componenti React ai nomi utilizzabili nei documenti MDX.
- **`src/features/`** contiene la logica e la visualizzazione delle esperienze interattive.
- **`src/lib/` e `src/utils/`** raccolgono funzioni e strumenti condivisi.
- **`src/styles/`** contiene gli stili globali, i temi e le regole di presentazione.
- **`src/assets/`** contiene risorse importate direttamente dai moduli del codice.
- **`public/`** contiene risorse statiche servite tramite percorso pubblico.
- **`docs/`** contiene le istruzioni per contenuti, struttura, interattività e stile.
- **`package.json`, `vite.config.ts`, `tsconfig.json` e `.github/workflows/`** governano strumenti, compilazione, configurazione e pubblicazione.

# 3. Dove intervenire

| Cosa devi modificare | Dove cercare |
|---|---|
| Avvio dell'applicazione | `src/main.tsx` |
| Navigazione, rotte e stato globale | `src/App.tsx` |
| Struttura e dati dei percorsi/capitoli | `src/data/topics.ts`, `src/data/types.ts` |
| Metadati dei capitoli | `src/data/chapter-meta.json` |
| Testo di un capitolo | `src/contenuti/argomenti/<argomento>/capitoli/<capitolo>/capitolo.mdx` |
| Immagini usate da un singolo capitolo | `src/contenuti/argomenti/<argomento>/capitoli/<capitolo>/assets/` |
| Risorse condivise tra capitoli dello stesso argomento | `src/contenuti/argomenti/<argomento>/assets-condivisi/` |
| Immagini importate da componenti React | `src/assets/images/` |
| Immagini e risorse con URL pubblico | `public/` |
| Pagine e presentazione dei contenuti | `src/components/` |
| Componenti didattici e UI condivisi | `src/components/ui.tsx` |
| Registrazione dei componenti disponibili in MDX | `src/components/content/` |
| Logica di un grafico, modello o altra interazione | `src/features/<area>/` |
| Formule matematiche | `src/lib/math.tsx` |
| Stili, colori, temi e layout | `src/styles/` |
| Funzioni di supporto | `src/lib/`, `src/utils/` |
| Dipendenze e comandi | `package.json`, `package-lock.json` |
| Configurazione e compilazione | `vite.config.ts`, `tsconfig.json`, `index.html` |
| Pubblicazione automatizzata | `.github/workflows/` |

# 4. Procedure di modifica

## Percorsi didattici e capitoli

Per aggiungere, rimuovere o modificare un percorso:
1. aggiorna la definizione in `src/data/topics.ts`;
2. verifica i metadati in `src/data/chapter-meta.json`;
3. controlla la pagina e la navigazione che mostrano il percorso;
4. verifica che gli identificatori corrispondano alle cartelle e ai file dei capitoli.

Per scrivere o modificare un capitolo:
1. intervieni nel relativo `capitolo.mdx`;
2. mantieni coerenti titoli e ordine delle sezioni con i dati del capitolo;
3. assegna a ogni sezione un ID univoco, usato anche dall'indice del capitolo;
4. importa le immagini con percorsi relativi e usa i componenti didattici già disponibili;
5. controlla formule, figure, didascalie, collegamenti e attribuzioni.

La guida dettagliata è **`docs/contenuti.md`**.

## Immagini e altre risorse

Scegli la cartella in base all'ambito della risorsa:
- solo un capitolo: cartella `assets/` accanto al suo MDX;
- più capitoli dello stesso argomento: `assets-condivisi/`;
- import diretto da un componente React: `src/assets/images/`;
- file servito con URL pubblico: `public/`.

Non duplicare risorse già presenti. Mantieni le proporzioni, ottimizza i file, inserisci testi alternativi significativi e verifica licenza e attribuzione delle immagini.

Per le modalità d'uso nei capitoli consulta **`docs/contenuti.md`**.

## Interazioni e animazioni

Per aggiungere o modificare un'interazione:
1. implementa la logica e la visualizzazione in un componente sotto `src/features/`;
2. esporta e registra il componente nel modulo pertinente sotto `src/components/content/`;
3. verifica che il caricamento dei componenti MDX lo renda disponibile al capitolo;
4. richiama il componente nel relativo file MDX.

Prima di creare una nuova soluzione, cerca componenti o funzioni riutilizzabili. Per rimuovere un'interazione, controlla e rimuovi anche i relativi import, registrazioni e richiami, senza eliminare codice ancora utilizzato altrove.

Gestisci accessibilità, tastiera, touch, stati di caricamento, errori, timer, listener, animazioni e pulizia allo smontaggio. Rispetta `prefers-reduced-motion` e considera le prestazioni.

Per le convenzioni specifiche consulta **`docs/interattivita.md`**.

## Componenti, formule e UI condivisa

Prima di modificare un componente condiviso, cerca tutti i suoi utilizzi e valuta l'impatto sulle pagine e sui capitoli. Se aggiungi un componente da usare in MDX, non basta creare il file: deve essere esportato e registrato nel sistema di rendering.

- Componenti UI e didattici: `src/components/ui.tsx`.
- Registrazione MDX: `src/components/content/`.
- Rendering delle formule: `src/lib/math.tsx`.
- Stili delle formule e dei blocchi: `src/styles/`.

## Stile e layout

Individua se la modifica appartiene ai token grafici, ai temi, agli stili globali, al layout di una pagina o a un singolo componente. Preferisci regole condivise per comportamenti condivisi ed evita duplicazioni.

Controlla tema chiaro/scuro, dimensioni desktop/mobile, leggibilità, contrasto, focus e stati interattivi.

Per le convenzioni grafiche consulta **`docs/stile.md`**.

## Configurazione e pubblicazione

Prima di modificare strumenti o configurazione, controlla gli script e le dipendenze in `package.json`, il lockfile, la configurazione Vite e TypeScript e i workflow sotto `.github/workflows/`. Aggiorna le dipendenze tramite il package manager, non modificare manualmente il lockfile.

Non modificare manualmente file generati o cartelle di build: intervieni sui sorgenti e rigenera gli artefatti.

# 5. Regole di lavoro

- Segui i collegamenti dal contenuto visibile fino al componente che lo genera; non modificare un file basandoti soltanto sul suo nome.
- Prima di aggiungere un componente, una regola CSS o una funzione, cerca se esiste già una soluzione condivisa.
- Mantieni separati contenuti, dati, presentazione e logica interattiva.
- Mantieni coerenti identificatori, percorsi, registrazioni e riferimenti.
- Evita refactoring non richiesti e modifiche collaterali.
- Non introdurre dipendenze se il risultato è ottenibile con gli strumenti già presenti.
- Cura accessibilità, responsive design, prestazioni e correttezza didattica.
- Se il codice e un esempio della documentazione sono in conflitto, verifica il flusso effettivo e non applicare percorsi obsoleti alla cieca.

# 6. Documentazione e manutenzione di AGENTS.md

I dettagli editoriali e le istruzioni specifiche vanno mantenuti nei documenti dedicati:
- `docs/contenuti.md`: organizzazione e scrittura di percorsi, capitoli, formule e immagini;
- `docs/interattivita.md`: convenzioni per componenti interattivi e animazioni;
- `docs/stile.md`: convenzioni grafiche, temi e layout;
- `docs/struttura.md`: organizzazione delle cartelle e dei moduli.

**Non aggiornare questo file quando cambiano i nomi, il numero o i contenuti dei corsi, dei capitoli, delle immagini o delle singole interazioni.** Questi elementi sono variabili e devono essere gestiti nei rispettivi file sorgente.

Se un documento in `docs/` è vuoto o non descrive più una procedura, verifica il comportamento nel codice; non inventare indicazioni e, quando opportuno, completa il documento specifico.

# 7. Verifica prima di concludere

- Controlla che i file importati, i percorsi e i riferimenti esistano.
- Verifica che i componenti usati nei contenuti siano registrati correttamente.
- Verifica la coerenza tra dati, capitoli e navigazione.
- Consulta `package.json` per individuare i comandi di controllo disponibili ed esegui quelli pertinenti, inclusa la build quando possibile.
- Prova le pagine, i temi e le interazioni interessate, anche su schermi piccoli.
- Controlla eventuali errori o regressioni introdotti.
- Nel resoconto finale indica cosa è stato modificato e quali verifiche sono state realmente eseguite. Non dichiarare controlli che non hai effettuato.
