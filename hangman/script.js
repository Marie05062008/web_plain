const words = [
    // Tiere
    "ELEFANT", "KATZE", "HUND", "PFERD", "SCHILDKRÖTE", "LÖWE", "TIGER", "PANDA", "KÄNGURU", "DELFIN",
    "GIRAFFE", "NASHORN", "ZEBRA", "AFFE", "FUCHS", "WOLF", "BÄR", "EULE", "SCHWAN", "PAPAGEI",
    "KROKODIL", "SCHWEIN", "KUH", "SCHAF", "ZIEGE", "HASE", "MAUS", "RATTE", "FISCH", "WAL",
    // Dinge
    "COMPUTER", "HANDY", "TISCH", "STUHL", "LAMPE", "FENSTER", "TÜR", "AUTO", "FLUGZEUG", "SCHLÜSSEL",
    "FERNSEHER", "KAMERA", "RADIO", "UHR", "SPIEGEL", "BETT", "SOFA", "SCHRANK", "BUCH", "ZEITSCHRIFT",
    "STIFT", "PAPIER", "TASCHE", "KOPFHÖRER", "LADEGERÄT", "KÜHLSCHRANK", "HERD", "BACKOFEN", "VENTILATOR", "DRUCKER",
    // Berufe
    "PROGRAMMIERER", "LEHRER", "ARZT", "MECHANIKER", "ARCHITEKT", "PILOT", "BAUER", "FRISEUR", "JOURNALIST", "KOCH",
    "POLIZIST", "FEUERWEHRMANN", "ANWALT", "RICHTER", "KRANKENSCHWESTER", "ZAHNARZT", "MALER", "MUSIKER", "SÄNGER", "TÄNZER",
    "SCHREINER", "ELEKTRIKER", "INSTALLATEUR", "INGENIEUR", "WISSENSCHAFTLER", "FORSCHER", "SOFTWAREENTWICKLER", "DESIGNER", "FOTOGRAF", "VERKÄUFER",
    // Tätigkeiten
    "SCHREIBEN", "LESEN", "MALEN", "KOCHEN", "FAHREN", "SPRINGEN", "TAUCHEN", "LERNEN", "SINGEN", "TANZEN",
    "LAUFEN", "SCHWIMMEN", "RADFAHREN", "KLETTERN", "SPIELEN", "ARBEITEN", "SCHLAFEN", "ESSEN", "TRINKEN", "ZEICHNEN",
    "BASTELN", "BAUEN", "PROGRAMMIEREN", "REISEN", "FOTOGRAFIEREN", "FILMEN", "PUTZEN", "GÄRTNERN", "ANGELN", "JAGEN",
    // Fächer
    "MATHEMATIK", "BIOLOGIE", "CHEMIE", "PHYSIK", "GESCHICHTE", "ERDKUNDE", "SPORT", "MUSIK", "KUNST", "INFORMATIK",
    "DEUTSCH", "ENGLISCH", "FRANZÖSISCH", "SPANISCH", "ITALIENISCH", "LATEIN", "PHILOSOPHIE", "SOZIALKUNDE", "POLITIK", "RELIGION",
    "ETHIK", "ASTRONOMIE", "PSYCHOLOGIE", "WIRTSCHAFT", "TECHNIK", "MECHANIK", "ELEKTROTECHNIK", "MEDIZIN", "ÖKOLOGIE", "ARCHITEKTUR"
];

let selectedWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let wrongGuesses = 0;

const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");
const wordDisplay = document.getElementById("word-display");
const letterButtons = document.getElementById("letter-buttons");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart-button");
const backgroundSmiley = document.getElementById("background-smiley");

function drawHangman() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#333";
    if (wrongGuesses === 1) ctx.strokeRect(50, 350, 200, 10);
    if (wrongGuesses === 2) ctx.strokeRect(100, 50, 10, 300);
    if (wrongGuesses === 3) ctx.strokeRect(100, 50, 100, 10);
    if (wrongGuesses === 4) ctx.strokeRect(190, 50, 10, 50);
    if (wrongGuesses === 5) ctx.beginPath(), ctx.arc(195, 120, 20, 0, Math.PI * 2), ctx.stroke();
    if (wrongGuesses === 6) ctx.moveTo(195, 140), ctx.lineTo(195, 220), ctx.stroke();
    if (wrongGuesses === 7) ctx.moveTo(195, 160), ctx.lineTo(170, 200), ctx.stroke();
    if (wrongGuesses === 8) ctx.moveTo(195, 160), ctx.lineTo(220, 200), ctx.stroke();
    if (wrongGuesses === 9) ctx.moveTo(195, 220), ctx.lineTo(170, 270), ctx.stroke();
    if (wrongGuesses === 10) ctx.moveTo(195, 220), ctx.lineTo(220, 270), ctx.stroke();
}

function updateWordDisplay() {
    const display = selectedWord.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
    wordDisplay.textContent = display;
    if (!display.includes("_")) {
        message.textContent = "Glückwunsch! Du hast gewonnen!";
        letterButtons.innerHTML = "";
        restartButton.style.display = "block";
        showSmiley("happy");
    }
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter) || wrongGuesses >= 10) return;
    guessedLetters.push(letter);
    if (selectedWord.includes(letter)) {
        updateWordDisplay();
    } else {
        wrongGuesses++;
        drawHangman();
        if (wrongGuesses >= 10) {
            message.textContent = `Verloren! Das Wort war: ${selectedWord}`;
            letterButtons.innerHTML = "";
            restartButton.style.display = "block";
            showSmiley("sad");
        }
    }
}

function showSmiley(type) {
    backgroundSmiley.textContent = type === "happy" ? "😊" : "😢";
    backgroundSmiley.className = type;
    backgroundSmiley.style.opacity = 1;

    // Smiley nach 2 Sekunden ausblenden
    setTimeout(() => {
        backgroundSmiley.style.opacity = 0;
    }, 2000);
}

function setupGame() {
    guessedLetters = [];
    wrongGuesses = 0;
    selectedWord = words[Math.floor(Math.random() * words.length)];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateWordDisplay();
    message.textContent = "";
    restartButton.style.display = "none";
    backgroundSmiley.style.opacity = 0;
    letterButtons.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("").forEach(letter => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.onclick = () => handleGuess(letter);
        letterButtons.appendChild(button);
    });
}

restartButton.onclick = setupGame;
setupGame();