const imageUrlInput = document.getElementById('image-url');
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
    const imageUrl = imageUrlInput.value.trim();
    if (!imageUrl) {
        alert('Bitte füge eine gültige Bild-URL ein.');
        return;
    }
    loadImageAsMotif(imageUrl);
});

const loadingIndicator = document.getElementById('loading-indicator');

function loadImageAsMotif(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Für CORS-freie Bilder

    // Ladeanzeige einblenden
    loadingIndicator.style.display = 'block';

    img.onload = () => {
        console.log('Bild erfolgreich geladen:', imageUrl);

        // Maximale Bildgröße für schnellere Verarbeitung
        const maxWidth = 300; // Maximale Breite des Bildes
        const maxHeight = 300; // Maximale Höhe des Bildes

        // Bildgröße anpassen, falls es größer als die maximale Größe ist
        const aspectRatio = img.width / img.height;
        if (img.width > maxWidth || img.height > maxHeight) {
            if (aspectRatio > 1) {
                img.width = maxWidth;
                img.height = maxWidth / aspectRatio;
            } else {
                img.height = maxHeight;
                img.width = maxHeight * aspectRatio;
            }
        }

        // Canvas auf die angepasste Bildgröße setzen
        hiddenCanvas.width = img.width;
        hiddenCanvas.height = img.height;
        hiddenCtx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = hiddenCtx.getImageData(0, 0, img.width, img.height);
        const { data, width, height } = imageData;

        // Farben analysieren und zur Palette hinzufügen
        const colors = extractColors(data);
        updateColorPalette(colors);

        // Raster erstellen
        canvas.innerHTML = ''; // Canvas leeren
        canvas.style.display = 'grid';
        canvas.style.gridTemplateColumns = `repeat(${width}, 1px)`; // 1 Pixel pro Zelle
        canvas.style.gridTemplateRows = `repeat(${height}, 1px)`; // 1 Pixel pro Zelle

        // Zellen erstellen
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const color = `rgb(${r}, ${g}, ${b})`;

                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.style.width = '1px';
                cellElement.style.height = '1px';
                cellElement.style.backgroundColor = color;

                cellElement.addEventListener('click', () => {
                    cellElement.style.backgroundColor = selectedColor;
                });

                canvas.appendChild(cellElement);
            }
        }

        console.log('Raster erfolgreich erstellt.');

        // Ladeanzeige ausblenden
        loadingIndicator.style.display = 'none';
    };

    img.onerror = () => {
        console.error('Fehler beim Laden des Bildes:', imageUrl);
        alert('Das Bild konnte nicht geladen werden. Bitte überprüfe die URL.');

        // Ladeanzeige ausblenden
        loadingIndicator.style.display = 'none';
    };

    img.src = imageUrl;
}
// Funktion, um die Verarbeitung in Blöcken durchzuführen
function processImageInChunks(data, width, height, scaleFactor, blockSize) {
    let y = 0;

    function processRow() {
        if (y >= height) return; // Verarbeitung abgeschlossen

        for (let x = 0; x < width; x += blockSize) {
            const color = getAverageColor(data, width, x, y, blockSize);

            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.style.width = `${scaleFactor}px`;
            cellElement.style.height = `${scaleFactor}px`;
            cellElement.style.backgroundColor = color;

            cellElement.addEventListener('click', () => {
                cellElement.style.backgroundColor = selectedColor;
            });

            canvas.appendChild(cellElement);
        }

        y += blockSize;
        setTimeout(processRow, 0); // Nächste Zeile asynchron verarbeiten
    }

    processRow();
}

// Funktion, um die Durchschnittsfarbe eines Blocks zu berechnen
function getAverageColor(data, width, startX, startY, blockSize) {
    let r = 0, g = 0, b = 0, count = 0;

    for (let y = startY; y < startY + blockSize && y < height; y++) {
        for (let x = startX; x < startX + blockSize && x < width; x++) {
            const index = (y * width + x) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            count++;
        }
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return `rgb(${r}, ${g}, ${b})`;
}

// Funktion, um alle Farben aus den Bilddaten zu extrahieren
function extractColors(data) {
    const uniqueColors = new Set();

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const color = `rgb(${r}, ${g}, ${b})`;

        uniqueColors.add(color); // Fügt nur eindeutige Farben hinzu
    }

    // Gib die Farben als Array zurück
    return Array.from(uniqueColors);
}

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