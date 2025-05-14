const deviceSelectionContainer = document.getElementById('device-selection');
const themeSelectionContainer = document.getElementById('theme-selection');
const gameBoardContainer = document.getElementById('game-board-container');
const gameBoard = document.querySelector('.game-board');
const deviceButtons = document.querySelectorAll('.device-button');
const themeButtons = document.querySelectorAll('.theme-button');

let currentDevice = null; // Aktuelles Gerät (pc oder mobile)
let currentTheme = null; // Aktuelles Thema
let firstCard = null; // Erste umgedrehte Karte
let secondCard = null; // Zweite umgedrehte Karte
let lockBoard = false; // Verhindert weitere Klicks, während Karten überprüft werden

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
        'images/Motorräder/BMW S1000rr.jpg', // BMW
        'images/Motorräder/Ducati_Panigale_V4.jpg', // Ducati
        'images/Motorräder/Kawasaki_Ninja.jpg', // Kawasaki
        'images/Motorräder/Yamaha_R1M.jpg', // Yamaha
        'images/Motorräder/Honda.jpg', // Honda
        'images/Motorräder/Suzuki.jpg', // Suzuki
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

// Gerät auswählen
deviceButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentDevice = button.dataset.device; // Hole das Gerät aus dem data-device-Attribut

        // Füge die entsprechende Klasse zum Body hinzu
        document.body.classList.remove('pc', 'mobile');
        document.body.classList.add(currentDevice);

        // Zeige die Themen-Auswahl an
        deviceSelectionContainer.style.display = 'none';
        themeSelectionContainer.style.display = 'block';
    });
});

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

    themeSelectionContainer.style.display = 'none';
    gameBoardContainer.style.display = 'block';

    addCardEventListeners(); // Event-Listener für Karten hinzufügen
}

// Event-Listener für Karten hinzufügen
function addCardEventListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
}

// Karten-Klick-Logik
function handleCardClick(event) {
    if (lockBoard) return; // Verhindere Klicks, wenn das Board gesperrt ist

    const clickedCard = event.currentTarget;

    // Verhindere, dass dieselbe Karte zweimal angeklickt wird
    if (clickedCard === firstCard) return;

    clickedCard.classList.add('flipped');
    clickedCard.querySelector('img').style.visibility = 'visible';

    if (!firstCard) {
        // Erste Karte wird ausgewählt
        firstCard = clickedCard;
    } else {
        // Zweite Karte wird ausgewählt
        secondCard = clickedCard;
        lockBoard = true; // Sperre das Board, während die Karten überprüft werden

        checkForMatch();
    }
}

// Überprüfen, ob die Karten übereinstimmen
function checkForMatch() {
    const isMatch = firstCard.dataset.src === secondCard.dataset.src;

    if (isMatch) {
        // Karten bleiben aufgedeckt
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetTurn();
    } else {
        // Karten werden wieder umgedreht
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('img').style.visibility = 'hidden';
            secondCard.querySelector('img').style.visibility = 'hidden';
            resetTurn();
        }, 1000);
    }
}

// Zug zurücksetzen
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
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