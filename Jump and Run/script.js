const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const lowObstacle = document.getElementById('low-obstacle');
const largeObstacle = document.getElementById('large-obstacle'); // Neues Hindernis
const scoreDisplay = document.getElementById('score');
const livesContainer = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const resetButton = document.getElementById('reset-button');
const jumpButton = document.getElementById('jump-button');
const duckButton = document.getElementById('duck-button');

let isJumping = false;
let isDucking = false;
let canDoubleJump = false; // Ermöglicht Doppelsprung
let currentJumpHeight = 0; // Aktuelle Sprunghöhe
let score = 0;
let lives = 3;
const maxJumpHeight = 150; // Maximale Sprunghöhe
const doubleJumpHeight = 250; // Maximale Höhe für Doppelsprung
const obstacleSpeed = 5; // Geschwindigkeit der Hindernisse (in Pixeln pro Frame)

// Spieler springen lassen
function jump() {
    if (isDucking) return; // Nicht springen, wenn der Spieler duckt

    if (isJumping && canDoubleJump) {
        // Doppelsprung
        canDoubleJump = false;
        performJump(doubleJumpHeight);
    } else if (!isJumping) {
        // Erster Sprung
        isJumping = true;
        canDoubleJump = true;
        performJump(maxJumpHeight);
    }
}

function performJump(targetHeight) {
    const startHeight = currentJumpHeight; // Aktuelle Sprunghöhe
    const jumpInterval = setInterval(() => {
        if (currentJumpHeight >= targetHeight) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (currentJumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                    currentJumpHeight = 0;
                }
                currentJumpHeight -= 10;
                player.style.bottom = `${currentJumpHeight}px`;
            }, 20);
        }
        currentJumpHeight += 10;
        player.style.bottom = `${currentJumpHeight}px`;
    }, 20);
}

// Spieler ducken lassen
function duck() {
    if (isJumping || isDucking) return; // Nicht ducken, wenn der Spieler springt
    isDucking = true;
    player.classList.add('ducking');

    setTimeout(() => {
        player.classList.remove('ducking');
        isDucking = false;
    }, 1000); // Ducken dauert 1 Sekunde
}

// Hindernis-Kollision prüfen
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const lowObstacleRect = lowObstacle.getBoundingClientRect();
    const largeObstacleRect = largeObstacle.getBoundingClientRect();

    if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
    ) {
        loseLife();
    }

    if (
        playerRect.right > lowObstacleRect.left &&
        playerRect.left < lowObstacleRect.right &&
        playerRect.bottom > lowObstacleRect.top &&
        playerRect.top < lowObstacleRect.bottom
    ) {
        loseLife();
    }

    if (
        playerRect.right > largeObstacleRect.left &&
        playerRect.left < largeObstacleRect.right &&
        playerRect.bottom > largeObstacleRect.top &&
        playerRect.top < largeObstacleRect.bottom
    ) {
        loseLife();
    }
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
    gameOverScreen.style.display = 'block';
    clearInterval(gameLoop);
}

// Punktzahl erhöhen
function increaseScore() {
    score++;
    scoreDisplay.textContent = `Punkte: ${score}`;
}

// Hindernisse bewegen
function moveObstacles() {
    const obstacles = [obstacle, lowObstacle, largeObstacle];
    obstacles.forEach((obs, index) => {
        let obsLeft = parseInt(window.getComputedStyle(obs).getPropertyValue('left')) || 0;

        if (obsLeft <= -50) {
            // Hindernis zurücksetzen, wenn es den Bildschirm verlässt
            obs.style.left = '100%';
        } else {
            // Hindernis bewegen
            obs.style.left = `${obsLeft - obstacleSpeed}px`;
        }
    });
}

// Hindernisse mit Abstand starten
function initializeObstacles() {
    const obstacles = [obstacle, lowObstacle, largeObstacle];
    obstacles.forEach((obs, index) => {
        obs.style.left = `${100 + index * 300}px`; // Abstand von 300px zwischen den Hindernissen
    });
}

// Spiel zurücksetzen
resetButton.addEventListener('click', () => {
    location.reload(); // Seite neu laden
});

// Steuerung für Handyspieler
jumpButton.addEventListener('click', jump);
duckButton.addEventListener('click', duck);

// Steuerung für Tastaturspieler
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    } else if (e.code === 'ArrowDown') {
        duck();
    }
});

// Kollision und Punktzahl prüfen
const gameLoop = setInterval(() => {
    checkCollision();
    increaseScore();
    moveObstacles();
}, 100);

// Hindernisse initialisieren
initializeObstacles();