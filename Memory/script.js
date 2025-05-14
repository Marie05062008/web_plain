const gameBoard = document.querySelector('.game-board');
const themeButtons = document.querySelectorAll('.theme-selection button');
const playAloneButton = document.getElementById('play-alone');
const playAgainstBotButton = document.getElementById('play-against-bot');
const restartButton = document.getElementById('restart-game'); // Restart-Button

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

    if (isPlayingAgainstBot) {
        setTimeout(botTurn, 2000); // Bot beginnt nach 2 Sekunden
    }
}

// Kartenlogik
let firstCard = null;
let secondCard = null;
let lockBoard = false;

gameBoard.addEventListener('click', event => {
    if (isPlayingAgainstBot && lockBoard) return; // Spieler kann nicht klicken, wenn der Bot dran ist

    const clickedCard = event.target.closest('.card');
    if (!clickedCard || clickedCard.classList.contains('flipped') || lockBoard) return;

    clickedCard.classList.add('flipped');
    clickedCard.querySelector('img').style.visibility = 'visible';

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        lockBoard = true;

        if (firstCard.dataset.src === secondCard.dataset.src) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            resetTurn();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.querySelector('img').style.visibility = 'hidden';
                secondCard.querySelector('img').style.visibility = 'hidden';
                resetTurn();
            }, 1000);
        }
    }
});

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    if (isPlayingAgainstBot) {
        setTimeout(botTurn, 1000); // Bot ist nach 1 Sekunde dran
    }
}

// Bot-Logik
function botTurn() {
    const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.matched):not(.flipped)'));
    if (unmatchedCards.length < 2) return; // Keine Züge mehr möglich

    const firstBotCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    firstBotCard.classList.add('flipped');
    firstBotCard.querySelector('img').style.visibility = 'visible';

    setTimeout(() => {
        const secondBotCard = unmatchedCards.filter(card => card !== firstBotCard)[Math.floor(Math.random() * (unmatchedCards.length - 1))];
        secondBotCard.classList.add('flipped');
        secondBotCard.querySelector('img').style.visibility = 'visible';

        if (firstBotCard.dataset.src === secondBotCard.dataset.src) {
            firstBotCard.classList.add('matched');
            secondBotCard.classList.add('matched');
        } else {
            setTimeout(() => {
                firstBotCard.classList.remove('flipped');
                secondBotCard.classList.remove('flipped');
                firstBotCard.querySelector('img').style.visibility = 'hidden';
                secondBotCard.querySelector('img').style.visibility = 'hidden';
            }, 1000);
        }

        lockBoard = false; // Spieler ist wieder dran
    }, 1000);
}

// Spielmodus auswählen
playAloneButton.addEventListener('click', () => {
    isPlayingAgainstBot = false;
    alert('Du spielst alleine!');
});

playAgainstBotButton.addEventListener('click', () => {
    isPlayingAgainstBot = true;
    alert('Du spielst gegen den Bot!');
});

// Neustart-Button
restartButton.addEventListener('click', () => {
    if (currentTheme) {
        startGame(currentTheme); // Starte das Spiel mit dem aktuellen Thema neu
    } else {
        alert('Bitte wähle zuerst ein Thema aus!');
    }
});