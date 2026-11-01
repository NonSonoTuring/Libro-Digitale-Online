export type Chapter = { id: string; title: string; minutes: number; sections: string[] };
export type Topic = {
  id: string; numeral: string; title: string; subtitle: string; discipline: string; level: string;
  hours: string; abstract: string; cover: string; style: "technical" | "solid" | "sketch";
  styleLabel: string; accent: { light: string; dark: string }; keywords: string[]; prerequisites: string[]; references: string[]; chapters: Chapter[];
};

const image = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;

export const topics: Topic[] = [
  {
    id: "reti-neurali", numeral: "I", title: "Reti neurali artificiali", subtitle: "Dal neurone al gradiente",
    discipline: "Informatica · Apprendimento automatico", level: "Triennale, secondo anno", hours: "≈ 1 h",
    abstract: "Un percorso rigoroso dal neurone di McCulloch–Pitts alla retropropagazione dell'errore: che cosa calcola una rete, perché la profondità conta e come i pesi vengono appresi dai dati. Con laboratori interattivi per percettrone, funzioni di attivazione e discesa del gradiente.",
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
];
