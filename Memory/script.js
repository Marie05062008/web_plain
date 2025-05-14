const gameModeContainer = document.getElementById('game-mode');
const themeSelectionContainer = document.getElementById('theme-selection');
const gameBoardContainer = document.getElementById('game-board-container');
const gameBoard = document.querySelector('.game-board');
const playAloneButton = document.getElementById('play-alone');
const playAgainstBotButton = document.getElementById('play-against-bot');
const restartButton = document.getElementById('restart-game');
const themeButtons = document.querySelectorAll('.theme-button');

let isPlayingAgainstBot = false; // Standardmäßig alleine spielen
let currentTheme = null; // Aktuelles Thema

// Themen mit lokalen Bildern
const themes = {
    automarken: [
        'images/Autos/BMW_M4.jpg', // BMW
        'images/Autos/Audi_R8.jpg', // Audi
        'images/Autos/Mercedes.jpg', // Mercedes
        'images/Autos/Ford_Mustang_GT.jpg', // Ford
        'images/Autos/Toyota_Mk4.jpg', // Toyota
        'images/Autos/Ford.jpg', // Ford
    ],
    tiere: [
        'images/Tiere/fieseKatzeiiih.jpg', // Katze
        'images/Tiere/Roter_Panda.jpg', // Roter Panda
        'images/Tiere/Tiger.jpg', // Tiger
        'images/Tiere/Eule.jpg', // Eule
        'images/Tiere/Otter.jpg', // Otter
        'images/Tiere/Hund.jpg', // Hund
    ],
    früchte: [
        'images/Obst/Apfel.jpg', // Apfel
        'images/Obst/Orange.jpg', // Orange
        'images/Obst/Traube.jpg', // Traube
        'images/Obst/Erdbeere.jpg', // Erdbeere
        'images/Obst/Ananas.jpg', // Ananas
        'images/Obst/Kirsche.jpg', // Kirsche
    ],
    motorräder: [
        'images/Motorräder/BMW S1000rr.jpg', //BMW
        'images/Motorräder/Ducati_Panigale_V4.jpg', //Ducati
        'images/Motorräder/Kawasaki_Ninja.jpg', //Kawasaki
        'images/Motorräder/Yamaha_R1M.jpg', //Yamaha
        'images/Motorräder/Honda.jpg', //Honda
        'images/Motorräder/Suzuki.jpg', //Suzuki
    ],
    tätigkeiten: [
        'images/Tätigkeiten/lesen.jpg', // Lesen
        'images/Tätigkeiten/schreiben.jpg', // Schreiben
        'images/Tätigkeiten/Kochen.jpg', // Kochen
        'images/Tätigkeiten/fahren.jpg', // Fahren
        'images/Tätigkeiten/springen.jpg', // Springen
        'images/Tätigkeiten/Tauchen.jpg', // Tauchen
    ],
};

// Karten mischen
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Spiel starten
function startGame(theme) {
    currentTheme = theme; // Speichere das aktuelle Thema
    gameBoard.innerHTML = '';
    const images = themes[theme];
    const cards = shuffle([...images, ...images]); // Paare erstellen
    cards.forEach(src => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.src = src;

        // Füge das Bild hinzu
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Memory Card';
        img.style.visibility = 'hidden'; // Standardmäßig verstecken
        img.style.maxWidth = '100%'; // Bildgröße anpassen
        img.style.maxHeight = '100%'; // Bildgröße anpassen
        img.style.objectFit = 'cover'; // Bild skaliert sich, um die Karte auszufüllen

        card.appendChild(img);
        gameBoard.appendChild(card);
    });

    gameModeContainer.style.display = 'none';
    themeSelectionContainer.style.display = 'none';
    gameBoardContainer.style.display = 'block';

    if (isPlayingAgainstBot) {
        setTimeout(botTurn, 2000); // Bot beginnt nach 2 Sekunden
    }
}

// Event-Listener für Themen-Buttons
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme; // Hole das Thema aus dem data-theme-Attribut
        if (theme) {
            startGame(theme); // Starte das Spiel mit dem ausgewählten Thema
        } else {
            alert('Thema nicht gefunden!');
        }
    });
});

// Spielmodus auswählen
playAloneButton.addEventListener('click', () => {
    isPlayingAgainstBot = false;
    gameModeContainer.style.display = 'none';
    themeSelectionContainer.style.display = 'block';
});

playAgainstBotButton.addEventListener('click', () => {
    isPlayingAgainstBot = true;
    gameModeContainer.style.display = 'none';
    themeSelectionContainer.style.display = 'block';
});

// Neustart-Button
restartButton.addEventListener('click', () => {
    if (currentTheme) {
        startGame(currentTheme); // Starte das Spiel mit dem aktuellen Thema neu
    } else {
        alert('Bitte wähle zuerst ein Thema aus!');
    }
});