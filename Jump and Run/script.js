const player = document.getElementById('player');
const obstacles = [
    document.getElementById('obstacle-1'),
    document.getElementById('obstacle-2')
];
const livesContainer = document.getElementById('lives-container');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score-display');
const jumpButton = document.getElementById('jump-button'); // Springen-Button
const duckButton = document.getElementById('duck-button'); // Ducken-Button

let isJumping = false;
let isDucking = false;
let lives = 3;
let score = 0;
const obstacleSpeed = 15; // Geschwindigkeit der Hindernisse
const obstacleSpacing = 800; // Abstand zwischen Hindernissen
const startOffset = 1500; // Startposition des ersten Hindernisses

// Spieler springen lassen
function jump() {
    if (isJumping || isDucking) return;
    isJumping = true;

    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                jumpHeight -= 10; // Langsameres Fallen
                player.style.bottom = `${jumpHeight + 50}px`;
            }, 20);
        }
        jumpHeight += 10; // Langsameres Springen
        player.style.bottom = `${jumpHeight + 50}px`;
    }, 20);
}

// Spieler ducken lassen
function duck() {
    if (isJumping || isDucking) return;
    isDucking = true;
    player.style.height = '25px'; // Spieler duckt sich

    setTimeout(() => {
        player.style.height = '50px'; // Zurück zur normalen Größe
        isDucking = false;
    }, 1000);
}

// Hindernisse bewegen
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obsLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left')) || 0;

        if (obsLeft <= -50) {
            // Hindernis zurücksetzen, wenn es den Bildschirm verlässt
            obstacle.style.left = `${startOffset + index * obstacleSpacing}px`;
            score++; // Punkte erhöhen, wenn ein Hindernis passiert wird
        } else {
            // Hindernis bewegen
            obstacle.style.left = `${obsLeft - obstacleSpeed}px`;
        }
    });
}

// Hindernis-Kollision prüfen
function checkCollision() {
    const playerRect = player.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            loseLife();
        }
    });
}

// Leben verlieren
function loseLife() {
    if (lives > 0) {
        lives--;
        livesContainer.removeChild(livesContainer.lastElementChild); // Entferne ein Herz
        if (lives === 0) {
            endGame();
        }
    }
}

// Spiel beenden
function endGame() {
    clearInterval(gameLoop);
    gameOverScreen.style.display = 'block';
    scoreDisplay.textContent = `Punkte: ${score}`;
}

// Spiel zurücksetzen
restartButton.addEventListener('click', () => {
    location.reload(); // Seite neu laden
});

// Steuerung für Tastaturspieler
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    } else if (e.code === 'ArrowDown') {
        duck();
    }
});

// Steuerung für Handynutzer
jumpButton.addEventListener('click', jump);
duckButton.addEventListener('click', duck);

// Spiel-Loop
const gameLoop = setInterval(() => {
    moveObstacles();
    checkCollision();
}, 20);

// Hindernisse initialisieren
function initializeObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.style.left = `${startOffset + index * obstacleSpacing}px`; // Startposition weiter rechts
    });
}

initializeObstacles();