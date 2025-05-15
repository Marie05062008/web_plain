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
let score = 0;
let lives = 3;
const maxJumpHeight = 150; // Maximale Sprunghöhe
const doubleJumpHeight = 250; // Maximale Höhe für Doppelsprung

// Spieler springen lassen
function jump() {
    if (isDucking) return; // Nicht springen, wenn der Spieler duckt

    if (isJumping && canDoubleJump) {
        // Doppelsprung
        canDoubleJump = false;
        performJump(doubleJumpHeight, true);
    } else if (!isJumping) {
        // Erster Sprung
        isJumping = true;
        canDoubleJump = true;
        performJump(maxJumpHeight, false);
    }
}

function performJump(height, isDoubleJump) {
    let jumpHeight = parseInt(player.style.bottom) || 50; // Aktuelle Position
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= height) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (jumpHeight <= 50) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                jumpHeight -= 10;
                player.style.bottom = `${jumpHeight}px`;
            }, 20);
        }
        jumpHeight += 10;
        player.style.bottom = `${jumpHeight}px`;
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

// Hindernisse synchronisieren
function synchronizeObstacles() {
    const obstacleSpeed = 3; // Geschwindigkeit in Sekunden
    obstacle.style.animationDuration = `${obstacleSpeed}s`;
    lowObstacle.style.animationDuration = `${obstacleSpeed}s`;
    largeObstacle.style.animationDuration = `${obstacleSpeed}s`;

    // Hindernisse mit Abstand starten
    obstacle.style.animationDelay = '0s';
    lowObstacle.style.animationDelay = '1.5s'; // Startet 1.5 Sekunden später
    largeObstacle.style.animationDelay = '3s'; // Startet 3 Sekunden später
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
}, 100);

// Hindernisse synchronisieren
synchronizeObstacles();