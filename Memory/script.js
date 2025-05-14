const gameBoard = document.querySelector('.game-board');
const themeButtons = document.querySelectorAll('.theme-selection button');

// Themen mit KI-generierten Bildern
const themes = {
    automarken: [
        'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg', // BMW
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Audi_logo.svg', // Audi
        'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg', // Mercedes
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/Mazda_logo_with_emblem.svg', // Mazda
        'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.png', // Toyota
        'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg', // Ford
    ],
    tiere: [
        'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg', // Hund
        'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg', // Katze
        'https://upload.wikimedia.org/wikipedia/commons/3/3e/Asian_Elephant.jpg', // Elefant
        'https://upload.wikimedia.org/wikipedia/commons/f/fd/Bengal_Tiger.jpg', // Tiger
        'https://upload.wikimedia.org/wikipedia/commons/8/8c/Fox.jpg', // Fuchs
        'https://upload.wikimedia.org/wikipedia/commons/4/45/Owl.jpg', // Eule
    ],
    früchte: [
        'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg', // Apfel
        'https://upload.wikimedia.org/wikipedia/commons/4/44/Banana.jpg', // Banane
        'https://upload.wikimedia.org/wikipedia/commons/3/36/Kyoho-grape.jpg', // Traube
        'https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg', // Erdbeere
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg', // Ananas
        'https://upload.wikimedia.org/wikipedia/commons/d/d3/Kiwi_aka.jpg', // Kiwi
    ],
    motorräder: [
        'https://upload.wikimedia.org/wikipedia/commons/4/4d/Harley-Davidson_logo.svg', // Harley Davidson
        'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ducati_logo.svg', // Ducati
        'https://upload.wikimedia.org/wikipedia/commons/2/2d/Kawasaki_logo.svg', // Kawasaki
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Yamaha_logo.svg', // Yamaha
        'https://upload.wikimedia.org/wikipedia/commons/2/2e/Honda-logo.svg', // Honda
        'https://upload.wikimedia.org/wikipedia/commons/9/9e/Suzuki_logo.svg', // Suzuki
    ],
    tätigkeiten: [
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/Reading_a_book.jpg', // Lesen
        'https://upload.wikimedia.org/wikipedia/commons/3/3e/Writing_with_pen.jpg', // Schreiben
        'https://upload.wikimedia.org/wikipedia/commons/1/1e/Cooking.jpg', // Kochen
        'https://upload.wikimedia.org/wikipedia/commons/3/3b/Driving_a_car.jpg', // Fahren
        'https://upload.wikimedia.org/wikipedia/commons/5/5e/Jumping.jpg', // Springen
        'https://upload.wikimedia.org/wikipedia/commons/8/8e/Scuba_diving.jpg', // Tauchen
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
    gameBoard.innerHTML = '';
    const images = themes[theme];
    const cards = shuffle([...images, ...images]); // Paare erstellen
    cards.forEach(src => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.src = src;

        // Erstelle das <picture>-Element
        const picture = document.createElement('picture');

        // Füge das <img>-Element als Fallback hinzu
        const img = document.createElement('img');
        img.src = src; // Standardbild
        img.alt = 'Memory Card';
        img.style.visibility = 'hidden'; // Standardmäßig verstecken
        picture.appendChild(img);

        // Füge das <picture>-Element zur Karte hinzu
        card.appendChild(picture);

        // Füge die Karte zum Spielbrett hinzu
        gameBoard.appendChild(card);
    });
}

// Kartenlogik
let firstCard = null;
let secondCard = null;
let lockBoard = false;

gameBoard.addEventListener('click', event => {
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
}

// Thema auswählen
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        startGame(theme);
    });
});