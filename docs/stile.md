# Catalogo degli stili grafici

Questo documento raccoglie gli stili visivi riutilizzabili del progetto. Ogni stile è descritto come una ricetta autonoma: identità visiva, palette, tipografia, tecniche di disegno e codice di riferimento.

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

## Regole per riutilizzare lo stile

Quando si richiede una nuova figura con lo stile **sketch a mano**, usa questa scheda come riferimento per riprendere in modo coerente:

1. **Tratto a mano libera:** usa Rough.js per linee, rettangoli e contorni; come punto di partenza mantieni roughness intorno a 1.3–1.4 per gli assi e 1.3 per le forme.
2. **Riempimenti disegnati:** preferisci hachure per tratteggi paralleli e cross-hatch per tratteggi incrociati; mantieni hachureAngle intorno a 60° e hachureGap tra 4.5 e 5.
3. **Gesso e accento:** usa tratti bianco crema #f5f5f4 e azzurro polvere #60a5fa; per altre categorie scegli accenti poco saturi che restino leggibili sul fondo scuro.
4. **Scrittura:** usa Caveat per titoli, numeri ed etichette; riserva un carattere sans-serif alle sole interfacce di controllo quando serve maggiore leggibilità.
5. **Superficie:** usa fondo #121319, pannello #1c1e26, bordo chiaro semitrasparente, angoli da 12px e ombra morbida.
6. **Canvas nitido:** dimensiona il buffer in base a devicePixelRatio e mantieni le dimensioni CSS separate da quelle interne.
7. **Adattamento:** conserva leggibilità e spaziatura su mobile; quando una rappresentazione contiene molte categorie, riduci moderatamente il font e disponi le etichette inclinate invece di comprimerle.

Per ora questa è una ricetta grafica documentata, non un tema globale e non una dipendenza installata. Quando lo stile verrà implementato in un componente React del progetto, occorrerà adattare il prototipo alle convenzioni Vite/React/TypeScript, alle dipendenze effettivamente installate e al sistema di temi del sito.
