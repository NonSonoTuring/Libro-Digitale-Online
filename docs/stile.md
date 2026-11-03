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

La grana globale non va confusa con `.halftone-shadow::before`: quest'ultimo è un retino locale a puntini usato come ombra decorativa su alcune figure e palette, e resta indipendente dalla texture uniforme di sfondo. La grana globale non va replicata aggiungendo filtri a ogni singola pagina o componente.

## Regole di estensione

- Per cambiare l'atmosfera globale, intervenire sui token in `themes.css`, non riscrivere i colori delle singole pagine.
- Per nuove superfici, usare `--color-surface`, `--color-surface-2` e gli alias compatibili `--surface`, `--card`, `--paper-2` e `--paper-3` in base alla gerarchia visiva.
- Per testo e bordi, usare `--ink`, `--ink-2`, `--ink-3` e `--rule`.
- Non applicare la palette carbone alle illustrazioni che hanno un proprio sfondo didattico o una palette semantica, a meno che la figura non debba adattarsi esplicitamente al tema.
- La modalità scura resta una scelta dell'utente e non modifica i colori del tema chiaro.

---

# Sketch a mano — lavagna

Nome breve dello stile: **sketch a mano** · Variante: **lavagna scura**

## Identità visiva

Stile da appunto illustrato su lavagna: forme geometriche tracciate a mano libera, contorni leggermente irregolari, riempimenti a tratteggio, testo manoscritto e superficie scura color ardesia.

- **Tipografia:** Google Font Caveat, con pesi 400, 600 e 700.
- **Disegno:** Rough.js 4.6.6 su Canvas 2D.
- **Tratto:** linee color gesso, con irregolarità controllata tramite Rough.js.
- **Riempimenti:** tratteggio diagonale hachure o incrociato cross-hatch.
- **Palette:** sfondo #121319, pannello #1c1e26, testo gesso #f5f5f4, testo secondario #e7e5e4, azzurro polvere #60a5fa.
- **Contenitore:** pannello scuro con bordo chiaro semitrasparente, angoli arrotondati e ombra profonda.
- **Adattamento:** canvas ad alta densità tramite devicePixelRatio; grafico in modalità compatta a 5 elementi o completa a 16 elementi.

Questa scheda è un riferimento estetico e non applica automaticamente lo stile al sito. Il prototipo qui sotto rimane un esempio HTML autonomo, importato da CDN, e non installa dipendenze nel progetto.

## Codice sorgente completo — index.html

~~~html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fig. 1.3 - Separabilità Lineare</title>
  
  <!-- Tailwind CSS per la disposizione e lo stile del contenitore -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts: Caveat per lo stile manoscritto uguale al taccuino/lavagna -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- Rough.js per il rendering vettoriale a mano libera sul Canvas -->
  <script src="https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.js"></script>

  <style>
    body {
      font-family: 'Caveat', cursive, sans-serif;
      background-color: #121319;
      color: #e2e8f0;
      letter-spacing: 0.5px;
    }

    /* Card principale effetto lavagna con il contorno a mano */
    .hand-drawn-card {
      border: 1.5px solid rgba(229, 231, 235, 0.2);
      border-radius: 12px;
      background-color: #1c1e26;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-3 sm:p-6 select-none">

  <!-- Contenitore Principale -->
  <div class="w-full max-w-4xl hand-drawn-card p-4 sm:p-8 relative overflow-hidden">
    
    <!-- Intestazione superiore sinistra -->
    <div class="text-stone-400 text-xl sm:text-2xl font-normal mb-2 flex justify-between items-center">
      <span>Figura 1.3 · interattiva</span>
      
      <!-- Selettore per switchare modalità -->
      <div class="text-sm font-sans bg-stone-800/80 p-1 rounded-lg border border-stone-700 flex gap-1">
        <button id="btn-5" onclick="setMode(5)" class="px-3 py-1 rounded-md text-white bg-stone-700 transition">5 Principali</button>
        <button id="btn-16" onclick="setMode(16)" class="px-3 py-1 rounded-md text-stone-400 hover:text-white transition">Tutte le 16</button>
      </div>
    </div>

    <!-- Canvas per il disegno -->
    <div class="w-full flex justify-center items-center py-2 overflow-x-auto">
      <canvas id="roughCanvas"></canvas>
    </div>

    <!-- Titolo della Figura sotto al grafico -->
    <div class="text-center text-stone-400 text-xl sm:text-2xl mt-4">
      Fig. 1.3 — Separabilità lineare delle funzioni booleane a due ingressi (1 = separabile).
    </div>
  </div>

  <script>
    // Dataset ridotto (screenshot) e completo (16 funzioni)
    const data5 = [
      { name: 'AND', val: 1, hatchStyle: 'hachure' },
      { name: 'OR', val: 1, hatchStyle: 'cross-hatch' },
      { name: 'NAND', val: 1, hatchStyle: 'hachure' },
      { name: 'XOR', val: 0, hatchStyle: 'none' },
      { name: 'XNOR', val: 0, hatchStyle: 'none' }
    ];

    const data16 = [
      { name: 'f0', val: 1 }, { name: 'f1 (AND)', val: 1 }, { name: 'f2', val: 1 }, { name: 'f3', val: 1 },
      { name: 'f4', val: 1 }, { name: 'f5', val: 1 }, { name: 'f6 (XOR)', val: 0 }, { name: 'f7 (OR)', val: 1 },
      { name: 'f8 (NOR)', val: 1 }, { name: 'f9 (XNOR)', val: 0 }, { name: 'f10', val: 1 }, { name: 'f11', val: 1 },
      { name: 'f12', val: 1 }, { name: 'f13', val: 1 }, { name: 'f14 (NAND)', val: 1 }, { name: 'f15', val: 1 }
    ];

    let currentMode = 5;

    function setMode(mode) {
      currentMode = mode;
      document.getElementById('btn-5').className = mode === 5 ? 'px-3 py-1 rounded-md text-white bg-stone-700 transition' : 'px-3 py-1 rounded-md text-stone-400 hover:text-white transition';
      document.getElementById('btn-16').className = mode === 16 ? 'px-3 py-1 rounded-md text-white bg-stone-700 transition' : 'px-3 py-1 rounded-md text-stone-400 hover:text-white transition';
      drawChart();
    }

    function drawChart() {
      const canvas = document.getElementById('roughCanvas');
      const width = currentMode === 5 ? 750 : 850;
      const height = 360;

      // Gestione risoluzione su display ad alta densità (Retina)
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const rc = rough.canvas(canvas);
      const activeData = currentMode === 5 ? data5 : data16;

      const margin = { top: 60, right: 40, bottom: 60, left: 70 };
      const chartW = width - margin.left - margin.right;
      const chartH = height - margin.top - margin.bottom;

      // 1. Disegno degli Assi Carteasiani (Bianco Gesso)
      rc.line(margin.left, margin.top - 10, margin.left, margin.top + chartH, {
        stroke: '#f5f5f4', strokeWidth: 2, roughness: 1.4
      });
      rc.line(margin.left - 10, margin.top + chartH, margin.left + chartW + 10, margin.top + chartH, {
        stroke: '#f5f5f4', strokeWidth: 2, roughness: 1.4
      });

      // Calcolo larghezza barra e spaziatura
      const numBars = activeData.length;
      const totalBarSpace = chartW * 0.85;
      const barWidth = Math.min(totalBarSpace / numBars, currentMode === 5 ? 85 : 35);
      const gap = (chartW - (barWidth * numBars)) / (numBars + 1);

      // 2. Disegno delle Barre e delle Etichette
      activeData.forEach((item, index) => {
        const x = margin.left + gap + index * (barWidth + gap);
        const barHeight = item.val * (chartH * 0.8);
        const y = margin.top + chartH - barHeight;

        // Disegno rettangolo barra
        if (item.val === 1) {
          const fillStyle = item.hatchStyle || 'hachure';
          
          rc.rectangle(x, y, barWidth, barHeight, {
            fill: '#60a5fa', // Azzurro polvere
            fillStyle: fillStyle, // hachure (tratti paralleli) o cross-hatch (quadrettato)
            fillWeight: 1.5,
            hachureAngle: 60,
            hachureGap: fillStyle === 'cross-hatch' ? 5 : 4.5,
            stroke: '#f5f5f4', // Bordo crema/gesso
            strokeWidth: 2,
            roughness: 1.3
          });
        }

        // Testo Valore (1 oppure 0 sopra la barra o la base)
        ctx.font = '24px "Caveat", cursive';
        ctx.fillStyle = '#f5f5f4';
        ctx.textAlign = 'center';
        const valY = item.val === 1 ? y - 12 : margin.top + chartH - 12;
        ctx.fillText(item.val.toString(), x + barWidth / 2, valY);

        // Testo Nome Funzione (Sotto l'asse X)
        ctx.save();
        ctx.font = currentMode === 5 ? '24px "Caveat", cursive' : '16px "Caveat", cursive';
        ctx.fillStyle = '#e7e5e4';
        
        if (currentMode === 16) {
          ctx.translate(x + barWidth / 2, margin.top + chartH + 20);
          ctx.rotate(-Math.PI / 4);
          ctx.textAlign = 'right';
          ctx.fillText(item.name, 0, 0);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(item.name, x + barWidth / 2, margin.top + chartH + 35);
        }
        ctx.restore();
      });
    }

    // Inizializzazione al caricamento
    window.onload = drawChart;
    window.onresize = drawChart;
  </script>
</body>
</html>
~~~

## Componenti e spiegazione del funzionamento

### 1. Google Font Caveat

- **Come funziona**: Viene importato tramite tag HTML link da Google Fonts.
- **Scopo**: Fornisce lo stile di scrittura a mano stile "lavagna" sia per l'interfaccia sia per il contesto 2D del Canvas; il codice imposta il font Caveat a 24 pixel per numeri e nomi delle porte logiche, garantendo loro il medesimo stile tipografico dell'immagine.

### 2. La libreria Rough.js (rough.canvas)

- **Come funziona**: Si sovrappone al tag HTML canvas standard e sostituisce i comandi di disegno vettoriale rigidi (come rect o lineTo) con algoritmi che generano curve di Bézier imperfette.
- **Proprietà usate nel codice**:
  - **roughness** (es. 1.3 / 1.4): Determina il grado di "tremolio" delle linee per simulare il gesto della mano con un gesso.
  - **fillStyle**: Sceglie la tecnica di riempimento. Nel codice usiamo:
    - **hachure**: Linee diagonali parallele (usato su **AND** e **NAND**).
    - **cross-hatch**: Tratteggio incrociato a griglia (usato sulla barra di **OR**, esattamente come nella tua immagine).
  - **hachureAngle** e **hachureGap**: Impostano l'inclinazione delle linee diagonali (60°) e la distanza in pixel tra una linea e l'altra.
  - **stroke** e **fill**: Definiscono rispettivamente il colore del bordo del rettangolo/linee (#f5f5f4, bianco gesso) e il colore dell'inchiostro/gesso di riempimento (#60a5fa, azzurro carta).

### 3. Gestione della densità di pixel Canvas (devicePixelRatio)

- **Come funziona**: Sui display ad alta risoluzione (Retina/Mobile), i canvas standard tendono ad apparire sgranati.
- **Soluzione nel codice**: Scaliamo la larghezza/altezza interna del canvas moltiplicandola per window.devicePixelRatio e usando ctx.scale(dpr, dpr). Questo garantisce linee nitide e perfette su qualsiasi schermo.

### 4. Disegno dinamico delle Barre e dei Testi

- **Posizionamento dinamico**: Il codice calcola lo spazio totale disponibile nell'asse X (chartW) e suddivide equamente lo spazio in base al numero di elementi (5 o 16 barre).
- **Gestione del valore 0 (Non separabile)**: Se item.val === 0 (es. **XOR** e **XNOR**), il rettangolo non viene disegnato tramite rough.js. Viene invece disegnato direttamente il valore 0 posizionato appena sopra l'asse delle ascisse (margin.top + chartH - 12), rispecchiando la grafica del libro/taccuino.


---

## Esempio 2 — Teorema di Eulero sul piano complesso

Questo secondo esempio applica lo stesso linguaggio **sketch a mano — lavagna** a un diagramma matematico, non a un grafico a barre. Mostra che lo stile non coincide con un unico tipo di figura: tratto Rough.js, carattere manoscritto e superficie scura possono accompagnare contenuti diversi; geometria, colori semantici e annotazioni si scelgono in funzione del concetto da spiegare.

### Caratteristiche specifiche di questo esempio

- **Soggetto:** piano complesso con assi reale e immaginario, cerchio unitario, vettore posizione e componenti seno/coseno.
- **Dimensioni di riferimento:** canvas logico 700 × 450 px, con buffer moltiplicato per window.devicePixelRatio.
- **Geometria:** centro del cerchio in (260, 250), raggio 150 px, angolo θ = π/4 (45°).
- **Assi:** tratto grigio chiaro da gesso (#e7e5e4), con punte delle frecce disegnate con segmenti separati.
- **Cerchio unitario:** contorno grigio tenue (#a8a29e), tratteggiato.
- **Vettore e punto:** vettore bianco crema (#f5f5f4); punto evidenziato in azzurro (#60a5fa).
- **Componenti:** coseno in blu (#3b82f6), seno immaginario in rosso/terracotta (#ef4444), angolo θ in giallo (#facc15).
- **Testi:** Caveat in 22–26 px, con colore coerente con l'elemento a cui si riferiscono.
- **Contenitore:** pannello #1c1e26, bordo tenue e ombra; il canvas può scorrere orizzontalmente quando lo schermo è troppo stretto.

Qui non vengono usati riempimenti hachure o cross-hatch: l'effetto disegnato deriva da assi, cerchio, arco e segmenti tracciati con Rough.js. I tratteggi di riempimento sono quindi facoltativi, non un requisito dello stile.

### Codice sorgente completo — EulerTheoremSketch.tsx

~~~tsx
import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';

export default function EulerTheoremSketch() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dimensioni del canvas e gestione display ad alta risoluzione (Retina)
    const width = 700;
    const height = 450;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const rc = rough.canvas(canvas);

    // Parametri geometrici per la formula di Eulero sul piano di Gauss
    const centerX = 260;
    const centerY = 250;
    const radius = 150;
    const angle = Math.PI / 4; // θ = 45 gradi

    const pointX = centerX + radius * Math.cos(angle);
    const pointY = centerY - radius * Math.sin(angle);

    // 1. Assi Cartesiani (Reale e Immaginario) in stile gesso
    rc.line(60, centerY, width - 80, centerY, {
      stroke: '#e7e5e4',
      strokeWidth: 2,
      roughness: 1.3,
    });
    rc.line(centerX, height - 40, centerX, 50, {
      stroke: '#e7e5e4',
      strokeWidth: 2,
      roughness: 1.3,
    });

    // Frecce degli assi
    rc.line(width - 90, centerY - 6, width - 80, centerY, { stroke: '#e7e5e4', strokeWidth: 2, roughness: 1.2 });
    rc.line(width - 90, centerY + 6, width - 80, centerY, { stroke: '#e7e5e4', strokeWidth: 2, roughness: 1.2 });
    rc.line(centerX - 6, 60, centerX, 50, { stroke: '#e7e5e4', strokeWidth: 2, roughness: 1.2 });
    rc.line(centerX + 6, 60, centerX, 50, { stroke: '#e7e5e4', strokeWidth: 2, roughness: 1.2 });

    // 2. Cerchio Unitario (tratto a mano)
    rc.circle(centerX, centerY, radius * 2, {
      stroke: '#a8a29e',
      strokeWidth: 1.5,
      strokeLineDash: [6, 6],
      roughness: 1.5,
    });

    // 3. Componente Immaginaria: sin(θ) (linea verticale tratteggiata rossa/terracotta)
    rc.line(pointX, pointY, pointX, centerY, {
      stroke: '#ef4444',
      strokeWidth: 2,
      strokeLineDash: [4, 4],
      roughness: 1.2,
    });

    // 4. Componente Reale: cos(θ) (segmento blu orizzontale)
    rc.line(centerX, centerY, pointX, centerY, {
      stroke: '#3b82f6',
      strokeWidth: 2.5,
      roughness: 1.2,
    });

    // 5. Vettore Posizione e^(iθ)
    rc.line(centerX, centerY, pointX, pointY, {
      stroke: '#f5f5f4',
      strokeWidth: 2.5,
      roughness: 1.4,
    });

    // Punto del numero complesso sul cerchio
    rc.circle(pointX, pointY, 8, {
      fill: '#60a5fa',
      fillStyle: 'solid',
      stroke: '#f5f5f4',
      strokeWidth: 1.5,
    });

    // Arco per l'angolo θ
    rc.arc(centerX, centerY, 70, 70, -angle, 0, false, {
      stroke: '#facc15',
      strokeWidth: 2,
      roughness: 1.2,
    });

    // 6. Testi ed etichette nel canvas (usando il font "Caveat")
    ctx.font = '22px "Caveat", cursive';
    ctx.fillStyle = '#e7e5e4';

    // Etichette assi
    ctx.fillText('Re (Reale)', width - 75, centerY + 25);
    ctx.fillText('Im (Immaginario)', centerX - 45, 40);

    // Etichetta Angolo θ
    ctx.fillStyle = '#facc15';
    ctx.fillText('θ', centerX + 45, centerY - 15);

    // Etichetta del punto e^(iθ)
    ctx.fillStyle = '#60a5fa';
    ctx.font = '26px "Caveat", cursive';
    ctx.fillText('e^(iθ) = cos(θ) + i·sin(θ)', pointX + 15, pointY - 10);

    // Etichetta cos(θ)
    ctx.fillStyle = '#60a5fa';
    ctx.font = '22px "Caveat", cursive';
    ctx.fillText('cos(θ)', centerX + (pointX - centerX) / 2 - 15, centerY + 25);

    // Etichetta sin(θ)
    ctx.fillStyle = '#ef4444';
    ctx.fillText('i·sin(θ)', pointX + 10, centerY - (centerY - pointY) / 2);

  }, []);

  return (
    <div className="w-full max-w-4xl p-4 sm:p-8 rounded-xl bg-[#1c1e26] border border-stone-700/50 shadow-2xl my-6">
      <div className="text-stone-400 text-xl sm:text-2xl font-normal mb-2">
        Teorema di Eulero · Rappresentazione sul piano complesso
      </div>
      <div className="w-full flex justify-center items-center py-2 overflow-x-auto">
        <canvas ref={canvasRef} />
      </div>
      <div className="text-center text-stone-400 text-xl sm:text-2xl mt-4 font-hand">
        Fig. — Identità di Eulero e componenti armoniche nel cerchio unitario.
      </div>
    </div>
  );
}
~~~

Il corpo del componente conserva la struttura e le impostazioni dell'esempio ricevuto. Le due assegnazioni di larghezza e altezza CSS sopra sono riportate come template literal JavaScript, come nel codice originale.

### Come riutilizzare questo esempio senza trasformarlo in una regola

Quando il soggetto è geometrico o matematico, si possono riprendere solo gli elementi pertinenti:

- assi e frecce con Rough.js, senza pretendere che ogni segmento sia irregolare allo stesso modo;
- circonferenze, archi e vettori con contorni leggermente imperfetti;
- linee continue e tratteggiate per distinguere vettori, proiezioni e costruzioni ausiliarie;
- una palette semantica in cui ogni colore identifica una grandezza, mantenendo contrasto sul pannello scuro;
- annotazioni Caveat collocate vicino alla parte del disegno a cui si riferiscono.

Il diagramma non impone che tutte le figure matematiche siano disegnate sul piano complesso, che usino gli stessi colori o che abbiano queste dimensioni: geometria, proporzioni, etichette, palette e densità vanno riprogettate per ogni contenuto.

**Nota per l'adattamento TypeScript:** il codice ricevuto usa useRef(null). In un componente strettamente tipizzato conviene dichiarare il riferimento come useRef<HTMLCanvasElement>(null) e verificare i tipi restituiti da getContext; inoltre, in una versione destinata all'uso stabile, occorre gestire ridimensionamento e cleanup secondo il ciclo di vita React. Queste migliorie appartengono all'implementazione concreta, non cambiano il riferimento estetico.

---

## Indicazioni per ricreare e adattare lo stile

I valori qui sotto sono **punti di partenza desunti dagli esempi**, non specifiche rigide. Scegli di volta in volta solo gli elementi utili alla figura:

1. **Tratto a mano libera:** usa Rough.js per linee, cerchi, archi e contorni quando il soggetto beneficia dell'irregolarità. Negli esempi la roughness varia circa da 1.2 a 1.5; non occorre applicare lo stesso valore a tutte le forme.
2. **Riempimenti:** usa hachure o cross-hatch quando serve una campitura disegnata. Il tratteggio può anche essere assente: il cerchio unitario, gli assi e i vettori dell'esempio di Eulero usano soprattutto linee semplici, tratteggiate o continue.
3. **Gesso e accenti:** la base cromatica dell'esempio è #121319 / #1c1e26 con bianco crema #f5f5f4 e testo #e7e5e4. Gli accenti possono essere semantici e cambiare con il contenuto: blu #3b82f6 / #60a5fa, terracotta-rosso #ef4444 e giallo #facc15 compaiono nel diagramma di Eulero.
4. **Scrittura:** Caveat è il riferimento manoscritto mostrato negli esempi. Dimensione e peso si scelgono in base alla quantità di etichette e alla scala della figura; un carattere sans-serif può restare più adatto ai controlli dell'interfaccia.
5. **Superficie:** il pannello scuro #1c1e26, il fondo #121319, il bordo chiaro semitrasparente e l'ombra sono una possibile cornice. Non ogni figura deve avere una card o una cornice.
6. **Canvas nitido:** per Canvas 2D, dimensiona il buffer interno in base a devicePixelRatio e mantieni separate dimensioni CSS e dimensioni fisiche del canvas. Ripristina il contesto correttamente quando ridisegni.
7. **Layout e leggibilità:** scegli dimensioni, margini, orientamento delle etichette e rapporto d'aspetto in base al soggetto. Prevedi overflow orizzontale quando una figura larga non può essere compressa senza perdere leggibilità.

### Uso nel progetto React / TypeScript

Gli esempi sono prototipi autonomi e non installano né configurano automaticamente le librerie. Quando si decide di adottare questo stile in una figura reale:

- verifica prima le dipendenze presenti in package.json; se Rough.js non è installato e la figura lo richiede, aggiungilo tramite il package manager e aggiorna il lockfile, senza copiare gli script CDN dell'HTML dimostrativo;
- rendi disponibile Caveat secondo le scelte del progetto (font remoto o risorsa locale), mantenendo un fallback leggibile;
- porta il disegno in un componente React isolato, usando useRef<HTMLCanvasElement>(null) e un effetto per inizializzare e ridisegnare il canvas;
- gestisci cleanup, ridimensionamento, densità dello schermo e ridisegno quando cambiano i dati; evita di scalare ripetutamente il contesto senza ripristinarlo;
- mantieni la logica del disegno separata dal contenitore e dal testo editoriale; non copiare tutto il documento HTML dimostrativo dentro il componente;
- verifica contrasto, dimensioni e leggibilità su mobile e in entrambi i temi del sito. La variante lavagna scura può essere usata come superficie dedicata, senza forzare il tema globale dell'applicazione.

Queste indicazioni non rendono lo stile obbligatorio: la decisione di usarlo, limitarlo a una figura o modificarlo resta editoriale e specifica del singolo intervento. Per ora la scheda è documentazione e raccolta di esempi, non un tema globale né una dipendenza installata.


# Home — Forma e Codice

La Home adotta una composizione editoriale a piena larghezza, con contenuti allineati a una colonna massima di 1280 px. Il wrapper dell'applicazione non impone più una larghezza da foglio; `.book-container` contiene solo le parti editoriali. Header e pagine interne condividono lo stesso allineamento, mentre ticker e divisori del catalogo attraversano il viewport.

## Gerarchia della pagina

1. **Hero:** riga di metadati con edizione e stato didattico, seguita da un layout a due colonne. La colonna editoriale usa il kicker mono in terra, il titolo Fraunces `.display-title`, il sottotitolo serif, la descrizione, due azioni e tre indicatori. La colonna visiva usa le copertine dei primi tre percorsi registrati.
2. **Ticker:** striscia continua a larghezza piena; le voci derivano dai titoli dei capitoli e vengono duplicate per consentire l'animazione lineare fino a `translateX(-50%)`. L'animazione rallenta con `prefers-reduced-motion`.
3. **Catalogo:** sezione con bordo superiore e fondo `surface` attenuato. La testata allinea titolo e conteggio; la griglia usa tre colonne a partire dal breakpoint medio.
4. **Schede:** immagini a 240/260 px, gradiente scuro, disciplina, numerazione e titoli. Al passaggio del puntatore o al focus compare la scheda scura sovrapposta: sotto «Scheda del percorso» mostra la sola frase `homeDescription`, giustificata, seguita dalle parole chiave. Non mostra conteggi di capitoli o minuti. Il pannello inferiore ripete la frase breve e il comando per aprire il percorso; la descrizione estesa resta nella pagina interna.

## Contenuto e aggiornamento

Le schede non sono codificate una per una: `src/components/Home.tsx` legge `topics` da `src/data/topics.ts`. Numero dei percorsi, capitoli, minuti, ticker, copertine, titoli, `homeDescription` e parole chiave sono ricavati dai dati. Quando cambia il catalogo, si modificano i dati e non i contatori o la struttura JSX. La griglia resta a tre colonne sui desktop, ma accoglie anche ulteriori percorsi sulle righe successive.

## Token cromatici e accessibilità

Il terracotta della Home è il token `--terra` (utility `text-terra`), con variante più chiara nel tema scuro. `--muted`, `--ink-soft` e `--line` sono alias Tailwind dei token testuali e del bordo condivisi. Il focus da tastiera è visibile; su schermi stretti la hero diventa a colonna singola e le schede si dispongono verticalmente. Le animazioni rispettano `prefers-reduced-motion`.
