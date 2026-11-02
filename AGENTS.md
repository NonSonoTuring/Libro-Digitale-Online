# AGENTS.md — Manuale di orientamento e lavoro per l'IA

Questo file spiega a un modello linguistico (LLM) come comprendere, esplorare e modificare il progetto in modo coerente. È una guida di orientamento e di coordinamento: definisce le regole da seguire, chiarisce le responsabilità delle diverse parti del codice e indica come trovare la fonte corretta da modificare.

**Non è un inventario del progetto.** Non deve contenere elenchi dettagliati di corsi, capitoli, componenti, interazioni, dipendenze o altre informazioni che possono cambiare durante l'evoluzione del prodotto. Questi dettagli appartengono al codice e alla documentazione specifica. Prima di intervenire, l'IA deve ricavarli dai file effettivi e seguire i collegamenti tra definizioni, utilizzi e registrazioni.

L'LLM deve usare questo documento come punto di partenza, non come sostituto dell'esplorazione del repository. Non deve presumere che nomi, percorsi, funzionalità o tecnologie siano rimasti invariati: deve verificarli ogni volta. Deve privilegiare modifiche mirate, preservare il funzionamento complessivo e non inventare strutture o convenzioni che non trova nel progetto.

# 1. Il progetto

**Prima di iniziare qualsiasi attività descritta in questa sezione, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Libro Digitale Online è un ambiente digitale per creare, organizzare e consultare materiali didattici. Il suo scopo è trasformare argomenti di studio in percorsi di apprendimento strutturati, composti da contenuti editoriali e strumenti per esplorare i concetti.

Il progetto combina:
- organizzazione dei contenuti in percorsi, capitoli e sezioni;
- testi didattici con una struttura editoriale;
- immagini, illustrazioni, formule e materiali di supporto;
- elementi didattici riutilizzabili;
- visualizzazioni, dimostrazioni e attività interattive;
- navigazione e presentazione coerenti tra le diverse parti del prodotto.

L'obiettivo non è soltanto mostrare informazioni, ma aiutare chi studia a leggere, osservare, manipolare e comprendere i concetti. Ogni modifica deve quindi rispettare insieme **correttezza dei contenuti, chiarezza didattica, qualità visiva, usabilità, accessibilità e coerenza tecnica**.

L'insieme degli argomenti e delle funzionalità è destinato a evolvere. Non assumere che la selezione dei contenuti, il numero dei capitoli o le esperienze disponibili siano fissi.

# 2. Regola fondamentale: comprendere prima di modificare

**Prima di ogni attività, senza eccezioni, leggi integralmente tutti i file presenti in `docs/`, comprese le eventuali sottocartelle e i file vuoti. Poi rileggi questo `AGENTS.md`.**

Non leggere soltanto il documento che sembra pertinente: le regole di contenuto, stile e interattività possono influenzarsi a vicenda. Se un file è vuoto, prendine atto senza dedurne indicazioni.

Dopo la lettura:
1. esplora l'albero del repository e individua i file realmente coinvolti;
2. parti dal punto d'ingresso o dalla definizione della funzionalità e segui import, utilizzi, registri e dipendenze;
3. identifica la fonte di verità dei dati, dei contenuti o del comportamento che devi cambiare;
4. controlla gli effetti della modifica sulle altre parti dell'applicazione;
5. intervieni soltanto dove serve, evitando duplicazioni e refactoring estranei alla richiesta;
6. aggiorna la documentazione quando cambiano procedure, convenzioni o architettura;
7. esegui le verifiche pertinenti e distingui sempre i controlli svolti da quelli non svolti.

**Come risolvere eventuali contraddizioni**
- Il codice effettivamente utilizzato determina il comportamento attuale.
- I file di configurazione e i manifest determinano le impostazioni e gli strumenti effettivi.
- I documenti in `docs/` descrivono le convenzioni e le procedure: se non corrispondono più al codice, non applicarli alla cieca.
- In caso di discrepanza, verifica il flusso reale, adatta il lavoro alla struttura esistente e aggiorna il documento interessato quando opportuno.
- Non creare file, cartelle, registri, componenti o procedure soltanto perché compaiono in un esempio non più attuale.

# 3. Come orientarsi nell'architettura

**Prima di esplorare o modificare l'architettura, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Il progetto è organizzato per responsabilità. I nomi e la posizione dei singoli file possono evolvere: usa questa mappa per capire quale parte cercare, poi verifica i percorsi reali nel repository.

| Responsabilità | Che cosa contiene | Dove orientare la ricerca |
|---|---|---|
| Avvio e applicazione | Inizializzazione, composizione delle pagine, navigazione e stato globale | Punto d'ingresso dell'applicazione e componente radice |
| Dati e struttura didattica | Definizioni dei percorsi, capitoli, sezioni, metadati e relativi tipi | Moduli dati e modelli condivisi |
| Contenuti | Testi dei capitoli, sezioni, figure e richiami agli elementi didattici | Cartelle dei contenuti e file MDX |
| Presentazione | Pagine, layout, navigazione, blocchi e controlli riutilizzabili | Componenti dell'interfaccia |
| Esperienze interattive | Logica di grafici, modelli, simulazioni, animazioni e controlli specifici | Moduli delle funzionalità e relativi componenti |
| Registrazione e rendering dei contenuti | Associazione tra nomi usati nei documenti e componenti che li renderizzano | Moduli di registrazione MDX e caricamento dei capitoli |
| Stile e temi | Aspetto generale, tipografia, colori, variabili, layout e adattamento agli schermi | Fogli di stile e relativi punti d'importazione |
| Risorse | Immagini, illustrazioni, file statici e materiali locali | Cartelle degli asset, risorse pubbliche e asset dei contenuti |
| Strumenti e pubblicazione | Dipendenze, script, compilazione, configurazione e distribuzione | Manifest, configurazioni e workflow di automazione |

Il flusso concettuale da seguire è: **definizione dei dati e dei contenuti → caricamento e associazione dei componenti → presentazione nell'interfaccia → applicazione degli stili e delle interazioni**. Verifica sempre il flusso effettivo: una funzionalità può attraversare più livelli.

Non presumere che aggiungere un file sia sufficiente. Un nuovo contenuto o componente potrebbe dover essere registrato, importato, associato a un percorso, incluso in un caricatore o referenziato da metadati.

# 4. Procedure per tipo di attività

**Prima di svolgere una qualsiasi delle attività elencate qui sotto, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.** Questa regola vale anche per modifiche circoscritte a un solo file.

## 4.1 Aggiungere, rimuovere o modificare un percorso didattico

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Individua la fonte che definisce la struttura dei percorsi e i dati usati per presentarli. Verifica come la pagina iniziale li recupera, come viene costruito l'indice, come sono identificati i capitoli e come viene caricato il loro contenuto.

Quando aggiungi, rinomini o rimuovi un elemento:
- mantieni coerenti identificatori, cartelle, metadati, collegamenti e riferimenti;
- verifica tutti i punti in cui l'elemento viene cercato, visualizzato o caricato;
- controlla che la navigazione non rimanga collegata a identificatori eliminati;
- rimuovi soltanto riferimenti realmente non più utilizzati;
- conserva l'ordine e le relazioni didattiche intenzionali.

Per la procedura editoriale dettagliata, segui `docs/contenuti.md`.

## 4.2 Scrivere o modificare testi e capitoli

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Individua il file sorgente del capitolo e i dati che ne descrivono titolo, sezioni, durata e informazioni accessorie. Il testo del capitolo e i dati che alimentano navigazione e intestazioni devono restare coerenti.

Controlla:
- gerarchia dei titoli e suddivisione in sezioni;
- identificatori delle sezioni e corrispondenza con l'indice;
- correttezza, chiarezza e progressione didattica;
- formule, figure, didascalie, riferimenti e attribuzioni;
- componenti richiamati dal documento e loro effettiva disponibilità;
- percorsi e modalità di caricamento delle risorse.

Non inserire logica applicativa complessa direttamente nel testo: separa i contenuti dalla loro implementazione e riutilizza gli elementi didattici condivisi.

Per struttura MDX, immagini, formule, metadati e convenzioni redazionali, consulta `docs/contenuti.md`.

## 4.3 Creare, modificare o rimuovere un'interazione

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Individua prima il punto in cui l'interazione viene mostrata nel contenuto e il meccanismo con cui il documento la riceve. Poi segui il collegamento fino al componente React che ne implementa il comportamento.

Verifica sempre i passaggi necessari:
1. implementazione della logica e della visualizzazione;
2. esportazione e registrazione del componente nel contesto corretto;
3. caricamento del registro da parte della pagina o del sistema che renderizza il contenuto;
4. richiamo del componente nel documento;
5. stili, risorse e dipendenze eventualmente necessarie.

Per rimuovere o sostituire un'interazione, cerca anche gli import, le registrazioni e i richiami nei contenuti. Non lasciare riferimenti interrotti e non eliminare un modulo prima di aver verificato che non sia usato altrove.

Le interazioni devono essere comprensibili, accessibili e utilizzabili con mouse, tastiera e touch quando pertinente. Gestisci correttamente stato, eventi, timer, animazioni e pulizia alla rimozione del componente. Considera le preferenze di movimento ridotto e le prestazioni sui dispositivi meno potenti.

Consulta `docs/interattivita.md` per le convenzioni dedicate; se non contiene indicazioni, ricava il comportamento dal codice esistente e non inventare regole attribuendole alla documentazione.

## 4.4 Modificare componenti didattici o di interfaccia condivisi

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Prima di modificare un componente condiviso, trova tutti i suoi utilizzi. Valuta se la modifica cambia il comportamento o l'aspetto in più pagine o capitoli. Mantieni compatibili le proprietà e le interfacce già usate oppure aggiorna in modo coordinato tutti i punti interessati.

Se introduci un nuovo componente richiamabile dai contenuti, assicurati che sia esportato e registrato nel sistema che rende quei contenuti. La presenza del file nel repository non lo rende automaticamente disponibile.

## 4.5 Modificare grafica, temi, layout o responsive design

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Individua il livello corretto: variabili e token condivisi, temi, regole globali, layout delle pagine oppure stile specifico di un componente. Preferisci le regole condivise quando il cambiamento deve essere coerente in più aree; limita gli stili locali ai casi realmente specifici.

Evita duplicazioni, valori discordanti e correzioni che risolvono una viewport rompendo le altre. Controlla almeno:
- tema chiaro e tema scuro, quando previsti;
- schermi larghi e stretti;
- gerarchia tipografica, contrasto e leggibilità;
- stati interattivi, focus da tastiera e movimento ridotto;
- coerenza con il linguaggio visivo del prodotto.

Consulta `docs/stile.md` per le convenzioni grafiche; se è vuoto o incompleto, verifica le regole nei fogli di stile e nei componenti effettivamente utilizzati.

## 4.6 Aggiungere o sostituire immagini e altre risorse

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Scegli la posizione in base all'ambito d'uso:
- risorsa locale a un singolo contenuto: vicino al contenuto che la utilizza;
- risorsa condivisa tra più contenuti: in una posizione comune appropriata;
- risorsa importata direttamente dal codice: tra gli asset sorgente;
- risorsa statica accessibile tramite percorso pubblico: nella cartella pubblica prevista dal progetto.

Segui gli import e gli URL già presenti per individuare la collocazione effettiva. Mantieni le proporzioni, ottimizza peso e formato senza deteriorare la qualità, fornisci testi alternativi significativi e rispetta licenze, attribuzioni e diritti d'uso. Non fare riferimento a URL esterni instabili quando il progetto richiede una risorsa locale.

## 4.7 Modificare navigazione, configurazione, dipendenze o pubblicazione

**Prima di iniziare, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Individua il punto che controlla il comportamento e segui il flusso completo prima di intervenire:
- per la navigazione, controlla definizione dei percorsi, collegamenti e gestione del cambio pagina;
- per le dipendenze, controlla manifest e lockfile e usa il package manager previsto;
- per la compilazione, controlla gli script e la configurazione del bundler;
- per i percorsi delle risorse, verifica gli ambienti di sviluppo e pubblicazione;
- per il deploy, controlla il workflow e il formato degli artefatti attesi.

Non inserire valori specifici di ambiente senza verificarne la necessità. Evita di modificare configurazioni non pertinenti alla richiesta e non aggiornare manualmente file generati dal package manager.

# 5. Regole trasversali di qualità

**Prima di applicare o modificare queste regole, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

- **Coerenza:** mantieni allineati dati, contenuti, identificatori, registri, collegamenti e interfacce.
- **Separazione delle responsabilità:** contenuti editoriali, dati, interfaccia e logica interattiva devono restare separati secondo l'architettura del progetto.
- **Riuso:** prima di creare un nuovo componente o una nuova regola, cerca una soluzione condivisa già presente.
- **Accessibilità:** cura semantica HTML, etichette, alternative testuali, contrasto, focus e navigazione da tastiera.
- **Responsive design:** non progettare soltanto per desktop; verifica come contenuti e controlli si comportano su schermi piccoli.
- **Prestazioni:** evita aggiornamenti inutili, caricamenti e animazioni superflui, lavoro ripetuto e risorse eccessivamente pesanti.
- **Robustezza:** gestisci stati vuoti, errori di caricamento, valori mancanti e pulizia delle risorse.
- **Manutenibilità:** preferisci codice leggibile e modifiche circoscritte; evita astrazioni premature e duplicazioni.
- **Accuratezza didattica:** non sacrificare la precisione concettuale per semplificare un'interazione o un effetto visivo.
- **Documentazione:** quando cambia una procedura, aggiorna il documento che la spiega; non copiare in questo file elenchi che devono essere mantenuti altrove.

# 6. Come mantenere questa guida nel tempo

**Prima di modificare questo file o la documentazione, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`.**

Questo documento deve rimanere valido anche quando cambiano gli argomenti, vengono aggiunti o rimossi capitoli, si sostituiscono componenti o si modificano strumenti e dipendenze.

Per mantenerlo stabile:
- descrivi responsabilità, relazioni e procedure, non l'inventario degli elementi presenti;
- non elencare i nomi dei corsi, dei capitoli, delle singole visualizzazioni o dei componenti installati;
- non fissare versioni, quantità, date, durate, nomi di branch, URL di distribuzione o altri valori soggetti a cambiamento, salvo che siano una convenzione tecnica indispensabile e verificata;
- rimanda ai file che sono la fonte di verità per i dettagli variabili;
- quando indichi un percorso come riferimento, chiarisci la responsabilità del modulo e invita a verificarne l'esistenza nel repository;
- non mantenere in parallelo un inventario già presente nei dati o nel codice;
- se cambia l'architettura, aggiorna la mappa e le procedure coinvolte, non aggiungere cronache di modifiche passate.

**Principio guida:** questo file deve aiutare l'IA a capire *come ragionare sul progetto e dove cercare*, non costringerla a memorizzare *quali elementi contiene oggi*.

# 7. Procedura di verifica e chiusura del lavoro

**Prima di verificare o concludere un'attività, leggi integralmente tutti i file della cartella `docs/` e poi rileggi questo `AGENTS.md`, soprattutto se la modifica ha cambiato architettura o convenzioni.**

Prima di dichiarare concluso il lavoro:
1. verifica che tutti i riferimenti modificati puntino a elementi esistenti;
2. controlla che aggiunte, rinomine e rimozioni siano coerenti in tutti i punti di utilizzo;
3. consulta il manifest del progetto per individuare i comandi di controllo effettivamente disponibili;
4. esegui la compilazione e i test pertinenti, se configurati;
5. prova manualmente i flussi e le interazioni interessati quando possibile;
6. controlla eventuali errori, avvisi o regressioni introdotti dalla modifica;
7. aggiorna i documenti coinvolti, senza copiare in `AGENTS.md` dettagli variabili;
8. comunica in modo trasparente cosa è stato cambiato e quali verifiche sono state realmente eseguite.

Non dichiarare test, build, controlli visivi o verifiche di pubblicazione che non sono stati eseguiti. Se un controllo non è possibile, indica il limite con precisione.
