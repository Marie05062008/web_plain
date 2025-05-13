const gameBoard = document.querySelector('.game-board');
const themeButtons = document.querySelectorAll('.theme-selection button');

// Themen mit KI-generierten Bildern
const themes = {
    automarken: [
        'https://www.bing.com/images/search?view=detailV2&ccid=%2bHNTvpGg&id=23950D114E6446EA1C755E3E16835ADAD115B4C0&thid=OIP.-HNTvpGg3LGiHJLcSY4YVgHaGB&mediaurl=https%3a%2f%2fstatic.vecteezy.com%2fsystem%2fresources%2fpreviews%2f020%2f502%2f870%2foriginal%2fbmw-brand-logo-car-symbol-blue-and-white-design-germany-automobile-illustration-with-black-background-free-vector.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.f87353be91a0dcb1a21c92dc498e1856%3frik%3dwLQV0dpagxY%252bXg%26pid%3dImgRaw%26r%3d0&exph=1561&expw=1920&q=BMW+Marke&simid=608030120214295413&FORM=IRPRST&ck=C7828A303993B9C841EAEC1E458CF4CE&selectedIndex=0&itb=0',
        'https://via.placeholder.com/100?text=Audi',
        'https://via.placeholder.com/100?text=Mercedes',
        'https://via.placeholder.com/100?text=Tesla',
        'https://via.placeholder.com/100?text=Toyota',
        'https://via.placeholder.com/100?text=Ford',
    ],
    tiere: [
        'https://via.placeholder.com/100?text=Hund',
        'https://via.placeholder.com/100?text=Katze',
        'https://via.placeholder.com/100?text=Elefant',
        'https://via.placeholder.com/100?text=Tiger',
        'https://via.placeholder.com/100?text=Fuchs',
        'https://via.placeholder.com/100?text=Eule',
    ],
    früchte: [
        'https://via.placeholder.com/100?text=Apfel',
        'https://via.placeholder.com/100?text=Banane',
        'https://via.placeholder.com/100?text=Traube',
        'https://via.placeholder.com/100?text=Erdbeere',
        'https://via.placeholder.com/100?text=Ananas',
        'https://via.placeholder.com/100?text=Kiwi',
    ],
    motorräder: [
        'https://via.placeholder.com/100?text=Harley',
        'https://via.placeholder.com/100?text=Ducati',
        'https://via.placeholder.com/100?text=Kawasaki',
        'https://via.placeholder.com/100?text=Yamaha',
        'https://via.placeholder.com/100?text=Honda',
        'https://via.placeholder.com/100?text=Suzuki',
    ],
    tätigkeiten: [
        'https://via.placeholder.com/100?text=Lesen',
        'https://via.placeholder.com/100?text=Schreiben',
        'https://via.placeholder.com/100?text=Kochen',
        'https://via.placeholder.com/100?text=Fahren',
        'https://via.placeholder.com/100?text=Springen',
        'https://via.placeholder.com/100?text=Tauchen',
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