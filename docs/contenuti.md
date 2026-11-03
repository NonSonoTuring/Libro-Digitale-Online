# Come scrivere argomenti e capitoli

Questa guida segue la struttura reale del progetto: i corsi mostrati in Home sono registrati in `src/data/topics.ts`, mentre i testi dei capitoli si trovano in `src/contenuti/argomenti/<Argomento>/capitoli/<Capitolo>/capitolo.mdx`. Le cartelle `Argomento1` in `src/contenuti` e `src/features` sono segnaposto.

## Flusso delle pagine

- Home: legge `topics` da `src/data/topics.ts` e crea le schede in `src/components/Home.tsx`.
- Corso: rotta `#/t/<topic-id>`, pagina `src/components/CourseIndex.tsx`.
- Capitolo: rotta `#/t/<topic-id>/c/<chapter-id>`, pagina `src/components/ChapterPage.tsx`.
- Il routing è in `src/App.tsx`; non serve aggiungere rotte a mano.

## Home: schede, descrizioni brevi e indicatori derivati dai dati

La Home legge l'array `topics` da `src/data/topics.ts` e genera una scheda per ogni oggetto `Topic`. Numero dei percorsi, numero dei capitoli, minuti di lettura e voci del ticker sono calcolati dai dati; copertine, titoli, sottotitoli, discipline, descrizioni brevi, approfondimenti da hover e parole chiave sono letti dallo stesso oggetto usato per il routing.

**La scheda Home usa due livelli di descrizione, con funzioni diverse.** Il tipo `Topic` separa i testi in tre campi:

- `homeDescription`: frase sintetica mostrata nel blocco inferiore, sempre visibile sotto la copertina. Deve esprimere l'identità del percorso in modo immediato.
- `homeHoverDescription`: spiegazione più ricca mostrata nell'overlay al passaggio del puntatore o al focus da tastiera. In una o due frasi aggiunge informazioni concrete sull'argomento e su ciò che si esplora, senza diventare il riassunto completo del corso.
- `abstract`: descrizione estesa, destinata alla pagina interna del percorso (`src/components/CourseIndex.tsx`). Può spiegare obiettivi, contenuti, opere e attività in più frasi; non viene mostrata nelle schede Home.

### Come scrivere `homeDescription`

- Scrivi **una sola frase**, preferibilmente tra **45 e 85 caratteri** (circa 6–13 parole), senza superare le due righe nella card.
- Scegli 2–3 concetti caratterizzanti e collegali con naturalezza: materia, forma, fenomeno, tema o prospettiva.
- Usa un tono evocativo ma concreto, editoriale e coerente con il titolo del percorso. La frase deve far intuire di cosa parla l'intero argomento.
- Evita formule promozionali, introduzioni come «In questo corso…», spiegazioni didattiche lunghe, elenchi di capitoli, nomi di tutte le attività e dettagli bibliografici.
- Non ripetere semplicemente titolo e sottotitolo. Preferisci parole chiave concettuali e una sintassi compatta.
- Chiudi con la punteggiatura solo quando la frase la richiede; mantieni una costruzione uniforme tra tutti i percorsi.

Esempi di tono e lunghezza:

| Argomento | `homeDescription` |
|---|---|
| Reti neurali artificiali | Segnali, memoria e apprendimento nelle reti artificiali. |
| Il cubo | Forma, simmetria e geometria oltre la terza dimensione. |
| Il quadro | Luce, colore e composizione per imparare a leggere un dipinto. |
| Neoclassicismo | Corpo, luce e allegoria: il momento del Neoclassico. |

### Come scrivere `homeHoverDescription`

- Scrivi una spiegazione autonoma di **una o due frasi**, indicativamente tra **160 e 210 caratteri**.
- Aggiungi informazioni che la frase breve non può contenere: un concetto, un metodo, un'opera o una relazione che aiuti a capire cosa si approfondisce nel percorso.
- Sii specifico per quell'argomento: nomina gli elementi che lo rendono riconoscibile e chiarisci che cosa si potrà comprendere osservandoli.
- Evita l'elenco dei capitoli, il catalogo delle attività, le formule promozionali e la ripetizione di titolo, sottotitolo o `abstract`.
- Il testo è giustificato e limitato a **cinque righe** nell'overlay: privilegia frasi compatte e informazioni essenziali, così resta leggibile insieme alle parole chiave.

Esempi per i percorsi attuali:

| Argomento | `homeHoverDescription` |
|---|---|
| Reti neurali artificiali | Dal neurone artificiale alle reti di più strati: segnali, pesi e funzioni di attivazione trasformano i dati in previsioni. Il gradiente mostra come la rete corregge i propri pesi durante l’apprendimento. |
| Il cubo | Dai vertici, spigoli e facce si passa alle rotazioni che conservano il cubo. La quarta dimensione entra in scena con il tesseratto, esplorato attraverso simmetrie e proiezioni. |
| Il quadro | Leggere un dipinto significa seguire la luce, distinguere i valori tonali e capire come i colori si influenzano. La composizione rivela il percorso dello sguardo e l’equilibrio dell’opera. |
| Neoclassicismo | Canova e David guardano all’antico per costruire un nuovo ideale: nella scultura contano equilibrio e gesto, nella pittura mito e virtù civica diventano immagini di impegno e memoria. |

### Dimensioni e struttura della scheda

Le schede sono definite in `src/components/Home.tsx` e stilizzate in `src/styles/home.css`. Non assegnare una larghezza fissa alla singola card: la griglia calcola la larghezza in base al contenitore editoriale e allo schermo.

- Il catalogo è racchiuso in `.book-container`: larghezza 100%, massimo 1280 px, margini automatici e padding laterale fluido `clamp(1.15rem, 4vw, 4rem)`.
- La griglia usa una colonna sui dispositivi stretti e **tre colonne da `md` in su**, con distanza di 20 px (`gap-5`) e 24 px al breakpoint `lg` (`gap-6`). Se i percorsi sono più di tre, le schede continuano sulle righe successive.
- La copertina occupa tutta la larghezza della card: **240 px di altezza sui viewport più stretti e 260 px da `sm` in su**. L'immagine usa `object-fit: cover`; prepara quindi una copertina in cui il soggetto principale tolleri il ritaglio. Sulla copertina compare soltanto l'etichetta della disciplina: non aggiungere numeri ordinali nell'angolo.
- Il blocco inferiore usa padding **20 px** (`p-5`) e contiene soltanto la descrizione breve; si dimensiona sul contenuto, senza altezza minima artificiale o barra d'azione.
- La descrizione breve `homeDescription` occupa al massimo **due righe**. Non aggiungere un pulsante o una fascia «Apri il percorso»: l'intera scheda è attivabile e conduce all'indice dei capitoli. La scheda è un unico elemento attivabile: ogni punto della copertina, dell'overlay, delle parole chiave e della descrizione apre il percorso corrispondente. Deve essere raggiungibile da tastiera e aprirsi con Invio; non inserire pulsanti o link interni alla scheda.
- Nell'overlay, sotto «Scheda del percorso», compare `homeHoverDescription`, con testo giustificato e un limite di **cinque righe**, seguito da un massimo di cinque parole chiave. **Non mostrare conteggi di capitoli o minuti nelle schede**, né nell'overlay né nel blocco sotto la copertina.

Quando aggiungi, rimuovi o riordini un percorso, aggiorna `src/data/topics.ts` e le risorse richieste: Home, contatori, ticker e griglia si aggiornano senza modificare `Home.tsx`. Mantieni sempre `homeDescription` per ogni argomento; non usare `abstract` come ripiego nella Home e non filtrare percorsi per conservare un numero fisso di schede.

## 1. Aggiungi l'argomento in Home

In `src/data/topics.ts` aggiungi un oggetto `Topic` nell'ordine desiderato:

```ts
{
  id: "argomento1", numeral: "IV", title: "Argomento1", subtitle: "Sottotitolo breve",
  discipline: "Materia", level: "Livello", hours: "≈ 30 min",
  abstract: "Descrizione estesa del percorso, usata nella pagina interna.",
  homeDescription: "Una frase sintetica che ne esprime il tema centrale.",
  cover: image("cover-argomento1.svg"), style: "technical",
  styleLabel: "Stile visivo", accent: { light: "#2b2620", dark: "#ece2cc" },
  keywords: ["parola1"], prerequisites: ["Prerequisito"], references: ["Riferimento"],
  chapters: [{ id: "capitolo1", title: "Capitolo1", minutes: 20, sections: ["Sezione 1"] }],
}
```

- `id` deve essere kebab-case e identico alla cartella in `src/contenuti/argomenti/<id>/`.
- `cover` punta a `public/images/...` tramite `image()`; la Home usa questa immagine.
- La pagina del corso usa `detailCovers` in `src/components/CourseIndex.tsx`, con immagini in `public/images/topic-covers/`. Tutte le copertine della pagina corso hanno lo stesso formato verticale **1:2** (1120 × 2240 px); il ritaglio è gestito da `src/styles/home.css`. Il contenitore `.topic-cover` applica una cornice bianca continua da **2 px** e non usa ombre o estrusioni.
- La pagina del corso mostra copertina, titolo, sottotitolo, descrizione e indice dei capitoli. La copertina non sovrappone numeri romani o altre etichette numeriche all'immagine. Non mostra livello, durata complessiva, conteggio sezioni, prerequisiti o riferimenti; alcuni metadati, come disciplina e livello, sono usati nelle schede della Home.
- `sections` elenca i titoli nello stesso ordine degli `<h2>` del MDX. Ogni `<section className="book-section">` deve avere un `id` univoco, per esempio `id="sec-sezione-1"`: l'indice fisso a destra usa questi ID per saltare alla sezione e aggiornare l'evidenziazione durante lo scorrimento. Il numero capitolo.sezione viene generato automaticamente dal CSS: nel titolo MDX scrivi soltanto il nome della sezione, senza prefissi numerici o etichette come «SEZIONE 1.1».

### Immagini: dove salvarle e come usarle

**Standard dimensionale per le figure dei capitoli**

Le immagini statiche inserite in una figura seguono la misura visiva del riquadro interattivo nella sezione **«Ombre proprie e ombre portate»** del capitolo *Luce e valore*: un'area massima di **720 × 480 px** (rapporto 3:2). È la larghezza massima della colonna di lettura e l'altezza del riquadro di riferimento.

Per applicare lo standard, assegna all'immagine la classe `chapter-figure-image`:
- larghezza massima: 100% dello spazio disponibile, fino a 720 px;
- altezza massima: 480 px;
- proporzioni originali sempre mantenute, senza deformare né ritagliare l'opera;
- immagine centrata nella figura;
- cornice bianca continua da **2 px**, applicata dal contenitore condiviso `<Figure>`;
- nessuna ombra esterna: niente ombre a puntini, estrusioni, `box-shadow` o `drop-shadow`;
- su schermi stretti si riduce automaticamente alla larghezza disponibile.

Non impostare `width: 100%` inline e non assegnare larghezze o altezze fisse nel singolo MDX: la regola dimensionale condivisa si trova in `src/styles/home.css`, mentre la cornice è applicata dal componente `<Figure>` in `src/components/ui.tsx`. La classe va usata per tutte le immagini statiche dentro `<Figure>`; i componenti interattivi (per esempio `<Painting />`) ricevono la stessa cornice dal contenitore comune. I puntini presenti dentro una visualizzazione possono restare soltanto quando descrivono il fenomeno studiato, mai come ombra attorno all'immagine.

**Immagine statica dentro un capitolo**

1. Salva il file in `src/contenuti/argomenti/argomento1/capitoli/capitolo1/assets/`.
2. Importalo all'inizio di `capitolo.mdx` con un percorso relativo:

```mdx
import illustrazione from "./assets/illustrazione.webp";
```

3. Inseriscilo nel punto giusto, dentro `<Figure>`:

```mdx
<Figure n="1.1" caption={<>Didascalia breve.</>}>
  <img
    src={illustrazione}
    alt="Descrizione concreta di ciò che mostra l'immagine"
    loading="lazy"
    className="chapter-figure-image"
  />
</Figure>
```

Il percorso relativo fa sì che Vite includa il file nella build: non collegare direttamente l'immagine al sito che la ospita. Mantieni le proporzioni originali per le figure dei capitoli; scrivi un `alt` descrittivo (oppure `alt=""` se è solo decorativa).

**Copertina della Home**

1. Salva il file in `public/images/cover-argomento1.webp`.
2. In `src/data/topics.ts`, usa `cover: image("cover-argomento1.webp")`.

**Copertina nella pagina del corso**

1. Apri la pagina della fonte e verifica licenza e attribuzione. Su Wikimedia Commons, apri **Original file** (non la miniatura), poi salva il file originale nella cartella principale del progetto come `immagine-originale.jpg`. Preferisci pubblico dominio o CC0; per licenze con attribuzione annota autore, titolo, fonte e licenza in questa guida.
2. Crea un ritaglio verticale **1:2**, senza deformare l'immagine. Verifica che ImageMagick sia disponibile con `magick --version`; poi apri PowerShell nella cartella principale del progetto ed esegui (se necessario, cambia l'estensione del file sorgente):

```powershell
magick .\immagine-originale.jpg -auto-orient -resize "1120x2240^" -gravity center -extent 1120x2240 -quality 88 public/images/topic-covers/cover-argomento1.jpg
```

`-auto-orient` corregge l'orientamento, `-resize` adatta l'immagine al riquadro, `-extent` crea il ritaglio finale; cambia `-gravity center` se il soggetto è fuori centro. Mantieni il rapporto 1:2 e non allargare/stirare l'immagine.

3. Registra il percorso in `detailCovers` dentro `src/components/CourseIndex.tsx`:

```ts
"argomento1": `${import.meta.env.BASE_URL}images/topic-covers/cover-argomento1.jpg`,
```

Le copertine locali evitano dipendenze dal sito esterno e URL riutilizzati dalla cache: usa un nome file nuovo quando sostituisci un'immagine.

La copertina corrente di `Il quadro` è `public/images/topic-covers/painting-anna-ruysch.jpg`, un dettaglio di *Still life of fruit, with peaches and grapes* attribuito ad Anna Ruysch, da [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Still_life_of_fruit,_with_peaches_and_grapes%29.jpg), in pubblico dominio.

### Giustificazione del testo editoriale

Il testo discorsivo di tutte le pagine deve essere **giustificato**, mantenendo un aspetto uniforme tra Home, pagine dei corsi e capitoli. La regola condivisa si trova in fondo a `src/styles/home.css` e comprende:
- i paragrafi introduttivi della Home e le descrizioni delle schede dei corsi;
- le descrizioni nelle pagine di presentazione dei corsi;
- i paragrafi e gli elenchi del contenuto dei capitoli, comprese le citazioni introduttive.

Usa `text-align: justify`, `text-justify: inter-word` e `hyphens: auto` sui blocchi di testo discorsivo. Il documento HTML ha già `lang="it"`, necessario perché il browser applichi la sillabazione italiana. Non estendere la giustificazione a titoli, etichette, metadati, pulsanti, indici di navigazione, formule o controlli interattivi: questi mantengono l'allineamento previsto dal rispettivo componente. Non aggiungere stili inline nei singoli MDX; modifica i selettori condivisi in `src/styles/home.css`.


## 2. Metadati del capitolo

In `src/data/chapter-meta.json` aggiungi:

```json
{
  "argomento1": {
    "capitolo1": {
      "title": "Capitolo1",
      "subtitle": "Sottotitolo del capitolo",
      "minutes": 20,
      "epigraph": { "text": "Testo breve", "author": "Autore" }
    }
  }
}
```

`epigraph` è opzionale.

## 3. Crea il file del capitolo

Percorso obbligatorio:

```text
src/contenuti/argomenti/argomento1/capitoli/capitolo1/capitolo.mdx
```

`ChapterPage.tsx` cerca esattamente `.../argomenti/<topic.id>/capitoli/<chapter.id>/capitolo.mdx`.

Struttura del MDX:

```mdx
<section className="book-section" id="sec-sezione-1">

<h2>Sezione 1</h2>

<p>Testo con <Term def="Spiegazione">termine</Term> e formula inline <M>{"e = mc^2"}</M>.</p>

<Eq
  tex={String.raw`y = \mathbb{1}[x \ge \theta]`}
  note="Unità di McCulloch–Pitts"
  terms={[
    { symbol: "y", description: "uscita binaria" },
    { symbol: "x", description: "ingresso" },
    { symbol: "\\theta", description: "soglia di attivazione" },
  ]}
/>

<Figure n="1.1" caption={<>Didascalia.</>}>
  <DiagrammaInterattivo />
</Figure>

</section>

<Takeaways items={["Punto chiave"]} />
<Quiz items={[{"question":"...","options":["..."],"answer":0,"explanation":"..."}]} />
```

Componenti disponibili da `src/components/content/common.tsx`: `M`, `Eq`, `Figure`, `Definition`, `Theorem`, `Note`, `History`, `Example`, `Term`, `DataTable`, `Takeaways`, `Quiz`.

### Scrivere e formattare le formule

- Formula breve dentro una frase: usa `<M>{"\\sigma(z)"}</M>`.
- Formula centrata su più righe o da spiegare: usa `<Eq>` con `tex`, `note` e `terms` come nell'esempio. Scrivi la formula in LaTeX dentro `String.raw`.
- `note` è il titolo esplicativo: viene mostrato **in maiuscolo, sopra la formula e dentro lo stesso riquadro**. Scrivilo normalmente nel MDX; non aggiungere numeri o `label`.
- In `terms`, elenca in ordine i simboli e il loro significato: vengono mostrati **dentro il riquadro, subito sotto la formula**. Il simbolo è LaTeX, la descrizione è testo; mantieni ogni spiegazione breve.
- Non usare `Eq` per formule brevi nel testo: quelle vanno con `M`.

Il rendering e l'ordine di titolo, formula e legenda sono in `src/lib/math.tsx`; **stile e riquadro comune** in `src/styles/book.css` (`.display-equation…`). Colori, caratteri e variabili condivise sono in `src/styles/tokens.css`, con i valori del tema scuro in `src/styles/themes.css`. Se cambi lo stile delle formule, modifica le classi CSS lì, non i singoli capitoli.

## 4. Interattività e animazioni

- Scrivi l'interazione in `src/features/argomento1/AnimazioneCapitolo.tsx`.
- Inseriscila nel capitolo MDX dentro `<Figure>`:

```mdx
<Figure n="1.1" caption={<>Didascalia dell'animazione.</>}>
  <AnimazioneCapitolo />
</Figure>
```

- Registrala in `src/components/content/argomento1.tsx`:

```ts
import { commonComponents } from "./common";
import { AnimazioneCapitolo } from "../../features/argomento1/AnimazioneCapitolo";
export const mdxComponents = { ...commonComponents, AnimazioneCapitolo };
```

- In `ChapterPage.tsx` aggiungi il nuovo `topic.id` nella mappa `componentLoader`, così il MDX riceve i suoi componenti.
- Le animazioni sono implementate nel componente React, di solito con `framer-motion` (`motion.*`, `animate`, `transition`). Le proprietà grafiche specifiche dell'interazione (forme SVG, dimensioni, movimenti) si impostano lì.
- Per un'animazione riutilizzabile o condivisa, definisci `@keyframes` e classi in `src/styles/book.css`: qui sono raccolte le animazioni comuni, il rispetto di `prefers-reduced-motion` e la curva condivisa `--ease-book`. Palette e caratteri sono in `src/styles/tokens.css`, con le varianti scure in `src/styles/themes.css`. Non creare una copia delle stesse regole nel capitolo MDX.
- Non salvare immagini dentro `src/features/`: usa `assets/` del capitolo per le figure MDX, `assets-condivisi/` per risorse di un intero argomento, `src/assets/images/` per file importati dai componenti React e `public/` per URL statici globali come le copertine.

## 5. Verifica

```bash
npm run build
```

Poi controlla: Home con scheda e striscia, `#/t/argomento1`, `#/t/argomento1/c/capitolo1`, indice laterale sempre visibile a destra e aggiornato mentre scorri, tema chiaro/scuro. Se la pagina pubblicata non mostra le modifiche, ricarica con `Ctrl+F5`.
