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

# 7. Cache, build e pubblicazione: procedura obbligatoria a ogni modifica

Questa procedura è **obbligatoria ogni volta che l'agente modifica la repository e porta le modifiche su `main`**. Non basta che il commit esista su GitHub: il sito pubblicato deve essere costruito dal commit corretto e verificato online. Non dichiarare mai una modifica visibile agli utenti basandoti soltanto sul successo del commit o sulla presenza del codice sorgente.

## Cache e versionamento degli asset

- Vite genera nomi con hash per gli asset importati nel codice e inclusi nel bundle (per esempio JavaScript e CSS). Non rinominare manualmente i file generati in `dist/`: lascia che sia la build a produrre gli hash.
- I file in `public/` vengono copiati mantenendo il loro percorso/nome. **Quando sostituisci il contenuto di un file pubblico già usato dal sito, salva la nuova versione con un nome file nuovo e aggiorna tutti i riferimenti nel codice.** Non sovrascrivere la stessa URL per immagini, copertine, favicon o altri asset che possono restare nella cache.
- Per immagini importate da `src/`, preferisci gli import gestiti da Vite, così la build può includerle e applicare il fingerprint del contenuto.
- Non considerare `?v=...` una soluzione permanente al versionamento degli asset: è uno strumento di verifica/cache-busting per una richiesta specifica. La soluzione ordinaria per sostituire un asset pubblico è cambiare il nome del file e aggiornare i riferimenti.
- Non aggiungere file `_headers` o tag HTML `meta http-equiv="Cache-Control"` dando per scontato che configurino gli header HTTP di GitHub Pages: non equivalgono a una configurazione degli header di risposta del server. Se cambia la piattaforma di hosting, verifica la sua documentazione e configura lì la cache. Su un hosting che consente gli header, l'HTML di ingresso deve essere rivalidato (`Cache-Control: no-cache` o una policy equivalente); gli asset con nome content-hashed possono invece avere cache di lunga durata e `immutable`.

## Passaggi da eseguire dopo ogni modifica

1. **Identifica esattamente la versione da pubblicare.** Controlla branch, stato Git e commit. Le pubblicazioni del sito sono attivate da push su `main` tramite `.github/workflows/deploy.yml`; controlla il workflow reale prima di assumere che il trigger o il nome del workflow siano ancora questi.
2. **Esegui la build localmente.** Dalla root esegui `npm ci` e `npm run build` (oppure gli equivalenti del package manager solo se il progetto è stato deliberatamente migrato). Se la build fallisce, correggi il problema: non pubblicare e non dichiarare il lavoro concluso.
3. **Controlla l'output generato.** Verifica che `dist/index.html` e gli asset referenziati esistano. Per modifiche a UI, componenti, stili o testi, controlla anche i file generati in `dist/assets/`: per esempio, quando rimuovi un elemento, assicurati che il relativo markup o selettore non sia rimasto nel bundle prodotto. Non modificare mai `dist/` a mano.
4. **Pubblica il commit corretto.** Dopo il push, annota lo SHA completo del commit destinato alla pubblicazione. Non confondere il completamento di un aggiornamento file con il completamento del deploy.
5. **Attendi e controlla GitHub Actions.** Cerca il run di `.github/workflows/deploy.yml` associato esattamente a quello SHA (campo `head_sha`). Il run deve avere `status: completed` e `conclusion: success`; verifica inoltre che i job `build` e `deploy` siano entrambi riusciti. Un run precedente annullato non è un problema se il run più recente associato allo SHA finale termina con successo. Non considerare sufficiente il successo di un run riferito a un commit precedente.
6. **Verifica il sito realmente pubblicato, non solo GitHub.** Usa l'URL pubblico configurato nel repository/workflow. Per questo progetto l'URL atteso è `https://nonsonoturing.github.io/Libro-Digitale-Online/`, ma ricontrollalo se la configurazione Pages cambia. Richiedi l'HTML con cache-busting e istruzioni di rivalidazione, ad esempio:
   ```bash
   COMMIT="$(git rev-parse --short HEAD)"
   SITE_URL="https://nonsonoturing.github.io/Libro-Digitale-Online/"
   curl --fail --silent --show-error \
     -H "Cache-Control: no-cache" \
     -H "Pragma: no-cache" \
     "${SITE_URL}?v=${COMMIT}" \
     -o /tmp/libro-digitale-online-live.html
   ```
   Confronta gli URL degli script e dei fogli di stile nell'HTML remoto con quelli in `dist/index.html`. Scarica gli asset principali referenziati dalla pagina live e confrontali con quelli della build locale (per esempio tramite SHA-256); per una modifica specifica, controlla anche che il contenuto atteso sia effettivamente presente o assente nel bundle pubblicato. Una risposta HTTP positiva, da sola, non dimostra che sia stata distribuita la versione giusta.
7. **Diagnostica una pagina che sembra vecchia senza ripetere modifiche inutili al sorgente.** Se il sorgente e `dist/` sono corretti ma la pagina stabile mostra ancora la versione precedente:
   - verifica di nuovo SHA del commit, run Actions, URL Pages e asset hash effettivamente serviti;
   - ripeti la verifica con una query univoca basata sul commit (o sul timestamp della verifica) e con header `Cache-Control: no-cache` e `Pragma: no-cache`;
   - se la versione con query univoca è aggiornata ma quella all'URL stabile no, segnala che il problema è compatibile con una copia in cache del browser o di un livello intermedio; fornisci all'utente il link con parametro di versione e, se utile, le istruzioni per un hard refresh;
   - **non rimuovere nuovamente elementi dal codice, non cambiare CSS a tentativi e non creare commit duplicati** finché non hai dimostrato che l'elemento esiste ancora nel sorgente o nel bundle appena generato.
8. **Comunica lo stato con precisione.** Nel resoconto separa sempre: modifica salvata su GitHub, build locale riuscita, deploy del commit corretto riuscito, versione online verificata. Se non puoi leggere lo stato Actions o verificare gli asset pubblicati, dichiaralo esplicitamente e non dire che la modifica è già visibile online.

### Comandi di controllo suggeriti

Se GitHub CLI (`gh`) è disponibile e autenticata, puoi individuare e seguire il run relativo al commit con:

```bash
COMMIT="$(git rev-parse HEAD)"
gh run list --workflow deploy.yml --branch main --commit "$COMMIT" --limit 5 \
  --json databaseId,headSha,status,conclusion
```

Seleziona solo il run il cui `headSha` coincide esattamente con `COMMIT`, poi attendilo e controllane i job:

```bash
gh run watch RUN_ID --exit-status
gh run view RUN_ID --json headSha,status,conclusion,jobs
```

Se `gh` non è disponibile, usa l'integrazione GitHub o le API/UI di GitHub Actions per effettuare gli stessi controlli. Non inventare l'esito dei run e non interrompere la verifica dopo il solo controllo della build.

# 8. Verifica prima di concludere

- Controlla che i file importati, i percorsi e i riferimenti esistano.
- Verifica che i componenti usati nei contenuti siano registrati correttamente.
- Verifica la coerenza tra dati, capitoli e navigazione.
- Consulta `package.json` per individuare i comandi di controllo disponibili ed esegui quelli pertinenti, inclusa la build quando possibile.
- Prova le pagine, i temi e le interazioni interessate, anche su schermi piccoli.
- Controlla eventuali errori o regressioni introdotti.
- Nel resoconto finale indica cosa è stato modificato e quali verifiche sono state realmente eseguite. Non dichiarare controlli che non hai effettuato.
