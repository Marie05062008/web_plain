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
    const imageUrl = imageUrlInput.value;
    if (!imageUrl) {
        alert('Bitte füge eine gültige Bild-URL ein.');
        return;
    }
    loadImageAsMotif(imageUrl);
});

function loadImageAsMotif(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Für CORS-freie Bilder
    img.onload = () => {
        console.log('Bild erfolgreich geladen:', imageUrl);

        const cellSize = 1; // 1x1 Pixel-Auflösung
        const scaleFactor = 5; // Vergrößerungsfaktor für bessere Sichtbarkeit
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
        canvas.style.gridTemplateColumns = `repeat(${width}, ${cellSize * scaleFactor}px)`;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const pixelColor = `rgb(${r}, ${g}, ${b})`;

                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.style.width = `${cellSize * scaleFactor}px`;
                cellElement.style.height = `${cellSize * scaleFactor}px`;

                // Überprüfen, ob die Farbe mit einer aus der Palette übereinstimmt
                const matchingColor = findMatchingColor(pixelColor);
                if (matchingColor) {
                    cellElement.style.backgroundColor = matchingColor;
                } else {
                    cellElement.style.backgroundColor = 'white'; // Standardfarbe für nicht erkannte Farben
                }

                cellElement.addEventListener('click', () => {
                    cellElement.style.backgroundColor = selectedColor;
                });

                canvas.appendChild(cellElement);
            }
        }
    };

    img.onerror = () => {
        console.error('Fehler beim Laden des Bildes:', imageUrl);
        alert('Das Bild konnte nicht geladen werden. Bitte überprüfe die URL.');
    };

    img.src = imageUrl;
}

// Funktion, um alle Farben aus den Bilddaten zu extrahieren
function extractColors(data) {
    const colorMap = new Map();

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const color = `rgb(${r}, ${g}, ${b})`;

        if (!colorMap.has(color)) {
            colorMap.set(color, 1);
        }
    }

    // Gib alle Farben zurück
    return [...colorMap.keys()];
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

// Funktion, um eine passende Farbe aus der Palette zu finden
function findMatchingColor(pixelColor) {
    const paletteColors = Array.from(colorPalette.children).map(
        (button) => button.dataset.color
    );
    return paletteColors.find((color) => color === pixelColor) || null;
}