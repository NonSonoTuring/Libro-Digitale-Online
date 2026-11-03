# Catalogo degli stili grafici

Questo documento è una **raccolta di linguaggi visivi disponibili per il progetto**, non un foglio di regole obbligatorie. Ogni stile è una proposta riutilizzabile e modificabile: nessuno è definitivo, nessuno si applica automaticamente a tutto il sito e non esiste uno stile da usare sempre per impostazione predefinita.

La scelta si fa di volta in volta, in base al contenuto, alla funzione della figura, al contesto editoriale e alla leggibilità. È possibile usare uno stile per una singola illustrazione, combinarne alcuni elementi oppure adattarne palette, tipografia, densità e tecnica. Gli esempi sono **riferimenti pratici**, non modelli da copiare alla lettera in ogni occasione.

Per ogni stile il catalogo raccoglie le informazioni necessarie a riconoscerlo e ricrearlo: intento visivo, palette, tipografia, strumenti e parametri, comportamento del layout, codice di esempio, varianti e indicazioni per portarlo nei componenti del progetto. Quando si aggiunge un nuovo linguaggio visivo, si crea una nuova scheda; quando si aggiunge un esempio dello stesso linguaggio, lo si inserisce nella scheda esistente evidenziando cosa condivide e cosa cambia.


# Tema globale scuro — carbone materico

Nome breve: **carbone materico** · Ambito: **tema applicativo globale, modalità scura**

Questa è la resa della modalità scura dell'intera piattaforma, distinta dagli stili delle singole figure (per esempio **Sketch a mano — lavagna**). Non usa Rough.js né impone una tipografia manoscritta: mantiene la tipografia editoriale del sito e cambia la superficie dell'interfaccia.

## Palette e token

I valori effettivi sono definiti in `src/styles/themes.css`; i token di base e quelli del tema chiaro sono in `src/styles/tokens.css`.

| Token | Colore | Uso |
|---|---|---|
| `--color-paper` / `--paper` / `--desk` | `#171612` | Sfondo principale della pagina |
| `--color-surface` / `--surface` / `--card` | `#201e19` | Card, pannelli e contenitori |
| `--color-surface-2` / `--surface-2` / `--paper-3` | `#292620` | Hover ed elementi elevati |
| `--ink` | `#e9e5dc` | Testo principale |
| `--ink-2` | `#bdb6a9` | Testo secondario |
| `--ink-3` | `#918a7e` | Metadati e testo attenuato |
| `--rule` | `#3b372f` | Bordi e divisori |
| `--accent` | `#c7a66b` | Accento caldo |
| `--accent-2` | `#84afb1` | Accento freddo |

I componenti devono preferire questi token a colori hard-coded, così home, indici, capitoli, card, formule e controlli restano coerenti quando si cambia tema. Le etichette sovrapposte alle copertine possono mantenere colori dedicati solo quando servono a garantire contrasto sull'immagine.

## Grana carbone

La grana è applicata tramite la classe `.grain` sul wrapper a tutta larghezza dell’app in `src/App.tsx`. Lo pseudoelemento `.grain::after` è definito in `src/styles/base.css`, ancorato al viewport e confinato nello stacking context del wrapper. Ha livello `z-index: -1`: resta sopra il fondo del wrapper ma dietro a testi, controlli e immagini, così la texture non altera luminosità e colori dei media:

- posizione `fixed`, `inset: 0`, livello `z-index: -1`;
- texture SVG tramite `feTurbulence` di tipo `fractalNoise`, frequenza `0.85`, `3` ottave e `stitchTiles: stitch`;
- fusione `soft-light` e opacità CSS `0.4` (il rettangolo SVG ha opacità `0.5`);
- `pointer-events: none`, quindi il livello non intercetta clic, focus o interazioni;
- come nell'esempio originale, la texture è attiva in entrambi i temi; in modalità chiara l'effetto è più delicato.

La grana globale resta una texture di sfondo e non deve mai diventare un'ombra applicata alle immagini. Le vecchie ombre decorative a puntini e le estrusioni colorate non vengono usate sulle figure dei capitoli. I puntini possono comparire dentro un diagramma soltanto quando rappresentano il fenomeno spiegato (per esempio il retino tipografico), non come decorazione dietro o attorno all'immagine.

## Regole di estensione

- Per cambiare l'atmosfera globale, intervenire sui token in `themes.css`, non riscrivere i colori delle singole pagine.
- Per nuove superfici, usare `--color-surface`, `--color-surface-2` e gli alias compatibili `--surface`, `--card`, `--paper-2` e `--paper-3` in base alla gerarchia visiva.
- Per testo e bordi, usare `--ink`, `--ink-2`, `--ink-3` e `--rule`.
- Non applicare la palette carbone alle illustrazioni che hanno un proprio sfondo didattico o una palette semantica, a meno che la figura non debba adattarsi esplicitamente al tema.
- La modalità scura resta una scelta dell'utente e non modifica i colori del tema chiaro.

---

## Cornice uniforme delle immagini nei capitoli

Tutte le figure dei capitoli, statiche o interattive, e le copertine verticali nella pagina di selezione dei capitoli devono avere una **cornice bianca continua da 2 px** e non devono avere ombre. Il componente condiviso `<Figure>` applica la stessa cornice a grafici, SVG, canvas e immagini, indipendentemente dallo stile del corso; `.topic-cover` applica la stessa regola alla copertina della pagina del corso. La cornice deve restare bianca anche in modalità scura.

Non usare sulle immagini o sui loro contenitori `box-shadow`, `drop-shadow`, ombre a puntini, retini decorativi esterni, estrusioni o pseudoelementi che simulano un'ombra. Sono quindi esclusi gli effetti `.halftone-shadow` e `.card-3d`. La grana globale della pagina resta sullo sfondo e non modifica le immagini.

I puntini o i tratteggi interni all'illustrazione sono ammessi soltanto quando costituiscono il contenuto didattico (per esempio la retinatura di un'ombra); non devono essere usati come ombra esterna della figura. Gli elementi autonomi non racchiusi in `<Figure>`, come la scala dei valori e le tavolozze, seguono la stessa regola della cornice bianca e dell'assenza di ombre.

---

# Sketch a mano — lavagna

Nome breve: **sketch a mano** · Variante: **lavagna scura** · Ambito: **illustrazioni, diagrammi e schemi singoli**

## Che cos'è e quando usarlo

Stile da appunto illustrato su una lavagna: il soggetto è spiegato con forme tracciate a mano libera, contorni appena irregolari, riempimenti a tratteggio e annotazioni manoscritte. La superficie è scura, color ardesia, con segni chiari simili al gesso e pochi colori d'accento. Si usa quando si vuole che **un qualunque soggetto** — scientifico, matematico, storico, artistico o tecnico — sembri disegnato e annotato a mano. Non significa trasformare ogni contenuto in un grafico: forme, simboli e disposizione devono rappresentare fedelmente il soggetto specifico.

## Dipendenze necessarie

Per disegnare contorni e campiture irregolari usare **Rough.js 4.6.6** sopra la **Canvas 2D API**, già disponibile nel browser; nel progetto React la libreria va importata come modulo (import rough from "roughjs"), non richiamata da CDN. Per la scrittura usare **Caveat** da Google Fonts, pesi 400, 600 e 700, caricandolo nel documento prima di disegnare il testo sul canvas e mantenendo cursive come fallback. React e Tailwind CSS sono già presenti nel progetto: React gestisce il componente e Tailwind può comporre il contenitore, ma non servono altre librerie grafiche. **Rough.js e Caveat non sono attualmente installati né caricati nel progetto**: aggiungerli solo quando una figura adotta davvero questo stile; non considerarli dipendenze globali già disponibili.

## Elementi dello stile

### Tipografia

Il font principale è **Caveat**, perché riproduce una scrittura manuale chiara e spontanea. Usare:
- **Titolo della figura:** 28–36 px, peso 600 o 700; identifica il tema.
- **Annotazioni e formule:** 20–26 px, peso 400 o 600; spiegano le parti del disegno.
- **Etichette secondarie:** 16–19 px, peso 400; indicano assi, simboli, valori e note brevi.

Impostare il font sia nel CSS (font-family: "Caveat", cursive) sia nel canvas (ctx.font = '24px "Caveat", cursive'). Non scendere sotto 16 px per il testo informativo. Le parole devono restare leggibili: inclinazione e variazioni manuali non devono compromettere formule, numeri o nomi tecnici. Eventuali controlli dell'interfaccia possono usare un sans-serif semplice, senza sostituire Caveat nelle annotazioni della figura.

### Linee e contorni

Disegnare linee, frecce, cerchi, archi e poligoni con Rough.js (rough.canvas(canvas)). Usare il colore gesso principale #f5f5f4 o quello secondario #a8a29e, spessore indicativo **1.5–2.5 px** e roughness tra **1.2 e 1.5**: l'irregolarità deve essere visibile ma controllata, mai tremolante o confusa. Per assi e contorni principali preferire linee continue; per proiezioni, guide e collegamenti ausiliari usare strokeLineDash (per esempio [4, 4]). Variare il tratto in base alla gerarchia, non rendere ogni linea ugualmente marcata.

### Riempimenti a tratteggio

Non usare campiture piatte come soluzione predefinita. Per suggerire una zona colorata, un materiale o un'area evidenziata, usare le opzioni di riempimento Rough.js:
- **hachure:** linee parallele oblique, per un riempimento leggero;
- **cross-hatch:** due direzioni di linee incrociate, per un'area più densa o importante.

Impostare hachureAngle tra **45° e 60°**, hachureGap tra **4 e 6 px** e fillWeight intorno a **1–1.5 px**. Il colore del tratteggio si imposta con fill; il contorno resta controllato da stroke. Lasciare respirare il fondo scuro tra i segni. Usare il tratteggio solo dove aggiunge significato: non riempire automaticamente tutte le forme.

Esempio di una forma con bordo a gesso e tratteggio azzurro:

    rc.rectangle(x, y, width, height, {
      stroke: "#f5f5f4",
      strokeWidth: 2,
      roughness: 1.3,
      fill: "#60a5fa",
      fillStyle: "hachure",
      hachureAngle: 55,
      hachureGap: 5,
      fillWeight: 1.2,
    });

Per una linea semplice:

    rc.line(x1, y1, x2, y2, {
      stroke: "#f5f5f4",
      strokeWidth: 2,
      roughness: 1.3,
    });

### Palette e superficie

Usare questa palette come base riconoscibile; gli accenti si assegnano in base al significato del contenuto.

| Colore | Codice | Funzione |
|---|---|---|
| Ardesia profonda | #121319 | Sfondo esterno |
| Ardesia del pannello | #1c1e26 | Superficie principale della figura |
| Gesso chiaro | #f5f5f4 | Titoli, contorni e informazioni principali |
| Gesso secondario | #e7e5e4 | Annotazioni e linee meno importanti |
| Gesso attenuato | #a8a29e | Guide, assi e dettagli secondari |
| Azzurro polvere | #60a5fa | Primo accento, per evidenziare un elemento |
| Rosso | #ef4444 | Secondo accento, per una categoria distinta |
| Giallo | #facc15 | Terzo accento, per angoli o richiami |

Limitare gli accenti a **due o tre per figura** e assegnare a ciascuno un significato coerente. Non colorare ogni elemento in modo casuale. Il contrasto con lo sfondo deve essere sempre sufficiente.

Il contenitore, quando serve, usa fondo #1c1e26, bordo da **1–1.5 px** chiaro e trasparente (per esempio rgba(229, 231, 235, 0.2)), raggio di **12 px** e ombra morbida scura (0 10px 30px rgba(0, 0, 0, 0.6)). La cornice è facoltativa: non aggiungerla se la figura funziona meglio libera sulla superficie.

### Composizione e adattamento

Costruire la figura attorno a una sola idea visiva principale. Scegliere geometrie, frecce, campiture e annotazioni in funzione del soggetto, mantenere proporzioni e relazioni corrette e collocare ogni etichetta vicino all'elemento a cui si riferisce. Lasciare margini e spazio vuoto; evitare sovrapposizioni e decorazioni che non spiegano nulla. Non riutilizzare automaticamente il layout, gli assi o le forme degli esempi per soggetti diversi.

Il canvas deve adattarsi alla larghezza disponibile: mantenere separate dimensioni logiche e dimensioni fisiche, moltiplicare il buffer per window.devicePixelRatio e ridisegnare al ridimensionamento. In React inizializzare il canvas con useRef<HTMLCanvasElement>(null) e disegnare in useEffect; ripristinare il contesto prima di ogni ridisegno, attendere il caricamento di Caveat e gestire cleanup e resize. Su schermi stretti ridurre la scala senza rendere il testo illeggibile; se necessario, mantenere il rapporto d'aspetto e consentire lo scorrimento orizzontale.

## Istruzioni rapide per replicare lo stile

Quando viene richiesto uno **sketch a mano**, applicare queste regole al soggetto specificato, senza cambiarne il significato:
1. creare una superficie ardesia #121319 / #1c1e26;
2. rappresentare il soggetto con forme e contorni Rough.js, in gesso chiaro e con irregolarità moderata;
3. usare Caveat per titoli, etichette e annotazioni, rispettando le dimensioni sopra indicate;
4. applicare tratteggi hachure o cross-hatch solo alle aree che devono apparire riempite o evidenziate;
5. assegnare pochi colori d'accento con significato costante;
6. adattare disposizione, proporzioni e densità al contenuto e allo schermo.

Il risultato deve sembrare un **appunto didattico disegnato a mano**, non un'illustrazione vettoriale perfettamente geometrica, un'infografica piatta o una lavagna piena di decorazioni. Questa scheda descrive uno stile riutilizzabile per figure singole: non cambia il tema globale del sito e non introduce dipendenze finché non viene realizzato un componente che ne abbia bisogno.

---

# Home — Forma e Codice

La Home adotta una composizione editoriale a piena larghezza, con contenuti allineati a una colonna massima di 1280 px. Il wrapper dell'applicazione non impone più una larghezza da foglio; `.book-container` contiene solo le parti editoriali. Header e pagine interne condividono lo stesso allineamento, mentre ticker e divisori del catalogo attraversano il viewport.

## Gerarchia della pagina

1. **Hero:** riga di metadati con edizione e stato didattico, seguita da un layout a due colonne. La colonna editoriale usa il kicker mono in terra, il titolo Fraunces `.display-title`, il sottotitolo serif, la descrizione e tre indicatori. Non presenta pulsanti di ingresso o collegamenti all'indice: i percorsi si aprono dalle schede del catalogo. La colonna visiva usa le copertine dei primi tre percorsi registrati.
2. **Ticker:** striscia continua a larghezza piena; le voci derivano dai titoli dei capitoli e vengono duplicate per consentire l'animazione lineare fino a `translateX(-50%)`. L'animazione rallenta con `prefers-reduced-motion`.
3. **Catalogo:** sezione con bordo superiore e fondo `surface` attenuato. La testata allinea titolo e conteggio; la griglia usa tre colonne a partire dal breakpoint medio.
4. **Schede:** immagini a 240/260 px, gradiente scuro, disciplina, numerazione e titoli. Al passaggio del puntatore o al focus compare la scheda scura sovrapposta: sotto «Scheda del percorso» mostra `homeHoverDescription`, una spiegazione più ampia e giustificata, limitata a cinque righe, seguita dalle parole chiave. Non mostra conteggi di capitoli o minuti. Il pannello inferiore mostra soltanto la frase breve. L'intera scheda è un'unica area cliccabile e porta all'indice dei capitoli; non deve esserci una barra o un pulsante «Apri il percorso». La scheda deve avere cursore pointer, un focus visibile da tastiera e attivazione con Invio.

## Contenuto e aggiornamento

Le schede non sono codificate una per una: `src/components/Home.tsx` legge `topics` da `src/data/topics.ts`. Numero dei percorsi, capitoli, minuti, ticker, copertine, titoli, `homeDescription`, `homeHoverDescription` e parole chiave sono ricavati dai dati. Quando cambia il catalogo, si modificano i dati e non i contatori o la struttura JSX. La griglia resta a tre colonne sui desktop, ma accoglie anche ulteriori percorsi sulle righe successive.

## Token cromatici e accessibilità

Il terracotta della Home è il token `--terra` (utility `text-terra`), con variante più chiara nel tema scuro. `--muted`, `--ink-soft` e `--line` sono alias Tailwind dei token testuali e del bordo condivisi. Il focus da tastiera è visibile; su schermi stretti la hero diventa a colonna singola e le schede si dispongono verticalmente. Le animazioni rispettano `prefers-reduced-motion`.

---

# Numerazione dei capitoli e delle sezioni

Il numero nella testata di ogni capitolo e il numero di ogni sezione usano lo stesso stile tipografico **a contorno**: carattere Fraunces leggero, riempimento trasparente e bordo colorato tramite `-webkit-text-stroke`. Il numero del capitolo è un intero (1, 2, 3…), quello della sezione mantiene la forma gerarchica capitolo.sezione (1.1, 1.2…). Il numero del capitolo deve essere chiaramente più grande: **104 px su desktop e 72 px su mobile**; i numeri delle sezioni restano a **70 px su desktop e 48 px su mobile**. Questa differenza deve rendere immediata la gerarchia visiva, mantenendo lo stesso riempimento trasparente e lo stesso tratto.

Nelle intestazioni delle sezioni mostrare soltanto il numero grande a contorno a sinistra e il titolo della sezione a destra. **Non aggiungere una piccola etichetta testuale** come «SEZIONE 1.1» sopra al titolo: la numerazione grande è già sufficiente. Il numero viene generato dai contatori CSS, quindi non va scritto manualmente nei file MDX. Su mobile ridurre proporzionalmente dimensione e spessore del contorno, senza reintrodurre l'etichetta.

La testata del capitolo applica lo stesso trattamento al numero intero del capitolo, accanto al titolo e al sottotitolo. Le regole sono in `src/styles/home.css`; il componente `src/components/ChapterPage.tsx` fornisce il numero progressivo e il CSS dei blocchi `.book-section` genera la numerazione delle sezioni.

