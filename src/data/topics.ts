export type Chapter = { id: string; title: string; minutes: number; sections: string[] };
export type Topic = {
  id: string; numeral: string; title: string; subtitle: string; discipline: string; level: string;
  hours: string; abstract: string; homeDescription: string; homeHoverDescription: string; cover: string; style: "technical" | "solid" | "sketch";
  styleLabel: string; accent: { light: string; dark: string }; keywords: string[]; prerequisites: string[]; references: string[]; chapters: Chapter[];
};

const image = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;

export const topics: Topic[] = [
  {
    id: "reti-neurali", numeral: "I", title: "Reti neurali artificiali", subtitle: "Dal neurone al gradiente",
    discipline: "Informatica · Apprendimento automatico", level: "Triennale, secondo anno", hours: "≈ 1 h",
    abstract: "Un percorso rigoroso dal neurone di McCulloch–Pitts alla retropropagazione dell'errore: che cosa calcola una rete, perché la profondità conta e come i pesi vengono appresi dai dati. Con laboratori interattivi per percettrone, funzioni di attivazione e discesa del gradiente.",
    homeDescription: "Segnali, memoria e apprendimento nelle reti artificiali.",
    homeHoverDescription: "Dal neurone artificiale alle reti di più strati: segnali, pesi e funzioni di attivazione trasformano i dati in previsioni. Il gradiente mostra come la rete corregge i propri pesi durante l’apprendimento.",
    cover: image("cover-neural.svg"), style: "technical", styleLabel: "Figure tecniche su carta millimetrata · grafici animati",
    accent: { light: "#2c6e7e", dark: "#5fb3c4" }, keywords: ["percettrone", "attivazioni", "backpropagation", "gradiente", "generalizzazione"],
    prerequisites: ["Algebra lineare: vettori, matrici, prodotto", "Calcolo: derivate parziali e regola della catena", "Nozioni di probabilità elementare"],
    references: [
      "McCulloch, W. S., Pitts, W. (1943). A logical calculus of the ideas immanent in nervous activity. Bulletin of Mathematical Biophysics, 5.",
      "Rosenblatt, F. (1958). The perceptron: a probabilistic model for information storage and organization in the brain. Psychological Review, 65.",
      "Minsky, M., Papert, S. (1969). Perceptrons. MIT Press.",
      "Rumelhart, D. E., Hinton, G. E., Williams, R. J. (1986). Learning representations by back-propagating errors. Nature, 323.",
      "Cybenko, G. (1989). Approximation by superpositions of a sigmoidal function. Mathematics of Control, Signals and Systems, 2.",
      "Goodfellow, I., Bengio, Y., Courville, A. (2016). Deep Learning. MIT Press.",
    ],
    chapters: [
      { id: "neurone", title: "Il neurone artificiale", minutes: 18, sections: ["Un'astrazione del neurone biologico", "Il percettrone di Rosenblatt", "Funzioni di attivazione", "Il limite: la funzione XOR"] },
      { id: "architettura", title: "Architettura e propagazione in avanti", minutes: 16, sections: ["Strati, pesi e bias", "La notazione matriciale", "Il teorema di approssimazione universale", "Profondità contro larghezza"] },
      { id: "apprendimento", title: "Apprendimento", minutes: 22, sections: ["La funzione di perdita", "La discesa del gradiente", "La retropropagazione dell'errore", "Ottimizzatori, regolarizzazione e generalizzazione"] },
    ],
  },
  {
    id: "il-cubo", numeral: "II", title: "Il cubo", subtitle: "Geometria, simmetria e la quarta dimensione",
    discipline: "Matematica · Geometria", level: "Triennale, primo anno", hours: "≈ 55 min",
    abstract: "Un solo oggetto, osservato fino in fondo: la formula di Eulero, i cinque solidi platonici, il gruppo delle 24 rotazioni, le matrici che le descrivono, e infine il tesseratto — ciò che il cubo diventa quando si aggiunge una dimensione. Modelli tridimensionali manipolabili in ogni capitolo.",
    homeDescription: "Forma, simmetria e geometria oltre la terza dimensione.",
    homeHoverDescription: "Dai vertici, spigoli e facce si passa alle rotazioni che conservano il cubo. La quarta dimensione entra in scena con il tesseratto, esplorato attraverso simmetrie e proiezioni.",
    cover: image("cover-cube.svg"), style: "solid", styleLabel: "Modelli 3D interattivi · proiezioni isometriche",
    accent: { light: "#b5652a", dark: "#e08a4e" }, keywords: ["Eulero", "solidi platonici", "gruppo S₄", "rotazioni", "tesseratto"],
    prerequisites: ["Geometria euclidea elementare", "Trigonometria di base", "Familiarità con il concetto di matrice (utile, non indispensabile)"],
    references: [
      "Euclide. Elementi, libro XIII.",
      "Coxeter, H. S. M. (1973). Regular Polytopes. Dover.",
      "Richeson, D. S. (2008). Euler's Gem: The Polyhedron Formula and the Birth of Topology. Princeton University Press.",
      "Weyl, H. (1952). Symmetry. Princeton University Press.",
      "Abbott, E. A. (1884). Flatland: A Romance of Many Dimensions.",
      "Cromwell, P. R. (1997). Polyhedra. Cambridge University Press.",
    ],
    chapters: [
      { id: "anatomia", title: "Anatomia di un solido", minutes: 17, sections: ["Vertici, spigoli, facce", "La formula di Eulero", "Perché solo cinque solidi", "Lo sviluppo piano"] },
      { id: "simmetria", title: "Simmetria e rotazioni", minutes: 19, sections: ["Il gruppo delle rotazioni", "Tredici assi", "Matrici di rotazione e proiezioni", "Dualità"] },
      { id: "ipercubo", title: "Oltre la terza dimensione", minutes: 18, sections: ["Dal punto all'ipercubo", "Il tesseratto in rotazione", "Contare le facce dell'ipercubo", "Ombre e proiezioni"] },
    ],
  },
  {
    id: "il-quadro", numeral: "III", title: "Il quadro", subtitle: "Luce, colore e composizione nella pittura",
    discipline: "Storia dell'arte · Teoria della visione", level: "Triennale, corso introduttivo", hours: "≈ 1 h",
    abstract: "Come si legge un dipinto? Attraverso una natura morta analizzata strato per strato: la struttura dei valori, la legge di Lambert e le cinque zone della forma, il cerchio cromatico e il contrasto simultaneo, le griglie compositive e il peso visivo. Ogni strumento è una lente da attivare sull'opera.",
    homeDescription: "Luce, colore e composizione per imparare a leggere un dipinto.",
    homeHoverDescription: "Leggere un dipinto significa seguire la luce, distinguere i valori tonali e capire come i colori si influenzano. La composizione rivela il percorso dello sguardo e l’equilibrio dell’opera.",
    cover: image("cover-painting.svg"), style: "sketch", styleLabel: "Taccuino da disegno · ombre a retino di punti",
    accent: { light: "#8c3a3a", dark: "#d46a6a" }, keywords: ["valore", "chiaroscuro", "cerchio cromatico", "sezione aurea", "peso visivo"],
    prerequisites: ["Nessun prerequisito formale", "Curiosità per la pittura del Seicento", "Un occhio disposto a socchiudersi"],
    references: [
      "Arnheim, R. (1954). Arte e percezione visiva. Feltrinelli.",
      "Albers, J. (1963). Interazione del colore. Il Saggiatore.",
      "Itten, J. (1961). Arte del colore. Il Saggiatore.",
      "Chevreul, M.-E. (1839). De la loi du contraste simultané des couleurs.",
      "Bouleau, C. (1963). La geometria segreta dei pittori. Electa.",
      "Livio, M. (2002). La sezione aurea. Rizzoli.",
    ],
    chapters: [
      { id: "luce", title: "La luce e il valore", minutes: 19, sections: ["La scala dei valori", "La direzione della luce e la forma", "Ombre proprie e ombre portate", "Il retino: ombre a puntini"] },
      { id: "colore", title: "Il colore", minutes: 18, sections: ["Il cerchio cromatico", "Tinta, saturazione, luminosità", "Contrasto simultaneo e temperatura", "Le tavolozze dei maestri"] },
      { id: "composizione", title: "La composizione", minutes: 20, sections: ["Griglie: terzi, sezione aurea, armatura", "Il percorso dello sguardo", "Peso visivo ed equilibrio", "Analisi guidata di un'opera"] },
    ],
  },
  {
    id: "neoclassicismo", numeral: "IV", title: "Neoclassicismo", subtitle: "Canova e David: la forma dell'ideale",
    discipline: "Storia dell'arte · Scultura e pittura", level: "Corso introduttivo", hours: "≈ 45 min",
    abstract: "Due artisti, due linguaggi e un dialogo con l'antico. Attraverso quattro sculture di Antonio Canova e tre dipinti di Jacques-Louis David, il corso esplora equilibrio, gesto, memoria e impegno civile; le immagini delle opere accompagnano la lettura della composizione e dei loro significati.",
    homeDescription: "Corpo, luce e allegoria: il momento del Neoclassico.",
    homeHoverDescription: "Canova e David guardano all’antico per costruire un nuovo ideale: nella scultura contano equilibrio e gesto, nella pittura mito e virtù civica diventano immagini di impegno e memoria.",
    cover: image("cover-neoclassic.jpg"), style: "solid", styleLabel: "Riproduzioni delle opere · lettura storico-artistica",
    accent: { light: "#755b3f", dark: "#d0ae78" }, keywords: ["Canova", "David", "ideale classico", "mito", "memoria", "virtù civica"],
    prerequisites: ["Nessun prerequisito formale", "Curiosità per la scultura e la pittura europea tra Sette e Ottocento"],
    references: [
      "Museo del Louvre, schede di collezione: Amore e Psiche; Il giuramento degli Orazi.",
      "State Hermitage Museum, scheda di collezione: Le Tre Grazie, Antonio Canova.",
      "Augustinerkirche, Vienna, Monumento funebre di Maria Cristina d'Austria.",
      "Galleria Borghese, scheda di collezione: Paolina Borghese come Venere vincitrice.",
      "Royal Museums of Fine Arts of Belgium, schede di collezione: La morte di Marat; Marte disarmato da Venere e dalle Grazie.",
      "Honour, H. (1968). Neoclassicism. Penguin Books.",
    ],
    chapters: [
      { id: "antonio-canova", title: "Antonio Canova", minutes: 24, sections: ["Amore e Psiche", "Le Tre Grazie", "Monumento funebre di Maria Cristina d'Austria", "Paolina Borghese"] },
      { id: "jacques-louis-david", title: "Jacques-Louis David", minutes: 21, sections: ["Il giuramento degli Orazi", "La morte di Marat", "Marte disarmato"] },
    ],
  },
  {
    id: "linguaggio-c", numeral: "V", title: "Il Linguaggio C", subtitle: "Dalle istruzioni alla memoria",
    discipline: "Informatica · Programmazione", level: "Corso introduttivo", hours: "≈ 1 h 30 min",
    abstract: "Un percorso per capire come un programma C nasce, viene compilato e lavora vicino alla macchina. Si parte dalla struttura di un eseguibile e dai tipi, si passa per funzioni, array e stringhe, fino a puntatori, memoria dinamica, strutture e file. Gli esempi seguono C17 e privilegiano codice leggibile, controlli espliciti e comportamento definito.",
    homeDescription: "Istruzioni, dati e memoria: imparare a pensare con il C.",
    homeHoverDescription: "Dal primo programma alla gestione esplicita della memoria: il C rende visibili tipi, indirizzi e responsabilità del programmatore. Un percorso pratico tra compilazione, funzioni, array, puntatori e file.",
    cover: image("cover-c.svg"), style: "technical", styleLabel: "Programmazione · compilazione · memoria",
    accent: { light: "#276b68", dark: "#65b8a9" }, keywords: ["C17", "compilatore", "funzioni", "array", "puntatori"],
    prerequisites: ["Nessun prerequisito di programmazione", "È utile saper usare file e cartelle; gli esempi da terminale sono spiegati passo per passo"],
    references: [
      "Kernighan, B. W., Ritchie, D. M. (1988). The C Programming Language, 2nd ed. Prentice Hall.",
      "King, K. N. (2008). C Programming: A Modern Approach, 2nd ed. W. W. Norton.",
      "ISO/IEC 9899:2018. Programming Languages — C (C17).",
      "cppreference.com, C language reference: https://en.cppreference.com/w/c",
      "GNU Project, GCC documentation: https://gcc.gnu.org/onlinedocs/",
    ],
    chapters: [
      { id: "programma", title: "Dal sorgente all'eseguibile", minutes: 16, sections: ["La forma di un programma C", "Compilare e leggere gli errori", "Variabili e tipi fondamentali", "Input e output"] },
      { id: "controllo", title: "Tipi, espressioni e controllo", minutes: 17, sections: ["Numeri, caratteri e conversioni", "Operatori ed espressioni", "Selezione: if e switch", "Iterazione: while e for"] },
      { id: "funzioni-array", title: "Funzioni, array e stringhe", minutes: 20, sections: ["Progettare con le funzioni", "Array e indici", "Stringhe come sequenze di char", "Passare dati alle funzioni"] },
      { id: "puntatori", title: "Puntatori e memoria", minutes: 20, sections: ["Indirizzi e dereferenziazione", "Puntatori e array", "Memoria dinamica", "Durata degli oggetti e sicurezza"] },
      { id: "strutture-file", title: "Strutture e file", minutes: 17, sections: ["struct, enum e typedef", "Collezioni di dati", "Leggere e scrivere file", "Organizzare un programma robusto"] },
    ],
  },
];
