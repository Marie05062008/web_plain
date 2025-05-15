const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const lowObstacle = document.getElementById('low-obstacle');
const scoreDisplay = document.getElementById('score');
const livesContainer = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const resetButton = document.getElementById('reset-button');
const jumpButton = document.getElementById('jump-button');
const duckButton = document.getElementById('duck-button');

let isJumping = false;
let isDucking = false;
let score = 0;
let lives = 3;
const maxJumpHeight = 150; // Maximale Sprunghöhe

// Spieler springen lassen
function jump() {
    if (isJumping || isDucking) return; // Nicht springen, wenn der Spieler duckt
    isJumping = true;

    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= maxJumpHeight) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                jumpHeight -= 10;
                player.style.bottom = `${jumpHeight + 50}px`;
            }, 20);
        }
        jumpHeight += 10;
        player.style.bottom = `${jumpHeight + 50}px`;
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
    lowObstacle.style.animationDuration = `${obstacleSpeed + 1}s`; // Etwas langsamer
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