const imageSelect = document.getElementById('image-select');
const loadImageButton = document.getElementById('load-image');
const hiddenCanvas = document.getElementById('hidden-canvas');
const hiddenCtx = hiddenCanvas.getContext('2d');
const canvas = document.getElementById('canvas');
const colorPalette = document.getElementById('color-palette');

let selectedColor = 'black'; // Standardfarbe

// Event-Listener für die Farbauswahl
colorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color')) {
        selectedColor = e.target.dataset.color;
        console.log('Ausgewählte Farbe:', selectedColor);
    }
});

// Event-Listener für das Laden eines Bildes
loadImageButton.addEventListener('click', () => {
    const imageName = imageSelect.value;
    const imageUrl = `images/${imageName}`;
    loadImageAsMotif(imageUrl);
});

function loadImageAsMotif(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Für CORS-freie Bilder
    img.onload = () => {
        const cellSize = 5; // Kleinere Zellen für mehr Details
        hiddenCanvas.width = img.width;
        hiddenCanvas.height = img.height;
        hiddenCtx.drawImage(img, 0, 0);

        const imageData = hiddenCtx.getImageData(0, 0, img.width, img.height);
        const { data, width, height } = imageData;

        // Farben analysieren und zur Palette hinzufügen
        const colors = extractColors(data);
        updateColorPalette(colors);

        canvas.innerHTML = ''; // Canvas leeren
        canvas.style.display = 'grid';
        canvas.style.gridTemplateColumns = `repeat(${Math.floor(width / cellSize)}, ${cellSize}px)`;

        for (let y = 0; y < height; y += cellSize) {
            for (let x = 0; x < width; x += cellSize) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.style.width = `${cellSize}px`;
                cellElement.style.height = `${cellSize}px`;
                cellElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

                cellElement.addEventListener('click', () => {
                    cellElement.style.backgroundColor = selectedColor;
                });

                canvas.appendChild(cellElement);
            }
        }
    };

    img.onerror = () => {
        alert('Das Bild konnte nicht geladen werden. Bitte überprüfe die URL.');
    };

    img.src = imageUrl;
}

// Funktion, um die häufigsten Farben aus den Bilddaten zu extrahieren
function extractColors(data) {
    const colorMap = new Map();

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const color = `rgb(${r}, ${g}, ${b})`;

        if (colorMap.has(color)) {
            colorMap.set(color, colorMap.get(color) + 1);
        } else {
            colorMap.set(color, 1);
        }
    }

    // Sortiere die Farben nach Häufigkeit und gib die Top 10 zurück
    return [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([color]) => color);
}

// Funktion, um die Farbpalette zu aktualisieren
function updateColorPalette(colors) {
    colorPalette.innerHTML = ''; // Palette leeren

    colors.forEach((color) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color';
        colorButton.style.backgroundColor = color;
        colorButton.dataset.color = color;
        colorPalette.appendChild(colorButton);
    });

    console.log('Aktualisierte Farbpalette:', colors);
}