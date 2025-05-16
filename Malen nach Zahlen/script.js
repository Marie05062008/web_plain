const motifSelect = document.getElementById('motif-select');
const loadMotifButton = document.getElementById('load-motif');
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

// Event-Listener für das Laden eines Motivs
loadMotifButton.addEventListener('click', () => {
    const motif = motifSelect.value;
    loadMotif(motif);
});

// Funktion, um ein Motiv zu laden
function loadMotif(motif) {
    canvas.innerHTML = ''; // Canvas leeren

    let motifData;
    if (motif === 'flower') {
        motifData = [
            [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 2, 2, 2, 2, 2, 0, 1, 0],
            [1, 0, 2, 0, 0, 0, 2, 0, 1, 0],
            [1, 0, 2, 0, 0, 0, 2, 0, 1, 0],
            [1, 0, 2, 2, 2, 2, 2, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        ];
    } else if (motif === 'house') {
        motifData = [
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
            [0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
            [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        ];
    } else if (motif === 'tree') {
        motifData = [
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
            [0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
            [0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        ];
    } else if (motif === 'heart') {
        motifData = [
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
            [0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
            [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        ];
    }

    // Canvas mit dem Motiv füllen
    motifData.forEach((row) => {
        row.forEach((cell) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.style.backgroundColor = cell === 1 ? 'gray' : 'white';
            cellElement.addEventListener('click', () => {
                if (cell === 0) {
                    cellElement.style.backgroundColor = selectedColor;
                }
            });
            canvas.appendChild(cellElement);
        });
    });
}