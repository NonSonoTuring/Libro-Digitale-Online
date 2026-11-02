# Come scrivere argomenti e capitoli

Questa guida usa la struttura reale del progetto: i corsi mostrati in Home sono registrati in `src/data/topics.ts`, mentre i testi vivent in `src/contenuti/argomenti/<Argomento>/capitoli/<Capitolo>/capitolo.mdx`. La cartella `Argomento1` in `src/contenuti` e `src/features` è solo un segnaposto vuoto.

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
- Per la pagina corso, `CourseIndex.tsx` usa `detailCovers`: aggiungi lì `public/images/topic-covers/argomento1.jpg` se vuoi la copertina verticale.
- `sections` elenca i titoli delle sezioni **nello stesso ordine** degli `<h2>` del MDX: l'indice laterale del capitolo li abbina per posizione.

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

<Eq tex={String.raw`E = mc^2`} label="1.1" note="energia a riposo" />

<Figure n="1.1" caption={<>Didascalia.</>}>
  <DiagrammaInterattivo />
</Figure>

</section>

<Takeaways items={["Punto chiave"]} />
<Quiz items={[{"question":"...","options":["..."],"answer":0,"explanation":"..."}]} />
```

Componenti disponibili da `src/components/content/common.tsx`: `M`, `Eq`, `Figure`, `Definition`, `Theorem`, `Note`, `History`, `Example`, `Term`, `DataTable`, `Takeaways`, `Quiz`.

## 4. Interattività separata dal testo

- Metti i componenti React interattivi in `src/features/argomento1/*.tsx`.
- Crea `src/components/content/argomento1.tsx`:

```ts
import { commonComponents } from "./common";
import { DiagrammaInterattivo } from "../../features/argomento1/DiagrammaInterattivo";
export const mdxComponents = { ...commonComponents, DiagrammaInterattivo };
```

- In `ChapterPage.tsx` aggiungi il nuovo `topic.id` nella mappa `componentLoader`, così il MDX riceve i suoi componenti.
- Le risorse statiche non vanno in `features/`: immagini fisse in `assets-condivisi/` dell'argomento o in `assets/` del capitolo; file globali in `public/`.

## 5. Verifica

```bash
npm run build
```

Poi controlla: Home con scheda e striscia, `#/t/argomento1`, `#/t/argomento1/c/capitolo1`, indice laterale del capitolo, tema chiaro/scuro. Se la pagina publicada non mostra le modifiche, ricarica con `Ctrl+F5`.
