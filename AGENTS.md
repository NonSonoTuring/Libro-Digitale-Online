# AGENTS.md — guida operativa per gli agenti AI

## 1. Regola obbligatoria prima di ogni attività

**Prima di iniziare qualsiasi attività, anche una modifica piccola, leggi per intero tutti i file presenti in `docs/` (incluse eventuali sottocartelle e i file vuoti), poi rileggi questo `AGENTS.md`.** Non limitarti al documento che sembra più pertinente: la documentazione può contenere vincoli trasversali.

Dopo la lettura:
1. verifica la struttura e i nomi reali dei file interessati;
2. controlla come la funzionalità viene usata e registrata nel resto dell'applicazione;
3. modifica il minimo indispensabile;
4. aggiorna la documentazione solo quando la modifica ne cambia le istruzioni;
5. esegui le verifiche indicate in questa guida e riferisci chiaramente ciò che non hai potuto verificare.

**Gerarchia delle informazioni:** il codice attivo e la struttura effettiva del repository sono la fonte di verità sul comportamento attuale. Se un esempio in `docs/` indica percorsi o architetture che non esistono più, non copiarlo alla lettera: adattalo al codice reale e segnala l'incongruenza quando rilevante.

## 2. Che cos'è il progetto

Lectio — Libro Digitale Online è una biblioteca didattica web in italiano. Organizza più corsi in argomenti e capitoli: testi editoriali in MDX, immagini, formule matematiche, verifiche e visualizzazioni React interattive. I corsi attualmente registrati sono **Reti neurali artificiali**, **Il cubo**, **Il quadro** e **Neoclassicismo**.

L'applicazione è una SPA React con navigazione tramite hash URL. Viene compilata da Vite e pubblicata su GitHub Pages. Non è un CMS e i contenuti non vengono caricati da un database: la struttura dei corsi è registrata nel codice e i capitoli sono file MDX inclusi nella build.

**Prima di intervenire su una qualunque parte del progetto, leggi sempre l'intera cartella `docs/`.**

## 3. Stack, avvio e verifiche

- React 19 e TypeScript.
- Vite 7, plugin React, MDX 3 e Tailwind CSS 4.
- Framer Motion per animazioni e transizioni.
- KaTeX per le formule; `clsx` e `tailwind-merge` per comporre classi.
- Node.js 22 nella pipeline GitHub Actions.

Comandi definiti in `package.json`:
- `npm ci`: installa le dipendenze dal lockfile.
- `npm run dev`: avvia il server di sviluppo.
- `npm run build`: esegue `tsc --noEmit` e poi `vite build`.
- `npm run preview`: serve localmente la build.

Non sono configurati script `test` o `lint`: non dichiarare che siano stati eseguiti. La verifica automatica standard è `npm run build`; completa con un controllo manuale delle pagine e delle interazioni toccate.

**Prima di modificare configurazione, dipendenze o pipeline, leggi sempre l'intera cartella `docs/`.**

## 4. Mappa dell'applicazione e flusso dei dati

- `index.html`: documento HTML iniziale, lingua italiana e font web.
- `src/main.tsx`: punto d'ingresso effettivo; crea la root React e importa i fogli CSS.
- `src/App.tsx`: gestisce tema e routing hash:
  - `#/` — Home;
  - `#/t/<topic-id>` — indice del corso;
  - `#/t/<topic-id>/c/<chapter-id>` — capitolo.
- `src/data/topics.ts`: registro principale dei corsi e dei capitoli. Definisce ID, ordine, titoli, descrizioni, copertine, accenti, prerequisiti, riferimenti e sezioni.
- `src/data/chapter-meta.json`: metadati aggiuntivi dei capitoli, come sottotitolo, durata ed epigrafe.
- `src/data/types.ts`: tipi condivisi per stili visuali, capitoli, sezioni e quiz.
- `src/components/Home.tsx`: Home e catalogo dei corsi.
- `src/components/CourseIndex.tsx`: pagina indice di un corso e relative copertine.
- `src/components/ChapterPage.tsx`: caricamento del capitolo MDX, componenti MDX disponibili, intestazione, avanzamento di lettura e indice laterale delle sezioni.
- `src/components/layout/Header.tsx`: intestazione, navigazione e selettore del tema.
- `src/components/ui.tsx`: componenti didattici e di interfaccia condivisi.
- `src/lib/math.tsx`: rendering KaTeX dei componenti `<M>` e `<Eq>`.
- `src/utils/cn.ts`: helper per le classi CSS.

I capitoli sono individuati da `ChapterPage.tsx` tramite `import.meta.glob("../contenuti/argomenti/**/capitolo.mdx")`. Il file viene scelto confrontando il suffisso `/argomenti/<topic-id>/capitoli/<chapter-id>/capitolo.mdx`. **Per aggiungere o rinominare un corso o un capitolo, gli ID nel registro, nei percorsi e nei metadati devono restare coerenti.**

La pagina del capitolo seleziona inoltre il registro dei componenti MDX in base a `topic.id`. Quando si aggiunge una nuova famiglia di corsi, va aggiornata anche questa selezione in `ChapterPage.tsx`: oggi il ramo finale ricade sul registro del quadro, quindi non va lasciato come fallback implicito per un nuovo corso.

**Prima di intervenire su routing, caricamento MDX o dati di corso, leggi sempre l'intera cartella `docs/`.**

## 5. Dove intervenire: guida per tipo di modifica

### Aggiungere o modificare un corso
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Registro e ordine dei corsi: `src/data/topics.ts`.
- Metadati specifici dei capitoli: `src/data/chapter-meta.json`.
- Pagina Home: `src/components/Home.tsx`.
- Copertine della pagina corso: mappa `detailCovers` in `src/components/CourseIndex.tsx`.
- Capitoli: `src/contenuti/argomenti/<topic-id>/capitoli/<chapter-id>/capitolo.mdx`.
- Registro dei componenti MDX: crea/aggiorna `src/components/content/<topic>.tsx` e aggiungi il ramo corrispondente in `src/components/ChapterPage.tsx`.

Usa ID in kebab-case e mantieni esatta corrispondenza tra `topics.ts`, cartelle, capitoli e `chapter-meta.json`. Per i corsi nuovi non riutilizzare cartelle-segnaposto con nomi o maiuscole diverse.

### Scrivere o riorganizzare un capitolo
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Fonte del testo: `src/contenuti/argomenti/<topic-id>/capitoli/<chapter-id>/capitolo.mdx`.
- Titolo, durata, ordine e titoli delle sezioni: `src/data/topics.ts`.
- Sottotitolo ed epigrafe: `src/data/chapter-meta.json`.
- Ogni sezione navigabile deve essere un elemento `<section className="book-section" id="...">` con ID univoco e un `<h2>`. I titoli e l'ordine devono corrispondere all'array `sections` del capitolo in `topics.ts`.
- Per immagini usate solo in quel capitolo, usa la sua cartella `assets/` e import relativi nel MDX. Per risorse condivise tra capitoli dello stesso corso usa `assets-condivisi/` quando la cartella è prevista.
- Riutilizza i componenti didattici comuni registrati in `src/components/content/common.tsx`: `M`, `Eq`, `Figure`, `Definition`, `Theorem`, `Note`, `History`, `Example`, `Term`, `DataTable`, `Takeaways`, `Quiz`.

Per le regole dettagliate di struttura MDX, formule, immagini, metadati e verifica consulta soprattutto `docs/contenuti.md`, dopo aver letto anche gli altri file di `docs/`.

### Aggiungere o modificare un'interazione
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Implementazione React: cartella tematica in `src/features/`.
- Componenti condivisi del MDX: `src/components/content/common.tsx`.
- Registro MDX del corso: `src/components/content/cube.tsx`, `neural.tsx`, `painting.tsx` o `neoclassic.tsx`.
- Se viene introdotto un nuovo corso, aggiorna anche il selettore del registro in `src/components/ChapterPage.tsx`.
- Il capitolo richiama il componente MDX registrato nel punto desiderato, normalmente dentro `<Figure>`.

Registri attuali:
- `cube.tsx`: `Cube3D`, `CubeNet`, `CubeNets`, `IsoDual`, `Schlegel`, `SymmetryAxes`, `Tesseract`, `VertexAngles`; implementazioni in `src/features/cube/`.
- `neural.tsx`: `NeuralNet`, `ActivationChart`, `LossCurves`, `GradientDescent`, `Perceptron`; implementazioni in `src/features/neural/`.
- `painting.tsx`: `Balance`, `ColorLab`, `ColorWheel`, `HalftoneImage`, `HalftoneSphere`, `Painting`, `Palettes`, `SimultaneousContrast`, `ValueScale`; implementazioni in `src/features/painting/`.
- `neoclassic.tsx`: al momento espone solo i componenti comuni.

Mantieni la logica interattiva nei componenti React, non duplicarla nei capitoli MDX. Per animazioni e visualizzazioni considera accessibilità, input touch, pulizia di listener/timer/animazioni e rispetto di `prefers-reduced-motion`.

### Modificare formule, quiz o blocchi didattici comuni
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Componenti comuni e controlli: `src/components/ui.tsx`.
- Registro condiviso da tutti i capitoli: `src/components/content/common.tsx`.
- Formule KaTeX: `src/lib/math.tsx`.
- Stile dei blocchi e delle formule: `src/styles/book.css`.
- Tipi dei quiz e degli stili: `src/data/types.ts`.

Se un componente deve comparire in MDX, esportalo dal modulo appropriato e aggiungilo al registro: la sola esistenza del componente React non lo rende automaticamente disponibile al capitolo.

### Modificare grafica, temi o layout
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Token, colori e variabili: `src/styles/tokens.css`.
- Varianti chiaro/scuro: `src/styles/themes.css`.
- Regole globali: `src/styles/base.css`.
- Impaginazione e componenti di lettura: `src/styles/book.css`.
- Home, catalogo e copertine: `src/styles/home.css`.
- Punto d'importazione e ordine dei CSS: `src/main.tsx`.
- Tema e accento del corso: `src/App.tsx`, `src/components/ui.tsx` e `src/data/topics.ts`.

Usa le variabili e le classi condivise, evitando stili duplicati nei singoli capitoli. Verifica sempre tema chiaro e scuro e le dimensioni mobile.

### Aggiungere o sostituire immagini
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Copertine Home: `public/images/`, referenziate da `image()` in `src/data/topics.ts`.
- Copertine verticali delle pagine corso: `public/images/topic-covers/`, referenziate da `detailCovers` in `src/components/CourseIndex.tsx`.
- Immagini di un capitolo: cartella `assets/` vicina al suo `capitolo.mdx`, importate con percorso relativo.
- Immagini condivise tra capitoli: `assets-condivisi/` del corso, se presente.
- Immagini importate da componenti React: `src/assets/images/`.
- Risorse statiche con URL globale: `public/`.

Non deformare le immagini; mantieni gli aspect ratio previsti, inserisci descrizioni `alt` significative e usa `loading="lazy"` quando appropriato. Per le copertine della pagina corso rispetta il rapporto 1:2 documentato in `docs/contenuti.md`.

### Modificare navigazione, configurazione o pubblicazione
**Prima di iniziare, leggi sempre tutta la cartella `docs/`.**
- Routing hash e tema persistente: `src/App.tsx`.
- Header: `src/components/layout/Header.tsx`.
- Dipendenze e comandi: `package.json` e `package-lock.json` (aggiorna il lockfile con il package manager, non a mano).
- Alias, plugin e base path: `vite.config.ts`.
- TypeScript: `tsconfig.json`.
- Template HTML: `index.html`.
- Deploy GitHub Pages: `.github/workflows/deploy.yml`.

Il `base` di Vite in produzione è `/Libro-Digitale-Online/`: conserva i percorsi compatibili con il sottopercorso GitHub Pages e usa `import.meta.env.BASE_URL` per le risorse pubbliche. Il workflow pubblica su push a `main`, installa con `npm ci`, esegue `npm run build` e distribuisce `dist/`.

## 6. Struttura reale delle cartelle

- `docs/`: documentazione per agenti e manutentori.
- `src/contenuti/argomenti/`: contenuti dei corsi, con cartelle e file `capitolo.mdx`.
- `src/data/`: registro dei corsi, tipi e metadati.
- `src/components/`: pagine, layout, UI e registri di componenti MDX. Il percorso attivo dei registri è `src/components/content/` (singolare).
- `src/features/`: implementazioni delle esperienze interattive, raggruppate per area tematica.
- `src/lib/` e `src/utils/`: helper condivisi.
- `src/styles/`: fogli di stile.
- `src/assets/`: risorse importate dal codice React.
- `public/`: immagini e risorse statiche pubblicate.
- `.github/workflows/`: automazione della build e del deploy.

Non modificare manualmente `dist/` o artefatti generati: modifica i sorgenti e rigenera la build.

**Prima di usare o spostare una cartella, leggi sempre tutta la cartella `docs/` e verifica che il percorso sia realmente attivo nel codice.**

## 7. Avvertenze sulla documentazione e sui segnaposto attuali

La documentazione è stata letta, ma alcuni file non sono ancora allineati all'implementazione:
- `docs/contenuti.md` è la guida più utile per aggiungere corsi e capitoli; alcune istruzioni sulle interazioni usano però esempi-segnaposto come `src/features/argomento1/` e `src/components/content/argomento1.tsx`. Nel progetto attuale usa le cartelle tematiche reali e i registri descritti sopra.
- `docs/struttura.md` contiene un modello storico centrato su `Argomento1` e menziona un flusso SSR/prerender che non corrisponde agli entrypoint attuali. Consideralo una panoramica introduttiva, non una mappa letterale aggiornata.
- `docs/interattivita.md` e `docs/stile.md` sono presenti ma vuoti: leggili come richiesto dalla regola iniziale, ma non attribuire loro istruzioni inesistenti.
- `src/entry-client.tsx`, `src/entry-server.tsx`, `scripts/prerender.ts` e `src/runtime/carica-interazioni.tsx` sono vuoti e non fanno parte del flusso attivo di avvio/build.
- Le cartelle `Argomento1`, i relativi file MDX e vari `.gitkeep` sono segnaposto vuoti. I corsi attivi usano gli slug in minuscolo presenti in `src/data/topics.ts`.
- `src/components/contenuti/` è un segnaposto vuoto; i componenti MDX effettivi sono in `src/components/content/`.
- `public/favicon.svg` è vuoto: non trattarlo come un'icona già implementata.
- `README.md` è volutamente minimale e non sostituisce questa guida o i documenti in `docs/`.

Quando il compito riguarda una di queste aree, verifica prima se i segnaposto sono stati implementati nel frattempo; non riempirli né riorganizzarli senza una richiesta e senza aver verificato i riferimenti.

## 8. Checklist finale

**Prima di eseguire la verifica, rileggi l'intera cartella `docs/` se il lavoro ha cambiato il comportamento o le istruzioni del progetto.**
- [ ] Gli ID di corso, capitolo, cartella, metadati e URL sono coerenti.
- [ ] Ogni componente richiamato da MDX è incluso nel registro corretto.
- [ ] Le sezioni MDX hanno ID univoci e corrispondono all'indice in `topics.ts`.
- [ ] Immagini, formule, temi e layout restano corretti.
- [ ] `npm run build` termina correttamente.
- [ ] Sono state controllate le rotte interessate, almeno una viewport mobile e i temi chiaro/scuro.
- [ ] Le interazioni sono state provate con mouse e touch, e non lasciano listener o animazioni attivi dopo lo smontaggio.
- [ ] Il riepilogo finale distingue verifiche realmente eseguite da quelle non eseguite.

