# Come scrivere argomenti e capitoli

Questa guida segue la struttura reale del progetto: i corsi mostrati in Home sono registrati in `src/data/topics.ts`, mentre i testi dei capitoli si trovano in `src/contenuti/argomenti/<Argomento>/capitoli/<Capitolo>/capitolo.mdx`. Le cartelle `Argomento1` in `src/contenuti` e `src/features` sono segnaposto.

## Flusso delle pagine

- Home: legge `topics` da `src/data/topics.ts` e crea le schede in `src/components/Home.tsx`.
- Corso: rotta `#/t/<topic-id>`, pagina `src/components/CourseIndex.tsx`.
- Capitolo: rotta `#/t/<topic-id>/c/<chapter-id>`, pagina `src/components/ChapterPage.tsx`.
- Il routing è in `src/App.tsx`; non serve aggiungere rotte a mano.

## 1. Aggiungi l'argomento in Home

In `src/data/topics.ts` aggiungi un oggetto `Topic` nell'ordine desiderato:

```ts
{
  id: "argomento1", numeral: "IV", title: "Argomento1", subtitle: "Sottotitolo breve",
  discipline: "Materia", level: "Livello", hours: "≈ 30 min",
  abstract: "Testo breve della scheda.",
  cover: image("cover-argomento1.svg"), style: "technical",
  styleLabel: "Stile visivo", accent: { light: "#2b2620", dark: "#ece2cc" },
  keywords: ["parola1"], prerequisites: ["Prerequisito"], references: ["Riferimento"],
  chapters: [{ id: "capitolo1", title: "Capitolo1", minutes: 20, sections: ["Sezione 1"] }],
}
```

- `id` deve essere kebab-case e identico alla cartella in `src/contenuti/argomenti/<id>/`.
- `cover` punta a `public/images/...` tramite `image()`; la Home usa questa immagine.
- La pagina del corso usa `detailCovers` in `src/components/CourseIndex.tsx`, con immagini in `public/images/topic-covers/`. Tutte le copertine della pagina corso hanno lo stesso formato verticale **1:2** (per esempio 1120 × 2240 px); il ritaglio è gestito da `src/styles/home.css`.
- La pagina del corso mostra copertina, titolo, sottotitolo, descrizione e indice dei capitoli. Non mostra livello, durata complessiva, conteggio sezioni, prerequisiti o riferimenti; alcuni metadati, come disciplina e livello, sono usati nelle schede della Home.
- Per immagini trovate online, scarica una copia locale in `public/images/topic-covers/`, verifica che la licenza ne consenta il riuso e annota qui autore, fonte e licenza. La copertina di `Il quadro` è un dettaglio di *Still life of fruit, with peaches and grapes* di Anna Ruysch, da [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Still_life_of_fruit,_with_peaches_and_grapes%29.jpg), rilasciata nel pubblico dominio; ritagliata nel formato 1:2.
- `sections` elenca i titoli nello stesso ordine degli `<h2>` del MDX. Ogni `<section className="book-section">` deve avere un `id` univoco, per esempio `id="sec-sezione-1"`: l'indice fisso a destra usa questi ID per saltare alla sezione e aggiornare l'evidenziazione durante lo scorrimento.

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
- Le risorse statiche non vanno in `features/`: immagini fisse in `assets-condivisi/` dell'argomento o in `assets/` del capitolo; file globali in `public/`.

## 5. Verifica

```bash
npm run build
```

Poi controlla: Home con scheda e striscia, `#/t/argomento1`, `#/t/argomento1/c/capitolo1`, indice laterale sempre visibile a destra e aggiornato mentre scorri, tema chiaro/scuro. Se la pagina pubblicata non mostra le modifiche, ricarica con `Ctrl+F5`.
