const gameBoard = document.querySelector('.game-board');
const themeButtons = document.querySelectorAll('.theme-selection button');

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
        'images/Tätigkeiten/lesen.jpg',
        'images/Tätigkeiten/schreiben.jpg',
        'images/Tätigkeiten/Kochen.jpg',
        'images/Tätigkeiten/fahren.jpg',
        'images/Tätigkeiten/springen.jpg',
        'images/Tätigkeiten/Tauchen.jpg',
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
        card.innerHTML = `<img src="${src}" alt="Memory Card" style="visibility: hidden;">`;
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