const gameBoard = document.querySelector('.game-board');
const themeButtons = document.querySelectorAll('.theme-selection button');

// Themen mit KI-generierten Bildern
const themes = {
    automarken: [
        'https://de.wikipedia.org/wiki/Datei:BMW.svg', // BMW
        'https://upload.wikimedia.org/wikipedia/commons/4/4c/Mercedes-Benz_Logo.svg', // Mercedes
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Audi_logo.svg', // Audi
        'https://de.wikipedia.org/wiki/Datei:Mercedes-Stern_1992.JPG', // Mercedes Stern
        'https://de.wikipedia.org/wiki/Datei:Mazda_2024.svg', // Mazda
        'https://de.wikipedia.org/wiki/Datei:Toyota.svg', // Toyota
        'https://de.wikipedia.org/wiki/Datei:Ford_logo_flat.svg', // Ford
    ],
    tiere: [
        'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg', // Hund
        'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg', // Katze
        'https://upload.wikimedia.org/wikipedia/commons/3/3e/Elephant.jpg', // Elefant
        'https://upload.wikimedia.org/wikipedia/commons/5/5e/Tiger.jpg', // Tiger
        'https://upload.wikimedia.org/wikipedia/commons/8/8c/Fox.jpg', // Fuchs
        'https://upload.wikimedia.org/wikipedia/commons/4/45/Owl.jpg', // Eule
    ],
    früchte: [
        'https://de.wikipedia.org/wiki/Fresco_(Apfel)', // Apfel
        'https://de.wikipedia.org/wiki/Cavendish_(Banane)', // Banane
        'https://de.wikipedia.org/wiki/Weintraube', // Traube
        'https://de.wikipedia.org/wiki/Datei:Erdbeere.jpg', // Erdbeere
        'https://de.wikipedia.org/wiki/Datei:210704_ananas-comosus-dreiergruppe-marktware_1-640x480.jpg', // Ananas
        'https://de.wikipedia.org/wiki/Kiwifrucht', // Kiwi
    ],
    motorräder: [
        'https://de.wikipedia.org/wiki/Datei:2003_HD_XL1200C_Anniversary_Edition.jpg', // Harley Davidson
        'https://de.wikipedia.org/wiki/Datei:Ducati_Supersport_950_S.jpg', // Ducati
        'https://de.wikipedia.org/wiki/Datei:2007KawasakiNinjaZX6R-001.jpg', // Kawasaki
        'https://de.wikipedia.org/wiki/Yamaha_YZF-R_1', // Yamaha
        'https://de.wikipedia.org/wiki/Datei:Honda_CRF450R.jpg', // Honda
        'https://de.wikipedia.org/wiki/Suzuki_GSX-8R', // Suzuki
    ],
    tätigkeiten: [
        'https://de.wikipedia.org/wiki/Datei:Dokumente_in_S%C3%BCtterlinschrift_lesen_und_%C3%BCbersetzen_02.jpg', // Lesen
        'https://de.wikipedia.org/wiki/Manuelles_Schreiben', // Schreiben
        'https://de.wikipedia.org/wiki/Koch', // Kochen
        'https://de.wikipedia.org/wiki/Mick_Doohan', // Fahren
        'https://de.wikipedia.org/wiki/Springen', // Springen
        'https://de.wikipedia.org/wiki/Tauchen', // Tauchen
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